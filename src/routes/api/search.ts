import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import { ModelConfigManager, ModelProvider } from "@/lib/model-config";
import { unifiedSearchOrchestrator } from "@/lib/unified-search-orchestrator";

interface SearchResult {
	id: string;
	title: string;
	snippet: string;
	url: string;
	source: "firecrawl" | "autumn" | "academic" | "news";
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
					const { query, modelProvider = "ollama", useParallelModels = true, useInterleavedReasoning = true, useSegmentation = false } = await request.json();

					if (!query || typeof query !== "string") {
						return new Response(
							JSON.stringify({ error: "Query parameter is required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Get model configuration
					const modelManager = new ModelConfigManager();
					let modelConfig = modelManager.getConfig(modelProvider as ModelProvider) || modelManager.getActiveConfig();

					if (!modelConfig) {
						return new Response(
							JSON.stringify({ error: "No valid model configuration found. Please configure a model in Settings." }),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Load API key from localStorage if not in env (for cloud providers)
					if (!modelConfig.apiKey && modelConfig.provider !== ModelProvider.OLLAMA && modelConfig.provider !== ModelProvider.LM_STUDIO) {
						// Import model storage dynamically (server-side only in TanStack Start)
						const { loadModelConfig } = await import("@/lib/model-storage");
						const storedConfig = await loadModelConfig(modelProvider);
						if (storedConfig?.apiKey) {
							modelConfig = { ...modelConfig, apiKey: storedConfig.apiKey };
							console.log(`[SearchAPI] Loaded API key from storage for ${modelProvider}`);
						} else {
							console.warn(`[SearchAPI] No API key found for ${modelProvider} in storage or environment`);
						}
					}

					// Execute unified search with all advanced features
					console.log(`[UnifiedSearch] Starting search for: "${query}" using ${modelConfig.provider}:${modelConfig.model}`);
					console.log(`[UnifiedSearch] Options: parallel=${useParallelModels}, reasoning=${useInterleavedReasoning}, segmentation=${useSegmentation}`);

					const searchResult = await unifiedSearchOrchestrator.search(query, modelConfig, {
						useParallelModels,
						useInterleavedReasoning,
						useSegmentation, // Enable query segmentation and coordination
						enableValidation: true,
						parallelModelConfigs: [], // Can be populated with additional models if needed
					});

					console.log(`[UnifiedSearch] Completed search with ${searchResult.results.length} results`);
					console.log(`[UnifiedSearch] Quality: ${searchResult.addMetrics.overallScore.toFixed(2)}, Tokens: ${searchResult.totalTokens}`);

					return new Response(
						JSON.stringify({
							query,
							...searchResult,
							totalResults: searchResult.results.length,
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
