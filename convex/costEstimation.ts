/**
 * Cost Estimation for External API Usage
 *
 * Single source of truth for provider pricing.
 * Estimates costs based on token counts and known per-model pricing.
 *
 * Pricing last updated: 2026-03-08
 */

import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Provider pricing configuration (USD)
 * Centralized here - update prices in ONE place.
 */
export const PROVIDER_PRICING: Record<string, {
  type: "per_token" | "per_request" | "per_page";
  /** For per_token: price per 1M input tokens */
  inputPricePerMillion?: number;
  /** For per_token: price per 1M output tokens */
  outputPricePerMillion?: number;
  /** For per_request or per_page: flat rate per call */
  pricePerRequest?: number;
  /** Display name */
  displayName: string;
}> = {
  // LLM Providers (per token)
  openai: {
    type: "per_token",
    inputPricePerMillion: 2.50,
    outputPricePerMillion: 10.00,
    displayName: "OpenAI",
  },
  "openai:gpt-4o": {
    type: "per_token",
    inputPricePerMillion: 2.50,
    outputPricePerMillion: 10.00,
    displayName: "OpenAI GPT-4o",
  },
  "openai:gpt-4o-mini": {
    type: "per_token",
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.60,
    displayName: "OpenAI GPT-4o Mini",
  },
  anthropic: {
    type: "per_token",
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00,
    displayName: "Anthropic",
  },
  "anthropic:claude-sonnet-4-6": {
    type: "per_token",
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00,
    displayName: "Claude Sonnet 4.6",
  },
  "anthropic:claude-haiku-4-5": {
    type: "per_token",
    inputPricePerMillion: 0.80,
    outputPricePerMillion: 4.00,
    displayName: "Claude Haiku 4.5",
  },
  google: {
    type: "per_token",
    inputPricePerMillion: 1.25,
    outputPricePerMillion: 5.00,
    displayName: "Google Gemini",
  },
  deepseek: {
    type: "per_token",
    inputPricePerMillion: 0.27,
    outputPricePerMillion: 1.10,
    displayName: "DeepSeek",
  },

  // Search APIs (per request)
  firecrawl: {
    type: "per_request",
    pricePerRequest: 0.004,
    displayName: "Firecrawl",
  },
  tavily: {
    type: "per_request",
    pricePerRequest: 0.001,
    displayName: "Tavily",
  },
  brave: {
    type: "per_request",
    pricePerRequest: 0.003,
    displayName: "Brave Search",
  },
  exa: {
    type: "per_request",
    pricePerRequest: 0.001,
    displayName: "Exa",
  },

  // Document Processing (per page/request)
  llamaparse: {
    type: "per_page",
    pricePerRequest: 0.003,
    displayName: "LlamaParse",
  },
  deepseek_ocr: {
    type: "per_request",
    pricePerRequest: 0.002,
    displayName: "DeepSeek OCR",
  },
  paddleocr: {
    type: "per_request",
    pricePerRequest: 0.0,
    displayName: "PaddleOCR (Free/Local)",
  },

  // Local models (free)
  ollama: {
    type: "per_token",
    inputPricePerMillion: 0,
    outputPricePerMillion: 0,
    displayName: "Ollama (Local)",
  },
  lmstudio: {
    type: "per_token",
    inputPricePerMillion: 0,
    outputPricePerMillion: 0,
    displayName: "LM Studio (Local)",
  },
};

/**
 * Estimate cost for a given API call
 */
export function estimateCost(
  provider: string,
  tokensUsed?: number,
  requestCount: number = 1,
): number {
  // Try exact match first, then base provider
  const pricing = PROVIDER_PRICING[provider] ?? PROVIDER_PRICING[provider.split(":")[0]];
  if (!pricing) return 0;

  switch (pricing.type) {
    case "per_token":
      if (!tokensUsed) return 0;
      // Assume 70% input, 30% output split when we don't know
      const inputTokens = Math.round(tokensUsed * 0.7);
      const outputTokens = tokensUsed - inputTokens;
      return (
        (inputTokens / 1_000_000) * (pricing.inputPricePerMillion ?? 0) +
        (outputTokens / 1_000_000) * (pricing.outputPricePerMillion ?? 0)
      );
    case "per_request":
    case "per_page":
      return (pricing.pricePerRequest ?? 0) * requestCount;
    default:
      return 0;
  }
}

/**
 * Get cost summary for the current user over a date range
 */
export const getCostSummary = query({
  args: {
    daysBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const cutoff = Date.now() - (args.daysBack ?? 30) * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query("externalApiUsage")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userId).gte("createdAt", cutoff)
      )
      .collect();

    let totalCost = 0;
    let totalTokens = 0;
    let totalRequests = 0;
    const costByProvider = new Map<string, number>();

    for (const event of events) {
      const cost = event.costEstimate ?? estimateCost(event.provider, event.tokensUsed, event.requestCount);
      totalCost += cost;
      totalTokens += event.tokensUsed ?? 0;
      totalRequests += event.requestCount;

      const providerCost = costByProvider.get(event.provider) ?? 0;
      costByProvider.set(event.provider, providerCost + cost);
    }

    return {
      totalCost: Math.round(totalCost * 10000) / 10000,
      totalTokens,
      totalRequests,
      costByProvider: Object.fromEntries(
        Array.from(costByProvider.entries()).map(([k, v]) => [k, Math.round(v * 10000) / 10000])
      ),
      daysBack: args.daysBack ?? 30,
    };
  },
});

/**
 * Get the pricing table for display in the UI
 */
export const getPricingTable = query({
  args: {},
  handler: async () => {
    return Object.entries(PROVIDER_PRICING)
      .filter(([key]) => !key.includes(":")) // Only base providers
      .map(([id, config]) => ({
        id,
        displayName: config.displayName,
        type: config.type,
        inputPricePerMillion: config.inputPricePerMillion,
        outputPricePerMillion: config.outputPricePerMillion,
        pricePerRequest: config.pricePerRequest,
      }));
  },
});
