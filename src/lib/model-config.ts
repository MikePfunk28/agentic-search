/**
 * Model Configuration System
 *
 * Supports BYOK (Bring Your Own Key) for multiple AI providers:
 * - Cloud providers: OpenAI, Anthropic, Google, etc.
 * - Local models: Ollama, LM Studio, etc.
 *
 * Configuration can be loaded from:
 * 1. Environment variables
 * 2. Configuration file (config/models.json)
 * 3. Runtime user input
 */

import { z } from "zod";

// Model provider types
export enum ModelProvider {
	OPENAI = "openai",
	ANTHROPIC = "anthropic",
	GOOGLE = "google",
	DEEPSEEK = "deepseek",
	MOONSHOT = "moonshot",
	KIMI = "kimi",
	OPENROUTER = "openrouter",
	OLLAMA = "ollama",
	LM_STUDIO = "lm_studio",
	VLLM = "vllm",
	GGUF = "gguf",
	ONNX = "onnx",
	AZURE_OPENAI = "azure_openai",
}

// Model configuration schema
export const ModelConfigSchema = z.object({
	provider: z.nativeEnum(ModelProvider),
	apiKey: z.string().optional(),
	baseUrl: z.string().optional(),
	model: z.string(),
	temperature: z.number().min(0).max(2).default(0.7),
	maxTokens: z.number().positive().default(4096),
	timeout: z.number().positive().default(60000),
	enableStreaming: z.boolean().default(false),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

// Available models per provider - NOVEMBER 2025 LATEST MODELS (OpenRouter compatible IDs)
export const AVAILABLE_MODELS = {
	OpenAI: [
		"gpt-5.1",
		"gpt-5.1-mini",
		"gpt-5.1-nano",
		"gpt-5",
		"gpt-5-mini",
		"gpt-5-nano",
		"o3-deep-research",
		"o4-mini-deep-research",
		"gpt-4o"
	],
	Anthropic: [
		"claude-sonnet-4.5",
		"claude-opus-4.1",
		"claude-haiku-4.5",
		"claude-opus-4",
		"claude-sonnet-4",
		"claude-3.7-sonnet",
		"claude-3.7-sonnet:thinking",
		"claude-3.5-sonnet",
		"claude-3.5-haiku"
	],
	Google: [
		"gemini-2.5-pro",
		"gemini-2.5-pro-preview",
		"gemini-2.5-flash",
		"gemini-2.5-flash-lite",
		"gemini-2.5-flash-image",
		"gemma-3-4b-it"
	],
	DeepSeek: [
		"deepseek-v3.2-exp",
		"deepseek-chat-v3.1",
		"deepseek-r1-0528",
		"deepseek-r1-distill-qwen-32b",
		"deepseek-r1-distill-qwen-14b",
		"deepseek-prover-v2",
		"deepseek-chat",
		"deepseek-coder"
	],
	Moonshot: [
		"moonshot-v1-8k",
		"moonshot-v1-32k",
		"moonshot-v1-128k"
	],
	Kimi: [
		"kimi-k2-chat",
		"kimi-k2-long"
	],
	OpenRouter: [],  // Dynamic - fetches from API
	Ollama: ["qwen3:4b", "qwen3:1.7b", "gemma3:4b", "gemma3:1b", "gemma3:270m", "deepseek-r1:8b", "deepseek-r1:1.5b", "deepseek-coder:6.7b"],
	LMStudio: [],
	vLLM: [],
	GGUF: [],
	ONNX: [],
} as const;

// Export type for type-safe model selection
export type AvailableModels = typeof AVAILABLE_MODELS;
export type ModelProviderName = keyof AvailableModels;
export type ModelForProvider<T extends ModelProviderName> = AvailableModels[T][number];

// Provider-specific default configurations
export const ProviderDefaults: Record<ModelProvider, Partial<ModelConfig>> = {
	[ModelProvider.OPENAI]: {
		baseUrl: "https://api.openai.com/v1",
		model: "gpt-5.1",
		temperature: 0.7,
		maxTokens: 16000,
	},
	[ModelProvider.ANTHROPIC]: {
		baseUrl: "https://api.anthropic.com",
		model: "claude-sonnet-4.5",
		temperature: 0.7,
		maxTokens: 8192,
	},
	[ModelProvider.GOOGLE]: {
		baseUrl: "https://generativelanguage.googleapis.com/v1",
		model: "gemini-2.5-pro",
		temperature: 0.7,
		maxTokens: 8192,
	},
	[ModelProvider.DEEPSEEK]: {
		baseUrl: "https://api.deepseek.com/v1",
		model: "deepseek-v3.2-exp",
		temperature: 0.7,
		maxTokens: 8192,
	},
	[ModelProvider.MOONSHOT]: {
		baseUrl: "https://api.moonshot.cn/v1",
		model: "moonshot-v1-8k",
		temperature: 0.7,
		maxTokens: 8000,
	},
	[ModelProvider.KIMI]: {
		baseUrl: "https://api.moonshot.cn/v1",
		model: "kimi-k2-chat",
		temperature: 0.7,
		maxTokens: 8192,
	},
	[ModelProvider.OLLAMA]: {
		baseUrl: "http://localhost:11434/v1",
		model: "qwen3:4b",
		temperature: 0.7,
		maxTokens: 32000,
	},
	[ModelProvider.LM_STUDIO]: {
		baseUrl: "http://localhost:1234/v1",
		model: "qwen3:4b",
		temperature: 0.7,
		maxTokens: 32000,
	},
	[ModelProvider.VLLM]: {
		baseUrl: "http://localhost:8000/v1",
		model: "default",
		temperature: 0.7,
		maxTokens: 32000,
	},
	[ModelProvider.GGUF]: {
		baseUrl: "http://localhost:8080/v1",
		model: "default",
		temperature: 0.7,
		maxTokens: 32000,
	},
	[ModelProvider.ONNX]: {
		baseUrl: "http://localhost:8081/v1",
		model: "default",
		temperature: 0.7,
		maxTokens: 32000,
	},
	[ModelProvider.AZURE_OPENAI]: {
		model: "gpt-5.1",
		temperature: 0.7,
		maxTokens: 16000,
	},
	[ModelProvider.OPENROUTER]: {
		baseUrl: "https://openrouter.ai/api/v1",
		model: "openai/gpt-5.1",
		temperature: 0.7,
		maxTokens: 16000,
	},
};

/**
 * Model Configuration Manager
 * Handles loading, validation, and switching between model configurations
 */
export class ModelConfigManager {
	private configs: Map<string, ModelConfig> = new Map();
	private activeConfigId: string | null = null;

	constructor() {
		this.loadFromEnvironment();
		
		// If no configurations loaded, initialize with default Ollama
		if (this.configs.size === 0) {
			this.initializeDefaults();
		}
	}
	
	/**
	 * Initialize with default Ollama configuration
	 */
	private initializeDefaults(): void {
		try {
			const defaults = ProviderDefaults[ModelProvider.OLLAMA];
			const config: ModelConfig = {
				provider: ModelProvider.OLLAMA,
				baseUrl: defaults.baseUrl || "http://localhost:11434/v1",
				model: defaults.model || "qwen3:4b",
				temperature: defaults.temperature || 0.7,
				maxTokens: defaults.maxTokens || 32000,
				timeout: 60000,
				enableStreaming: false,
			};
			this.addConfig("ollama", config);
			this.setActiveConfig("ollama");
			console.log("[ModelConfig] Initialized with default Ollama configuration");
		} catch (error) {
			console.error("Failed to initialize default configuration:", error);
		}
	}

	/**
	 * Load model configurations from environment variables
	 * Supports multiple named configurations for easy switching
	 */
	private loadFromEnvironment(): void {
		// Primary configuration from env
		const primaryProvider = process.env.PRIMARY_MODEL_PROVIDER as ModelProvider;

		if (primaryProvider) {
			const config = this.createConfigFromEnv("primary", primaryProvider);
			if (config) {
				this.addConfig("primary", config);
				this.setActiveConfig("primary");
			}
		}

		// Secondary/local model configuration
		const localProvider = process.env.LOCAL_MODEL_PROVIDER as ModelProvider;
		if (localProvider) {
			const config = this.createConfigFromEnv("local", localProvider);
			if (config) {
				this.addConfig("local", config);
			}
		}
	}

	/**
	 * Create configuration from environment variables
	 */
	private createConfigFromEnv(
		prefix: string,
		provider: ModelProvider,
	): ModelConfig | null {
		try {
			const envPrefix = prefix.toUpperCase();
			const defaults = ProviderDefaults[provider];

			const config: ModelConfig = {
				provider,
				apiKey: process.env[`${envPrefix}_API_KEY`],
				baseUrl: process.env[`${envPrefix}_BASE_URL`] || defaults.baseUrl,
				model: process.env[`${envPrefix}_MODEL`] || defaults.model || "",
				temperature: Number(
					process.env[`${envPrefix}_TEMPERATURE`] || defaults.temperature,
				),
				maxTokens: Number(
					process.env[`${envPrefix}_MAX_TOKENS`] || defaults.maxTokens,
				),
				timeout: Number(process.env[`${envPrefix}_TIMEOUT`] || 60000),
				enableStreaming:
					process.env[`${envPrefix}_ENABLE_STREAMING`] === "true",
			};

			return ModelConfigSchema.parse(config);
		} catch (error) {
			console.warn(`Failed to create config for ${prefix}:`, error);
			return null;
		}
	}

	/**
	 * Add a new model configuration
	 */
	addConfig(id: string, config: ModelConfig): void {
		const validated = ModelConfigSchema.parse(config);
		this.configs.set(id, validated);
	}

	/**
	 * Get configuration by ID
	 */
	getConfig(id: string): ModelConfig | null {
		return this.configs.get(id) || null;
	}

	/**
	 * Get active configuration
	 */
	getActiveConfig(): ModelConfig | null {
		if (!this.activeConfigId) return null;
		return this.getConfig(this.activeConfigId);
	}

	/**
	 * Set active configuration
	 */
	setActiveConfig(id: string): boolean {
		if (!this.configs.has(id)) {
			return false;
		}
		this.activeConfigId = id;
		return true;
	}

	/**
	 * List all available configurations
	 */
	listConfigs(): Array<{ id: string; config: ModelConfig }> {
		return Array.from(this.configs.entries()).map(([id, config]) => ({
			id,
			config,
		}));
	}

	/**
	 * Test model connection
	 */
	async testConnection(id: string): Promise<{
		success: boolean;
		latency?: number;
		error?: string;
	}> {
		const config = this.getConfig(id);
		if (!config) {
			return { success: false, error: "Configuration not found" };
		}

		const startTime = Date.now();

		try {
			// Test connection based on provider
			const response = await this.makeTestRequest(config);
			const latency = Date.now() - startTime;

			return {
				success: response.ok,
				latency,
				error: response.ok ? undefined : await response.text(),
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Make a test request to verify model connectivity
	 */
	private async makeTestRequest(config: ModelConfig): Promise<Response> {
		// For local models (Ollama, LM Studio), use different endpoint
		if (
			config.provider === ModelProvider.OLLAMA ||
			config.provider === ModelProvider.LM_STUDIO
		) {
			return fetch(`${config.baseUrl}/api/tags`, {
				method: "GET",
				signal: AbortSignal.timeout(config.timeout),
			});
		}

		// For cloud providers, make a minimal test request
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (config.apiKey) {
			if (config.provider === ModelProvider.ANTHROPIC) {
				headers["x-api-key"] = config.apiKey;
				headers["anthropic-version"] = "2023-06-01";
			} else {
				headers["Authorization"] = `Bearer ${config.apiKey}`;
			}
		}

		const testPayload = this.getTestPayload(config);

		return fetch(`${config.baseUrl}/chat/completions`, {
			method: "POST",
			headers,
			body: JSON.stringify(testPayload),
			signal: AbortSignal.timeout(config.timeout),
		});
	}

	/**
	 * Get test payload for provider
	 */
	private getTestPayload(config: ModelConfig): unknown {
		const basePayload = {
			model: config.model,
			max_tokens: 10,
			messages: [{ role: "user", content: "test" }],
		};

		if (config.provider === ModelProvider.ANTHROPIC) {
			return {
				...basePayload,
				max_tokens: 10,
			};
		}

		return basePayload;
	}

	/**
	 * Create LangChain-compatible LLM instance from configuration
	 */
	createLLMInstance(configId?: string): unknown {
		const config = configId ? this.getConfig(configId) : this.getActiveConfig();

		if (!config) {
			throw new Error("No active model configuration");
		}

		// Dynamic import based on provider
		switch (config.provider) {
			case ModelProvider.OPENAI:
				return this.createOpenAIInstance(config);
			case ModelProvider.ANTHROPIC:
				return this.createAnthropicInstance(config);
			case ModelProvider.OLLAMA:
				return this.createOllamaInstance(config);
			default:
				throw new Error(`Unsupported provider: ${config.provider}`);
		}
	}

	/**
	 * Create OpenAI LLM instance
	 */
	private createOpenAIInstance(config: ModelConfig): unknown {
		// This would use @langchain/openai
		return {
			_type: "openai",
			modelName: config.model,
			temperature: config.temperature,
			maxTokens: config.maxTokens,
			openAIApiKey: config.apiKey,
			configuration: {
				baseURL: config.baseUrl,
			},
			streaming: config.enableStreaming,
		};
	}

	/**
	 * Create Anthropic LLM instance
	 */
	private createAnthropicInstance(config: ModelConfig): unknown {
		// This would use @langchain/anthropic
		return {
			_type: "anthropic",
			modelName: config.model,
			temperature: config.temperature,
			maxTokens: config.maxTokens,
			anthropicApiKey: config.apiKey,
			clientOptions: {
				baseURL: config.baseUrl,
			},
			streaming: config.enableStreaming,
		};
	}

	/**
	 * Create Ollama LLM instance
	 */
	private createOllamaInstance(config: ModelConfig): unknown {
		// This would use @langchain/community/llms/ollama
		return {
			_type: "ollama",
			model: config.model,
			temperature: config.temperature,
			numPredict: config.maxTokens,
			baseUrl: config.baseUrl,
		};
	}

	/**
	 * Load configurations from JSON file
	 * Note: Only available in Node.js environments (server-side)
	 */
	async loadFromFile(filePath: string): Promise<void> {
		// Check if we're in a Node.js environment
		if (typeof window !== "undefined") {
			throw new Error(
				"loadFromFile is only available in Node.js environments. Use localStorage in browser.",
			);
		}

		try {
			const fs = await import("fs/promises");
			const content = await fs.readFile(filePath, "utf-8");
			const data = JSON.parse(content);

			if (data.models && Array.isArray(data.models)) {
				for (const modelConfig of data.models) {
					const config = ModelConfigSchema.parse(modelConfig.config);
					this.addConfig(modelConfig.id, config);
				}
			}

			if (data.defaultModel) {
				this.setActiveConfig(data.defaultModel);
			}
		} catch (error) {
			console.error("Failed to load model configurations from file:", error);
			throw error;
		}
	}

	/**
	 * Export configurations to JSON
	 */
	exportToJSON(): string {
		const configs = this.listConfigs();
		return JSON.stringify(
			{
				defaultModel: this.activeConfigId,
				models: configs,
			},
			null,
			2,
		);
	}

	/**
	 * Fetch available models dynamically from provider API
	 * This replaces hardcoded model lists with real-time detection
	 */
	async fetchAvailableModels(provider: ModelProvider, config: Partial<ModelConfig>): Promise<string[]> {
		try {
			const baseUrl = config.baseUrl || ProviderDefaults[provider].baseUrl;
			const apiKey = config.apiKey;

			// Handle local providers with /models endpoint
			if (provider === ModelProvider.OLLAMA || provider === ModelProvider.LM_STUDIO) {
				const modelsUrl = baseUrl?.replace('/v1', '') + '/api/tags';
				const response = await fetch(modelsUrl, {
					method: 'GET',
					signal: AbortSignal.timeout(5000),
				});

				if (response.ok) {
					const data = await response.json() as { models: Array<{ name: string }> };
					return data.models.map(m => m.name);
				}
			}

			// Handle vLLM, GGUF, ONNX (OpenAI-compatible /v1/models)
			if (provider === ModelProvider.VLLM || provider === ModelProvider.GGUF || provider === ModelProvider.ONNX) {
				const modelsUrl = `${baseUrl}/models`;
				const response = await fetch(modelsUrl, {
					method: 'GET',
					signal: AbortSignal.timeout(5000),
				});

				if (response.ok) {
					const data = await response.json() as { data: Array<{ id: string }> };
					return data.data.map(m => m.id);
				}
			}

			// Handle cloud providers with /v1/models endpoint
			if (provider === ModelProvider.OPENAI || provider === ModelProvider.DEEPSEEK ||
				provider === ModelProvider.MOONSHOT || provider === ModelProvider.KIMI) {
				const modelsUrl = `${baseUrl}/models`;
				const headers: Record<string, string> = {
					'Content-Type': 'application/json',
				};

				if (apiKey) {
					headers['Authorization'] = `Bearer ${apiKey}`;
				}

				const response = await fetch(modelsUrl, {
					method: 'GET',
					headers,
					signal: AbortSignal.timeout(5000),
				});

				if (response.ok) {
					const data = await response.json() as { data: Array<{ id: string }> };
					return data.data.map(m => m.id);
				}
			}

			// Anthropic doesn't have a /models endpoint, return defaults
			if (provider === ModelProvider.ANTHROPIC) {
				return AVAILABLE_MODELS.Anthropic as unknown as string[];
			}

			// Google uses different API structure
			if (provider === ModelProvider.GOOGLE) {
				return AVAILABLE_MODELS.Google as unknown as string[];
			}

			// Fall back to static list if API call fails
			console.warn(`[ModelConfig] Could not fetch models for ${provider}, using defaults`);
			return [];

		} catch (error) {
			console.warn(`[ModelConfig] Error fetching models for ${provider}:`, error);
			return [];
		}
	}

	/**
	 * Detect newly available local models
	 * Returns models that weren't in the previous list
	 */
	async detectNewModels(provider: ModelProvider, config: Partial<ModelConfig>, previousModels: string[] = []): Promise<string[]> {
		const currentModels = await this.fetchAvailableModels(provider, config);
		return currentModels.filter(model => !previousModels.includes(model));
	}
}

// Singleton instance
export const modelConfig = new ModelConfigManager();
