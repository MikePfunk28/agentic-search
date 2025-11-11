/**
 * Query Segmenter
 *
 * Decomposes search queries into coordinated segments
 * Model assignment is SUGGESTIVE only - user controls actual model selection
 */

import type { ModelConfig } from "../model-config";
import type {
  QuerySegment,
  SegmentationResult,
  ExecutionGraph,
  SegmentType,
  SegmentSearchStrategy,
  SegmentComplexity,
  SegmentationConfig,
  DEFAULT_SEGMENTATION_CONFIG,
} from "./types";

export class QuerySegmenter {
  private config: SegmentationConfig;
  private modelConfig: ModelConfig;

  constructor(modelConfig: ModelConfig, config: Partial<SegmentationConfig> = {}) {
    this.modelConfig = modelConfig;
    this.config = { ...DEFAULT_SEGMENTATION_CONFIG, ...config };
  }

  /**
   * Main entry: Segment a query into coordinated parts
   */
  async segment(query: string): Promise<SegmentationResult> {
    const queryId = this.generateQueryId(query);

    console.log(`[Segmenter] Analyzing query: "${query}"`);

    // Step 1: Analyze query structure
    const analysis = await this.analyzeQuery(query);

    // Step 2: Create segments based on analysis
    const segments = await this.createSegments(query, analysis);

    // Step 3: Build execution graph (dependencies)
    const executionGraph = this.buildExecutionGraph(segments);

    // Step 4: Estimate costs
    const estimatedTokens = segments.reduce((sum, s) => sum + s.estimatedTokens, 0);
    const estimatedTime = this.estimateTime(segments, executionGraph);

    console.log(`[Segmenter] Created ${segments.length} segments (${estimatedTokens} tokens estimated)`);

    return {
      queryId,
      originalQuery: query,
      segments,
      executionGraph,
      estimatedTokens,
      estimatedTime,
      createdAt: Date.now(),
    };
  }

  /**
   * Analyze query to determine structure and intent
   */
  private async analyzeQuery(query: string): Promise<QueryAnalysis> {
    const lower = query.toLowerCase();

    // Detect query patterns
    const hasComparison = /\b(compare|versus|vs|difference|better)\b/.test(lower);
    const hasSequence = /\b(after|before|then|next|following)\b/.test(lower);
    const hasMultipleEntities = this.countEntities(query) > 1;
    const hasConstraints = /\b(when|where|how|why|which)\b/.test(lower);

    // Determine complexity
    const wordCount = query.split(/\s+/).length;
    const complexity = this.assessComplexity(wordCount, hasComparison, hasMultipleEntities);

    return {
      hasComparison,
      hasSequence,
      hasMultipleEntities,
      hasConstraints,
      wordCount,
      complexity,
      entities: this.extractSimpleEntities(query),
      intents: this.detectIntents(query),
    };
  }

