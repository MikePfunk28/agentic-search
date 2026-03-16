/**
 * Interleaved Reasoning Engine
 *
 * Uses the user's active model as orchestrator to coordinate step-by-step reasoning.
 * Each step is validated before proceeding to the next.
 *
 * Security features:
 * - Input sanitization
 * - Rate limiting
 * - Result validation
 * - Error containment
 */

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { AdversarialDifferentialDiscriminator } from "./add-discriminator";
import { sanitizeInput } from "@/lib/security/input-sanitization";
import type { SearchResult } from "./types";

export interface ReasoningStep {
	id: string;
	type: "analysis" | "planning" | "execution" | "validation" | "synthesis";
	input: string;
	output: string;
	confidence: number;
	validated: boolean;
	validationErrors: string[];
	timestamp: number;
	tokenCount: number;
}

export interface ReasoningResult {
	steps: ReasoningStep[];
	finalOutput: string;
	overallConfidence: number;
	success: boolean;
	errors: string[];
	totalTokens: number;
	processingTime: number;
}

export interface ReasoningHyperparameters {
	temperature: number;
	maxTokens: number;
	topP?: number;
}

export interface ReasoningConfig {
	orchestratorModel: string;
	validatorModel: string;
	maxSteps: number;
	minConfidenceThreshold: number;
	enableSecurityChecks: boolean;
	timeoutMs: number;
	stepTimeoutMs: number; // Per-step timeout, independent of total
	hyperparameters: Record<ReasoningStep["type"], ReasoningHyperparameters>;
}

const DEFAULT_REASONING_CONFIG: ReasoningConfig = {
	orchestratorModel: "", // Uses the active model from user config, never hardcoded
	validatorModel: "", // Uses the active model from user config, never hardcoded
	maxSteps: 10,
	minConfidenceThreshold: 0.6,
	enableSecurityChecks: true,
	timeoutMs: 120000,
	stepTimeoutMs: 30000, // 30s per step is generous for most models
	hyperparameters: {
		analysis: { temperature: 0.3, maxTokens: 800 },
		planning: { temperature: 0.4, maxTokens: 600 },
		execution: { temperature: 0.7, maxTokens: 1500 },
		validation: { temperature: 0.2, maxTokens: 500 },
		synthesis: { temperature: 0.5, maxTokens: 1200 },
	},
};

/**
 * Security validator for input sanitization
 */
class SecurityValidator {
	private readonly maxInputLength = 10000;
	private readonly dangerousPatterns = [
		/\bexec\b/i,
		/\beval\b/i,
		/<script/i,
		/<(img|svg|iframe)\b/i,
		/javascript:/i,
		/on\w+\s*=\s*/i, // catch event handlers like onerror, onload, onclick, etc.
	];

	validate(input: string): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		// Length check
		if (input.length > this.maxInputLength) {
			errors.push(
				`Input exceeds maximum length of ${this.maxInputLength} characters`,
			);
		}

		// Pattern checks
		for (const pattern of this.dangerousPatterns) {
			if (pattern.test(input)) {
				errors.push(
					`Input contains potentially dangerous pattern: ${pattern.source}`,
				);
			}
		}

		return {
			valid: errors.length === 0,
			errors,
		};
	}

	sanitize(input: string): string {
		return sanitizeInput(input, { maxLength: this.maxInputLength });
	}
}

/**
 * Rate limiter for API calls
 */
class RateLimiter {
	private requests: number[] = [];
	private readonly maxRequestsPerMinute = 60;
	private readonly windowMs = 60000;

	canProceed(): boolean {
		const now = Date.now();
		this.requests = this.requests.filter((time) => now - time < this.windowMs);

		if (this.requests.length >= this.maxRequestsPerMinute) {
			return false;
		}

		this.requests.push(now);
		return true;
	}

	getRemainingRequests(): number {
		const now = Date.now();
		this.requests = this.requests.filter((time) => now - time < this.windowMs);
		return Math.max(0, this.maxRequestsPerMinute - this.requests.length);
	}
}

export class InterleavedReasoningEngine {
	private config: ReasoningConfig;
	private client: ReturnType<typeof createOpenAI>;
	private baseUrl: string;
	private apiKey: string;
	private securityValidator: SecurityValidator;
	private rateLimiter: RateLimiter;

