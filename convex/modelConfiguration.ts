/**
 * Model Configuration Convex Functions
 *
 * Queries and mutations for managing user model configurations.
 * Each user can have multiple model configs (Ollama, OpenAI, Anthropic, etc.)
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all model configurations for the authenticated user
 */
export const listMyConfigs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }

    const configs = await ctx.db
      .query("modelConfigurations")
      .filter(q => q.eq(q.field("userId"), userId.subject))
      .collect();

    // Exclude sensitive fields from response
    return configs.map(config => ({
      ...config,
      // Exclude or obfuscate sensitive data
      baseUrl: config.baseUrl ? "***" : undefined,
    }));
  }
});

/**
 * Get the active model configuration for the authenticated user
 */
export const getActiveConfig = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Unauthorized: Authentication required");
    }

    const config = await ctx.db
      .query("modelConfigurations")
      .filter(q =>
        q.and(
          q.eq(q.field("userId"), userId.subject),
          q.eq(q.field("isActive"), true)
        )
      )
      .first();

    if (!config) {
      return null;
    }

    // Exclude sensitive fields
    return {
      ...config,
      baseUrl: config.baseUrl ? "***" : undefined,
    };
  }
});

/**
 * Create a new model configuration
 */
export const createConfig = mutation({
  args: {
    configName: v.string(),
    provider: v.union(
      v.literal("openai"),
      v.literal("anthropic"),
      v.literal("google"),
      v.literal("ollama"),
      v.literal("lm_studio"),
      v.literal("azure_openai")
    ),
    modelName: v.string(),
    baseUrl: v.optional(v.string()),
    hasApiKey: v.boolean(),
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthorized: Authentication required");
    }
    const userId = userIdentity.subject;

    const configId = await ctx.db.insert("modelConfigurations", {
      userId,
      configName: args.configName,
      provider: args.provider,
      modelName: args.modelName,
      baseUrl: args.baseUrl,
      hasApiKey: args.hasApiKey,
      temperature: args.temperature,
      maxTokens: args.maxTokens,
      isActive: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return configId;
  }
});

/**
 * Set a configuration as active (deactivates others)
 */
export const setActiveConfig = mutation({
  args: {
    configId: v.id("modelConfigurations"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthorized: Authentication required");
    }
    const userId = userIdentity.subject;

    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Configuration not found");
    }

    // Verify ownership
    if (config.userId !== userId) {
      throw new Error("Unauthorized: You do not own this configuration");
    }

    // Deactivate all other configs for this user
    const allConfigs = await ctx.db
      .query("modelConfigurations")
      .filter(q => q.eq(q.field("userId"), userId))
      .collect();

    for (const c of allConfigs) {
      if (c._id !== args.configId) {
        await ctx.db.patch(c._id, { isActive: false });
      }
    }

    // Activate the selected config
    await ctx.db.patch(args.configId, {
      isActive: true,
      updatedAt: Date.now(),
    });
  }
});
/**
 * Delete a model configuration
 */
export const deleteConfig = mutation({
  args: {
    configId: v.id("modelConfigurations"),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Unauthorized: Authentication required");
    }
    const userId = userIdentity.subject;

    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Configuration not found");
    }

    // Verify ownership before deletion
    if (config.userId !== userId) {
      throw new Error("Unauthorized: You do not own this configuration");
    }

    await ctx.db.delete(args.configId);
  }
});

