/**
 * RAG Knowledge Base — Convex mutations & queries
 * CRUD for knowledge bases, chunk ingestion, text search, and analytics logging.
 */

import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

async function requireAuthenticatedUserId(ctx: any, providedUserId?: string) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized: Authentication required");
  }
  if (providedUserId && providedUserId !== userId) {
    throw new Error("Unauthorized: userId does not match authenticated user");
  }
  return userId;
}

async function requireKnowledgeBaseForUser(
  ctx: any,
  knowledgeBaseId: any,
  userId: string,
) {
  const knowledgeBase = await ctx.db.get(knowledgeBaseId);
  if (!knowledgeBase || knowledgeBase.userId !== userId) {
    throw new Error("Unauthorized: knowledge base does not belong to the authenticated user");
  }
  return knowledgeBase;
}

// ── Knowledge Base CRUD ─────────────────────────────────────────────────

export const createKnowledgeBase = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    ragLevel: v.union(v.literal("minimal"), v.literal("medium"), v.literal("full")),
    embeddingModel: v.optional(v.string()),
    embeddingProvider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    const now = Date.now();
    return await ctx.db.insert("ragKnowledgeBases", {
      userId,
      name: args.name,
      description: args.description,
      ragLevel: args.ragLevel,
      documentCount: 0,
      totalChunks: 0,
      totalTokens: 0,
      embeddingModel: args.embeddingModel,
      embeddingProvider: args.embeddingProvider,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listKnowledgeBases = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    return await ctx.db
      .query("ragKnowledgeBases")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getActiveKnowledgeBase = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    return await ctx.db
      .query("ragKnowledgeBases")
      .withIndex("by_user_active", (q) => q.eq("userId", userId).eq("isActive", true))
      .first();
  },
});

export const toggleKnowledgeBase = mutation({
  args: { id: v.id("ragKnowledgeBases"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    await requireKnowledgeBaseForUser(ctx, args.id, userId);
    await ctx.db.patch(args.id, { isActive: args.isActive, updatedAt: Date.now() });
  },
});

export const deleteKnowledgeBase = mutation({
  args: { id: v.id("ragKnowledgeBases") },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    await requireKnowledgeBaseForUser(ctx, args.id, userId);
    // Delete all chunks belonging to this KB
    const chunks = await ctx.db
      .query("ragChunks")
      .withIndex("by_knowledge_base", (q) => q.eq("knowledgeBaseId", args.id))
      .collect();
    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
    // Delete crawl jobs
    const jobs = await ctx.db
      .query("ragCrawlJobs")
      .withIndex("by_knowledge_base", (q) => q.eq("knowledgeBaseId", args.id))
      .collect();
    for (const job of jobs) {
      await ctx.db.delete(job._id);
    }
    await ctx.db.delete(args.id);
  },
});

// ── Chunk Storage ───────────────────────────────────────────────────────

