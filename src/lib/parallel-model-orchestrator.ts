/**
 * Parallel Model Orchestrator
 * 
 * Runs multiple models in parallel to compare/contrast responses.
 * Uses prompt chaining to refine outputs through multiple reasoning steps.
 * Supports ANY model provider (OpenAI, Anthropic, Google, Ollama, LM Studio, Azure)
 */

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ModelConfig } from "./model-config";

export interface ParallelModelConfig {
	name: string;
	config: ModelConfig;
	role: "validator" | "reasoner" | "synthesizer" | "orchestrator";
}

export interface ModelResponse {
	modelName: string;
	response: string;
	confidence: number;
	tokenCount: number;
	processingTime: number;
	reasoning?: string[];
}

export interface ParallelPromptResult {
	responses: ModelResponse[];
	consensus: string | null;
	confidenceScore: number;
	totalTokens: number;
	totalTime: number;
}

/**
 * Default parallel model configurations for Ollama
 * Users can provide their own configs for any provider
 */
export const DEFAULT_PARALLEL_MODELS: ParallelModelConfig[] = [
	{
		name: "qwen3-1.7b",
		config: {
			provider: "ollama" as const,
			model: "qwen3:1.7b",
			baseUrl: "http://localhost:11434/v1",
			temperature: 0.3,
			maxTokens: 500,
			timeout: 60000,
			enableStreaming: false,
		},
		role: "validator",
	},
	{
		name: "gemma3-1b",
		config: {
			provider: "ollama" as const,
			model: "gemma3:1b",
			baseUrl: "http://localhost:11434/v1",
			temperature: 0.5,
			maxTokens: 500,
			timeout: 60000,
			enableStreaming: false,
		},
		role: "reasoner",
	},
];

export class ParallelModelOrchestrator {
	private modelConfigs: Map<string, ModelConfig> = new Map();

	constructor(configs?: ParallelModelConfig[]) {
		// Initialize with provided configs or defaults
		const modelsToUse = configs || DEFAULT_PARALLEL_MODELS;
		for (const parallelConfig of modelsToUse) {
			this.modelConfigs.set(parallelConfig.name, parallelConfig.config);
		}
	}

	/**
	 * Create provider-specific model instance
	 */
	private createModelInstance(config: ModelConfig): any {
		switch (config.provider) {
			case "openai":
				return createOpenAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			case "anthropic":
				return createAnthropic({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			case "google":
				return createGoogleGenerativeAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			case "ollama":
			case "lm_studio":
				// Use OpenAI-compatible API
				return createOpenAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey || "local", // Local models don't need real keys
				})(config.model);
			case "azure_openai":
				return createOpenAI({
					baseURL: config.baseUrl,
					apiKey: config.apiKey,
				})(config.model);
			default:
				throw new Error(`Unsupported provider: ${config.provider}`);
		}
	}

	/**
	 * Run multiple models in parallel with the same prompt
	 */
	async runParallel(
		prompt: string,
		models: ParallelModelConfig[] = DEFAULT_PARALLEL_MODELS,
	): Promise<ParallelPromptResult> {
		const startTime = Date.now();

		// Execute all models in parallel
		const promises = models.map((config) =>
			this.executeModel(prompt, config),
		);

		const responses = await Promise.all(promises);

		// Calculate consensus
		const consensus = this.calculateConsensus(responses);
		const confidenceScore = this.calculateOverallConfidence(responses);

		const totalTokens = responses.reduce(
			(sum, r) => sum + r.tokenCount,
			0,
		);
		const totalTime = Date.now() - startTime;

		return {
			responses,
			consensus,
			confidenceScore,
			totalTokens,
			totalTime,
		};
	}

	/**
	 * Chain prompts through multiple models sequentially
	 */
	async chainPrompts(
		initialPrompt: string,
		chain: ParallelModelConfig[],
	): Promise<ParallelPromptResult> {
		const responses: ModelResponse[] = [];
		let currentPrompt = initialPrompt;
		const startTime = Date.now();

		for (const config of chain) {
			const response = await this.executeModel(currentPrompt, config);
			responses.push(response);

			// Use the output as input for the next model in the chain
			currentPrompt = `Previous analysis: ${response.response}\n\nBuild upon this analysis to provide deeper insights.`;
		}

		const totalTokens = responses.reduce(
			(sum, r) => sum + r.tokenCount,
			0,
		);
		const totalTime = Date.now() - startTime;

		return {
			responses,
			consensus: responses[responses.length - 1].response,
			confidenceScore: this.calculateOverallConfidence(responses),
			totalTokens,
			totalTime,
		};
	}

