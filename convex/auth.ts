/**
 * Convex Auth Utilities
 *
 * Helper functions for getting authenticated user context in Convex functions.
 * Import these in your queries/mutations to access the current user.
 */

import type { QueryCtx, MutationCtx } from "./_generated/server";
import { auth } from "./auth.config";

/**
 * Get the current authenticated user ID
 * Returns null if not authenticated
 */
export async function getCurrentUserId(
  ctx: QueryCtx | MutationCtx
): Promise<string | null> {
  return await auth.getUserId(ctx);
}

/**
 * Get the current authenticated user ID or throw an error
 * Use this when authentication is required
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
): Promise<string> {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

/**
 * Get the full user identity (includes email, name, etc.)
 * Returns null if not authenticated
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  return await auth.getUserIdentity(ctx);
}
