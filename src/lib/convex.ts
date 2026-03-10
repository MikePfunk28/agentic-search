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
	console.warn(
		"[convex] VITE_CONVEX_URL is not set. Convex queries will fail until configured in environment variables or wrangler.toml."
	);
}

export const convexClient = VITE_CONVEX_URL
	? new ConvexReactClient(VITE_CONVEX_URL)
	: (null as unknown as ConvexReactClient); // Will fail gracefully on use rather than crash SSR cold start

// Export for type-safe usage in components
export type { ConvexReactClient };
