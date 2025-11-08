import { vi } from 'vitest';
import type { ConvexClient } from 'convex/browser';

/**
 * Test utilities and helpers for agentic search platform tests
 */

// Mock Convex client factory
export function createMockConvexClient(): Partial<ConvexClient> {
  return {
    query: vi.fn(),
    mutation: vi.fn(),
    action: vi.fn(),
    close: vi.fn(),
  };
}

// Mock environment setup
export function setupTestEnvironment(overrides: Record<string, string> = {}) {
  const defaults = {
    VITE_CONVEX_URL: 'https://test.convex.cloud',
    ANTHROPIC_API_KEY: 'test-key',
    OPENAI_API_KEY: 'test-key',
    DEEPSEEK_API_KEY: 'test-key',
    AUTUMN_API_KEY: 'test-key',
    FIRECRAWL_API_KEY: 'test-key',
  };

  Object.entries({ ...defaults, ...overrides }).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Mock fetch wrapper for API calls
export function mockFetch(responses: Map<string, any>) {
  return vi.fn((url: string, options?: RequestInit) => {
    const matchedResponse = Array.from(responses.entries()).find(([pattern]) => {
      if (pattern instanceof RegExp) {
        return pattern.test(url);
      }
      return url.includes(pattern);
    });

    if (matchedResponse) {
      const [, response] = matchedResponse;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => response,
        text: async () => JSON.stringify(response),
        headers: new Headers({ 'content-type': 'application/json' }),
      });
    }

    return Promise.reject(new Error(`No mock response for ${url}`));
  });
}

// Performance timer for testing agent latency
export class PerformanceTimer {
  private startTime: number = 0;
  private marks: Map<string, number> = new Map();

  start() {
    this.startTime = performance.now();
    this.marks.clear();
  }

  mark(label: string) {
    this.marks.set(label, performance.now() - this.startTime);
  }

  getElapsed(label?: string): number {
    if (label) {
      return this.marks.get(label) || 0;
    }
    return performance.now() - this.startTime;
  }

  getDuration(start: string, end: string): number {
    const startTime = this.marks.get(start) || 0;
    const endTime = this.marks.get(end) || 0;
    return endTime - startTime;
  }

  assertWithinBudget(label: string, budgetMs: number) {
    const elapsed = this.marks.get(label) || this.getElapsed();
    if (elapsed > budgetMs) {
      throw new Error(
        `Performance budget exceeded: ${label} took ${elapsed}ms, budget was ${budgetMs}ms`
      );
    }
  }
}

// Mock logger for testing agent decisions
export class MockLogger {
  public events: Array<{ event: string; data: any; timestamp: number }> = [];

  log(event: string, data: any) {
    this.events.push({
      event,
      data,
      timestamp: Date.now(),
    });
  }

  getEvents(eventType?: string) {
    if (eventType) {
      return this.events.filter((e) => e.event === eventType);
    }
    return this.events;
  }

  clear() {
    this.events = [];
  }

  assertEventFired(eventType: string) {
    const found = this.events.some((e) => e.event === eventType);
    if (!found) {
      throw new Error(`Expected event "${eventType}" was not fired`);
    }
  }

  assertEventCount(eventType: string, count: number) {
    const actual = this.events.filter((e) => e.event === eventType).length;
    if (actual !== count) {
      throw new Error(
        `Expected ${count} "${eventType}" events, but found ${actual}`
      );
    }
  }
}

// Wait for condition helper
export async function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

// Retry helper for flaky tests
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

// Mock local LLM for testing without API calls
export class MockLocalLLM {
  private responses: string[] = [];
  private callCount: number = 0;

  constructor(responses?: string[]) {
    this.responses = responses || ['Default mock response'];
  }

  async generate(prompt: string): Promise<string> {
    const response = this.responses[this.callCount % this.responses.length];
    this.callCount++;
    return response;
  }

  async generateWithTools(prompt: string, tools: any[]): Promise<any> {
    // Simulate tool calling
    if (prompt.toLowerCase().includes('search')) {
      return {
        toolCalls: [
          {
            id: 'call_1',
            name: 'autumn_search',
            arguments: { query: 'extracted query from prompt' },
          },
        ],
      };
    }

    return {
      content: this.responses[this.callCount++ % this.responses.length],
    };
  }

  getCallCount(): number {
    return this.callCount;
  }

  reset() {
    this.callCount = 0;
  }
}

// Assert helpers for common test scenarios
export const assertHelpers = {
  assertSearchResults(results: any[], minCount: number = 1) {
    if (!Array.isArray(results)) {
      throw new Error('Results must be an array');
    }
    if (results.length < minCount) {
      throw new Error(`Expected at least ${minCount} results, got ${results.length}`);
    }
    results.forEach((result, index) => {
      if (!result.title || !result.url) {
        throw new Error(`Result ${index} missing required fields (title, url)`);
      }
    });
  },

  assertTokenSavings(original: number, compressed: number, minSavings: number = 50) {
    const savings = ((original - compressed) / original) * 100;
    if (savings < minSavings) {
      throw new Error(
        `Expected at least ${minSavings}% token savings, got ${savings.toFixed(1)}%`
      );
    }
  },

  assertADDScore(score: number) {
    if (score < 0 || score > 1) {
      throw new Error(`ADD score must be between 0 and 1, got ${score}`);
    }
  },

  assertToolCallLogged(toolCalls: any[], toolName: string) {
    const found = toolCalls.some((call) => call.toolName === toolName);
    if (!found) {
      throw new Error(`Expected tool call "${toolName}" to be logged`);
    }
  },
};
