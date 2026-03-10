import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
  // Auth tables (users, authAccounts, authSessions, authRateLimits, authRefreshTokens, authVerificationCodes)
  ...authTables,
  // Custom users table (extends the default from authTables)
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  // OCR Results (compressed documents)
  ocrResults: defineTable({
    documentUrl: v.string(),
    originalTokens: v.number(),
    compressedTokens: v.number(),
    tokenSavings: v.number(), // percentage
    compressionRatio: v.number(), // e.g., 10 for 10x
    compressedMarkdown: v.string(),
    processingTimeMs: v.number(),
    confidence: v.number(),
    metadata: v.object({
      pages: v.optional(v.number()),
      title: v.optional(v.string()),
      author: v.optional(v.string()),
      createdAt: v.optional(v.string())
    }),
    createdAt: v.number()
  }).index('by_url', ['documentUrl'])
    .index('by_created', ['createdAt']),

  // OCR Processing Errors
  ocrErrors: defineTable({
    documentUrl: v.string(),
    errorMessage: v.string(),
    errorStack: v.optional(v.string()),
    createdAt: v.number()
  }).index('by_url', ['documentUrl'])
    .index('by_created', ['createdAt']),

  // MCP Server Connections
  mcpConnections: defineTable({
    serverName: v.string(),
    status: v.string(), // 'connecting' | 'connected' | 'failed' | 'disconnected'
    lastConnectedAt: v.number(),
    createdAt: v.number(),
    error: v.optional(v.string()) // Error message for failed connections
  })
    .index('by_server', ['serverName'])
    .index('by_last_connected', ['lastConnectedAt']),

  // MCP Text Extractions (LLM.txt results)
  mcpExtractions: defineTable({
    url: v.string(),
    extractedText: v.string(),
    format: v.string(), // 'text' | 'markdown'
    textLength: v.number(),
    extractedAt: v.number()
  }).index('by_url', ['url']),

  // Legacy tables (keep for compatibility)
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),

  // Model Configurations (supports local + cloud models)
  modelConfigurations: defineTable({
    userId: v.string(), // WorkOS user ID
    configName: v.string(), // e.g., "My Ollama", "Claude Opus"
    provider: v.union(
      v.literal("openai"),
      v.literal("anthropic"),
      v.literal("google"),
      v.literal("ollama"),
      v.literal("lm_studio"),
      v.literal("azure_openai")
    ),
    modelName: v.string(), // e.g., "llama2", "claude-3-opus"
    baseUrl: v.optional(v.string()), // For local models (localhost:11434)
    hasApiKey: v.boolean(), // true for cloud, false for local
    // API keys stored encrypted in localStorage, not here!
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
    isActive: v.boolean(), // Currently selected model
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  // MCP Server Configurations
  mcpServers: defineTable({
    userId: v.string(),
    name: v.string(), // e.g., "Claude Flow", "Custom Search"
    command: v.string(), // e.g., "npx", "node"
    args: v.array(v.string()), // e.g., ["claude-flow@alpha", "mcp", "start"]
    linkedModelId: v.optional(v.id("modelConfigurations")),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Chat History (short-term memory)
  chatMessages: defineTable({
    userId: v.string(),
    sessionId: v.string(), // Group messages by session
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    modelUsed: v.optional(v.id("modelConfigurations")),
    timestamp: v.number(),
    tokens: v.optional(v.number()), // Token count for analytics
  })
    .index("by_user_session", ["userId", "sessionId"])
    .index("by_timestamp", ["timestamp"]),

  // Search Results (cached for 5 minutes)
  searchResults: defineTable({
    userId: v.string(),
    query: v.string(),
    results: v.array(v.object({
      title: v.string(),
      url: v.string(),
      snippet: v.string(),
      source: v.string(),
    })),
    modelUsed: v.id("modelConfigurations"),
    timestamp: v.number(),
    expiresAt: v.number(), // TTL: timestamp + 5 minutes
  })
    .index("by_user_query", ["userId", "query"])
    .index("by_expires", ["expiresAt"]),

  // User Preferences
  userPreferences: defineTable({
    userId: v.string(),
    defaultModel: v.optional(v.id("modelConfigurations")),
    theme: v.optional(v.string()), // "light" | "dark"
    searchHistory: v.boolean(), // Enable/disable history tracking
    analytics: v.boolean(), // Opt-in for usage analytics
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Document Storage (Convex + S3 hybrid)
  documents: defineTable({
    userId: v.string(),

    name: v.string(),
    type: v.string(), // pdf, docx, txt, md, etc.
    size: v.number(),
    content: v.optional(v.string()), // For small text files (<1MB)
    s3Url: v.optional(v.string()), // For large files in S3
    metadata: v.optional(v.object({
      author: v.optional(v.string()),
      createdAt: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    })),
    uploadedAt: v.number(),
    processedAt: v.optional(v.number()),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("processed"),
      v.literal("failed")
    ),
    chunks: v.array(v.object({
      text: v.string(),
      embedding: v.optional(v.array(v.number())),
      page: v.optional(v.number()),
      chunkIndex: v.number(),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_uploaded", ["uploadedAt"])
    .index("by_processed", ["processedAt"]),

  // Segmented Agentic Search (SAS) - Query Segmentations Cache
  querySegmentations: defineTable({
    userId: v.string(),
    queryText: v.string(),
    queryHash: v.string(), // SHA256 hash for fast lookup
    segmentCount: v.number(),
    segments: v.array(v.object({
      id: v.string(),
      text: v.string(),
      type: v.union(
        v.literal("entity"),
        v.literal("relation"),
        v.literal("constraint"),
        v.literal("intent"),
        v.literal("context"),
        v.literal("comparison"),
        v.literal("synthesis")
      ),
      priority: v.number(),
      dependencies: v.array(v.string()),
      estimatedComplexity: v.union(
        v.literal("tiny"),
        v.literal("small"),
        v.literal("medium"),
        v.literal("large")
      ),
      recommendedModel: v.string(), // SUGGESTION ONLY!
      estimatedTokens: v.number(),
    })),
    executionGraphStages: v.number(),
    quality: v.number(), // User feedback or ADD score
    usageCount: v.number(),
    lastUsed: v.number(),
    expiresAt: v.number(), // TTL: 5 minutes
    createdAt: v.number(),
  })
    .index("by_user_hash", ["userId", "queryHash"])
    .index("by_expires", ["expiresAt"])
    .index("by_quality", ["quality"])
    .index("by_usage", ["usageCount"]),

  // Segment Execution Results (track how segments perform)
  segmentExecutions: defineTable({
    userId: v.string(),
    queryId: v.string(), // Links to querySegmentations
    segmentId: v.string(),
    segmentType: v.union(
      v.literal("entity"),
      v.literal("relation"),
      v.literal("constraint"),
      v.literal("intent"),
      v.literal("context"),
      v.literal("comparison"),
      v.literal("synthesis")
    ),
    segmentText: v.string(),
    modelUsed: v.string(),
    tokensUsed: v.number(),
    executionTimeMs: v.number(),
    success: v.boolean(),
    confidence: v.number(), // 0-1
    resultsCount: v.number(),
    findings: v.object({
      entities: v.any(), // JSON object
      facts: v.array(v.string()),
      sources: v.array(v.string()),
    }),
    wasEscalated: v.boolean(), // Did we escalate to a more powerful model?
    coordinationEvents: v.number(), // How many times did segments coordinate?
    createdAt: v.number(),
  })
    .index("by_user_query", ["userId", "queryId"])
    .index("by_segment_type", ["segmentType"])
    .index("by_model", ["modelUsed"])
    .index("by_success", ["success"])
    .index("by_created", ["createdAt"]),

  // Segment Templates (learned patterns for query decomposition)
  segmentTemplates: defineTable({
    userId: v.optional(v.string()), // null = global template
    templateName: v.string(),
    pattern: v.string(), // Regex or description for matching queries
    segmentType: v.union(
      v.literal("entity"),
      v.literal("relation"),
      v.literal("constraint"),
      v.literal("intent"),
      v.literal("context"),
      v.literal("comparison"),
      v.literal("synthesis")
    ),
    recommendedModel: v.string(),
    avgComplexity: v.union(
      v.literal("tiny"),
      v.literal("small"),
      v.literal("medium"),
      v.literal("large")
    ),
    avgTokens: v.number(),
    avgTimeMs: v.number(),
    successRate: v.number(), // 0-1
    usageCount: v.number(),
    lastUsed: v.number(),
    examples: v.array(v.string()), // Example queries that match
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["segmentType"])
    .index("by_success_rate", ["successRate"])
    .index("by_usage", ["usageCount"])
    .index("by_last_used", ["lastUsed"]),

  // Secure API Key Storage (server-side only, NOT in localStorage!)
  apiKeys: defineTable({
    userId: v.string(), // WorkOS user ID
    configId: v.id("modelConfigurations"),
    encryptedKey: v.string(), // Encrypted at rest by Convex
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_config", ["userId", "configId"]),

  // Usage Tracking for Fine-tuning
  usageEvents: defineTable({
    userId: v.string(),
    eventType: v.union(
      v.literal("search"),
      v.literal("segment_execution"),
      v.literal("model_call"),
      v.literal("user_feedback")
    ),
    query: v.optional(v.string()),
    modelUsed: v.optional(v.string()),
    tokensUsed: v.optional(v.number()),
    executionTimeMs: v.optional(v.number()),
    success: v.boolean(),
    quality: v.optional(v.number()), // 0-1 from ADD discriminator
    userFeedback: v.optional(v.union(
      v.literal("positive"),
      v.literal("negative"),
      v.literal("neutral")
    )),
    metadata: v.optional(v.any()), // Additional context as JSON
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_event_type", ["eventType"])
    .index("by_created", ["createdAt"])
    .index("by_user_created", ["userId", "createdAt"]),

  // Fine-tuning Datasets
  finetuningDatasets: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    provider: v.optional(v.union(v.literal("openai"))),
    format: v.union(
      v.literal("openai_jsonl"),
      v.literal("anthropic_jsonl"),
      v.literal("generic_json")
    ),
    eventCount: v.number(),
    exportedAt: v.number(),
    launchedAt: v.optional(v.number()),
    baseModel: v.optional(v.string()),
    suffix: v.optional(v.string()),
    jobId: v.optional(v.string()),
    trainingFileId: v.optional(v.string()),
    validationFileId: v.optional(v.string()),
    status: v.optional(v.string()),
    fineTunedModel: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    lastCheckedAt: v.optional(v.number()),
    s3Url: v.optional(v.string()), // S3 URL for exported dataset
    metadata: v.optional(v.object({
      avgQuality: v.optional(v.number()),
      totalTokens: v.optional(v.number()),
      modelDistribution: v.optional(v.any()),
      sourceBreakdown: v.optional(v.any()),
      approvedSearchCount: v.optional(v.number()),
      usageEventCount: v.optional(v.number()),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_exported", ["exportedAt"]),

  // Search History (saved searches with results)
  searchHistory: defineTable({
    userId: v.string(),
    query: v.string(),
    modelUsed: v.string(),
    results: v.array(v.object({
      title: v.string(),
      url: v.string(),
      snippet: v.string(),
      addScore: v.optional(v.number()),
      confidence: v.optional(v.number()),
    })),
    segmentCount: v.optional(v.number()),
    segments: v.optional(v.array(v.any())), // Store segment details
    executionTimeMs: v.number(),
    tokensUsed: v.number(),
    quality: v.optional(v.number()), // ADD discriminator score
    userApproved: v.optional(v.boolean()), // Did user approve results?
    userRating: v.optional(v.number()), // Optional 1-5 rating for reinforcement data
    feedback: v.optional(v.string()), // Free-form user feedback for training
    userModifications: v.optional(v.any()), // What did user change?
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_created", ["createdAt"]),

  // Interactive Segment Approvals (human-in-the-loop)
  segmentApprovals: defineTable({
    userId: v.string(),
    searchHistoryId: v.id("searchHistory"),
    segmentId: v.string(),
    segmentText: v.string(),
    originalSegmentText: v.string(), // What AI proposed
    modifiedSegmentText: v.optional(v.string()), // What user changed it to
    approved: v.boolean(),
    rejected: v.boolean(),
    userFeedback: v.optional(v.string()), // Why user approved/rejected
    suggestedImprovement: v.optional(v.string()), // User's suggestion
    segmentType: v.union(
      v.literal("entity"),
      v.literal("relation"),
      v.literal("constraint"),
      v.literal("intent"),
      v.literal("context"),
      v.literal("comparison"),
      v.literal("synthesis")
    ),
    aiConfidence: v.number(), // How confident was AI about this segment?
    userConfidence: v.optional(v.number()), // How confident is user?
    createdAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_search", ["searchHistoryId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_approved", ["approved"])
    .index("by_rejected", ["rejected"]),

  // Reasoning Step Approvals (step-by-step validation)
  reasoningStepApprovals: defineTable({
    userId: v.string(),
    searchHistoryId: v.id("searchHistory"),
    stepNumber: v.number(),
    stepType: v.string(), // "analysis", "synthesis", "validation", etc.
    aiReasoning: v.string(), // What AI thought
    userModification: v.optional(v.string()), // User's correction
    approved: v.boolean(),
    shouldRetry: v.boolean(), // Should AI retry this step with user's guidance?
    userGuidance: v.optional(v.string()), // Instruction for retry
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_search", ["searchHistoryId"])
    .index("by_search_step", ["searchHistoryId", "stepNumber"]),

  // External API Usage Tracking (Firecrawl, Tavily, Brave, Exa, LlamaParse, DeepSeek OCR, PaddleOCR, etc.)
  externalApiUsage: defineTable({
    userId: v.string(),
    provider: v.string(), // "firecrawl", "tavily", "brave", "exa", "llamaparse", "deepseek_ocr", "paddleocr", "openai", "anthropic", "google"
    endpoint: v.string(), // specific API endpoint called
    tokensUsed: v.optional(v.number()),
    requestCount: v.number(), // number of API calls in this event
    responseTimeMs: v.number(),
    success: v.boolean(),
    costEstimate: v.optional(v.number()), // estimated cost in USD
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["provider"])
    .index("by_user_provider", ["userId", "provider"])
    .index("by_created", ["createdAt"])
    .index("by_user_created", ["userId", "createdAt"]),

  // ── RAG Pipeline ────────────────────────────────────────────────────

  // RAG Knowledge Bases (user-scoped collections of documents)
  ragKnowledgeBases: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    ragLevel: v.union(
      v.literal("minimal"),   // BM25 text search only
      v.literal("medium"),    // + vector embeddings via local model
      v.literal("full"),      // + web crawl + knowledge graph
    ),
    documentCount: v.number(),
    totalChunks: v.number(),
    totalTokens: v.number(),
    embeddingModel: v.optional(v.string()), // e.g. "nomic-embed-text"
    embeddingProvider: v.optional(v.string()), // "ollama" | "openai" | "local"
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  // RAG Document Chunks (searchable text segments)
  ragChunks: defineTable({
    userId: v.string(),
    knowledgeBaseId: v.id("ragKnowledgeBases"),
    documentId: v.id("documents"),
    text: v.string(),
    chunkIndex: v.number(),
    tokenCount: v.number(),
    page: v.optional(v.number()),
    // Embedding stored as array of floats (for medium/full RAG)
    embedding: v.optional(v.array(v.number())),
    // Knowledge boundary metadata (for full RAG)
    domain: v.optional(v.string()),
    topic: v.optional(v.string()),
    relatedChunkIds: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_knowledge_base", ["knowledgeBaseId"])
    .index("by_document", ["documentId"])
    .searchIndex("search_text", {
      searchField: "text",
      filterFields: ["userId", "knowledgeBaseId"],
    }),

  // RAG Crawl Jobs (for full RAG — web crawl pipeline)
  ragCrawlJobs: defineTable({
    userId: v.string(),
    knowledgeBaseId: v.id("ragKnowledgeBases"),
    seedUrl: v.string(),
    canonicalUrl: v.optional(v.string()),
    status: v.union(
      v.literal("queued"),
      v.literal("crawling"),
      v.literal("indexing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    depth: v.number(), // how many links deep to follow
    maxPages: v.number(),
    pagesCrawled: v.number(),
    chunksCreated: v.number(),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_knowledge_base", ["knowledgeBaseId"])
    .index("by_status", ["status"]),

  // RAG Analytics — tracks how RAG results perform vs. web-only
  ragAnalytics: defineTable({
    userId: v.string(),
    searchHistoryId: v.optional(v.id("searchHistory")),
    query: v.string(),
    ragLevel: v.union(
      v.literal("none"),      // web search only (baseline)
      v.literal("minimal"),
      v.literal("medium"),
      v.literal("full"),
    ),
    // Result quality metrics
    ragResultCount: v.number(),
    webResultCount: v.number(),
    mergedResultCount: v.number(),
    addScoreRag: v.optional(v.number()),  // ADD score for RAG-sourced results
    addScoreWeb: v.optional(v.number()),  // ADD score for web-sourced results
    addScoreMerged: v.number(),           // ADD score for final merged set
    // Performance
    ragLatencyMs: v.number(),
    webLatencyMs: v.number(),
    totalLatencyMs: v.number(),
    ragTokensUsed: v.number(),
    // User feedback
    userRating: v.optional(v.number()), // 1-5
    userPreferredSource: v.optional(v.union(
      v.literal("rag"),
      v.literal("web"),
      v.literal("merged"),
    )),
    feedback: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_rag_level", ["ragLevel"])
    .index("by_created", ["createdAt"])
    .index("by_user_created", ["userId", "createdAt"]),
})


