/**
 * Convex Client Setup
 * Provides real-time connection to Convex backend for agentic search
 */

import { ConvexReactClient } from "convex/react";

// Initialize Convex client with deployment URL from environment, with safe fallback
// Wrap in try/catch because Cloudflare's Vite module runner throws on import.meta.env access in SSR
let VITE_CONVEX_URL: string;
try {
	VITE_CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "";
} catch {
	VITE_CONVEX_URL = "";
}
if (!VITE_CONVEX_URL) {
	VITE_CONVEX_URL =
		(typeof process !== "undefined" ? process.env?.VITE_CONVEX_URL : undefined) ||
		"";
}

if (!VITE_CONVEX_URL) {
	console.error("[Convex] VITE_CONVEX_URL is not set. The Convex client will not connect. This variable must be configured in the Cloudflare dashboard under Settings > Variables.");
}

export const convexClient = new ConvexReactClient(VITE_CONVEX_URL);

// Export for type-safe usage in components
export type { ConvexReactClient };
