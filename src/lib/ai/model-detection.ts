/**
 * Model Detection and Auto-Discovery System
 * Automatically detects available Ollama models and cloud provider configurations
 */

import { ModelProvider } from "../model-config";

export interface OllamaModel {
	name: string;
	model: string;
	modified_at: string;
	size: number;
	digest: string;
	details?: {
		parent_model?: string;
		format?: string;
		family?: string;
		families?: string[];
		parameter_size?: string;
		quantization_level?: string;
	};
}

export interface OllamaTagsResponse {
	models: OllamaModel[];
}

export interface DetectedModel {
	provider: ModelProvider;
	modelId: string;
	displayName: string;
	size?: number;
	family?: string;
	recommended?: boolean;
}

/**
 * Detect all available Ollama models on localhost
 */
export async function detectOllamaModels(
	baseURL = "http://localhost:11434",
): Promise<DetectedModel[]> {
	try {
		console.log("[ModelDetection] Checking Ollama at", baseURL);

		// Use server-side API to avoid miniflare blocking localhost fetches
		const response = await fetch("/api/detect-models", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ provider: "ollama", baseUrl: baseURL }),
			signal: AbortSignal.timeout(10000),
		});

		if (!response.ok) {
			console.log(
				"[ModelDetection] Ollama detection API failed:",
				response.status,
			);
			return [];
		}

		const data = await response.json();

		if (data.error) {
			console.log("[ModelDetection] Ollama not available:", data.error);
		}

		const modelNames: string[] = data.models || [];
		const models: DetectedModel[] = modelNames.map((name) => ({
			provider: "ollama" as ModelProvider,
			modelId: name,
			displayName: name,
			recommended: false,
		}));

		console.log(
			"[ModelDetection] Found",
			models.length,
			"Ollama models:",
			models.map((m) => m.modelId),
		);

		return models;
	} catch (error) {
		console.log(
			"[ModelDetection] Failed to detect Ollama models:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return [];
	}
}

/**
 * Detect all available LM Studio models on localhost
 */
export async function detectLMStudioModels(
	baseURL = "http://localhost:1234",
): Promise<DetectedModel[]> {
	try {
		console.log("[ModelDetection] Checking LM Studio at", baseURL);

		// Use server-side API to avoid miniflare blocking localhost fetches
		const response = await fetch("/api/detect-models", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ provider: "lmstudio", baseUrl: baseURL }),
			signal: AbortSignal.timeout(10000),
		});

		if (!response.ok) {
			console.log(
				"[ModelDetection] LM Studio detection API failed:",
				response.status,
			);
			return [];
		}

		const data = await response.json();

		if (data.error) {
			console.log("[ModelDetection] LM Studio not available:", data.error);
		}

		const modelNames: string[] = data.models || [];
		const models: DetectedModel[] = modelNames.map((name) => ({
			provider: "lm_studio" as ModelProvider,
			modelId: name,
			displayName: name,
			recommended: false,
		}));

		console.log(
			"[ModelDetection] Found",
			models.length,
			"LM Studio models:",
			models.map((m) => m.modelId),
		);

		return models;
	} catch (error) {
		console.log(
			"[ModelDetection] Failed to detect LM Studio models:",
			error instanceof Error ? error.message : "Unknown error",
		);
		return [];
	}
}

/**
 * Get the first available model from a detected list.
 * Returns whatever the user is actually running - no hardcoded priorities.
 */
export function getFirstAvailableModel(
	models: DetectedModel[],
): DetectedModel | null {
	if (models.length === 0) return null;
	return models[0];
}

/**
 * Get cloud provider models (when API keys are configured)
 * Updated with real 2024/2025 model IDs
 */
