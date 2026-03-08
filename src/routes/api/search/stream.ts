/**
 * Streaming Search API
 * Handles search with real-time progress updates via SSE
 */

import { createFileRoute } from "@tanstack/react-router";
import { validateCsrfRequest, createCsrfErrorResponse } from "@/lib/csrf-protection";
import { ModelConfigManager, buildModelConfigFromClient } from "@/lib/model-config";
import { getAvailableProviders } from "@/lib/search-providers";
import { unifiedSearchOrchestrator } from "@/lib/unified-search-orchestrator";
import { researchStorage } from "@/lib/results-storage";
import type { SearchScope } from "@/components/SearchProgressPanel";
import type { SearchProgressStep } from "@/components/SearchProgressPanel";
import { getSearchScope } from "./control";

// ---------------------------------------------------------------------------
// LOCAL EVENT DELIVERY — direct to the streaming response
// Events are pushed directly onto the SSE response stream for the SAME request.
// This avoids the cross-isolate state problem where workerd/Vite evaluates
// progress.ts (GET) and stream.ts (POST) in separate module contexts.
// ---------------------------------------------------------------------------
const eventPushers = new Map<string, (data: any) => void>();
const searchFlags = new Map<string, { paused: boolean; stopped: boolean }>();

function sendStepUpdate(searchId: string, step: SearchProgressStep) {
	const push = eventPushers.get(searchId);
	if (push) push({ type: "step", step });
}

function sendResults(searchId: string, results: any[], summary?: any) {
	const push = eventPushers.get(searchId);
	if (push) push({ type: "results", results, summary });
}

function sendError(searchId: string, message: string) {
	const push = eventPushers.get(searchId);
	if (push) push({ type: "error", message });
}

function isSearchPaused(searchId: string): boolean {
	return searchFlags.get(searchId)?.paused ?? false;
}

function isSearchStopped(searchId: string): boolean {
	return searchFlags.get(searchId)?.stopped ?? false;
}

// Cloudflare Workers: waitUntil keeps background promises alive after the
// response is sent.  Falls back to a no-op for non-CF environments.
// Also grab `env` so we can read .dev.vars / dashboard secret keys.
let cfWaitUntil: ((p: Promise<unknown>) => void) | undefined;
let cfEnv: Record<string, string | undefined> = {};
try {
	// Dynamic import so this still builds outside of workerd
	const cf = await import("cloudflare:workers");
	cfWaitUntil = cf.waitUntil;
	cfEnv = (cf as any).env ?? {};
} catch {
	// Not running inside workerd – ignore
}

/** Merge client-sent API keys with server-side env keys (client wins). */
function mergeSearchApiKeys(clientKeys?: {
	firecrawl?: string; tavily?: string; exa?: string; brave?: string;
}): { firecrawl?: string; tavily?: string; exa?: string; brave?: string } {
	return {
		firecrawl: clientKeys?.firecrawl || cfEnv.FIRECRAWL_API_KEY,
		tavily:    clientKeys?.tavily    || cfEnv.TAVILY_API_KEY,
		exa:       clientKeys?.exa       || cfEnv.EXA_SEARCH_API_KEY,
		brave:     clientKeys?.brave     || cfEnv.BRAVE_SEARCH_API_KEY,
	};
}

