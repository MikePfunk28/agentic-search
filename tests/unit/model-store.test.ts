import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchRequestSchema } from "../../src/lib/api-schemas";
import { detectCustomProviderModels } from "../../src/lib/model-store";

describe("detectCustomProviderModels", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns GLM models for Z.AI Anthropic-compatible endpoints", async () => {
		const result = await detectCustomProviderModels(
			"https://api.z.ai/api/anthropic",
			undefined,
			"anthropic",
		);

		expect(result.error).toBeNull();
		expect(result.models).toContain("glm-5");
		expect(result.models).toContain("glm-4.7");
		expect(result.models).not.toContain("claude-sonnet-4.5");
	});

	it("falls back to known Z.AI coding models when /models is unavailable", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ error: "not found" }), {
					status: 404,
					headers: { "Content-Type": "application/json" },
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ error: "bad request" }), {
					status: 400,
					headers: { "Content-Type": "application/json" },
				}),
			);

		vi.stubGlobal("fetch", fetchMock);

		const result = await detectCustomProviderModels(
			"https://api.z.ai/api/coding/paas/v4",
			"zai-test-key",
			"openai-compatible",
			{ preferredModel: "glm-5" },
		);

		expect(result.error).toBeNull();
		expect(result.models[0]).toBe("glm-5");
		expect(result.models).toContain("glm-4.7");
		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			"https://api.z.ai/api/coding/paas/v4/models",
			expect.objectContaining({ method: "GET" }),
		);
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			"https://api.z.ai/api/coding/paas/v4/chat/completions",
			expect.objectContaining({ method: "POST" }),
		);
	});
});

describe("searchRequestSchema", () => {
	it("preserves custom provider protocol for server-side search", () => {
		const parsed = searchRequestSchema.parse({
			query: "latest ai news",
			modelConfig: {
				provider: "custom-123",
				model: "glm-5",
				baseUrl: "https://api.z.ai/api/anthropic",
				protocol: "anthropic",
			},
		});

		expect(parsed.modelConfig?.protocol).toBe("anthropic");
	});
});
