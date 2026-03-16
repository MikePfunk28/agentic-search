/**
 * Unified Search Orchestrator
 * Combines agentic search, parallel model orchestration, and interleaved reasoning
 * This is what makes the search intelligent and validated
 */

import { AdversarialDifferentialDiscriminator } from "./add-discriminator";
import { agenticSearch } from "./agentic-search";
import { ComponentValidationPipeline } from "./component-validation-pipeline";
import { InterleavedReasoningEngine } from "./interleaved-reasoning-engine";
import {
	type ModelConfig,
	type ModelProvider,
	ProviderDefaults,
} from "./model-config";
import {
	type CostEstimate,
	type CostTracker,
	costTracker as defaultCostTracker,
} from "./model-routing";
import { ModelRouter, type RouterConfig } from "./model-routing/router";
import type { RoutingDecision } from "./model-routing/types";
import { observability } from "./observability";
import { ParallelModelOrchestrator } from "./parallel-model-orchestrator";
import {
	type EnhancementOptions,
	type QueryEnhancement,
	queryEnhancementPipeline,
} from "./query-enhancement";
import { researchStorage } from "./results-storage";
import { buildSearchEvidence } from "./search/evidence";
import {
	assignExecutionRoles,
	resolveSearchExecutionPolicy,
	type SearchExecutionSummary,
} from "./search/execution-policy";
import { QuerySegmenter, SegmentCoordinator } from "./segment";
import type { CheckpointEngine } from "./search/checkpoint-engine";
import { SemanticCache } from "./semantic-cache";
import type { SearchResult } from "./types";

const OPENAI_COMPATIBLE_REASONING_PROVIDERS = new Set([
	"openai",
	"ollama",
	"lm_studio",
	"deepseek",
	"moonshot",
	"kimi",
	"openrouter",
	"azure_openai",
	"vllm",
	"gguf",
	"onnx",
]);

export interface UnifiedSearchResult {
	results: SearchResult[];

	execution?: SearchExecutionSummary;

	parallelResults?: {
		models: Array<{
			model: string;
			response: string;
			confidence: number;
			tokenCount: number;
			processingTime: number;
			verdict?: "supported" | "mixed" | "insufficient" | "error";
			supportedResultIds?: string[];
		}>;
		consensus: string;
		overallConfidence: number;
		agreementScore: number;
		verificationMode?: "raw_query" | "evidence";
		supportedResultIds?: string[];
		evidenceCoverage?: number;
	};

	reasoningSteps?: Array<{
		step: string;
		type: "analysis" | "planning" | "execution" | "validation" | "synthesis";
		input: string;
		output: string;
		confidence: number;
		isValid: boolean;
		error?: string;
		duration: number;
	}>;

	segmentation?: {
		segmentCount: number;
		segments: Array<{
			id: string;
			type: string;
			text: string;
			modelUsed: string;
			tokensUsed: number;
			timeMs: number;
			success: boolean;
		}>;
		coordinationLog: Array<{
			timestamp: number;
			segmentId: string;
			action: string;
			metadata: Record<string, unknown>;
		}>;
		synthesizedResponse: string;
	};

	queryEnhancement?: QueryEnhancement;

	addMetrics: {
		relevance: number;
		diversity: number;
		freshness: number;
		consistency: number;
		overallScore: number;
		drift: number;
		trend: "improving" | "stable" | "declining";
		recommendation: string;
	};

	validation: {
		retrieval: { valid: boolean; confidence: number; errors: string[] };
		reasoning: { valid: boolean; confidence: number; errors: string[] };
		response: { valid: boolean; confidence: number; errors: string[] };
	};

	routing?: RoutingDecision & {
		costEstimate?: CostEstimate;
	};

	strategy: string;
	reasoning: string[];
	quality: number;
	timestamp: string;
	modelUsed: string;
	provider: string;
	totalTokens: number;
	totalProcessingTime: number;

	/** Checkpoint snapshots captured during this search (if checkpointEngine was provided) */
	checkpoints?: import("./search/checkpoint-engine").CheckpointSnapshot[];
	/** Session ID for the checkpoint engine (for corrections/rewind) */
	checkpointSessionId?: string;
}

