/**
 * Segment Executor
 *
 * Executes individual segments and VERIFIES model connections
 * Actually sends test queries to models to ensure they work
 */

import type { ModelConfig } from "../model-config";
import type {
  QuerySegment,
  SegmentContext,
  SegmentExecutionResult,
} from "./types";
import { agenticSearch } from "../agentic-search";
import type { SearchResult } from "../types";

export class SegmentExecutor {
  private modelConfig: ModelConfig;
  private verifiedModels = new Map<string, boolean>();

  constructor(modelConfig: ModelConfig) {
    this.modelConfig = modelConfig;
  }

  /**
   * Execute a single segment with model verification
   */
  async execute(
    segment: QuerySegment,
    dependencyContext: Record<string, SegmentContext>
  ): Promise<SegmentExecutionResult> {
    const startTime = Date.now();

    console.log(`[Executor] Starting segment: ${segment.id}`);
    console.log(`[Executor] Text: "${segment.text}"`);
    console.log(`[Executor] Recommended model: ${segment.recommendedModel} (user can override)`);

    try {
      // IMPORTANT: Verify model connection BEFORE using it
      const modelToUse = await this.verifyAndSelectModel(segment);

      console.log(`✓ [Executor] Model verified: ${modelToUse.model}`);

      // Build enhanced query with context from dependencies
      const enhancedQuery = this.buildEnhancedQuery(segment, dependencyContext);

      // Execute search with the ACTUAL model
      const searchResults = await this.executeSearch(enhancedQuery, modelToUse);

      // Extract findings from results
      const findings = this.extractFindings(searchResults, segment);

      // Determine if we need a more powerful model
      const shouldEscalate = this.shouldEscalate(findings, segment);

      const executionTime = Date.now() - startTime;

      // Build context for this segment
      const context: SegmentContext = {
        segmentId: segment.id,
        findings,
        searchResults,
        nextRecommendations: this.generateRecommendations(findings),
        timestamp: Date.now(),
        tokensUsed: this.estimateTokens(searchResults),
        executionTimeMs: executionTime,
      };

      console.log(`[Executor] Segment ${segment.id} completed in ${executionTime}ms`);
      console.log(`[Executor] Found ${searchResults.length} results, confidence: ${findings.confidence.toFixed(2)}`);

      return {
        segment,
        context,
        success: true,
        modelUsed: `${modelToUse.provider}:${modelToUse.model}`,
        shouldEscalate,
        newSegments: shouldEscalate ? this.generateSubSegments(segment, findings) : undefined,
      };

    } catch (error) {
      console.error(`[Executor] Segment ${segment.id} failed:`, error);

      // Return error result
      return {
        segment,
        context: {
          segmentId: segment.id,
          findings: {
            entities: {},
            facts: [],
            sources: [],
            confidence: 0,
            contradictions: [],
          },
          searchResults: [],
          nextRecommendations: [],
          timestamp: Date.now(),
          tokensUsed: 0,
          executionTimeMs: Date.now() - startTime,
        },
        success: false,
        error: error instanceof Error ? error.message : String(error),
        modelUsed: `${this.modelConfig.provider}:${this.modelConfig.model}`,
        shouldEscalate: false,
      };
    }
  }

