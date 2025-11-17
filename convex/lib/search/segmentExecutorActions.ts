"use node"

/**
 * Segment Executor
 * Executes individual query segments using assigned tools
 */

import { action, internalMutation } from '../../_generated/server'
import { v } from 'convex/values'
import { internal } from '../../_generated/api'
import type { QuerySegment } from './querySegmentationTypes'

export interface SegmentExecutionResult {
  segmentId: string
  success: boolean
  confidence: number
  executionTimeMs: number
  tokensUsed: number
  findings: {
    entities: Record<string, any>
    facts: string[]
    sources: string[]
  }
  rawOutput: string
  error?: string
}

/**
 * Execute a single segment with its assigned tool
 */
export const executeSegment = action({
  args: {
    userId: v.string(),
    queryId: v.string(),
    segment: v.any(), // Using v.any() to avoid type instantiation depth errors
    modelConfig: v.any(), // Using v.any() to avoid type instantiation depth errors
    contextFromDependencies: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args): Promise<SegmentExecutionResult> => {
    const startTime = Date.now()

    try {
      console.log(`[SegmentExecutor] Executing segment ${args.segment.id} with tool ${args.segment.assignedTool}`)

      let result: SegmentExecutionResult

      switch (args.segment.assignedTool) {
        case 'fetch':
          result = await executeWithFetch(args.segment, args.modelConfig, args.contextFromDependencies)
          break

        case 'xmlhttp':
          result = await executeWithXMLHTTP(args.segment, args.modelConfig, args.contextFromDependencies)
          break

        case 'code_exec':
          result = await executeWithCodeExec(args.segment, args.modelConfig, args.contextFromDependencies)
          break

        case 'mcp':
          result = await executeWithMCP(args.segment, args.modelConfig, args.contextFromDependencies)
          break

        case 'ocr':
          result = await executeWithOCR(args.segment, args.modelConfig, args.contextFromDependencies)
          break

        default:
          throw new Error(`Unknown tool: ${args.segment.assignedTool}`)
      }

      // Store execution result
      await ctx.runMutation((internal as any)["lib/search/segmentExecutorMutations"].storeExecution, {
        userId: args.userId,
        queryId: args.queryId,
        segment: args.segment,
        result,
        modelUsed: args.modelConfig.modelId,
      })

      return result
    } catch (error: any) {
      const executionTimeMs = Date.now() - startTime

      const errorResult: SegmentExecutionResult = {
        segmentId: args.segment.id,
        success: false,
        confidence: 0,
        executionTimeMs,
        tokensUsed: 0,
        findings: { entities: {}, facts: [], sources: [] },
        rawOutput: '',
        error: error.message,
      }

      // Store failed execution
      await ctx.runMutation((internal as any)["lib/search/segmentExecutorMutations"].storeExecution, {
        userId: args.userId,
        queryId: args.queryId,
        segment: args.segment,
        result: errorResult,
        modelUsed: args.modelConfig.modelId,
      })

      return errorResult
    }
  },
})

/**
 * Execute segment using fetch API (web search)
 */
async function executeWithFetch(
  segment: { id: string; text: string; type: string },
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string },
  context?: any[]
): Promise<SegmentExecutionResult> {
  const startTime = Date.now()

  // Build search query
  let searchQuery = segment.text
  if (context && context.length > 0) {
    const contextText = context.map((c) => c.rawOutput).join(' ')
    searchQuery = `${contextText} ${segment.text}`
  }

  // For now, use a simple web search (can be enhanced with real search APIs)
  const model = await createExecutionModel(modelConfig)
  const { generateText } = await import('ai')

  const { text, usage } = await generateText({
    model: model as any,
    prompt: `You are a web research assistant. Answer this query concisely:

Query: "${searchQuery}"

Provide:
1. Key entities (names, places, things)
2. Important facts
3. Sources (if applicable)

Format your response as JSON:
{
  "entities": {"entity_name": "entity_value"},
  "facts": ["fact1", "fact2"],
  "sources": ["source1", "source2"]
}`,
    temperature: 0.3,
  })

  const executionTimeMs = Date.now() - startTime

  try {
    const findings = JSON.parse(text)
    return {
      segmentId: segment.id,
      success: true,
      confidence: 0.85,
      executionTimeMs,
      tokensUsed: usage?.totalTokens || 0,
      findings,
      rawOutput: text,
    }
  } catch (error) {
    return {
      segmentId: segment.id,
      success: true,
      confidence: 0.6,
      executionTimeMs,
      tokensUsed: usage?.totalTokens || 0,
      findings: {
        entities: {},
        facts: [text],
        sources: [],
      },
      rawOutput: text,
    }
  }
}

/**
 * Execute segment using XMLHttpRequest (parallel fetching)
 */
async function executeWithXMLHTTP(
  segment: { id: string; text: string; type: string },
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string },
  context?: any[]
): Promise<SegmentExecutionResult> {
  // For now, delegate to fetch (can be enhanced with real parallel HTTP)
  return executeWithFetch(segment, modelConfig, context)
}

/**
 * Execute segment using code execution (complex analysis)
 */
