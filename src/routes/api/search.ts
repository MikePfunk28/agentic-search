import { createFileRoute } from "@tanstack/react-router";
import {
	createCsrfErrorResponse,
	validateCsrfRequest,
} from "@/lib/csrf-protection";
import { ModelConfigManager, ModelProvider } from "@/lib/model-config";
import { agenticSearch } from "@/lib/agentic-search";

const SEARCH_SYSTEM_PROMPT = `You are an intelligent agentic search assistant. Your role is to:

1. Analyze user queries to understand their search intent
2. Break down complex queries into specific search terms
3. Execute multi-source searches across web content
4. Apply quality scoring (ADD - Adversarial Differential Discrimination)
5. Provide structured, relevant results with sources

When a user asks a question that requires external information:
- Identify the core search intent
- Generate multiple search queries to cover different aspects
- Simulate searching across sources (Firecrawl, academic papers, news, etc.)
- Rank results by relevance and quality
- Provide source attribution and confidence scores

Always respond with structured search results that include:
- Title and summary for each result
- Source URL and credibility indicators
- ADD quality score (0-1)
- Relevance explanation

Be transparent about your search process and reasoning.`;

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

					return new Response(
						JSON.stringify({
							query,
							results: searchResult.results,
							totalResults: searchResult.results.length,
							reasoning: searchResult.reasoning,
							strategy: searchResult.strategy,
							quality: searchResult.quality,
							searchTime: Date.now(),
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
