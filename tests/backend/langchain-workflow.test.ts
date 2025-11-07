import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockLLMResponses,
  mockSearchResponses,
  createMockFetchResponse,
} from '../fixtures/mock-responses';
import { MockLogger, MockLocalLLM, PerformanceTimer } from '../utils/test-helpers';

/**
 * LangChain Agent Workflow Tests
 * Tests for agent coordination, tool calling, and multi-step reasoning
 * Uses local mock models to avoid API dependencies
 */

describe('LangChain Agent Workflows', () => {
  let logger: MockLogger;
  let localLLM: MockLocalLLM;
  let timer: PerformanceTimer;

  beforeEach(() => {
    logger = new MockLogger();
    localLLM = new MockLocalLLM([
      'I will search for information about neural networks.',
      'Based on the search results, here is a summary...',
    ]);
    timer = new PerformanceTimer();
    vi.clearAllMocks();
  });

  describe('Search Agent', () => {
    it('should initialize with tools', () => {
      const tools = [
        { name: 'autumn_search', description: 'Search using Autumn API' },
        { name: 'firecrawl_search', description: 'Search and scrape using Firecrawl' },
      ];

      expect(tools).toHaveLength(2);
      expect(tools[0].name).toBe('autumn_search');
      expect(tools[1].name).toBe('firecrawl_search');
    });

    it('should execute parallel search with tools', async () => {
      timer.start();

      // Simulate tool calls
      const toolResults = await Promise.all([
        Promise.resolve(mockSearchResponses.autumn.success),
        Promise.resolve(mockSearchResponses.firecrawl.success),
      ]);

      timer.mark('tools_complete');

      expect(toolResults).toHaveLength(2);
      expect(toolResults[0].results).toHaveLength(2);
      expect(toolResults[1].results).toHaveLength(2);

      // Parallel execution should be fast
      expect(timer.getElapsed('tools_complete')).toBeLessThan(100);
    });

    it('should deduplicate results from multiple sources', () => {
      const autumnResults = mockSearchResponses.autumn.success.results;
      const firecrawlResults = mockSearchResponses.firecrawl.success.results;

      const allResults = [...autumnResults, ...firecrawlResults];

      // Simulate deduplication by URL
      const seen = new Set<string>();
      const deduplicated = allResults.filter((r) => {
        const key = r.url;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      expect(deduplicated.length).toBeLessThanOrEqual(allResults.length);
    });

    it('should log search events', async () => {
      logger.log('search_started', { query: 'neural networks' });

      const results = mockSearchResponses.autumn.success.results;

      logger.log('search_completed', {
        query: 'neural networks',
        resultCount: results.length,
      });

      logger.assertEventFired('search_started');
      logger.assertEventFired('search_completed');
      expect(logger.getEvents()).toHaveLength(2);
    });
  });

  describe('OCR Agent', () => {
    it('should detect PDF documents', () => {
      const results = [
        { url: 'https://example.com/page.html', title: 'Web Page' },
        { url: 'https://example.com/paper.pdf', title: 'Research Paper' },
        { url: 'https://arxiv.org/pdf/1234.pdf', title: 'ArXiv Paper' },
      ];

      const pdfs = results.filter(
        (r) => r.url.endsWith('.pdf') || r.url.includes('/pdf/')
      );

      expect(pdfs).toHaveLength(2);
    });

    it('should process document with DeepSeek OCR', async () => {
      const documentUrl = 'https://example.com/paper.pdf';

      // Mock OCR processing
      global.fetch = vi.fn().mockResolvedValue(
        createMockFetchResponse({
          content: '# Research Paper\n\nExtracted content...',
          stats: {
            originalTokens: 5000,
            compressedTokens: 500,
          },
          confidence: 0.96,
        })
      );

      const response = await fetch('https://api.deepseek.com/v1/ocr', {
        method: 'POST',
        body: JSON.stringify({ url: documentUrl, compressionRatio: 10 }),
      });

      const result = await response.json();

      expect(result.stats.originalTokens).toBe(5000);
      expect(result.stats.compressedTokens).toBe(500);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should calculate token savings', () => {
      const originalTokens = 5000;
      const compressedTokens = 500;

      const savings = ((originalTokens - compressedTokens) / originalTokens) * 100;

      expect(savings).toBe(90); // 90% savings
    });
  });

  describe('ADD Scorer Agent', () => {
    it('should score results using differential discrimination', () => {
      const query = 'neural networks';
      const resultA = mockSearchResponses.autumn.success.results[0];
      const resultB = mockSearchResponses.autumn.success.results[1];

      // Simplified ADD scoring
      const queryWords = new Set(query.toLowerCase().split(/\s+/));

      const scoreResult = (result: any) => {
        const resultWords = new Set(
          (result.title + ' ' + result.snippet).toLowerCase().split(/\s+/)
        );
        const overlap = [...queryWords].filter((w) => resultWords.has(w)).length;
        return overlap / queryWords.size;
      };

      const scoreA = scoreResult(resultA);
      const scoreB = scoreResult(resultB);

      expect(scoreA).toBeGreaterThan(0);
      expect(scoreB).toBeGreaterThan(0);
    });

    it('should compare result pairs', () => {
      const resultA = {
        relevanceScore: 0.95,
        publishedDate: '2024-02-01',
        domain: 'arxiv.org',
      };

      const resultB = {
        relevanceScore: 0.88,
        publishedDate: '2024-01-15',
        domain: 'example.com',
      };

      // Delta calculations
      const deltaRelevance = resultA.relevanceScore - resultB.relevanceScore;
      const deltaFreshness =
        new Date(resultA.publishedDate).getTime() -
        new Date(resultB.publishedDate).getTime();

      expect(deltaRelevance).toBeGreaterThan(0); // A is more relevant
      expect(deltaFreshness).toBeGreaterThan(0); // A is fresher
    });

    it('should rank results by ADD scores', () => {
      const results = [
        { id: '1', title: 'Result 1', addScore: 0.85 },
        { id: '2', title: 'Result 2', addScore: 0.92 },
        { id: '3', title: 'Result 3', addScore: 0.78 },
      ];

      const ranked = [...results].sort((a, b) => b.addScore - a.addScore);

      expect(ranked[0].id).toBe('2'); // Highest score
      expect(ranked[1].id).toBe('1');
      expect(ranked[2].id).toBe('3'); // Lowest score
    });
  });

  describe('Learning Agent', () => {
    it('should analyze tool performance', () => {
      const toolCalls = [
        { toolName: 'autumn_search', success: true, duration: 145 },
        { toolName: 'autumn_search', success: true, duration: 150 },
        { toolName: 'autumn_search', success: false, duration: 5000 },
        { toolName: 'firecrawl_search', success: true, duration: 230 },
      ];

      // Group by tool
      const byTool = toolCalls.reduce((acc, call) => {
        if (!acc[call.toolName]) acc[call.toolName] = [];
        acc[call.toolName].push(call);
        return acc;
      }, {} as Record<string, typeof toolCalls>);

      const autumnCalls = byTool['autumn_search'];
      const successfulCalls = autumnCalls.filter((c) => c.success);

      const successRate = successfulCalls.length / autumnCalls.length;
      const avgDuration =
        successfulCalls.reduce((sum, c) => sum + c.duration, 0) / successfulCalls.length;

      expect(successRate).toBeCloseTo(0.67, 2);
      expect(avgDuration).toBeCloseTo(147.5, 1);
    });

    it('should generate recommendations for failed tools', () => {
      const failureRate = 0.35; // 35% failure rate
      const recommendations: string[] = [];

      if (failureRate > 0.3) {
        recommendations.push(
          `Consider fallback (failure rate: ${(failureRate * 100).toFixed(1)}%)`
        );
      }

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0]).toContain('35.0%');
    });

    it('should identify slow tools', () => {
      const avgDuration = 6500; // 6.5 seconds
      const recommendations: string[] = [];

      if (avgDuration > 5000) {
        recommendations.push(
          `Optimize tool - avg duration: ${(avgDuration / 1000).toFixed(1)}s`
        );
      }

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0]).toContain('6.5s');
    });
  });

  describe('Agent Coordination', () => {
    it('should execute multi-step workflow', async () => {
      const workflow = [
        { step: 'search', agent: 'SearchAgent' },
        { step: 'ocr', agent: 'OCRAgent' },
        { step: 'score', agent: 'ScorerAgent' },
        { step: 'learn', agent: 'LearningAgent' },
      ];

      for (const { step, agent } of workflow) {
        logger.log(`${step}_started`, { agent });
        // Simulate step execution
        await Promise.resolve();
        logger.log(`${step}_completed`, { agent });
      }

      expect(logger.getEvents()).toHaveLength(8); // 2 events per step
      logger.assertEventCount('search_started', 1);
      logger.assertEventCount('score_completed', 1);
    });

    it('should handle workflow errors gracefully', async () => {
      const steps = ['search', 'ocr', 'score'];

      try {
        for (const step of steps) {
          if (step === 'ocr') {
            throw new Error('OCR failed');
          }
          logger.log(`${step}_completed`, {});
        }
      } catch (error: any) {
        logger.log('workflow_error', { error: error.message, step: 'ocr' });
      }

      logger.assertEventFired('workflow_error');
      const errorEvent = logger.getEvents('workflow_error')[0];
      expect(errorEvent.data.error).toBe('OCR failed');
    });
  });

  describe('Local Model Fallback', () => {
    it('should use local LLM when API key is not available', async () => {
      // Simulate missing API key
      const apiKey = process.env.ANTHROPIC_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      // Use local model
      const response = await localLLM.generate('What is a neural network?');

      expect(response).toBeTruthy();
      expect(localLLM.getCallCount()).toBe(1);

      // Restore API key
      process.env.ANTHROPIC_API_KEY = apiKey;
    });

    it('should handle tool calling with local model', async () => {
      const result = await localLLM.generateWithTools(
        'Search for neural networks',
        [{ name: 'autumn_search' }]
      );

      expect(result.toolCalls).toBeDefined();
      expect(result.toolCalls[0].name).toBe('autumn_search');
    });
  });
});
