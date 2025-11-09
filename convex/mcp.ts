/**
 * MCP Integration - Consolidated Implementation
 * Connect to and use MCP servers (LLM.txt, etc.)
 * Runs in Node.js runtime to access stdio transport for MCP
 */

import { action, internalMutation, query } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'

// Single-flight connection guard: tracks pending connections to prevent race conditions
const pendingConnections = new Map<string, Promise<void>>()

/**
 * Connect to LLM.txt MCP Server with race condition protection
 * Extracts clean text from websites for LLM consumption
 * Uses single-flight pattern: concurrent calls wait for the same connection attempt
 */
export const connectLLMText = action({
  args: {},
  handler: async (ctx) => {
    const serverName = 'llm-txt'

    // Check if connection is already in progress
    const pendingConnection = pendingConnections.get(serverName)
    if (pendingConnection) {
      // Wait for the existing connection attempt to complete
      await pendingConnection
      return { success: true, server: serverName, waited: true }
    }

    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()

    // Check if already connected (after checking pending, to avoid race)
    if (manager.getConnectedServers().includes(serverName)) {
      return { success: true, server: serverName, alreadyConnected: true }
    }

    // Create connection promise and store it
    const connectionPromise = (async () => {
      try {
        await manager.connect({
          name: serverName,
          command: 'npx',
          args: ['-y', '@cloudflare/mcp-server-llm-txt']
        })

        // Store connection in database
        await ctx.runMutation(internal.mcp.storeConnection, {
          serverName,
          status: 'connected',
          connectedAt: Date.now()
        })
      } finally {
        // Always clean up the pending connection tracker
        pendingConnections.delete(serverName)
      }
    })()

    pendingConnections.set(serverName, connectionPromise)
    await connectionPromise

    return { success: true, server: serverName }
  }
})

/**
 * Extract LLM-friendly text from URL using LLM.txt
 * Delegates connection handling to connectLLMText to avoid race conditions
 */
export const extractText = action({
  args: {
    url: v.string(),
    format: v.optional(v.union(v.literal('text'), v.literal('markdown'))),
    maxLength: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()

    // Ensure connected - delegate to connectLLMText for proper connection guards
    if (!manager.getConnectedServers().includes('llm-txt')) {
      await ctx.runAction(internal.mcp.connectLLMText, {})
    }

    // Call extract_text tool with error handling
    let extractedText = '';
    try {
      const result = await manager.callTool('llm-txt', 'extract_text', {
        url: args.url,
        format: args.format || 'markdown',
        maxLength: args.maxLength || 50000
      });
      if (!Array.isArray(result) || !result[0] || typeof result[0].text !== 'string') {
        throw new Error('Unexpected result structure from llm-txt extract_text tool');
      }
      extractedText = result[0].text;
    } catch (error) {
      // Optionally log the error, or store it in the database
      console.error('Error extracting text from URL:', args.url, error);
      extractedText = `Error extracting text: ${error instanceof Error ? error.message : String(error)}`;
    }
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
      connectedAt: Date.now()  // Note: storeConnection uses this as lastConnectedAt
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
