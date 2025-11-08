/**
 * MCP Integration - Node.js Runtime Functions
 * Contains MCP client operations that require Node.js APIs
 * Runs in Node.js runtime due to "use node" directive
 */

"use node"

import { action } from './_generated/server'
import { v } from 'convex/values'

/**
 * Connect to LLM.txt MCP Server
 * Extracts clean text from websites for LLM consumption
 */
export const connectLLMText = action({
  args: {},
  handler: async (ctx) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()

    await manager.connect({
      name: 'llm-txt',
      command: 'npx',
      args: ['-y', '@cloudflare/mcp-server-llm-txt']
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
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()

    // Ensure connected
    if (!manager.getConnectedServers().includes('llm-txt')) {
      await manager.connect({
        name: 'llm-txt',
        command: 'npx',
        args: ['-y', '@cloudflare/mcp-server-llm-txt']
      })
    }

    // Call extract_text tool
    const result = await manager.callTool('llm-txt', 'extract_text', {
      url: args.url,
      format: args.format || 'markdown',
      maxLength: args.maxLength || 50000
    })

    return result[0]?.text || ''
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
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()

    await manager.connect({
      name: args.name,
      command: args.command,
      args: args.args,
      env: args.env as Record<string, string> | undefined
    })

    return { success: true, server: args.name }
  }
})

/**
 * List tools from an MCP server
 */
export const listTools = action({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()
    const tools = await manager.listTools(args.serverName)
    return tools
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
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()
    const result = await manager.callTool(
      args.serverName,
      args.toolName,
      args.arguments as Record<string, any>
    )
    return result
  }
})

/**
 * List resources from an MCP server
 */
export const listResources = action({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()
    const resources = await manager.listResources(args.serverName)
    return resources
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
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()
    const content = await manager.readResource(args.serverName, args.resourceUri)
    return content
  }
})

/**
 * Disconnect from an MCP server
 */
export const disconnectServer = action({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()
    await manager.disconnect(args.serverName)

    return { success: true }
  }
})

/**
 * Get list of connected MCP servers
 */
export const getConnectedServers = action({
  handler: async (ctx) => {
    const { getMCPManager } = await import('../src/lib/mcp/client')
    const manager = getMCPManager()
    return manager.getConnectedServers()
  }
})