export function getCloudProviderModels(
	provider: ModelProvider,
): DetectedModel[] {
	const cloudModels: Partial<Record<ModelProvider, DetectedModel[]>> = {
		[ModelProvider.OPENAI]: [
			{
				provider: ModelProvider.OPENAI,
				modelId: "gpt-4o",
				displayName: "GPT-4o",
				recommended: true,
			},
			{
				provider: ModelProvider.OPENAI,
				modelId: "gpt-4o-mini",
				displayName: "GPT-4o Mini",
			},
			{
				provider: ModelProvider.OPENAI,
				modelId: "gpt-4-turbo",
				displayName: "GPT-4 Turbo",
			},
			{
				provider: ModelProvider.OPENAI,
				modelId: "gpt-3.5-turbo",
				displayName: "GPT-3.5 Turbo",
			},
		],
		[ModelProvider.ANTHROPIC]: [
			{
				provider: ModelProvider.ANTHROPIC,
				modelId: "claude-3-5-sonnet-20241022",
				displayName: "Claude 3.5 Sonnet",
				recommended: true,
			},
			{
				provider: ModelProvider.ANTHROPIC,
				modelId: "claude-3-5-haiku-20241022",
				displayName: "Claude 3.5 Haiku",
			},
			{
				provider: ModelProvider.ANTHROPIC,
				modelId: "claude-3-opus-20240229",
				displayName: "Claude 3 Opus",
			},
		],
		[ModelProvider.GOOGLE]: [
			{
				provider: ModelProvider.GOOGLE,
				modelId: "gemini-2.0-flash-exp",
				displayName: "Gemini 2.0 Flash (Experimental)",
				recommended: true,
			},
			{
				provider: ModelProvider.GOOGLE,
				modelId: "gemini-1.5-pro",
				displayName: "Gemini 1.5 Pro",
			},
			{
				provider: ModelProvider.GOOGLE,
				modelId: "gemini-1.5-flash",
				displayName: "Gemini 1.5 Flash",
			},
		],
		[ModelProvider.DEEPSEEK]: [
			{
				provider: ModelProvider.DEEPSEEK,
				modelId: "deepseek-chat",
				displayName: "DeepSeek Chat",
				recommended: true,
			},
			{
				provider: ModelProvider.DEEPSEEK,
				modelId: "deepseek-coder",
				displayName: "DeepSeek Coder",
			},
		],
		[ModelProvider.MOONSHOT]: [
			{
				provider: ModelProvider.MOONSHOT,
				modelId: "moonshot-v1-8k",
				displayName: "Moonshot V1 8K",
				recommended: true,
			},
		],
		[ModelProvider.KIMI]: [
			{
				provider: ModelProvider.KIMI,
				modelId: "kimi",
				displayName: "Kimi",
				recommended: true,
			},
		],
		[ModelProvider.OPENROUTER]: [
			{
				provider: ModelProvider.OPENROUTER,
				modelId: "auto",
				displayName: "Auto (Best Available)",
				recommended: true,
			},
		],
		[ModelProvider.VLLM]: [],
		[ModelProvider.GGUF]: [],
		[ModelProvider.ONNX]: [],
		[ModelProvider.AZURE_OPENAI]: [
			{
				provider: ModelProvider.AZURE_OPENAI,
				modelId: "gpt-4o",
				displayName: "GPT-4o (Azure)",
				recommended: true,
			},
			{
				provider: ModelProvider.AZURE_OPENAI,
				modelId: "gpt-4o-mini",
				displayName: "GPT-4o Mini (Azure)",
			},
			{
				provider: ModelProvider.AZURE_OPENAI,
				modelId: "gpt-4-turbo",
				displayName: "GPT-4 Turbo (Azure)",
			},
		],
	};

	return cloudModels[provider as keyof typeof cloudModels] || [];
}

/**
 * Detect all available models across all providers
 */
