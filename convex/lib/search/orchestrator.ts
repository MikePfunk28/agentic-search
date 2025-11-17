"use node"

/**
 * Search Orchestrator
 * Integrates query segmentation, reasoning, document indexing, and OCR into unified pipeline
 */

import { action } from '../../_generated/server'
import { v } from 'convex/values'
import { internal } from '../../_generated/api'

export interface SearchRequest {
  userId: string
  query: string
  modelConfig: {
    provider: string
    modelId: string
    apiKey?: string
    baseURL?: string
  }
  options: {
    useSegmentation?: boolean
    useReasoning?: boolean
    includeDocuments?: boolean
    processOCR?: boolean
    maxSteps?: number
    compressionEnabled?: boolean
  }
}

export interface SearchResult {
  query: string
  answer: string
  confidence: number
  sources: Array<{
    title: string
    url: string
    snippet: string
    confidence: number
  }>
  // Segmentation details (if used)
  segmentation?: {
    segments: any[]
    executionTimeMs: number
    tokensUsed: number
  }
  // Reasoning details (if used)
  reasoning?: {
    steps: any[]
    totalSteps: number
    totalTokensUsed: number
    compressionRatio: number
  }
  // Document details (if included)
  documents?: {
    chunks: any[]
    knowledgeBoundaries: any[]
    ocrProcessed: number
  }
  // Performance metrics
  metrics: {
    totalExecutionTimeMs: number
    totalTokensUsed: number
    compressionRatio: number
    cacheHits: number
  }
}

/**
 * Orchestrated search - full pipeline
 */
export const orchestratedSearch = action({
  args: {
    userId: v.string(),
    query: v.string(),
    modelConfig: v.any(), // Using v.any() to avoid type instantiation depth errors
    options: v.optional(v.any()), // Using v.any() to avoid type instantiation depth errors
  },
  handler: async (ctx, args): Promise<SearchResult> => {
    const startTime = Date.now()
    const options = args.options || {}

    console.log('[SearchOrchestrator] Starting orchestrated search:', args.query)
    console.log('[SearchOrchestrator] Options:', options)

    let totalTokensUsed = 0
    let compressionRatio = 1.0
    let cacheHits = 0

    // Determine search strategy based on query complexity
    const strategy = await determineSearchStrategy(args.query, options)

    console.log('[SearchOrchestrator] Strategy:', strategy)

    let result: SearchResult

    switch (strategy) {
      case 'simple':
        result = await simpleSearch(ctx, args, startTime)
        break

      case 'segmented':
        result = await segmentedSearch(ctx, args, startTime)
        break

      case 'reasoning':
        result = await reasoningSearch(ctx, args, startTime)
        break

      case 'comprehensive':
      default:
        result = await comprehensiveSearch(ctx, args, startTime)
        break
    }

    console.log('[SearchOrchestrator] Completed in', Date.now() - startTime, 'ms')

    return result
  },
})

/**
 * Determine optimal search strategy
 */
async function determineSearchStrategy(
  query: string,
  options: SearchRequest['options']
): Promise<'simple' | 'segmented' | 'reasoning' | 'comprehensive'> {
  const queryLength = query.split(' ').length

  // Force comprehensive if explicitly requested
  if (options.useReasoning && options.useSegmentation && options.includeDocuments) {
    return 'comprehensive'
  }

  // Use reasoning for complex multi-part queries
  if (options.useReasoning || queryLength > 20) {
    return 'reasoning'
  }

  // Use segmentation for medium complexity
  if (options.useSegmentation || queryLength > 10) {
    return 'segmented'
  }

  // Simple search for short queries
  return 'simple'
}

/**
 * Simple search - direct LLM query
 */
async function simpleSearch(ctx: any, args: any, startTime: number): Promise<SearchResult> {
  const model = await createSearchModel(args.modelConfig)
  const { generateText } = await import('ai')

  const { text, usage } = await generateText({
    model: model as any,
    prompt: `Answer this query concisely and accurately:\n\n"${args.query}"\n\nProvide sources if available.`,
    temperature: 0.3,
  })

  return {
    query: args.query,
    answer: text,
    confidence: 0.8,
    sources: [],
    metrics: {
      totalExecutionTimeMs: Date.now() - startTime,
      totalTokensUsed: usage?.totalTokens || 0,
      compressionRatio: 1.0,
      cacheHits: 0,
    },
  }
}

