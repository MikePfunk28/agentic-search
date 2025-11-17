/**
 * OCR Module - Public API
 * Re-exports from lib/ocr/processDocument.ts
 */

export {
  processDocument,
  storeResult,
  storeError,
  type OCRResult
} from './lib/ocr/processDocument'

import { query } from './_generated/server'
import { v } from 'convex/values'

/**
 * Query: Get OCR result for a document
 */
export const getResult = query({
  args: { documentUrl: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('ocrResults')
      .withIndex('by_url', q => q.eq('documentUrl', args.documentUrl))
      .order('desc')
      .first()

    return result
  }
})

/**
 * Query: Get recent OCR results
 */
export const getRecentResults = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10
    return await ctx.db
      .query('ocrResults')
      .withIndex('by_created')
      .order('desc')
      .take(limit)
  }
})

/**
 * Query: Get OCR statistics
 */
export const getStatistics = query({
  handler: async (ctx) => {
    const results = await ctx.db.query('ocrResults').collect()
    const errors = await ctx.db.query('ocrErrors').collect()

    if (results.length === 0) {
      return {
        totalDocuments: 0,
        totalErrors: errors.length,
        avgTokenSavings: 0,
        avgCompressionRatio: 0,
        avgProcessingTime: 0,
        totalTokensSaved: 0
      }
    }

    const avgTokenSavings = results.reduce((sum, r) => sum + r.tokenSavings, 0) / results.length
    const avgCompressionRatio = results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length
    const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTimeMs, 0) / results.length
    const totalTokensSaved = results.reduce((sum, r) => sum + (r.originalTokens - r.compressedTokens), 0)

    return {
      totalDocuments: results.length,
      totalErrors: errors.length,
      avgTokenSavings: Math.round(avgTokenSavings * 10) / 10,
      avgCompressionRatio: Math.round(avgCompressionRatio * 10) / 10,
      avgProcessingTime: Math.round(avgProcessingTime),
      totalTokensSaved
    }
  }
})

/**
 * Query: Get OCR errors
 */
export const getErrors = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 20
    return await ctx.db
      .query('ocrErrors')
      .withIndex('by_created')
      .order('desc')
      .take(limit)
  }
})


