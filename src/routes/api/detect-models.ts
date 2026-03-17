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
import {
	validateCsrfRequest,
	createCsrfErrorResponse,
} from "@/lib/csrf-protection";

const LOCAL_PROVIDER_HOSTS = new Set([
	"localhost",
	"127.0.0.1",
	"0.0.0.0",
	"::1",
	"[::1]",
]);

/** Parse cookies properly — match by cookie NAME, not substring of entire header */
function parseCookies(request: Request): Map<string, string> {
	const cookieHeader = request.headers.get("cookie") || "";
	const cookies = new Map<string, string>();
	for (const pair of cookieHeader.split(";")) {
		const eqIdx = pair.indexOf("=");
		if (eqIdx > 0) {
			const name = pair.slice(0, eqIdx).trim();
			const value = pair.slice(eqIdx + 1).trim();
			cookies.set(name, value);
		}
	}
	return cookies;
}

function hasAuthenticatedSession(request: Request): boolean {
	const authDisabled =
		typeof process !== "undefined" && process.env?.VITE_DISABLE_AUTH === "true";
	if (authDisabled) {
		return true;
	}

	const cookies = parseCookies(request);
	const sessionToken = cookies.get("__session") || cookies.get("wos-session");
	return typeof sessionToken === "string" && sessionToken.length > 0;
}

function isLocalProviderUrl(rawUrl: string): boolean {
	try {
		return LOCAL_PROVIDER_HOSTS.has(new URL(rawUrl).hostname.toLowerCase());
	} catch {
		return false;
	}
}

export const Route = createFileRoute("/api/detect-models")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				// CSRF protection: POST requires valid CSRF token
				const csrfCheck = validateCsrfRequest(request);
				if (!csrfCheck.valid) {
					return createCsrfErrorResponse(csrfCheck.error!);
				}

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
					return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
						status: 400,
						headers: { "Content-Type": "application/json" },
					});
				}

				const { provider, baseUrl, apiKey } = body;

				if (!provider || !baseUrl) {
					return new Response(
						JSON.stringify({ error: "provider and baseUrl are required" }),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				// Worker runtimes cannot proxy requests to a user's localhost.
				// Local browser sessions should detect local providers directly.
				if (isLocalProviderUrl(baseUrl)) {
					return new Response(
						JSON.stringify({
							models: [],
							note: "Local provider detection is only available from a local browser session",
						}),
						{ status: 200, headers: { "Content-Type": "application/json" } },
					);
				}

				// SSRF protection: block internal/metadata endpoints
				try {
					await validateServerFetchUrlAsync(baseUrl);
				} catch (err) {
					return new Response(
						JSON.stringify({
							error: err instanceof Error ? err.message : "Invalid baseUrl",
						}),
						{ status: 403, headers: { "Content-Type": "application/json" } },
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
						headers.Authorization = `Bearer ${apiKey}`;
					}

					const response = await fetch(modelsUrl, {
						method: "GET",
						headers,
						signal: AbortSignal.timeout(8000),
					});

					if (!response.ok) {
						return new Response(
							JSON.stringify({
								models: [],
								error: `Provider returned ${response.status}`,
							}),
							{ status: 200, headers: { "Content-Type": "application/json" } },
						);
					}

					const data = await response.json();
					let models: string[] = [];

					if (provider === "ollama") {
						// Ollama format: { models: [{ name: "model:tag" }] }
						models = (data.models || []).map(
							(m: any) => m.name || m.model || "",
						);
					} else if (data.data && Array.isArray(data.data)) {
						// OpenAI-compatible: { data: [{ id: "model-name" }] }
						models = data.data.map((m: any) => m.id || "");
					} else if (data.models && Array.isArray(data.models)) {
						// Some providers: { models: [{ name: "..." }] }
						models = data.models.map((m: any) => m.name || m.id || "");
					}

					models = models.filter(Boolean);

					return new Response(JSON.stringify({ models }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unknown error";
					console.error(
						`[DetectModels] Failed to detect ${provider} models:`,
						message,
					);
					return new Response(JSON.stringify({ models: [], error: message }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
		},
	},
});
