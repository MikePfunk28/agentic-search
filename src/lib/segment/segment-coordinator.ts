/**
 * Segment Coordinator
 *
 * Orchestrates execution of query segments with shared context
 * Manages dependencies, parallelization, and inter-segment communication
 */

import type {
  SegmentationResult,
  CoordinationState,
  QuerySegment,
  SegmentContext,
  SegmentExecutionResult,
  CoordinatedSearchResult,
} from "./types";
import { SegmentExecutor } from "./segment-executor";
import type { ModelConfig } from "../model-config";
import type { SearchResult } from "../types";

export class SegmentCoordinator {
  private executor: SegmentExecutor;

  constructor(modelConfig: ModelConfig) {
    this.executor = new SegmentExecutor(modelConfig);
  }

  /**
   * Execute all segments according to the execution graph
   */
  async execute(segmentation: SegmentationResult): Promise<CoordinatedSearchResult> {
    const startTime = Date.now();

    console.log(`[Coordinator] Starting execution of ${segmentation.segments.length} segments`);

    // Initialize coordination state
    const state: CoordinationState = this.initializeState(segmentation);

    try {
      // Execute stages sequentially (parallel within each stage)
      const allStages = [
        ...segmentation.executionGraph.parallel.map((ids, i) => ({ ids, parallel: true, stage: i })),
        ...segmentation.executionGraph.sequential.map((ids, i) => ({ ids, parallel: false, stage: i })),
      ].sort((a, b) => a.stage - b.stage);

      for (const { ids, parallel } of allStages) {
        if (parallel) {
          await this.executeParallel(ids, segmentation.segments, state);
        } else {
          await this.executeSequential(ids, segmentation.segments, state);
        }
      }

      // Synthesize final results
      const finalResults = this.synthesizeResults(state);
      const synthesizedResponse = this.generateResponse(state);

      // Calculate quality metrics
      const quality = this.assessQuality(state, finalResults);

      // Build segment breakdown
      const segmentBreakdown = this.buildBreakdown(state);

      const totalTime = Date.now() - startTime;
      const totalTokens = Object.values(state.segments).reduce((sum, ctx) => sum + ctx.tokensUsed, 0);

      console.log(`[Coordinator] Execution complete: ${totalTime}ms, ${totalTokens} tokens`);
      console.log(`[Coordinator] Success: ${state.completedSegments.size}/${segmentation.segments.length}`);

      return {
        queryId: segmentation.queryId,
        originalQuery: segmentation.originalQuery,
        segmentation,
        coordinationState: state,
        finalResults,
        synthesizedResponse,
        totalTokens,
        totalTime,
        segmentBreakdown,
        quality,
      };

    } catch (error) {
      console.error('[Coordinator] Execution failed:', error);

      return {
        queryId: segmentation.queryId,
        originalQuery: segmentation.originalQuery,
        segmentation,
        coordinationState: state,
        finalResults: [],
        synthesizedResponse: `Segmented search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        totalTokens: 0,
        totalTime: Date.now() - startTime,
        segmentBreakdown: [],
        quality: { accuracy: 0, completeness: 0, coherence: 0, overall: 0 },
      };
    }
  }

  /**
   * Execute segments in parallel
   */
  private async executeParallel(
    segmentIds: string[],
    allSegments: QuerySegment[],
    state: CoordinationState
  ): Promise<void> {
    console.log(`[Coordinator] Executing ${segmentIds.length} segments in parallel`);

    const segments = allSegments.filter(s => segmentIds.includes(s.id));
    const promises = segments.map(segment => this.executeSegment(segment, state));

    const results = await Promise.allSettled(promises);

    // Process results
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        this.handleSuccess(segments[i], result.value, state);
      } else {
        this.handleFailure(segments[i], result.reason, state);
      }
    });
  }

  /**
   * Execute segments sequentially
   */
  private async executeSequential(
    segmentIds: string[],
    allSegments: QuerySegment[],
    state: CoordinationState
  ): Promise<void> {
    console.log(`[Coordinator] Executing ${segmentIds.length} segments sequentially`);

    for (const segmentId of segmentIds) {
      const segment = allSegments.find(s => s.id === segmentId);
      if (!segment) continue;

      try {
        const result = await this.executeSegment(segment, state);
        this.handleSuccess(segment, result, state);
      } catch (error) {
        this.handleFailure(segment, error, state);
      }
    }
  }

  /**
   * Execute a single segment with context from dependencies
   */
  private async executeSegment(
    segment: QuerySegment,
    state: CoordinationState
  ): Promise<SegmentExecutionResult> {
    this.logAction(state, segment.id, 'started', { text: segment.text });

    // Get relevant context from completed dependencies
    const relevantContext = this.getRelevantContext(segment, state);

    console.log(`[Coordinator] Executing segment ${segment.id}: "${segment.text}"`);
    console.log(`[Coordinator] Context from ${Object.keys(relevantContext).length} dependencies`);

    // Execute with context
    const result = await this.executor.execute(segment, relevantContext);

    this.logAction(state, segment.id, 'completed', {
      success: result.success,
      tokensUsed: result.context.tokensUsed,
      findings: result.context.findings,
    });

    return result;
  }

  /**
   * Get relevant context from completed dependencies
   */
  private getRelevantContext(segment: QuerySegment, state: CoordinationState): Record<string, SegmentContext> {
    const context: Record<string, SegmentContext> = {};

    for (const depId of segment.dependencies) {
      if (state.segments[depId]) {
        // Only include high-confidence findings
        if (state.segments[depId].findings.confidence > 0.6) {
          context[depId] = state.segments[depId];
        }
      }
    }

    return context;
  }

  /**
   * Handle successful segment execution
   */
  private handleSuccess(segment: QuerySegment, result: SegmentExecutionResult, state: CoordinationState): void {
    // Store segment context
    state.segments[segment.id] = result.context;
    state.completedSegments.add(segment.id);

    // Update global context
    this.updateGlobalContext(segment, result.context, state);

    // Check if we need to spawn new segments
    if (result.newSegments && result.newSegments.length > 0) {
      this.logAction(state, segment.id, 'spawned_child', { count: result.newSegments.length });
      console.log(`[Coordinator] Segment ${segment.id} spawned ${result.newSegments.length} new segments`);
    }

    // Check if we need to escalate to a more powerful model
    if (result.shouldEscalate) {
      this.logAction(state, segment.id, 'escalated', { reason: 'complexity_detected' });
      console.log(`[Coordinator] Segment ${segment.id} flagged for escalation`);
    }
  }

  /**
   * Handle failed segment execution
   */
  private handleFailure(segment: QuerySegment, error: any, state: CoordinationState): void {
    const errorMsg = error instanceof Error ? error.message : String(error);
    state.failedSegments.set(segment.id, errorMsg);

    this.logAction(state, segment.id, 'completed', { success: false, error: errorMsg });

    console.error(`[Coordinator] Segment ${segment.id} failed:`, errorMsg);
  }

  /**
   * Update global context with segment findings
   */
  private updateGlobalContext(segment: QuerySegment, context: SegmentContext, state: CoordinationState): void {
    // Merge entities
    for (const [key, value] of Object.entries(context.findings.entities)) {
      state.globalContext.entities.set(key, value);
    }

    // Add key findings
    state.globalContext.keyFindings.push(...context.findings.facts);

    // Add timeline events if applicable
    if (segment.type === 'context' && context.findings.facts.length > 0) {
      // Extract temporal information
      // (simplified - in production would parse dates more intelligently)
    }

    this.logAction(state, segment.id, 'updated_context', {
      entitiesCount: Object.keys(context.findings.entities).length,
      factsCount: context.findings.facts.length,
    });
  }

  /**
   * Synthesize results from all segments
   */
  private synthesizeResults(state: CoordinationState): SearchResult[] {
    const allResults: SearchResult[] = [];

    // Collect all search results from segments
    for (const context of Object.values(state.segments)) {
      allResults.push(...context.searchResults);
    }

    // Deduplicate by URL
    const uniqueResults = new Map<string, SearchResult>();
    for (const result of allResults) {
      if (!uniqueResults.has(result.url) || (result.addScore || 0) > (uniqueResults.get(result.url)!.addScore || 0)) {
        uniqueResults.set(result.url, result);
      }
    }

    // Sort by ADD score
    return Array.from(uniqueResults.values())
      .sort((a, b) => (b.addScore || 0) - (a.addScore || 0))
      .slice(0, 10); // Top 10 results
  }

  /**
   * Generate synthesized response from all findings
   */
  private generateResponse(state: CoordinationState): string {
    const keyFindings = state.globalContext.keyFindings.slice(0, 5);
    const completedCount = state.completedSegments.size;
    const totalSegments = Object.keys(state.segments).length + state.failedSegments.size;

    return `Segmented search completed (${completedCount}/${totalSegments} segments).\n\nKey findings:\n${keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;
  }

  /**
   * Assess quality of coordinated search
   */
  private assessQuality(state: CoordinationState, results: SearchResult[]): CoordinatedSearchResult['quality'] {
    const completedRatio = state.completedSegments.size / (state.completedSegments.size + state.failedSegments.size);
    const avgConfidence = Object.values(state.segments).reduce((sum, ctx) => sum + ctx.findings.confidence, 0) / Object.keys(state.segments).length;

    return {
      accuracy: avgConfidence,
      completeness: completedRatio,
      coherence: results.length > 0 ? 0.8 : 0.3, // Simplified
      overall: (avgConfidence + completedRatio + (results.length > 0 ? 0.8 : 0.3)) / 3,
    };
  }

  /**
   * Build segment breakdown for analytics
   */
  private buildBreakdown(state: CoordinationState): CoordinatedSearchResult['segmentBreakdown'] {
    const breakdown: CoordinatedSearchResult['segmentBreakdown'] = [];

    for (const [segmentId, context] of Object.entries(state.segments)) {
      breakdown.push({
        segmentId,
        type: 'entity', // Would need to track this in context
        modelUsed: 'unknown', // Would need to track this
        tokensUsed: context.tokensUsed,
        timeMs: context.executionTimeMs,
        success: true,
      });
    }

    for (const [segmentId, error] of state.failedSegments.entries()) {
      breakdown.push({
        segmentId,
        type: 'entity',
        modelUsed: 'unknown',
        tokensUsed: 0,
        timeMs: 0,
        success: false,
      });
    }

    return breakdown;
  }

  /**
   * Initialize coordination state
   */
  private initializeState(segmentation: SegmentationResult): CoordinationState {
    return {
      queryId: segmentation.queryId,
      originalQuery: segmentation.originalQuery,
      segments: {},
      globalContext: {
        entities: new Map(),
        timeline: [],
        relationships: [],
        keyFindings: [],
      },
      coordinationLog: [],
      startTime: Date.now(),
      completedSegments: new Set(),
      failedSegments: new Map(),
    };
  }

  /**
   * Log coordination action
   */
  private logAction(
    state: CoordinationState,
    segmentId: string,
    action: CoordinationState['coordinationLog'][0]['action'],
    metadata: any
  ): void {
    state.coordinationLog.push({
      timestamp: Date.now(),
      segmentId,
      action,
      metadata,
    });
  }
}
