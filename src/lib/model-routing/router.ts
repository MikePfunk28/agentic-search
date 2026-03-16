import type { ModelConfig } from "../model-config";
import { observability } from "../observability";
import { QueryComplexityAnalyzer } from "./complexity";
import type { CostTracker } from "./cost-tracker";
import {
	type ComplexityAnalysis,
	FALLBACK_CHAINS,
	type FallbackChain,
	getModelCapabilities,
	type RoutingDecision,
	type RoutingHistoryEntry,
} from "./types";

export interface RouterConfig {
	preferLocal: boolean;
	maxCostPerQuery: number;
	enableFallback: boolean;
	manualOverride?: {
		model: string;
		provider: string;
	};
}

export interface AvailableModels {
	ollama: string[];
	lm_studio: string[];
	openai: string[];
	anthropic: string[];
	google: string[];
	deepseek: string[];
}

export class ModelRouter {
	private complexityAnalyzer: QueryComplexityAnalyzer;
	private costTracker: CostTracker;
	private history: RoutingHistoryEntry[] = [];
	private config: RouterConfig;
	private availableModels: AvailableModels;
	private maxHistorySize = 5000;

	constructor(
		costTracker: CostTracker,
		config?: Partial<RouterConfig>,
		availableModels?: Partial<AvailableModels>,
	) {
		this.complexityAnalyzer = new QueryComplexityAnalyzer();
		this.costTracker = costTracker;
		this.config = {
			preferLocal: config?.preferLocal ?? true,
			maxCostPerQuery: config?.maxCostPerQuery ?? 0.5,
			enableFallback: config?.enableFallback ?? true,
			manualOverride: config?.manualOverride,
		};
		this.availableModels = {
			ollama: availableModels?.ollama ?? [],
			lm_studio: availableModels?.lm_studio ?? [],
			openai: availableModels?.openai ?? ["gpt-4o", "gpt-4o-mini"],
			anthropic: availableModels?.anthropic ?? [
				"claude-3-5-sonnet",
				"claude-3-haiku",
			],
			google: availableModels?.google ?? ["gemini-2.5-pro", "gemini-2.5-flash"],
			deepseek: availableModels?.deepseek ?? ["deepseek-chat"],
		};
	}

	route(
		query: string,
		availableConfigs: ModelConfig[] = [],
		constraints?: {
			requiresVision?: boolean;
			requiresTools?: boolean;
			maxLatencyMs?: number;
		},
	): RoutingDecision {
		if (this.config.manualOverride) {
			return this.createManualOverrideDecision(query);
		}

		const analysis = this.complexityAnalyzer.analyze(query);

		const candidateModels = this.filterCandidateModels(
			availableConfigs,
			constraints,
			analysis,
		);

		if (candidateModels.length === 0) {
			return this.createFallbackDecision(query, analysis);
		}

		const decision = this.selectBestModel(query, candidateModels, analysis);

		this.logRoutingDecision(decision, query);

		return decision;
	}

	private filterCandidateModels(
		configs: ModelConfig[],
		constraints?: {
			requiresVision?: boolean;
			requiresTools?: boolean;
			maxLatencyMs?: number;
		},
		_analysis?: ComplexityAnalysis,
	): Array<{ model: string; provider: string; config: ModelConfig }> {
		const candidates: Array<{
			model: string;
			provider: string;
			config: ModelConfig;
		}> = [];

		if (configs.length > 0) {
			for (const config of configs) {
				const caps = getModelCapabilities(config.model, config.provider);

				if (constraints?.requiresVision && !caps.supportsVision) continue;
				if (constraints?.requiresTools && !caps.supportsTools) continue;
				if (
					constraints?.maxLatencyMs &&
					caps.averageLatencyMs > constraints.maxLatencyMs
				)
					continue;

				const costEstimate = this.costTracker.estimateCost(
					"",
					config.model,
					config.provider,
				);
				if (!this.costTracker.canAfford(costEstimate.totalEstimatedCost))
					continue;

				candidates.push({
					model: config.model,
					provider: config.provider,
					config,
				});
			}
		}

		const providers = [
			"ollama",
			"lm_studio",
			"openai",
			"anthropic",
			"google",
		] as const;
		for (const provider of providers) {
			const models = this.availableModels[provider];
			if (!models || models.length === 0) continue;

			for (const model of models) {
				const caps = getModelCapabilities(model, provider);

				if (constraints?.requiresVision && !caps.supportsVision) continue;
				if (constraints?.requiresTools && !caps.supportsTools) continue;
				if (
					constraints?.maxLatencyMs &&
					caps.averageLatencyMs > constraints.maxLatencyMs
				)
					continue;

				const costEstimate = this.costTracker.estimateCost("", model, provider);
				if (!this.costTracker.canAfford(costEstimate.totalEstimatedCost))
					continue;

				const existing = candidates.find(
					(c) => c.model === model && c.provider === provider,
				);
				if (!existing) {
					candidates.push({
						model,
						provider,
						config: {
							provider: provider as ModelConfig["provider"],
							model,
							temperature: 0.7,
							maxTokens: caps.maxTokens,
							timeout: 60000,
							enableStreaming: false,
						},
					});
				}
			}
		}

		return candidates;
	}

