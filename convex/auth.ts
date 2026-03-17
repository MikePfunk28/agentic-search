/**
 * Convex Auth Configuration
 *
 * Providers:
 * - GitHub OAuth (supports AUTH_GITHUB_ID / AUTH_GITHUB_SECRET and the legacy
 *   GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET names for backward compatibility)
 * - Email/Password (built-in, no external config needed)
 * - Anonymous (temporary identity for unauthenticated users)
 *
 * Environment variables (set in Convex dashboard, NOT .env):
 * - AUTH_GITHUB_ID or GITHUB_CLIENT_ID: GitHub OAuth App Client ID
 * - AUTH_GITHUB_SECRET or GITHUB_CLIENT_SECRET: GitHub OAuth App Client Secret
 * - AUTH_SECRET: Random secret for signing tokens (generate with `openssl rand -base64 32`)
 * - CONVEX_SITE_URL: Convex site URL (e.g. https://silent-marten-305.convex.site)
 */

import GitHub from "@auth/core/providers/github";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

const githubClientId =
	process.env.AUTH_GITHUB_ID || process.env.GITHUB_CLIENT_ID;
const githubClientSecret =
	process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET;

const providers = [];

if (githubClientId && githubClientSecret) {
	providers.push(
		GitHub({
			clientId: githubClientId,
			clientSecret: githubClientSecret,
		}),
	);
}

providers.push(Password, Anonymous);

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers,
});