	constructor(
		config: Partial<ReasoningConfig> = {},
		baseUrl: string = "http://localhost:11434",
		apiKey: string = "ollama",
	) {
		this.config = {
			...DEFAULT_REASONING_CONFIG,
			...config,
			hyperparameters: {
				...DEFAULT_REASONING_CONFIG.hyperparameters,
				...(config.hyperparameters || {}),
			},
		};
		const normalizedBaseUrl = baseUrl
			.replace(/\/chat\/completions\/?$/, "")
			.replace(/\/models\/?$/, "")
			.replace(/\/+$/, "");

		// Detect if the URL already has a versioned API path (e.g., /v1, /v4)
		const hasVersionPath = /\/v\d+$/.test(normalizedBaseUrl);
		this.baseUrl = hasVersionPath
			? normalizedBaseUrl.replace(/\/v\d+$/, "")
			: normalizedBaseUrl.replace(/\/v1\/?$/, "");

		const apiBaseUrl = hasVersionPath
			? normalizedBaseUrl
			: `${this.baseUrl}/v1`;
		this.apiKey = apiKey || "ollama";
		this.client = createOpenAI({
			baseURL: apiBaseUrl,
			apiKey: this.apiKey,
		});
		this.securityValidator = new SecurityValidator();
		this.rateLimiter = new RateLimiter();
		// AdversarialDifferentialDiscriminator available for future quality scoring
	}

	/**
	 * Execute interleaved reasoning with step-by-step validation
	 */
	async reason(
		query: string,
		context?: {
			searchResults?: SearchResult[];
			previousSteps?: ReasoningStep[];
		},
	): Promise<ReasoningResult> {
		const startTime = Date.now();
		const steps: ReasoningStep[] = [];
		const errors: string[] = [];

		// Security check
		if (this.config.enableSecurityChecks) {
			const validation = this.securityValidator.validate(query);
			if (!validation.valid) {
				return {
					steps: [],
					finalOutput: "",
					overallConfidence: 0,
					success: false,
					errors: validation.errors,
					totalTokens: 0,
					processingTime: Date.now() - startTime,
				};
			}

			// Sanitize input
			query = this.securityValidator.sanitize(query);
		}

		// Rate limiting
		if (!this.rateLimiter.canProceed()) {
			errors.push(
				`Rate limit exceeded. ${this.rateLimiter.getRemainingRequests()} requests remaining.`,
			);
			return {
				steps: [],
				finalOutput: "",
				overallConfidence: 0,
				success: false,
				errors,
				totalTokens: 0,
				processingTime: Date.now() - startTime,
			};
		}

		// Require a configured model — fail fast if none is set.
		// Model config always comes from the user's settings, never from defaults.
		if (!this.config.orchestratorModel) {
			errors.push(
				"No orchestrator model configured. Please set a model in your AI settings before using reasoning.",
			);
			return {
				steps: [],
				finalOutput: "",
				overallConfidence: 0,
				success: false,
				errors,
				totalTokens: 0,
				processingTime: Date.now() - startTime,
			};
		}

		// Ensure the orchestrator model endpoint is reachable before running heavy reasoning.
		const health = await this.healthCheck();
		if (!health.orchestratorAvailable) {
			errors.push("Orchestrator model is not available for reasoning.");
			return {
				steps: [],
				finalOutput: "",
				overallConfidence: 0,
				success: false,
				errors,
				totalTokens: 0,
				processingTime: Date.now() - startTime,
			};
		}

		try {
			// Step 1: Analysis
			const analysisStep = await this.executeStep(
				"analysis",
				`Analyze the following query and break it down into logical components:\n\nQuery: ${query}`,
				context,
			);
			steps.push(analysisStep);

			if (!analysisStep.validated) {
				errors.push("Analysis step failed validation");
				return this.buildResult(steps, errors, startTime, false);
			}

			// Step 2: Planning
			const planningStep = await this.executeStep(
				"planning",
				`Based on this analysis:\n${analysisStep.output}\n\nCreate a step-by-step plan to answer the query.`,
				context,
			);
			steps.push(planningStep);

			if (!planningStep.validated) {
				errors.push("Planning step failed validation");
				return this.buildResult(steps, errors, startTime, false);
			}

			// Step 3: Execution (may involve multiple sub-steps)
			const executionStep = await this.executeStep(
				"execution",
				`Execute this plan:\n${planningStep.output}\n\nProvide a comprehensive answer.${
					context?.searchResults
						? `\n\nAvailable search results:\n${JSON.stringify(context.searchResults.slice(0, 3))}`
						: ""
				}`,
				context,
			);
			steps.push(executionStep);

			if (!executionStep.validated) {
				errors.push("Execution step failed validation");
				return this.buildResult(steps, errors, startTime, false);
			}

			// Step 4: Validation
			const validationStep = await this.executeStep(
				"validation",
				`Validate the following answer for accuracy and completeness:\n${executionStep.output}\n\nOriginal query: ${query}`,
				context,
			);
			steps.push(validationStep);

			// Step 5: Synthesis
			const synthesisStep = await this.executeStep(
				"synthesis",
				`Synthesize the final answer:\n${executionStep.output}\n\nValidation notes: ${validationStep.output}`,
				context,
			);
			steps.push(synthesisStep);

			return this.buildResult(steps, errors, startTime, true);
		} catch (error) {
			errors.push(`Reasoning engine error: ${error}`);
			return this.buildResult(steps, errors, startTime, false);
		}
	}

