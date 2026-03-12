import type { CostBudget, RoutingHistoryEntry } from "./types";
import { getModelCapabilities } from "./types";

export interface CostEstimate {
	inputTokens: number;
	outputTokens: number;
	estimatedInputCost: number;
	estimatedOutputCost: number;
	totalEstimatedCost: number;
	model: string;
	provider: string;
}

export interface CostReport {
	totalSpent: number;
	dailySpent: number;
	hourlySpent: number;
	savingsFromLocal: number;
	savingsFromCaching: number;
	averageCostPerQuery: number;
	queriesByModel: Record<string, { count: number; totalCost: number }>;
	budgetStatus: {
		daily: { spent: number; limit: number; percentage: number };
		hourly: { spent: number; limit: number; percentage: number };
	};
}

export class CostTracker {
	private budget: CostBudget;
	private history: RoutingHistoryEntry[] = [];
	private savingsFromLocal = 0;
	private savingsFromCaching = 0;
	private maxHistorySize = 10000;

	constructor(budget?: Partial<CostBudget>) {
		const now = Date.now();
		this.budget = {
			dailyLimit: budget?.dailyLimit ?? 10,
			hourlyLimit: budget?.hourlyLimit ?? 2,
			dailySpent: budget?.dailySpent ?? 0,
			hourlySpent: budget?.hourlySpent ?? 0,
			lastReset: {
				daily: budget?.lastReset?.daily ?? now,
				hourly: budget?.lastReset?.hourly ?? now,
			},
		};
	}

	estimateCost(
		query: string,
		model: string,
		provider: string,
		estimatedOutputTokens?: number,
	): CostEstimate {
		const inputTokens = this.estimateTokenCount(query);
		const outputTokens =
			estimatedOutputTokens ?? this.estimateOutputTokens(query, inputTokens);

		const capabilities = getModelCapabilities(model, provider);

		const estimatedInputCost =
			(inputTokens / 1000) * capabilities.costPer1kInputTokens;
		const estimatedOutputCost =
			(outputTokens / 1000) * capabilities.costPer1kOutputTokens;
		const totalEstimatedCost = estimatedInputCost + estimatedOutputCost;

		return {
			inputTokens,
			outputTokens,
			estimatedInputCost,
			estimatedOutputCost,
			totalEstimatedCost,
			model,
			provider,
		};
	}

	trackActualCost(entry: RoutingHistoryEntry): void {
		this.checkAndResetBudgets();

		if (entry.actualCost !== undefined) {
			this.budget.dailySpent += entry.actualCost;
			this.budget.hourlySpent += entry.actualCost;
		}

		this.history.push(entry);
		if (this.history.length > this.maxHistorySize) {
			this.history.shift();
		}
	}

	canAfford(estimatedCost: number): boolean {
		this.checkAndResetBudgets();

		return (
			this.budget.dailySpent + estimatedCost <= this.budget.dailyLimit &&
			this.budget.hourlySpent + estimatedCost <= this.budget.hourlyLimit
		);
	}

	checkAndResetBudgets(): void {
		const now = Date.now();
		const hoursSinceHourlyReset =
			(now - this.budget.lastReset.hourly) / (1000 * 60 * 60);
		const daysSinceDailyReset =
			(now - this.budget.lastReset.daily) / (1000 * 60 * 60 * 24);

		if (hoursSinceHourlyReset >= 1) {
			this.budget.hourlySpent = 0;
			this.budget.lastReset.hourly = now;
		}

		if (daysSinceDailyReset >= 1) {
			this.budget.dailySpent = 0;
			this.budget.lastReset.daily = now;
		}
	}

	recordLocalSavings(amount: number): void {
		this.savingsFromLocal += amount;
	}

	recordCacheSavings(amount: number): void {
		this.savingsFromCaching += amount;
	}

	getReport(): CostReport {
		this.checkAndResetBudgets();

		const queriesByModel: Record<string, { count: number; totalCost: number }> =
			{};

		for (const entry of this.history) {
			const key = `${entry.decision.provider}:${entry.decision.model}`;
			if (!queriesByModel[key]) {
				queriesByModel[key] = { count: 0, totalCost: 0 };
			}
			queriesByModel[key].count++;
			queriesByModel[key].totalCost +=
				entry.actualCost ?? entry.decision.estimatedCost;
		}

		const totalSpent = this.history.reduce(
			(sum, e) => sum + (e.actualCost ?? e.decision.estimatedCost),
			0,
		);

		return {
			totalSpent,
			dailySpent: this.budget.dailySpent,
			hourlySpent: this.budget.hourlySpent,
			savingsFromLocal: this.savingsFromLocal,
			savingsFromCaching: this.savingsFromCaching,
			averageCostPerQuery:
				this.history.length > 0 ? totalSpent / this.history.length : 0,
			queriesByModel,
			budgetStatus: {
				daily: {
					spent: this.budget.dailySpent,
					limit: this.budget.dailyLimit,
					percentage: (this.budget.dailySpent / this.budget.dailyLimit) * 100,
				},
				hourly: {
					spent: this.budget.hourlySpent,
					limit: this.budget.hourlyLimit,
					percentage: (this.budget.hourlySpent / this.budget.hourlyLimit) * 100,
				},
			},
		};
	}

	getBudget(): CostBudget {
		return { ...this.budget };
	}

	setDailyLimit(limit: number): void {
		this.budget.dailyLimit = limit;
	}

	setHourlyLimit(limit: number): void {
		this.budget.hourlyLimit = limit;
	}

	getHistory(limit?: number): RoutingHistoryEntry[] {
		if (limit) {
			return this.history.slice(-limit);
		}
		return [...this.history];
	}

	private estimateTokenCount(text: string): number {
		const charCount = text.length;
		const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

		return Math.ceil((charCount / 4 + wordCount) / 2);
	}

	private estimateOutputTokens(query: string, inputTokens: number): number {
		const lowerQuery = query.toLowerCase();

		if (
			lowerQuery.includes("list") ||
			lowerQuery.includes("enumerate") ||
			lowerQuery.includes("brief")
		) {
			return Math.min(inputTokens * 2, 500);
		}

		if (
			lowerQuery.includes("explain") ||
			lowerQuery.includes("describe") ||
			lowerQuery.includes("analyze")
		) {
			return Math.min(inputTokens * 4, 2000);
		}

		if (
			lowerQuery.includes("code") ||
			lowerQuery.includes("implement") ||
			lowerQuery.includes("write a program")
		) {
			return Math.min(inputTokens * 5, 3000);
		}

		return Math.min(inputTokens * 3, 1500);
	}

	clearHistory(): void {
		this.history = [];
		this.savingsFromLocal = 0;
		this.savingsFromCaching = 0;
	}

	getCheapestModel(
		models: Array<{ model: string; provider: string }>,
	): { model: string; provider: string; cost: number } | null {
		if (models.length === 0) return null;

		let cheapest: { model: string; provider: string; cost: number } | null =
			null;

		for (const { model, provider } of models) {
			const caps = getModelCapabilities(model, provider);
			const avgCost =
				(caps.costPer1kInputTokens + caps.costPer1kOutputTokens) / 2;

			if (!cheapest || avgCost < cheapest.cost) {
				cheapest = { model, provider, cost: avgCost };
			}
		}

		return cheapest;
	}
}

export const costTracker = new CostTracker();