export interface SearchOptions {
	useParallelModels?: boolean;
	useInterleavedReasoning?: boolean;
	enableValidation?: boolean;
	parallelModelConfigs?: ModelConfig[];
	useSegmentation?: boolean;
	useQueryEnhancement?: boolean;
	queryEnhancementOptions?: EnhancementOptions;
	useSemanticCache?: boolean;
	cacheTtl?: number;
	apiKeys?: {
		firecrawl?: string;
		tavily?: string;
		exa?: string;
		brave?: string;
	};
	/** Optional checkpoint engine for pause/rewind/edit support */
	checkpointEngine?: CheckpointEngine;
}

export class UnifiedSearchOrchestrator {
	private addDiscriminator: AdversarialDifferentialDiscriminator;
	private validationPipeline: ComponentValidationPipeline;
	private semanticCache: SemanticCache<UnifiedSearchResult>;
	private modelRouter: ModelRouter;
	private costTracker: CostTracker;

	constructor(routerConfig?: Partial<RouterConfig>) {
		this.addDiscriminator = new AdversarialDifferentialDiscriminator();
		this.validationPipeline = new ComponentValidationPipeline();
		this.semanticCache = new SemanticCache<UnifiedSearchResult>({
			similarityThreshold: 0.88,
			maxMemoryEntries: 500,
			defaultTtl: 5 * 60 * 1000,
		});
		this.costTracker = defaultCostTracker;
		this.modelRouter = new ModelRouter(this.costTracker, routerConfig);
	}

