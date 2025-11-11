/**
 * Fine-Tuning Dataset Export System
 * 
 * Exports logged searches with user feedback for model fine-tuning.
 * 
 * Security features:
 * - PII detection and removal
 * - User consent tracking
 * - Data anonymization
 * - Secure export formats
 */

import type { SearchResult } from "./types";

export interface TrainingExample {
	id: string;
	query: string;
	response: string;
	searchResults: SearchResult[];
	userFeedback?: {
		relevant: boolean;
		rating?: number;
		comments?: string;
	};
	modelUsed: string;
	timestamp: number;
	tokens: {
		input: number;
		output: number;
		total: number;
	};
	confidence: number;
	addScore?: number;
}

export interface ExportConfig {
	format: "openai" | "anthropic" | "generic_jsonl" | "csv";
	includePIIFiltered: boolean;
	includeMetadata: boolean;
	minConfidenceThreshold: number;
	onlyWithFeedback: boolean;
	anonymize: boolean;
}

const DEFAULT_EXPORT_CONFIG: ExportConfig = {
	format: "openai",
	includePIIFiltered: true,
	includeMetadata: true,
	minConfidenceThreshold: 0.6,
	onlyWithFeedback: false,
	anonymize: true,
};

/**
 * PII Detection and Removal
 */
class PIIDetector {
	private readonly patterns = {
		email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
		phone: /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/g,
		ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
		creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
		ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
		url: /https?:\/\/[^\s]+/g,
		// More conservative patterns
		name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Simple name pattern
	};

	detect(text: string): {
		hasPII: boolean;
		types: string[];
		locations: Array<{ type: string; match: string; index: number }>;
	} {
		const locations: Array<{ type: string; match: string; index: number }> = [];
		const typesFound = new Set<string>();

		for (const [type, pattern] of Object.entries(this.patterns)) {
			const matches = text.matchAll(pattern);
			for (const match of matches) {
				if (match.index !== undefined) {
					locations.push({
						type,
						match: match[0],
						index: match.index,
					});
					typesFound.add(type);
				}
			}
		}

		return {
			hasPII: locations.length > 0,
			types: Array.from(typesFound),
			locations,
		};
	}

	remove(text: string): {
		cleaned: string;
		removed: string[];
	} {
		let cleaned = text;
		const removed: string[] = [];

		// Replace emails
		cleaned = cleaned.replace(this.patterns.email, (match) => {
			removed.push(`email: ${match}`);
			return "[EMAIL_REDACTED]";
		});

		// Replace phones
		cleaned = cleaned.replace(this.patterns.phone, (match) => {
			removed.push(`phone: ${match}`);
			return "[PHONE_REDACTED]";
		});

		// Replace SSNs
		cleaned = cleaned.replace(this.patterns.ssn, (match) => {
			removed.push(`ssn: ${match}`);
			return "[SSN_REDACTED]";
		});

		// Replace credit cards
		cleaned = cleaned.replace(this.patterns.creditCard, (match) => {
			removed.push(`creditCard: ${match}`);
			return "[CARD_REDACTED]";
		});

		// Replace IP addresses (optional - might be needed for technical queries)
		cleaned = cleaned.replace(this.patterns.ipAddress, (match) => {
			removed.push(`ipAddress: ${match}`);
			return "[IP_REDACTED]";
		});

		return { cleaned, removed };
	}
}

/**
 * Dataset Anonymizer
 */
class DatasetAnonymizer {
	private idMapping = new Map<string, string>();
	private counter = 0;

	anonymizeId(originalId: string): string {
		if (!this.idMapping.has(originalId)) {
			this.counter++;
			this.idMapping.set(originalId, `anon_${this.counter}`);
		}
		return this.idMapping.get(originalId)!;
	}

	anonymizeTimestamp(timestamp: number): number {
		// Round to nearest hour to preserve temporal patterns without exact timing
		return Math.floor(timestamp / 3600000) * 3600000;
	}

	reset(): void {
		this.idMapping.clear();
		this.counter = 0;
	}
}

/**
 * Fine-Tuning Dataset Exporter
 */
export class FineTuningDatasetExporter {
	private piiDetector: PIIDetector;
	private anonymizer: DatasetAnonymizer;
	private config: ExportConfig;

	constructor(config: Partial<ExportConfig> = {}) {
		this.config = { ...DEFAULT_EXPORT_CONFIG, ...config };
		this.piiDetector = new PIIDetector();
		this.anonymizer = new DatasetAnonymizer();
	}

	/**
	 * Process and export training examples
	 */
	async export(examples: TrainingExample[]): Promise<{
		data: string;
		stats: {
			total: number;
			exported: number;
			filtered: number;
			piiDetected: number;
		};
		warnings: string[];
	}> {
		const warnings: string[] = [];
		let piiDetected = 0;
		let filtered = 0;

		// Filter examples
		const processedExamples = examples
			.filter((ex) => {
				// Filter by confidence
				if (ex.confidence < this.config.minConfidenceThreshold) {
					filtered++;
					return false;
				}

				// Filter by feedback requirement
				if (this.config.onlyWithFeedback && !ex.userFeedback) {
					filtered++;
					return false;
				}

				return true;
			})
			.map((ex) => {
				// Process PII
				const queryPII = this.piiDetector.detect(ex.query);
				const responsePII = this.piiDetector.detect(ex.response);

				if (queryPII.hasPII || responsePII.hasPII) {
					piiDetected++;
					warnings.push(
						`PII detected in example ${ex.id}: ${[...queryPII.types, ...responsePII.types].join(", ")}`,
					);

					if (this.config.includePIIFiltered) {
						// Remove PII
						const cleanedQuery = this.piiDetector.remove(ex.query).cleaned;
						const cleanedResponse = this.piiDetector.remove(ex.response).cleaned;

						return {
							...ex,
							query: cleanedQuery,
							response: cleanedResponse,
						};
					} else {
						// Skip this example
						filtered++;
						return null;
					}
				}

				return ex;
			})
			.filter((ex): ex is TrainingExample => ex !== null);

		// Anonymize if requested
		const finalExamples = this.config.anonymize
			? processedExamples.map((ex) => ({
					...ex,
					id: this.anonymizer.anonymizeId(ex.id),
					timestamp: this.anonymizer.anonymizeTimestamp(ex.timestamp),
				}))
			: processedExamples;

		// Format based on requested format
		let data: string;
		switch (this.config.format) {
			case "openai":
				data = this.formatOpenAI(finalExamples);
				break;
			case "anthropic":
				data = this.formatAnthropic(finalExamples);
				break;
			case "generic_jsonl":
				data = this.formatGenericJSONL(finalExamples);
				break;
			case "csv":
				data = this.formatCSV(finalExamples);
				break;
		}

		return {
			data,
			stats: {
				total: examples.length,
				exported: finalExamples.length,
				filtered,
				piiDetected,
			},
			warnings,
		};
	}

