import type { CostTracker } from "./cost-tracker";
import type { EnsembleConfig, EnsembleResult } from "./types";
import { getModelCapabilities } from "./types";

type ModelExecutor = (
	query: string,
	model: string,
	provider: string,
) => Promise<{ response: string; confidence: number }>;

export class EnsemblePredictor {
	private config: EnsembleConfig;
	private costTracker: CostTracker;
	private executor: ModelExecutor | null = null;
	private defaultTimeout = 5000;

	constructor(
		costTracker: CostTracker,
		config?: Partial<EnsembleConfig>,
		executor?: ModelExecutor,
	) {
		this.costTracker = costTracker;
		this.config = {
			models: config?.models ?? [
				{ model: "gpt-4o", provider: "openai" },
				{ model: "claude-3-5-sonnet", provider: "anthropic" },
			],
			timeoutMs: config?.timeoutMs ?? this.defaultTimeout,
			minAgreement: config?.minAgreement ?? 0.6,
			aggregationStrategy: config?.aggregationStrategy ?? "weighted",
		};
		this.executor = executor ?? null;
	}

	setExecutor(executor: ModelExecutor): void {
		this.executor = executor;
	}

	async predict(query: string): Promise<EnsembleResult> {
		if (!this.executor) {
			throw new Error("No model executor set. Call setExecutor() first.");
		}

		const results = await this.executeModels(query);
		const aggregation = this.aggregateResults(results);
		const totalCost = this.calculateTotalCost(results);

		return {
			responses: results,
			aggregatedResponse: aggregation.response,
			agreementScore: aggregation.agreement,
			votingResult: aggregation.votingResult,
			totalCost,
		};
	}

	private async executeModels(
		query: string,
	): Promise<EnsembleResult["responses"]> {
		const promises = this.config.models.map(async ({ model, provider }) => {
			const startTime = Date.now();

			try {
				const timeoutPromise = new Promise<never>((_, reject) => {
					setTimeout(() => reject(new Error("Timeout")), this.config.timeoutMs);
				});

				const result = await Promise.race([
					this.executor!(query, model, provider),
					timeoutPromise,
				]);

				const latency = Date.now() - startTime;

				return {
					model,
					provider,
					response: result.response,
					confidence: result.confidence,
					latency,
				};
			} catch (error) {
				const latency = Date.now() - startTime;
				return {
					model,
					provider,
					response: "",
					confidence: 0,
					latency,
				};
			}
		});

		return Promise.all(promises);
	}

	private aggregateResults(results: EnsembleResult["responses"]): {
		response: string;
		agreement: number;
		votingResult: "consensus" | "majority" | "disagreement";
	} {
		const validResults = results.filter((r) => r.confidence > 0);

		if (validResults.length === 0) {
			return {
				response: "",
				agreement: 0,
				votingResult: "disagreement",
			};
		}

		if (validResults.length === 1) {
			return {
				response: validResults[0].response,
				agreement: 1,
				votingResult: "consensus",
			};
		}

		const agreement = this.calculateAgreement(validResults);
		const votingResult = this.determineVotingResult(agreement);

		let aggregatedResponse: string;

		switch (this.config.aggregationStrategy) {
			case "voting":
				aggregatedResponse = this.votingAggregation(validResults);
				break;
			case "weighted":
				aggregatedResponse = this.weightedAggregation(validResults);
				break;
			case "first_valid":
				aggregatedResponse = validResults[0].response;
				break;
			default:
				aggregatedResponse = this.weightedAggregation(validResults);
		}

		return {
			response: aggregatedResponse,
			agreement,
			votingResult,
		};
	}

	private calculateAgreement(results: EnsembleResult["responses"]): number {
		if (results.length < 2) return 1;

		const normalizedResponses = results.map((r) =>
			this.normalizeResponse(r.response),
		);

		let totalSimilarity = 0;
		let comparisons = 0;

		for (let i = 0; i < normalizedResponses.length; i++) {
			for (let j = i + 1; j < normalizedResponses.length; j++) {
				const similarity = this.calculateSimilarity(
					normalizedResponses[i],
					normalizedResponses[j],
				);
				totalSimilarity += similarity;
				comparisons++;
			}
		}

		return comparisons > 0 ? totalSimilarity / comparisons : 0;
	}

	private normalizeResponse(response: string): string {
		return response
			.toLowerCase()
			.replace(/[^\w\s]/g, "")
			.replace(/\s+/g, " ")
			.trim();
	}