	/**
	 * Execute a single model
	 */
	private async executeModel(
		prompt: string,
		parallelConfig: ParallelModelConfig,
	): Promise<ModelResponse> {
		const startTime = Date.now();
		const config = parallelConfig.config;

		try {
			const modelInstance = this.createModelInstance(config);
			
			const result = await generateText({
				model: modelInstance,
				prompt,
				temperature: config.temperature,
				maxTokens: config.maxTokens,
			});

			const processingTime = Date.now() - startTime;

			// Calculate confidence based on response length and coherence
			const confidence = this.estimateConfidence(result.text, parallelConfig.role);

			return {
				modelName: parallelConfig.name,
				response: result.text,
				confidence,
				tokenCount: result.usage?.totalTokens ?? 0,
				processingTime,
			};
		} catch (error) {
			console.error(`Error executing model ${parallelConfig.name}:`, error);

			return {
				modelName: parallelConfig.name,
				response: `Error: Model ${parallelConfig.name} failed to respond`,
				confidence: 0,
				tokenCount: 0,
				processingTime: Date.now() - startTime,
			};
		}
	}

	/**
	 * Calculate consensus from multiple model responses
	 */
	private calculateConsensus(responses: ModelResponse[]): string | null {
		if (responses.length === 0) return null;

		// Weight by confidence
		const weightedResponses = responses
			.filter((r) => r.confidence > 0.5)
			.sort((a, b) => b.confidence - a.confidence);

		if (weightedResponses.length === 0) {
			return responses[0].response; // Fallback to first response
		}

		// Return the highest confidence response
		return weightedResponses[0].response;
	}

	/**
	 * Calculate overall confidence score
	 */
	private calculateOverallConfidence(responses: ModelResponse[]): number {
		if (responses.length === 0) return 0;

		const avgConfidence =
			responses.reduce((sum, r) => sum + r.confidence, 0) /
			responses.length;

		// Check for agreement (responses with similar confidence)
		const confidenceVariance = this.calculateVariance(
			responses.map((r) => r.confidence),
		);
		const agreementBonus = Math.max(0, 0.2 - confidenceVariance);

		return Math.min(1, avgConfidence + agreementBonus);
	}

	/**
	 * Estimate confidence of a single response
	 */
	private estimateConfidence(response: string, role: string): number {
		let confidence = 0.5; // Base confidence

		// Longer, more detailed responses generally more confident
		const wordCount = response.split(/\s+/).length;
		if (wordCount > 50) confidence += 0.1;
		if (wordCount > 100) confidence += 0.1;

		// Presence of uncertainty markers reduces confidence
		const uncertaintyMarkers = [
			"maybe",
			"might",
			"possibly",
			"unclear",
			"uncertain",
		];
		const hasUncertainty = uncertaintyMarkers.some((marker) =>
			response.toLowerCase().includes(marker),
		);
		if (hasUncertainty) confidence -= 0.2;

		// Role-specific adjustments
		if (role === "validator" && response.includes("validated"))
			confidence += 0.1;
		if (role === "reasoner" && response.includes("because"))
			confidence += 0.1;
		if (role === "orchestrator" && response.includes("step"))
			confidence += 0.1;

		return Math.max(0, Math.min(1, confidence));
	}

	/**
	 * Calculate variance of an array of numbers
	 */
	private calculateVariance(numbers: number[]): number {
		if (numbers.length === 0) return 0;

		const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
		const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
		return (
			squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length
		);
	}

	/**
	 * Health check for Ollama connection
	 */
	async healthCheck(): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseUrl}/api/tags`);
			return response.ok;
		} catch (error) {
			console.error("Ollama health check failed:", error);
			return false;
		}
	}

	/**
	 * List available models
	 */
	async listModels(): Promise<string[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/tags`);
			if (!response.ok) return [];

			const data = await response.json();
			return data.models?.map((m: { name: string }) => m.name) ?? [];
		} catch (error) {
			console.error("Failed to list models:", error);
			return [];
		}
	}
}