/**
 * Segmented search - query segmentation + parallel execution
 */
async function segmentedSearch(ctx: any, args: any, startTime: number): Promise<SearchResult> {
  console.log('[SearchOrchestrator] Using segmented search')

  // Segment query
  const segmentation = await ctx.runAction((internal as any)["lib/search/querySegmentationActions"].segmentQuery, {
    userId: args.userId,
    queryText: args.query,
    modelConfig: args.modelConfig,
    useCache: true,
  })

  // Execute segments
  const segmentResults = await ctx.runAction((internal as any)["lib/search/segmentExecutorActions"].executeSegmentsParallel, {
    userId: args.userId,
    queryId: segmentation.queryHash,
    segments: segmentation.segments,
    executionGraph: segmentation.executionGraph,
    modelConfig: args.modelConfig,
  })

  // Synthesize answer
  const model = await createSearchModel(args.modelConfig)
  const { generateText } = await import('ai')

  const findingsText = segmentResults
      .map((r: any) => `${r.segmentId}: ${JSON.stringify(r.findings)}`)
    .join('\n')

  const { text: answer, usage } = await generateText({
    model: model as any,
    prompt: `Synthesize a comprehensive answer from these segment results:

Query: "${args.query}"

Segment Results:
${findingsText}

Provide a clear, accurate answer with sources.`,
    temperature: 0.3,
  })

  const totalTokens = segmentation.estimatedTotalTokens + (usage?.totalTokens || 0)

  return {
    query: args.query,
    answer,
    confidence: 0.85,
    sources: segmentResults.flatMap((r: any) =>
      r.findings.sources.map((s: string) => ({
        title: s,
        url: s,
        snippet: '',
        confidence: r.confidence,
      }))
    ),
    segmentation: {
      segments: segmentation.segments,
      executionTimeMs: segmentResults.reduce((sum: number, r: any) => sum + r.executionTimeMs, 0),
      tokensUsed: totalTokens,
    },
    metrics: {
      totalExecutionTimeMs: Date.now() - startTime,
      totalTokensUsed: totalTokens,
      compressionRatio: segmentation.cached ? 1.5 : 1.0,
      cacheHits: segmentation.cached ? 1 : 0,
    },
  }
}

/**
 * Reasoning search - interleaved reasoning
 */
async function reasoningSearch(ctx: any, args: any, startTime: number): Promise<SearchResult> {
  console.log('[SearchOrchestrator] Using reasoning search')

  const session = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].startReasoningSession, {
    userId: args.userId,
    query: args.query,
    modelConfig: args.modelConfig,
    maxSteps: args.options?.maxSteps || 10,
    compressionEnabled: args.options?.compressionEnabled !== false,
  })

  // Continue reasoning until complete
  let currentSession = session
  const maxSteps = args.options?.maxSteps || 10

  for (let i = 1; i < maxSteps; i++) {
    if (currentSession.status !== 'active') break

    const result = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].continueReasoning, {
      sessionId: currentSession.sessionId,
      modelConfig: args.modelConfig,
      maxSteps,
    })

    if (result.complete) {
      currentSession = result.session
      break
    }

    currentSession = result.session
  }

  // Finalize if not already done
  if (!currentSession.finalAnswer) {
    const finalResult = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].finalizeSession, {
      sessionId: currentSession.sessionId,
      modelConfig: args.modelConfig,
    })
    currentSession = finalResult.session
  }

  return {
    query: args.query,
    answer: currentSession.finalAnswer || 'Unable to complete reasoning',
    confidence: 0.9,
    sources: [],
    reasoning: {
      steps: currentSession.steps,
      totalSteps: currentSession.steps.length,
      totalTokensUsed: currentSession.totalTokensUsed,
      compressionRatio: currentSession.compressionRatio,
    },
    metrics: {
      totalExecutionTimeMs: Date.now() - startTime,
      totalTokensUsed: currentSession.totalTokensUsed,
      compressionRatio: currentSession.compressionRatio,
      cacheHits: 0,
    },
  }
}

