/**
 * DeepSeek Vision OCR Module
 *
 * Extracts text from images using vision-capable AI models.
 * Supports: DeepSeek, OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini).
 *
 * The extracted text is returned as markdown with token compression metrics,
 * compatible with the OCRResult type used throughout the platform.
 */

import { generateText } from "ai";
import { createAIModelInstance } from "../ai/unified-provider";
import { ModelProvider, type ModelConfig } from "../model-config";

/**
 * Configuration for vision-based OCR extraction.
 */
export interface VisionOCRConfig {
	provider: string;
	model: string;
	apiKey?: string;
	baseUrl?: string;
	temperature?: number;
	maxTokens?: number;
}

/**
 * Result of a vision OCR extraction, matching the platform's OCRResult shape.
 */
export interface VisionOCRResult {
	markdown: string;
	originalTokens: number;
	compressedTokens: number;
	savings: number; // Percentage 0-100
	confidence: number; // 0-1
}

/** Approximate token count (~4 chars per token). */
export function estimateTokens(text: string): number {
	return Math.ceil(text.length / 4);
}

/** Providers known to support vision/multimodal input. */
const VISION_PROVIDERS = new Set([
	"openai",
	"anthropic",
	"google",
	"deepseek",
	"azure_openai",
	"openrouter",
]);

/**
 * Check whether a provider string is known to support vision input.
 */
export function isVisionCapable(provider: string): boolean {
	return VISION_PROVIDERS.has(provider);
}

/**
 * Extract text from an image using a vision-capable AI model.
 *
 * @param imageSource - HTTPS URL or data-URI (base64) of the image
 * @param config - Provider, model, and credentials
 * @returns VisionOCRResult with extracted markdown and metrics
 */
export async function extractTextFromImage(
	imageSource: string,
	config: VisionOCRConfig,
): Promise<VisionOCRResult> {
	// Validate that cloud providers have an API key
	const localProviders = ["ollama", "lm_studio", "vllm", "gguf", "onnx"];
	if (!localProviders.includes(config.provider) && !config.apiKey) {
		throw new Error(
			`API key required for ${config.provider} vision OCR`,
		);
	}

	// Build the ModelConfig for the unified provider
	const modelConfig: ModelConfig = {
		provider: (config.provider as ModelProvider) || ModelProvider.DEEPSEEK,
		model: config.model,
		apiKey: config.apiKey,
		baseUrl: config.baseUrl,
		temperature: config.temperature ?? 0.2,
		maxTokens: config.maxTokens ?? 4096,
		timeout: 120000,
		enableStreaming: false,
	};

	const model = await createAIModelInstance(modelConfig);

	// Determine image content block based on source type
	const isBase64 = imageSource.startsWith("data:");
	const imageContent = isBase64
		? { type: "image" as const, image: imageSource }
		: { type: "image" as const, image: new URL(imageSource) };

	const result = await generateText({
		model: model as any,
		messages: [
			{
				role: "user",
				content: [
					imageContent,
					{
						type: "text" as const,
						text: `Extract ALL text from this image and convert it to clean, well-structured markdown.

REQUIREMENTS:
- Preserve ALL visible text including headers, body text, captions, labels, and footnotes
- Maintain the document's logical structure with appropriate markdown headings
- Preserve tables as markdown tables
- Keep all numbers, dates, and special characters exactly as shown
- If there are multiple columns, merge them in reading order
- Output ONLY the extracted markdown, no commentary

EXTRACTED MARKDOWN:`,
					},
				],
			},
		],
		temperature: modelConfig.temperature,
		maxOutputTokens: modelConfig.maxTokens,
	});

	const extractedMarkdown = result.text.trim();
	const compressedTokens = estimateTokens(extractedMarkdown);

	// Estimate original tokens: for images, use the API-reported token usage
	// as the "original" cost, since the image itself consumes tokens
	const originalTokens = result.usage?.totalTokens ?? compressedTokens * 3;

	// Savings: how much the extracted text reduces future context usage
	// compared to passing the raw image each time
	const savings =
		originalTokens > 0
			? Math.max(
					0,
					((originalTokens - compressedTokens) / originalTokens) * 100,
				)
			: 0;

	// Confidence: based on output quality heuristics
	const confidence = calculateConfidence(extractedMarkdown);

	return {
		markdown: extractedMarkdown,
		originalTokens,
		compressedTokens,
		savings,
		confidence,
	};
}

/**
 * Heuristic confidence score for the extraction quality.
 * Higher when the output is non-trivial, has structure, and contains typical document markers.
 */
function calculateConfidence(markdown: string): number {
	if (!markdown || markdown.length < 10) return 0.1;

	let score = 0.5;

	// Bonus for substantial content
	if (markdown.length > 100) score += 0.1;
	if (markdown.length > 500) score += 0.1;

	// Bonus for markdown structure (headings, lists, tables)
	if (/^#{1,3}\s/m.test(markdown)) score += 0.1;
	if (/^[-*]\s/m.test(markdown)) score += 0.05;
	if (/\|.+\|/m.test(markdown)) score += 0.05;

	// Penalty for very short or single-line output
	const lines = markdown.split("\n").filter((l) => l.trim().length > 0);
	if (lines.length < 3) score -= 0.15;

	return Math.max(0.1, Math.min(1.0, score));
}
