/**
 * Convex Auth Configuration
 *
 * Server-side authentication with WorkOS OAuth using Auth.js provider.
 * Uses existingVITE_WORKOS_CLIENT_ID and VITE_WORKOS_API_HOSTNAME environment variables.
 */

import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    {
      id: "workos",
      type: "oauth",
      name: "WorkOS",
      issuer: `https://${process.env.VITE_WORKOS_API_HOSTNAME}`,
      clientId: process.env.VITE_WORKOS_CLIENT_ID,
      clientSecret: process.env.VITE_WORKOS_CLIENT_ID,
      authorization: {
        url: `https://${process.env.VITE_WORKOS_API_HOSTNAME}/oauth/authorize`,
        params: {
          scope: "openid profile email",
        },
      },
      token: `https://${process.env.VITE_WORKOS_API_HOSTNAME}/oauth/token`,
      userinfo: `https://${process.env.VITE_WORKOS_API_HOSTNAME}/user_info`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
});