	private calculateSimilarity(a: string, b: string): number {
		const wordsA = new Set(a.split(" "));
		const wordsB = new Set(b.split(" "));

		const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
		const union = new Set([...wordsA, ...wordsB]);

		return union.size > 0 ? intersection.size / union.size : 0;
	}

	private determineVotingResult(
		agreement: number,
	): "consensus" | "majority" | "disagreement" {
		if (agreement >= 0.8) return "consensus";
		if (agreement >= this.config.minAgreement) return "majority";
		return "disagreement";
	}

	private votingAggregation(results: EnsembleResult["responses"]): string {
		const responseGroups = new Map<string, number>();

		for (const result of results) {
			const normalized = this.normalizeResponse(result.response);
			const count = responseGroups.get(normalized) ?? 0;
			responseGroups.set(normalized, count + 1);
		}

		let maxCount = 0;
		let winningResponse = results[0].response;

		for (const [normalized, count] of responseGroups) {
			if (count > maxCount) {
				maxCount = count;
				const original = results.find(
					(r) => this.normalizeResponse(r.response) === normalized,
				);
				winningResponse = original?.response ?? winningResponse;
			}
		}

		return winningResponse;
	}

	private weightedAggregation(results: EnsembleResult["responses"]): string {
		const sorted = [...results].sort((a, b) => {
			const capsA = getModelCapabilities(a.model, a.provider);
			const capsB = getModelCapabilities(b.model, b.provider);

			const scoreA = a.confidence * 0.6 + capsA.qualityScore * 0.4;
			const scoreB = b.confidence * 0.6 + capsB.qualityScore * 0.4;

			return scoreB - scoreA;
		});

		return sorted[0].response;
	}

	private calculateTotalCost(results: EnsembleResult["responses"]): number {
		let totalCost = 0;

		for (const result of results) {
			const caps = getModelCapabilities(result.model, result.provider);
			const estimatedTokens = Math.ceil(result.response.length / 4);
			const outputCost = (estimatedTokens / 1000) * caps.costPer1kOutputTokens;
			totalCost += outputCost;
		}

		return totalCost;
	}

	setTimeout(timeoutMs: number): void {
		this.config.timeoutMs = timeoutMs;
	}

	setMinAgreement(minAgreement: number): void {
		this.config.minAgreement = minAgreement;
	}

	setAggregationStrategy(
		strategy: "voting" | "weighted" | "first_valid",
	): void {
		this.config.aggregationStrategy = strategy;
	}

	addModel(model: string, provider: string): void {
		const exists = this.config.models.some(
			(m) => m.model === model && m.provider === provider,
		);
		if (!exists) {
			this.config.models.push({ model, provider });
		}
	}

	removeModel(model: string, provider: string): void {
		this.config.models = this.config.models.filter(
			(m) => !(m.model === model && m.provider === provider),
		);
	}

	getModels(): Array<{ model: string; provider: string }> {
		return [...this.config.models];
	}

	detectAgreement(results: EnsembleResult["responses"]): {
		hasAgreement: boolean;
		agreementScore: number;
		disagreementModels: string[];
	} {
		const validResults = results.filter((r) => r.confidence > 0);

		if (validResults.length < 2) {
			return {
				hasAgreement: true,
				agreementScore: 1,
				disagreementModels: [],
			};
		}

		const agreement = this.calculateAgreement(validResults);
		const hasAgreement = agreement >= this.config.minAgreement;

		const disagreementModels: string[] = [];

		if (!hasAgreement) {
			const avgResponse = this.getAverageResponse(validResults);

			for (const result of validResults) {
				const similarity = this.calculateSimilarity(
					this.normalizeResponse(result.response),
					this.normalizeResponse(avgResponse),
				);
				if (similarity < this.config.minAgreement) {
					disagreementModels.push(`${result.provider}:${result.model}`);
				}
			}
		}

		return {
			hasAgreement,
			agreementScore: agreement,
			disagreementModels,
		};
	}

	private getAverageResponse(results: EnsembleResult["responses"]): string {
		const sorted = [...results].sort((a, b) => b.confidence - a.confidence);
		return sorted[0].response;
	}

	getConfig(): EnsembleConfig {
		return { ...this.config };
	}
}

export function createEnsemblePredictor(
	costTracker: CostTracker,
	config?: Partial<EnsembleConfig>,
	executor?: ModelExecutor,
): EnsemblePredictor {
	return new EnsemblePredictor(costTracker, config, executor);
}
