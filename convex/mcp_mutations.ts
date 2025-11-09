/**
 * MCP Mutations and Queries
 *
 * Database operations for MCP connection management with distributed locking.
 * These run in standard Convex runtime (not Node.js).
 */

import { internalMutation, query } from './_generated/server'
import { v } from 'convex/values'

// ============================================
// Internal Mutations - Distributed Lock Implementation
// ============================================

/**
 * Atomically acquire a connection lock using Convex DB
 * Provides distributed locking for serverless/multi-instance environments
 * Returns whether lock was acquired and current connection status
 */
export const acquireConnectionLock = internalMutation({
  args: {
    serverName: v.string()
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    // Check if connection exists
    const existing = await ctx.db
      .query('mcpConnections')
      .withIndex('by_server', q => q.eq('serverName', args.serverName))
      .first()

    if (existing) {
      // If connected, don't acquire lock
      if (existing.status === 'connected') {
        return { acquired: false, status: 'connected' }
      }

      // If connecting, check if stale (timeout after 30 seconds)
      if (existing.status === 'connecting') {
        const isStale = (now - existing.lastConnectedAt) > 30000
        if (!isStale) {
          return { acquired: false, status: 'connecting' }
        }
        // Stale lock, acquire it by updating
        await ctx.db.patch(existing._id, {
          status: 'connecting',
          lastConnectedAt: now
        })
        return { acquired: true, status: 'connecting' }
      }

      // Failed or disconnected, update to connecting
      await ctx.db.patch(existing._id, {
        status: 'connecting',
        lastConnectedAt: now
      })
      return { acquired: true, status: 'connecting' }
    }

    // No existing connection, insert new with connecting status
    await ctx.db.insert('mcpConnections', {
      serverName: args.serverName,
      status: 'connecting',
      lastConnectedAt: now,
      createdAt: now
    })
    return { acquired: true, status: 'connecting' }
  }
})

/**
 * Update connection status after connection attempt
 * Sets status to 'connected' or 'failed' with optional error message
 * Throws an error if no connection record exists for the given serverName
 */
export const updateConnectionStatus = internalMutation({
  args: {
    serverName: v.string(),
    status: v.string(), // 'connected' | 'failed' | 'disconnected'
    error: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('mcpConnections')
      .withIndex('by_server', q => q.eq('serverName', args.serverName))
      .first()

    if (!existing) {
      throw new Error(
        `Cannot update connection status for '${args.serverName}': no connection record found. ` +
        `Attempted to set status='${args.status}'` +
        (args.error ? ` with error='${args.error}'` : '')
      )
    }

    await ctx.db.patch(existing._id, {
      status: args.status,
      lastConnectedAt: Date.now(),
      ...(args.error && { error: args.error })
    })
  }
})

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
