/**
 * Convex Client Setup
 * Provides real-time connection to Convex backend for agentic search
 */

import { ConvexReactClient } from "convex/react";

// Initialize Convex client with deployment URL from environment
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || process.env.CONVEX_URL;

if (!CONVEX_URL) {
	throw new Error(
		"Missing CONVEX_URL environment variable. Please run 'npx convex dev' to set up Convex.",
	);
}

export const convexClient = new ConvexReactClient(CONVEX_URL);

// Export for type-safe usage in components
export type { ConvexReactClient };
