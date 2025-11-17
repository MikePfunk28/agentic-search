/**
 * Document Indexing and Knowledge Boundary Detection
 * Builds searchable index from documents with semantic chunking and boundary detection
 */

import { action, internalMutation, internalQuery, query } from '../../_generated/server'
import { v } from 'convex/values'
import { internal } from '../../_generated/api'

export interface DocumentChunk {
  chunkId: string
  documentId: string
  text: string
  embedding?: number[]
  page?: number
  chunkIndex: number
  tokenCount: number
  knowledgeBoundary: {
    domain: string // e.g., "computer science", "mathematics"
    topic: string // e.g., "machine learning", "linear algebra"
    confidence: number
    relatedTopics: string[]
  }
  semanticLinks: string[] // IDs of related chunks
  metadata: {
    extractedAt: number
    compressionRatio?: number
    sourceType: 'pdf' | 'docx' | 'txt' | 'md' | 'url'
  }
}

export interface KnowledgeBoundary {
  domain: string
  topics: string[]
  chunkCount: number
  coverage: number // 0-1 score of how well this domain is covered
  gaps: string[] // Identified knowledge gaps
  confidence: number
}

/**
 * Index a document with semantic chunking and boundary detection
 */
export const indexDocument: any = action({
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
  handler: async (ctx, args) => {
    console.log('[DocumentIndexing] Indexing document:', args.documentName)

    // Step 1: Extract text using OCR (if needed)
    let documentText: string
    let compressionRatio: number | undefined

    if (args.sourceType === 'pdf') {
      const ocrResult: any = await ctx.runAction((internal as any)["lib/ocr/processDocument"].processDocument, {
        documentUrl: args.documentUrl,
        modelConfig: args.modelConfig,
      })
      documentText = ocrResult.compressedMarkdown
      compressionRatio = ocrResult.compressionRatio
    } else {
      // For other types, fetch directly
      const response = await fetch(args.documentUrl)
      documentText = await response.text()
    }

    // Step 2: Semantic chunking
    const chunks = await semanticChunking(documentText, args.modelConfig)

    // Step 3: Knowledge boundary detection for each chunk
    const chunksWithBoundaries = await Promise.all(
      chunks.map(async (chunk, index) => {
        const boundary = await detectKnowledgeBoundary(chunk.text, args.modelConfig)

        return {
          chunkId: `${args.documentName}-chunk-${index}`,
          documentId: args.documentName,
          text: chunk.text,
          page: chunk.page,
          chunkIndex: index,
          tokenCount: estimateTokens(chunk.text),
          knowledgeBoundary: boundary,
          semanticLinks: [], // Will be populated later
          metadata: {
            extractedAt: Date.now(),
            compressionRatio,
            sourceType: args.sourceType,
          },
        } as DocumentChunk
      })
    )

    // Step 4: Generate embeddings if requested
    let chunksWithEmbeddings = chunksWithBoundaries
    if (args.generateEmbeddings) {
      chunksWithEmbeddings = await Promise.all(
        chunksWithBoundaries.map(async (chunk) => {
          const embedding = await generateEmbedding(chunk.text, args.modelConfig)
          return { ...chunk, embedding }
        })
      )
    }

    // Step 5: Detect semantic links between chunks
    const chunksWithLinks = await detectSemanticLinks(chunksWithEmbeddings, args.modelConfig)

    // Step 6: Store in database
    await ctx.runMutation((internal as any)["lib/indexing/documentIndexing"].storeDocumentChunks, {
      userId: args.userId,
      documentName: args.documentName,
      chunks: chunksWithLinks,
    })

    // Step 7: Build knowledge boundary map
    const knowledgeBoundaries = await buildKnowledgeBoundaryMap(chunksWithLinks)

    await ctx.runMutation((internal as any)["lib/indexing/documentIndexing"].storeKnowledgeBoundaries, {
      userId: args.userId,
      documentName: args.documentName,
      boundaries: knowledgeBoundaries,
    })

    return {
      documentName: args.documentName,
      chunkCount: chunksWithLinks.length,
      totalTokens: chunksWithLinks.reduce((sum, c) => sum + c.tokenCount, 0),
      knowledgeBoundaries,
      compressionRatio,
    }
  },
})

/**
 * Semantic chunking - split document into meaningful chunks
 */
