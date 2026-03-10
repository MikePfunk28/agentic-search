/**
 * External API Usage Tracking
 *
 * Tracks usage from: Firecrawl, Tavily, Brave, Exa, LlamaParse,
 * DeepSeek OCR, PaddleOCR, OpenAI, Anthropic, Google, and any other providers.
 *
 * Used for analytics dashboard, cost estimation, and usage monitoring.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Track an external API call
 */
export const trackExternalApiCall = mutation({
  args: {
    provider: v.string(),
    endpoint: v.string(),
    tokensUsed: v.optional(v.number()),
    requestCount: v.number(),
    responseTimeMs: v.number(),
    success: v.boolean(),
    costEstimate: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    // Allow anonymous tracking with fallback
    const userIdStr = userId ?? "anonymous";

    return await ctx.db.insert("externalApiUsage", {
      userId: userIdStr,
      provider: args.provider,
      endpoint: args.endpoint,
      tokensUsed: args.tokensUsed,
      requestCount: args.requestCount,
      responseTimeMs: args.responseTimeMs,
      success: args.success,
      costEstimate: args.costEstimate,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get aggregate stats per provider for the current user
 */
export const getExternalApiStats = query({
  args: {
    daysBack: v.optional(v.number()), // defaults to 30
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const cutoff = Date.now() - (args.daysBack ?? 30) * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query("externalApiUsage")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userId).gte("createdAt", cutoff)
      )
      .collect();

    // Aggregate by provider
    const byProvider = new Map<string, {
      provider: string;
      totalRequests: number;
      totalTokens: number;
      totalCost: number;
      avgResponseTime: number;
      successRate: number;
      successCount: number;
    }>();

    for (const event of events) {
      const existing = byProvider.get(event.provider) ?? {
        provider: event.provider,
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        avgResponseTime: 0,
        successRate: 0,
        successCount: 0,
      };

      existing.totalRequests += event.requestCount;
      existing.totalTokens += event.tokensUsed ?? 0;
      existing.totalCost += event.costEstimate ?? 0;
      existing.avgResponseTime =
        (existing.avgResponseTime * (existing.totalRequests - event.requestCount) +
          event.responseTimeMs * event.requestCount) / existing.totalRequests;
      if (event.success) existing.successCount += event.requestCount;
      existing.successRate = existing.successCount / existing.totalRequests;

      byProvider.set(event.provider, existing);
    }

    return Array.from(byProvider.values());
  },
});

/**
 * Get time-series data for external API usage (grouped by day)
 */
export const getExternalApiTimeSeries = query({
  args: {
    daysBack: v.optional(v.number()),
    provider: v.optional(v.string()), // filter to specific provider
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const cutoff = Date.now() - (args.daysBack ?? 30) * 24 * 60 * 60 * 1000;

    let events = await ctx.db
      .query("externalApiUsage")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userId).gte("createdAt", cutoff)
      )
      .collect();

    // Filter by provider if specified
    if (args.provider) {
      events = events.filter((e) => e.provider === args.provider);
    }

    // Group by day
    const byDay = new Map<string, {
      date: string;
      requests: number;
      tokens: number;
      cost: number;
      avgResponseTime: number;
      totalResponseTime: number;
    }>();

    for (const event of events) {
      const date = new Date(event.createdAt).toISOString().split("T")[0];
      const existing = byDay.get(date) ?? {
        date,
        requests: 0,
        tokens: 0,
        cost: 0,
        avgResponseTime: 0,
        totalResponseTime: 0,
      };

      existing.requests += event.requestCount;
      existing.tokens += event.tokensUsed ?? 0;
      existing.cost += event.costEstimate ?? 0;
      existing.totalResponseTime += event.responseTimeMs * event.requestCount;
      existing.avgResponseTime = existing.totalResponseTime / existing.requests;

      byDay.set(date, existing);
    }

    return Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
  },
});
