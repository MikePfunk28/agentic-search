/**
 * Secure API Key Storage with Convex
 *
 * SECURITY: API keys are stored server-side in Convex, NOT in browser localStorage
 * Each user can only access their own API keys via authenticated mutations/queries
 *
 * This replaces the insecure "encrypted localStorage" pattern which was vulnerable
 * because the encryption key was stored in the browser.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Save or update an API key for the authenticated user
 * Keys are encrypted at rest by Convex's database encryption
 */
export const saveApiKey = mutation({
  args: {
    configId: v.id("modelConfigurations"),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthorized: Authentication required");
    }
    const userId = userIdentity.subject;

    // Verify user owns this configuration
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Configuration not found");
    }
    if (config.userId !== userId) {
      throw new Error("Unauthorized: You do not own this configuration");
    }

    // Check if API key already exists for this config
    const existing = await ctx.db
      .query("apiKeys")
      .withIndex("by_user_config", (q) =>
        q.eq("userId", userId).eq("configId", args.configId)
      )
      .first();

    if (existing) {
      // Update existing key
      await ctx.db.patch(existing._id, {
        encryptedKey: args.apiKey, // Convex encrypts at rest
        updatedAt: Date.now(),
      });
    } else {
      // Create new key
      await ctx.db.insert("apiKeys", {
        userId,
        configId: args.configId,
        encryptedKey: args.apiKey, // Convex encrypts at rest
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Get API key for a specific model configuration
 * Only returns keys owned by the authenticated user
 */
export const getApiKey = query({
  args: {
    configId: v.id("modelConfigurations"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthorized: Authentication required");
    }
    const userId = userIdentity.subject;

    // Verify user owns this configuration
    const config = await ctx.db.get(args.configId);
    if (!config) {
      return null;
    }
    if (config.userId !== userId) {
      throw new Error("Unauthorized: You do not own this configuration");
    }

    // Get API key
    const apiKeyDoc = await ctx.db
      .query("apiKeys")
      .withIndex("by_user_config", (q) =>
        q.eq("userId", userId).eq("configId", args.configId)
      )
      .first();

    return apiKeyDoc ? apiKeyDoc.encryptedKey : null;
  },
});

/**
 * Delete API key for a specific configuration
 */
export const deleteApiKey = mutation({
  args: {
    configId: v.id("modelConfigurations"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthorized: Authentication required");
    }
    const userId = userIdentity.subject;

    // Verify user owns this configuration
    const config = await ctx.db.get(args.configId);
    if (!config) {
      return;
    }
    if (config.userId !== userId) {
      throw new Error("Unauthorized: You do not own this configuration");
    }

    // Delete API key
    const apiKeyDoc = await ctx.db
      .query("apiKeys")
      .withIndex("by_user_config", (q) =>
        q.eq("userId", userId).eq("configId", args.configId)
      )
      .first();

    if (apiKeyDoc) {
      await ctx.db.delete(apiKeyDoc._id);
    }
  },
});

/**
 * List all API keys for the authenticated user (masked for display)
 */
export const listApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthorized: Authentication required");
    }
    const userId = userIdentity.subject;

    const apiKeys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Return masked keys for display
    return apiKeys.map((key) => ({
      configId: key.configId,
      masked: `${key.encryptedKey.substring(0, 8)}...${key.encryptedKey.substring(key.encryptedKey.length - 4)}`,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    }));
  },
});
