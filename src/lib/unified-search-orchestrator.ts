/**
 * Unified Search Orchestrator
 * Combines agentic search, parallel model orchestration, and interleaved reasoning
 * This is what makes the search intelligent and validated
 */

import type { ModelConfig } from "./model-config";
import { agenticSearch } from "./agentic-search";
import { ParallelModelOrchestrator } from "./parallel-model-orchestrator";
import { InterleavedReasoningEngine } from "./interleaved-reasoning-engine";
import { AdversarialDifferentialDiscriminator } from "./add-discriminator";
import { ComponentValidationPipeline } from "./component-validation-pipeline";
import { researchStorage } from "./results-storage";
import type { SearchResult } from "./types";
import { QuerySegmenter, SegmentCoordinator } from "./segment";

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
  // Search results
  results: SearchResult[];

  // Parallel model outputs
  parallelResults?: {
    models: Array<{
      model: string;
      response: string;
      confidence: number;
      tokenCount: number;
      processingTime: number;
    }>;
    consensus: string;
    overallConfidence: number;
    agreementScore: number;
  };

  // Interleaved reasoning steps
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

  // Segmentation results (if enabled)
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
      metadata: any;
    }>;
    synthesizedResponse: string;
  };

  // Quality metrics
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

  // Component validation
  validation: {
    retrieval: { valid: boolean; confidence: number; errors: string[] };
    reasoning: { valid: boolean; confidence: number; errors: string[] };
    response: { valid: boolean; confidence: number; errors: string[] };
  };

  // Metadata
  strategy: string;
  reasoning: string[];
  quality: number;
  timestamp: string;
  modelUsed: string;
  provider: string;
  totalTokens: number;
  totalProcessingTime: number;
}

export interface SearchOptions {
  useParallelModels?: boolean;
  useInterleavedReasoning?: boolean;
  enableValidation?: boolean;
  parallelModelConfigs?: ModelConfig[];
  useSegmentation?: boolean; // Enable query segmentation and coordination
  apiKeys?: { firecrawl?: string; tavily?: string; exa?: string; brave?: string };
}

export class UnifiedSearchOrchestrator {
  private addDiscriminator: AdversarialDifferentialDiscriminator;
  private validationPipeline: ComponentValidationPipeline;

  constructor() {
    this.addDiscriminator = new AdversarialDifferentialDiscriminator();
    this.validationPipeline = new ComponentValidationPipeline();
  }