	private selectBestModel(
		query: string,
		candidates: Array<{ model: string; provider: string; config: ModelConfig }>,
		analysis: ComplexityAnalysis,
	): RoutingDecision {
		const scoredCandidates = candidates.map((c) => {
			const caps = getModelCapabilities(c.model, c.provider);
			const costEstimate = this.costTracker.estimateCost(
				query,
				c.model,
				c.provider,
			);

			let score = 0;

			if (this.config.preferLocal && caps.isLocal) {
				score += 30;
			}

			if (analysis.classification === "complex") {
				score += caps.qualityScore * 40;
				score -= costEstimate.totalEstimatedCost * 10;
			} else if (analysis.classification === "moderate") {
				score += caps.qualityScore * 25;
				score -= costEstimate.totalEstimatedCost * 20;
			} else {
				score += caps.qualityScore * 15;
				score -= costEstimate.totalEstimatedCost * 30;

				if (caps.isLocal) {
					score += 20;
				}
			}

			if (analysis.factors.hasCodeGeneration && caps.qualityScore > 0.85) {
				score += 10;
			}

			if (analysis.factors.hasCreativeWriting && caps.qualityScore > 0.8) {
				score += 5;
			}

			return {
				...c,
				score,
				costEstimate,
				caps,
			};
		});

		scoredCandidates.sort((a, b) => b.score - a.score);

		const best = scoredCandidates[0];

		const fallbackChain = this.buildFallbackChain(
			best.model,
			best.provider,
			analysis.classification,
		);

		return {
			model: best.model,
			provider: best.provider,
			reason: this.generateRoutingReason(best, analysis),
			estimatedCost: best.costEstimate.totalEstimatedCost,
			confidence: analysis.confidence,
			complexity: analysis.classification,
			fallbackChain,
			timestamp: Date.now(),
		};
	}

	private buildFallbackChain(
		primaryModel: string,
		primaryProvider: string,
		complexity: ComplexityAnalysis["classification"],
	): string[] {
		const chain: string[] = [`${primaryProvider}:${primaryModel}`];

		const fallbackConfig = FALLBACK_CHAINS[complexity];

		for (const fallback of fallbackConfig.models) {
			const key = `${fallback.provider}:${fallback.model}`;
			if (!chain.includes(key)) {
				if (fallback.model === "*") {
					const models =
						this.availableModels[fallback.provider as keyof AvailableModels];
					if (models && models.length > 0) {
						chain.push(`${fallback.provider}:${models[0]}`);
					}
				} else {
					chain.push(key);
				}
			}
		}

		return chain.slice(0, 5);
	}

	private generateRoutingReason(
		selected: {
			model: string;
			provider: string;
			caps: ReturnType<typeof getModelCapabilities>;
			costEstimate: ReturnType<CostTracker["estimateCost"]>;
		},
		analysis: ComplexityAnalysis,
	): string {
		const parts: string[] = [];

		if (selected.caps.isLocal) {
			parts.push("Local model selected for cost savings");
		} else {
			parts.push(
				`Selected ${selected.provider}:${selected.model} for quality (${(selected.caps.qualityScore * 100).toFixed(0)}%)`,
			);
		}

		parts.push(
			`Query complexity: ${analysis.classification} (${(analysis.confidence * 100).toFixed(0)}% confidence)`,
		);

		if (analysis.factors.hasCodeGeneration) {
			parts.push("Code generation detected");
		}
		if (analysis.factors.hasMultiStepReasoning) {
			parts.push("Multi-step reasoning required");
		}

		return parts.join(". ");
	}

