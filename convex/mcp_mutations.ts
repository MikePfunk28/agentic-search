/**
 * MCP Mutations and Queries
 *
 * Database operations for MCP connection management with distributed locking.
 * These run in standard Convex runtime (not Node.js).
 */

import { internalMutation, internalQuery, query } from './_generated/server'
import { v } from 'convex/values'

// ============================================
// Internal Mutations - Distributed Lock Implementation
// ============================================

/**
 * Atomically acquire a connection lock using Convex DB
 * Provides distributed locking for serverless/multi-instance environments
 * Returns whether lock was acquired and current connection status
 */
const STALE_LOCK_TIMEOUT_MS = 30000; // Configurable constant

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
        const isStale = (now - existing.lastConnectedAt) > STALE_LOCK_TIMEOUT_MS
        if (!isStale) {
          return { acquired: false, status: 'connecting' }
        }
        // Stale lock, acquire it by updating and clear any previous error
        await ctx.db.patch(existing._id, {
          status: 'connecting',
          lastConnectedAt: now,
          error: undefined
        })
        return { acquired: true, status: 'connecting' }
      }

      // Failed or disconnected, update to connecting and clear any previous error
      await ctx.db.patch(existing._id, {
        status: 'connecting',
        lastConnectedAt: now,
        error: undefined
      })
      return { acquired: true, status: 'connecting' }
    }

    // No existing connection, insert new with connecting status (no error initially)
    await ctx.db.insert('mcpConnections', {
      serverName: args.serverName,
      status: 'connecting',
      lastConnectedAt: now,
      createdAt: now
      // error field not set (undefined by default)
    })
    return { acquired: true, status: 'connecting' }
  }
})

/**
 * Update connection status after connection attempt
 * Sets status to 'connected' or 'failed' with optional error message
 * Throws an error if no connection record exists for the given serverName
 * Clears error field when transitioning to non-failed states
 */
export const updateConnectionStatus = internalMutation({
  args: {
    serverName: v.string(),
    status: v.union(
      v.literal('connected'),
      v.literal('failed'),
      v.literal('disconnected')
    ),
    error: v.optional(v.string())
  },  handler: async (ctx, args) => {
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

    // Clear error field when transitioning to non-failed states
    await ctx.db.patch(existing._id, {
      status: args.status,
      lastConnectedAt: Date.now(),
      error: args.status === 'failed' ? args.error : undefined
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
        lastConnectedAt: args.connectedAt,
        // Clear error field for non-failed states (storeConnection doesn't receive error param)
        error: undefined
      })
    } else {
      await ctx.db.insert('mcpConnections', {
        serverName: args.serverName,
        status: args.status,
        lastConnectedAt: args.connectedAt,
        createdAt: args.connectedAt
        // error field not set (undefined by default)
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

/**
 * Get connection status for a specific server (internal query for polling)
 */
export const getConnectionStatus = internalQuery({
  args: { serverName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('mcpConnections')
      .withIndex('by_server', q => q.eq('serverName', args.serverName))
      .first()
  }
})

export const getConnections = query({
  handler: async (ctx) => {
    // Order by lastConnectedAt descending (most recently active connections first)
    // Uses the 'by_last_connected' index for performance
    return await ctx.db
      .query('mcpConnections')
      .withIndex('by_last_connected')
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


