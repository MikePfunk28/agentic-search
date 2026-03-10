/**
 * Convex Auth Configuration
 *
 * Providers:
 * - GitHub OAuth (requires AUTH_GITHUB_ID + AUTH_GITHUB_SECRET in Convex dashboard)
 * - Email/Password (built-in, no external config needed)
 * - Anonymous (temporary identity for unauthenticated users)
 *
 * Environment variables (set in Convex dashboard, NOT .env):
 * - AUTH_GITHUB_ID: GitHub OAuth App Client ID (from @auth/core convention: AUTH_<PROVIDER>_ID)
 * - AUTH_GITHUB_SECRET: GitHub OAuth App Client Secret (AUTH_<PROVIDER>_SECRET)
 * - AUTH_SECRET: Random secret for signing tokens (generate with `openssl rand -base64 32`)
 * - CONVEX_SITE_URL: Convex site URL (e.g. https://silent-marten-305.convex.site)
 */

import GitHub from "@auth/core/providers/github";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Password,
    Anonymous,
  ],
});
