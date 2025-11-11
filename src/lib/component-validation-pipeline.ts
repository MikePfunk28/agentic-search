/**
 * Component Validation Pipeline
 * 
 * Validates each search component independently before combining:
 * - Retrieval: Search results quality
 * - Reasoning: Logic and coherence
 * - Response: Final answer quality
 * 
 * Security:
 * - Component isolation
 * - Input/output validation
 * - Audit logging
 */

import { AdversarialDifferentialDiscriminator, type ADDScore } from "./add-discriminator";
import type { SearchResult } from "./types";

export interface ComponentValidationResult {
	componentName: string;
	valid: boolean;
	confidence: number;
	errors: string[];
	warnings: string[];
	metrics: Record<string, number>;
	timestamp: number;
}

export interface PipelineResult {
	components: ComponentValidationResult[];
	overallValid: boolean;
	overallConfidence: number;
	canProceed: boolean;
	errors: string[];
	totalProcessingTime: number;
}

export interface ValidationConfig {
	minConfidenceThreshold: number;
	enableStrictMode: boolean;
	logFailures: boolean;
	maxProcessingTime: number;
}

const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
	minConfidenceThreshold: 0.6,
	enableStrictMode: false,
	logFailures: true,
	maxProcessingTime: 30000,
};

/**
 * Base validator interface
 */
interface ComponentValidator {
	validate(): Promise<ComponentValidationResult>;
}

/**
 * Retrieval Component Validator
 * Validates search results quality
 */
class RetrievalValidator implements ComponentValidator {
	constructor(
		private query: string,
		private results: SearchResult[],
		private discriminator: AdversarialDifferentialDiscriminator,
	) {}

	async validate(): Promise<ComponentValidationResult> {
		const startTime = Date.now();
		const errors: string[] = [];
		const warnings: string[] = [];
		const metrics: Record<string, number> = {};

		try {
			// Validate results exist
			if (!this.results || this.results.length === 0) {
				errors.push("No search results provided");
				return this.buildResult(false, 0, errors, warnings, metrics, startTime);
			}

			// Validate result structure
			for (let i = 0; i < this.results.length; i++) {
				const result = this.results[i];
				if (!result.title) {
					warnings.push(`Result ${i} missing title`);
				}
				if (!result.url) {
					errors.push(`Result ${i} missing URL`);
				}
				if (!result.snippet) {
					warnings.push(`Result ${i} missing snippet`);
				}
			}

			// Use ADD to score results quality
			const addScore = this.discriminator.scoreResults(
				this.query,
				this.results,
			);

			metrics.relevanceScore = addScore.relevanceScore;
			metrics.diversityScore = addScore.diversityScore;
			metrics.freshnessScore = addScore.freshnessScore;
			metrics.consistencyScore = addScore.consistencyScore;
			metrics.resultCount = this.results.length;

			// Check for duplicate URLs
			const urls = this.results.map((r) => r.url);
			const uniqueUrls = new Set(urls);
			if (urls.length !== uniqueUrls.size) {
				warnings.push("Duplicate URLs detected in results");
			}

			const confidence = addScore.overallScore;
			const valid = errors.length === 0 && confidence >= 0.5;

			return this.buildResult(valid, confidence, errors, warnings, metrics, startTime);
		} catch (error) {
			errors.push(`Retrieval validation error: ${error}`);
			return this.buildResult(false, 0, errors, warnings, metrics, startTime);
		}
	}

	private buildResult(
		valid: boolean,
		confidence: number,
		errors: string[],
		warnings: string[],
		metrics: Record<string, number>,
		startTime: number,
	): ComponentValidationResult {
		return {
			componentName: "retrieval",
			valid,
			confidence,
			errors,
			warnings,
			metrics,
			timestamp: Date.now() - startTime,
		};
	}
}

/**
 * Reasoning Component Validator
 * Validates logic and coherence of reasoning steps
 */
class ReasoningValidator implements ComponentValidator {
	constructor(
		private reasoningSteps: Array<{ input: string; output: string; confidence: number }>,
	) {}

