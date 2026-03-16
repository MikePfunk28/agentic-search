import { AVAILABLE_MODELS } from "../model-config";

export type QueryComplexity = "simple" | "moderate" | "complex";

export interface ComplexityAnalysis {
	score: number;
	classification: QueryComplexity;
	factors: {
		length: number;
		hasMultiStepReasoning: boolean;
		hasCodeGeneration: boolean;
		hasCreativeWriting: boolean;
		technicalTerms: number;
		questionComplexity: number;
	};
	confidence: number;
}

export interface RoutingDecision {
	model: string;
	provider: string;
	reason: string;
	estimatedCost: number;
	confidence: number;
	complexity: QueryComplexity;
	fallbackChain: string[];
	timestamp: number;
}

export interface ModelCapabilities {
	supportsVision: boolean;
	supportsTools: boolean;
	maxTokens: number;
	costPer1kInputTokens: number;
	costPer1kOutputTokens: number;
	averageLatencyMs: number;
	isLocal: boolean;
	qualityScore: number;
}

export interface FallbackChain {
	models: Array<{
		model: string;
		provider: string;
		priority: number;
	}>;
	current: number;
	history: Array<{
		from: string;
		to: string;
		reason: string;
		timestamp: number;
	}>;
}

export interface ModelRegistry {
	[key: string]: ModelCapabilities;
}

export interface RoutingHistoryEntry {
	query: string;
	decision: RoutingDecision;
	actualCost?: number;
	success?: boolean;
	feedbackScore?: number;
	timestamp: number;
}

export interface CostBudget {
	dailyLimit: number;
	hourlyLimit: number;
	dailySpent: number;
	hourlySpent: number;
	lastReset: {
		daily: number;
		hourly: number;
	};
}

export interface EnsembleResult {
	responses: Array<{
		model: string;
		provider: string;
		response: string;
		confidence: number;
		latency: number;
	}>;
	aggregatedResponse: string;
	agreementScore: number;
	votingResult: "consensus" | "majority" | "disagreement";
	totalCost: number;
}

export interface EnsembleConfig {
	models: Array<{ model: string; provider: string }>;
	timeoutMs: number;
	minAgreement: number;
	aggregationStrategy: "voting" | "weighted" | "first_valid";
}

export const MODEL_REGISTRY: ModelRegistry = {
	"ollama:*": {
		supportsVision: false,
		supportsTools: false,
		maxTokens: 32000,
		costPer1kInputTokens: 0,
		costPer1kOutputTokens: 0,
		averageLatencyMs: 500,
		isLocal: true,
		qualityScore: 0.7,
	},
	"lm_studio:*": {
		supportsVision: false,
		supportsTools: false,
		maxTokens: 32000,
		costPer1kInputTokens: 0,
		costPer1kOutputTokens: 0,
		averageLatencyMs: 500,
		isLocal: true,
		qualityScore: 0.7,
	},
	"openai:gpt-4o": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 128000,
		costPer1kInputTokens: 2.5 / 1000,
		costPer1kOutputTokens: 10 / 1000,
		averageLatencyMs: 1500,
		isLocal: false,
		qualityScore: 0.95,
	},
	"openai:gpt-4o-mini": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 128000,
		costPer1kInputTokens: 0.15 / 1000,
		costPer1kOutputTokens: 0.6 / 1000,
		averageLatencyMs: 800,
		isLocal: false,
		qualityScore: 0.85,
	},
	"openai:gpt-5.1": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 16000,
		costPer1kInputTokens: 5 / 1000,
		costPer1kOutputTokens: 15 / 1000,
		averageLatencyMs: 2000,
		isLocal: false,
		qualityScore: 0.98,
	},
	"anthropic:claude-3-5-sonnet": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 200000,
		costPer1kInputTokens: 3 / 1000,
		costPer1kOutputTokens: 15 / 1000,
		averageLatencyMs: 2000,
		isLocal: false,
		qualityScore: 0.96,
	},
	"anthropic:claude-3-haiku": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 200000,
		costPer1kInputTokens: 0.25 / 1000,
		costPer1kOutputTokens: 1.25 / 1000,
		averageLatencyMs: 600,
		isLocal: false,
		qualityScore: 0.82,
	},
	"anthropic:claude-sonnet-4.5": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 200000,
		costPer1kInputTokens: 3 / 1000,
		costPer1kOutputTokens: 15 / 1000,
		averageLatencyMs: 1800,
		isLocal: false,
		qualityScore: 0.97,
	},
	"anthropic:claude-haiku-4.5": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 200000,
		costPer1kInputTokens: 0.25 / 1000,
		costPer1kOutputTokens: 1.25 / 1000,
		averageLatencyMs: 500,
		isLocal: false,
		qualityScore: 0.88,
	},
	"google:gemini-2.5-pro": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 1000000,
		costPer1kInputTokens: 1.25 / 1000,
		costPer1kOutputTokens: 10 / 1000,
		averageLatencyMs: 2500,
		isLocal: false,
		qualityScore: 0.95,
	},
	"google:gemini-2.5-flash": {
		supportsVision: true,
		supportsTools: true,
		maxTokens: 1000000,
		costPer1kInputTokens: 0.075 / 1000,
		costPer1kOutputTokens: 0.3 / 1000,
		averageLatencyMs: 800,
		isLocal: false,
		qualityScore: 0.88,
	},
	"deepseek:deepseek-chat": {
		supportsVision: false,
		supportsTools: false,
		maxTokens: 64000,
		costPer1kInputTokens: 0.14 / 1000,
		costPer1kOutputTokens: 0.28 / 1000,
		averageLatencyMs: 1200,
		isLocal: false,
		qualityScore: 0.85,
	},
	"deepseek:deepseek-reasoner": {
		supportsVision: false,
		supportsTools: false,
		maxTokens: 64000,
		costPer1kInputTokens: 0.55 / 1000,
		costPer1kOutputTokens: 2.19 / 1000,
		averageLatencyMs: 3000,
		isLocal: false,
		qualityScore: 0.92,
	},
};

