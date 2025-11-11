/**
 * Adversarial Differential Discriminator (ADD)
 * 
 * Validates search quality by comparing results over time, detecting drift,
 * and triggering adjustments when accuracy degrades.
 * 
 * Key features:
 * - Historical quality tracking
 * - Drift detection via statistical analysis
 * - Automatic threshold-based adjustment triggers
 * - Confidence scoring for search results
 */

import type { SearchResult } from "./types";

export interface ADDScore {
	overallScore: number;
	relevanceScore: number;
	diversityScore: number;
	freshnessScore: number;
	consistencyScore: number;
	timestamp: number;
}

export interface DriftAnalysis {
	isDrifting: boolean;
	driftMagnitude: number;
	confidence: number;
	recommendation: "maintain" | "adjust" | "retrain";
	details: string;
}

export interface ADDMetrics {
	currentScore: ADDScore;
	historicalAverage: number;
	recentTrend: "improving" | "stable" | "declining";
	driftDetected: boolean;
	driftAnalysis: DriftAnalysis;
}

/**
 * Configuration for ADD thresholds
 */
export interface ADDConfig {
	driftThreshold: number; // Default: 0.15 (15% degradation triggers alert)
	adjustmentThreshold: number; // Default: 0.25 (25% degradation triggers adjustment)
	retrainThreshold: number; // Default: 0.40 (40% degradation triggers retrain)
	historicalWindow: number; // Default: 100 (last 100 searches)
	minSamplesForAnalysis: number; // Default: 10
}

const DEFAULT_ADD_CONFIG: ADDConfig = {
	driftThreshold: 0.15,
	adjustmentThreshold: 0.25,
	retrainThreshold: 0.40,
	historicalWindow: 100,
	minSamplesForAnalysis: 10,
};

export class AdversarialDifferentialDiscriminator {
	private config: ADDConfig;
	private historicalScores: ADDScore[] = [];

	constructor(config: Partial<ADDConfig> = {}) {
		this.config = { ...DEFAULT_ADD_CONFIG, ...config };
	}

	/**
	 * Score a set of search results
	 */
	scoreResults(
		query: string,
		results: SearchResult[],
		userFeedback?: { relevant: boolean; rating?: number },
	): ADDScore {
		const relevanceScore = this.calculateRelevanceScore(query, results);
		const diversityScore = this.calculateDiversityScore(results);
		const freshnessScore = this.calculateFreshnessScore(results);
		const consistencyScore = this.calculateConsistencyScore(results);

		// Weight the components
		const overallScore =
			relevanceScore * 0.4 +
			diversityScore * 0.2 +
			freshnessScore * 0.2 +
			consistencyScore * 0.2;

		// Adjust based on user feedback if available
		const finalScore = userFeedback
			? this.adjustForFeedback(overallScore, userFeedback)
			: overallScore;

		const score: ADDScore = {
			overallScore: finalScore,
			relevanceScore,
			diversityScore,
			freshnessScore,
			consistencyScore,
			timestamp: Date.now(),
		};

		// Store in historical data
		this.addToHistory(score);

		return score;
	}