	async validate(): Promise<ComponentValidationResult> {
		const startTime = Date.now();
		const errors: string[] = [];
		const warnings: string[] = [];
		const metrics: Record<string, number> = {};

		try {
			// Validate steps exist
			if (!this.reasoningSteps || this.reasoningSteps.length === 0) {
				errors.push("No reasoning steps provided");
				return this.buildResult(false, 0, errors, warnings, metrics, startTime);
			}

			metrics.stepCount = this.reasoningSteps.length;

			// Validate each step
			let totalConfidence = 0;
			let invalidSteps = 0;

			for (let i = 0; i < this.reasoningSteps.length; i++) {
				const step = this.reasoningSteps[i];

				if (!step.input || !step.output) {
					errors.push(`Step ${i} missing input or output`);
					invalidSteps++;
					continue;
				}

				if (step.output.length < 10) {
					warnings.push(`Step ${i} has very short output`);
				}

				if (step.confidence < 0.5) {
					warnings.push(`Step ${i} has low confidence (${step.confidence.toFixed(2)})`);
				}

				totalConfidence += step.confidence;

				// Check for logical flow
				if (i > 0) {
					const prevStep = this.reasoningSteps[i - 1];
					// Very basic check: does current step reference previous?
					if (!step.input.includes(prevStep.output.substring(0, 50))) {
						warnings.push(`Step ${i} may not build on previous step`);
					}
				}
			}

			metrics.avgConfidence = totalConfidence / this.reasoningSteps.length;
			metrics.invalidSteps = invalidSteps;

			const confidence = metrics.avgConfidence;
			const valid = errors.length === 0 && confidence >= 0.6;

			return this.buildResult(valid, confidence, errors, warnings, metrics, startTime);
		} catch (error) {
			errors.push(`Reasoning validation error: ${error}`);
			return this.buildResult(false, 0, errors, warnings, metrics, startTime);
		}
	}

	private buildResult(
		valid: boolean,
		confidence: number,
		errors: string[],
		warnings: string[],
		metrics: Record<string, number>,
		startTime: number,
	): ComponentValidationResult {
		return {
			componentName: "reasoning",
			valid,
			confidence,
			errors,
			warnings,
			metrics,
			timestamp: Date.now() - startTime,
		};
	}
}

/**
 * Response Component Validator
 * Validates final answer quality
 */
class ResponseValidator implements ComponentValidator {
	constructor(
		private query: string,
		private response: string,
		private sources: SearchResult[],
	) {}

	async validate(): Promise<ComponentValidationResult> {
		const startTime = Date.now();
		const errors: string[] = [];
		const warnings: string[] = [];
		const metrics: Record<string, number> = {};

		try {
			// Validate response exists
			if (!this.response || this.response.trim().length === 0) {
				errors.push("No response provided");
				return this.buildResult(false, 0, errors, warnings, metrics, startTime);
			}

			metrics.responseLength = this.response.length;
			metrics.wordCount = this.response.split(/\s+/).length;

			// Check response length
			if (this.response.length < 50) {
				errors.push("Response too short (< 50 chars)");
			} else if (this.response.length < 100) {
				warnings.push("Response is quite short");
			}

			// Check if response addresses query
			const queryTerms = this.query.toLowerCase().split(/\s+/);
			const responseText = this.response.toLowerCase();
			const matchingTerms = queryTerms.filter((term) =>
				responseText.includes(term),
			);

			metrics.queryTermCoverage = matchingTerms.length / queryTerms.length;

			if (metrics.queryTermCoverage < 0.5) {
				warnings.push(
					"Response may not fully address query (low term coverage)",
				);
			}

			// Check for source attribution
			if (this.sources && this.sources.length > 0) {
				const hasCitations = /\[[\d,\s]+\]/.test(this.response) ||
					this.sources.some((s) =>
						this.response.includes(s.url) || this.response.includes(s.title),
					);

				if (!hasCitations) {
					warnings.push("Response lacks source attribution");
				}
				metrics.sourceCount = this.sources.length;
			}

			// Check for common quality issues
			if (this.response.includes("I cannot") || this.response.includes("I'm unable")) {
				warnings.push("Response indicates inability to answer");
			}

			if (this.response.includes("error") || this.response.includes("failed")) {
				warnings.push("Response mentions errors");
			}

			// Calculate confidence based on metrics
			let confidence = 0.7; // Base confidence

			if (metrics.responseLength > 200) confidence += 0.1;
			if (metrics.queryTermCoverage > 0.7) confidence += 0.1;
			if (metrics.sourceCount && metrics.sourceCount > 0) confidence += 0.1;

			confidence = Math.min(1, confidence);

			const valid = errors.length === 0;

			return this.buildResult(valid, confidence, errors, warnings, metrics, startTime);
		} catch (error) {
			errors.push(`Response validation error: ${error}`);
			return this.buildResult(false, 0, errors, warnings, metrics, startTime);
		}
	}