async function executeWithCodeExec(
  segment: { id: string; text: string; type: string },
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string },
  context?: any[]
): Promise<SegmentExecutionResult> {
  const startTime = Date.now()

  const model = await createExecutionModel(modelConfig)
  const { generateText } = await import('ai')

  const contextData = context?.map((c) => c.findings) || []

  const { text, usage } = await generateText({
    model: model as any,
    prompt: `You are a data analysis assistant. Analyze this query with the given context:

Query: "${segment.text}"
Context: ${JSON.stringify(contextData, null, 2)}

Perform analysis and return results as JSON:
{
  "entities": {"entity_name": "analyzed_value"},
  "facts": ["finding1", "finding2"],
  "sources": ["analysis_method"]
}`,
    temperature: 0.2,
  })

  const executionTimeMs = Date.now() - startTime

  try {
    const findings = JSON.parse(text)
    return {
      segmentId: segment.id,
      success: true,
      confidence: 0.9,
      executionTimeMs,
      tokensUsed: usage?.totalTokens || 0,
      findings,
      rawOutput: text,
    }
  } catch (error) {
    return {
      segmentId: segment.id,
      success: true,
      confidence: 0.7,
      executionTimeMs,
      tokensUsed: usage?.totalTokens || 0,
      findings: {
        entities: {},
        facts: [text],
        sources: ['code_analysis'],
      },
      rawOutput: text,
    }
  }
}

/**
 * Execute segment using MCP tools (structured data)
 */
async function executeWithMCP(
  segment: { id: string; text: string; type: string },
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string },
  context?: any[]
): Promise<SegmentExecutionResult> {
  // MCP integration placeholder - will be enhanced with actual MCP server calls
  console.log('[SegmentExecutor] MCP execution not yet implemented, falling back to fetch')
  return executeWithFetch(segment, modelConfig, context)
}

/**
 * Execute segment using OCR (document processing)
 */
async function executeWithOCR(
  segment: { id: string; text: string; type: string },
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string },
  context?: any[]
): Promise<SegmentExecutionResult> {
  // OCR integration placeholder - will be enhanced with actual OCR processing
  console.log('[SegmentExecutor] OCR execution not yet implemented, falling back to fetch')
  return executeWithFetch(segment, modelConfig, context)
}

/**
 * Create AI model for execution
 */
async function createExecutionModel(config: {
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
      const ollamaProvider = createOllama({ baseURL: ollamaBaseUrl })
      return ollamaProvider(config.modelId)
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
      const openai = createOpenAI({ apiKey: config.apiKey, baseURL: config.baseURL })
      return openai(config.modelId)
    }

    case 'anthropic': {
      if (!config.apiKey) throw new Error('Anthropic API key required')
      const anthropic = createAnthropic({ apiKey: config.apiKey })
      return anthropic(config.modelId)
    }

    case 'google': {
      if (!config.apiKey) throw new Error('Google API key required')
      const google = createGoogleGenerativeAI({ apiKey: config.apiKey })
      return google(config.modelId)
    }

    case 'deepseek':
    case 'moonshot':
    case 'kimi':
    case 'vllm':
    case 'gguf':
    case 'onnx': {
      const baseURLs: Record<string, string> = {
        deepseek: 'https://api.deepseek.com/v1',
        moonshot: 'https://api.moonshot.cn/v1',
        kimi: 'https://api.moonshot.cn/v1',
        vllm: 'http://localhost:8000/v1',
        gguf: 'http://localhost:8080/v1',
        onnx: 'http://localhost:8081/v1',
      }
      const provider = createOpenAICompatible({
        name: config.provider,
        apiKey: config.apiKey || config.provider,
        baseURL: config.baseURL || baseURLs[config.provider],
      })
      return provider(config.modelId)
    }

    default:
      throw new Error(`Unknown provider: ${config.provider}`)
  }
}


/**
 * Execute multiple segments in parallel according to execution graph
 */
export const executeSegmentsParallel = action({
  args: {
    userId: v.string(),
    queryId: v.string(),
    segments: v.array(v.any()),
    executionGraph: v.any(), // Using v.any() to avoid type instantiation depth errors
    modelConfig: v.any(), // Using v.any() to avoid type instantiation depth errors
  },
  handler: async (ctx, args) => {
    const results = new Map<string, SegmentExecutionResult>()

    // Execute stages in order
    for (const stageIds of args.executionGraph.parallelizable) {
      const stageSegments = args.segments.filter((s) => stageIds.includes(s.id))

      // Execute all segments in this stage in parallel
      const stageResults = await Promise.all(
        stageSegments.map(async (segment) => {
          // Get context from dependencies
          const contextFromDependencies = segment.dependencies
            .map((depId: string) => results.get(depId))
            .filter((r: any): r is SegmentExecutionResult => r !== undefined)

          return ctx.runAction((internal as any)["lib/search/segmentExecutorActions"].executeSegment, {
            userId: args.userId,
            queryId: args.queryId,
            segment,
            modelConfig: args.modelConfig,
            contextFromDependencies,
          })
        })
      )

      // Store results
      stageResults.forEach((result) => {
        results.set(result.segmentId, result)
      })
    }

    return Array.from(results.values())
  },
})