	/**
	 * Analyze drift based on historical data
	 */
	analyzeDrift(): DriftAnalysis {
		if (
			this.historicalScores.length < this.config.minSamplesForAnalysis
		) {
			return {
				isDrifting: false,
				driftMagnitude: 0,
				confidence: 0,
				recommendation: "maintain",
				details:
					"Insufficient historical data for drift analysis",
			};
		}

		// Get recent and older scores
		const recentWindow = Math.floor(this.config.historicalWindow / 3);
		const recentScores = this.historicalScores
			.slice(-recentWindow)
			.map((s) => s.overallScore);
		const olderScores = this.historicalScores
			.slice(
				-(this.config.historicalWindow * 2),
				-recentWindow,
			)
			.map((s) => s.overallScore);

		if (olderScores.length === 0) {
			return {
				isDrifting: false,
				driftMagnitude: 0,
				confidence: 0.5,
				recommendation: "maintain",
				details: "Building baseline - continue collecting data",
			};
		}

		const recentAvg = this.average(recentScores);
		const historicalAvg = this.average(olderScores);

		// Calculate drift magnitude (negative = degradation)
		const driftMagnitude = recentAvg - historicalAvg;
		const degradationRatio = Math.abs(driftMagnitude) / historicalAvg;

		// Determine if drifting
		const isDrifting =
			degradationRatio >= this.config.driftThreshold;

		// Calculate confidence in drift detection
		const variance = this.calculateVariance(recentScores);
		const confidence = Math.max(
			0,
			Math.min(1, 1 - variance * 2),
		);

		// Determine recommendation
		let recommendation: DriftAnalysis["recommendation"] = "maintain";
		let details = "Performance is stable";

		if (
			isDrifting &&
			degradationRatio >= this.config.retrainThreshold
		) {
			recommendation = "retrain";
			details = `Significant degradation detected (${(degradationRatio * 100).toFixed(1)}%). Model retraining recommended.`;
		} else if (
			isDrifting &&
			degradationRatio >= this.config.adjustmentThreshold
		) {
			recommendation = "adjust";
			details = `Moderate degradation detected (${(degradationRatio * 100).toFixed(1)}%). Consider adjusting model parameters.`;
		} else if (isDrifting) {
			details = `Minor drift detected (${(degradationRatio * 100).toFixed(1)}%). Monitor closely.`;
		} else if (driftMagnitude > 0) {
			details = `Performance improving (+${(degradationRatio * 100).toFixed(1)}%).`;
		}

		return {
			isDrifting,
			driftMagnitude,
			confidence,
			recommendation,
			details,
		};
	}

	/**
	 * Get comprehensive metrics
	 */
	getMetrics(): ADDMetrics {
		const currentScore =
			this.historicalScores[this.historicalScores.length - 1] ?? {
				overallScore: 0,
				relevanceScore: 0,
				diversityScore: 0,
				freshnessScore: 0,
				consistencyScore: 0,
				timestamp: Date.now(),
			};

		const historicalAverage = this.average(
			this.historicalScores.map((s) => s.overallScore),
		);

		const recentTrend = this.calculateTrend();
		const driftAnalysis = this.analyzeDrift();

		return {
			currentScore,
			historicalAverage,
			recentTrend,
			driftDetected: driftAnalysis.isDrifting,
			driftAnalysis,
		};
	}

	/**
	 * Calculate relevance score
	 */
	private calculateRelevanceScore(
		query: string,
		results: SearchResult[],
	): number {
		if (results.length === 0) return 0;

		const queryTerms = query.toLowerCase().split(/\s+/);

		let totalRelevance = 0;
		for (const result of results) {
			const content = `${result.title} ${result.snippet}`.toLowerCase();

			const matchingTerms = queryTerms.filter((term) =>
				content.includes(term),
			);
			const relevance = matchingTerms.length / queryTerms.length;

			totalRelevance += relevance;
		}

		return Math.min(1, totalRelevance / results.length);
	}

	/**
	 * Calculate diversity score (how varied are the results)
	 */
	private calculateDiversityScore(results: SearchResult[]): number {
		if (results.length < 2) return 1;

		// Check source diversity
		const uniqueSources = new Set(results.map((r) => r.source));
		const sourceDiversity = uniqueSources.size / results.length;

		// Check content diversity (simple word overlap)
		let totalSimilarity = 0;
		let comparisons = 0;

		for (let i = 0; i < results.length - 1; i++) {
			for (let j = i + 1; j < results.length; j++) {
				const similarity = this.calculateTextSimilarity(
					results[i].snippet,
					results[j].snippet,
				);
				totalSimilarity += similarity;
				comparisons++;
			}
		}

		const avgSimilarity =
			comparisons > 0 ? totalSimilarity / comparisons : 0;
		const contentDiversity = 1 - avgSimilarity;

		return (sourceDiversity + contentDiversity) / 2;
	}