/**
 * Comprehensive search - all features combined
 */
async function comprehensiveSearch(ctx: any, args: any, startTime: number): Promise<SearchResult> {
  console.log('[SearchOrchestrator] Using comprehensive search')

  // Step 1: Check if query mentions documents
  const mentionsDocuments =
    args.query.toLowerCase().includes('document') ||
    args.query.toLowerCase().includes('pdf') ||
    args.query.toLowerCase().includes('paper') ||
    args.query.toLowerCase().includes('article')

  let documentChunks: any[] = []
  let knowledgeBoundaries: any[] = []
  let ocrProcessed = 0

  // Step 2: Process documents if relevant
  if ((mentionsDocuments || args.options?.includeDocuments) && args.options?.processOCR) {
    console.log('[SearchOrchestrator] Processing documents with OCR')

    // Search for relevant documents
    const chunks = await ctx.runAction((internal as any)["lib/indexing/documentIndexing"].searchDocuments, {
      userId: args.userId,
      query: args.query,
      limit: 5,
    })

    documentChunks = chunks
    ocrProcessed = chunks.length

    // Get knowledge boundaries
    const boundaries = await ctx.runQuery((internal as any)["lib/indexing/documentIndexing"].getKnowledgeBoundaries, {
      userId: args.userId,
    })

    knowledgeBoundaries = boundaries
  }

  // Step 3: Segment query
  const segmentation = await ctx.runAction((internal as any)["lib/search/querySegmentationActions"].segmentQuery, {
    userId: args.userId,
    queryText: args.query,
    modelConfig: args.modelConfig,
    useCache: true,
  })

  // Step 4: Use reasoning for complex synthesis
  const session = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].startReasoningSession, {
    userId: args.userId,
    query: args.query,
    modelConfig: args.modelConfig,
    maxSteps: args.options?.maxSteps || 10,
    compressionEnabled: args.options?.compressionEnabled !== false,
  })

  // Continue reasoning
  let currentSession = session
  for (let i = 1; i < (args.options?.maxSteps || 10); i++) {
    if (currentSession.status !== 'active') break

    const result = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].continueReasoning, {
      sessionId: currentSession.sessionId,
      modelConfig: args.modelConfig,
      maxSteps: args.options?.maxSteps || 10,
    })

    if (result.complete) {
      currentSession = result.session
      break
    }

    currentSession = result.session
  }

  // Finalize
  if (!currentSession.finalAnswer) {
    const finalResult = await ctx.runAction((internal as any)["lib/reasoning/interleavedReasoningActions"].finalizeSession, {
      sessionId: currentSession.sessionId,
      modelConfig: args.modelConfig,
    })
    currentSession = finalResult.session
  }

  return {
    query: args.query,
    answer: currentSession.finalAnswer || 'Unable to complete search',
    confidence: 0.95,
    sources: [],
    segmentation: {
      segments: segmentation.segments,
      executionTimeMs: 0,
      tokensUsed: segmentation.estimatedTotalTokens,
    },
    reasoning: {
      steps: currentSession.steps,
      totalSteps: currentSession.steps.length,
      totalTokensUsed: currentSession.totalTokensUsed,
      compressionRatio: currentSession.compressionRatio,
    },
    documents: {
      chunks: documentChunks,
      knowledgeBoundaries,
      ocrProcessed,
    },
    metrics: {
      totalExecutionTimeMs: Date.now() - startTime,
      totalTokensUsed: segmentation.estimatedTotalTokens + currentSession.totalTokensUsed,
      compressionRatio: currentSession.compressionRatio,
      cacheHits: segmentation.cached ? 1 : 0,
    },
  }
}

/**
 * Create AI model for search
 */
async function createSearchModel(config: {
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