export async function detectAllAvailableModels(): Promise<{
	ollama: DetectedModel[];
	lmstudio: DetectedModel[];
	cloud: Record<string, DetectedModel[]>;
	recommended: DetectedModel | null;
}> {
	// Detect Ollama models
	const ollamaModels = await detectOllamaModels();

	// Detect LM Studio models
	const lmstudioModels = await detectLMStudioModels();

	// Get first available model (whatever the user is running)
	const ollamaFirst = getFirstAvailableModel(ollamaModels);
	const lmstudioFirst = getFirstAvailableModel(lmstudioModels);

	// Return whichever local model the user is actually running — no provider preference
	const recommended = ollamaFirst || lmstudioFirst;

	// Check for cloud provider API keys (client-side only)
	const cloudModels: Record<string, DetectedModel[]> = {};

	if (typeof window !== "undefined") {
		// Read from unified model store (single source of truth) — never from deprecated localStorage keys
		try {
			const { getModelStore } = await import("@/lib/model-store");
			const store = getModelStore();
			if (store.activeProvider) {
				cloudModels[store.activeProvider] = getCloudProviderModels(
					store.activeProvider as ModelProvider,
				);
			}
		} catch (error) {
			console.error("[ModelDetection] Failed to read model store:", error);
		}

		// Check environment variables (Vite exposes them as import.meta.env.VITE_*)
		if (import.meta.env.VITE_OPENAI_API_KEY) {
			cloudModels[ModelProvider.OPENAI] = getCloudProviderModels(
				ModelProvider.OPENAI,
			);
		}
		if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
			cloudModels[ModelProvider.ANTHROPIC] = getCloudProviderModels(
				ModelProvider.ANTHROPIC,
			);
		}
		if (import.meta.env.VITE_GOOGLE_API_KEY) {
			cloudModels[ModelProvider.GOOGLE] = getCloudProviderModels(
				ModelProvider.GOOGLE,
			);
		}
		if (import.meta.env.VITE_AZURE_API_KEY) {
			cloudModels[ModelProvider.AZURE_OPENAI] = getCloudProviderModels(
				ModelProvider.AZURE_OPENAI,
			);
		}
	}

	return {
		ollama: ollamaModels,
		lmstudio: lmstudioModels,
		cloud: cloudModels,
		recommended,
	};
}

/**
 * Check if a specific provider is available (either Ollama/LM Studio running or API key configured)
 */
export async function isProviderAvailable(
	provider: ModelProvider,
	modelId?: string,
): Promise<boolean> {
	if (provider === "ollama") {
		const models = await detectOllamaModels();
		return models.some((m) => m.modelId === modelId);
	}

	if (provider === "lm_studio") {
		const models = await detectLMStudioModels();
		return models.some((m) => m.modelId === modelId);
	}

	// For cloud providers, check if API key is configured via unified model store
	if (typeof window !== "undefined") {
		try {
			const { getModelStore } = await import("@/lib/model-store");
			const store = getModelStore();
			if (store.activeProvider === provider) {
				return true;
			}
		} catch (error) {
			console.error("[ModelDetection] Failed to parse saved config:", error);
			return false;
		}

		// Check environment variables as fallback
		const envVarMap: Record<string, string> = {
			[ModelProvider.OPENAI]: "VITE_OPENAI_API_KEY",
			[ModelProvider.ANTHROPIC]: "VITE_ANTHROPIC_API_KEY",
			[ModelProvider.GOOGLE]: "VITE_GOOGLE_API_KEY",
			[ModelProvider.AZURE_OPENAI]: "VITE_AZURE_API_KEY",
		};

		const envVar = envVarMap[provider];
		if (envVar && import.meta.env[envVar]) {
			return true;
		}
	}

	return false;
}

/**
 * Get recommended model based on task type.
 * Returns the first available model - no hardcoded priorities.
 * The user's running model is always the best choice.
 */
export function getRecommendedModelForTask(
	_task: "chat" | "search" | "reasoning" | "coding",
	availableModels: DetectedModel[],
): DetectedModel | null {
	return getFirstAvailableModel(availableModels);
}
