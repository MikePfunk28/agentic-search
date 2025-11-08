/**
 * MCP Integration - Public API
 * Connect to and use MCP servers (LLM.txt, etc.)
 * This file contains database operations and coordination logic.
 * Node.js API-dependent operations are in mcp.node.ts
 */

import { action, internalMutation, query } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import { api } from './_generated/api'
import * as mcpNode from './mcp.node'

/**
 * Connect to LLM.txt MCP Server
 * Extracts clean text from websites for LLM consumption
 */
export const connectLLMText = action({
  args: {},
  handler: async (ctx): Promise<any> => {
    // TODO: MCP Node functions run in separate runtime and cannot be called from Convex actions
    // This should be handled client-side or through a different mechanism

    // Store connection in database
    await ctx.runMutation(internal.mcp.storeConnection, {
      serverName: 'llm-txt',
      status: 'connected',
      connectedAt: Date.now()
    })

    return { success: true, server: 'llm-txt' }
  }
})

/**
 * Extract LLM-friendly text from URL using LLM.txt
 */
export const extractText = action({
  args: {
    url: v.string(),
    format: v.optional(v.union(v.literal('text'), v.literal('markdown'))),
    maxLength: v.optional(v.number())
  },
  handler: async (ctx, args): Promise<string> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations
    const extractedText = `Extracted text from ${args.url}` // Placeholder

    // Store extracted text
    await ctx.runMutation(internal.mcp.storeExtraction, {
      url: args.url,
      extractedText: extractedText,
      format: args.format || 'markdown',
      extractedAt: Date.now()
    })

    return extractedText
  }
})

/**
 * Connect to a custom MCP server
 */
export const connectServer = action({
  args: {
    name: v.string(),
    command: v.string(),
    args: v.array(v.string()),
    env: v.optional(v.any())
  },
  handler: async (ctx, args): Promise<any> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations

    // Store connection in database
    await ctx.runMutation(internal.mcp.storeConnection, {
      serverName: args.name,
      status: 'connected',
      connectedAt: Date.now()
    })

    return { success: true, server: args.name }
  }
})

/**
 * List tools from an MCP server
 */
export const listTools = action({
  args: { serverName: v.string() },
  handler: async (ctx, args): Promise<any> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations
    return []
  }
})

/**
 * Call a tool on an MCP server
 */
export const callTool = action({
  args: {
    serverName: v.string(),
    toolName: v.string(),
    arguments: v.any()
  },
  handler: async (ctx, args): Promise<any> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations
    return { result: `Called ${args.toolName} on ${args.serverName}` }
  }
})

/**
 * List resources from an MCP server
 */
export const listResources = action({
  args: { serverName: v.string() },
  handler: async (ctx, args): Promise<any> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations
    return []
  }
})

/**
 * Read a resource from an MCP server
 */
export const readResource = action({
  args: {
    serverName: v.string(),
    resourceUri: v.string()
  },
  handler: async (ctx, args): Promise<any> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations
    return { content: `Content from ${args.resourceUri}` }
  }
})

/**
 * Disconnect from an MCP server
 */
export const disconnectServer = action({
  args: { serverName: v.string() },
  handler: async (ctx, args): Promise<any> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations

    // Store disconnection in database
    await ctx.runMutation(internal.mcp.storeConnection, {
      serverName: args.serverName,
      status: 'disconnected',
      connectedAt: Date.now()
    })

    return { success: true }
  }
})

/**
 * Get list of connected MCP servers
 */
export const getConnectedServers = action({
  handler: async (ctx): Promise<string[]> => {
    // TODO: MCP operations should be handled client-side due to runtime limitations
    return []
  }
})

// ============================================
// Internal Mutations
// ============================================

export const storeConnection = internalMutation({
  args: {
    serverName: v.string(),
    status: v.string(),
    connectedAt: v.number()
  },
  handler: async (ctx, args) => {
    // Check if connection exists
    const existing = await ctx.db
      .query('mcpConnections')
      .withIndex('by_server', q => q.eq('serverName', args.serverName))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        lastConnectedAt: args.connectedAt
      })
    } else {
      await ctx.db.insert('mcpConnections', {
        serverName: args.serverName,
        status: args.status,
        lastConnectedAt: args.connectedAt,
        createdAt: args.connectedAt
      })
    }
  }
})

export const storeExtraction = internalMutation({
  args: {
    url: v.string(),
    extractedText: v.string(),
    format: v.string(),
    extractedAt: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('mcpExtractions', {
      url: args.url,
      extractedText: args.extractedText,
      format: args.format,
      textLength: args.extractedText.length,
      extractedAt: args.extractedAt
    })
  }
})

// ============================================
// Queries
// ============================================

export const getConnections = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('mcpConnections')
      .order('desc')
      .collect()
  }
})

export const getExtraction = query({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mcpExtractions')
      .withIndex('by_url', q => q.eq('url', args.url))
      .order('desc')
      .first()
  }
})

export const getRecentExtractions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10
    return await ctx.db
      .query('mcpExtractions')
      .order('desc')
      .take(limit)
  }
})
