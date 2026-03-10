/**
 * Unified App Auth Hook
 *
 * Wraps Convex Auth to provide:
 * - isAuthenticated / isLoading state
 * - signIn / signOut actions
 * - Current user profile (from Convex users table)
 *
 * Replaces the WorkOS-specific useUser.tsx hook.
 */

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAppAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  // Only fetch user profile when authenticated
  const user = useQuery(
    api.users.currentUser,
    isAuthenticated ? {} : "skip"
  );

  return {
    user: user ?? null,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    /** Whether the user is anonymous (signed in but no real account) */
    isAnonymous: user?.isAnonymous === true,
  };
}