  /**
   * Execute unified search with all advanced features
   */
  async search(
    query: string,
    primaryModelConfig: ModelConfig | null | undefined,
    options: SearchOptions = {}
  ): Promise<UnifiedSearchResult> {
    const startTime = Date.now();
    const {
      useParallelModels = true,
      useInterleavedReasoning = true,
      enableValidation = true,
      parallelModelConfigs = [],
      useSegmentation = false,
    } = options;

    console.log(`[UnifiedSearch] Starting search for: "${query}"`);
    console.log(`[UnifiedSearch] Options: parallel=${useParallelModels}, reasoning=${useInterleavedReasoning}, validation=${enableValidation}, segmentation=${useSegmentation}`);

    // Route to segmented search if enabled (requires a model)
    if (useSegmentation && primaryModelConfig) {
      console.log('[UnifiedSearch] Routing to segmented search...');
      return this.searchWithSegmentation(query, primaryModelConfig, options);
    }

    try {
      // Phase 1: Execute base agentic search
      console.log("[UnifiedSearch] Phase 1: Executing base agentic search...");
      const baseSearchResult = await agenticSearch.search(query, primaryModelConfig, { searchApiKeys: options.apiKeys });

      if (baseSearchResult.results.length === 0) {
        const cachedResults = researchStorage.findRelevantResults(query, 10);
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

      let parallelResults;
      let reasoningSteps;
      let totalTokens = 0;

      // Phase 2: Parallel model orchestration (if enabled and configs provided)
      if (useParallelModels && parallelModelConfigs.length > 0) {
        console.log(`[UnifiedSearch] Phase 2: Running parallel models (${parallelModelConfigs.length} models)...`);

        // Convert ModelConfig[] to ParallelModelConfig[] for the orchestrator
        const parallelConfigs = parallelModelConfigs.map((config) => ({
          name: `${config.provider}:${config.model}`,
          config,
          role: ("reasoner" as const),
        }));

        const orchestrator = new ParallelModelOrchestrator(parallelConfigs);

        // Use parallel execution for diverse perspectives
        const parallelResult = await orchestrator.runParallel(query, parallelConfigs);

        parallelResults = {
          models: parallelResult.responses.map(r => ({
            model: r.modelName,
            response: r.response,
            confidence: r.confidence,
            tokenCount: r.tokenCount,
            processingTime: r.processingTime,
          })),
          consensus: parallelResult.consensus ?? '',
          overallConfidence: parallelResult.confidenceScore,
          agreementScore: parallelResult.consensusAnalysis.agreementScore,
        };

        totalTokens += parallelResult.totalTokens;
        console.log(
          `[UnifiedSearch] Parallel models completed. Confidence: ${parallelResult.confidenceScore.toFixed(2)}, ` +
          `Agreement: ${(parallelResult.consensusAnalysis.agreementScore * 100).toFixed(0)}%, ` +
          `Strategy: ${parallelResult.consensusAnalysis.strategy}`
        );
      }

      // Phase 3: Interleaved reasoning (if enabled and model available)
      if (useInterleavedReasoning && primaryModelConfig) {
        if (OPENAI_COMPATIBLE_REASONING_PROVIDERS.has(primaryModelConfig.provider)) {
          console.log("[UnifiedSearch] Phase 3: Executing interleaved reasoning...");

          try {
            const baseUrl = (primaryModelConfig.baseUrl || 'http://localhost:11434').replace(/\/_?v1$/, '');
            const reasoningEngine = new InterleavedReasoningEngine(
              {
                orchestratorModel: primaryModelConfig.model,
                validatorModel: primaryModelConfig.model,
              },
              baseUrl,
              primaryModelConfig.apiKey || (primaryModelConfig.provider === "ollama" ? "ollama" : "local"),
            );

            const reasoningResult = await reasoningEngine.reason(query, { searchResults: baseSearchResult.results });
            const averageStepDuration = reasoningResult.steps.length > 0
              ? reasoningResult.processingTime / reasoningResult.steps.length
              : 0;

            reasoningSteps = reasoningResult.steps.map(step => ({
              step: step.id,
              type: step.type as "analysis" | "planning" | "execution" | "validation" | "synthesis",
              input: step.input,
              output: step.output,
              confidence: step.confidence,
              isValid: step.validated,
              error: step.validationErrors?.[0],
              duration: averageStepDuration,
            }));

            totalTokens += reasoningResult.totalTokens;
            console.log(`[UnifiedSearch] Reasoning completed. ${reasoningResult.steps.length} steps, confidence: ${reasoningResult.overallConfidence.toFixed(2)}`);
          } catch (error) {
            console.error("[UnifiedSearch] Interleaved reasoning failed, continuing with base search results:", error);
          }
        } else {
          console.log(`[UnifiedSearch] Skipping interleaved reasoning for unsupported provider ${primaryModelConfig.provider}`);
        }
      }

      // Phase 4: ADD quality scoring
      console.log("[UnifiedSearch] Phase 4: Calculating ADD quality metrics...");
      const addScore = this.addDiscriminator.scoreResults(query, baseSearchResult.results);
      const driftAnalysis = this.addDiscriminator.analyzeDrift();

      const addMetrics = {
        relevance: addScore.relevanceScore,
        diversity: addScore.diversityScore,
        freshness: addScore.freshnessScore,
        consistency: addScore.consistencyScore,
        overallScore: addScore.overallScore,
        drift: driftAnalysis.driftMagnitude,
        trend: this.addDiscriminator.getMetrics().recentTrend,
        recommendation: driftAnalysis.recommendation,
      };

      // Phase 5: Component validation (if enabled)
      let validation = {
        retrieval: { valid: false, confidence: 0, errors: ['not yet validated'] as string[] },
        reasoning: { valid: false, confidence: 0, errors: ['not yet validated'] as string[] },
        response: { valid: false, confidence: 0, errors: ['not yet validated'] as string[] },
      };

      if (enableValidation) {
        console.log("[UnifiedSearch] Phase 5: Validating components...");

        const finalResponse = parallelResults?.consensus || baseSearchResult.reasoning.join('\n');
        const pipeline = await this.validationPipeline.validate({
          query,
          searchResults: baseSearchResult.results,
          reasoningSteps: (reasoningSteps || []).map(s => ({ input: s.input, output: s.output, confidence: s.confidence })),
          finalResponse,
        });

        const retrievalComp = pipeline.components.find(c => c.componentName === 'retrieval');
        const reasoningComp = pipeline.components.find(c => c.componentName === 'reasoning');
        const responseComp = pipeline.components.find(c => c.componentName === 'response');

        if (retrievalComp) {
          validation.retrieval = { valid: retrievalComp.valid, confidence: retrievalComp.confidence, errors: retrievalComp.errors };
        }
        if (reasoningComp) {
          validation.reasoning = { valid: reasoningComp.valid, confidence: reasoningComp.confidence, errors: reasoningComp.errors };
        }
        if (responseComp) {
          validation.response = { valid: responseComp.valid, confidence: responseComp.confidence, errors: responseComp.errors };
        }

        console.log(`[UnifiedSearch] Validation complete. Retrieval: ${validation.retrieval.valid}, Reasoning: ${validation.reasoning.valid}, Response: ${validation.response.valid}`);
      }

      const totalProcessingTime = Date.now() - startTime;

      // Additional protection: high-risk query cross-check
      const isHighRisk = this.isHighRiskQuery(query);
      if (isHighRisk) {
        if (!parallelResults || (parallelResults.agreementScore ?? 0) < 0.6) {
          validation.response = {
            valid: false,
            confidence: (validation.response.confidence ?? 0) * 0.6,
            errors: [...validation.response.errors, 'High-risk query lacked consensus across sources'],
          };
        }
      }

      const result: UnifiedSearchResult = {
        results: baseSearchResult.results,
        parallelResults,
        reasoningSteps,
        addMetrics,
        validation,
        strategy: baseSearchResult.strategy.primaryQuery,
        reasoning: baseSearchResult.reasoning,
        quality: baseSearchResult.quality.length > 0
          ? baseSearchResult.quality.reduce((sum, q) => sum + q.addScore, 0) / baseSearchResult.quality.length
          : 0,
        timestamp: new Date().toISOString(),
        modelUsed: primaryModelConfig?.model ?? 'none',
        provider: primaryModelConfig?.provider ?? 'web-only',
        totalTokens,
        totalProcessingTime,
      };

      console.log(`[UnifiedSearch] Search completed in ${totalProcessingTime}ms`);
      console.log(`[UnifiedSearch] Quality: ${addMetrics.overallScore.toFixed(2)}, Tokens: ${totalTokens}`);

      return result;

    } catch (error) {
      console.error("[UnifiedSearch] Search failed:", error);

      // Return fallback result
      return {
        results: [],
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
        reasoning: [`Search failed: ${error instanceof Error ? error.message : "Unknown error"}`],
        quality: 0,
        timestamp: new Date().toISOString(),
        modelUsed: primaryModelConfig?.model ?? 'none',
        provider: primaryModelConfig?.provider ?? 'web-only',
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
    options: SearchOptions = {}
  ): Promise<UnifiedSearchResult> {
    const startTime = Date.now();
    const { enableValidation = true } = options;

    console.log(`[SegmentedSearch] Starting segmented search for: "${query}"`);
    console.log(`[SegmentedSearch] This will work equally well with tiny or powerful models!`);

    try {
      // Phase 1: Query Segmentation
      console.log("[SegmentedSearch] Phase 1: Segmenting query...");
      const segmenter = new QuerySegmenter(primaryModelConfig);
      const segmentation = await segmenter.segment(query);

      console.log(`[SegmentedSearch] Created ${segmentation.segments.length} segments:`);
      segmentation.segments.forEach(seg => {
        console.log(`  - ${seg.type}: "${seg.text}" (priority: ${seg.priority}, complexity: ${seg.estimatedComplexity})`);
        console.log(`    Recommended model: ${seg.recommendedModel} (SUGGESTION ONLY - user controls actual model)`);
      });

      // Phase 2: Segment Coordination and Execution
      console.log(`[SegmentedSearch] Phase 2: Executing ${segmentation.segments.length} segments with coordination...`);
      const coordinator = new SegmentCoordinator(primaryModelConfig, options.apiKeys);
      const coordinatedResult = await coordinator.execute(segmentation);

      // If segmented search returned nothing, fall back to the non-segmented path
      if (coordinatedResult.finalResults.length === 0) {
        console.warn("[SegmentedSearch] Zero results — falling back to non-segmented path");
        throw new Error("Segmented search returned zero results");
      }

      console.log(`[SegmentedSearch] Coordination complete!`);
      console.log(`  - Completed segments: ${coordinatedResult.coordinationState.completedSegments.size}`);
      console.log(`  - Failed segments: ${coordinatedResult.coordinationState.failedSegments.size}`);
      console.log(`  - Total coordination events: ${coordinatedResult.coordinationState.coordinationLog.length}`);

      // Phase 3: ADD Quality Scoring (aggregate metrics for the unified result)
      console.log("[SegmentedSearch] Phase 3: Calculating ADD quality metrics...");
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
      let validation = {
        retrieval: { valid: false, confidence: 0, errors: ['not yet validated'] as string[] },
        reasoning: { valid: false, confidence: 0, errors: ['not yet validated'] as string[] },
        response: { valid: false, confidence: 0, errors: ['not yet validated'] as string[] },
      };

      if (enableValidation) {
        console.log("[SegmentedSearch] Phase 4: Validating components...");

        const pipeline = await this.validationPipeline.validate({
          query,
          searchResults: coordinatedResult.finalResults,
          reasoningSteps: [],
          finalResponse: coordinatedResult.synthesizedResponse,
        });

        const retrievalComp = pipeline.components.find(c => c.componentName === 'retrieval');
        const responseComp = pipeline.components.find(c => c.componentName === 'response');

        if (retrievalComp) {
          validation.retrieval = { valid: retrievalComp.valid, confidence: retrievalComp.confidence, errors: retrievalComp.errors };
        }
        if (responseComp) {
          validation.response = { valid: responseComp.valid, confidence: responseComp.confidence, errors: responseComp.errors };
        }

        console.log(
          `[SegmentedSearch] Validation complete. Retrieval: ${validation.retrieval.valid}, Response: ${validation.response.valid}`
        );
      }

      const totalProcessingTime = Date.now() - startTime;

      // Prepare segmentation details for response
      const segmentationDetails = {
        segmentCount: segmentation.segments.length,
        segments: coordinatedResult.segmentBreakdown.map(seg => ({
          id: seg.segmentId,
          type: seg.type,
          text: segmentation.segments.find(s => s.id === seg.segmentId)?.text || '',
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
        segmentation: segmentationDetails,
        addMetrics,
        validation,
        strategy: 'segmented',
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

      console.log(`[SegmentedSearch] Search completed in ${totalProcessingTime}ms`);
      console.log(`[SegmentedSearch] Quality: ${coordinatedResult.quality.overall.toFixed(2)}, Tokens: ${coordinatedResult.totalTokens}`);
      console.log(`[SegmentedSearch] Segmentation completed with intelligent coordination!`);

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
  async exportTrainingData(includeUserFeedback = true): Promise<string> {
    // Get current metrics from ADD discriminator
    const metrics = this.addDiscriminator.getMetrics();

    return JSON.stringify({
      currentScore: metrics.currentScore,
      historicalAverage: metrics.historicalAverage,
      trend: metrics.recentTrend,
    }, null, 2);
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
      'password', 'token', 'api key', 'secret', 'auth', 'login',
      'payment', 'stripe', 'bank', 'invoice', 'billing',
      'pii', 'personal data', 'gdpr', 'hipaa',
    ];
    return riskTerms.some(t => q.includes(t));
  }
}

// Singleton instance
export const unifiedSearchOrchestrator = new UnifiedSearchOrchestrator();