  /**
   * Create segments based on query analysis
   */
  private async createSegments(query: string, analysis: QueryAnalysis): Promise<QuerySegment[]> {
    const segments: QuerySegment[] = [];

    // Strategy 1: Comparison queries → Parallel entity segments + synthesis
    if (analysis.hasComparison && analysis.entities.length >= 2) {
      console.log(`[Segmenter] Detected comparison query`);

      // Create parallel segments for each entity
      for (let i = 0; i < analysis.entities.length; i++) {
        const entity = analysis.entities[i];
        segments.push({
          id: `entity-${i}`,
          text: `${entity} ${this.extractContext(query, entity)}`,
          type: 'entity',
          priority: 8,
          dependencies: [],
          searchStrategy: 'factual',
          estimatedComplexity: 'tiny', // Suggest tiny model for factual lookup
          recommendedModel: this.suggestModel('tiny'), // Suggestion only!
          estimatedTokens: 500,
        });
      }

      // Create synthesis segment (depends on all entities)
      segments.push({
        id: 'comparison-synthesis',
        text: `Compare: ${analysis.entities.join(' vs ')}`,
        type: 'synthesis',
        priority: 10,
        dependencies: segments.map(s => s.id),
        searchStrategy: 'comparative',
        estimatedComplexity: 'small', // Suggest small model for comparison
        recommendedModel: this.suggestModel('small'), // Suggestion only!
        estimatedTokens: 800,
      });

      return segments;
    }

    // Strategy 2: Sequential queries → Chain of dependent segments
    if (analysis.hasSequence) {
      console.log(`[Segmenter] Detected sequential query`);

      const parts = this.splitSequence(query);
      for (let i = 0; i < parts.length; i++) {
        segments.push({
          id: `sequence-${i}`,
          text: parts[i],
          type: i === parts.length - 1 ? 'synthesis' : 'context',
          priority: 10 - i, // Earlier steps higher priority
          dependencies: i > 0 ? [`sequence-${i-1}`] : [],
          searchStrategy: 'exploratory',
          estimatedComplexity: 'small',
          recommendedModel: this.suggestModel('small'),
          estimatedTokens: 600,
        });
      }

      return segments;
    }

    // Strategy 3: Complex multi-part query → Extract intent + constraints + entities
    if (analysis.complexity === 'complex') {
      console.log(`[Segmenter] Detected complex query - creating multi-part segmentation`);

      // Intent segment
      segments.push({
        id: 'intent',
        text: query,
        type: 'intent',
        priority: 10,
        dependencies: [],
        searchStrategy: 'factual',
        estimatedComplexity: 'tiny',
        recommendedModel: this.suggestModel('tiny'),
        estimatedTokens: 300,
      });

      // Entity segments (parallel)
      analysis.entities.forEach((entity, i) => {
        segments.push({
          id: `entity-${i}`,
          text: `${entity} ${analysis.intents[0] || ''}`,
          type: 'entity',
          priority: 8,
          dependencies: ['intent'],
          searchStrategy: 'factual',
          estimatedComplexity: 'tiny',
          recommendedModel: this.suggestModel('tiny'),
          estimatedTokens: 500,
        });
      });

      // Synthesis segment
      segments.push({
        id: 'synthesis',
        text: query,
        type: 'synthesis',
        priority: 10,
        dependencies: ['intent', ...segments.filter(s => s.type === 'entity').map(s => s.id)],
        searchStrategy: 'comparative',
        estimatedComplexity: 'small',
        recommendedModel: this.suggestModel('small'),
        estimatedTokens: 800,
      });

      return segments;
    }

    // Strategy 4: Simple query → Single segment
    console.log(`[Segmenter] Simple query - single segment`);
    segments.push({
      id: 'simple',
      text: query,
      type: 'entity',
      priority: 10,
      dependencies: [],
      searchStrategy: 'factual',
      estimatedComplexity: analysis.complexity as SegmentComplexity,
      recommendedModel: this.suggestModel(analysis.complexity as SegmentComplexity),
      estimatedTokens: 400,
    });

    return segments;
  }

  /**
   * Build execution graph from segment dependencies
   */
  private buildExecutionGraph(segments: QuerySegment[]): ExecutionGraph {
    const graph: ExecutionGraph = {
      parallel: [],
      sequential: [],
      totalStages: 0,
    };

    // Topological sort to determine execution order
    const processed = new Set<string>();
    const stage: string[][] = [];

    while (processed.size < segments.length) {
      // Find segments with no unprocessed dependencies
      const ready = segments
        .filter(s => !processed.has(s.id))
        .filter(s => s.dependencies.every(dep => processed.has(dep)))
        .map(s => s.id);

      if (ready.length === 0) {
        console.error('[Segmenter] Circular dependency detected!');
        break;
      }

      stage.push(ready);
      ready.forEach(id => processed.add(id));
    }

    // Convert stages to parallel/sequential format
    graph.parallel = stage.filter(s => s.length > 1);
    graph.sequential = stage.filter(s => s.length === 1);
    graph.totalStages = stage.length;

    console.log(`[Segmenter] Execution graph: ${graph.totalStages} stages, ${graph.parallel.length} parallel groups`);

    return graph;
  }

