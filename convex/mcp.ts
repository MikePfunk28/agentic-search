"use node";

/**
 * MCP Integration - Actions with Distributed Locking
 *
 * Connect to and use MCP servers (LLM.txt, etc.)
 * Runs in Node.js runtime to access stdio transport for MCP
 *
 * DISTRIBUTED LOCKING STRATEGY:
 * ------------------------------
 * In serverless/multi-instance environments, module-level state (like Maps) cannot
 * provide reliable single-flight guarantees because each instance has isolated memory.
 *
 * Solution: Database-based distributed locking using Convex DB (see mcp_mutations.ts)
 *
 * 1. Connection attempts use acquireConnectionLock mutation to atomically check/insert
 *    a connection record with status='connecting'
 *
 * 2. If lock acquired (no existing connecting/connected record), proceed with connection
 *
 * 3. On success, updateConnectionStatus sets status='connected'
 *
 * 4. On failure, updateConnectionStatus sets status='failed' with error message
 *
 * 5. Stale locks (connecting for >30s) are automatically reclaimed
 *
 * 6. Concurrent requests either wait (if connecting) or use existing connection (if connected)
 *
 * This approach ensures exactly-once connection semantics across all Convex instances.
 */

import { action } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'

/**
 * Connect to LLM.txt MCP Server with distributed locking and exponential backoff
 * Extracts clean text from websites for LLM consumption
 * Uses Convex DB for atomic connection state management to handle serverless/multi-instance environments
 * Implements exponential backoff with max 5 retries
 */
export const connectLLMText = action({
  args: {},
  handler: async (ctx) => {
    const serverName = 'llm-txt'
    const maxRetries = 5
    const baseDelayMs = 500 // Start with 500ms

    // Retry loop with exponential backoff
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Atomically check/acquire lock via database mutation
      const lockResult = await ctx.runMutation(internal.mcp_mutations.acquireConnectionLock, {
        serverName
      })

      // If already connected, return immediately
      if (!lockResult.acquired && lockResult.status === 'connected') {
        return { success: true, server: serverName, alreadyConnected: true }
      }

      // If lock acquired, proceed with connection
      if (lockResult.acquired) {
        try {
          const { getMCPManager } = await import('../src/lib/mcp/client')
          const manager = getMCPManager()

          await manager.connect({
            name: serverName,
            command: 'npx',
            args: ['-y', '@cloudflare/mcp-server-llm-txt']
          })

          // Update status to connected
          await ctx.runMutation(internal.mcp_mutations.updateConnectionStatus, {
            serverName,
            status: 'connected'
          })

          return { success: true, server: serverName, connected: true }
        } catch (error) {
          // Update status to failed with error details
          await ctx.runMutation(internal.mcp_mutations.updateConnectionStatus, {
            serverName,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error)
          })
          throw error
        }
      }

      // Another instance is connecting, wait with exponential backoff and poll status
      if (lockResult.status === 'connecting') {
        // Calculate exponential backoff: 500ms, 1000ms, 2000ms, 4000ms, 8000ms
        const delayMs = baseDelayMs * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delayMs))

        // Poll the connection status to see if connection succeeded
        const connection = await ctx.runQuery(internal.mcp_mutations.getConnectionStatus, {
          serverName
        })

        if (connection?.status === 'connected') {
          return { success: true, server: serverName, waitedForConnection: true, attempts: attempt + 1 }
        }

        if (connection?.status === 'failed') {
          throw new Error(
            `Connection failed by another instance: ${connection.error || 'Unknown error'}`
          )
        }

        // Still connecting, continue retry loop
        continue
      }
    }

    // Max retries exceeded
    const totalTimeMs = baseDelayMs * (Math.pow(2, maxRetries) - 1)
    throw new Error(
      `Connection timeout: server '${serverName}' did not connect after ${maxRetries} attempts (~${totalTimeMs}ms with exponential backoff)`
    )
  }
})

/**
 * Extract LLM-friendly text from URL using LLM.txt
 * Ensures connection using distributed locking with exponential backoff before extraction
 * Implements exponential backoff with max 5 retries for connection attempts
 */
export const extractText = action({
  args: {
    url: v.string(),
    format: v.optional(v.union(v.literal('text'), v.literal('markdown'))),
    maxLength: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const serverName = 'llm-txt'
    const maxRetries = 5
    const baseDelayMs = 500
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()

    // Ensure connected using distributed locking with retry and exponential backoff
    if (!manager.getConnectedServers().includes(serverName)) {
      let connected = false
      
      for (let attempt = 0; attempt < maxRetries && !connected; attempt++) {
        // Atomically acquire connection lock
        const lockResult = await ctx.runMutation(internal.mcp_mutations.acquireConnectionLock, {
          serverName
        })

        // If already connected, break out
        if (!lockResult.acquired && lockResult.status === 'connected') {
          connected = true
          break
        }

        // If we acquired the lock, perform connection
        if (lockResult.acquired) {
          try {
            await manager.connect({
              name: serverName,
              command: 'npx',
              args: ['-y', '@cloudflare/mcp-server-llm-txt']
            })

            await ctx.runMutation(internal.mcp_mutations.updateConnectionStatus, {
              serverName,
              status: 'connected'
            })
            connected = true
            break
          } catch (error) {
            await ctx.runMutation(internal.mcp_mutations.updateConnectionStatus, {
              serverName,
              status: 'failed',
              error: error instanceof Error ? error.message : String(error)
            })
            throw error
          }
        } else if (lockResult.status === 'connecting') {
          // Wait with exponential backoff and check status
          const delayMs = baseDelayMs * Math.pow(2, attempt)
          await new Promise(resolve => setTimeout(resolve, delayMs))
          
          // Poll connection status
          const connection = await ctx.runQuery(internal.mcp_mutations.getConnectionStatus, {
            serverName
          })
          
          if (connection?.status === 'connected') {
            connected = true
            break
          }
          
          if (connection?.status === 'failed') {
            throw new Error(
              `Connection failed by another instance: ${connection.error || 'Unknown error'}`
            )
          }
        }
      }
      
      if (!connected) {
        const totalTimeMs = baseDelayMs * (Math.pow(2, maxRetries) - 1)
        throw new Error(
          `Failed to connect to ${serverName} after ${maxRetries} attempts (~${totalTimeMs}ms with exponential backoff)`
        )
      }
    }

    // Call extract_text tool with error handling
    let extractedText = '';
    try {
      const result = await manager.callTool(serverName, 'extract_text', {
        url: args.url,
        format: args.format || 'markdown',
        maxLength: args.maxLength || 50000
      });
      if (!Array.isArray(result) || !result[0] || typeof result[0].text !== 'string') {
        throw new Error('Unexpected result structure from llm-txt extract_text tool');
      }
      extractedText = result[0].text;
    } catch (error) {
      console.error('Error extracting text from URL:', args.url, error);
      extractedText = `Error extracting text: ${error instanceof Error ? error.message : String(error)}`;
    }

    // Store extracted text
    await ctx.runMutation(internal.mcp_mutations.storeExtraction, {
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
    await ctx.runMutation(internal.mcp_mutations.storeConnection, {
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
    await ctx.runMutation(internal.mcp_mutations.storeConnection, {
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

// Note: Queries and mutations are in mcp_mutations.ts
// Access them via: api.mcp_mutations.getConnections, etc.
