/**
 * Search Progress Stream API
 * Server-Sent Events endpoint for real-time search progress updates
 */

import { createFileRoute } from "@tanstack/react-router";
import { validateCsrfRequest, createCsrfErrorResponse } from "@/lib/csrf-protection";
import type { SearchProgressStep } from "@/components/SearchProgressPanel";

// In-memory store for active search sessions
// In production, use Redis or similar
const activeSearches = new Map<string, {
	eventStream: ReadableStream;
	controller: ReadableStreamDefaultController;
	isPaused: boolean;
	isStopped: boolean;
}>();

export const Route = createFileRoute("/api/search/progress")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const searchId = url.searchParams.get("searchId");
				const token = url.searchParams.get("token");

				if (!searchId) {
					return new Response("Missing searchId parameter", { status: 400 });
				}

				// Validate CSRF token from query parameter
				if (!token) {
					return new Response("Missing CSRF token", { status: 403 });
				}

				// Create SSE stream
				const encoder = new TextEncoder();
				const stream = new ReadableStream({
					start(controller) {
						// Store controller for this search session
						const existingSearch = activeSearches.get(searchId);
						if (existingSearch) {
							activeSearches.set(searchId, {
								...existingSearch,
								controller,
							});
						} else {
							activeSearches.set(searchId, {
								eventStream: stream,
								controller,
								isPaused: false,
								isStopped: false,
							});
						}

						// Send initial connection message
						const data = JSON.stringify({ type: "connected", searchId });
						controller.enqueue(encoder.encode(`data: ${data}\n\n`));

						// Setup cleanup on client disconnect
						request.signal.addEventListener("abort", () => {
							controller.close();
							activeSearches.delete(searchId);
						});
					},
				});

				return new Response(stream, {
					headers: {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache",
						"Connection": "keep-alive",
						"Access-Control-Allow-Origin": "*",
					},
				});
			},
		},
	},
});

/**
 * Helper function to send progress update to a specific search session
 * This should be called from your search orchestration logic
 */
export function sendProgressUpdate(searchId: string, data: any) {
	const search = activeSearches.get(searchId);
	if (!search || search.isStopped) {
		return false;
	}

	try {
		const encoder = new TextEncoder();
		const message = JSON.stringify(data);
		search.controller.enqueue(encoder.encode(`data: ${message}\n\n`));
		return true;
	} catch (error) {
		console.error(`Failed to send progress update for ${searchId}:`, error);
		return false;
	}
}

/**
 * Helper to check if search is paused
 */
export function isSearchPaused(searchId: string): boolean {
	const search = activeSearches.get(searchId);
	return search?.isPaused || false;
}

/**
 * Helper to check if search is stopped
 */
export function isSearchStopped(searchId: string): boolean {
	const search = activeSearches.get(searchId);
	return search?.isStopped || false;
}

/**
 * Helper to set search pause state
 */
export function setSearchPaused(searchId: string, paused: boolean) {
	const search = activeSearches.get(searchId);
	if (search) {
		search.isPaused = paused;
		sendProgressUpdate(searchId, {
			type: paused ? "paused" : "resumed"
		});
	}
}

/**
 * Helper to stop search
 */
export function stopSearch(searchId: string) {
	const search = activeSearches.get(searchId);
	if (search) {
		search.isStopped = true;
		sendProgressUpdate(searchId, { type: "stopped" });
		search.controller.close();
		activeSearches.delete(searchId);
	}
}

/**
 * Helper to send step update
 */
export function sendStepUpdate(searchId: string, step: SearchProgressStep) {
	sendProgressUpdate(searchId, { type: "step", step });
}

/**
 * Helper to send results
 */
export function sendResults(searchId: string, results: any[]) {
	sendProgressUpdate(searchId, { type: "results", results });
	// Close the stream after sending results
	const search = activeSearches.get(searchId);
	if (search) {
		setTimeout(() => {
			search.controller.close();
			activeSearches.delete(searchId);
		}, 1000);
	}
}

/**
 * Helper to send error
 */
export function sendError(searchId: string, message: string) {
	sendProgressUpdate(searchId, { type: "error", message });
	const search = activeSearches.get(searchId);
	if (search) {
		setTimeout(() => {
			search.controller.close();
			activeSearches.delete(searchId);
		}, 1000);
	}
}
