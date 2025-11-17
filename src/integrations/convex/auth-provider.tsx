/**
 * Convex Auth Provider
 *
 * Wraps the app with Convex Auth context, providing authentication state
 * and actions (signIn, signOut) to all child components.
 */

import { ConvexAuthProvider as ConvexAuthProviderBase } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;

// During SSR build, CONVEX_URL might not be available yet
// Use a placeholder that will be replaced at runtime
const convexClient = CONVEX_URL 
	? new ConvexReactClient(CONVEX_URL)
	: new ConvexReactClient("https://placeholder.convex.cloud");
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