	/**
	 * Execute a single reasoning step
	 */
	private async executeStep(
		type: ReasoningStep["type"],
		input: string,
		context?: {
			searchResults?: SearchResult[];
			previousSteps?: ReasoningStep[];
		},
	): Promise<ReasoningStep> {
		const stepId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const timestamp = Date.now();

		try {
			// Per-step timeout — generous enough for slower models
			const timeoutPromise = new Promise<never>((_, reject) =>
				setTimeout(
					() =>
						reject(
							new Error(
								`Step '${type}' timed out after ${this.config.stepTimeoutMs}ms`,
							),
						),
					this.config.stepTimeoutMs,
				),
			);

			// Get hyperparameters for this step type
			const hyper = this.config.hyperparameters[type];

			// Execute with orchestrator using step-specific hyperparameters
			const resultPromise = generateText({
				model: this.client(this.config.orchestratorModel),
				prompt: input,
				temperature: hyper.temperature,
				maxOutputTokens: hyper.maxTokens,
				...(hyper.topP !== undefined ? { topP: hyper.topP } : {}),
			});

			const result = await Promise.race([resultPromise, timeoutPromise]);

			// Validate the output
			const validation = await this.validateStepOutput(
				result.text,
				type,
				context,
			);

			return {
				id: stepId,
				type,
				input,
				output: result.text,
				confidence: validation.confidence,
				validated: validation.valid,
				validationErrors: validation.errors,
				timestamp,
				tokenCount: result.usage?.totalTokens ?? 0,
			};
		} catch (error) {
			return {
				id: stepId,
				type,
				input,
				output: "",
				confidence: 0,
				validated: false,
				validationErrors: [`Step execution failed: ${error}`],
				timestamp,
				tokenCount: 0,
			};
		}
	}

