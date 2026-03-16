/**
 * useSearchProgress Hook
 * Manages real-time search progress updates via Server-Sent Events
 * Provides human-in-the-loop controls for pausing, resuming, and modifying searches
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type {
	SearchProgressStep,
	SearchScope,
	SearchStepModifications,
} from "../components/SearchProgressPanel";
import { getClientSearchConfig, getSearchApiKeys } from "../lib/model-store";
import { researchStorage } from "../lib/results-storage";
import type { SearchResult } from "../lib/types";
import type { UnifiedSearchResult } from "../lib/unified-search-orchestrator";

export interface SearchProgressState {
	isSearching: boolean;
	isPaused: boolean;
	steps: SearchProgressStep[];
	scope: SearchScope;
	error: string | null;
}

export interface UseSearchProgressReturn extends SearchProgressState {
	startSearch: (query: string, initialScope: SearchScope) => Promise<void>;
	pauseSearch: () => void;
	resumeSearch: () => void;
	stopSearch: () => void;
	updateScope: (scope: SearchScope) => void;
	approveStep: (stepId: string) => void;
	modifyStep: (stepId: string, modifications: SearchStepModifications) => void;
}

export interface SearchCompletionSummary {
	query: string;
	modelUsed: string;
	provider: string;
	totalTokens: number;
	totalProcessingTime: number;
	addMetrics?: UnifiedSearchResult["addMetrics"];
	parallelResults?: UnifiedSearchResult["parallelResults"];
	reasoningSteps?: UnifiedSearchResult["reasoningSteps"];
	availableProviders?: string[];
	usedFallbackCache?: boolean;
	storageId?: string;
}

export function useSearchProgress(
	onResults?: (
		results: SearchResult[],
		summary?: SearchCompletionSummary,
	) => void,
): UseSearchProgressReturn {
	const [state, setState] = useState<SearchProgressState>(() => {
		const keys = getSearchApiKeys();
		return {
			isSearching: false,
			isPaused: false,
			steps: [],
			scope: {
				sources: {
					duckduckgo: true,
					wikipedia: true,
					tavily: !!keys.tavily,
					exa: !!keys.exa,
					firecrawl: !!keys.firecrawl,
					brave: !!keys.brave,
					academic: false,
					news: false,
				},
				maxResults: 20,
				useReasoning: true,
				useSegmentation: false,
			},
			error: null,
		};
	});

	const eventSourceRef = useRef<EventSource | null>(null);
	const searchIdRef = useRef<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);
	const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			if (safetyTimeoutRef.current) {
				clearTimeout(safetyTimeoutRef.current);
			}
		};
	}, []);

	const addStep = useCallback((step: Omit<SearchProgressStep, "timestamp">) => {
		setState((prev) => ({
			...prev,
			steps: [...prev.steps, { ...step, timestamp: Date.now() }],
		}));
	}, []);

	const updateStep = useCallback(
		(stepId: string, updates: Partial<SearchProgressStep>) => {
			setState((prev) => ({
				...prev,
				steps: prev.steps.map((step) =>
					step.id === stepId ? { ...step, ...updates } : step,
				),
			}));
		},
		[],
	);

	const startSearch = useCallback(
		async (query: string, initialScope: SearchScope) => {
			// Close any previous in-flight search stream before starting a new one
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
				eventSourceRef.current = null;
			}
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			if (safetyTimeoutRef.current) {
				clearTimeout(safetyTimeoutRef.current);
				safetyTimeoutRef.current = null;
			}

			// Reset state
			setState({
				isSearching: true,
				isPaused: false,
				steps: [],
				scope: initialScope,
				error: null,
			});

			// Create new abort controller
			abortControllerRef.current = new AbortController();
			searchIdRef.current = null;

			try {
				// Get CSRF token from API endpoint
				const csrfResponse = await fetch("/api/csrf-token");
				if (!csrfResponse.ok) {
					throw new Error("Failed to fetch CSRF token");
				}
				const { token: csrfToken } = await csrfResponse.json();

				// Get model config from unified store
				const clientConfig = getClientSearchConfig();

				// POST to /api/search/stream — the response itself is an SSE
				// stream.  No separate EventSource/GET endpoint needed.
				// This avoids the cross-isolate state problem in workerd/Vite.
				const response = await fetch("/api/search/stream", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-CSRF-Token": csrfToken,
					},
					body: JSON.stringify({
						query,
						scope: initialScope,
						modelConfig: clientConfig.modelConfig,
						modelConfigs: clientConfig.modelConfigs,
						searchApiKeys: clientConfig.searchApiKeys,
					}),
					signal: abortControllerRef.current.signal,
				});

				if (!response.ok) {
					throw new Error(`Search failed: ${response.status}`);
				}

				if (!response.body) {
					throw new Error("Server returned no streaming body");
				}

				// Track whether we've received any real progress events
				let receivedProgressEvents = false;

				// Safety timeout: if no progress events arrive within 60s
				safetyTimeoutRef.current = setTimeout(() => {
					if (!receivedProgressEvents) {
						console.error(
							"[SearchProgress] Safety timeout: no progress events received within 60s",
						);
						setState((prev) => ({
							...prev,
							isSearching: false,
							error:
								"Search timed out. Check your TanStack Start server logs, search API keys, and any optional model endpoints.",
						}));
						abortControllerRef.current?.abort();
					}
				}, 60000);

				// Read the streaming SSE response
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let sseBuffer = "";

				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						sseBuffer += decoder.decode(value, { stream: true });

						// SSE events are separated by double-newline
						let eventEnd = sseBuffer.indexOf("\n\n");
						while (eventEnd !== -1) {
							const eventText = sseBuffer.slice(0, eventEnd);
							sseBuffer = sseBuffer.slice(eventEnd + 2);

							for (const line of eventText.split("\n")) {
								if (!line.startsWith("data: ")) continue;
								try {
									const data = JSON.parse(line.slice(6));

									// Any non-connected event counts as progress
									if (data.type !== "connected") {
										receivedProgressEvents = true;
										if (safetyTimeoutRef.current) {
											clearTimeout(safetyTimeoutRef.current);
											safetyTimeoutRef.current = null;
										}
									}

									switch (data.type) {
										case "connected":
											if (typeof data.searchId === "string") {
												searchIdRef.current = data.searchId;
											}
											break;

										case "step":
											if (data.step.status === "completed") {
												updateStep(data.step.id, data.step);
											} else {
												addStep(data.step);
											}
											break;

										case "step_update":
											updateStep(data.stepId, data.updates);
											break;

										case "results":
											if (
												data.summary?.query &&
												Array.isArray(data.results) &&
												data.results.length > 0
											) {
												try {
													await researchStorage.storeResults(
														data.summary.query,
														data.results,
														`${data.summary.provider || "web-only"}:${data.summary.modelUsed || "none"}`,
														{
															addScore: data.summary.addMetrics?.overallScore,
															tokensUsed: data.summary.totalTokens,
															executionTimeMs: data.summary.totalProcessingTime,
														},
													);
												} catch (storageError) {
													console.error(
														"[SearchProgress] Failed to persist search results:",
														storageError,
													);
												}
											}
											await Promise.resolve(
												onResults?.(data.results, data.summary),
											);
											setState((prev) => ({ ...prev, isSearching: false }));
											break;

										case "error":
											setState((prev) => ({
												...prev,
												isSearching: false,
												error: data.message,
											}));
											break;

										case "paused":
											setState((prev) => ({ ...prev, isPaused: true }));
											break;

										case "resumed":
											setState((prev) => ({ ...prev, isPaused: false }));
											break;

										case "stopped":
											setState((prev) => ({
												...prev,
												isSearching: false,
												isPaused: false,
											}));
											break;
									}
								} catch {
									// ignore malformed SSE data lines
								}
							}

							eventEnd = sseBuffer.indexOf("\n\n");
						}
					}
				} catch (err) {
					// AbortError is expected when user cancels
					if (err instanceof DOMException && err.name === "AbortError") {
						return;
					}
					throw err;
				} finally {
					setState((prev) =>
						prev.isSearching ? { ...prev, isSearching: false } : prev,
					);
					if (safetyTimeoutRef.current) {
						clearTimeout(safetyTimeoutRef.current);
						safetyTimeoutRef.current = null;
					}
				}
			} catch (error) {
				console.error("Search start error:", error);
				setState((prev) => ({
					...prev,
					isSearching: false,
					error: error instanceof Error ? error.message : "Search failed",
				}));
			}
		},
		[addStep, updateStep, onResults],
	);

	const pauseSearch = useCallback(async () => {
		if (!searchIdRef.current) return;

		try {
			const csrfResponse = await fetch("/api/csrf-token");
			const { token: csrfToken } = await csrfResponse.json();

			await fetch(`/api/search/control`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					searchId: searchIdRef.current,
					action: "pause",
				}),
			});

			setState((prev) => ({ ...prev, isPaused: true }));
		} catch (error) {
			console.error("Failed to pause search:", error);
		}
	}, []);

	const resumeSearch = useCallback(async () => {
		if (!searchIdRef.current) return;

		try {
			const csrfResponse = await fetch("/api/csrf-token");
			const { token: csrfToken } = await csrfResponse.json();

			await fetch(`/api/search/control`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					searchId: searchIdRef.current,
					action: "resume",
				}),
			});

			setState((prev) => ({ ...prev, isPaused: false }));
		} catch (error) {
			console.error("Failed to resume search:", error);
		}
	}, []);

	const stopSearch = useCallback(async () => {
		if (!searchIdRef.current) return;

		try {
			const csrfResponse = await fetch("/api/csrf-token");
			const { token: csrfToken } = await csrfResponse.json();

			await fetch(`/api/search/control`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					searchId: searchIdRef.current,
					action: "stop",
				}),
			});

			setState((prev) => ({ ...prev, isSearching: false, isPaused: false }));

			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			if (safetyTimeoutRef.current) {
				clearTimeout(safetyTimeoutRef.current);
				safetyTimeoutRef.current = null;
			}
		} catch (error) {
			console.error("Failed to stop search:", error);
		}
	}, []);

	const updateScope = useCallback(async (scope: SearchScope) => {
		if (!searchIdRef.current) return;

		try {
			const csrfResponse = await fetch("/api/csrf-token");
			const { token: csrfToken } = await csrfResponse.json();

			await fetch(`/api/search/control`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					searchId: searchIdRef.current,
					action: "update_scope",
					scope,
				}),
			});

			setState((prev) => ({ ...prev, scope }));
		} catch (error) {
			console.error("Failed to update scope:", error);
		}
	}, []);

	const approveStep = useCallback(async (stepId: string) => {
		if (!searchIdRef.current) return;

		try {
			const csrfResponse = await fetch("/api/csrf-token");
			const { token: csrfToken } = await csrfResponse.json();

			await fetch(`/api/search/control`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					searchId: searchIdRef.current,
					action: "approve_step",
					stepId,
				}),
			});
		} catch (error) {
			console.error("Failed to approve step:", error);
		}
	}, []);

	const modifyStep = useCallback(
		async (stepId: string, modifications: SearchStepModifications) => {
			if (!searchIdRef.current) return;

			try {
				const csrfResponse = await fetch("/api/csrf-token");
				const { token: csrfToken } = await csrfResponse.json();

				await fetch(`/api/search/control`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-CSRF-Token": csrfToken,
					},
					body: JSON.stringify({
						searchId: searchIdRef.current,
						action: "modify_step",
						stepId,
						modifications,
					}),
				});
			} catch (error) {
				console.error("Failed to modify step:", error);
			}
		},
		[],
	);

	return {
		...state,
		startSearch,
		pauseSearch,
		resumeSearch,
		stopSearch,
		updateScope,
		approveStep,
		modifyStep,
	};
}
