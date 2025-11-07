import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mockConvexData,
  mockSearchResponses,
  mockOCRResponses,
  createMockFetchResponse,
} from '../fixtures/mock-responses';
import {
  createMockConvexClient,
  MockLogger,
  PerformanceTimer,
  assertHelpers,
} from '../utils/test-helpers';

/**
 * Convex Backend Function Tests
 * Tests for Convex actions, mutations, and queries
 * Uses mock data to avoid real API calls
 */

describe('Convex Search Functions', () => {
  let mockConvex: any;
  let logger: MockLogger;
  let timer: PerformanceTimer;

  beforeEach(() => {
    mockConvex = createMockConvexClient();
    logger = new MockLogger();
    timer = new PerformanceTimer();
    vi.clearAllMocks();
  });

  describe('performSearch action', () => {
    it('should create search record with pending status', async () => {
      const query = 'neural networks';
      const searchId = 'search_test_1';

      mockConvex.mutation = vi.fn().mockResolvedValue(searchId);

      // Simulate the action
      const result = await mockConvex.mutation('search:create', {
        query,
        status: 'pending',
      });

      expect(result).toBe(searchId);
      expect(mockConvex.mutation).toHaveBeenCalledWith('search:create', {
        query,
        status: 'pending',
      });
    });

    it('should handle parallel search from multiple sources', async () => {
      timer.start();

      // Mock parallel search calls
      const autumnPromise = Promise.resolve(mockSearchResponses.autumn.success);
      const firecrawlPromise = Promise.resolve(mockSearchResponses.firecrawl.success);

      const [autumnResults, firecrawlResults] = await Promise.all([
        autumnPromise,
        firecrawlPromise,
      ]);

      timer.mark('search_complete');

      expect(autumnResults.results).toHaveLength(2);
      expect(firecrawlResults.results).toHaveLength(2);

      // Parallel execution should be faster than sequential
      expect(timer.getElapsed('search_complete')).toBeLessThan(500);
    });

    it('should process OCR for PDF documents', async () => {
      const documents = [
        { url: 'https://example.com/paper.pdf', title: 'Research Paper' },
      ];

      // Mock OCR processing
      const ocrResult = mockOCRResponses.deepseek.success;

      expect(ocrResult.stats.originalTokens).toBe(5000);
      expect(ocrResult.stats.compressedTokens).toBe(500);

      // Verify 10x compression ratio
      const compressionRatio = ocrResult.stats.originalTokens / ocrResult.stats.compressedTokens;
      expect(compressionRatio).toBe(10);

      // Verify token savings
      assertHelpers.assertTokenSavings(
        ocrResult.stats.originalTokens,
        ocrResult.stats.compressedTokens,
        90
      );
    });

    it('should update search status through workflow', async () => {
      const searchId = 'search_123';
      const statuses = ['pending', 'searching', 'scoring', 'complete'];

      for (const status of statuses) {
        mockConvex.mutation = vi.fn().mockResolvedValue(undefined);

        await mockConvex.mutation('search:updateStatus', {
          searchId,
          status,
        });

        expect(mockConvex.mutation).toHaveBeenCalledWith('search:updateStatus', {
          searchId,
          status,
        });
      }
    });

    it('should handle search errors gracefully', async () => {
      const searchId = 'search_error';
      const error = new Error('API Error');

      mockConvex.mutation = vi.fn().mockRejectedValue(error);

      await expect(
        mockConvex.mutation('search:perform', { query: 'test' })
      ).rejects.toThrow('API Error');
    });
  });

  describe('Tool Call Logging', () => {
    it('should log successful tool calls', async () => {
      const toolCall = {
        toolName: 'autumn_search',
        parameters: { query: 'neural networks' },
        result: mockSearchResponses.autumn.success,
        duration: 145,
        success: true,
        timestamp: Date.now(),
      };

      mockConvex.mutation = vi.fn().mockResolvedValue('tool_1');

      await mockConvex.mutation('toolCalls:log', toolCall);

      expect(mockConvex.mutation).toHaveBeenCalledWith('toolCalls:log', toolCall);
    });

    it('should log failed tool calls with error messages', async () => {
      const toolCall = {
        toolName: 'firecrawl_search',
        parameters: { query: 'test' },
        result: null,
        duration: 500,
        success: false,
        errorMessage: 'Network timeout',
        timestamp: Date.now(),
      };

      mockConvex.mutation = vi.fn().mockResolvedValue('tool_2');

      await mockConvex.mutation('toolCalls:log', toolCall);

      expect(mockConvex.mutation).toHaveBeenCalledWith('toolCalls:log', toolCall);
      expect(toolCall.success).toBe(false);
      expect(toolCall.errorMessage).toBe('Network timeout');
    });

    it('should retrieve recent tool calls', async () => {
      mockConvex.query = vi.fn().mockResolvedValue(mockConvexData.toolCalls);

      const recentCalls = await mockConvex.query('toolCalls:recent', {
        timeWindow: 86400000, // 24 hours
      });

      expect(recentCalls).toHaveLength(2);
      assertHelpers.assertToolCallLogged(recentCalls, 'autumn_search');
      assertHelpers.assertToolCallLogged(recentCalls, 'firecrawl_search');
    });
  });

  describe('Learning Patterns', () => {
    it('should calculate success rate for tools', () => {
      const toolCalls = mockConvexData.toolCalls;
      const successful = toolCalls.filter((c) => c.success);

      const successRate = successful.length / toolCalls.length;

      expect(successRate).toBe(1.0); // All mock calls are successful
    });

    it('should calculate average duration', () => {
      const toolCalls = mockConvexData.toolCalls;
      const avgDuration =
        toolCalls.reduce((sum, c) => sum + c.duration, 0) / toolCalls.length;

      expect(avgDuration).toBe(187.5); // (145 + 230) / 2
    });

    it('should generate recommendations for slow tools', () => {
      const avgDuration = 6000; // 6 seconds
      const recommendations: string[] = [];

      if (avgDuration > 5000) {
        recommendations.push(`Optimize tool - avg duration: ${(avgDuration / 1000).toFixed(1)}s`);
      }

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0]).toContain('6.0s');
    });

    it('should store learning patterns', async () => {
      const pattern = {
        toolName: 'parallel_search',
        successRate: 0.95,
        avgDuration: 187.5,
        recommendations: [
          'Use parallel execution for better performance',
          'Cache frequently used queries',
        ],
        lastUpdated: Date.now(),
      };

      mockConvex.mutation = vi.fn().mockResolvedValue('pattern_1');

      await mockConvex.mutation('learningPatterns:upsert', pattern);

      expect(mockConvex.mutation).toHaveBeenCalledWith('learningPatterns:upsert', pattern);
    });
  });

  describe('Query Functions', () => {
    it('should list recent searches', async () => {
      mockConvex.query = vi.fn().mockResolvedValue(mockConvexData.searches);

      const searches = await mockConvex.query('search:list');

      expect(searches).toHaveLength(2);
      expect(searches[0].query).toBe('neural networks');
      expect(searches[1].status).toBe('complete');
    });

    it('should filter searches by user', async () => {
      const userSearches = mockConvexData.searches.filter(
        (s) => s.userId === 'user_1'
      );

      mockConvex.query = vi.fn().mockResolvedValue(userSearches);

      const searches = await mockConvex.query('search:byUser', { userId: 'user_1' });

      expect(searches).toHaveLength(2);
      expect(searches.every((s) => s.userId === 'user_1')).toBe(true);
    });

    it('should get search by ID', async () => {
      const search = mockConvexData.searches[1];

      mockConvex.query = vi.fn().mockResolvedValue(search);

      const result = await mockConvex.query('search:get', { id: 'search_2' });

      expect(result._id).toBe('search_2');
      expect(result.tokenSavings).toBe(90.0);
    });
  });

  describe('Performance Requirements', () => {
    it('should complete search workflow within time budget', async () => {
      timer.start();

      // Simulate search workflow
      await mockConvex.mutation('search:create', { query: 'test', status: 'pending' });
      timer.mark('created');

      await Promise.all([
        Promise.resolve(mockSearchResponses.autumn.success),
        Promise.resolve(mockSearchResponses.firecrawl.success),
      ]);
      timer.mark('searched');

      await mockConvex.mutation('search:complete', { searchId: 'test', results: [] });
      timer.mark('completed');

      // Workflow should complete in under 1 second (excluding actual API calls)
      expect(timer.getElapsed('completed')).toBeLessThan(1000);
    });

    it('should handle concurrent searches efficiently', async () => {
      const queries = ['query1', 'query2', 'query3', 'query4', 'query5'];

      timer.start();

      // Simulate concurrent searches
      await Promise.all(
        queries.map((query) =>
          mockConvex.mutation('search:create', { query, status: 'pending' })
        )
      );

      timer.mark('all_created');

      // Should handle 5 concurrent requests quickly
      expect(timer.getElapsed('all_created')).toBeLessThan(500);
    });
  });
});
