/**
 * Search Control API
 * Handles pause, resume, stop, and scope modification for active searches
 */

import { createFileRoute } from "@tanstack/react-router";
import { validateCsrfRequest, createCsrfErrorResponse } from "@/lib/csrf-protection";
import type { SearchScope } from "@/components/SearchProgressPanel";
import {
	setSearchPaused,
	stopSearch as stopSearchHelper,
	sendProgressUpdate,
} from "./progress";

// Store for search scopes and control state
const searchScopes = new Map<string, SearchScope>();
const stepApprovals = new Map<string, Set<string>>();
const stepModifications = new Map<string, Map<string, any>>();

export const Route = createFileRoute("/api/search/control")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				// CSRF Protection
				const validation = validateCsrfRequest(request);
				if (!validation.valid) {
					console.warn("[CSRF] Validation failed for /api/search/control:", validation.error);
					return createCsrfErrorResponse(validation.error!);
				}

				try {
					const { searchId, action, scope, stepId, modifications } = await request.json();

					if (!searchId || !action) {
						return new Response(
							JSON.stringify({ error: "searchId and action are required" }),
							{ status: 400, headers: { "Content-Type": "application/json" } }
						);
					}

					switch (action) {
						case "pause":
							setSearchPaused(searchId, true);
							return new Response(
								JSON.stringify({ success: true, action: "paused" }),
								{ status: 200, headers: { "Content-Type": "application/json" } }
							);

						case "resume":
							setSearchPaused(searchId, false);
							return new Response(
								JSON.stringify({ success: true, action: "resumed" }),
								{ status: 200, headers: { "Content-Type": "application/json" } }
							);

						case "stop":
							stopSearchHelper(searchId);
							searchScopes.delete(searchId);
							stepApprovals.delete(searchId);
							stepModifications.delete(searchId);
							return new Response(
								JSON.stringify({ success: true, action: "stopped" }),
								{ status: 200, headers: { "Content-Type": "application/json" } }
							);

						case "update_scope":
							if (!scope) {
								return new Response(
									JSON.stringify({ error: "scope is required for update_scope action" }),
									{ status: 400, headers: { "Content-Type": "application/json" } }
								);
							}
							searchScopes.set(searchId, scope);
							sendProgressUpdate(searchId, {
								type: "scope_updated",
								scope
							});
							return new Response(
								JSON.stringify({ success: true, action: "scope_updated" }),
								{ status: 200, headers: { "Content-Type": "application/json" } }
							);

						case "approve_step":
							if (!stepId) {
								return new Response(
									JSON.stringify({ error: "stepId is required for approve_step action" }),
									{ status: 400, headers: { "Content-Type": "application/json" } }
								);
							}
							if (!stepApprovals.has(searchId)) {
								stepApprovals.set(searchId, new Set());
							}
							stepApprovals.get(searchId)!.add(stepId);
							sendProgressUpdate(searchId, {
								type: "step_approved",
								stepId
							});
							return new Response(
								JSON.stringify({ success: true, action: "step_approved" }),
								{ status: 200, headers: { "Content-Type": "application/json" } }
							);

						case "modify_step":
							if (!stepId || !modifications) {
								return new Response(
									JSON.stringify({ error: "stepId and modifications are required for modify_step action" }),
									{ status: 400, headers: { "Content-Type": "application/json" } }
								);
							}
							if (!stepModifications.has(searchId)) {
								stepModifications.set(searchId, new Map());
							}
							stepModifications.get(searchId)!.set(stepId, modifications);
							sendProgressUpdate(searchId, {
								type: "step_modified",
								stepId,
								modifications
							});
							return new Response(
								JSON.stringify({ success: true, action: "step_modified" }),
								{ status: 200, headers: { "Content-Type": "application/json" } }
							);

						default:
							return new Response(
								JSON.stringify({ error: `Unknown action: ${action}` }),
								{ status: 400, headers: { "Content-Type": "application/json" } }
							);
					}
				} catch (error) {
					console.error("Search control error:", error);
					return new Response(
						JSON.stringify({ error: "Failed to process control request" }),
						{ status: 500, headers: { "Content-Type": "application/json" } }
					);
				}
			},
		},
	},
});

/**
 * Helper to get current scope for a search
 */
export function getSearchScope(searchId: string): SearchScope | undefined {
	return searchScopes.get(searchId);
}

/**
 * Helper to check if a step is approved
 */
export function isStepApproved(searchId: string, stepId: string): boolean {
	return stepApprovals.get(searchId)?.has(stepId) || false;
}

/**
 * Helper to get step modifications
 */
export function getStepModifications(searchId: string, stepId: string): any | undefined {
	return stepModifications.get(searchId)?.get(stepId);
}
