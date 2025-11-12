import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProvider } from "convex/react";
import { convexClient } from "./auth-provider";

// Create query client using the shared Convex client
const convexQueryClient = new ConvexQueryClient(convexClient);

/**
 * Wraps children with a ConvexProvider that supplies the shared Convex client.
 *
 * @param children - React node(s) to render inside the ConvexProvider
 * @returns The provided children wrapped by a ConvexProvider using `convexClient`
 */
export default function AppConvexProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ConvexProvider client={convexClient}>
			{children}
		</ConvexProvider>
	);
}

// Export query client for use with TanStack Query
export { convexQueryClient };