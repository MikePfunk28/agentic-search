import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import { ModelConfigManager, ModelProvider } from "@/lib/model-config";
import { agenticSearch } from "@/lib/agentic-search";

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
					const { query, modelProvider = "ollama" } = await request.json();

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
					const modelConfig = modelManager.getConfig(modelProvider as ModelProvider) || modelManager.getActiveConfig();

					if (!modelConfig) {
						return new Response(
							JSON.stringify({ error: "No valid model configuration found" }),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Execute agentic search using the real engine
					console.log(`[AgenticSearch] Starting search for: "${query}" using ${modelConfig.provider}:${modelConfig.model}`);

					const searchResult = await agenticSearch.search(query, modelConfig);

					console.log(`[AgenticSearch] Completed search with ${searchResult.results.length} results`);

					const timestamp = new Date().toISOString();

					return new Response(
						JSON.stringify({
							query,
							results: searchResult.results,
							totalResults: searchResult.results.length,
							reasoning: searchResult.reasoning,
							strategy: searchResult.strategy,
							quality: searchResult.quality,
							timestamp,
							modelUsed: modelConfig.model,
							provider: modelConfig.provider,
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
