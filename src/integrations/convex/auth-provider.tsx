/**
 * Convex Auth Provider
 *
 * Wraps the app with Convex Auth context, providing authentication state
 * and actions (signIn, signOut) to all child components.
 */

import { ConvexAuthProvider as ConvexAuthProviderBase } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL || "https://astute-quail-141.convex.cloud";
if (!(import.meta as any).env.VITE_CONVEX_URL) {
	console.error("missing envar VITE_CONVEX_URL, using fallback");
}

// Create a single shared Convex client instance
const convexClient = new ConvexReactClient(CONVEX_URL);
export default function ConvexAuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ConvexAuthProviderBase client={convexClient}>
			{children}
		</ConvexAuthProviderBase>
	);
}

// Export the client for use in other files if needed
export { convexClient };