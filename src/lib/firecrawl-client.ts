/**
 * Firecrawl Client Integration
 *
 * Provides TypeScript interface for Firecrawl API with:
 * - Web scraping to LLM-ready markdown
 * - Search functionality
 * - Crawling with link discovery
 * - Screenshot capture
 * - Retry logic and error handling
 */

import { z } from "zod";

// Firecrawl API response schemas
export const FirecrawlSearchResultSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  content: z.string().optional(),
  markdown: z.string().optional(),
  html: z.string().optional(),
  screenshot: z.string().optional(),
  metadata: z
    .object({
      sourceURL: z.string().optional(),
      publishedDate: z.string().optional(),
      author: z.string().optional(),
      language: z.string().optional(),
    })
    .optional(),
});

export const FirecrawlSearchResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(FirecrawlSearchResultSchema).optional(),
  error: z.string().optional(),
});

export const FirecrawlScrapeResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      url: z.string(),
      markdown: z.string().optional(),
      html: z.string().optional(),
      rawHtml: z.string().optional(),
      screenshot: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
    .optional(),
  error: z.string().optional(),
});

export type FirecrawlSearchResult = z.infer<typeof FirecrawlSearchResultSchema>;
export type FirecrawlSearchResponse = z.infer<
  typeof FirecrawlSearchResponseSchema
>;
export type FirecrawlScrapeResponse = z.infer<
  typeof FirecrawlScrapeResponseSchema
>;

// Configuration options
export interface FirecrawlClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface FirecrawlSearchOptions {
  query: string;
  limit?: number;
  includeScreenshots?: boolean;
  onlyMainContent?: boolean;
  formats?: Array<"markdown" | "html" | "rawHtml">;
}

export interface FirecrawlScrapeOptions {
  url: string;
  formats?: Array<"markdown" | "html" | "rawHtml">;
  onlyMainContent?: boolean;
  includeScreenshot?: boolean;
  waitFor?: number;
}

/**
 * Firecrawl API Client
 * Handles all interactions with Firecrawl API with robust error handling
 */
export class FirecrawlClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(config: FirecrawlClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.firecrawl.dev/v1";
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  /**
   * Search the web using Firecrawl
   * Returns scraped and parsed results ready for LLM consumption
   */
  async search(
    options: FirecrawlSearchOptions
  ): Promise<FirecrawlSearchResult[]> {
    const payload = {
      query: options.query,
      limit: options.limit || 5,
      scrapeOptions: {
        formats: options.formats || ["markdown"],
        onlyMainContent: options.onlyMainContent ?? true,
        includeScreenshot: options.includeScreenshots ?? false,
      },
    };

    const response = await this.makeRequest<FirecrawlSearchResponse>(
      "/search",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Search failed");
    }

    return response.data;
  }

  /**
   * Scrape a single URL
   * Returns LLM-ready markdown content
   */
  async scrape(
    options: FirecrawlScrapeOptions
  ): Promise<FirecrawlScrapeResponse["data"]> {
    const payload = {
      url: options.url,
      formats: options.formats || ["markdown"],
      onlyMainContent: options.onlyMainContent ?? true,
      screenshot: options.includeScreenshot ?? false,
      waitFor: options.waitFor || 0,
    };

    const response = await this.makeRequest<FirecrawlScrapeResponse>(
      "/scrape",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Scrape failed");
    }

    return response.data;
  }

  /**
   * Batch scrape multiple URLs
   * Useful for scraping search results in parallel
   */
  async batchScrape(
    urls: string[],
    options?: Omit<FirecrawlScrapeOptions, "url">
  ): Promise<Array<FirecrawlScrapeResponse["data"]>> {
    const scrapePromises = urls.map((url) =>
      this.scrape({ ...options, url }).catch((error) => {
        console.warn(`Failed to scrape ${url}:`, error);
        return null;
      })
    );

    const results = await Promise.all(scrapePromises);
    return results.filter((result): result is NonNullable<typeof result> => result !== null);
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...(options.headers as Record<string, string>),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Firecrawl API error (${response.status}): ${errorText}`
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      // Retry logic for network errors and timeouts
      if (retryCount < this.maxRetries) {
        const isRetryable =
          error instanceof Error &&
          (error.name === "AbortError" ||
            error.message.includes("ECONNRESET") ||
            error.message.includes("ETIMEDOUT") ||
            error.message.includes("429")); // Rate limit

        if (isRetryable) {
          console.warn(
            `Firecrawl request failed, retrying (${retryCount + 1}/${this.maxRetries})...`
          );
          await this.delay(this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
          return this.makeRequest<T>(endpoint, options, retryCount + 1);
        }
      }

      throw error;
    }
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Health check to verify API connectivity
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    latency?: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      // Make a minimal search request
      await this.search({
        query: "test",
        limit: 1,
        formats: ["markdown"],
      });

      const latency = Date.now() - startTime;

      return {
        healthy: true,
        latency,
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Extract main content from search results
   * Useful for feeding to LLM with token limits
   */
  static extractMainContent(
    results: FirecrawlSearchResult[],
    maxLength = 4000
  ): string {
    let content = "";
    let currentLength = 0;

    for (const result of results) {
      const resultContent = result.markdown || result.content || "";
      const resultHeader = `\n\n## ${result.title}\nSource: ${result.url}\n\n`;

      if (currentLength + resultHeader.length + resultContent.length > maxLength) {
        // Add truncated content
        const remainingSpace =
          maxLength - currentLength - resultHeader.length - 50;
        if (remainingSpace > 100) {
          content +=
            resultHeader +
            resultContent.substring(0, remainingSpace) +
            "\n\n[Content truncated...]";
        }
        break;
      }

      content += resultHeader + resultContent;
      currentLength += resultHeader.length + resultContent.length;
    }

    return content;
  }

  /**
   * Format search results for LLM consumption
   * Includes metadata for better context
   */
  static formatForLLM(results: FirecrawlSearchResult[]): string {
    return results
      .map(
        (result, index) => `
### Result ${index + 1}: ${result.title}

**URL:** ${result.url}
**Description:** ${result.description || "N/A"}
${result.metadata?.publishedDate ? `**Published:** ${result.metadata.publishedDate}` : ""}
${result.metadata?.author ? `**Author:** ${result.metadata.author}` : ""}

**Content:**
${result.markdown || result.content || "No content available"}

---
    `.trim()
      )
      .join("\n\n");
  }
}

/**
 * Factory function to create Firecrawl client from environment
 */
export function createFirecrawlClient(
  config?: Partial<FirecrawlClientConfig>
): FirecrawlClient {
  const apiKey = config?.apiKey || process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Firecrawl API key is required. Set FIRECRAWL_API_KEY environment variable or pass apiKey in config."
    );
  }

  return new FirecrawlClient({
    apiKey,
    ...config,
  });
}
