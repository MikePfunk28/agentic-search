/**
 * Tests for unified AI SDK provider adapter
 *
 * Validates:
 * - createAIModelInstance returns a model for each supported provider
 * - SSRF validation on baseUrl
 * - Local providers use OpenAI-compatible API
 * - Fallback to ProviderDefaults when baseUrl is missing
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { ModelProvider } from "../../src/lib/model-config";
import type { ModelConfig } from "../../src/lib/model-config";
import { createAIModelInstance } from "../../src/lib/ai/unified-provider";

// Mock the AI SDK provider factories
vi.mock("@ai-sdk/openai", () => ({
	createOpenAI: vi.fn(
		(opts: { baseURL?: string; apiKey?: string }) =>
			(model: string) => ({
				_type: "openai-model",
				model,
				baseURL: opts.baseURL,
				apiKey: opts.apiKey,
			}),
	),
}));

vi.mock("@ai-sdk/anthropic", () => ({
	createAnthropic: vi.fn(
		(opts: { baseURL?: string; apiKey?: string }) =>
			(model: string) => ({
				_type: "anthropic-model",
				model,
				baseURL: opts.baseURL,
				apiKey: opts.apiKey,
			}),
	),
}));

vi.mock("@ai-sdk/google", () => ({
	createGoogleGenerativeAI: vi.fn(
		(opts: { baseURL?: string; apiKey?: string }) =>
			(model: string) => ({
				_type: "google-model",
				model,
				baseURL: opts.baseURL,
				apiKey: opts.apiKey,
			}),
	),
}));

// Mock URL validation to not actually block anything in tests
vi.mock("../../src/lib/url-validation", () => ({
	validateServerFetchUrlAsync: vi.fn(async () => undefined),
	validateServerFetchUrl: vi.fn(() => undefined),
}));

function makeConfig(
	provider: ModelProvider,
	overrides?: Partial<ModelConfig>,
): ModelConfig {
	return {
		provider,
		model: "test-model",
		temperature: 0.7,
		maxTokens: 4096,
		timeout: 60000,
		enableStreaming: false,
		...overrides,
	};
}

describe("createAIModelInstance", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("creates OpenAI model instance", async () => {
		const config = makeConfig(ModelProvider.OPENAI, {
			apiKey: "sk-test-key",
			baseUrl: "https://api.openai.com/v1",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("openai-model");
		expect((model as any).model).toBe("test-model");
	});

	test("creates Anthropic model instance", async () => {
		const config = makeConfig(ModelProvider.ANTHROPIC, {
			apiKey: "sk-ant-test",
			baseUrl: "https://api.anthropic.com",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("anthropic-model");
		expect((model as any).baseURL).toBe("https://api.anthropic.com/v1");
	});

	test("normalizes Anthropic-compatible custom base URLs", async () => {
		const config = makeConfig(ModelProvider.ANTHROPIC, {
			apiKey: "sk-ant-test",
			baseUrl: "https://api.z.ai/api/anthropic",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("anthropic-model");
		expect((model as any).baseURL).toBe("https://api.z.ai/api/anthropic/v1");
	});

	test("creates Google model instance", async () => {
		const config = makeConfig(ModelProvider.GOOGLE, {
			apiKey: "AIza-test",
			baseUrl: "https://generativelanguage.googleapis.com/v1",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("google-model");
	});

	test("creates Ollama model with OpenAI-compatible API", async () => {
		const config = makeConfig(ModelProvider.OLLAMA, {
			baseUrl: "http://localhost:11434/v1",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("openai-model");
		// Local providers should use "local" as placeholder API key
		expect((model as any).apiKey).toBe("local");
	});

	test("creates LM Studio model with OpenAI-compatible API", async () => {
		const config = makeConfig(ModelProvider.LM_STUDIO, {
			baseUrl: "http://localhost:1234/v1",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("openai-model");
	});

	test("creates Azure OpenAI model", async () => {
		const config = makeConfig(ModelProvider.AZURE_OPENAI, {
			apiKey: "azure-key",
			baseUrl: "https://my-resource.openai.azure.com",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("openai-model");
	});

	test("creates DeepSeek model with OpenAI-compatible API", async () => {
		const config = makeConfig(ModelProvider.DEEPSEEK, {
			apiKey: "ds-key",
			baseUrl: "https://api.deepseek.com/v1",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("openai-model");
	});

	test("unknown provider falls back to OpenAI-compatible", async () => {
		const config = makeConfig("custom_provider" as ModelProvider, {
			apiKey: "custom-key",
			baseUrl: "https://custom.api.com/v1",
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		expect((model as any)._type).toBe("openai-model");
	});

	test("uses ProviderDefaults when baseUrl is missing", async () => {
		const config = makeConfig(ModelProvider.OPENAI, {
			apiKey: "sk-key",
			// No baseUrl - should use ProviderDefaults
		});

		const model = await createAIModelInstance(config);
		expect(model).toBeDefined();
		// Should have used the default URL from ProviderDefaults
		expect((model as any).baseURL).toBe("https://api.openai.com/v1");
	});

	test("validates baseUrl via SSRF check", async () => {
		const { validateServerFetchUrlAsync } = await import(
			"../../src/lib/url-validation"
		);

		const config = makeConfig(ModelProvider.OPENAI, {
			apiKey: "sk-key",
			baseUrl: "https://api.openai.com/v1",
		});

		await createAIModelInstance(config);
		expect(validateServerFetchUrlAsync).toHaveBeenCalledWith(
			"https://api.openai.com/v1",
		);
	});
});