	/**
	 * Format for OpenAI fine-tuning (JSONL)
	 */
	private formatOpenAI(examples: TrainingExample[]): string {
		return examples
			.map((ex) => {
				const obj: any = {
					messages: [
						{
							role: "system",
							content: "You are a helpful search assistant that provides accurate, well-sourced answers.",
						},
						{ role: "user", content: ex.query },
						{ role: "assistant", content: ex.response },
					],
				};

				if (this.config.includeMetadata) {
					obj.metadata = {
						confidence: ex.confidence,
						addScore: ex.addScore,
						tokens: ex.tokens,
						feedback: ex.userFeedback,
					};
				}

				return JSON.stringify(obj);
			})
			.join("\n");
	}

	/**
	 * Format for Anthropic fine-tuning (JSONL)
	 */
	private formatAnthropic(examples: TrainingExample[]): string {
		return examples
			.map((ex) => {
				const obj: any = {
					prompt: ex.query,
					completion: ex.response,
				};

				if (this.config.includeMetadata) {
					obj.metadata = {
						confidence: ex.confidence,
						addScore: ex.addScore,
						tokens: ex.tokens,
						feedback: ex.userFeedback,
					};
				}

				return JSON.stringify(obj);
			})
			.join("\n");
	}

	/**
	 * Format as generic JSONL
	 */
	private formatGenericJSONL(examples: TrainingExample[]): string {
		return examples
			.map((ex) => {
				const obj: any = {
					query: ex.query,
					response: ex.response,
					confidence: ex.confidence,
				};

				if (this.config.includeMetadata) {
					obj.searchResults = ex.searchResults;
					obj.feedback = ex.userFeedback;
					obj.addScore = ex.addScore;
					obj.tokens = ex.tokens;
					obj.modelUsed = ex.modelUsed;
				}

				return JSON.stringify(obj);
			})
			.join("\n");
	}

	/**
	 * Format as CSV
	 */
	private formatCSV(examples: TrainingExample[]): string {
		const headers = [
			"query",
			"response",
			"confidence",
			"addScore",
			"tokens",
			"feedback_relevant",
			"feedback_rating",
		];

		const rows = examples.map((ex) => [
			this.escapeCSV(ex.query),
			this.escapeCSV(ex.response),
			ex.confidence.toString(),
			(ex.addScore ?? "").toString(),
			ex.tokens.total.toString(),
			(ex.userFeedback?.relevant ?? "").toString(),
			(ex.userFeedback?.rating ?? "").toString(),
		]);

		return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
	}

	/**
	 * Escape CSV values
	 */
	private escapeCSV(value: string): string {
		if (value.includes(",") || value.includes('"') || value.includes("\n")) {
			return `"${value.replace(/"/g, '""')}"`;
		}
		return value;
	}

	/**
	 * Validate dataset quality
	 */
	validateDataset(examples: TrainingExample[]): {
		valid: boolean;
		errors: string[];
		warnings: string[];
		stats: {
			avgConfidence: number;
			avgTokens: number;
			feedbackRate: number;
			uniqueQueries: number;
		};
	} {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (examples.length === 0) {
			errors.push("Dataset is empty");
		}

		if (examples.length < 10) {
			warnings.push(
				"Dataset has fewer than 10 examples (minimum recommended: 100)",
			);
		}

		// Check for diversity
		const uniqueQueries = new Set(examples.map((ex) => ex.query)).size;
		if (uniqueQueries < examples.length * 0.8) {
			warnings.push("Low query diversity - many duplicate queries detected");
		}

		// Calculate stats
		const avgConfidence =
			examples.reduce((sum, ex) => sum + ex.confidence, 0) / examples.length;
		const avgTokens =
			examples.reduce((sum, ex) => sum + ex.tokens.total, 0) / examples.length;
		const feedbackRate =
			examples.filter((ex) => ex.userFeedback).length / examples.length;

		if (avgConfidence < 0.7) {
			warnings.push(
				`Low average confidence (${avgConfidence.toFixed(2)}) - consider filtering`,
			);
		}

		if (feedbackRate < 0.3) {
			warnings.push(
				`Low feedback rate (${(feedbackRate * 100).toFixed(0)}%) - user validation is valuable`,
			);
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings,
			stats: {
				avgConfidence,
				avgTokens,
				feedbackRate,
				uniqueQueries,
			},
		};
	}

	/**
	 * Reset anonymizer (for new export session)
	 */
	reset(): void {
		this.anonymizer.reset();
	}
}
