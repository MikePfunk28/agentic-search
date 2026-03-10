/**
 * User Preferences CRUD
 *
 * Uses the existing `userPreferences` table from schema.ts
 * Manages theme, search history toggle, analytics opt-in.
 */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the current user's preferences
 */
export const getPreferences = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

/**
 * Update or create user preferences
 */
export const updatePreferences = mutation({
  args: {
    theme: v.optional(v.string()),
    searchHistory: v.optional(v.boolean()),
    analytics: v.optional(v.boolean()),
    defaultModel: v.optional(v.id("modelConfigurations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized: Authentication required");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      const updates: Record<string, unknown> = { updatedAt: Date.now() };
      if (args.theme !== undefined) updates.theme = args.theme;
      if (args.searchHistory !== undefined) updates.searchHistory = args.searchHistory;
      if (args.analytics !== undefined) updates.analytics = args.analytics;
      if (args.defaultModel !== undefined) updates.defaultModel = args.defaultModel;
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    return await ctx.db.insert("userPreferences", {
      userId,
      theme: args.theme,
      searchHistory: args.searchHistory ?? true,
      analytics: args.analytics ?? true,
      defaultModel: args.defaultModel,
      updatedAt: Date.now(),
    });
  },
});
