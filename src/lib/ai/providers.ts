/**
 * AI Model Provider Adapter
 * Supports multiple providers: Ollama, LM Studio, OpenAI, Anthropic, Google, Azure
 *
 * NOTE: ModelProvider enum is the single source of truth in ../model-config.ts
 * This file re-exports it for backward compatibility.
 */

import { AVAILABLE_MODELS, ModelProvider } from "../model-config";

// Re-export so existing imports don't break
export { ModelProvider };

export interface ModelConfig {
	provider: ModelProvider;
	modelId: string;
	baseURL?: string; // For local models
	apiKey?: string; // For cloud models
	temperature?: number;
	maxTokens?: number;
}

/**
 * Detect which providers are available
 * Checks local servers and environment variables
 */
export async function detectAvailableProviders(): Promise<ModelProvider[]> {
	const providers: ModelProvider[] = [];

	// Check local providers via server-side proxy (browser can't reach localhost through miniflare)
	const localChecks: Array<{
		provider: ModelProvider;
		providerName: string;
		baseUrl: string;
	}> = [
		{
			provider: ModelProvider.OLLAMA,
			providerName: "ollama",
			baseUrl: "http://localhost:11434",
		},
		{
			provider: ModelProvider.LM_STUDIO,
			providerName: "lmstudio",
			baseUrl: "http://localhost:1234",
		},
		{
			provider: ModelProvider.VLLM,
			providerName: "vllm",
			baseUrl: "http://localhost:8000",
		},
		{
			provider: ModelProvider.GGUF,
			providerName: "gguf",
			baseUrl: "http://localhost:8080",
		},
		{
			provider: ModelProvider.ONNX,
			providerName: "onnx",
			baseUrl: "http://localhost:8081",
		},
	];

	await Promise.allSettled(
		localChecks.map(async ({ provider, providerName, baseUrl }) => {
			try {
				const res = await fetch("/api/detect-models", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ provider: providerName, baseUrl }),
					signal: AbortSignal.timeout(3000),
				});
				if (res.ok) {
					const data = await res.json();
					if (data.models && data.models.length > 0) {
						providers.push(provider);
						console.log(
							`[Providers] ${providerName} detected with ${data.models.length} models`,
						);
					}
				}
			} catch {
				console.log(`[Providers] ${providerName} not available`);
			}
		}),
	);

	// Cloud providers - always show them so users can add API keys
	providers.push(
		ModelProvider.OPENAI,
		ModelProvider.ANTHROPIC,
		ModelProvider.GOOGLE,
		ModelProvider.DEEPSEEK,
		ModelProvider.MOONSHOT,
		ModelProvider.KIMI,
		ModelProvider.OPENROUTER,
		ModelProvider.AZURE_OPENAI,
	);

	console.log("[Providers] Available providers:", providers);
	return providers;
}

/**
 * List available models for a provider
 * Dynamically fetches from /models API when possible
 */
