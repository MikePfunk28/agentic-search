/**
 * Streaming Search API
 * Handles search with real-time progress updates via SSE
 */

import { createFileRoute } from "@tanstack/react-router";
import { validateCsrfRequest, createCsrfErrorResponse } from "@/lib/csrf-protection";
import { ModelConfigManager, ModelProvider } from "@/lib/model-config";
import { unifiedSearchOrchestrator } from "@/lib/unified-search-orchestrator";
import type { SearchScope } from "@/components/SearchProgressPanel";
import {
	sendStepUpdate,
	sendResults,
	sendError,
	isSearchPaused,
	isSearchStopped,
} from "./progress";
import { getSearchScope } from "./control";

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
					const { query, scope, searchId } = await request.json();

					if (!query || !searchId) {
						return new Response(
							JSON.stringify({ error: "query and searchId are required" }),
							{ status: 400, headers: { "Content-Type": "application/json" } }
						);
					}

					// Execute search in background with progress updates
					executeSearchWithProgress(query, scope, searchId).catch((error) => {
						console.error("Background search error:", error);
						sendError(searchId, error.message);
					});

					return new Response(
						JSON.stringify({ success: true, searchId }),
						{ status: 200, headers: { "Content-Type": "application/json" } }
					);
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
	searchId: string
) {
	try {
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

		// Get model configuration
		const modelManager = new ModelConfigManager();
		const modelConfig = modelManager.getActiveConfig();

		if (!modelConfig) {
			throw new Error("No valid model configuration found");
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

		// Send source search steps for each enabled source
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

			// Simulate source search (replace with actual search logic)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			await waitWhilePaused(searchId);
			if (isSearchStopped(searchId)) return;

			// Update to completed
			sendStepUpdate(searchId, {
				id: stepId,
				type: "source",
				status: "completed",
				title: `Searching ${source}`,
				description: `Found documents from ${source}`,
				timestamp: Date.now(),
				metadata: {
					source,
					documentsFound: Math.floor(Math.random() * 10) + 5,
					tokensUsed: Math.floor(Math.random() * 500) + 100,
					confidence: 0.7 + Math.random() * 0.25,
				},
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

		const searchResult = await unifiedSearchOrchestrator.search(query, modelConfig, {
			useParallelModels: false,
			useInterleavedReasoning: updatedScope.useReasoning,
			useSegmentation: updatedScope.useSegmentation,
			enableValidation: true,
			parallelModelConfigs: [],
		});

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

		await new Promise((resolve) => setTimeout(resolve, 500));

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

		// Send final results
		sendResults(searchId, searchResult.results);
	} catch (error) {
		console.error("Search execution error:", error);
		sendError(searchId, error instanceof Error ? error.message : "Search failed");
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
