/**
 * Usage Tracking for Fine-tuning Dataset Collection
 *
 * Tracks all user interactions with the search system to build
 * high-quality fine-tuning datasets for custom LLM training.
 *
 * Captures:
 * - Search queries and results
 * - Segment executions
 * - Model responses
 * - User feedback (positive/negative)
 * - Quality scores from ADD discriminator
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Track a search event
 */
export const trackSearch = mutation({
  args: {
    query: v.string(),
    modelUsed: v.string(),
    tokensUsed: v.optional(v.number()),
    executionTimeMs: v.number(),
    success: v.boolean(),
    quality: v.optional(v.number()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      // Allow anonymous usage tracking for analytics
      console.log("[Usage] Anonymous search tracked");
    }

    await ctx.db.insert("usageEvents", {
      userId: userIdentity?.subject || "anonymous",
      eventType: "search",
      query: args.query,
      modelUsed: args.modelUsed,
      tokensUsed: args.tokensUsed,
      executionTimeMs: args.executionTimeMs,
      success: args.success,
      quality: args.quality,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

/**
 * Track a segment execution
 */
export const trackSegmentExecution = mutation({
  args: {
    segmentId: v.string(),
    segmentText: v.string(),
    segmentType: v.string(),
    modelUsed: v.string(),
    tokensUsed: v.number(),
    executionTimeMs: v.number(),
    success: v.boolean(),
    confidence: v.number(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    await ctx.db.insert("usageEvents", {
      userId: userIdentity?.subject || "anonymous",
      eventType: "segment_execution",
      query: args.segmentText,
      modelUsed: args.modelUsed,
      tokensUsed: args.tokensUsed,
      executionTimeMs: args.executionTimeMs,
      success: args.success,
      quality: args.confidence,
      metadata: {
        segmentId: args.segmentId,
        segmentType: args.segmentType,
        ...args.metadata,
      },
      createdAt: Date.now(),
    });
  },
});

/**
 * Track user feedback on a search result
 */
export const trackFeedback = mutation({
  args: {
    query: v.string(),
    feedback: v.union(
      v.literal("positive"),
      v.literal("negative"),
      v.literal("neutral")
    ),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required to submit feedback");
    }

    await ctx.db.insert("usageEvents", {
      userId: userIdentity.subject,
      eventType: "user_feedback",
      query: args.query,
      success: true,
      userFeedback: args.feedback,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get usage statistics for the authenticated user
 */
export const getUsageStats = query({
  args: {
    timeRangeMs: v.optional(v.number()), // Default: last 30 days
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const timeRange = args.timeRangeMs || 30 * 24 * 60 * 60 * 1000; // 30 days
    const since = Date.now() - timeRange;

    const events = await ctx.db
      .query("usageEvents")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userIdentity.subject).gt("createdAt", since)
      )
      .collect();

    // Calculate statistics
    const totalSearches = events.filter((e) => e.eventType === "search").length;
    const totalSegments = events.filter(
      (e) => e.eventType === "segment_execution"
    ).length;
    const totalFeedback = events.filter(
      (e) => e.eventType === "user_feedback"
    ).length;

    const avgQuality =
      events
        .filter((e) => e.quality !== undefined)
        .reduce((sum, e) => sum + (e.quality || 0), 0) /
        (events.filter((e) => e.quality !== undefined).length || 1);

    const totalTokens = events.reduce(
      (sum, e) => sum + (e.tokensUsed || 0),
      0
    );

    const avgExecutionTime =
      events
        .filter((e) => e.executionTimeMs !== undefined)
        .reduce((sum, e) => sum + (e.executionTimeMs || 0), 0) /
        (events.filter((e) => e.executionTimeMs !== undefined).length || 1);

    // Model distribution
    const modelDistribution: Record<string, number> = {};
    for (const event of events) {
      if (event.modelUsed) {
        modelDistribution[event.modelUsed] =
          (modelDistribution[event.modelUsed] || 0) + 1;
      }
    }

    return {
      totalSearches,
      totalSegments,
      totalFeedback,
      avgQuality,
      totalTokens,
      avgExecutionTime,
      modelDistribution,
      eventsCount: events.length,
    };
  },
});

/**
 * Export usage events for fine-tuning dataset
 */
export const exportForFineTuning = query({
  args: {
    format: v.union(
      v.literal("openai_jsonl"),
      v.literal("anthropic_jsonl"),
      v.literal("generic_json")
    ),
    minQuality: v.optional(v.number()), // Filter by minimum quality score
    eventTypes: v.optional(
      v.array(
        v.union(
          v.literal("search"),
          v.literal("segment_execution"),
          v.literal("model_call"),
          v.literal("user_feedback")
        )
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    // Get events filtered by criteria
    let eventsQuery = ctx.db
      .query("usageEvents")
      .withIndex("by_user", (q) => q.eq("userId", userIdentity.subject));

    const events = await eventsQuery.collect();

    // Filter by quality and event type
    let filtered = events;
    if (args.minQuality !== undefined) {
      filtered = filtered.filter(
        (e) => e.quality !== undefined && e.quality >= args.minQuality!
      );
    }
    if (args.eventTypes && args.eventTypes.length > 0) {
      filtered = filtered.filter((e) => args.eventTypes!.includes(e.eventType));
    }

    // Limit results
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    // Format based on requested format
    let formatted: any[];
    switch (args.format) {
      case "openai_jsonl":
        formatted = filtered.map((e) => ({
          messages: [
            { role: "user", content: e.query || "" },
            {
              role: "assistant",
              content: JSON.stringify(e.metadata || {}),
            },
          ],
        }));
        break;

      case "anthropic_jsonl":
        formatted = filtered.map((e) => ({
          prompt: e.query || "",
          completion: JSON.stringify(e.metadata || {}),
        }));
        break;

      case "generic_json":
      default:
        formatted = filtered.map((e) => ({
          query: e.query,
          model: e.modelUsed,
          tokens: e.tokensUsed,
          executionTime: e.executionTimeMs,
          success: e.success,
          quality: e.quality,
          feedback: e.userFeedback,
          metadata: e.metadata,
          timestamp: e.createdAt,
        }));
        break;
    }

    return {
      format: args.format,
      count: formatted.length,
      data: formatted,
    };
  },
});

/**
 * Create a fine-tuning dataset export
 */
export const createDatasetExport = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    format: v.union(
      v.literal("openai_jsonl"),
      v.literal("anthropic_jsonl"),
      v.literal("generic_json")
    ),
    minQuality: v.optional(v.number()),
    eventTypes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    // Get events count
    const events = await ctx.db
      .query("usageEvents")
      .withIndex("by_user", (q) => q.eq("userId", userIdentity.subject))
      .collect();

    let filtered = events;
    if (args.minQuality !== undefined) {
      filtered = filtered.filter(
        (e) => e.quality !== undefined && e.quality >= args.minQuality!
      );
    }

    // Calculate statistics
    const avgQuality =
      filtered
        .filter((e) => e.quality !== undefined)
        .reduce((sum, e) => sum + (e.quality || 0), 0) /
        (filtered.filter((e) => e.quality !== undefined).length || 1);

    const totalTokens = filtered.reduce(
      (sum, e) => sum + (e.tokensUsed || 0),
      0
    );

    const modelDistribution: Record<string, number> = {};
    for (const event of filtered) {
      if (event.modelUsed) {
        modelDistribution[event.modelUsed] =
          (modelDistribution[event.modelUsed] || 0) + 1;
      }
    }

    // Create dataset export record
    const datasetId = await ctx.db.insert("finetuningDatasets", {
      userId: userIdentity.subject,
      name: args.name,
      description: args.description,
      format: args.format,
      eventCount: filtered.length,
      exportedAt: Date.now(),
      metadata: {
        avgQuality,
        totalTokens,
        modelDistribution,
      },
    });

    return datasetId;
  },
});

/**
 * List fine-tuning datasets for the authenticated user
 */
export const listDatasets = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const datasets = await ctx.db
      .query("finetuningDatasets")
      .withIndex("by_user", (q) => q.eq("userId", userIdentity.subject))
      .collect();

    return datasets;
  },
});