export function getModelCapabilities(
	model: string,
	provider: string,
): ModelCapabilities {
	const key = `${provider}:${model}`;
	if (MODEL_REGISTRY[key]) {
		return MODEL_REGISTRY[key];
	}
	if (provider === "ollama" || provider === "lm_studio") {
		const localKey = `${provider}:*`;
		if (MODEL_REGISTRY[localKey]) {
			return MODEL_REGISTRY[localKey];
		}
	}
	return {
		supportsVision: false,
		supportsTools: false,
		maxTokens: 4096,
		costPer1kInputTokens: 0.01,
		costPer1kOutputTokens: 0.03,
		averageLatencyMs: 1000,
		isLocal: false,
		qualityScore: 0.7,
	};
}

// Model ID helpers — pick stable entries from the single source of truth
const _openaiFirst = AVAILABLE_MODELS.OpenAI[0]; // highest-priority OpenAI model
const _openaiMini = AVAILABLE_MODELS.OpenAI[1]; // second OpenAI model (lighter)
const _anthropicFirst = AVAILABLE_MODELS.Anthropic[0]; // highest-priority Anthropic model
const _anthropicHaiku = AVAILABLE_MODELS.Anthropic.find((m) =>
	m.includes("haiku"),
) ?? AVAILABLE_MODELS.Anthropic[AVAILABLE_MODELS.Anthropic.length - 1];
const _googleFirst = AVAILABLE_MODELS.Google[0]; // highest-priority Google model

export const FALLBACK_CHAINS: Record<QueryComplexity, FallbackChain> = {
	simple: {
		models: [
			{ model: "*", provider: "ollama", priority: 1 },
			{ model: "*", provider: "lm_studio", priority: 2 },
			{ model: _openaiMini, provider: "openai", priority: 3 },
			{ model: _anthropicHaiku, provider: "anthropic", priority: 4 },
		],
		current: 0,
		history: [],
	},
	moderate: {
		models: [
			{ model: "*", provider: "ollama", priority: 1 },
			{ model: _openaiMini, provider: "openai", priority: 2 },
			{ model: _anthropicFirst, provider: "anthropic", priority: 3 },
			{ model: _openaiFirst, provider: "openai", priority: 4 },
		],
		current: 0,
		history: [],
	},
	complex: {
		models: [
			{ model: _anthropicFirst, provider: "anthropic", priority: 1 },
			{ model: _openaiFirst, provider: "openai", priority: 2 },
			{ model: _googleFirst, provider: "google", priority: 3 },
			{ model: _anthropicFirst, provider: "anthropic", priority: 4 },
		],
		current: 0,
		history: [],
	},
};
