import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import { searchRequestSchema } from "@/lib/api-schemas";
import { loadSearchApiRuntime } from "@/lib/server/lazy-runtime";

// Cloudflare Workers: read env bindings from .dev.vars / dashboard secrets
let cfEnv: Record<string, string | undefined> = {};
try {
	const cf = await import("cloudflare:workers");
	if (cf.env) cfEnv = cf.env as Record<string, string | undefined>;
} catch {
	// Not running inside workerd – ignore
}

/** Read an env var from any available source.
 *  Priority: cloudflare worker bindings (.dev.vars) > process.env > import.meta.env */
function _getEnvVar(name: string): string | undefined {
	return (
		cfEnv[name] ||
		(typeof process !== "undefined" ? process.env?.[name] : undefined) ||
		(import.meta as any).env?.[name] ||
		undefined
	);
}

interface SearchResult {
	id: string;
	title: string;
	snippet: string;
	url: string;
	source: "web" | "firecrawl" | "brave" | "academic" | "news";
	addScore: number;
	publishedDate?: string;
}

export const Route = createFileRoute("/api/search")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				// CSRF Protection: POST method requires CSRF token validation
				const validation = validateCsrfRequest(request);
				if (!validation.valid) {
					console.warn(
						"[CSRF] Validation failed for /api/search:",
						validation.error,
					);
					return createCsrfErrorResponse(validation.error!);
				}

				try {
					const rawBody = await request.json();
					const parsed = searchRequestSchema.safeParse(rawBody);
					if (!parsed.success) {
						return new Response(
							JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const {
						query,
						useParallelModels = true,
						useInterleavedReasoning = true,
						useSegmentation = false,
						modelConfig: clientModelConfig,
						modelConfigs: clientModelConfigs,
						searchApiKeys,
					} = parsed.data;
					const {
						buildModelConfigFromClient,
						researchStorage,
						getAvailableProviders,
						unifiedSearchOrchestrator,
					} = await loadSearchApiRuntime();

					// Build model config from client-provided data, or fall back to server-side
					let modelConfig: Awaited<
						ReturnType<typeof buildModelConfigFromClient>
					> | null = null;
					if (clientModelConfig?.provider && clientModelConfig.model) {
							modelConfig = buildModelConfigFromClient({
								...clientModelConfig,
								baseUrl: clientModelConfig.baseUrl || "",
								protocol:
									clientModelConfig.protocol || clientModelConfig.provider,
							});
						console.log(
							`[SearchAPI] Using client model: ${clientModelConfig.provider}:${clientModelConfig.model}`,
						);
					} else if (
						Array.isArray(clientModelConfigs) &&
						clientModelConfigs.length > 0
					) {
						const firstModel = clientModelConfigs.find(
							(config: any) => config?.provider && config?.model,
						);
						if (firstModel) {
								modelConfig = buildModelConfigFromClient({
									...firstModel,
									baseUrl: firstModel.baseUrl || "",
									protocol: firstModel.protocol || firstModel.provider,
								});
							console.log(
								`[SearchAPI] Using first client model from multi-select: ${firstModel.provider}:${firstModel.model}`,
							);
						}
					} else {
						console.log(
							"[SearchAPI] No client model config — web search + ADD scoring only",
						);
					}

					if (!modelConfig) {
						console.log(
							"[SearchAPI] No model configured, continuing with web-only search",
						);
					}

					// BYOK only — paid provider keys come from the user, never from server env vars
const mergedSearchApiKeys: { firecrawl?: string; tavily?: string; exa?: string; brave?: string } = {
							firecrawl: (searchApiKeys?.firecrawl as string) || undefined,
							tavily: (searchApiKeys?.tavily as string) || undefined,
							exa: (searchApiKeys?.exa as string) || undefined,
							brave: (searchApiKeys?.brave as string) || undefined,
					};

					const parallelModelConfigs = (clientModelConfigs || [])
						.filter((config: any) => config?.provider && config.model)
						.map((config: any) => buildModelConfigFromClient(config));
					const hasMultipleModels = parallelModelConfigs.length > 1;
					const availableProviders = getAvailableProviders(mergedSearchApiKeys);

					// Execute unified search with all advanced features
					console.log(
						`[UnifiedSearch] Starting search for: "${query}" using ${modelConfig?.provider ?? "web-only"}:${modelConfig?.model ?? "none"}`,
					);
					console.log(
						`[UnifiedSearch] Options: parallel=${useParallelModels}, reasoning=${useInterleavedReasoning}, segmentation=${useSegmentation}`,
					);
					console.log(
						`[UnifiedSearch] Search providers available: ${availableProviders.join(", ") || "none (env/cache fallback only)"}`,
					);

					const searchResult = await unifiedSearchOrchestrator.search(
						query,
						modelConfig,
						{
							useParallelModels: useParallelModels && hasMultipleModels,
							useInterleavedReasoning,
							useSegmentation,
							enableValidation: true,
							parallelModelConfigs: hasMultipleModels
								? parallelModelConfigs
								: [],
							apiKeys: mergedSearchApiKeys || {},
						},
					);

					console.log(
						`[UnifiedSearch] Completed search with ${searchResult.results.length} results`,
					);
					console.log(
						`[UnifiedSearch] Quality: ${searchResult.addMetrics.overallScore.toFixed(2)}, Tokens: ${searchResult.totalTokens}`,
					);
					const usedFallbackCache = searchResult.reasoning.some((step) =>
						step.toLowerCase().includes("cached result"),
					);

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
						console.log(
							`[ResearchStorage] Stored search with ID: ${storageResult.id}`,
						);
					}
					return new Response(
						JSON.stringify({
							query,
							...searchResult,
							totalResults: searchResult.results.length,
							storageId,
							availableProviders,
							usedFallbackCache,
						}),
						{
							status: 200,
							headers: { "Content-Type": "application/json" },
						},
					);
				} catch (error) {
					console.error("Search API error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to process search request" }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
