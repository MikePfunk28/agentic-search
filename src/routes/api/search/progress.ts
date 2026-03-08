/**
 * Search Progress Stream API
 * Server-Sent Events endpoint for real-time search progress updates
 *
 * Uses an event buffer per searchId so events emitted by the background
 * search before the SSE client connects are never lost.
 */

import { createFileRoute } from "@tanstack/react-router";
import { validateCsrfRequest, createCsrfErrorResponse } from "@/lib/csrf-protection";
import type { SearchProgressStep } from "@/components/SearchProgressPanel";

// ---------------------------------------------------------------------------
// CRITICAL: Use globalThis so the Maps are shared across ALL module
// evaluations inside the same worker.  Vite's dev server evaluates each
// route file as a separate ESM module, which means plain module-level
// variables in progress.ts and stream.ts point at DIFFERENT Map instances.
// globalThis is the one true singleton within a workerd isolate.
// ---------------------------------------------------------------------------
interface SearchSession {
	controller: ReadableStreamDefaultController;
	isPaused: boolean;
	isStopped: boolean;
}
interface EventBuffer {
	events: string[];
	createdAt: number;
}

const g = globalThis as any;
if (!g.__agSearchActiveSearches) {
	g.__agSearchActiveSearches = new Map<string, SearchSession>();
}
if (!g.__agSearchEventBuffers) {
	g.__agSearchEventBuffers = new Map<string, EventBuffer>();
}

const activeSearches: Map<string, SearchSession> = g.__agSearchActiveSearches;
const eventBuffers: Map<string, EventBuffer> = g.__agSearchEventBuffers;
const BUFFER_TTL_MS = 60_000;

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
						// Register the controller so sendProgressUpdate can push to it
						const existingSearch = activeSearches.get(searchId);
						if (existingSearch) {
							activeSearches.set(searchId, {
								...existingSearch,
								controller,
							});
						} else {
							activeSearches.set(searchId, {
								controller,
								isPaused: false,
								isStopped: false,
							});
						}

						// Send initial connection message
						const connData = JSON.stringify({ type: "connected", searchId });
						controller.enqueue(encoder.encode(`data: ${connData}\n\n`));

						// Flush any buffered events that arrived before this SSE connected
						const buffered = eventBuffers.get(searchId);
						if (buffered && buffered.events.length > 0) {
							console.log(`[SSE] Flushing ${buffered.events.length} buffered events for searchId=${searchId}`);
							for (const raw of buffered.events) {
								try {
									controller.enqueue(encoder.encode(raw));
								} catch {
									break; // controller closed mid-flush
								}
							}
							eventBuffers.delete(searchId);
						}

						// Setup cleanup on client disconnect
						request.signal.addEventListener("abort", () => {
							try {
								controller.close();
							} catch {
								// Controller may already be closed
							}
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
 * Send a progress update to a specific search session.
 * If the SSE stream is not yet connected, the event is buffered so
 * it can be flushed when the client finally connects.
 */
export function sendProgressUpdate(searchId: string, data: any) {
	const search = activeSearches.get(searchId);
	const encoded = `data: ${JSON.stringify(data)}\n\n`;

	// Happy path: SSE stream is connected
	if (search && !search.isStopped) {
		try {
			const encoder = new TextEncoder();
			search.controller.enqueue(encoder.encode(encoded));
			return true;
		} catch (error) {
			console.error(`[SSE] Failed to send progress update for ${searchId}:`, error);
			return false;
		}
	}

	// SSE not connected yet - buffer the event
	let buf = eventBuffers.get(searchId);
	if (!buf) {
		buf = { events: [], createdAt: Date.now() };
		eventBuffers.set(searchId, buf);

		// Auto-cleanup stale buffers after TTL
		setTimeout(() => {
			eventBuffers.delete(searchId);
		}, BUFFER_TTL_MS);
	}
	buf.events.push(encoded);
	console.log(`[SSE] Buffered event for searchId=${searchId} (${buf.events.length} total)`);
	return true;
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
		try {
			search.controller.close();
		} catch {
			// Controller may already be closed
		}
		activeSearches.delete(searchId);
	}
	eventBuffers.delete(searchId);
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
export function sendResults(searchId: string, results: any[], summary?: any) {
	sendProgressUpdate(searchId, { type: "results", results, summary });
	// Close the stream after sending results
	const search = activeSearches.get(searchId);
	if (search) {
		setTimeout(() => {
			try {
				search.controller.close();
			} catch {
				// Controller may already be closed
			}
			activeSearches.delete(searchId);
			eventBuffers.delete(searchId);
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
			try {
				search.controller.close();
			} catch {
				// Controller may already be closed
			}
			activeSearches.delete(searchId);
			eventBuffers.delete(searchId);
		}, 1000);
	}
}
