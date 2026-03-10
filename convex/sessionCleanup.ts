/**
 * Session Cleanup - Anonymous User Data Expiry
 *
 * Deletes API keys and temporary data for anonymous users
 * whose sessions have expired.
 */

import { internalMutation } from "./_generated/server";

/**
 * Clean up expired anonymous user data
 * Deletes API keys for users marked as anonymous whose sessions have expired
 */
export const cleanupAnonymousData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Find all anonymous users
    const anonymousUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isAnonymous"), true))
      .collect();

    let cleanedCount = 0;

    for (const user of anonymousUsers) {
      // Check if user has any active sessions
      const activeSessions = await ctx.db
        .query("authSessions")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();

      // If no active sessions, clean up their data
      if (activeSessions.length === 0) {
        // Delete their API keys
        const apiKeys = await ctx.db
          .query("apiKeys")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        for (const key of apiKeys) {
          await ctx.db.delete(key._id);
        }

        // Delete their model configurations
        const configs = await ctx.db
          .query("modelConfigurations")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        for (const config of configs) {
          await ctx.db.delete(config._id);
        }

        cleanedCount++;
      }
    }

    return { cleanedCount, checkedCount: anonymousUsers.length };
  },
});
