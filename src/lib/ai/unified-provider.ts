/**
 * Unified AI SDK Provider Adapter
 *
 * Single entry point for creating AI SDK model instances from ModelConfig.
 * Consolidates the provider switch logic that was duplicated in:
 * - parallel-model-orchestrator.ts (createModelInstance)
 * - interleaved-reasoning-engine.ts (constructor)
 *
 * Supports: OpenAI, Anthropic, Google, Ollama, LM Studio, Azure, DeepSeek,
 * Moonshot, Kimi, OpenRouter, vLLM, GGUF, ONNX, and any OpenAI-compatible API.
 */

import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import {
	type ModelConfig,
	ModelProvider,
	normalizeBaseUrlForProvider,
	ProviderDefaults,
} from "../model-config";
import { validateServerFetchUrlAsync } from "../url-validation";

/**
 * Create an AI SDK LanguageModel instance from a ModelConfig.
 *
 * Resolves the base URL from ProviderDefaults when not provided,
 * validates the URL against SSRF, and returns the correct provider
 * SDK model.
 */
export async function createAIModelInstance(
	config: ModelConfig,
): Promise<ReturnType<ReturnType<typeof createOpenAI>>> {
	const resolvedBaseUrl =
		normalizeBaseUrlForProvider(
			config.provider,
			config.baseUrl ||
				ProviderDefaults[config.provider as ModelProvider]?.baseUrl,
		) || undefined;

	if (resolvedBaseUrl) {
		await validateServerFetchUrlAsync(resolvedBaseUrl);
	}

	switch (config.provider) {
		case ModelProvider.OPENAI:
			return createOpenAI({
				baseURL: resolvedBaseUrl,
				apiKey: config.apiKey,
			})(config.model);

		case ModelProvider.ANTHROPIC:
			return createAnthropic({
				baseURL: resolvedBaseUrl,
				apiKey: config.apiKey,
			})(config.model) as any;

		case ModelProvider.GOOGLE:
			return createGoogleGenerativeAI({
				baseURL: resolvedBaseUrl,
				apiKey: config.apiKey,
			})(config.model) as any;

		case ModelProvider.OLLAMA:
		case ModelProvider.LM_STUDIO:
		case ModelProvider.VLLM:
		case ModelProvider.GGUF:
		case ModelProvider.ONNX:
			// Local models use OpenAI-compatible API
			return createOpenAI({
				baseURL: resolvedBaseUrl,
				apiKey: config.apiKey || "local",
			})(config.model);

		case ModelProvider.AZURE_OPENAI:
		case ModelProvider.DEEPSEEK:
		case ModelProvider.MOONSHOT:
		case ModelProvider.KIMI:
		case ModelProvider.OPENROUTER:
			// Cloud providers with OpenAI-compatible API
			return createOpenAI({
				baseURL: resolvedBaseUrl,
				apiKey: config.apiKey,
			})(config.model);

		default:
			// Custom / unknown providers: treat as OpenAI-compatible
			return createOpenAI({
				baseURL: resolvedBaseUrl,
				apiKey: config.apiKey,
			})(config.model);
	}
}