export const Route = createFileRoute("/api/search/stream")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				// CSRF Protection
				const validation = validateCsrfRequest(request);
				if (!validation.valid) {
					console.warn("[CSRF] Validation failed for /api/search/stream:", validation.error);
					return createCsrfErrorResponse(validation.error!);
				}

                try {
                    const { query, scope, searchId, modelConfig: clientModelConfig, modelConfigs: clientModelConfigs, searchApiKeys } = await request.json();

					if (!query || !searchId) {
						return new Response(
							JSON.stringify({ error: "query and searchId are required" }),
							{ status: 400, headers: { "Content-Type": "application/json" } }
						);
					}

					// Merge client-sent API keys with server env keys (.dev.vars / dashboard)
					const resolvedApiKeys = mergeSearchApiKeys(searchApiKeys);

					// Create a streaming SSE response.
					// The search runs in the same isolate and pushes events directly
					// to the stream controller — no cross-request shared state needed.
					const encoder = new TextEncoder();
					let streamController!: ReadableStreamDefaultController;
					let aborted = false;

					const stream = new ReadableStream({
						start(c) {
							streamController = c;
						},
						cancel() {
							aborted = true;
							searchFlags.set(searchId, { paused: false, stopped: true });
						},
					});

					// Register the event pusher for this searchId
					const pushEvent = (data: any) => {
						if (aborted) return;
						try {
							streamController.enqueue(
								encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
							);
						} catch {
							aborted = true;
						}
					};
					eventPushers.set(searchId, pushEvent);
					searchFlags.set(searchId, { paused: false, stopped: false });

					// Send initial connected event
					pushEvent({ type: "connected", searchId });

					// Start search — pushes events via the local sendStepUpdate /
					// sendResults / sendError which use eventPushers map.
					const searchPromise = executeSearchWithProgress(
						query, scope, searchId,
						clientModelConfig, clientModelConfigs, resolvedApiKeys,
					).then(() => {
						eventPushers.delete(searchId);
						searchFlags.delete(searchId);
						try { streamController.close(); } catch {}
					}).catch((error) => {
						console.error("Background search error:", error);
						pushEvent({ type: "error", message: error?.message ?? "Search failed" });
						eventPushers.delete(searchId);
						searchFlags.delete(searchId);
						try { streamController.close(); } catch {}
					});

					// Keep the search promise alive after handler returns
					if (cfWaitUntil) {
						cfWaitUntil(searchPromise);
					}

					// Restrict CORS to requesting origin — never use "*" with user-specific data
					const requestOrigin = request.headers.get("Origin") || "";
					const sseHeaders: Record<string, string> = {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache",
						"Connection": "keep-alive",
					};
					if (requestOrigin) {
						sseHeaders["Access-Control-Allow-Origin"] = requestOrigin;
						sseHeaders["Vary"] = "Origin";
					}

					return new Response(stream, { headers: sseHeaders });
				} catch (error) {
					console.error("Stream search API error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to start search" }),
						{ status: 500, headers: { "Content-Type": "application/json" } }
					);
				}
			},
		},
	},
});

/**
 * Execute search with real-time progress updates
 */
