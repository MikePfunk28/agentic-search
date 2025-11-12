/**
 * Convex Auth Provider
 *
 * Wraps the app with Convex Auth context, providing authentication state
 * and actions (signIn, signOut) to all child components.
 */

import { ConvexAuthProvider as ConvexAuthProviderBase } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
	throw new Error("Missing required environment variable: VITE_CONVEX_URL");
}

// Create a single shared Convex client instance
const convexClient = new ConvexReactClient(CONVEX_URL);
/**
 * Provides a Convex authentication context to descendant components using a shared client.
 *
 * @param children - React nodes that will be rendered inside the Convex authentication provider.
 * @returns A JSX element that wraps `children` with the Convex authentication provider.
 */
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