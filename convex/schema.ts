import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
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
})
