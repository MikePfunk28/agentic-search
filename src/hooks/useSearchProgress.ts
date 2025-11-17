/**
 * useSearchProgress Hook
 * Manages real-time search progress updates via Server-Sent Events
 * Provides human-in-the-loop controls for pausing, resuming, and modifying searches
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchProgressStep, SearchScope } from "../components/SearchProgressPanel";

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
	modifyStep: (stepId: string, modifications: any) => void;
}

export function useSearchProgress(onResults?: (results: any[]) => void): UseSearchProgressReturn {
	const [state, setState] = useState<SearchProgressState>({
		isSearching: false,
		isPaused: false,
		steps: [],
		scope: {
			sources: {
				firecrawl: true,
				autumn: true,
				academic: true,
				news: true,
			},
			maxResults: 20,
			useReasoning: true,
			useSegmentation: true,
		},
		error: null,
	});

	const eventSourceRef = useRef<EventSource | null>(null);
	const searchIdRef = useRef<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	const addStep = useCallback((step: Omit<SearchProgressStep, "timestamp">) => {
		setState((prev) => ({
			...prev,
			steps: [...prev.steps, { ...step, timestamp: Date.now() }],
		}));
	}, []);

	const updateStep = useCallback((stepId: string, updates: Partial<SearchProgressStep>) => {
		setState((prev) => ({
			...prev,
			steps: prev.steps.map((step) =>
				step.id === stepId ? { ...step, ...updates } : step
			),
		}));
	}, []);

	const startSearch = useCallback(async (query: string, initialScope: SearchScope) => {
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
		const searchId = `search-${Date.now()}`;
		searchIdRef.current = searchId;

		try {
			// Get CSRF token from API endpoint
			const csrfResponse = await fetch("/api/csrf-token");
			if (!csrfResponse.ok) {
				throw new Error("Failed to fetch CSRF token");
			}
			const { token: csrfToken } = await csrfResponse.json();

			// Start streaming search
			const response = await fetch("/api/search/stream", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": csrfToken,
				},
				body: JSON.stringify({
					query,
					scope: initialScope,
					searchId,
				}),
				signal: abortControllerRef.current.signal,
			});

			if (!response.ok) {
				throw new Error(`Search failed: ${response.status}`);
			}

			// Setup SSE connection for progress updates
			const sseUrl = `/api/search/progress?searchId=${searchId}&token=${csrfToken}`;
			const eventSource = new EventSource(sseUrl);
			eventSourceRef.current = eventSource;

			eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);

					switch (data.type) {
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
							onResults?.(data.results);
							setState((prev) => ({ ...prev, isSearching: false }));
							eventSource.close();
							break;

						case "error":
							setState((prev) => ({
								...prev,
								isSearching: false,
								error: data.message,
							}));
							eventSource.close();
							break;

						case "paused":
							setState((prev) => ({ ...prev, isPaused: true }));
							break;

						case "resumed":
							setState((prev) => ({ ...prev, isPaused: false }));
							break;

						case "stopped":
							setState((prev) => ({ ...prev, isSearching: false, isPaused: false }));
							eventSource.close();
							break;
					}
				} catch (error) {
					console.error("Failed to parse SSE message:", error);
				}
			};

			eventSource.onerror = (error) => {
				console.error("SSE connection error:", error);
				setState((prev) => ({
					...prev,
					isSearching: false,
					error: "Connection lost. Please try again.",
				}));
				eventSource.close();
			};

		} catch (error) {
			console.error("Search start error:", error);
			setState((prev) => ({
				...prev,
				isSearching: false,
				error: error instanceof Error ? error.message : "Search failed",
			}));
		}
	}, [addStep, updateStep, onResults]);

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

	const modifyStep = useCallback(async (stepId: string, modifications: any) => {
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
	}, []);

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
