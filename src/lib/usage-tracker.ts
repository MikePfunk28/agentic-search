/**
 * Client-Side Usage Tracker
 *
 * Sends usage data to Convex after API calls complete.
 * Works for both authenticated and anonymous users.
 *
 * Usage: Call trackApiUsage() after any external API call.
 */

import { api } from "../../convex/_generated/api";
import { convexClient } from "./convex";

/**
 * Track an external API call (Firecrawl, Tavily, Brave, Exa, LLM, etc.)
 * Fire-and-forget: errors are logged but don't break the flow.
 */
export async function trackApiUsage(params: {
	provider: string;
	endpoint: string;
	tokensUsed?: number;
	requestCount?: number;
	responseTimeMs: number;
	success: boolean;
	costEstimate?: number;
	metadata?: Record<string, unknown>;
}) {
	try {
		await convexClient.mutation(api.externalApiTracking.trackExternalApiCall, {
			provider: params.provider,
			endpoint: params.endpoint,
			tokensUsed: params.tokensUsed,
			requestCount: params.requestCount ?? 1,
			responseTimeMs: params.responseTimeMs,
			success: params.success,
			costEstimate: params.costEstimate,
			metadata: params.metadata,
		});
	} catch (error) {
		// Fire and forget - don't break the user's flow
		console.warn("[UsageTracker] Failed to track API usage:", error);
	}
}

/**
 * Track a search operation (wraps the existing usageTracking.trackSearch mutation)
 */
export async function trackSearch(params: {
	query: string;
	modelUsed?: string;
	tokensUsed?: number;
	executionTimeMs?: number;
	success: boolean;
	quality?: number;
}) {
	try {
		await convexClient.mutation(api.usageTracking.trackSearch, {
			query: params.query,
			modelUsed: params.modelUsed ?? "unknown",
			tokensUsed: params.tokensUsed ?? 0,
			executionTimeMs: params.executionTimeMs ?? 0,
			success: params.success,
			quality: params.quality,
		});
	} catch (error) {
		console.warn("[UsageTracker] Failed to track search:", error);
	}
}
