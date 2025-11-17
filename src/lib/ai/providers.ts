/**
 * AI Model Provider Adapter
 * Supports multiple providers: Ollama, LM Studio, OpenAI, Anthropic, Google, Azure
 */

export type ModelProvider =
	| "openai"
	| "anthropic"
	| "google"
	| "deepseek"
	| "moonshot"
	| "kimi"
	| "ollama"
	| "lm_studio"
	| "vllm"
	| "gguf"
	| "onnx"
	| "azure_openai";

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

	// Check for local Ollama
	try {
		const res = await fetch("http://localhost:11434/api/tags", {
			signal: AbortSignal.timeout(1000),
		});
		if (res.ok) {
			providers.push("ollama");
			console.log("[Providers] Ollama detected at localhost:11434");
		}
	} catch (error) {
		console.log("[Providers] Ollama not available");
	}

	// Check for LM Studio
	try {
		const res = await fetch("http://localhost:1234/v1/models", {
			signal: AbortSignal.timeout(1000),
		});
		if (res.ok) {
			providers.push("lm_studio");
			console.log("[Providers] LM Studio detected at localhost:1234");
		}
	} catch (error) {
		console.log("[Providers] LM Studio not available");
	}

	// Check for vLLM
	try {
		const res = await fetch("http://localhost:8000/v1/models", {
			signal: AbortSignal.timeout(1000),
		});
		if (res.ok) {
			providers.push("vllm");
			console.log("[Providers] vLLM detected at localhost:8000");
		}
	} catch (error) {
		console.log("[Providers] vLLM not available");
	}

	// Check for GGUF loader
	try {
		const res = await fetch("http://localhost:8080/v1/models", {
			signal: AbortSignal.timeout(1000),
		});
		if (res.ok) {
			providers.push("gguf");
			console.log("[Providers] GGUF loader detected at localhost:8080");
		}
	} catch (error) {
		console.log("[Providers] GGUF not available");
	}

	// Check for ONNX runtime
	try {
		const res = await fetch("http://localhost:8081/v1/models", {
			signal: AbortSignal.timeout(1000),
		});
		if (res.ok) {
			providers.push("onnx");
			console.log("[Providers] ONNX runtime detected at localhost:8081");
		}
	} catch (error) {
		console.log("[Providers] ONNX not available");
	}

	// Cloud providers - always show them so users can add API keys
	providers.push("openai", "anthropic", "google", "deepseek", "moonshot", "kimi", "azure_openai");

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
		case "ollama": {
			try {
				const url = baseURL || "http://localhost:11434";
				const res = await fetch(`${url}/api/tags`, {
					signal: AbortSignal.timeout(5000),
				});
				if (!res.ok) throw new Error("Ollama not available");
				const data = await res.json();
				return data.models.map((m: any) => m.name);
			} catch (error) {
				console.error("[Providers] Failed to list Ollama models:", error);
				return [];
			}
		}

		case "lm_studio": {
			try {
				const url = baseURL || "http://localhost:1234";
				const res = await fetch(`${url}/v1/models`, {
					signal: AbortSignal.timeout(5000),
				});
				if (!res.ok) throw new Error("LM Studio not available");
				const data = await res.json();
				return data.data.map((m: any) => m.id);
			} catch (error) {
				console.error("[Providers] Failed to list LM Studio models:", error);
				return [];
			}
		}

		case "vllm": {
			try {
				const url = baseURL || "http://localhost:8000";
				const res = await fetch(`${url}/v1/models`, {
					signal: AbortSignal.timeout(5000),
				});
				if (!res.ok) throw new Error("vLLM not available");
				const data = await res.json();
				return data.data.map((m: any) => m.id);
			} catch (error) {
				console.error("[Providers] Failed to list vLLM models:", error);
				return [];
			}
		}

		case "gguf": {
			try {
				const url = baseURL || "http://localhost:8080";
				const res = await fetch(`${url}/v1/models`, {
					signal: AbortSignal.timeout(5000),
				});
				if (!res.ok) throw new Error("GGUF loader not available");
				const data = await res.json();
				return data.data.map((m: any) => m.id);
			} catch (error) {
				console.error("[Providers] Failed to list GGUF models:", error);
				return [];
			}
		}

		case "onnx": {
			try {
				const url = baseURL || "http://localhost:8081";
				const res = await fetch(`${url}/v1/models`, {
					signal: AbortSignal.timeout(5000),
				});
				if (!res.ok) throw new Error("ONNX runtime not available");
				const data = await res.json();
				return data.data.map((m: any) => m.id);
			} catch (error) {
				console.error("[Providers] Failed to list ONNX models:", error);
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
							'Authorization': `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
						},
						signal: AbortSignal.timeout(5000),
					});
					if (res.ok) {
						const data = await res.json();
						return data.data.map((m: any) => m.id).filter((id: string) => id.startsWith('gpt'));
					}
				} catch (error) {
					console.error("[Providers] Failed to fetch OpenAI models:", error);
				}
			}
			// Fallback to defaults
			return ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"];
		}

		case "deepseek": {
			// If API key provided, fetch models dynamically
			if (apiKey) {
				try {
					const url = baseURL || "https://api.deepseek.com/v1";
					const res = await fetch(`${url}/models`, {
						headers: {
							'Authorization': `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
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
			// Fallback to defaults
			return ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"];
		}

		case "moonshot": {
			// If API key provided, fetch models dynamically
			if (apiKey) {
				try {
					const url = baseURL || "https://api.moonshot.cn/v1";
					const res = await fetch(`${url}/models`, {
						headers: {
							'Authorization': `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
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
			// Fallback to defaults
			return ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"];
		}

		case "kimi": {
			// If API key provided, fetch models dynamically
			if (apiKey) {
				try {
					const url = baseURL || "https://api.moonshot.cn/v1";
					const res = await fetch(`${url}/models`, {
						headers: {
							'Authorization': `Bearer ${apiKey}`,
							'Content-Type': 'application/json',
						},
						signal: AbortSignal.timeout(5000),
					});
					if (res.ok) {
						const data = await res.json();
						return data.data.map((m: any) => m.id).filter((id: string) => id.includes('kimi'));
					}
				} catch (error) {
					console.error("[Providers] Failed to fetch Kimi models:", error);
				}
			}
			// Fallback to defaults
			return ["kimi-k2-chat", "kimi-k2-long"];
		}

		case "anthropic":
			return [
				"claude-sonnet-4-5-20250929",
				"claude-haiku-4-5-20250929",
				"claude-opus-4-1-20250805",
				"claude-3-5-sonnet-20241022",
				"claude-3-5-haiku-20241022",
			];

		case "google":
			return ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"];

		case "azure_openai":
			// Azure models depend on deployment names
			return ["gpt-4", "gpt-4-turbo", "gpt-35-turbo"];

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