	/**
	 * Validate step output
	 */
	private async validateStepOutput(
		output: string,
		type: ReasoningStep["type"],
		context?: {
			searchResults?: SearchResult[];
			previousSteps?: ReasoningStep[];
		},
	): Promise<{ valid: boolean; confidence: number; errors: string[] }> {
		const errors: string[] = [];
		let confidence = 0.7; // Base confidence

		// Security validation
		if (this.config.enableSecurityChecks) {
			const securityCheck = this.securityValidator.validate(output);
			if (!securityCheck.valid) {
				errors.push(...securityCheck.errors);
				return { valid: false, confidence: 0, errors };
			}
		}

		// Length validation — scale expectation by step type
		const minLengths: Record<string, number> = {
			analysis: 30,
			planning: 30,
			execution: 50,
			validation: 20,
			synthesis: 40,
		};
		const minLen = minLengths[type] || 10;
		if (output.length < minLen) {
			errors.push(
				`Output too short for ${type} step (${output.length} < ${minLen} chars)`,
			);
			confidence -= 0.3;
		}

		// Structural quality checks (not keyword-dependent)
		const sentences = output.split(/[.!?]+/).filter((s) => s.trim().length > 5);
		if (sentences.length < 2 && type !== "validation") {
			confidence -= 0.1; // Single-sentence output is usually low quality
		}

		// Check for repetitive/degenerate output (model might be stuck)
		const words = output.toLowerCase().split(/\s+/);
		if (words.length > 10) {
			const uniqueWords = new Set(words);
			const uniqueRatio = uniqueWords.size / words.length;
			if (uniqueRatio < 0.3) {
				errors.push("Output appears repetitive or degenerate");
				confidence -= 0.4;
			}
		}

		// Query relevance — check if output relates to the search context
		if (
			context?.searchResults &&
			context.searchResults.length > 0 &&
			type === "execution"
		) {
			// Execution step should reference actual search content
			const outputLower = output.toLowerCase();
			const hasRelevantContent = context.searchResults.some(
				(r) =>
					r.title && outputLower.includes(r.title.toLowerCase().split(" ")[0]),
			);
			if (!hasRelevantContent && output.length > 100) {
				confidence -= 0.05; // Minor penalty, not a hard fail
			}
		}

		// Validator model cross-check (only if we have a validator model configured and confidence is marginal)
		if (
			this.config.validatorModel &&
			confidence >= this.config.minConfidenceThreshold &&
			confidence < 0.8
		) {
			try {
				const validatorCheck = await generateText({
					model: this.client(this.config.validatorModel),
					prompt: `Rate the quality of this ${type} output on a scale of 1-10. Just respond with the number.\n\nOutput: "${output.substring(0, 500)}"`,
					temperature: 0.1,
					maxOutputTokens: 20,
				});

				const rating = parseInt(validatorCheck.text.trim(), 10);
				if (!Number.isNaN(rating) && rating >= 1 && rating <= 10) {
					const validatorConfidence = rating / 10;
					// Blend validator rating with existing confidence
					confidence = confidence * 0.7 + validatorConfidence * 0.3;
				}
			} catch {
				// Validator error doesn't fail the step
			}
		}

		const valid =
			confidence >= this.config.minConfidenceThreshold && errors.length === 0;

		return { valid, confidence, errors };
	}

	/**
	 * Build final result
	 */
	private buildResult(
		steps: ReasoningStep[],
		errors: string[],
		startTime: number,
		success: boolean,
	): ReasoningResult {
		const totalTokens = steps.reduce((sum, step) => sum + step.tokenCount, 0);
		const avgConfidence =
			steps.length > 0
				? steps.reduce((sum, step) => sum + step.confidence, 0) / steps.length
				: 0;

		const finalOutput = steps.length > 0 ? steps[steps.length - 1].output : "";

		const processingTime = Math.max(1, Date.now() - startTime);
		return {
			steps,
			finalOutput,
			overallConfidence: avgConfidence,
			success,
			errors,
			totalTokens,
			processingTime,
		};
	}

	/**
	 * Health check
	 */
	async healthCheck(): Promise<{
		healthy: boolean;
		orchestratorAvailable: boolean;
		validatorAvailable: boolean;
	}> {
		try {
			let models: string[] = [];

			try {
				const response = await fetch(`${this.baseUrl}/api/tags`, {
					signal: AbortSignal.timeout(3000),
				});
				if (response.ok) {
					const data = await response.json();
					models = data.models?.map((m: { name: string }) => m.name) ?? [];
				}
			} catch {
				// Fall through to OpenAI-compatible model listing.
			}

			if (models.length === 0) {
				const headers = new Headers();
				if (this.apiKey) {
					headers.set("Authorization", `Bearer ${this.apiKey}`);
				}
				const response = await fetch(`${this.baseUrl}/v1/models`, {
					headers,
					signal: AbortSignal.timeout(3000),
				});
				if (!response.ok || response.status < 200 || response.status >= 300) {
					return {
						healthy: false,
						orchestratorAvailable: false,
						validatorAvailable: false,
					};
				}
				const data = await response.json();
				models = data.data?.map((m: { id: string }) => m.id) ?? [];
			}

			return {
				healthy: true,
				orchestratorAvailable: models.includes(this.config.orchestratorModel),
				validatorAvailable: models.includes(this.config.validatorModel),
			};
		} catch (_error) {
			return {
				healthy: false,
				orchestratorAvailable: false,
				validatorAvailable: false,
			};
		}
	}
}
