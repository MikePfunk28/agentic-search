/**
 * Segment Executor Mutations - Standard Runtime
 * Mutations for storing execution results (cannot use "use node")
 */

import { internalMutation } from '../../_generated/server'
import { v } from 'convex/values'

/**
 * Store segment execution result
 */
export const storeExecution = internalMutation({
  args: {
    userId: v.string(),
    queryId: v.string(),
    segment: v.any(),
    result: v.any(),
    modelUsed: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('segmentExecutions', {
      userId: args.userId,
      queryId: args.queryId,
      segmentId: args.segment.id,
      segmentType: args.segment.type,
      segmentText: args.segment.text,
      modelUsed: args.modelUsed,
      tokensUsed: args.result.tokensUsed,
      executionTimeMs: args.result.executionTimeMs,
      success: args.result.success,
      confidence: args.result.confidence,
      resultsCount: args.result.findings.facts.length,
      findings: args.result.findings,
      wasEscalated: false,
      coordinationEvents: 0,
      createdAt: Date.now(),
    })
  },
})


