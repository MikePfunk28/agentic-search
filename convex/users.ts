/**
 * User Profile Queries and Mutations
 *
 * Uses the `users` table from Convex Auth (created by authTables).
 * Provides currentUser query and updateProfile mutation.
 */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the currently authenticated user's profile
 * Returns null if not authenticated
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const storedUser = await ctx.db.get(userId);
    const identity = await ctx.auth.getUserIdentity();

    const resolvedName =
      storedUser?.name ??
      (typeof identity?.name === "string" ? identity.name : undefined) ??
      (typeof (identity as any)?.nickname === "string"
        ? (identity as any).nickname
        : undefined);
    const resolvedEmail =
      storedUser?.email ??
      (typeof identity?.email === "string" ? identity.email : undefined);
    const resolvedImage =
      storedUser?.image ??
      (typeof (identity as any)?.pictureUrl === "string"
        ? (identity as any).pictureUrl
        : undefined) ??
      (typeof (identity as any)?.picture === "string"
        ? (identity as any).picture
        : undefined) ??
      (typeof (identity as any)?.avatarUrl === "string"
        ? (identity as any).avatarUrl
        : undefined);

    return {
      ...(storedUser ?? { _id: userId }),
      name: resolvedName,
      email: resolvedEmail,
      image: resolvedImage,
      isAnonymous: storedUser?.isAnonymous === true,
    };
  },
});

/**
 * Update the current user's display name
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized: Authentication required");

    const updates: Record<string, string> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.image !== undefined) updates.image = args.image;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }

    return await ctx.db.get(userId);
  },
});
