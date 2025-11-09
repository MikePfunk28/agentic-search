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
	OLLAMA = "ollama",
	LM_STUDIO = "lm_studio",
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

// Provider-specific default configurations
export const ProviderDefaults: Record<ModelProvider, Partial<ModelConfig>> = {
	[ModelProvider.OPENAI]: {
		baseUrl: "https://api.openai.com/v1",
		model: "gpt-4-turbo-preview",
		temperature: 0.7,
		maxTokens: 4096,
	},
	[ModelProvider.ANTHROPIC]: {
		baseUrl: "https://api.anthropic.com",
		model: "claude-3-5-sonnet-20241022",
		temperature: 0.7,
		maxTokens: 4096,
	},
	[ModelProvider.GOOGLE]: {
		baseUrl: "https://generativelanguage.googleapis.com/v1",
		model: "gemini-pro",
		temperature: 0.7,
		maxTokens: 2048,
	},
	[ModelProvider.OLLAMA]: {
		baseUrl: "http://localhost:11434",
		model: "llama2",
		temperature: 0.7,
		maxTokens: 2048,
	},
	[ModelProvider.LM_STUDIO]: {
		baseUrl: "http://localhost:1234/v1",
		model: "local-model",
		temperature: 0.7,
		maxTokens: 2048,
	},
	[ModelProvider.AZURE_OPENAI]: {
		model: "gpt-4",
		temperature: 0.7,
		maxTokens: 4096,
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
	 */
	async loadFromFile(filePath: string): Promise<void> {
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
}

// Singleton instance
export const modelConfig = new ModelConfigManager();
