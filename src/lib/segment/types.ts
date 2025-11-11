/**
 * Types for Segmented Agentic Search (SAS)
 *
 * Core concept: Break queries into coordinated segments that work with ANY model size
 */

import type { SearchResult } from "../types";
import type { ModelConfig } from "../model-config";

/**
 * Segment types based on query analysis
 */
export type SegmentType =
  | 'entity'      // Extract or search for specific entities
  | 'relation'    // Find relationships between entities
  | 'constraint'  // Apply filters or constraints
  | 'intent'      // Understand user's goal
  | 'context'     // Gather background information
  | 'comparison'  // Compare two or more things
  | 'synthesis';  // Combine findings from other segments

/**
 * Search strategy for a segment
 */
export type SegmentSearchStrategy =
  | 'factual'     // Direct factual lookup
  | 'exploratory' // Broad exploration
  | 'comparative' // Side-by-side comparison
  | 'temporal';   // Time-based search

/**
 * Segment complexity levels (determines model assignment)
 */
export type SegmentComplexity =
  | 'tiny'   // qwen3:1.7b, gemma3:270m - Simple lookups
  | 'small'  // qwen3:4b, gemma3:1b - Basic reasoning
  | 'medium' // llama3:8b - Complex analysis
  | 'large'; // Claude/GPT-4 - Creative synthesis

/**
 * Individual query segment with metadata
 */
export interface QuerySegment {
  id: string;
  text: string;
  type: SegmentType;
  priority: number; // 1-10 (higher = more important)
  dependencies: string[]; // IDs of segments that must complete first
  searchStrategy: SegmentSearchStrategy;
  estimatedComplexity: SegmentComplexity;
  recommendedModel: string; // Model identifier (e.g., "ollama:qwen3:1.7b")
  estimatedTokens: number;
  metadata?: Record<string, unknown>;
}

/**
 * Execution graph defining segment ordering
 */
export interface ExecutionGraph {
  parallel: string[][]; // Groups of segments that can run in parallel
  sequential: string[][]; // Groups that must run sequentially
  totalStages: number;
}

/**
 * Result of query segmentation
 */
export interface SegmentationResult {
  queryId: string;
  originalQuery: string;
  segments: QuerySegment[];
  executionGraph: ExecutionGraph;
  estimatedTokens: number;
  estimatedTime: number; // milliseconds
  createdAt: number;
}

/**
 * Context shared between segments during execution
 */
export interface SegmentContext {
  segmentId: string;
  findings: {
    entities: Record<string, any>; // Discovered entities
    facts: string[]; // Key facts found
    sources: string[]; // Source URLs used
    confidence: number; // 0-1
    contradictions: string[]; // Conflicting information found
  };
  searchResults: SearchResult[];
  nextRecommendations: string[]; // What to search next
  timestamp: number;
  tokensUsed: number;
  executionTimeMs: number;
}

/**
 * Global coordination state across all segments
 */
export interface CoordinationState {
  queryId: string;
  originalQuery: string;
  segments: Record<string, SegmentContext>; // segmentId -> context
  globalContext: {
    entities: Map<string, any>; // All entities found across segments
    timeline: Array<{event: string; date: string; source: string}>;
    relationships: Array<{from: string; to: string; type: string; confidence: number}>;
    keyFindings: string[]; // Most important findings
  };
  coordinationLog: Array<{
    timestamp: number;
    segmentId: string;
    action: 'started' | 'completed' | 'updated_context' | 'spawned_child' | 'escalated';
    metadata: any;
  }>;
  startTime: number;
  completedSegments: Set<string>;
  failedSegments: Map<string, string>; // segmentId -> error message
}

/**
 * Result from executing a single segment
 */
export interface SegmentExecutionResult {
  segment: QuerySegment;
  context: SegmentContext;
  success: boolean;
  error?: string;
  modelUsed: string;
  shouldEscalate: boolean; // True if segment needs a more powerful model
  newSegments?: QuerySegment[]; // Dynamically generated sub-segments
}

/**
 * Final result from coordinated segment execution
 */
export interface CoordinatedSearchResult {
  queryId: string;
  originalQuery: string;
  segmentation: SegmentationResult;
  coordinationState: CoordinationState;
  finalResults: SearchResult[];
  synthesizedResponse: string;
  totalTokens: number;
  totalTime: number;
  segmentBreakdown: {
    segmentId: string;
    type: SegmentType;
    modelUsed: string;
    tokensUsed: number;
    timeMs: number;
    success: boolean;
  }[];
  quality: {
    accuracy: number; // 0-1
    completeness: number; // 0-1
    coherence: number; // 0-1
    overall: number; // 0-1
  };
}

/**
 * Segment template for pattern matching
 */
export interface SegmentTemplate {
  id: string;
  pattern: string; // Regex or pattern for matching queries
  segmentType: SegmentType;
  recommendedModel: string;
  avgComplexity: SegmentComplexity;
  avgTokens: number;
  avgTimeMs: number;
  successRate: number; // 0-1
  usageCount: number;
  lastUsed: number;
  examples: string[]; // Example queries that match this pattern
}

/**
 * Cache entry for segmentations
 */
export interface SegmentationCacheEntry {
  queryText: string;
  queryHash: string;
  segmentation: SegmentationResult;
  quality: number; // User feedback or ADD score
  usageCount: number;
  lastUsed: number;
  expiresAt: number;
}

/**
 * Configuration for segmentation system
 */
export interface SegmentationConfig {
  // Model routing
  tinyModelThreshold: number; // Complexity score < this → tiny model
  smallModelThreshold: number; // Complexity score < this → small model
  mediumModelThreshold: number; // Complexity score < this → medium model

  // Execution settings
  maxParallelSegments: number; // Max segments to run in parallel
  segmentTimeout: number; // Timeout per segment (ms)
  enableAdaptiveReSegmentation: boolean; // Re-segment if too complex
  enableModelEscalation: boolean; // Escalate to larger model if needed

  // Caching
  cacheEnabled: boolean;
  cacheTTL: number; // Cache expiry (ms)
  maxCacheSize: number; // Max cached segmentations

  // Learning
  learningEnabled: boolean;
  minUsageForTemplate: number; // Min uses before creating template
  templateSuccessThreshold: number; // Min success rate for template
}

/**
 * Default segmentation configuration
 */
export const DEFAULT_SEGMENTATION_CONFIG: SegmentationConfig = {
  // Model routing
  tinyModelThreshold: 0.3,
  smallModelThreshold: 0.6,
  mediumModelThreshold: 0.8,

  // Execution
  maxParallelSegments: 5,
  segmentTimeout: 30000, // 30s per segment
  enableAdaptiveReSegmentation: true,
  enableModelEscalation: true,

  // Caching
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 1000,

  // Learning
  learningEnabled: true,
  minUsageForTemplate: 5,
  templateSuccessThreshold: 0.7,
};
