/**
 * Search History Management
 *
 * Store and retrieve user's past searches for:
 * - Browsing old results
 * - Learning from patterns
 * - Fine-tuning datasets
 * - User experience improvements
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Save a search to history
 */
export const saveSearch = mutation({
  args: {
    query: v.string(),
    modelUsed: v.string(),
    results: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        snippet: v.string(),
        addScore: v.optional(v.number()),
        confidence: v.optional(v.number()),
      })
    ),
    segmentCount: v.optional(v.number()),
    segments: v.optional(v.array(v.any())),
    executionTimeMs: v.number(),
    tokensUsed: v.number(),
    quality: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const userId = userIdentity?.subject || "anonymous";

    const searchId = await ctx.db.insert("searchHistory", {
      userId,
      query: args.query,
      modelUsed: args.modelUsed,
      results: args.results,
      segmentCount: args.segmentCount,
      segments: args.segments,
      executionTimeMs: args.executionTimeMs,
      tokensUsed: args.tokensUsed,
      quality: args.quality,
      createdAt: Date.now(),
    });

    return searchId;
  },
});

/**
 * Get user's search history (paginated)
 */
export const listSearchHistory = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const limit = args.limit || 20;
    const offset = args.offset || 0;

    const searches = await ctx.db
      .query("searchHistory")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userIdentity.subject)
      )
      .order("desc")
      .take(limit + offset);

    // Apply offset manually (Convex doesn't have built-in offset)
    return searches.slice(offset, offset + limit);
  },
});

/**
 * Get specific search by ID
 */
export const getSearch = query({
  args: {
    searchId: v.id("searchHistory"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const search = await ctx.db.get(args.searchId);

    // Verify ownership
    if (search && search.userId !== userIdentity.subject) {
      throw new Error("Unauthorized: You do not own this search");
    }

    return search;
  },
});

/**
 * Mark search as approved by user
 */
export const approveSearch = mutation({
  args: {
    searchId: v.id("searchHistory"),
    modifications: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const search = await ctx.db.get(args.searchId);

    if (!search || search.userId !== userIdentity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.searchId, {
      userApproved: true,
      userModifications: args.modifications,
    });
  },
});

/**
 * Search within search history
 */
export const searchHistory = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const limit = args.limit || 20;
    const searchLower = args.query.toLowerCase();

    const allSearches = await ctx.db
      .query("searchHistory")
      .withIndex("by_user", (q) => q.eq("userId", userIdentity.subject))
      .take(100); // Search last 100

    const filtered = allSearches
      .filter((s) => s.query.toLowerCase().includes(searchLower))
      .slice(0, limit);

    return filtered;
  },
});

/**
 * Get search statistics
 */
export const getSearchStats = query({
  args: {
    timeRangeMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Authentication required");
    }

    const timeRange = args.timeRangeMs || 30 * 24 * 60 * 60 * 1000; // 30 days
    const since = Date.now() - timeRange;

    const searches = await ctx.db
      .query("searchHistory")
      .withIndex("by_user_created", (q) =>
        q.eq("userId", userIdentity.subject).gt("createdAt", since)
      )
      .collect();

    const totalSearches = searches.length;
    const avgQuality =
      searches
        .filter((s) => s.quality !== undefined)
        .reduce((sum, s) => sum + (s.quality || 0), 0) /
        (searches.filter((s) => s.quality !== undefined).length || 1);

    const avgExecutionTime =
      searches.reduce((sum, s) => sum + s.executionTimeMs, 0) /
      (searches.length || 1);

    const totalTokens = searches.reduce((sum, s) => sum + s.tokensUsed, 0);

    const approvalRate =
      (searches.filter((s) => s.userApproved).length / (searches.length || 1)) *
      100;

    // Model distribution
    const modelDistribution: Record<string, number> = {};
    for (const search of searches) {
      modelDistribution[search.modelUsed] =
        (modelDistribution[search.modelUsed] || 0) + 1;
    }

    return {
      totalSearches,
      avgQuality,
      avgExecutionTime,
      totalTokens,
      approvalRate,
      modelDistribution,
    };
  },
});
