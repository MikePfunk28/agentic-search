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
    // TODO: Add authentication when ready
    return await ctx.db
      .query("modelConfigurations")
      .collect();
  }
});

/**
 * Get the active model configuration for the authenticated user
 */
export const getActiveConfig = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Add authentication when ready
    return await ctx.db
      .query("modelConfigurations")
      .filter(q => q.eq(q.field("isActive"), true))
      .first();
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
    // TODO: Add authentication and get real userId
    const userId = "anonymous";

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
    // TODO: Add authentication
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Configuration not found");
    }

    // Deactivate all other configs
    const allConfigs = await ctx.db
      .query("modelConfigurations")
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
    // TODO: Add authentication
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Configuration not found");
    }

    await ctx.db.delete(args.configId);
  }
});