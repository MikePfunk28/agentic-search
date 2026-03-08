/**
 * Server-side model detection API
 * Detects local models (Ollama, LM Studio) from the server side
 * since browser fetches to localhost get blocked by miniflare/workerd
 */

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/detect-models")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const provider = url.searchParams.get("provider");
				const baseUrl = url.searchParams.get("baseUrl");
				const apiKey = url.searchParams.get("apiKey");

				if (!provider || !baseUrl) {
					return new Response(
						JSON.stringify({ error: "provider and baseUrl are required" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				try {
					let modelsUrl: string;
					if (provider === "ollama") {
						const clean = baseUrl.replace(/\/v1\/?$/, "");
						modelsUrl = `${clean}/api/tags`;
					} else {
						// OpenAI-compatible: /v1/models
						modelsUrl = baseUrl.endsWith("/v1")
							? `${baseUrl}/models`
							: baseUrl.endsWith("/v1/")
								? `${baseUrl}models`
								: `${baseUrl}/v1/models`;
					}

					const headers: Record<string, string> = {};
					if (apiKey) {
						headers["Authorization"] = `Bearer ${apiKey}`;
					}

					const response = await fetch(modelsUrl, {
						method: "GET",
						headers,
						signal: AbortSignal.timeout(8000),
					});

					if (!response.ok) {
						return new Response(
							JSON.stringify({ models: [], error: `Provider returned ${response.status}` }),
							{ status: 200, headers: { "Content-Type": "application/json" } },
						);
					}

					const data = await response.json();
					let models: string[] = [];

					if (provider === "ollama") {
						// Ollama format: { models: [{ name: "model:tag" }] }
						models = (data.models || []).map((m: any) => m.name || m.model || "");
					} else if (data.data && Array.isArray(data.data)) {
						// OpenAI-compatible: { data: [{ id: "model-name" }] }
						models = data.data.map((m: any) => m.id || "");
					} else if (data.models && Array.isArray(data.models)) {
						// Some providers: { models: [{ name: "..." }] }
						models = data.models.map((m: any) => m.name || m.id || "");
					}

					models = models.filter(Boolean);

					return new Response(
						JSON.stringify({ models }),
						{ status: 200, headers: { "Content-Type": "application/json" } },
					);
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown error";
					console.error(`[DetectModels] Failed to detect ${provider} models:`, message);
					return new Response(
						JSON.stringify({ models: [], error: message }),
						{ status: 200, headers: { "Content-Type": "application/json" } },
					);
				}
			},
		},
	},
});
