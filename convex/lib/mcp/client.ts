/**
 * MCP Client for Convex Actions
 * Connects to MCP servers (LLM.txt, etc.) from backend
 * This file runs in Node.js runtime due to "use node" directive
 */

"use node"

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'

export interface MCPServerConfig {
  name: string
  command: string
  args: string[]
  env?: Record<string, string>
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
}

export interface MCPResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

/**
 * MCP Client Manager
 * Handles connections to multiple MCP servers
 */
export class MCPClientManager {
  private clients: Map<string, Client> = new Map()
  private transports: Map<string, Transport> = new Map()

  /**
   * Connect to an MCP server
   */
  async connect(config: MCPServerConfig): Promise<void> {
    if (this.clients.has(config.name)) {
      console.log(`[MCP] Already connected to ${config.name}`)
      return
    }

    console.log(`[MCP] Connecting to ${config.name}...`)

    // Create stdio transport
    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env: config.env
    })

    // Create client
    const client = new Client(
      {
        name: 'agentic-search-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    )

    // Connect
    await client.connect(transport)

    this.clients.set(config.name, client)
    this.transports.set(config.name, transport)

    console.log(`[MCP] Connected to ${config.name}`)
  }

  /**
   * Disconnect from an MCP server
   */
  async disconnect(serverName: string): Promise<void> {
    const client = this.clients.get(serverName)
    const transport = this.transports.get(serverName)

    if (client) {
      await client.close()
      this.clients.delete(serverName)
    }

    if (transport) {
      await transport.close()
      this.transports.delete(serverName)
    }

    console.log(`[MCP] Disconnected from ${serverName}`)
  }

  /**
   * List available tools from a server
   */
  async listTools(serverName: string): Promise<MCPTool[]> {
    const client = this.clients.get(serverName)
    if (!client) {
      throw new Error(`Not connected to server: ${serverName}`)
    }

    const response = await client.request({
      method: 'tools/list'
    }, { timeout: 5000 })

    return response.tools || []
  }

  /**
   * Call a tool on an MCP server
   */
  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    const client = this.clients.get(serverName)
    if (!client) {
      throw new Error(`Not connected to server: ${serverName}`)
    }

    console.log(`[MCP] Calling ${serverName}.${toolName}`, args)

    const response = await client.request({
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    }, { timeout: 30000 })

    return response.content
  }

  /**
   * List available resources from a server
   */
  async listResources(serverName: string): Promise<MCPResource[]> {
    const client = this.clients.get(serverName)
    if (!client) {
      throw new Error(`Not connected to server: ${serverName}`)
    }

    const response = await client.request({
      method: 'resources/list'
    }, { timeout: 5000 })

    return response.resources || []
  }

  /**
   * Read a resource from a server
   */
  async readResource(
    serverName: string,
    resourceUri: string
  ): Promise<any> {
    const client = this.clients.get(serverName)
    if (!client) {
      throw new Error(`Not connected to server: ${serverName}`)
    }

    console.log(`[MCP] Reading resource ${resourceUri} from ${serverName}`)

    const response = await client.request({
      method: 'resources/read',
      params: {
        uri: resourceUri
      }
    }, { timeout: 30000 })

    return response.contents
  }

  /**
   * Disconnect from all servers
   */
  async disconnectAll(): Promise<void> {
    const serverNames = Array.from(this.clients.keys())
    await Promise.all(serverNames.map(name => this.disconnect(name)))
  }

  /**
   * Get list of connected servers
   */
  getConnectedServers(): string[] {
    return Array.from(this.clients.keys())
  }
}

// Singleton instance for reuse across actions
let mcpManager: MCPClientManager | null = null

export function getMCPManager(): MCPClientManager {
  if (!mcpManager) {
    mcpManager = new MCPClientManager()
  }
  return mcpManager
}
