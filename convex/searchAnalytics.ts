import { action, query, mutation } from './_generated/server'
import { v } from 'convex/values'

// perform a basic web search using the existing provider registry code
export const basicSearch = action({
  args: {
    query: v.string(),
    options: v.optional(
      v.object({
        firecrawl: v.optional(v.string()),
        tavily: v.optional(v.string()),
        exa: v.optional(v.string()),
        brave: v.optional(v.string()),
        limit: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // import lazily so convex functions remain small
    const { executeWebSearch } = await import('../src/lib/search/provider-registry')
    const results = await executeWebSearch(args.query, args.options as any)
    return results
  },
})

// Log analytics entry for a search
export const logSearchAnalytics = mutation({
  args: {
    userId: v.string(),
    query: v.string(),
    providers: v.array(v.string()),
    resultCount: v.number(),
    tokensUsed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('searchAnalytics', {
      userId: args.userId,
      query: args.query,
      providers: args.providers,
      resultCount: args.resultCount,
      tokensUsed: args.tokensUsed || 0,
      createdAt: Date.now(),
    })
  },
})

// Get simple summary for a user
export const getAnalyticsSummary = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query('searchAnalytics')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(200)
    const total = entries.length
    const topQueries: Record<string, number> = {}
    for (const e of entries) {
      topQueries[e.query] = (topQueries[e.query] || 0) + 1
    }
    const top = Object.entries(topQueries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    return { total, top }
  },
})