	private buildResult(
		valid: boolean,
		confidence: number,
		errors: string[],
		warnings: string[],
		metrics: Record<string, number>,
		startTime: number,
	): ComponentValidationResult {
		return {
			componentName: "response",
			valid,
			confidence,
			errors,
			warnings,
			metrics,
			timestamp: Date.now() - startTime,
		};
	}
}

/**
 * Component Validation Pipeline
 * Orchestrates validation of all components
 */
export class ComponentValidationPipeline {
	private config: ValidationConfig;
	private discriminator: AdversarialDifferentialDiscriminator;
	private auditLog: Array<{
		timestamp: number;
		result: PipelineResult;
	}> = [];

	constructor(config: Partial<ValidationConfig> = {}) {
		this.config = { ...DEFAULT_VALIDATION_CONFIG, ...config };
		this.discriminator = new AdversarialDifferentialDiscriminator();
	}

	/**
	 * Validate all components in the pipeline
	 */
	async validate(input: {
		query: string;
		searchResults: SearchResult[];
		reasoningSteps: Array<{ input: string; output: string; confidence: number }>;
		finalResponse: string;
	}): Promise<PipelineResult> {
		const startTime = Date.now();
		const components: ComponentValidationResult[] = [];
		const errors: string[] = [];

		try {
			// Create validators
			const validators: ComponentValidator[] = [
				new RetrievalValidator(
					input.query,
					input.searchResults,
					this.discriminator,
				),
				new ReasoningValidator(input.reasoningSteps),
				new ResponseValidator(
					input.query,
					input.finalResponse,
					input.searchResults,
				),
			];

			// Validate each component
			for (const validator of validators) {
				try {
					const result = await validator.validate();
					components.push(result);

					// In strict mode, stop on first failure
					if (this.config.enableStrictMode && !result.valid) {
						errors.push(
							`Component ${result.componentName} failed validation`,
						);
						break;
					}
				} catch (error) {
					errors.push(`Validator error: ${error}`);
					if (this.config.enableStrictMode) break;
				}
			}

			// Calculate overall results
			const allValid = components.every((c) => c.valid);
			const avgConfidence =
				components.length > 0
					? components.reduce((sum, c) => sum + c.confidence, 0) /
						components.length
					: 0;

			// Can proceed if all components valid or if not in strict mode and confidence acceptable
			const canProceed =
				allValid ||
				(!this.config.enableStrictMode &&
					avgConfidence >= this.config.minConfidenceThreshold);

			const result: PipelineResult = {
				components,
				overallValid: allValid,
				overallConfidence: avgConfidence,
				canProceed,
				errors,
				totalProcessingTime: Date.now() - startTime,
			};

			// Log if enabled
			if (this.config.logFailures && !allValid) {
				this.auditLog.push({
					timestamp: Date.now(),
					result,
				});
			}

			return result;
		} catch (error) {
			errors.push(`Pipeline error: ${error}`);
			return {
				components,
				overallValid: false,
				overallConfidence: 0,
				canProceed: false,
				errors,
				totalProcessingTime: Date.now() - startTime,
			};
		}
	}

	/**
	 * Get audit log of validation failures
	 */
	getAuditLog(): Array<{
		timestamp: number;
		result: PipelineResult;
	}> {
		return [...this.auditLog];
	}

	/**
	 * Clear audit log
	 */
	clearAuditLog(): void {
		this.auditLog = [];
	}

	/**
	 * Get validation statistics
	 */
	getStatistics(): {
		totalValidations: number;
		failedValidations: number;
		avgProcessingTime: number;
		componentFailureRates: Record<string, number>;
	} {
		const total = this.auditLog.length;
		const failed = this.auditLog.filter((l) => !l.result.overallValid).length;

		const avgTime =
			total > 0
				? this.auditLog.reduce(
						(sum, l) => sum + l.result.totalProcessingTime,
						0,
					) / total
				: 0;

		const componentFailures: Record<string, number> = {};

		for (const log of this.auditLog) {
			for (const component of log.result.components) {
				if (!component.valid) {
					componentFailures[component.componentName] =
						(componentFailures[component.componentName] || 0) + 1;
				}
			}
		}

		return {
			totalValidations: total,
			failedValidations: failed,
			avgProcessingTime: avgTime,
			componentFailureRates: componentFailures,
		};
	}
}