async function semanticChunking(
  text: string,
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string }
): Promise<Array<{ text: string; page?: number }>> {
  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0)

  // Combine paragraphs into chunks (max 500 tokens per chunk)
  const chunks: Array<{ text: string; page?: number }> = []
  let currentChunk = ''
  let currentTokens = 0

  for (const paragraph of paragraphs) {
    const paragraphTokens = estimateTokens(paragraph)

    if (currentTokens + paragraphTokens > 500 && currentChunk.length > 0) {
      // Start new chunk
      chunks.push({ text: currentChunk.trim() })
      currentChunk = paragraph
      currentTokens = paragraphTokens
    } else {
      // Add to current chunk
      currentChunk += '\n\n' + paragraph
      currentTokens += paragraphTokens
    }
  }

  // Add final chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({ text: currentChunk.trim() })
  }

  return chunks
}

/**
 * Detect knowledge boundary for a chunk
 */
async function detectKnowledgeBoundary(
  chunkText: string,
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string }
): Promise<DocumentChunk['knowledgeBoundary']> {
  const model = await createIndexingModel(modelConfig)
  const { generateObject, zodSchema } = await import('ai')
  const { z } = await import('zod')

  const { object: boundary } = await generateObject({
    model: model as any,
    schema: zodSchema(z.object({
      domain: z.string(),
      topic: z.string(),
      confidence: z.number(),
      relatedTopics: z.array(z.string()),
    })),
    prompt: `Analyze this text and identify its knowledge domain and topic:

"${chunkText.substring(0, 500)}..."

Determine:
1. Domain: Broad field (e.g., "computer science", "mathematics", "biology")
2. Topic: Specific subject (e.g., "neural networks", "calculus", "genetics")
3. Confidence: How confident are you? (0-1)
4. Related topics: Other topics this relates to

Return as JSON.`,
    temperature: 0.2,
  })

  return boundary
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(
  text: string,
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string }
): Promise<number[]> {
  // Use OpenAI embeddings or similar
  // For now, return placeholder
  // TODO: Integrate with actual embedding API
  return Array(1536).fill(0).map(() => Math.random())
}

/**
 * Detect semantic links between chunks
 */
async function detectSemanticLinks(
  chunks: DocumentChunk[],
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string }
): Promise<DocumentChunk[]> {
  // If embeddings available, use cosine similarity
  if (chunks[0].embedding) {
    return chunks.map((chunk, i) => {
      const links: string[] = []

      chunks.forEach((otherChunk, j) => {
        if (i === j) return

        const similarity = cosineSimilarity(chunk.embedding!, otherChunk.embedding!)
        if (similarity > 0.7) {
          links.push(otherChunk.chunkId)
        }
      })

      return { ...chunk, semanticLinks: links }
    })
  }

  // Otherwise, use topic overlap
  return chunks.map((chunk) => {
    const links: string[] = []

    chunks.forEach((otherChunk) => {
      if (chunk.chunkId === otherChunk.chunkId) return

      // Check if topics overlap
      const topicOverlap =
        chunk.knowledgeBoundary.topic === otherChunk.knowledgeBoundary.topic ||
        chunk.knowledgeBoundary.relatedTopics.includes(otherChunk.knowledgeBoundary.topic)

      if (topicOverlap) {
        links.push(otherChunk.chunkId)
      }
    })

    return { ...chunk, semanticLinks: links }
  })
}

/**
 * Build knowledge boundary map from chunks
 */
