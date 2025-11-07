/**
 * TypeScript types for the Agentic Search Platform
 * Defines interfaces for search results, configurations, and agent communications
 */

// Search Result from agents (Autumn/Firecrawl)
export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  publishedDate?: string;
  source: "autumn" | "firecrawl";
  addScore?: number; // ADD (Adversarial Differential Discrimination) score
  ocrData?: OCRResult;
}

// OCR processing result from DeepSeek
export interface OCRResult {
  markdown: string;
  originalTokens: number;
  compressedTokens: number;
  savings: number; // Percentage
  confidence: number;
}

// Search status tracking
export type SearchStatus = "pending" | "searching" | "scoring" | "complete" | "error";

// Complete search record from Convex
export interface Search {
  _id: string;
  _creationTime: number;
  query: string;
  userId?: string;
  results: SearchResult[];
  ocrResults?: OCRResult[];
  addScores?: Record<string, number>;
  status: SearchStatus;
  tokenSavings?: number;
  createdAt: number;
}

// Tool call tracking for learning agent
export interface ToolCall {
  _id: string;
  toolName: string;
  parameters: Record<string, unknown>;
  result: unknown;
  duration: number;
  success: boolean;
  errorMessage?: string;
  timestamp: number;
}

// Learning patterns discovered by the learning agent
export interface LearningPattern {
  _id: string;
  toolName: string;
  successRate: number;
  avgDuration: number;
  recommendations: string[];
  lastUpdated: number;
}

// User configuration for model selection and API keys
export interface UserConfig {
  modelProvider: "local" | "anthropic" | "openai";
  apiKeys: {
    anthropic?: string;
    openai?: string;
    deepseek?: string;
    autumn?: string;
    firecrawl?: string;
  };
  preferences: {
    enableOCR: boolean;
    enableADDScoring: boolean;
    parallelSearch: boolean;
    maxResults: number;
  };
}

// API key validation status
export interface APIKeyStatus {
  provider: string;
  isValid: boolean;
  lastChecked: number;
  error?: string;
}

// Real-time search progress update
export interface SearchProgress {
  searchId: string;
  stage: "initializing" | "searching" | "processing-ocr" | "scoring" | "complete";
  message: string;
  progress: number; // 0-100
  timestamp: number;
}
