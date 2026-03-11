/**
 * Server-side model detection API
 * Detects local models (Ollama, LM Studio) from the server side
 * since browser fetches to localhost get blocked by miniflare/workerd
 *
 * Security: Uses POST to avoid leaking apiKey in query params/logs.
 * Validates baseUrl via shared SSRF protection (src/lib/url-validation.ts).
 */

import { createFileRoute } from "@tanstack/react-router";
import { validateServerFetchUrlAsync } from "@/lib/url-validation";

function hasAuthenticatedSession(request: Request): boolean {
	const authDisabled =
		typeof process !== "undefined" && process.env?.VITE_DISABLE_AUTH === "true";
	if (authDisabled) {
		return true;
	}

	const cookie = request.headers.get("cookie") || "";
	return cookie.includes("__session") || cookie.includes("wos-session");
}

export const Route = createFileRoute("/api/detect-models")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				if (!hasAuthenticatedSession(request)) {
					return new Response(
						JSON.stringify({ error: "Authentication required" }),
						{ status: 401, headers: { "Content-Type": "application/json" } },
					);
				}

				let body: { provider?: string; baseUrl?: string; apiKey?: string };
				try {
					body = await request.json();
				} catch {
					return new Response(
						JSON.stringify({ error: "Invalid JSON body" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				const { provider, baseUrl, apiKey } = body;

				if (!provider || !baseUrl) {
					return new Response(
						JSON.stringify({ error: "provider and baseUrl are required" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				// SSRF protection: block internal/metadata endpoints
				try {
					await validateServerFetchUrlAsync(baseUrl);
				} catch (err) {
					return new Response(
						JSON.stringify({ error: err instanceof Error ? err.message : "Invalid baseUrl" }),
						{ status: 403, headers: { "Content-Type": "application/json" } },
					);
				}

				try {
					// Skip localhost detection when running in Cloudflare worker (can't reach user's machine)
					const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)(:|\/|$)/i.test(baseUrl);
					const isWorkerRuntime = typeof globalThis.caches !== "undefined" && typeof (globalThis as any).process === "undefined";
					if (isLocalhost && isWorkerRuntime) {
						return new Response(
							JSON.stringify({ models: [], note: "Local provider detection unavailable from worker runtime" }),
							{ status: 200, headers: { "Content-Type": "application/json" } },
						);
					}

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