  /**
   * Suggest a model based on complexity (USER CAN OVERRIDE)
   */
  private suggestModel(complexity: SegmentComplexity): string {
    // These are SUGGESTIONS - user controls actual model selection
    const suggestions: Record<SegmentComplexity, string> = {
      'tiny': `${this.modelConfig.provider}:qwen3:1.7b`,
      'small': `${this.modelConfig.provider}:qwen3:4b`,
      'medium': `${this.modelConfig.provider}:llama3:8b`,
      'large': `${this.modelConfig.provider}:${this.modelConfig.model}`,
    };

    return suggestions[complexity] || suggestions['small'];
  }

  /**
   * Helper: Assess query complexity
   */
  private assessComplexity(
    wordCount: number,
    hasComparison: boolean,
    hasMultipleEntities: boolean
  ): 'simple' | 'moderate' | 'complex' {
    if (wordCount < 5) return 'simple';
    if (wordCount < 10 && !hasComparison) return 'moderate';
    if (hasComparison || hasMultipleEntities || wordCount > 15) return 'complex';
    return 'moderate';
  }

  /**
   * Helper: Count distinct entities in query
   */
  private countEntities(query: string): number {
    // Simple heuristic: count proper nouns and key terms
    const potentialEntities = query.match(/[A-Z][a-z]+|\b(?:react|vue|node|python|javascript)\b/gi);
    return potentialEntities ? new Set(potentialEntities).size : 1;
  }

  /**
   * Helper: Extract simple entities from query
   */
  private extractSimpleEntities(query: string): string[] {
    const entities: string[] = [];

    // Extract proper nouns
    const properNouns = query.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g);
    if (properNouns) entities.push(...properNouns);

    // Extract known tech terms
    const techTerms = query.match(/\b(?:React|Vue|Angular|Node|Python|JavaScript|TypeScript|Java|Go|Rust)\b/gi);
    if (techTerms) entities.push(...techTerms);

    return [...new Set(entities)];
  }

  /**
   * Helper: Detect intents in query
   */
  private detectIntents(query: string): string[] {
    const lower = query.toLowerCase();
    const intents: string[] = [];

    if (/\bhow\b/.test(lower)) intents.push('explanation');
    if (/\bwhat\b/.test(lower)) intents.push('definition');
    if (/\bwhy\b/.test(lower)) intents.push('reasoning');
    if (/\bcompare|versus|vs\b/.test(lower)) intents.push('comparison');
    if (/\bbest|better|worst\b/.test(lower)) intents.push('evaluation');

    return intents.length > 0 ? intents : ['factual'];
  }

  /**
   * Helper: Extract context around entity
   */
  private extractContext(query: string, entity: string): string {
    const regex = new RegExp(`${entity}\\s+([\\w\\s]{0,30})`, 'i');
    const match = query.match(regex);
    return match ? match[1].trim() : '';
  }

  /**
   * Helper: Split sequential query into parts
   */
  private splitSequence(query: string): string[] {
    // Split on sequence markers
    const parts = query.split(/\b(?:then|after|next|following)\b/i).map(s => s.trim());
    return parts.filter(p => p.length > 0);
  }

  /**
   * Helper: Estimate execution time
   */
  private estimateTime(segments: QuerySegment[], graph: ExecutionGraph): number {
    // Rough estimate: sequential stages add, parallel stages take max
    let totalTime = 0;

    for (const stage of [...graph.parallel, ...graph.sequential]) {
      const stageSegments = segments.filter(s => stage.includes(s.id));
      const maxTime = Math.max(...stageSegments.map(s => s.estimatedTokens / 50)); // ~50 tokens/sec
      totalTime += maxTime;
    }

    return totalTime * 1000; // Convert to ms
  }

  /**
   * Helper: Generate unique query ID
   */
  private generateQueryId(query: string): string {
    return `query-${Date.now()}-${query.substring(0, 20).replace(/\s/g, '-')}`;
  }
}

/**
 * Internal: Query analysis result
 */
interface QueryAnalysis {
  hasComparison: boolean;
  hasSequence: boolean;
  hasMultipleEntities: boolean;
  hasConstraints: boolean;
  wordCount: number;
  complexity: 'simple' | 'moderate' | 'complex';
  entities: string[];
  intents: string[];
}