export const storeChunks = mutation({
  args: {
    userId: v.string(),
    knowledgeBaseId: v.id("ragKnowledgeBases"),
    documentId: v.id("documents"),
    chunks: v.array(
      v.object({
        text: v.string(),
        chunkIndex: v.number(),
        tokenCount: v.number(),
        page: v.optional(v.number()),
        embedding: v.optional(v.array(v.number())),
        domain: v.optional(v.string()),
        topic: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    await requireKnowledgeBaseForUser(ctx, args.knowledgeBaseId, userId);
    const document = await ctx.db.get(args.documentId);
    if (document && "userId" in document && document.userId !== userId) {
      throw new Error("Unauthorized: document does not belong to the authenticated user");
    }
    const now = Date.now();
    const ids: string[] = [];

    for (const chunk of args.chunks) {
      const id = await ctx.db.insert("ragChunks", {
        userId,
        knowledgeBaseId: args.knowledgeBaseId,
        documentId: args.documentId,
        text: chunk.text,
        chunkIndex: chunk.chunkIndex,
        tokenCount: chunk.tokenCount,
        page: chunk.page,
        embedding: chunk.embedding,
        domain: chunk.domain,
        topic: chunk.topic,
        relatedChunkIds: undefined,
        createdAt: now,
      });
      ids.push(id);
    }

    // Update KB stats
    const kb = await ctx.db.get(args.knowledgeBaseId);
    if (kb) {
      const totalTokens = args.chunks.reduce((s, c) => s + c.tokenCount, 0);
      await ctx.db.patch(args.knowledgeBaseId, {
        totalChunks: kb.totalChunks + args.chunks.length,
        totalTokens: kb.totalTokens + totalTokens,
        documentCount: kb.documentCount + 1,
        updatedAt: now,
      });
    }

    return ids;
  },
});

// ── Text Search (BM25 via Convex search index) ─────────────────────────

export const searchChunks = query({
  args: {
    userId: v.string(),
    knowledgeBaseId: v.optional(v.id("ragKnowledgeBases")),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    const limit = args.limit ?? 20;

    if (args.knowledgeBaseId) {
      await requireKnowledgeBaseForUser(ctx, args.knowledgeBaseId, userId);
      return await ctx.db
        .query("ragChunks")
        .withSearchIndex("search_text", (q) =>
          q.search("text", args.query).eq("knowledgeBaseId", args.knowledgeBaseId!),
        )
        .take(limit);
    }

    // Search across all of this user's chunks
    return await ctx.db
      .query("ragChunks")
      .withSearchIndex("search_text", (q) =>
        q.search("text", args.query).eq("userId", userId),
      )
      .take(limit);
  },
});

// ── Get chunks with embeddings (for vector re-ranking client-side) ──────

export const getChunksWithEmbeddings = query({
  args: {
    userId: v.string(),
    knowledgeBaseId: v.id("ragKnowledgeBases"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    await requireKnowledgeBaseForUser(ctx, args.knowledgeBaseId, userId);
    return await ctx.db
      .query("ragChunks")
      .withIndex("by_knowledge_base", (q) => q.eq("knowledgeBaseId", args.knowledgeBaseId))
      .collect();
  },
});

// ── Analytics Logging ───────────────────────────────────────────────────

export const logRagAnalytics = mutation({
  args: {
    userId: v.string(),
    searchHistoryId: v.optional(v.id("searchHistory")),
    query: v.string(),
    ragLevel: v.union(
      v.literal("none"),
      v.literal("minimal"),
      v.literal("medium"),
      v.literal("full"),
    ),
    ragResultCount: v.number(),
    webResultCount: v.number(),
    mergedResultCount: v.number(),
    addScoreRag: v.optional(v.number()),
    addScoreWeb: v.optional(v.number()),
    addScoreMerged: v.number(),
    ragLatencyMs: v.number(),
    webLatencyMs: v.number(),
    totalLatencyMs: v.number(),
    ragTokensUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    return await ctx.db.insert("ragAnalytics", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const rateRagResult = mutation({
  args: {
    id: v.id("ragAnalytics"),
    userRating: v.number(),
    userPreferredSource: v.optional(
      v.union(v.literal("rag"), v.literal("web"), v.literal("merged")),
    ),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const analytics = await ctx.db.get(args.id);
    if (!analytics || analytics.userId !== userId) {
      throw new Error("Unauthorized: analytics record does not belong to the authenticated user");
    }
    await ctx.db.patch(args.id, {
      userRating: args.userRating,
      userPreferredSource: args.userPreferredSource,
      feedback: args.feedback,
    });
  },
});

export const getRagAnalyticsSummary = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    const events = await ctx.db
      .query("ragAnalytics")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);

    if (events.length === 0) {
      return {
        totalSearches: 0,
        byLevel: {} as Record<string, { count: number; avgAddScore: number; avgLatency: number; avgRating: number }>,
        avgRating: 0,
        preferredSource: null as string | null,
      };
    }

    const byLevel: Record<string, { count: number; totalAdd: number; totalLatency: number; totalRating: number; ratedCount: number }> = {};
    let totalRating = 0;
    let ratedCount = 0;
    const sourceCounts: Record<string, number> = {};

    for (const e of events) {
      if (!byLevel[e.ragLevel]) {
        byLevel[e.ragLevel] = { count: 0, totalAdd: 0, totalLatency: 0, totalRating: 0, ratedCount: 0 };
      }
      const lvl = byLevel[e.ragLevel];
      lvl.count++;
      lvl.totalAdd += e.addScoreMerged;
      lvl.totalLatency += e.totalLatencyMs;
      if (e.userRating) {
        lvl.totalRating += e.userRating;
        lvl.ratedCount++;
        totalRating += e.userRating;
        ratedCount++;
      }
      if (e.userPreferredSource) {
        sourceCounts[e.userPreferredSource] = (sourceCounts[e.userPreferredSource] || 0) + 1;
      }
    }

    const summary: Record<string, { count: number; avgAddScore: number; avgLatency: number; avgRating: number }> = {};
    for (const [level, data] of Object.entries(byLevel)) {
      summary[level] = {
        count: data.count,
        avgAddScore: data.totalAdd / data.count,
        avgLatency: data.totalLatency / data.count,
        avgRating: data.ratedCount > 0 ? data.totalRating / data.ratedCount : 0,
      };
    }

    const preferredSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      totalSearches: events.length,
      byLevel: summary,
      avgRating: ratedCount > 0 ? totalRating / ratedCount : 0,
      preferredSource,
    };
  },
});

// ── Crawl Jobs (full RAG) ───────────────────────────────────────────────

export const createCrawlJob = mutation({
  args: {
    userId: v.string(),
    knowledgeBaseId: v.id("ragKnowledgeBases"),
    seedUrl: v.string(),
    depth: v.number(),
    maxPages: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx, args.userId);
    await requireKnowledgeBaseForUser(ctx, args.knowledgeBaseId, userId);
    return await ctx.db.insert("ragCrawlJobs", {
      userId,
      knowledgeBaseId: args.knowledgeBaseId,
      seedUrl: args.seedUrl,
      status: "queued",
      depth: Math.min(args.depth, 3), // cap at 3 levels deep
      maxPages: Math.min(args.maxPages, 50), // cap at 50 pages
      pagesCrawled: 0,
      chunksCreated: 0,
      createdAt: Date.now(),
    });
  },
});

export const listCrawlJobs = query({
  args: { knowledgeBaseId: v.id("ragKnowledgeBases") },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    await requireKnowledgeBaseForUser(ctx, args.knowledgeBaseId, userId);
    return await ctx.db
      .query("ragCrawlJobs")
      .withIndex("by_knowledge_base", (q) => q.eq("knowledgeBaseId", args.knowledgeBaseId))
      .collect();
  },
});
