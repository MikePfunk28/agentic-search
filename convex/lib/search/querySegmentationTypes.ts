/**
 * Query Segmentation Types
 * Shared types for query segmentation
 */

export interface QuerySegment {
  id: string
  text: string
  type: 'entity' | 'relation' | 'constraint' | 'intent' | 'context' | 'comparison' | 'synthesis'
  priority: number
  dependencies: string[]
  estimatedComplexity: 'tiny' | 'small' | 'medium' | 'large'
  recommendedModel: string
  estimatedTokens: number
  assignedTool: 'fetch' | 'xmlhttp' | 'code_exec' | 'mcp' | 'ocr'
  toolReasoning: string
}

export interface SegmentationResult {
  queryHash: string
  segments: QuerySegment[]
  executionGraph: {
    stages: number
    parallelizable: string[][]
    sequential: string[]
  }
  estimatedTotalTokens: number
  estimatedTimeMs: number
  cached: boolean
}


