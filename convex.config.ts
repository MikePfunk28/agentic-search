import { defineApp } from 'convex/server'

/**
 * Convex Configuration
 * Marks external dependencies for Actions
 */
export default defineApp({
  functions: {
    external: [
      // AI SDK packages (used in Actions)
      '@ai-sdk/openai',
      '@ai-sdk/anthropic',
      '@ai-sdk/google',
      '@ai-sdk/azure',
      'ai',
      // PDF processing
      'pdf-parse',
      // MCP SDK
      '@modelcontextprotocol/sdk'
    ]
  }
})