async function executeSearchWithProgress(
    query: string,
    initialScope: SearchScope,
    searchId: string,
    clientModelConfig?: { provider: string; model: string; baseUrl: string; apiKey?: string; protocol: string },
    clientModelConfigs?: Array<{ provider: string; model: string; baseUrl: string; apiKey?: string; protocol: string; role?: string }>,
    searchApiKeys?: { firecrawl?: string; tavily?: string; exa?: string; brave?: string },
) {
	try {
		console.log(`[StreamSearch] Starting search for searchId=${searchId}, query="${query}"`);

		// Send initial step
		sendStepUpdate(searchId, {
			id: `${searchId}-init`,
			type: "segmentation",
			status: "in-progress",
			title: "Initializing Agentic Search",
			description: "Setting up search strategy and analyzing query",
			timestamp: Date.now(),
		});

		// Check for pause/stop
		if (isSearchStopped(searchId)) {
			return;
		}

		// Build model config from client-provided data
		// Only use a model if the client explicitly sent one — never fall back to a
		// default Ollama config because it would try to reach localhost:11434 which
		// may not be running and hangs the search.
		let modelConfig = null;
		if (clientModelConfig && clientModelConfig.provider && clientModelConfig.model) {
			modelConfig = buildModelConfigFromClient(clientModelConfig);
			console.log(`[StreamSearch] Using client-provided model: ${clientModelConfig.provider}:${clientModelConfig.model}`);
		} else {
			console.log("[StreamSearch] No client model config — running web search + ADD scoring only (no model calls)");
		}

		const availableProviders = getAvailableProviders(searchApiKeys);
		const keyStatus = {
			tavily: !!searchApiKeys?.tavily,
			exa: !!searchApiKeys?.exa,
			firecrawl: !!searchApiKeys?.firecrawl,
			brave: !!searchApiKeys?.brave,
		};
		console.log(`[StreamSearch] Search API keys received:`, keyStatus);
		console.log(`[StreamSearch] Available providers: ${availableProviders.join(', ') || 'NONE'}`);

		if (availableProviders.length === 0) {
			sendStepUpdate(searchId, {
				id: `${searchId}-fallback`,
				type: "source",
				status: "in-progress",
				title: "Using Search Fallbacks",
				description: "No client-side search key detected. Trying server env keys and cached prior results.",
				timestamp: Date.now(),
			});
		}

		// Send segmentation step
		sendStepUpdate(searchId, {
			id: `${searchId}-segment`,
			type: "segmentation",
			status: "in-progress",
			title: "Segmenting Query",
			description: "Breaking down query into optimal sub-queries",
			timestamp: Date.now(),
		});

		// Wait if paused
		await waitWhilePaused(searchId);
		if (isSearchStopped(searchId)) return;

		// Get current scope (may have been updated)
		const currentScope = getSearchScope(searchId) || initialScope;

		// Send source search progress — actual search happens in unified orchestrator below.
		// This just shows UI progress indicators for each enabled source.
		const enabledSources = Object.entries(currentScope.sources)
			.filter(([_, enabled]) => enabled)
			.map(([source, _]) => source);

		for (const source of enabledSources) {
			await waitWhilePaused(searchId);
			if (isSearchStopped(searchId)) return;

			const stepId = `${searchId}-${source}`;
			sendStepUpdate(searchId, {
				id: stepId,
				type: "source",
				status: "in-progress",
				title: `Searching ${source}`,
				description: `Querying ${source} for relevant documents`,
				timestamp: Date.now(),
				metadata: { source },
			});
		}

		// Execute unified search
		const updatedScope = getSearchScope(searchId) || currentScope;

		sendStepUpdate(searchId, {
			id: `${searchId}-reasoning`,
			type: "reasoning",
			status: "in-progress",
			title: "Applying Advanced Reasoning",
			description: "Analyzing and correlating search results",
			timestamp: Date.now(),
		});

		await waitWhilePaused(searchId);
		if (isSearchStopped(searchId)) return;

        // Build parallel model configs from the client-provided array
        const parallelModelConfigs = (clientModelConfigs || [])
            .filter((c: any) => c && c.provider && c.model)
            .map((c: any) => buildModelConfigFromClient(c));

        // Enable parallel execution when multiple models are active
        const hasMultipleModels = parallelModelConfigs.length > 1;

        if (hasMultipleModels) {
            console.log(`[StreamSearch] Parallel execution enabled with ${parallelModelConfigs.length} models`);
            sendStepUpdate(searchId, {
                id: `${searchId}-parallel`,
                type: "reasoning",
                status: "in-progress",
                title: "Parallel Model Execution",
                description: `Running ${parallelModelConfigs.length} models in parallel for consensus`,
                timestamp: Date.now(),
                metadata: {
                    modelCount: parallelModelConfigs.length,
                    models: parallelModelConfigs.map((c: any) => `${c.provider}:${c.model}`),
                },
            });
        }

        const searchResult = await unifiedSearchOrchestrator.search(query, modelConfig, {
            useParallelModels: hasMultipleModels,
            useInterleavedReasoning: updatedScope.useReasoning,
            useSegmentation: updatedScope.useSegmentation,
            enableValidation: true,
            parallelModelConfigs: hasMultipleModels ? parallelModelConfigs : [],
            apiKeys: searchApiKeys,
        });
        const usedFallbackCache = searchResult.reasoning.some((step) =>
            step.toLowerCase().includes("cached result")
        );

        if (availableProviders.length === 0) {
            sendStepUpdate(searchId, {
                id: `${searchId}-fallback`,
                type: "source",
                status: "completed",
                title: usedFallbackCache ? "Used Cached Research Memory" : "Checked Search Fallbacks",
                description: usedFallbackCache
                    ? `Recovered ${searchResult.results.length} cached result(s) from prior successful searches`
                    : "No cached results were available from prior successful searches",
                timestamp: Date.now(),
                metadata: {
                    usedFallbackCache,
                    resultsFound: searchResult.results.length,
                },
            });
        }

        if (searchResult.results.length === 0 && availableProviders.length === 0) {
            sendError(
                searchId,
                "No live search providers or cached research results are available yet. Add a Tavily, Exa, Firecrawl, or Brave key, or run one successful search to seed the cache.",
            );
            return;
        }

        // Mark source steps as completed with real result counts
        for (const source of enabledSources) {
            const stepId = `${searchId}-${source}`;
            const sourceResults = searchResult.results.filter(
                (r: any) => r.provider === source || r.source === source
            );
            sendStepUpdate(searchId, {
                id: stepId,
                type: "source",
                status: "completed",
                title: `Searched ${source}`,
                description: `Found ${sourceResults.length} results from ${source}`,
                timestamp: Date.now(),
                metadata: {
                    source,
                    documentsFound: sourceResults.length,
                    confidence: searchResult.addMetrics.overallScore,
                },
            });
        }

        if (hasMultipleModels) {
            sendStepUpdate(searchId, {
                id: `${searchId}-parallel`,
                type: "reasoning",
                status: "completed",
                title: "Parallel Model Execution",
                description: `${parallelModelConfigs.length} models completed${searchResult.parallelResults ? ` — agreement: ${(searchResult.parallelResults.agreementScore * 100).toFixed(0)}%` : ''}`,
                timestamp: Date.now(),
                metadata: {
                    modelCount: parallelModelConfigs.length,
                    confidence: searchResult.parallelResults?.overallConfidence,
                },
            });
        }

		await waitWhilePaused(searchId);
		if (isSearchStopped(searchId)) return;

		// Send synthesis step
		sendStepUpdate(searchId, {
			id: `${searchId}-synthesis`,
			type: "synthesis",
			status: "in-progress",
			title: "Synthesizing Results",
			description: "Combining and ranking all findings",
			timestamp: Date.now(),
		});

		await waitWhilePaused(searchId);
		if (isSearchStopped(searchId)) return;

		sendStepUpdate(searchId, {
			id: `${searchId}-synthesis`,
			type: "synthesis",
			status: "completed",
			title: "Synthesis Complete",
			description: `Found ${searchResult.results.length} high-quality results`,
			timestamp: Date.now(),
			metadata: {
				tokensUsed: searchResult.totalTokens,
				confidence: searchResult.addMetrics.overallScore,
			},
		});

		// Send validation step
		sendStepUpdate(searchId, {
			id: `${searchId}-validation`,
			type: "validation",
			status: "completed",
			title: "Quality Validation",
			description: `Quality score: ${(searchResult.addMetrics.overallScore * 100).toFixed(1)}%`,
			timestamp: Date.now(),
			metadata: {
				confidence: searchResult.addMetrics.overallScore,
			},
		});

		let storageId: string | undefined;
		if (searchResult.results.length > 0) {
			const storageResult = await researchStorage.storeResults(
				query,
				searchResult.results,
				`${modelConfig?.provider ?? "web-only"}:${modelConfig?.model ?? "none"}`,
				{
					addScore: searchResult.addMetrics.overallScore,
					tokensUsed: searchResult.totalTokens,
					executionTimeMs: searchResult.totalProcessingTime,
				},
			);
			storageId = storageResult.id;
		}

		// Send final results
		sendResults(searchId, searchResult.results, {
			query,
			modelUsed: searchResult.modelUsed,
			provider: searchResult.provider,
			totalTokens: searchResult.totalTokens,
			totalProcessingTime: searchResult.totalProcessingTime,
			addMetrics: searchResult.addMetrics,
			parallelResults: searchResult.parallelResults,
			reasoningSteps: searchResult.reasoningSteps,
			availableProviders,
			usedFallbackCache,
			storageId,
		});
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : "Search failed";
		const errStack = error instanceof Error ? error.stack : String(error);
		console.error(`[StreamSearch] Search execution error for searchId=${searchId}:`, errMsg);
		console.error(`[StreamSearch] Stack:`, errStack);
		sendError(searchId, errMsg);
	}
}

/**
 * Wait while search is paused
 */
async function waitWhilePaused(searchId: string): Promise<void> {
	while (isSearchPaused(searchId)) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		if (isSearchStopped(searchId)) {
			break;
		}
	}
}
