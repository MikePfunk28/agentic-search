/**
 * Search Orchestrator API - Public Convex Functions
 * Unified search interface with automatic strategy selection
 */

import { action } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'

/**
 * Orchestrated search - automatically selects optimal strategy
 */
export const search: any = action({
  args: {
    userId: v.string(),
    query: v.string(),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    options: v.optional(
      v.object({
        useSegmentation: v.optional(v.boolean()),
        useReasoning: v.optional(v.boolean()),
        includeDocuments: v.optional(v.boolean()),
        processOCR: v.optional(v.boolean()),
        maxSteps: v.optional(v.number()),
        compressionEnabled: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.runAction((internal as any)["lib/search/orchestrator"].orchestratedSearch, args)
  },
})


