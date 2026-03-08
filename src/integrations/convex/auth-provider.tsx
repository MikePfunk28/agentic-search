/**
 * Convex Auth Provider
 *
 * Wraps the app with Convex Auth context, providing authentication state
 * and actions (signIn, signOut) to all child components.
 */

import { ConvexAuthProvider as ConvexAuthProviderBase } from "@convex-dev/auth/react";
import { convexClient } from "../../lib/convex";
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