	private createFallbackDecision(
		_query: string,
		analysis: ComplexityAnalysis,
	): RoutingDecision {
		return {
			model: "gpt-4o-mini",
			provider: "openai",
			reason:
				"Fallback to safe default model - no suitable candidates available",
			estimatedCost: 0.01,
			confidence: 0.5,
			complexity: analysis.classification,
			fallbackChain: ["openai:gpt-4o-mini", "anthropic:claude-3-haiku"],
			timestamp: Date.now(),
		};
	}

	private createManualOverrideDecision(query: string): RoutingDecision {
		const analysis = this.complexityAnalyzer.analyze(query);
		const override = this.config.manualOverride!;

		const costEstimate = this.costTracker.estimateCost(
			query,
			override.model,
			override.provider,
		);

		return {
			model: override.model,
			provider: override.provider,
			reason: "Manual override applied",
			estimatedCost: costEstimate.totalEstimatedCost,
			confidence: 1.0,
			complexity: analysis.classification,
			fallbackChain: [`${override.provider}:${override.model}`],
			timestamp: Date.now(),
		};
	}

	private logRoutingDecision(decision: RoutingDecision, query: string): void {
		const historyEntry: RoutingHistoryEntry = {
			query,
			decision,
			timestamp: Date.now(),
		};

		this.history.push(historyEntry);
		if (this.history.length > this.maxHistorySize) {
			this.history.shift();
		}

		console.log(
			`[ModelRouter] Routed to ${decision.provider}:${decision.model} - ${decision.reason}`,
		);

		observability.traceSearch({
			query,
			provider: decision.provider,
			model: decision.model,
			tokensUsed: 0,
			processingTimeMs: 0,
			cacheHit: false,
			resultCount: 0,
			qualityScore: decision.confidence,
		});
	}

	recordFeedback(
		query: string,
		success: boolean,
		feedbackScore?: number,
	): void {
		const entry = this.history.find(
			(e) => e.query === query && e.feedbackScore === undefined,
		);
		if (entry) {
			entry.success = success;
			entry.feedbackScore = feedbackScore;
		}
	}

	getHistory(limit?: number): RoutingHistoryEntry[] {
		if (limit) {
			return this.history.slice(-limit);
		}
		return [...this.history];
	}

	updateAvailableModels(
		provider: keyof AvailableModels,
		models: string[],
	): void {
		this.availableModels[provider] = models;
	}

	setManualOverride(model: string, provider: string): void {
		this.config.manualOverride = { model, provider };
	}

	clearManualOverride(): void {
		this.config.manualOverride = undefined;
	}

	getFallbackChain(
		complexity: ComplexityAnalysis["classification"],
	): FallbackChain {
		return FALLBACK_CHAINS[complexity];
	}

	analyzeQuery(query: string): ComplexityAnalysis {
		return this.complexityAnalyzer.analyze(query);
	}

	setPreferLocal(prefer: boolean): void {
		this.config.preferLocal = prefer;
	}

	getStats(): {
		totalRouted: number;
		byComplexity: Record<string, number>;
		byProvider: Record<string, number>;
		averageConfidence: number;
		averageCost: number;
	} {
		const stats = {
			totalRouted: this.history.length,
			byComplexity: {} as Record<string, number>,
			byProvider: {} as Record<string, number>,
			averageConfidence: 0,
			averageCost: 0,
		};

		if (this.history.length === 0) return stats;

		for (const entry of this.history) {
			const complexity = entry.decision.complexity;
			stats.byComplexity[complexity] =
				(stats.byComplexity[complexity] || 0) + 1;

			const provider = entry.decision.provider;
			stats.byProvider[provider] = (stats.byProvider[provider] || 0) + 1;

			stats.averageConfidence += entry.decision.confidence;
			stats.averageCost += entry.decision.estimatedCost;
		}

		stats.averageConfidence /= this.history.length;
		stats.averageCost /= this.history.length;

		return stats;
	}
}

export function createModelRouter(
	costTracker: CostTracker,
	config?: Partial<RouterConfig>,
	availableModels?: Partial<AvailableModels>,
): ModelRouter {
	return new ModelRouter(costTracker, config, availableModels);
}