	/**
	 * Execute unified search with all advanced features
	 */
	async search(
		query: string,
		primaryModelConfig: ModelConfig | null | undefined,
		options: SearchOptions = {},
	): Promise<UnifiedSearchResult> {
		const startTime = Date.now();
		const {
			useParallelModels = true,
			useInterleavedReasoning = true,
			enableValidation = true,
			parallelModelConfigs = [],
			useSegmentation = false,
			useQueryEnhancement = true,
			queryEnhancementOptions = {},
			useSemanticCache = true,
			cacheTtl = 5 * 60 * 1000,
			checkpointEngine,
		} = options;
		const executionPolicy = resolveSearchExecutionPolicy({
			primaryModelConfig,
			parallelModelConfigs,
			requestedParallelModels: useParallelModels,
			requestedSegmentation: useSegmentation,
			requestedInterleavedReasoning: useInterleavedReasoning,
		});

		console.log(`[UnifiedSearch] Starting search for: "${query}"`);
		console.log(
			`[UnifiedSearch] Options: parallel=${useParallelModels}, reasoning=${useInterleavedReasoning}, validation=${enableValidation}, segmentation=${useSegmentation}, queryEnhancement=${useQueryEnhancement}, semanticCache=${useSemanticCache}`,
		);
		console.log(
			`[UnifiedSearch] Execution mode: ${executionPolicy.mode} (${executionPolicy.reason})`,
		);

		let enhancedQuery = query;
		let queryEnhancement: QueryEnhancement | undefined;

		if (useQueryEnhancement) {
			console.log("[UnifiedSearch] Phase 0: Enhancing query...");
			try {
				queryEnhancement = await queryEnhancementPipeline.enhance(
					query,
					queryEnhancementOptions,
				);
				enhancedQuery = queryEnhancement.enhancedQuery;

				if (queryEnhancement.corrections.length > 0) {
					console.log(
						`[UnifiedSearch] Spelling corrections: ${queryEnhancement.corrections.map((c) => `${c.original}→${c.corrected}`).join(", ")}`,
					);
				}
				if (queryEnhancement.entities.length > 0) {
					console.log(
						`[UnifiedSearch] Detected entities: ${queryEnhancement.entities.map((e) => e.text).join(", ")}`,
					);
				}
				if (enhancedQuery !== query) {
					console.log(`[UnifiedSearch] Enhanced query: "${enhancedQuery}"`);
				}
			} catch (error) {
				console.warn(
					"[UnifiedSearch] Query enhancement failed, using original:",
					error,
				);
			}
		}

		// Checkpoint: Query Understanding
		if (checkpointEngine) {
			await checkpointEngine.captureAndMaybePause("query_parsed", {
				originalQuery: query,
				enhancedQuery,
				entities: queryEnhancement?.entities ?? [],
				corrections: queryEnhancement?.corrections ?? [],
			});
			// If the user edited the query at this checkpoint, pick up the change
			const cp = checkpointEngine.getCheckpoint("query_parsed");
			if (cp?.edited && typeof cp.data.enhancedQuery === "string") {
				enhancedQuery = cp.data.enhancedQuery;
			}
		}

		if (useSemanticCache) {
			console.log("[UnifiedSearch] Checking semantic cache...");
			const cacheResult = await this.semanticCache.get(enhancedQuery);
			if (cacheResult.hit) {
				console.log(
					`[UnifiedSearch] Cache HIT! Similarity: ${(cacheResult.similarity * 100).toFixed(1)}%`,
				);
				const cachedResult = cacheResult.entry.value;
				const cacheHitTime = Date.now() - startTime;

				observability.traceSearch({
					query,
					enhancedQuery,
					provider: cachedResult.provider,
					model: cachedResult.modelUsed,
					tokensUsed: cachedResult.totalTokens,
					processingTimeMs: cacheHitTime,
					cacheHit: true,
					resultCount: cachedResult.results.length,
					qualityScore: cachedResult.addMetrics?.overallScore ?? 0,
				});

				return {
					...cachedResult,
					reasoning: [
						`Retrieved from semantic cache (${(cacheResult.similarity * 100).toFixed(1)}% similarity)`,
						...cachedResult.reasoning,
					],
					totalProcessingTime: cacheHitTime,
				};
			}
			console.log("[UnifiedSearch] Cache miss - executing fresh search");
		}

		const routingDecision = this.modelRouter.route(
			enhancedQuery,
			primaryModelConfig
				? [primaryModelConfig, ...parallelModelConfigs]
				: parallelModelConfigs,
		);
		const costEstimate = this.costTracker.estimateCost(
			enhancedQuery,
			routingDecision.model,
			routingDecision.provider,
		);

		console.log(
			`[UnifiedSearch] Model routing: ${routingDecision.provider}:${routingDecision.model} (complexity: ${routingDecision.complexity}, confidence: ${(routingDecision.confidence * 100).toFixed(0)}%, estimated cost: $${costEstimate.totalEstimatedCost.toFixed(4)})`,
		);
		console.log(`[UnifiedSearch] Routing reason: ${routingDecision.reason}`);

		observability.traceSearch({
			query,
			enhancedQuery,
			provider: routingDecision.provider,
			model: routingDecision.model,
			tokensUsed: 0,
			processingTimeMs: 0,
			cacheHit: false,
			resultCount: 0,
			qualityScore: routingDecision.confidence,
		});

		// Checkpoint: Intent Analysis (routing decision captures intent + complexity)
		if (checkpointEngine) {
			await checkpointEngine.captureAndMaybePause("intent_analyzed", {
				complexity: routingDecision.complexity,
				confidence: routingDecision.confidence,
				model: routingDecision.model,
				provider: routingDecision.provider,
				reason: routingDecision.reason,
			});
		}

		// Checkpoint: Search Strategy
		if (checkpointEngine) {
			await checkpointEngine.captureAndMaybePause("strategy_planned", {
				enhancedQuery,
				executionMode: executionPolicy.mode,
				useParallelModels: executionPolicy.useParallelModels,
				useInterleavedReasoning: executionPolicy.useInterleavedReasoning,
				useSegmentation: executionPolicy.useSegmentation,
				modelCount: executionPolicy.modelCount,
			});
		}

		if (executionPolicy.useSegmentation && primaryModelConfig) {
			console.log("[UnifiedSearch] Routing to segmented search...");
			return this.searchWithSegmentation(
				enhancedQuery,
				primaryModelConfig,
				options,
			);
		}

		try {
			console.log("[UnifiedSearch] Phase 1: Executing base agentic search...");
			const baseSearchResult = await agenticSearch.search(
				enhancedQuery,
				primaryModelConfig,
				{ searchApiKeys: options.apiKeys },
			);

			if (baseSearchResult.results.length === 0) {
				const cachedResults = await researchStorage.findRelevantResults(
					query,
					10,
				);
				if (cachedResults.length > 0) {
					console.warn(
						`[UnifiedSearch] Live providers returned no results. Falling back to ${cachedResults.length} cached result(s).`,
					);
					baseSearchResult.results = cachedResults;
					baseSearchResult.reasoning.push(
						`Falling back to ${cachedResults.length} cached result(s) from prior successful searches.`,
					);
				}
			}

			// Checkpoint: Raw Results Retrieved
			if (checkpointEngine) {
				await checkpointEngine.captureAndMaybePause("results_retrieved", {
					resultCount: baseSearchResult.results.length,
					results: baseSearchResult.results.map((r) => ({
						title: r.title,
						url: r.url,
						snippet: r.snippet?.slice(0, 200),
					})),
					reasoning: baseSearchResult.reasoning,
				});
			}

			let parallelResults: UnifiedSearchResult["parallelResults"];
			let reasoningSteps: UnifiedSearchResult["reasoningSteps"];
			let totalTokens = 0;
			const evidenceBundle = buildSearchEvidence(
				query,
				baseSearchResult.results,
			);

			// Phase 2: Parallel model orchestration (if enabled and configs provided)
			if (
				executionPolicy.useParallelModels &&
				parallelModelConfigs.length > 0
			) {
				console.log(
					`[UnifiedSearch] Phase 2: Running parallel models (${parallelModelConfigs.length} models)...`,
				);

				const parallelConfigs = assignExecutionRoles(
					parallelModelConfigs,
					executionPolicy.mode,
				);

				const orchestrator = new ParallelModelOrchestrator(parallelConfigs);

				const parallelResult =
					evidenceBundle.items.length > 0
						? await orchestrator.runEvidenceVerification(
								query,
								evidenceBundle,
								parallelConfigs,
							)
						: await orchestrator.runParallel(query, parallelConfigs);

				parallelResults = {
					models: parallelResult.responses.map((r) => ({
						model: r.modelName,
						response: r.response,
						confidence: r.confidence,
						tokenCount: r.tokenCount,
						processingTime: r.processingTime,
						verdict: r.verdict,
						supportedResultIds: r.supportedResultIds,
					})),
					consensus: parallelResult.consensus ?? "",
					overallConfidence: parallelResult.confidenceScore,
					agreementScore: parallelResult.consensusAnalysis.agreementScore,
					verificationMode: parallelResult.verificationMode,
					supportedResultIds: parallelResult.supportedResultIds,
					evidenceCoverage: parallelResult.evidenceCoverage,
				};

				totalTokens += parallelResult.totalTokens;
				console.log(
					`[UnifiedSearch] Parallel models completed. Confidence: ${parallelResult.confidenceScore.toFixed(2)}, ` +
						`Agreement: ${(parallelResult.consensusAnalysis.agreementScore * 100).toFixed(0)}%, ` +
						`Strategy: ${parallelResult.consensusAnalysis.strategy}, ` +
						`Mode: ${parallelResult.verificationMode || "raw_query"}`,
				);
			}

			// Phase 3: Interleaved reasoning (if enabled and model available)
			if (executionPolicy.useInterleavedReasoning && primaryModelConfig) {
				if (
					OPENAI_COMPATIBLE_REASONING_PROVIDERS.has(primaryModelConfig.provider)
				) {
					console.log(
						"[UnifiedSearch] Phase 3: Executing interleaved reasoning...",
					);

					try {
						const resolvedBaseUrl =
							primaryModelConfig.baseUrl ||
							ProviderDefaults[primaryModelConfig.provider as ModelProvider]
								?.baseUrl ||
							(primaryModelConfig.provider === "ollama"
								? "http://localhost:11434/v1"
								: undefined);
						if (!resolvedBaseUrl) {
							throw new Error(
								`baseUrl is required for interleaved reasoning with provider ${primaryModelConfig.provider}`,
							);
						}
						const baseUrl = resolvedBaseUrl.replace(/\/_?v1$/, "");
						const reasoningEngine = new InterleavedReasoningEngine(
							{
								orchestratorModel: primaryModelConfig.model,
								validatorModel: primaryModelConfig.model,
							},
							baseUrl,
							primaryModelConfig.apiKey ||
								(primaryModelConfig.provider === "ollama" ? "ollama" : "local"),
						);

						const reasoningResult = await reasoningEngine.reason(query, {
							searchResults: baseSearchResult.results,
						});
						const averageStepDuration =
							reasoningResult.steps.length > 0
								? reasoningResult.processingTime / reasoningResult.steps.length
								: 0;

						reasoningSteps = reasoningResult.steps.map((step) => ({
							step: step.id,
							type: step.type as
								| "analysis"
								| "planning"
								| "execution"
								| "validation"
								| "synthesis",
							input: step.input,
							output: step.output,
							confidence: step.confidence,
							isValid: step.validated,
							error: step.validationErrors?.[0],
							duration: averageStepDuration,
						}));

						totalTokens += reasoningResult.totalTokens;
						console.log(
							`[UnifiedSearch] Reasoning completed. ${reasoningResult.steps.length} steps, confidence: ${reasoningResult.overallConfidence.toFixed(2)}`,
						);
					} catch (error) {
						console.error(
							"[UnifiedSearch] Interleaved reasoning failed, continuing with base search results:",
							error,
						);
					}
				} else {
					console.log(
						`[UnifiedSearch] Skipping interleaved reasoning for unsupported provider ${primaryModelConfig.provider}`,
					);
				}
			}

			// Checkpoint: Reasoning Complete
			if (checkpointEngine && reasoningSteps) {
				await checkpointEngine.captureAndMaybePause("reasoning_complete", {
					stepCount: reasoningSteps.length,
					steps: reasoningSteps.map((s) => ({
						step: s.step,
						type: s.type,
						confidence: s.confidence,
						isValid: s.isValid,
					})),
				});
			}

			// Phase 4: ADD quality metrics — derived from the per-result scores
			// that agenticSearch.assessAndRankResults() already computed.
			// Previously this ran a weaker second-pass scorer (addDiscriminator)
			// whose output disagreed with the per-result addScores. Now we derive
			// the summary metrics directly from the strong scorer's output.
			console.log(
				"[UnifiedSearch] Phase 4: Calculating ADD quality metrics...",
			);
			const results = baseSearchResult.results;
			const qualityScores = baseSearchResult.quality || [];
			const avgAdd =
				results.length > 0
					? results.reduce((s, r) => s + (r.addScore || 0), 0) / results.length
					: 0;
			const avgRelevance =
				qualityScores.length > 0
					? qualityScores.reduce((s, q) => s + (q.relevance || 0), 0) /
						qualityScores.length
					: avgAdd;
			const avgFreshness =
				qualityScores.length > 0
					? qualityScores.reduce((s, q) => s + (q.freshness || 0), 0) /
						qualityScores.length
					: 0.5;
			const _avgCredibility =
				qualityScores.length > 0
					? qualityScores.reduce((s, q) => s + (q.credibility || 0), 0) /
						qualityScores.length
					: 0.5;
			// Diversity: measure uniqueness of domains
			const uniqueDomains = new Set(
				results.map((r) => {
					try {
						return new URL(r.url).hostname;
					} catch {
						return r.url;
					}
				}),
			);
			const diversityScore =
				results.length > 0
					? Math.min(1.0, uniqueDomains.size / Math.max(results.length, 1))
					: 0;
			// Consistency: all results have required fields
			const consistencyScore =
				results.length > 0
					? results.filter((r) => r.url && r.snippet && r.title).length /
						results.length
					: 0;

			// Still run drift analysis from the discriminator for trend tracking
			this.addDiscriminator.scoreResults(query, results);
			const driftAnalysis = this.addDiscriminator.analyzeDrift();

			const addMetrics = {
				relevance: avgRelevance,
				diversity: diversityScore,
				freshness: avgFreshness,
				consistency: consistencyScore,
				overallScore: avgAdd,
				drift: driftAnalysis.driftMagnitude,
				trend: this.addDiscriminator.getMetrics().recentTrend,
				recommendation: driftAnalysis.recommendation,
			};

			// Checkpoint: Quality Scored
			if (checkpointEngine) {
				await checkpointEngine.captureAndMaybePause("results_scored", {
					resultCount: results.length,
					addMetrics: { ...addMetrics },
					topResults: results.slice(0, 5).map((r) => ({
						title: r.title,
						url: r.url,
						addScore: r.addScore,
					})),
				});
			}

			// Phase 5: Component validation (if enabled)
			const validation: UnifiedSearchResult["validation"] = {
				retrieval: {
					valid: false,
					confidence: 0,
					errors: ["not yet validated"] as string[],
				},
				reasoning: {
					valid: false,
					confidence: 0,
					errors: ["not yet validated"] as string[],
				},
				response: {
					valid: false,
					confidence: 0,
					errors: ["not yet validated"] as string[],
				},
			};

			if (enableValidation) {
				console.log("[UnifiedSearch] Phase 5: Validating components...");

				const finalResponse =
					parallelResults?.consensus || baseSearchResult.reasoning.join("\n");
				const pipeline = await this.validationPipeline.validate({
					query,
					searchResults: baseSearchResult.results,
					reasoningSteps: (reasoningSteps || []).map((s) => ({
						input: s.input,
						output: s.output,
						confidence: s.confidence,
					})),
					finalResponse,
				});

				const retrievalComp = pipeline.components.find(
					(c) => c.componentName === "retrieval",
				);
				const reasoningComp = pipeline.components.find(
					(c) => c.componentName === "reasoning",
				);
				const responseComp = pipeline.components.find(
					(c) => c.componentName === "response",
				);

				if (retrievalComp) {
					validation.retrieval = {
						valid: retrievalComp.valid,
						confidence: retrievalComp.confidence,
						errors: retrievalComp.errors,
					};
				}
				if (reasoningComp) {
					validation.reasoning = {
						valid: reasoningComp.valid,
						confidence: reasoningComp.confidence,
						errors: reasoningComp.errors,
					};
				}
				if (responseComp) {
					validation.response = {
						valid: responseComp.valid,
						confidence: responseComp.confidence,
						errors: responseComp.errors,
					};
				}

				console.log(
					`[UnifiedSearch] Validation complete. Retrieval: ${validation.retrieval.valid}, Reasoning: ${validation.reasoning.valid}, Response: ${validation.response.valid}`,
				);
			}

			// Checkpoint: Final Validation
			if (checkpointEngine) {
				await checkpointEngine.captureAndMaybePause("validation_complete", {
					retrieval: { ...validation.retrieval },
					reasoning: { ...validation.reasoning },
					response: { ...validation.response },
				});
				checkpointEngine.markComplete();
			}

			const totalProcessingTime = Date.now() - startTime;

			// Additional protection: high-risk query cross-check
			const isHighRisk = this.isHighRiskQuery(query);
			if (isHighRisk) {
				const weakEvidenceVerification =
					!parallelResults ||
					(parallelResults.agreementScore ?? 0) < 0.6 ||
					parallelResults.verificationMode !== "evidence" ||
					(parallelResults.evidenceCoverage ?? 0) < 0.2;
				if (weakEvidenceVerification) {
					validation.response = {
						valid: false,
						confidence: (validation.response.confidence ?? 0) * 0.6,
						errors: [
							...validation.response.errors,
							"High-risk query lacked evidence-grounded consensus",
						],
					};
				}
			}

			const result: UnifiedSearchResult = {
				results: baseSearchResult.results,
				execution: {
					mode: executionPolicy.mode,
					reason: executionPolicy.reason,
					modelCount: executionPolicy.modelCount,
				},
				parallelResults,
				reasoningSteps,
				queryEnhancement,
				routing: {
					...routingDecision,
					costEstimate,
				},
				addMetrics,
				validation,
				strategy: baseSearchResult.strategy.primaryQuery,
				reasoning: baseSearchResult.reasoning,
				quality:
					baseSearchResult.quality.length > 0
						? baseSearchResult.quality.reduce((sum, q) => sum + q.addScore, 0) /
							baseSearchResult.quality.length
						: 0,
				timestamp: new Date().toISOString(),
				modelUsed: primaryModelConfig?.model ?? "none",
				provider: primaryModelConfig?.provider ?? "web-only",
				totalTokens,
				totalProcessingTime,
				checkpoints: checkpointEngine?.getCheckpoints(),
				checkpointSessionId: checkpointEngine?.getSessionId(),
			};

			console.log(
				`[UnifiedSearch] Search completed in ${totalProcessingTime}ms`,
			);
			console.log(
				`[UnifiedSearch] Quality: ${addMetrics.overallScore.toFixed(2)}, Tokens: ${totalTokens}`,
			);

			observability.traceSearch({
				query,
				enhancedQuery,
				provider: primaryModelConfig?.provider,
				model: primaryModelConfig?.model,
				tokensUsed: totalTokens,
				processingTimeMs: totalProcessingTime,
				cacheHit: false,
				resultCount: result.results.length,
				qualityScore: addMetrics.overallScore,
			});

			if (useSemanticCache && result.results.length > 0) {
				await this.semanticCache.set(
					enhancedQuery,
					result,
					{
						provider: primaryModelConfig?.provider,
						model: primaryModelConfig?.model,
						tokensUsed: totalTokens,
						quality: addMetrics.overallScore,
					},
					cacheTtl,
				);
				console.log("[UnifiedSearch] Result cached for future queries");
			}

			return result;
		} catch (error) {
			console.error("[UnifiedSearch] Search failed:", error);

			// Return fallback result
			return {
				results: [],
				execution: {
					mode: executionPolicy.mode,
					reason: executionPolicy.reason,
					modelCount: executionPolicy.modelCount,
				},
				addMetrics: {
					relevance: 0,
					diversity: 0,
					freshness: 0,
					consistency: 0,
					overallScore: 0,
					drift: 0,
					trend: "declining",
					recommendation: "System error - please retry",
				},
				validation: {
					retrieval: { valid: false, confidence: 0, errors: ["Search failed"] },
					reasoning: { valid: false, confidence: 0, errors: ["Not executed"] },
					response: { valid: false, confidence: 0, errors: ["Not generated"] },
				},
				strategy: "error",
				reasoning: [
					`Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				],
				quality: 0,
				timestamp: new Date().toISOString(),
				modelUsed: primaryModelConfig?.model ?? "none",
				provider: primaryModelConfig?.provider ?? "web-only",
				totalTokens: 0,
				totalProcessingTime: Date.now() - startTime,
			};
		}
	}

	/**
	 * Execute search with query segmentation and coordination
	 */
	async searchWithSegmentation(
		query: string,
		primaryModelConfig: ModelConfig,
		options: SearchOptions = {},
	): Promise<UnifiedSearchResult> {
		const startTime = Date.now();
		const { enableValidation = true } = options;

		console.log(`[SegmentedSearch] Starting segmented search for: "${query}"`);
		console.log(
			`[SegmentedSearch] This will work equally well with tiny or powerful models!`,
		);

		try {
			// Phase 1: Query Segmentation
			console.log("[SegmentedSearch] Phase 1: Segmenting query...");
			const segmenter = new QuerySegmenter(primaryModelConfig);
			const segmentation = await segmenter.segment(query);

			console.log(
				`[SegmentedSearch] Created ${segmentation.segments.length} segments:`,
			);
			segmentation.segments.forEach((seg) => {
				console.log(
					`  - ${seg.type}: "${seg.text}" (priority: ${seg.priority}, complexity: ${seg.estimatedComplexity})`,
				);
				console.log(
					`    Recommended model: ${seg.recommendedModel} (SUGGESTION ONLY - user controls actual model)`,
				);
			});

			// Phase 2: Segment Coordination and Execution
			console.log(
				`[SegmentedSearch] Phase 2: Executing ${segmentation.segments.length} segments with coordination...`,
			);
			const coordinator = new SegmentCoordinator(
				primaryModelConfig,
				options.apiKeys,
			);
			const coordinatedResult = await coordinator.execute(segmentation);

			// If segmented search returned nothing, fall back to the non-segmented path
			if (coordinatedResult.finalResults.length === 0) {
				console.warn(
					"[SegmentedSearch] Zero results — falling back to non-segmented path",
				);
				throw new Error("Segmented search returned zero results");
			}

			console.log(`[SegmentedSearch] Coordination complete!`);
			console.log(
				`  - Completed segments: ${coordinatedResult.coordinationState.completedSegments.size}`,
			);
			console.log(
				`  - Failed segments: ${coordinatedResult.coordinationState.failedSegments.size}`,
			);
			console.log(
				`  - Total coordination events: ${coordinatedResult.coordinationState.coordinationLog.length}`,
			);

			// Phase 3: ADD Quality Scoring (aggregate metrics for the unified result)
			console.log(
				"[SegmentedSearch] Phase 3: Calculating ADD quality metrics...",
			);
			const addScore = this.addDiscriminator.scoreResults(
				query,
				coordinatedResult.finalResults,
			);

			const driftAnalysis = this.addDiscriminator.analyzeDrift();
			const metrics = this.addDiscriminator.getMetrics();

			const addMetrics = {
				relevance: addScore.relevanceScore,
				diversity: addScore.diversityScore,
				freshness: addScore.freshnessScore,
				consistency: addScore.consistencyScore,
				overallScore: addScore.overallScore,
				drift: driftAnalysis.driftMagnitude,
				trend: metrics.recentTrend,
				recommendation: driftAnalysis.recommendation,
			};

			// Phase 4: Component Validation (if enabled)
			const validation: UnifiedSearchResult["validation"] = {
				retrieval: {
					valid: false,
					confidence: 0,
					errors: ["not yet validated"] as string[],
				},
				reasoning: {
					valid: false,
					confidence: 0,
					errors: ["not yet validated"] as string[],
				},
				response: {
					valid: false,
					confidence: 0,
					errors: ["not yet validated"] as string[],
				},
			};

			if (enableValidation) {
				console.log("[SegmentedSearch] Phase 4: Validating components...");

				const pipeline = await this.validationPipeline.validate({
					query,
					searchResults: coordinatedResult.finalResults,
					reasoningSteps: [],
					finalResponse: coordinatedResult.synthesizedResponse,
				});

				const retrievalComp = pipeline.components.find(
					(c) => c.componentName === "retrieval",
				);
				const responseComp = pipeline.components.find(
					(c) => c.componentName === "response",
				);

				if (retrievalComp) {
					validation.retrieval = {
						valid: retrievalComp.valid,
						confidence: retrievalComp.confidence,
						errors: retrievalComp.errors,
					};
				}
				if (responseComp) {
					validation.response = {
						valid: responseComp.valid,
						confidence: responseComp.confidence,
						errors: responseComp.errors,
					};
				}

				console.log(
					`[SegmentedSearch] Validation complete. Retrieval: ${validation.retrieval.valid}, Response: ${validation.response.valid}`,
				);
			}

			const totalProcessingTime = Date.now() - startTime;

			// Prepare segmentation details for response
			const segmentationDetails = {
				segmentCount: segmentation.segments.length,
				segments: coordinatedResult.segmentBreakdown.map((seg) => ({
					id: seg.segmentId,
					type: seg.type,
					text:
						segmentation.segments.find((s) => s.id === seg.segmentId)?.text ||
						"",
					modelUsed: seg.modelUsed,
					tokensUsed: seg.tokensUsed,
					timeMs: seg.timeMs,
					success: seg.success,
				})),
				coordinationLog: coordinatedResult.coordinationState.coordinationLog,
				synthesizedResponse: coordinatedResult.synthesizedResponse,
			};

			const result: UnifiedSearchResult = {
				results: coordinatedResult.finalResults,
				execution: {
					mode: "single_model",
					reason:
						"Segmented search currently requires a primary model and coordinated execution.",
					modelCount: 1,
				},
				segmentation: segmentationDetails,
				addMetrics,
				validation,
				strategy: "segmented",
				reasoning: [
					`Query segmented into ${segmentation.segments.length} coordinated parts`,
					`Execution graph: ${segmentation.executionGraph.totalStages} stages`,
					`Segments communicated via shared context pool`,
					coordinatedResult.synthesizedResponse,
				],
				quality: coordinatedResult.quality.overall,
				timestamp: new Date().toISOString(),
				modelUsed: primaryModelConfig.model,
				provider: primaryModelConfig.provider,
				totalTokens: coordinatedResult.totalTokens,
				totalProcessingTime,
			};

			console.log(
				`[SegmentedSearch] Search completed in ${totalProcessingTime}ms`,
			);
			console.log(
				`[SegmentedSearch] Quality: ${coordinatedResult.quality.overall.toFixed(2)}, Tokens: ${coordinatedResult.totalTokens}`,
			);
			console.log(
				`[SegmentedSearch] Segmentation completed with intelligent coordination!`,
			);

			return result;
		} catch (error) {
			console.error("[SegmentedSearch] Search failed:", error);
			console.log("[SegmentedSearch] Falling back to non-segmented search");
			return this.search(query, primaryModelConfig, {
				...options,
				useSegmentation: false,
			});
		}
	}

	/**
	 * Export training data for fine-tuning
	 */
	async exportTrainingData(_includeUserFeedback = true): Promise<string> {
		// Get current metrics from ADD discriminator
		const metrics = this.addDiscriminator.getMetrics();

		return JSON.stringify(
			{
				currentScore: metrics.currentScore,
				historicalAverage: metrics.historicalAverage,
				trend: metrics.recentTrend,
			},
			null,
			2,
		);
	}

	/**
	 * Get performance statistics
	 */
	getStatistics() {
		return {
			addMetrics: this.addDiscriminator.getMetrics(),
			driftAnalysis: this.addDiscriminator.analyzeDrift(),
			validationStats: this.validationPipeline.getStatistics(),
		};
	}

	private isHighRiskQuery(query: string): boolean {
		const q = query.toLowerCase();
		const riskTerms = [
			"password",
			"token",
			"api key",
			"secret",
			"auth",
			"login",
			"payment",
			"stripe",
			"bank",
			"invoice",
			"billing",
			"pii",
			"personal data",
			"gdpr",
			"hipaa",
		];
		return riskTerms.some((t) => q.includes(t));
	}
}

// Singleton instance
export const unifiedSearchOrchestrator = new UnifiedSearchOrchestrator();
