/**
 * Unified Search Orchestrator
 * Combines agentic search, parallel model orchestration, and interleaved reasoning
 * This is what makes the system surpass traditional RAG
 */

import type { ModelConfig } from "./model-config";
import { agenticSearch } from "./agentic-search";
import { ParallelModelOrchestrator } from "./parallel-model-orchestrator";
import { InterleavedReasoningEngine } from "./interleaved-reasoning-engine";
import { ADDDiscriminator } from "./add-discriminator";
import { ComponentValidationPipeline } from "./component-validation-pipeline";
import type { SearchResult } from "./types";
import { QuerySegmenter, SegmentCoordinator } from "./segment";

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
}

export class UnifiedSearchOrchestrator {
  private addDiscriminator: ADDDiscriminator;
  private validationPipeline: ComponentValidationPipeline;

  constructor() {
    this.addDiscriminator = new ADDDiscriminator();
    this.validationPipeline = new ComponentValidationPipeline();
  }

  /**
   * Execute unified search with all advanced features
   */
  async search(
    query: string,
    primaryModelConfig: ModelConfig,
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

    // Route to segmented search if enabled
    if (useSegmentation) {
      console.log('[UnifiedSearch] Routing to segmented search...');
      return this.searchWithSegmentation(query, primaryModelConfig, options);
    }

    try {
      // Phase 1: Execute base agentic search
      console.log("[UnifiedSearch] Phase 1: Executing base agentic search...");
      const baseSearchResult = await agenticSearch.search(query, primaryModelConfig);

      let parallelResults;
      let reasoningSteps;
      let totalTokens = 0;

      // Phase 2: Parallel model orchestration (if enabled and configs provided)
      if (useParallelModels && parallelModelConfigs.length > 0) {
        console.log(`[UnifiedSearch] Phase 2: Running parallel models (${parallelModelConfigs.length} models)...`);

        const orchestrator = new ParallelModelOrchestrator(parallelModelConfigs);

        // Use parallel execution for diverse perspectives
        const parallelResult = await orchestrator.runParallel(query);

        parallelResults = {
          models: parallelResult.results.map(r => ({
            model: r.model,
            response: r.response,
            confidence: r.confidence,
            tokenCount: r.tokenCount,
            processingTime: r.processingTime,
          })),
          consensus: parallelResult.consensus,
          overallConfidence: parallelResult.overallConfidence,
          agreementScore: parallelResult.agreementScore,
        };

        totalTokens += parallelResult.results.reduce((sum, r) => sum + r.tokenCount, 0);
        console.log(`[UnifiedSearch] Parallel models completed. Confidence: ${parallelResult.overallConfidence.toFixed(2)}`);
      }

      // Phase 3: Interleaved reasoning (if enabled)
      if (useInterleavedReasoning) {
        console.log("[UnifiedSearch] Phase 3: Executing interleaved reasoning...");

        const reasoningEngine = new InterleavedReasoningEngine(primaryModelConfig);

        // Prepare context from search results
        const searchContext = baseSearchResult.results.map(r =>
          `Title: ${r.title}\nSnippet: ${r.snippet}\nURL: ${r.url}`
        ).join('\n\n');

        const reasoningResult = await reasoningEngine.executeReasoning(query, searchContext);

        reasoningSteps = reasoningResult.steps.map(step => ({
          step: step.step,
          type: step.type as any,
          input: step.input,
          output: step.output,
          confidence: step.confidence,
          isValid: step.isValid,
          error: step.error,
          duration: step.duration,
        }));

        totalTokens += reasoningResult.totalTokens;
        console.log(`[UnifiedSearch] Reasoning completed. ${reasoningResult.steps.length} steps, confidence: ${reasoningResult.overallConfidence.toFixed(2)}`);
      }

      // Phase 4: ADD quality scoring
      console.log("[UnifiedSearch] Phase 4: Calculating ADD quality metrics...");
      const addScore = this.addDiscriminator.scoreSearch(query, baseSearchResult.results, {});

      // Update discriminator history for drift detection
      this.addDiscriminator.updateHistory(query, baseSearchResult.results, addScore.overallScore);

      const driftAnalysis = this.addDiscriminator.detectDrift();

      const addMetrics = {
        relevance: addScore.relevanceScore,
        diversity: addScore.diversityScore,
        freshness: addScore.freshnessScore,
        consistency: addScore.consistencyScore,
        overallScore: addScore.overallScore,
        drift: driftAnalysis.drift,
        trend: driftAnalysis.trend,
        recommendation: driftAnalysis.recommendation,
      };

      // Phase 5: Component validation (if enabled)
      let validation = {
        retrieval: { valid: true, confidence: 1.0, errors: [] as string[] },
        reasoning: { valid: true, confidence: 1.0, errors: [] as string[] },
        response: { valid: true, confidence: 1.0, errors: [] as string[] },
      };

      if (enableValidation) {
        console.log("[UnifiedSearch] Phase 5: Validating components...");

        // Validate retrieval
        const retrievalValidation = this.validationPipeline.validateRetrieval(baseSearchResult.results);
        validation.retrieval = {
          valid: retrievalValidation.valid,
          confidence: retrievalValidation.confidence,
          errors: retrievalValidation.errors,
        };

        // Validate reasoning (if we have reasoning steps)
        if (reasoningSteps && reasoningSteps.length > 0) {
          const reasoningValidation = this.validationPipeline.validateReasoning(reasoningSteps);
          validation.reasoning = {
            valid: reasoningValidation.valid,
            confidence: reasoningValidation.confidence,
            errors: reasoningValidation.errors,
          };
        }

        // Validate final response
        const finalResponse = parallelResults?.consensus || baseSearchResult.reasoning.join('\n');
        const responseValidation = this.validationPipeline.validateResponse(
          query,
          finalResponse,
          baseSearchResult.results
        );
        validation.response = {
          valid: responseValidation.valid,
          confidence: responseValidation.confidence,
          errors: responseValidation.errors,
        };

        console.log(`[UnifiedSearch] Validation complete. Retrieval: ${retrievalValidation.valid}, Reasoning: ${validation.reasoning.valid}, Response: ${responseValidation.valid}`);
      }

      const totalProcessingTime = Date.now() - startTime;

      const result: UnifiedSearchResult = {
        results: baseSearchResult.results,
        parallelResults,
        reasoningSteps,
        addMetrics,
        validation,
        strategy: baseSearchResult.strategy,
        reasoning: baseSearchResult.reasoning,
        quality: baseSearchResult.quality,
        timestamp: new Date().toISOString(),
        modelUsed: primaryModelConfig.model,
        provider: primaryModelConfig.provider,
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
        modelUsed: primaryModelConfig.model,
        provider: primaryModelConfig.provider,
        totalTokens: 0,
        totalProcessingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute search with query segmentation and coordination
   * This is how we beat RAG - intelligent segmentation vs passive chunking
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
      const coordinator = new SegmentCoordinator(primaryModelConfig);
      const coordinatedResult = await coordinator.execute(segmentation);

      console.log(`[SegmentedSearch] Coordination complete!`);
      console.log(`  - Completed segments: ${coordinatedResult.coordinationState.completedSegments.size}`);
      console.log(`  - Failed segments: ${coordinatedResult.coordinationState.failedSegments.size}`);
      console.log(`  - Total coordination events: ${coordinatedResult.coordinationState.coordinationLog.length}`);

      // Phase 3: ADD Quality Scoring
      console.log("[SegmentedSearch] Phase 3: Calculating ADD quality metrics...");
      const addScore = this.addDiscriminator.scoreSearch(
        query,
        coordinatedResult.finalResults,
        {}
      );

      this.addDiscriminator.updateHistory(
        query,
        coordinatedResult.finalResults,
        addScore.overallScore
      );

      const driftAnalysis = this.addDiscriminator.detectDrift();

      const addMetrics = {
        relevance: addScore.relevanceScore,
        diversity: addScore.diversityScore,
        freshness: addScore.freshnessScore,
        consistency: addScore.consistencyScore,
        overallScore: addScore.overallScore,
        drift: driftAnalysis.drift,
        trend: driftAnalysis.trend,
        recommendation: driftAnalysis.recommendation,
      };

      // Phase 4: Component Validation (if enabled)
      let validation = {
        retrieval: { valid: true, confidence: 1.0, errors: [] as string[] },
        reasoning: { valid: true, confidence: 1.0, errors: [] as string[] },
        response: { valid: true, confidence: 1.0, errors: [] as string[] },
      };

      if (enableValidation) {
        console.log("[SegmentedSearch] Phase 4: Validating components...");

        // Validate retrieval
        const retrievalValidation = this.validationPipeline.validateRetrieval(
          coordinatedResult.finalResults
        );
        validation.retrieval = {
          valid: retrievalValidation.valid,
          confidence: retrievalValidation.confidence,
          errors: retrievalValidation.errors,
        };

        // Validate final response
        const responseValidation = this.validationPipeline.validateResponse(
          query,
          coordinatedResult.synthesizedResponse,
          coordinatedResult.finalResults
        );
        validation.response = {
          valid: responseValidation.valid,
          confidence: responseValidation.confidence,
          errors: responseValidation.errors,
        };

        console.log(
          `[SegmentedSearch] Validation complete. Retrieval: ${retrievalValidation.valid}, Response: ${responseValidation.valid}`
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
      console.log(`[SegmentedSearch] Segmentation beats RAG through intelligent coordination!`);

      return result;

    } catch (error) {
      console.error("[SegmentedSearch] Search failed:", error);

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
          recommendation: "Segmented search error - please retry",
        },
        validation: {
          retrieval: { valid: false, confidence: 0, errors: ["Segmented search failed"] },
          reasoning: { valid: false, confidence: 0, errors: ["Not executed"] },
          response: { valid: false, confidence: 0, errors: ["Not generated"] },
        },
        strategy: "segmented-error",
        reasoning: [`Segmented search failed: ${error instanceof Error ? error.message : "Unknown error"}`],
        quality: 0,
        timestamp: new Date().toISOString(),
        modelUsed: primaryModelConfig.model,
        provider: primaryModelConfig.provider,
        totalTokens: 0,
        totalProcessingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Export training data for fine-tuning
   */
  async exportTrainingData(includeUserFeedback = true): Promise<string> {
    // Get historical data from ADD discriminator
    const history = this.addDiscriminator.exportTrainingData();

    // Format for OpenAI/Anthropic fine-tuning
    const trainingExamples = history.searches.map(search => ({
      query: search.query,
      results: search.results,
      score: search.score,
      timestamp: search.timestamp,
    }));

    return JSON.stringify(trainingExamples, null, 2);
  }

  /**
   * Get performance statistics
   */
  getStatistics() {
    return {
      searchHistory: this.addDiscriminator.getSearchHistory(),
      driftAnalysis: this.addDiscriminator.detectDrift(),
      validationStats: this.validationPipeline.getStatistics(),
    };
  }
}

// Singleton instance
export const unifiedSearchOrchestrator = new UnifiedSearchOrchestrator();