async function buildKnowledgeBoundaryMap(chunks: DocumentChunk[]): Promise<KnowledgeBoundary[]> {
  // Group chunks by domain
  const domainMap = new Map<string, DocumentChunk[]>()

  chunks.forEach((chunk) => {
    const domain = chunk.knowledgeBoundary.domain
    if (!domainMap.has(domain)) {
      domainMap.set(domain, [])
    }
    domainMap.get(domain)!.push(chunk)
  })

  // Build boundary for each domain
  const boundaries: KnowledgeBoundary[] = []

  domainMap.forEach((domainChunks, domain) => {
    const topics = [...new Set(domainChunks.map((c) => c.knowledgeBoundary.topic))]
    const avgConfidence =
      domainChunks.reduce((sum, c) => sum + c.knowledgeBoundary.confidence, 0) / domainChunks.length

    // Calculate coverage (ratio of unique topics to expected topics)
    // For now, use a simple heuristic
    const coverage = Math.min(topics.length / 10, 1.0)

    // Identify gaps (topics mentioned but not covered in detail)
    const allRelatedTopics = domainChunks.flatMap((c) => c.knowledgeBoundary.relatedTopics)
    const mentionedTopics = new Set(allRelatedTopics)
    const coveredTopics = new Set(topics)
    const gaps = [...mentionedTopics].filter((t) => !coveredTopics.has(t))

    boundaries.push({
      domain,
      topics,
      chunkCount: domainChunks.length,
      coverage,
      gaps,
      confidence: avgConfidence,
    })
  })

  return boundaries
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Estimate token count (4 chars per token approximation)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Create AI model for indexing
 */
async function createIndexingModel(config: {
  provider: string
  modelId: string
  apiKey?: string
  baseURL?: string
}) {
  const { createAnthropic } = await import('@ai-sdk/anthropic')
  const { createOpenAI } = await import('@ai-sdk/openai')
  const { createGoogleGenerativeAI } = await import('@ai-sdk/google')
  const { createOpenAICompatible } = await import('@ai-sdk/openai-compatible')
  const { createOllama } = await import('ollama-ai-provider')

  switch (config.provider) {
    case 'ollama': {
      const ollamaBaseUrl = (config.baseURL || 'http://localhost:11434/v1').replace('/v1', '')
      return createOllama({ baseURL: ollamaBaseUrl })(config.modelId)
    }
    case 'lmstudio': {
      const lmstudio = createOpenAI({
        baseURL: config.baseURL || 'http://localhost:1234/v1',
        apiKey: 'lmstudio',
      })
      return lmstudio(config.modelId)
    }
    case 'openai': {
      if (!config.apiKey) throw new Error('OpenAI API key required')
      return createOpenAI({ apiKey: config.apiKey, baseURL: config.baseURL })(config.modelId)
    }
    case 'anthropic': {
      if (!config.apiKey) throw new Error('Anthropic API key required')
      return createAnthropic({ apiKey: config.apiKey })(config.modelId)
    }
    case 'google': {
      if (!config.apiKey) throw new Error('Google API key required')
      return createGoogleGenerativeAI({ apiKey: config.apiKey })(config.modelId)
    }
    default: {
      const baseURLs: Record<string, string> = {
        deepseek: 'https://api.deepseek.com/v1',
        moonshot: 'https://api.moonshot.cn/v1',
        kimi: 'https://api.moonshot.cn/v1',
        vllm: 'http://localhost:8000/v1',
        gguf: 'http://localhost:8080/v1',
        onnx: 'http://localhost:8081/v1',
      }
      return createOpenAICompatible({
        name: config.provider,
        apiKey: config.apiKey || config.provider,
        baseURL: config.baseURL || baseURLs[config.provider],
      })(config.modelId)
    }
  }
}

/**
 * Search indexed documents
 */
export const searchDocuments: any = action({
  args: {
    userId: v.string(),
    query: v.string(),
    domain: v.optional(v.string()),
    topic: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get all chunks for user
    const chunks: any = await ctx.runQuery((internal as any)["lib/indexing/documentIndexing"].getDocumentChunks, {
      userId: args.userId,
      domain: args.domain,
      topic: args.topic,
    })

    // Rank chunks by relevance
    // TODO: Use embedding similarity or BM25
    const rankedChunks: any = chunks
      .filter((chunk: any) => {
        const queryLower = args.query.toLowerCase()
        return chunk.text.toLowerCase().includes(queryLower)
      })
      .slice(0, args.limit || 10)

    return rankedChunks
  },
})

/**
 * Get knowledge boundaries for user's documents
 */
export const getKnowledgeBoundaries = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Implement with actual database queries
    return []
  },
})

// Database operations
export const storeDocumentChunks = internalMutation({
  args: {
    userId: v.string(),
    documentName: v.string(),
    chunks: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    console.log(`[DocumentIndexing] Stored ${args.chunks.length} chunks for ${args.documentName}`)
    // TODO: Store in documents table with proper chunk structure
  },
})

export const storeKnowledgeBoundaries = internalMutation({
  args: {
    userId: v.string(),
    documentName: v.string(),
    boundaries: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    console.log(`[DocumentIndexing] Stored ${args.boundaries.length} knowledge boundaries`)
    // TODO: Store in separate knowledge_boundaries table
  },
})

export const getDocumentChunks = internalQuery({
  args: {
    userId: v.string(),
    domain: v.optional(v.string()),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<DocumentChunk[]> => {
    // TODO: Query from database
    return []
  },
})