export async function listModelsForProvider(
	provider: ModelProvider,
	baseURL?: string,
	apiKey?: string,
): Promise<string[]> {
	switch (provider) {
		case "ollama":
		case "lm_studio":
		case "vllm":
		case "gguf":
		case "onnx": {
			// Route all local provider detection through server-side proxy
			// Browser can't reach localhost through miniflare/workerd
			const defaultUrls: Record<string, string> = {
				ollama: "http://localhost:11434",
				lm_studio: "http://localhost:1234",
				vllm: "http://localhost:8000",
				gguf: "http://localhost:8080",
				onnx: "http://localhost:8081",
			};
			const providerName = provider === "lm_studio" ? "lmstudio" : provider;
			const url = baseURL || defaultUrls[provider];
			try {
				const res = await fetch("/api/detect-models", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						provider: providerName,
						baseUrl: url,
						...(apiKey ? { apiKey } : {}),
					}),
					signal: AbortSignal.timeout(8000),
				});
				if (!res.ok) return [];
				const data = await res.json();
				return data.models || [];
			} catch (error) {
				console.error(`[Providers] Failed to list ${provider} models:`, error);
				return [];
			}
		}

		case "openai": {
			// If API key provided, fetch models dynamically
			if (apiKey) {
				try {
					const url = baseURL || "https://api.openai.com/v1";
					const res = await fetch(`${url}/models`, {
						headers: {
							Authorization: `Bearer ${apiKey}`,
							"Content-Type": "application/json",
						},
						signal: AbortSignal.timeout(5000),
					});
					if (res.ok) {
						const data = await res.json();
						return data.data
							.map((m: any) => m.id)
							.filter((id: string) => id.startsWith("gpt"));
					}
				} catch (error) {
					console.error("[Providers] Failed to fetch OpenAI models:", error);
				}
			}
			// Fallback to defaults from single source of truth
			return [...AVAILABLE_MODELS.OpenAI];
		}

		case "deepseek": {
			// If API key provided, fetch models dynamically
			if (apiKey) {
				try {
					const url = baseURL || "https://api.deepseek.com/v1";
					const res = await fetch(`${url}/models`, {
						headers: {
							Authorization: `Bearer ${apiKey}`,
							"Content-Type": "application/json",
						},
						signal: AbortSignal.timeout(5000),
					});
					if (res.ok) {
						const data = await res.json();
						return data.data.map((m: any) => m.id);
					}
				} catch (error) {
					console.error("[Providers] Failed to fetch DeepSeek models:", error);
				}
			}
			// Fallback to defaults from single source of truth
			return [...AVAILABLE_MODELS.DeepSeek];
		}

		case "moonshot": {
			// If API key provided, fetch models dynamically
			if (apiKey) {
				try {
					const url = baseURL || "https://api.moonshot.cn/v1";
					const res = await fetch(`${url}/models`, {
						headers: {
							Authorization: `Bearer ${apiKey}`,
							"Content-Type": "application/json",
						},
						signal: AbortSignal.timeout(5000),
					});
					if (res.ok) {
						const data = await res.json();
						return data.data.map((m: any) => m.id);
					}
				} catch (error) {
					console.error("[Providers] Failed to fetch Moonshot models:", error);
				}
			}
			// Fallback to defaults from single source of truth
			return [...AVAILABLE_MODELS.Moonshot];
		}

		case "kimi": {
			// If API key provided, fetch models dynamically
			if (apiKey) {
				try {
					const url = baseURL || "https://api.moonshot.cn/v1";
					const res = await fetch(`${url}/models`, {
						headers: {
							Authorization: `Bearer ${apiKey}`,
							"Content-Type": "application/json",
						},
						signal: AbortSignal.timeout(5000),
					});
					if (res.ok) {
						const data = await res.json();
						return data.data
							.map((m: any) => m.id)
							.filter((id: string) => id.includes("kimi"));
					}
				} catch (error) {
					console.error("[Providers] Failed to fetch Kimi models:", error);
				}
			}
			// Fallback to defaults from single source of truth
			return [...AVAILABLE_MODELS.Kimi];
		}

		case "anthropic":
			// Static list — Anthropic has no /v1/models endpoint
			return [...AVAILABLE_MODELS.Anthropic];

		case "google":
			return [...AVAILABLE_MODELS.Google];

		case "azure_openai":
			// Azure models depend on deployment names; use OpenAI list as a reasonable default
			return [...AVAILABLE_MODELS.OpenAI];

		default:
			return [];
	}
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: ModelProvider): string {
	const names: Record<ModelProvider, string> = {
		openai: "OpenAI",
		anthropic: "Anthropic",
		google: "Google AI",
		deepseek: "DeepSeek",
		moonshot: "Moonshot AI",
		kimi: "Kimi K2",
		ollama: "Ollama (Local)",
		lm_studio: "LM Studio (Local)",
		vllm: "vLLM (Local)",
		gguf: "GGUF Loader (Local)",
		onnx: "ONNX Runtime (Local)",
		openrouter: "OpenRouter",
		azure_openai: "Azure OpenAI",
	};
	return names[provider];
}

/**
 * Check if provider requires API key
 */
export function requiresApiKey(provider: ModelProvider): boolean {
	return !["ollama", "lm_studio", "vllm", "gguf", "onnx"].includes(provider);
}

/**
 * Get default base URL for provider
 */
export function getDefaultBaseURL(provider: ModelProvider): string | undefined {
	const defaults: Partial<Record<ModelProvider, string>> = {
		openai: "https://api.openai.com/v1",
		anthropic: "https://api.anthropic.com",
		google: "https://generativelanguage.googleapis.com/v1",
		deepseek: "https://api.deepseek.com/v1",
		moonshot: "https://api.moonshot.cn/v1",
		kimi: "https://api.moonshot.cn/v1",
		ollama: "http://localhost:11434/v1",
		lm_studio: "http://localhost:1234/v1",
		vllm: "http://localhost:8000/v1",
		gguf: "http://localhost:8080/v1",
		onnx: "http://localhost:8081/v1",
		azure_openai: undefined,
	};
	return defaults[provider];
}
