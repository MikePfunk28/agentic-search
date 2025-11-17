/**
 * Indexing API - Public Convex Functions
 * Exposes document indexing and knowledge boundary detection
 */

import { action, query } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'

/**
 * Index a document with semantic chunking and boundary detection
 */
export const indexDocument = action({
  args: {
    userId: v.string(),
    documentUrl: v.string(),
    documentName: v.string(),
    sourceType: v.union(
      v.literal('pdf'),
      v.literal('docx'),
      v.literal('txt'),
      v.literal('md'),
      v.literal('url')
    ),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    generateEmbeddings: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<any> => {
    return await ctx.runAction((internal as any)["lib/indexing/documentIndexing"].indexDocument, args)
  },
}) as any

/**
 * Search indexed documents
 */
export const searchDocuments = action({
  args: {
    userId: v.string(),
    query: v.string(),
    domain: v.optional(v.string()),
    topic: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<any> => {
    return await ctx.runAction((internal as any)["lib/indexing/documentIndexing"].searchDocuments, args)
  },
}) as any

/**
 * Get knowledge boundaries for user's documents
 */
export const getKnowledgeBoundaries = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    return await ctx.runQuery((internal as any)["lib/indexing/documentIndexing"].getKnowledgeBoundaries, args)
  },
}) as any

/**
 * Batch index multiple documents
 */
export const batchIndexDocuments = action({
  args: {
    userId: v.string(),
    documents: v.array(
      v.object({
        documentUrl: v.string(),
        documentName: v.string(),
        sourceType: v.union(
          v.literal('pdf'),
          v.literal('docx'),
          v.literal('txt'),
          v.literal('md'),
          v.literal('url')
        ),
      })
    ),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    generateEmbeddings: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<any> => {
    console.log(`[BatchIndexing] Indexing ${args.documents.length} documents`)

    const results: any[] = await Promise.all(
      args.documents.map((doc) =>
        ctx.runAction((internal as any)["lib/indexing/documentIndexing"].indexDocument, {
          userId: args.userId,
          documentUrl: doc.documentUrl,
          documentName: doc.documentName,
          sourceType: doc.sourceType,
          modelConfig: args.modelConfig,
          generateEmbeddings: args.generateEmbeddings,
        })
      )
    )

    return {
      totalDocuments: args.documents.length,
      totalChunks: results.reduce((sum: number, r: any) => sum + r.chunkCount, 0),
      totalTokens: results.reduce((sum: number, r: any) => sum + r.totalTokens, 0),
      results,
    }
  },
}) as any



