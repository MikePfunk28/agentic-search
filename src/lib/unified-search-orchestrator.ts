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
    } = options;

    console.log(`[UnifiedSearch] Starting search for: "${query}"`);
    console.log(`[UnifiedSearch] Options: parallel=${useParallelModels}, reasoning=${useInterleavedReasoning}, validation=${enableValidation}`);

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