	/**
	 * Calculate freshness score
	 */
	private calculateFreshnessScore(results: SearchResult[]): number {
		if (results.length === 0) return 0.5;

		// If addScore exists, use it as a proxy for freshness
		const avgAddScore =
			this.average(results.map((r) => r.addScore ?? 0.5));

		return avgAddScore;
	}

	/**
	 * Calculate consistency score
	 */
	private calculateConsistencyScore(results: SearchResult[]): number {
		if (results.length < 2) return 1;

		// Check if results have consistent structure
		const hasUrl = results.filter((r) => r.url).length;
		const hasSnippet = results.filter((r) => r.snippet).length;
		const hasTitle = results.filter((r) => r.title).length;

		const completeness =
			(hasUrl + hasSnippet + hasTitle) / (results.length * 3);

		return completeness;
	}

	/**
	 * Adjust score based on user feedback
	 */
	private adjustForFeedback(
		score: number,
		feedback: { relevant: boolean; rating?: number },
	): number {
		if (feedback.rating !== undefined) {
			// If explicit rating provided, blend with calculated score
			const normalizedRating = feedback.rating / 5;
			return score * 0.6 + normalizedRating * 0.4;
		}

		// Simple relevant/not relevant adjustment
		if (feedback.relevant) {
			return Math.min(1, score * 1.1);
		}
		return Math.max(0, score * 0.8);
	}

	/**
	 * Calculate simple text similarity
	 */
	private calculateTextSimilarity(text1: string, text2: string): number {
		const words1 = new Set(text1.toLowerCase().split(/\s+/));
		const words2 = new Set(text2.toLowerCase().split(/\s+/));

		const intersection = new Set(
			[...words1].filter((w) => words2.has(w)),
		);
		const union = new Set([...words1, ...words2]);

		return union.size > 0 ? intersection.size / union.size : 0;
	}

	/**
	 * Add score to historical data
	 */
	private addToHistory(score: ADDScore): void {
		this.historicalScores.push(score);

		// Maintain window size
		if (
			this.historicalScores.length >
			this.config.historicalWindow * 2
		) {
			this.historicalScores = this.historicalScores.slice(
				-this.config.historicalWindow,
			);
		}
	}

	/**
	 * Calculate trend direction
	 */
	private calculateTrend(): "improving" | "stable" | "declining" {
		if (this.historicalScores.length < 5) return "stable";

		const recentScores = this.historicalScores
			.slice(-10)
			.map((s) => s.overallScore);
		const trend = this.calculateLinearTrend(recentScores);

		if (trend > 0.02) return "improving";
		if (trend < -0.02) return "declining";
		return "stable";
	}

	/**
	 * Calculate linear trend
	 */
	private calculateLinearTrend(values: number[]): number {
		if (values.length < 2) return 0;

		const n = values.length;
		const sumX = (n * (n - 1)) / 2;
		const sumY = values.reduce((sum, val) => sum + val, 0);
		const sumXY = values.reduce(
			(sum, val, i) => sum + i * val,
			0,
		);
		const sumX2 = values.reduce((sum, _, i) => sum + i * i, 0);

		return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	}

	/**
	 * Calculate average
	 */
	private average(numbers: number[]): number {
		if (numbers.length === 0) return 0;
		return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
	}

	/**
	 * Calculate variance
	 */
	private calculateVariance(numbers: number[]): number {
		if (numbers.length === 0) return 0;

		const mean = this.average(numbers);
		const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
		return this.average(squaredDiffs);
	}

	/**
	 * Export historical data for fine-tuning
	 */
	exportHistoricalData(): ADDScore[] {
		return [...this.historicalScores];
	}

	/**
	 * Import historical data
	 */
	importHistoricalData(scores: ADDScore[]): void {
		this.historicalScores = scores.slice(
			-this.config.historicalWindow,
		);
	}
}
