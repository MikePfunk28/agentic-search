/**
 * Convex Client Setup
 * Provides real-time connection to Convex backend for agentic search
 */

import { ConvexReactClient } from "convex/react";

// Initialize Convex client with deployment URL from environment, with safe fallback
// Wrap in try/catch because Cloudflare's Vite module runner throws on import.meta.env access in SSR
let CONVEX_URL: string;
try {
	CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "";
} catch {
	CONVEX_URL = "";
}
if (!CONVEX_URL) {
	CONVEX_URL =
		(typeof process !== "undefined" ? process.env?.CONVEX_URL : undefined) ||
		"https://astute-quail-141.convex.cloud";
}

export const convexClient = new ConvexReactClient(CONVEX_URL);

// Export for type-safe usage in components
export type { ConvexReactClient };
