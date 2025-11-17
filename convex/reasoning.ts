/**
 * Reasoning API - Public Convex Functions
 * Exposes interleaved reasoning to the client
 */

import { action } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'

/**
 * Start a new interleaved reasoning session
 */
export const startReasoning: any = action({
  args: {
    userId: v.string(),
    query: v.string(),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    maxSteps: v.optional(v.number()),
    compressionEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].startReasoningSession, args)
  },
})

/**
 * Continue an active reasoning session
 */
export const continueReasoning: any = action({
  args: {
    sessionId: v.string(),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    maxSteps: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].continueReasoning, args)
  },
})

/**
 * Complete reasoning workflow: start + auto-continue until done
 */
export const completeReasoning: any = action({
  args: {
    userId: v.string(),
    query: v.string(),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    maxSteps: v.optional(v.number()),
    compressionEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    console.log('[CompleteReasoning] Starting reasoning for:', args.query)

    // Start reasoning session
    let session: any = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].startReasoningSession, {
      userId: args.userId,
      query: args.query,
      modelConfig: args.modelConfig,
      maxSteps: args.maxSteps,
      compressionEnabled: args.compressionEnabled,
    })

    const maxSteps = args.maxSteps || 10

    // Continue until completion or max steps
    let iterations = 0
    while (session.status === 'active' && iterations < maxSteps) {
      console.log(`[CompleteReasoning] Step ${iterations + 1}/${maxSteps}`)

      const result = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].continueReasoning, {
        sessionId: session.sessionId,
        modelConfig: args.modelConfig,
        maxSteps,
      })

      if (result.complete) {
        session = result.session
        break
      }

      session = result.session
      iterations++
    }

    console.log('[CompleteReasoning] Completed with', session.steps.length, 'steps')

    return session
  },
})


