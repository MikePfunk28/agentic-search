"use node";

/**
 * Query Segmentation Actions - Node.js Runtime
 * Contains actions that use Node.js APIs (crypto)
 */

import { action } from '../../_generated/server'
import { v } from 'convex/values'
import { internal } from '../../_generated/api'
import crypto from 'crypto'
import type { QuerySegment, SegmentationResult } from './querySegmentationTypes'

/**
 * Segment a complex query into executable sub-segments
 * Uses AI to intelligently break down the query
 */
export const segmentQuery = action({
  args: {
    userId: v.string(),
    queryText: v.string(),
    modelConfig: v.any(), // Using v.any() to avoid type instantiation depth errors
    useCache: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<SegmentationResult> => {
    const queryHash = crypto.createHash('sha256').update(args.queryText.toLowerCase().trim()).digest('hex')

    // Check cache first
    if (args.useCache !== false) {
      const cached = await ctx.runQuery((internal as any)["lib/search/querySegmentationQueries"].getCachedSegmentation, {
        userId: args.userId,
        queryHash,
      })
      if (cached) {
        console.log('[QuerySegmentation] Using cached segmentation')
        return {
          ...cached,
          cached: true,
        }
      }
    }

    console.log('[QuerySegmentation] Generating new segmentation for:', args.queryText)

    // Use AI to segment the query
    const model = await createSegmentationModel(args.modelConfig)
    const { generateObject, zodSchema } = await import('ai')
    const { z } = await import('zod')

    const { object: segmentation } = await generateObject({
      model: model as any,
      schema: zodSchema(z.object({
        segments: z.array(z.object({
          id: z.string(),
          text: z.string(),
          type: z.enum(['entity', 'relation', 'constraint', 'intent', 'context', 'comparison', 'synthesis']),
          priority: z.number(),
          dependencies: z.array(z.string()),
          estimatedComplexity: z.enum(['tiny', 'small', 'medium', 'large']),
        }))
      })),
      prompt: `You are an expert query segmentation engine for agentic search systems.

Break down this user query into atomic, executable sub-segments:

"${args.queryText}"

SEGMENTATION RULES:
1. Each segment must be independently executable
2. Identify clear dependencies between segments
3. Assign priorities (1=highest, 10=lowest)
4. Classify segment types:
   - entity: Extract entities (people, places, things)
   - relation: Find relationships between entities
   - constraint: Apply filters or conditions
   - intent: Understand user's goal
   - context: Gather background information
   - comparison: Compare multiple items
   - synthesis: Combine information from other segments

5. Estimate complexity based on:
   - tiny: Simple fact retrieval (1-2 API calls)
   - small: Straightforward analysis (3-5 API calls)
   - medium: Multi-step reasoning (6-10 API calls)
   - large: Complex synthesis (10+ API calls)

EXAMPLE:
Query: "Compare the latest iPhone and Samsung Galaxy pricing and camera specs"
Segments:
- {id: "1", text: "Find latest iPhone model", type: "entity", priority: 1, dependencies: [], complexity: "tiny"}
- {id: "2", text: "Find latest Samsung Galaxy model", type: "entity", priority: 1, dependencies: [], complexity: "tiny"}
- {id: "3", text: "Get iPhone pricing", type: "relation", priority: 2, dependencies: ["1"], complexity: "small"}
- {id: "4", text: "Get Samsung Galaxy pricing", type: "relation", priority: 2, dependencies: ["2"], complexity: "small"}
- {id: "5", text: "Get iPhone camera specs", type: "relation", priority: 2, dependencies: ["1"], complexity: "small"}
- {id: "6", text: "Get Samsung Galaxy camera specs", type: "relation", priority: 2, dependencies: ["2"], complexity: "small"}
- {id: "7", text: "Compare pricing", type: "comparison", priority: 3, dependencies: ["3", "4"], complexity: "tiny"}
- {id: "8", text: "Compare camera specs", type: "comparison", priority: 3, dependencies: ["5", "6"], complexity: "small"}
- {id: "9", text: "Synthesize comparison results", type: "synthesis", priority: 4, dependencies: ["7", "8"], complexity: "medium"}

Return the segments as JSON.`,
      temperature: 0.3,
    })

    // Assign deterministic tools to each segment
    const segmentsWithTools = await Promise.all(
      segmentation.segments.map(async (segment) => {
        const { tool, reasoning } = await assignToolToSegment(segment, args.modelConfig)
        return {
          ...segment,
          recommendedModel: args.modelConfig.modelId,
          estimatedTokens: estimateTokens(segment.text),
          assignedTool: tool,
          toolReasoning: reasoning,
        }
      })
    )

    // Build execution graph
    const executionGraph = buildExecutionGraph(segmentsWithTools)

    // Calculate estimates
    const estimatedTotalTokens = segmentsWithTools.reduce((sum, seg) => sum + seg.estimatedTokens, 0)
    const estimatedTimeMs = calculateEstimatedTime(segmentsWithTools, executionGraph)

    const result: SegmentationResult = {
      queryHash,
      segments: segmentsWithTools,
      executionGraph,
      estimatedTotalTokens,
      estimatedTimeMs,
      cached: false,
    }

    // Store in cache
    await ctx.runMutation((internal as any)["lib/search/querySegmentationQueries"].storeSegmentation, {
      userId: args.userId,
      queryText: args.queryText,
      queryHash,
      result,
    })

    return result
  },
})

/**
 * Deterministically assign tools to segments based on type and complexity
 */
async function assignToolToSegment(
  segment: Omit<QuerySegment, 'recommendedModel' | 'estimatedTokens' | 'assignedTool' | 'toolReasoning'>,
  modelConfig: { provider: string; modelId: string; apiKey?: string; baseURL?: string }
): Promise<{ tool: QuerySegment['assignedTool']; reasoning: string }> {
  // Deterministic rules for tool assignment

  // Entity extraction: Use fetch for web searches
  if (segment.type === 'entity') {
    return {
      tool: 'fetch',
      reasoning: 'Entity extraction benefits from web search APIs (Google, Bing, DuckDuckGo)',
    }
  }

  // Relations: Use MCP tools for structured data
  if (segment.type === 'relation') {
    return {
      tool: 'mcp',
      reasoning: 'Relationship queries need structured data from MCP servers (databases, APIs)',
    }
  }

  // Constraints: Use code execution for filtering
  if (segment.type === 'constraint') {
    return {
      tool: 'code_exec',
      reasoning: 'Constraint application requires code execution for filtering and validation',
    }
  }

  // Intent understanding: Use LLM directly (fetch for context)
  if (segment.type === 'intent') {
    return {
      tool: 'fetch',
      reasoning: 'Intent classification uses LLM with web context for accuracy',
    }
  }

  // Context gathering: Use OCR for documents or fetch for web
  if (segment.type === 'context') {
    // Check if query mentions documents/PDFs
    if (
      segment.text.toLowerCase().includes('document') ||
      segment.text.toLowerCase().includes('pdf') ||
      segment.text.toLowerCase().includes('paper')
    ) {
      return {
        tool: 'ocr',
        reasoning: 'Context extraction from documents requires OCR with AI compression',
      }
    }
    return {
      tool: 'fetch',
      reasoning: 'Context gathering from web sources using fetch APIs',
    }
  }

  // Comparison: Use xmlhttp for parallel data fetching
  if (segment.type === 'comparison') {
    return {
      tool: 'xmlhttp',
      reasoning: 'Comparison requires parallel data fetching using XMLHttpRequest for speed',
    }
  }

  // Synthesis: Use code execution for complex aggregation
  if (segment.type === 'synthesis') {
    return {
      tool: 'code_exec',
      reasoning: 'Synthesis requires code execution for complex data aggregation and analysis',
    }
  }

  // Default: fetch
  return {
    tool: 'fetch',
    reasoning: 'Default to fetch API for general queries',
  }
}

/**
 * Build execution graph from segments
 * Identifies parallel and sequential execution paths
 */
function buildExecutionGraph(segments: QuerySegment[]): {
  stages: number
  parallelizable: string[][]
  sequential: string[]
} {
  // Build dependency graph
  const dependencyMap = new Map<string, Set<string>>()
  segments.forEach((seg) => {
    dependencyMap.set(seg.id, new Set(seg.dependencies))
  })

  // Topological sort to find execution order
  const stages: string[][] = []
  const processed = new Set<string>()
  const sequential: string[] = []

  while (processed.size < segments.length) {
    // Find segments with no unprocessed dependencies
    const ready = segments
      .filter((seg) => !processed.has(seg.id))
      .filter((seg) => {
        const deps = dependencyMap.get(seg.id) || new Set()
        return Array.from(deps).every((dep) => processed.has(dep))
      })
      .sort((a, b) => a.priority - b.priority) // Sort by priority

    if (ready.length === 0) {
      throw new Error('Circular dependency detected in query segments')
    }

    // Add to stage (can be executed in parallel)
    stages.push(ready.map((s) => s.id))
    ready.forEach((s) => processed.add(s.id))

    // Track sequential execution order
    sequential.push(...ready.map((s) => s.id))
  }

  return {
    stages: stages.length,
    parallelizable: stages,
    sequential,
  }
}

/**
 * Estimate total execution time based on complexity and parallelization
 */
function calculateEstimatedTime(
  segments: QuerySegment[],
  executionGraph: { stages: number; parallelizable: string[][] }
): number {
  // Base time estimates by complexity (in milliseconds)
  const complexityTime = {
    tiny: 500,
    small: 2000,
    medium: 5000,
    large: 15000,
  }

  // Calculate time per stage (parallel execution)
  let totalTime = 0
  executionGraph.parallelizable.forEach((stageIds) => {
    const stageSegments = segments.filter((s) => stageIds.includes(s.id))
    const maxStageTime = Math.max(...stageSegments.map((s) => complexityTime[s.estimatedComplexity]))
    totalTime += maxStageTime
  })

  return totalTime
}

/**
 * Estimate token count (4 chars per token approximation)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Create AI model for segmentation
 */
async function createSegmentationModel(config: {
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
      const provider = createOpenAICompatible({
        name: config.provider,
        apiKey: config.apiKey || config.provider,
        baseURL: config.baseURL || `http://localhost:8000/v1`,
      })
      return provider(config.modelId)
    }

    default:
      throw new Error(`Unknown provider: ${config.provider}`)
  }
}


