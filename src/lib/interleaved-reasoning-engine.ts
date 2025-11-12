/**
 * Interleaved Reasoning Engine
 * 
 * Uses qwen3:4b as orchestrator to coordinate step-by-step reasoning.
 * Each step is validated before proceeding to the next.
 * 
 * Security features:
 * - Input sanitization
 * - Rate limiting
 * - Result validation
 * - Error containment
 */

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { AdversarialDifferentialDiscriminator } from "./add-discriminator";
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

export interface ReasoningConfig {
	orchestratorModel: string;
	validatorModel: string;
	maxSteps: number;
	minConfidenceThreshold: number;
	enableSecurityChecks: boolean;
	timeoutMs: number;
}

const DEFAULT_REASONING_CONFIG: ReasoningConfig = {
	orchestratorModel: "qwen3:4b",
	validatorModel: "qwen3:1.7b",
	maxSteps: 10,
	minConfidenceThreshold: 0.6,
	enableSecurityChecks: true,
	timeoutMs: 60000,
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
		/javascript:/i,
		/onerror=/i,
		/onclick=/i,
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
		// Remove control characters
		let sanitized = input.replace(/[\x00-\x1F\x7F]/g, "");

		// Encode HTML entities
		sanitized = sanitized
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#x27;");

		return sanitized.substring(0, this.maxInputLength);
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
	private ollama: ReturnType<typeof createOpenAI>;
	private securityValidator: SecurityValidator;
	private rateLimiter: RateLimiter;
	private discriminator: AdversarialDifferentialDiscriminator;

	constructor(
		config: Partial<ReasoningConfig> = {},
		baseUrl: string = "http://localhost:11434",
	) {
		this.config = { ...DEFAULT_REASONING_CONFIG, ...config };
		// Use OpenAI-compatible API for Ollama
		this.ollama = createOpenAI({
			baseURL: `${baseUrl}/v1`,
			apiKey: 'ollama', // Ollama doesn't require a real API key
		});
		this.securityValidator = new SecurityValidator();
		this.rateLimiter = new RateLimiter();
		this.discriminator = new AdversarialDifferentialDiscriminator();
	}

	/**
	 * Execute interleaved reasoning with step-by-step validation
	 */
	async reason(
		query: string,
		context?: { searchResults?: SearchResult[]; previousSteps?: ReasoningStep[] },
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
		context?: { searchResults?: SearchResult[]; previousSteps?: ReasoningStep[] },
	): Promise<ReasoningStep> {
		const stepId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const timestamp = Date.now();

		try {
			// Check timeout
			const timeoutPromise = new Promise<never>((_, reject) =>
				setTimeout(
					() => reject(new Error("Step timeout")),
					this.config.timeoutMs / this.config.maxSteps,
				),
			);

			// Execute with orchestrator
			const resultPromise = generateText({
				model: this.ollama(this.config.orchestratorModel),
				prompt: input,
				temperature: 0.7,
				maxTokens: 1000,
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
		context?: { searchResults?: SearchResult[]; previousSteps?: ReasoningStep[] },
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

		// Length validation
		if (output.length < 10) {
			errors.push("Output too short");
			confidence -= 0.3;
		}

		// Type-specific validation
		switch (type) {
			case "analysis":
				if (!output.toLowerCase().includes("component") && !output.toLowerCase().includes("part")) {
					confidence -= 0.1;
				}
				break;
			case "planning":
				if (!output.toLowerCase().includes("step") && !output.toLowerCase().includes("plan")) {
					confidence -= 0.1;
				}
				break;
			case "validation":
				if (!output.toLowerCase().includes("valid") && !output.toLowerCase().includes("correct")) {
					confidence -= 0.1;
				}
				break;
		}

		// Use validator model for additional check
		if (confidence >= this.config.minConfidenceThreshold) {
			try {
				const validatorCheck = await generateText({
					model: this.ollama(this.config.validatorModel),
					prompt: `Validate this output: "${output}". Respond with "VALID" or "INVALID" and briefly explain why.`,
					temperature: 0.2,
					maxTokens: 100,
				});

				if (validatorCheck.text.toLowerCase().includes("invalid")) {
					confidence -= 0.2;
					errors.push("Validator flagged output as invalid");
				}
			} catch (error) {
				// Validator error doesn't fail the step
				console.warn("Validator check failed:", error);
			}
		}

		const valid = confidence >= this.config.minConfidenceThreshold && errors.length === 0;

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

		const finalOutput =
			steps.length > 0 ? steps[steps.length - 1].output : "";

		return {
			steps,
			finalOutput,
			overallConfidence: avgConfidence,
			success,
			errors,
			totalTokens,
			processingTime: Date.now() - startTime,
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
			const response = await fetch(
				`${this.ollama.baseURL ?? "http://localhost:11434"}/api/tags`,
			);

			// Validate HTTP response status (200-299 range)
			if (!response.ok || response.status < 200 || response.status >= 300) {
				return {
					healthy: false,
					orchestratorAvailable: false,
					validatorAvailable: false,
				};
			}

			const data = await response.json();
			const models = data.models?.map((m: { name: string }) => m.name) ?? [];

			return {
				healthy: true,
				orchestratorAvailable: models.includes(
					this.config.orchestratorModel,
				),
				validatorAvailable: models.includes(this.config.validatorModel),
			};
		} catch (error) {
			return {
				healthy: false,
				orchestratorAvailable: false,
				validatorAvailable: false,
			};
		}
	}
}
