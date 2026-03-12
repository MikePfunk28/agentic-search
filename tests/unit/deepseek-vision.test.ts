/**
 * Tests for DeepSeek Vision OCR module
 *
 * Validates:
 * - extractTextFromImage processes images and returns OCRResult
 * - Token estimation and compression calculation
 * - Confidence scoring based on extraction quality
 * - Error handling for missing config / invalid images
 * - isVisionCapable returns correct provider checks
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import {
	extractTextFromImage,
	isVisionCapable,
	estimateTokens,
	type VisionOCRConfig,
	type VisionOCRResult,
} from "../../src/lib/ocr/deepseek-vision";

// Mock the AI SDK generateText
vi.mock("ai", () => ({
	generateText: vi.fn(async () => ({
		text: "# Extracted Document\n\nThis is the extracted text from the image.\n\n## Section 1\n\nImportant details about the document content.\nKey value: 42\nDate: 2025-01-15",
		usage: { totalTokens: 150 },
	})),
}));

// Mock the unified provider
vi.mock("../../src/lib/ai/unified-provider", () => ({
	createAIModelInstance: vi.fn(async () => ({
		_type: "mock-model",
		model: "deepseek-chat",
	})),
}));

describe("estimateTokens", () => {
	test("estimates tokens based on character count", () => {
		expect(estimateTokens("hello world")).toBeGreaterThan(0);
		expect(estimateTokens("")).toBe(0);
		expect(estimateTokens("a".repeat(400))).toBe(100); // ~4 chars per token
	});
});

describe("isVisionCapable", () => {
	test("returns true for vision-capable providers", () => {
		expect(isVisionCapable("openai")).toBe(true);
		expect(isVisionCapable("anthropic")).toBe(true);
		expect(isVisionCapable("google")).toBe(true);
		expect(isVisionCapable("deepseek")).toBe(true);
	});

	test("returns false for non-vision providers", () => {
		expect(isVisionCapable("ollama")).toBe(false);
		expect(isVisionCapable("lm_studio")).toBe(false);
		expect(isVisionCapable("vllm")).toBe(false);
	});
});

describe("extractTextFromImage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("extracts text from image URL and returns VisionOCRResult", async () => {
		const config: VisionOCRConfig = {
			provider: "deepseek",
			model: "deepseek-chat",
			apiKey: "test-key",
			baseUrl: "https://api.deepseek.com/v1",
		};

		const result = await extractTextFromImage(
			"https://example.com/image.png",
			config,
		);

		expect(result).toBeDefined();
		expect(result.markdown).toContain("Extracted Document");
		expect(result.originalTokens).toBeGreaterThan(0);
		expect(result.compressedTokens).toBeGreaterThan(0);
		expect(result.savings).toBeGreaterThanOrEqual(0);
		expect(result.confidence).toBeGreaterThan(0);
		expect(result.confidence).toBeLessThanOrEqual(1);
	});

	test("handles base64 image input", async () => {
		const config: VisionOCRConfig = {
			provider: "openai",
			model: "gpt-4o",
			apiKey: "sk-test",
		};

		const base64Image =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

		const result = await extractTextFromImage(base64Image, config);
		expect(result).toBeDefined();
		expect(result.markdown).toBeTruthy();
	});

	test("throws on missing API key for cloud providers", async () => {
		const config: VisionOCRConfig = {
			provider: "deepseek",
			model: "deepseek-chat",
			// No apiKey
		};

		await expect(
			extractTextFromImage("https://example.com/image.png", config),
		).rejects.toThrow("API key required");
	});

	test("calculates token savings correctly", async () => {
		const config: VisionOCRConfig = {
			provider: "deepseek",
			model: "deepseek-chat",
			apiKey: "test-key",
		};

		const result = await extractTextFromImage(
			"https://example.com/image.png",
			config,
		);

		// Savings should be a percentage between 0 and 100
		expect(result.savings).toBeGreaterThanOrEqual(0);
		expect(result.savings).toBeLessThanOrEqual(100);
	});

	test("includes processing metadata", async () => {
		const config: VisionOCRConfig = {
			provider: "deepseek",
			model: "deepseek-chat",
			apiKey: "test-key",
		};

		const result = await extractTextFromImage(
			"https://example.com/document.jpg",
			config,
		);

		// Result should have all OCRResult fields
		expect(typeof result.markdown).toBe("string");
		expect(typeof result.originalTokens).toBe("number");
		expect(typeof result.compressedTokens).toBe("number");
		expect(typeof result.savings).toBe("number");
		expect(typeof result.confidence).toBe("number");
	});
});
