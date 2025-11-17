/**
 * Search API - Public Convex Functions
 * Exposes query segmentation and execution to the client
 */

import { action, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'

/**
 * Segment a user query into executable sub-segments
 * This is the main entry point for agentic search
 */
export const segmentQuery: any = action({
  args: {
    userId: v.string(),
    queryText: v.string(),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    useCache: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.runAction((internal as any)["lib/search/querySegmentationActions"].segmentQuery, args)
  },
})

/**
 * Execute all segments in parallel according to execution graph
 */
export const executeSearch: any = action({
  args: {
    userId: v.string(),
    queryId: v.string(),
    segments: v.array(v.any()),
    executionGraph: v.object({
      stages: v.number(),
      parallelizable: v.array(v.array(v.string())),
      sequential: v.array(v.string()),
    }),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.runAction((internal as any)["lib/search/segmentExecutorActions"].executeSegmentsParallel, args)
  },
})

/**
 * Complete agentic search workflow: segment + execute + synthesize
 */
export const agenticSearch: any = action({
  args: {
    userId: v.string(),
    queryText: v.string(),
    modelConfig: v.object({
      provider: v.string(),
      modelId: v.string(),
      apiKey: v.optional(v.string()),
      baseURL: v.optional(v.string()),
    }),
    useCache: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Step 1: Segment the query
    console.log('[AgenticSearch] Segmenting query:', args.queryText)
    const segmentation: any = await ctx.runAction((internal as any)["lib/search/querySegmentationActions"].segmentQuery, {
      userId: args.userId,
      queryText: args.queryText,
      modelConfig: args.modelConfig,
      useCache: args.useCache,
    })

    // Step 2: Execute segments in parallel
    console.log(`[AgenticSearch] Executing ${segmentation.segments.length} segments in ${segmentation.executionGraph.stages} stages`)
    const results: any = await ctx.runAction((internal as any)["lib/search/segmentExecutorActions"].executeSegmentsParallel, {
      userId: args.userId,
      queryId: segmentation.queryHash,
      segments: segmentation.segments,
      executionGraph: segmentation.executionGraph,
      modelConfig: args.modelConfig,
    })

    // Step 3: Synthesize final answer
    console.log('[AgenticSearch] Synthesizing final answer from', results.length, 'segment results')
    const finalAnswer = await synthesizeResults(results, args.queryText, args.modelConfig)

    // Step 4: Store in search history
    await ctx.runMutation(internal.search.storeSearchHistory, {
      userId: args.userId,
      query: args.queryText,
      modelUsed: args.modelConfig.modelId,
      results: finalAnswer.sources,
      segmentCount: segmentation.segments.length,
      segments: segmentation.segments,
      executionTimeMs: results.reduce((sum: number, r: any) => sum + r.executionTimeMs, 0),
      tokensUsed: results.reduce((sum: number, r: any) => sum + r.tokensUsed, 0),
      quality: finalAnswer.confidence,
    })

    return {
      segmentation,
      segmentResults: results,
      finalAnswer,
    }
  },
})

/**
 * Synthesize final answer from segment results
 */
async function synthesizeResults(
  results: any[],
  originalQuery: string,
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string }
) {
  const { createAnthropic } = await import('@ai-sdk/anthropic')
  const { createOpenAI } = await import('@ai-sdk/openai')
  const { createGoogleGenerativeAI } = await import('@ai-sdk/google')
  const { createOpenAICompatible } = await import('@ai-sdk/openai-compatible')
  const { createOllama } = await import('ollama-ai-provider')
  const { generateText } = await import('ai')

  // Create model
  let model
  switch (modelConfig.provider) {
    case 'ollama': {
      const ollamaBaseUrl = (modelConfig.baseURL || 'http://localhost:11434/v1').replace('/v1', '')
      const ollamaProvider = createOllama({ baseURL: ollamaBaseUrl })
      model = ollamaProvider(modelConfig.modelId)
      break
    }
    case 'lmstudio': {
      const lmstudio = createOpenAI({
        baseURL: modelConfig.baseURL || 'http://localhost:1234/v1',
        apiKey: 'lmstudio',
      })
      model = lmstudio(modelConfig.modelId)
      break
    }
    case 'openai': {
      if (!modelConfig.apiKey) throw new Error('OpenAI API key required')
      const openai = createOpenAI({ apiKey: modelConfig.apiKey, baseURL: modelConfig.baseURL })
      model = openai(modelConfig.modelId)
      break
    }
    case 'anthropic': {
      if (!modelConfig.apiKey) throw new Error('Anthropic API key required')
      const anthropic = createAnthropic({ apiKey: modelConfig.apiKey })
      model = anthropic(modelConfig.modelId)
      break
    }
    case 'google': {
      if (!modelConfig.apiKey) throw new Error('Google API key required')
      const google = createGoogleGenerativeAI({ apiKey: modelConfig.apiKey })
      model = google(modelConfig.modelId)
      break
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
      const provider = createOpenAICompatible({
        name: modelConfig.provider,
        apiKey: modelConfig.apiKey || modelConfig.provider,
        baseURL: modelConfig.baseURL || baseURLs[modelConfig.provider],
      })
      model = provider(modelConfig.modelId)
    }
  }

  // Gather all findings
  const allFindings = results.map((r) => ({
    segmentId: r.segmentId,
    findings: r.findings,
    confidence: r.confidence,
  }))

  const { text, usage } = await generateText({
    model: model as any,
    prompt: `You are synthesizing results from a multi-segment agentic search.

Original Query: "${originalQuery}"

Segment Results:
${JSON.stringify(allFindings, null, 2)}

Synthesize a comprehensive, accurate answer that:
1. Directly addresses the user's query
2. Combines information from all segments coherently
3. Cites specific sources when possible
4. Acknowledges any limitations or uncertainties

Format your response as JSON:
{
  "answer": "comprehensive answer text",
  "confidence": 0.85,
  "sources": [
    {"title": "source1", "url": "url1", "snippet": "relevant info"},
    {"title": "source2", "url": "url2", "snippet": "relevant info"}
  ],
  "keyPoints": ["point1", "point2", "point3"]
}`,
    temperature: 0.3,
  })

  try {
    return JSON.parse(text)
  } catch (error) {
    return {
      answer: text,
      confidence: 0.7,
      sources: [],
      keyPoints: [text],
    }
  }
}

/**
 * Store search history (internal mutation)
 */
export const storeSearchHistory = internalMutation({
  args: {
    userId: v.string(),
    query: v.string(),
    modelUsed: v.string(),
    results: v.array(v.any()),
    segmentCount: v.optional(v.number()),
    segments: v.optional(v.array(v.any())),
    executionTimeMs: v.number(),
    tokensUsed: v.number(),
    quality: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('searchHistory', {
      userId: args.userId,
      query: args.query,
      modelUsed: args.modelUsed,
      results: args.results,
      segmentCount: args.segmentCount,
      segments: args.segments,
      executionTimeMs: args.executionTimeMs,
      tokensUsed: args.tokensUsed,
      quality: args.quality,
      userApproved: undefined,
      userModifications: undefined,
      createdAt: Date.now(),
    })
  },
})



