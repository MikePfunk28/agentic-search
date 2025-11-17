/**
 * Query Segmentation Queries and Mutations - Standard Runtime
 * All queries and mutations that don't use Node.js APIs
 */

import { internalMutation, query } from '../../_generated/server'
import { v } from 'convex/values'

/**
 * Get cached segmentation
 */
export const getCachedSegmentation = query({
  args: {
    userId: v.string(),
    queryHash: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const cached = await ctx.db
      .query('querySegmentations')
      .withIndex('by_user_hash', (q) => q.eq('userId', args.userId).eq('queryHash', args.queryHash))
      .filter((q) => q.gt(q.field('expiresAt'), now))
      .first()

    if (!cached) return null

    // Note: Cannot update usage count in query - would need separate mutation

    return {
      queryHash: cached.queryHash,
      segments: cached.segments.map((seg) => ({
        ...seg,
        assignedTool: 'fetch' as const, // Type assertion for compatibility
        toolReasoning: 'Cached from previous segmentation',
      })),
      executionGraph: {
        stages: cached.executionGraphStages,
        parallelizable: [],
        sequential: [],
      },
      estimatedTotalTokens: cached.segments.reduce((sum, seg) => sum + seg.estimatedTokens, 0),
      estimatedTimeMs: 0,
      cached: true,
    }
  },
})

/**
 * Store segmentation in cache
 */
export const storeSegmentation = internalMutation({
  args: {
    userId: v.string(),
    queryText: v.string(),
    queryHash: v.string(),
    result: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const expiresAt = now + 5 * 60 * 1000 // 5 minutes

    await ctx.db.insert('querySegmentations', {
      userId: args.userId,
      queryText: args.queryText,
      queryHash: args.queryHash,
      segmentCount: args.result.segments.length,
      segments: args.result.segments,
      executionGraphStages: args.result.executionGraph.stages,
      quality: 1.0, // Initial quality
      usageCount: 1,
      lastUsed: now,
      expiresAt,
      createdAt: now,
    })
  },
})