  /**
   * VERIFY MODEL CONNECTION - Send test query to confirm it works
   */
  private async verifyAndSelectModel(segment: QuerySegment): Promise<ModelConfig> {
    // Check if we already verified this model
    const cacheKey = `${this.modelConfig.provider}:${this.modelConfig.model}`;

    if (this.verifiedModels.has(cacheKey)) {
      console.log(`[Executor] Using cached verification for ${cacheKey}`);
      return this.modelConfig;
    }

    console.log(`[Executor] Verifying model connection: ${cacheKey}...`);

    try {
      // Send a simple test query to verify the model works
      const testQuery = "Hello"; // Simple test
      const testConfig = { ...this.modelConfig };

      // Try to call the model
      const response = await this.callModel(testQuery, testConfig);

      if (response && response.length > 0) {
        console.log(`✓ [Executor] Model ${cacheKey} verified successfully!`);
        console.log(`✓ [Executor] Test response: "${response.substring(0, 50)}..."`);

        // Cache successful verification
        this.verifiedModels.set(cacheKey, true);

        return testConfig;
      } else {
        throw new Error('Model returned empty response');
      }

    } catch (error) {
      console.error(`✗ [Executor] Model ${cacheKey} verification failed:`, error);
      throw new Error(`Cannot connect to model ${cacheKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build enhanced query with context from dependencies
   */
  private buildEnhancedQuery(
    segment: QuerySegment,
    dependencyContext: Record<string, SegmentContext>
  ): string {
    let enhancedQuery = segment.text;

    // Add context from dependencies if available
    if (Object.keys(dependencyContext).length > 0) {
      const contextFacts: string[] = [];

      for (const context of Object.values(dependencyContext)) {
        // Only use high-confidence facts
        const highConfidenceFacts = context.findings.facts
          .filter((_fact, i) => i < 3); // Top 3 facts per dependency

        contextFacts.push(...highConfidenceFacts);
      }

      if (contextFacts.length > 0) {
        enhancedQuery = `Context: ${contextFacts.join('. ')}\n\nQuery: ${segment.text}`;
        console.log(`[Executor] Enhanced query with ${contextFacts.length} context facts`);
      }
    }

    return enhancedQuery;
  }

  /**
   * Execute search using agentic search engine
   */
  private async executeSearch(query: string, modelConfig: ModelConfig): Promise<SearchResult[]> {
    console.log(`[Executor] Executing search with model ${modelConfig.provider}:${modelConfig.model}`);

    try {
      const result = await agenticSearch.search(query, modelConfig);
      return result.results || [];
    } catch (error) {
      console.error('[Executor] Search execution failed:', error);

      // Return empty results instead of throwing
      return [];
    }
  }

  /**
   * Extract structured findings from search results
   */
  private extractFindings(results: SearchResult[], segment: QuerySegment): SegmentContext['findings'] {
    const entities: Record<string, any> = {};
    const facts: string[] = [];
    const sources: string[] = [];
    const contradictions: string[] = [];

    // Extract from results
    for (const result of results) {
      sources.push(result.url);

      // Extract key facts from snippets
      if (result.snippet) {
        const sentences = result.snippet.split(/[.!?]/).filter(s => s.trim().length > 20);
        facts.push(...sentences.slice(0, 2).map(s => s.trim()));
      }

      // Simple entity extraction (proper nouns, tech terms)
      const entityMatches = result.snippet?.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|React|Vue|Node|Python/g);
      if (entityMatches) {
        for (const entity of entityMatches) {
          entities[entity] = { source: result.url, title: result.title };
        }
      }
    }

    // Calculate confidence based on result quality
    const avgScore = results.reduce((sum, r) => sum + (r.addScore || 0.5), 0) / (results.length || 1);
    const confidence = Math.min(0.95, avgScore * 1.2); // Boost slightly, cap at 0.95

    return {
      entities,
      facts: [...new Set(facts)].slice(0, 10), // Top 10 unique facts
      sources: [...new Set(sources)],
      confidence,
      contradictions,
    };
  }

  /**
   * Determine if segment needs escalation to more powerful model
   */
  private shouldEscalate(findings: SegmentContext['findings'], segment: QuerySegment): boolean {
    // Escalate if:
    // 1. Low confidence (<0.5)
    // 2. No results found
    // 3. Contradictions detected
    // 4. Segment is synthesis type with complex requirements

    if (findings.confidence < 0.5) {
      console.log(`[Executor] Low confidence (${findings.confidence.toFixed(2)}) - escalation recommended`);
      return true;
    }

    if (findings.facts.length === 0) {
      console.log(`[Executor] No facts found - escalation recommended`);
      return true;
    }

    if (findings.contradictions.length > 0) {
      console.log(`[Executor] Contradictions detected - escalation recommended`);
      return true;
    }

    if (segment.type === 'synthesis' && segment.estimatedComplexity !== 'large') {
      console.log(`[Executor] Synthesis segment with non-large model - escalation recommended`);
      return true;
    }

    return false;
  }

  /**
   * Generate sub-segments when escalation is needed
   */
  private generateSubSegments(segment: QuerySegment, findings: SegmentContext['findings']): QuerySegment[] {
    // Create refined sub-segments based on findings
    const subSegments: QuerySegment[] = [];

    if (findings.facts.length === 0) {
      // No facts found - try a broader search
      subSegments.push({
        ...segment,
        id: `${segment.id}-broader`,
        text: `${segment.text} overview`,
        estimatedComplexity: 'small',
        recommendedModel: segment.recommendedModel,
        priority: segment.priority - 1,
      });
    }

    return subSegments;
  }

  /**
   * Generate recommendations for next segments
   */
  private generateRecommendations(findings: SegmentContext['findings']): string[] {
    const recommendations: string[] = [];

    // Recommend related searches based on entities found
    const topEntities = Object.keys(findings.entities).slice(0, 3);
    for (const entity of topEntities) {
      recommendations.push(`Explore ${entity} in more detail`);
    }

    // Recommend clarification if contradictions found
    if (findings.contradictions.length > 0) {
      recommendations.push('Clarify contradictory information');
    }

    return recommendations;
  }

  /**
   * Estimate tokens used (rough approximation)
   */
  private estimateTokens(results: SearchResult[]): number {
    let tokens = 0;

    for (const result of results) {
      // Rough estimate: ~4 characters per token
      tokens += (result.snippet?.length || 0) / 4;
      tokens += (result.title?.length || 0) / 4;
    }

    return Math.ceil(tokens);
  }

  /**
   * Call model directly (ACTUAL API CALL)
   */
  private async callModel(prompt: string, config: ModelConfig): Promise<string> {
    const { provider, baseUrl, model, apiKey, temperature, maxTokens } = config;

    console.log(`[Executor] Calling ${provider}:${model} at ${baseUrl}`);

    switch (provider) {
      case 'ollama':
      case 'lm_studio':
        return this.callOllama(prompt, config);

      case 'anthropic':
        return this.callAnthropic(prompt, config);

      case 'openai':
        return this.callOpenAI(prompt, config);

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * Call Ollama model (ACTUAL API)
   */
  private async callOllama(prompt: string, config: ModelConfig): Promise<string> {
    const url = `${config.baseUrl}/api/generate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        prompt,
        stream: false,
        options: {
          temperature: config.temperature,
          num_predict: Math.min(config.maxTokens || 2000, 2000), // Cap for test
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || '';
  }

  /**
   * Call Anthropic model (ACTUAL API)
   */
  private async callAnthropic(prompt: string, config: ModelConfig): Promise<string> {
    const url = `${config.baseUrl}/v1/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: Math.min(config.maxTokens || 1000, 1000), // Cap for test
        temperature: config.temperature,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  /**
   * Call OpenAI model (ACTUAL API)
   */
  private async callOpenAI(prompt: string, config: ModelConfig): Promise<string> {
    const url = `${config.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: config.temperature,
        max_tokens: Math.min(config.maxTokens || 1000, 1000), // Cap for test
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}
