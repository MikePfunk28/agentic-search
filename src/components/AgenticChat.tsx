/**
 * AgenticChat Component
 * Main chat interface with interleaved reasoning and search integration
 */

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMutation } from "convex/react";
import {
	Bot,
	Brain,
	Mic,
	MicOff,
	Search,
	Send,
	Settings,
	Sparkles,
	User,
	Volume2,
	VolumeX,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { api } from "../../convex/_generated/api";
import { useCsrfToken } from "../hooks/useCsrfToken.tsx";
import {
	type SearchCompletionSummary,
	useSearchProgress,
} from "../hooks/useSearchProgress";
import { useSpeechRecognition, useSpeechSynthesis } from "../hooks/useSpeech";
import { getActiveModelConfig, getModelStore } from "../lib/model-store";
import type { SearchResult } from "../lib/types";
import type { UnifiedSearchResult } from "../lib/unified-search-orchestrator";
import { ADDQualityPanel } from "./ADDQualityPanel";
import { ComparisonDashboard } from "./ComparisonDashboard";
import { EnhancedModelSelector } from "./EnhancedModelSelector";
import { ResultsList } from "./ResultsList";
import { SearchCheckpointTimeline } from "./SearchCheckpointTimeline";
import { SearchProgressPanel } from "./SearchProgressPanel";
import { SecurityBanner } from "./SecurityBanner";
import { SettingsModal } from "./SettingsModal";

interface ChatReasoningStep {
	id: string;
	type: "analysis" | "planning" | "search" | "synthesis";
	message: string;
	timestamp: number;
}

interface AgenticChatProps {
	onSearchResults?: (results: SearchResult[]) => void;
}

const SEARCH_KEYWORDS = [
	"search",
	"find",
	"look for",
	"research",
	"discover",
	"what is",
	"how to",
	"explain",
	"tell me about",
	"latest",
	"news",
	"information about",
];

function ReasoningIcon({ type }: { type: ChatReasoningStep["type"] }) {
	switch (type) {
		case "analysis":
			return <Brain className="w-4 h-4 text-blue-500" />;
		case "planning":
			return <Sparkles className="w-4 h-4 text-purple-500" />;
		case "search":
			return <Search className="w-4 h-4 text-green-500" />;
		case "synthesis":
			return <Zap className="w-4 h-4 text-orange-500" />;
	}
}

function readSelectedModelsFromStore(): string[] {
	const store = getModelStore();
	if (store.activeModels.length > 0) {
		return store.activeModels.map(
			(entry) => `${entry.provider}:${entry.model}`,
		);
	}
	if (store.activeProvider && store.activeModel) {
		return [`${store.activeProvider}:${store.activeModel}`];
	}
	return [];
}

/**
 * Interactive chat UI that detects search intent, performs agentic multi-model searches,
 * and displays interleaved reasoning, search results, and comparison metrics.
 *
 * This component:
 * - Automatically detects when a user message implies a search and runs an agentic search flow.
 * - Renders chat messages, explicit reasoning steps, search results, and an advanced comparison dashboard.
 * - Updates internal dashboard state with unified search results and may persist search history via a Convex mutation.
 * - Gates interactions until a CSRF token is available.
 *
 * @param onSearchResults - Optional callback invoked with the array of `SearchResult` when an agentic search completes or falls back to fallback results.
 * @returns The AgenticChat React element.
 */
export function AgenticChat({ onSearchResults }: AgenticChatProps) {
	const { token: csrfToken, error: csrfError } = useCsrfToken();
	const saveSearch = useMutation(api.searchHistory.saveSearch);
	const trackUsage = useMutation(api.usageTracking.trackSearch);
	const [input, setInput] = useState("");
	const [reasoningSteps, setReasoningSteps] = useState<ChatReasoningStep[]>([]);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [selectedModels, setSelectedModels] = useState<string[]>(() =>
		readSelectedModelsFromStore(),
	);
	const {
		supported: micSupported,
		listening,
		startListening,
		stopListening,
		transcript,
		clearTranscript,
	} = useSpeechRecognition();
	const {
		supported: ttsSupported,
		speak,
		stop: stopSpeaking,
	} = useSpeechSynthesis();
	const [voiceResponsesEnabled, setVoiceResponsesEnabled] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const currentSearchQueryRef = useRef("");
	const currentSearchStartedAtRef = useRef<number | null>(null);
	const lastVoiceSubmissionRef = useRef("");
	const lastSpokenAssistantIdRef = useRef("");

	function buildSpokenSearchSummary(
		query: string,
		results: SearchResult[],
	): string {
		const topResults = results
			.slice(0, 3)
			.map((result, index) => {
				const summary = result.snippet
					.replace(/\s+/g, " ")
					.trim()
					.split(". ")[0]
					.slice(0, 160);
				return `${index + 1}. ${result.title}. ${summary}.`;
			})
			.join(" ");

		return `Search complete for ${query}. ${topResults}`;
	}

	// Human-in-the-loop search progress
	const searchProgress = useSearchProgress(
		async (results, summary?: SearchCompletionSummary) => {
			const searchQuery = summary?.query || currentSearchQueryRef.current;
			const executionTimeMs =
				summary?.totalProcessingTime ||
				(currentSearchStartedAtRef.current
					? Date.now() - currentSearchStartedAtRef.current
					: 0);
			const overallQuality =
				summary?.addMetrics?.overallScore ||
				(results.length > 0
					? results.reduce((sum, result) => sum + (result.addScore || 0), 0) /
						results.length
					: 0);

			if (summary) {
				setDashboardData({
					parallelResults: summary.parallelResults,
					reasoningSteps: summary.reasoningSteps,
					addMetrics: summary.addMetrics,
					totalProcessingTime: summary.totalProcessingTime,
					totalTokens: summary.totalTokens,
					checkpoints: summary.checkpoints,
					checkpointSessionId: summary.checkpointSessionId,
				});
			}

			setSearchResults(results);
			onSearchResults?.(results);
			setIsSearching(false);
			if (voiceResponsesEnabled && ttsSupported && results.length > 0) {
				speak(buildSpokenSearchSummary(searchQuery, results));
			}
			try {
				const hashes = await Promise.all(
					results.map(async (r) => {
						const enc = new TextEncoder().encode(r.snippet || "");
						const dig = await crypto.subtle.digest("SHA-256", enc);
						const hex = Array.from(new Uint8Array(dig))
							.map((b) => b.toString(16).padStart(2, "0"))
							.join("");
						return { id: r.id, source: r.source, hash: hex };
					}),
				);
				await saveSearch({
					query: searchQuery,
					modelUsed: `${summary?.provider || "web-only"}:${summary?.modelUsed || "none"}`,
					results: results.map((result) => ({
						title: result.title,
						url: result.url,
						snippet: result.snippet,
						addScore: result.addScore,
					})),
					segments: [],
					executionTimeMs,
					tokensUsed: summary?.totalTokens || 0,
					quality: overallQuality,
				});
				await trackUsage({
					query: searchQuery,
					modelUsed: `${summary?.provider || "web-only"}:${summary?.modelUsed || "none"}`,
					tokensUsed: summary?.totalTokens,
					executionTimeMs,
					success: true,
					quality: overallQuality,
					metadata: {
						retrievedIds: results.map((r) => r.id),
						sources: results.map((r) => r.source),
						hashes,
						availableProviders: summary?.availableProviders,
						storageId: summary?.storageId,
						usedFallbackCache: summary?.usedFallbackCache,
						reasoningSummary: summary?.reasoningSteps
							?.slice(0, 5)
							.map((step) => ({
								type: step.type,
								output: step.output,
								confidence: step.confidence,
							})),
						topResults: results.slice(0, 5).map((result) => ({
							title: result.title,
							url: result.url,
							snippet: result.snippet,
							addScore: result.addScore,
							source: result.source,
						})),
					},
				});
			} catch (e) {
				console.error("Usage tracking failed", e);
			}
			currentSearchStartedAtRef.current = null;
		},
	);
	const [showSettings, setShowSettings] = useState(false);

	useEffect(() => {
		if (!searchProgress.isSearching) {
			setIsSearching(false);
		}
	}, [searchProgress.isSearching]);

	useEffect(() => {
		if (transcript) {
			setInput(transcript);
		}
	}, [transcript]);

	useEffect(() => {
		const syncSelectedModels = () => {
			setSelectedModels(readSelectedModelsFromStore());
		};

		window.addEventListener("storage", syncSelectedModels);
		const interval = setInterval(syncSelectedModels, 2000);
		return () => {
			window.removeEventListener("storage", syncSelectedModels);
			clearInterval(interval);
		};
	}, []);

	// Dashboard data from unified search
	const [dashboardData, setDashboardData] = useState<{
		parallelResults?: UnifiedSearchResult["parallelResults"];
		reasoningSteps?: UnifiedSearchResult["reasoningSteps"];
		addMetrics?: UnifiedSearchResult["addMetrics"];
		totalProcessingTime?: number;
		totalTokens?: number;
		checkpoints?: UnifiedSearchResult["checkpoints"];
		checkpointSessionId?: UnifiedSearchResult["checkpointSessionId"];
	}>({});

	// Wait for CSRF token before allowing interactions
	const isReady = !!csrfToken && !csrfError;

	const fetchFreshCsrfToken = async (): Promise<string | null> => {
		try {
			const res = await fetch("/api/csrf-token", {
				credentials: "same-origin",
			});
			if (!res.ok) return null;
			const data = await res.json();
			return typeof data?.token === "string" ? data.token : null;
		} catch {
			return null;
		}
	};

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
			fetch: async (url, options) => {
				const headers = new Headers(options?.headers);
				const requestCsrfToken = (await fetchFreshCsrfToken()) || csrfToken;
				if (requestCsrfToken) {
					headers.set("X-CSRF-Token", requestCsrfToken);
				}
				// Add model provider to the request
				let body = {};
				try {
					if (typeof options?.body === "string") {
						body = JSON.parse(options.body);
					}
				} catch (error) {
					console.error("Failed to parse request body:", error);
					// Continue with empty object as fallback
				}
				// Use first selected model for chat - read from store, never hardcoded
				const primaryModel = selectedModels[0] || "";
				const provider = primaryModel.split(":")[0];
				const normalizedProvider =
					provider === "lmstudio" ? "lm_studio" : provider;
				const enhancedBody = {
					...body,
					modelProvider: normalizedProvider, // Extract provider
					model: primaryModel.split(":").slice(1).join(":"), // Extract model name
				};

				const requestInit: RequestInit = {
					...options,
					credentials: "same-origin",
					headers,
					body: JSON.stringify(enhancedBody),
				};

				let response = await fetch(url, requestInit);

				if (response.status === 403) {
					const retryToken = await fetchFreshCsrfToken();
					if (retryToken) {
						headers.set("X-CSRF-Token", retryToken);
						response = await fetch(url, requestInit);
					}
				}

				return response;
			},
		}),
	});

	const isBusy =
		status === "streaming" ||
		!isReady ||
		isSearching ||
		searchProgress.isSearching;
	const scrollTrigger = `${messages.length}:${reasoningSteps.length}:${searchResults.length}`;

	useEffect(() => {
		if (!scrollTrigger) {
			return;
		}
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [scrollTrigger]);

	const addReasoningStep = useCallback(
		(type: ChatReasoningStep["type"], message: string) => {
			const step: ChatReasoningStep = {
				id: Date.now().toString(),
				type,
				message,
				timestamp: Date.now(),
			};
			setReasoningSteps((prev) => [...prev, step]);
		},
		[],
	);

	const detectSearchIntent = useCallback((message: string): boolean => {
		return SEARCH_KEYWORDS.some((keyword) =>
			message.toLowerCase().includes(keyword),
		);
	}, []);

	const startSearchFlow = useCallback(
		(userMessage: string, hasActiveModel: boolean) => {
			stopSpeaking();
			setInput("");
			setReasoningSteps([]);
			setSearchResults([]);
			setDashboardData({});
			addReasoningStep("analysis", `Analyzing user query: "${userMessage}"`);
			addReasoningStep(
				"planning",
				hasActiveModel
					? "Detected search intent - planning agentic search strategy"
					: "No model configured - defaulting to free web search mode",
			);
			addReasoningStep(
				"search",
				"Initiating multi-source search with AI agents",
			);
			setIsSearching(true);
			currentSearchQueryRef.current = userMessage;
			currentSearchStartedAtRef.current = Date.now();
			void searchProgress.startSearch(userMessage, searchProgress.scope);
		},
		[
			addReasoningStep,
			searchProgress.scope,
			searchProgress.startSearch,
			stopSpeaking,
		],
	);

	const submitPrompt = useCallback(
		(rawMessage: string, options?: { preferSearch?: boolean }) => {
			const userMessage = rawMessage.trim();
			if (!userMessage || isBusy) {
				return;
			}

			const hasActiveModel = Boolean(getActiveModelConfig());
			const shouldRunSearch =
				options?.preferSearch ||
				detectSearchIntent(userMessage) ||
				!hasActiveModel;

			if (shouldRunSearch) {
				startSearchFlow(userMessage, hasActiveModel);
				return;
			}

			stopSpeaking();
			setInput("");
			setReasoningSteps([]);
			addReasoningStep(
				"analysis",
				`Routing "${userMessage}" to the active chat model`,
			);
			sendMessage({ text: userMessage });
		},
		[
			addReasoningStep,
			detectSearchIntent,
			isBusy,
			sendMessage,
			startSearchFlow,
			stopSpeaking,
		],
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		submitPrompt(input);
	};

	useEffect(() => {
		const voiceQuery = transcript.trim();
		if (!voiceQuery || listening || isBusy) {
			return;
		}
		if (lastVoiceSubmissionRef.current === voiceQuery) {
			return;
		}

		lastVoiceSubmissionRef.current = voiceQuery;
		clearTranscript();
		submitPrompt(voiceQuery, { preferSearch: true });
	}, [clearTranscript, isBusy, listening, submitPrompt, transcript]);

	useEffect(() => {
		if (!voiceResponsesEnabled || !ttsSupported || status === "streaming") {
			return;
		}

		const lastAssistantMessage = [...messages]
			.reverse()
			.find((message) => message.role === "assistant");
		if (!lastAssistantMessage) {
			return;
		}
		if (lastSpokenAssistantIdRef.current === lastAssistantMessage.id) {
			return;
		}

		const spokenText = lastAssistantMessage.parts
			.map((part) => (part.type === "text" ? part.text : ""))
			.join(" ")
			.replace(/\s+/g, " ")
			.trim();
		if (!spokenText) {
			return;
		}

		lastSpokenAssistantIdRef.current = lastAssistantMessage.id;
		speak(spokenText);
	}, [messages, speak, status, ttsSupported, voiceResponsesEnabled]);

	return (
		<div className="flex flex-col h-full bg-slate-900">
			{/* Header with Model Selector */}
			<div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
				<div className="flex items-center gap-3">
					<Bot className="w-6 h-6 text-primary-400" />
					<h2 className="text-lg font-semibold text-white">
						Agentic Search Chat
					</h2>
				</div>
				<div className="flex items-center gap-3">
					<EnhancedModelSelector
						selectedModels={selectedModels}
						onChange={setSelectedModels}
						allowMultiple={true}
					/>
					{ttsSupported && (
						<button
							type="button"
							onClick={() => {
								if (voiceResponsesEnabled) {
									stopSpeaking();
								}
								setVoiceResponsesEnabled((enabled) => !enabled);
							}}
							className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white font-medium"
							title={
								voiceResponsesEnabled
									? "Disable spoken responses"
									: "Enable spoken responses"
							}
						>
							{voiceResponsesEnabled ? (
								<Volume2 className="w-5 h-5" />
							) : (
								<VolumeX className="w-5 h-5" />
							)}
							<span>{voiceResponsesEnabled ? "Voice On" : "Voice Off"}</span>
						</button>
					)}
					<button
						type="button"
						onClick={() => setShowSettings(true)}
						className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-white font-medium"
						title="Configure API Keys for OpenAI, Anthropic, etc."
					>
						<Settings className="w-5 h-5" />
						<span>API Keys</span>
					</button>
				</div>
			</div>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
			/>

			{/* Chat Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{/* Security Banner - Shows when no messages yet */}
				{messages.length === 0 && <SecurityBanner />}
				{messages.map((message, msgIndex) => (
					<div
						key={`${message.id}-${msgIndex}`}
						className={`flex gap-3 ${
							message.role === "assistant" ? "justify-start" : "justify-end"
						}`}
					>
						<div
							className={`flex gap-3 max-w-4xl ${
								message.role === "assistant" ? "flex-row" : "flex-row-reverse"
							}`}
						>
							{/* Avatar */}
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
									message.role === "assistant"
										? "bg-primary-600 text-white"
										: "bg-slate-600 text-white"
								}`}
							>
								{message.role === "assistant" ? (
									<Bot className="w-4 h-4" />
								) : (
									<User className="w-4 h-4" />
								)}
							</div>

							{/* Message Content */}
							<div
								className={`rounded-lg p-3 ${
									message.role === "assistant"
										? "bg-slate-800 text-white"
										: "bg-primary-600 text-white"
								}`}
							>
								{message.parts.map((part, index) => {
									if (part.type === "text") {
										return (
											<div
												key={`${message.id}-part-${index}-${part.text.slice(0, 24)}`}
												className="prose prose-sm dark:prose-invert max-w-none"
											>
												<ReactMarkdown
													remarkPlugins={[remarkGfm]}
													rehypePlugins={[
														rehypeRaw,
														rehypeSanitize,
														rehypeHighlight,
													]}
												>
													{part.text}
												</ReactMarkdown>
											</div>
										);
									}
									return null;
								})}
							</div>
						</div>
					</div>
				))}

				{/* Reasoning Steps */}
				{reasoningSteps.map((step, stepIndex) => (
					<div
						key={`${step.id}-${stepIndex}`}
						className="flex gap-3 justify-start"
					>
						<div className="flex gap-3 max-w-4xl">
							<div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
								<ReasoningIcon type={step.type} />
							</div>
							<div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-slate-300">
								<div className="flex items-center gap-2 mb-1">
									<ReasoningIcon type={step.type} />
									<span className="text-xs font-medium text-slate-400 uppercase">
										{step.type}
									</span>
								</div>
								<p className="text-sm">{step.message}</p>
							</div>
						</div>
					</div>
				))}

				{/* ADD Quality Control Panel */}
				{searchResults.length > 0 && dashboardData.addMetrics && (
					<ADDQualityPanel
						results={searchResults}
						addMetrics={dashboardData.addMetrics}
						onFilterResult={(resultId, reason) => {
							console.log(`[ADD] Result ${resultId} flagged: ${reason}`);
							setSearchResults((prev) => prev.filter((r) => r.id !== resultId));
						}}
						onAdjustThreshold={(threshold) => {
							console.log(`[ADD] Quality threshold adjusted to ${threshold}`);
							// Filter results based on new threshold
							setSearchResults((prev) =>
								prev.filter((r) => (r.addScore || 0) >= threshold),
							);
						}}
					/>
				)}

				{/* Search Progress Panel - Human-in-the-Loop */}
				{searchProgress.isSearching && (
					<SearchProgressPanel
						query={currentSearchQueryRef.current || "Search in progress"}
						steps={searchProgress.steps}
						scope={searchProgress.scope}
						isPaused={searchProgress.isPaused}
						onPause={searchProgress.pauseSearch}
						onResume={searchProgress.resumeSearch}
						onStop={searchProgress.stopSearch}
						onScopeChange={searchProgress.updateScope}
						onApproveStep={searchProgress.approveStep}
						onModifyStep={searchProgress.modifyStep}
					/>
				)}

				{/* Search Checkpoint Timeline */}
				{dashboardData.checkpoints && dashboardData.checkpoints.length > 0 && (
					<SearchCheckpointTimeline
						checkpoints={dashboardData.checkpoints}
						sessionId={dashboardData.checkpointSessionId}
					/>
				)}
				{/* Search Results */}
				{searchResults.length > 0 && (
					<div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
						<div className="flex items-center gap-2 mb-3">
							<Search className="w-5 h-5 text-primary-400" />
							<h3 className="text-lg font-semibold text-white">
								Search Results
							</h3>
						</div>
						<ResultsList results={searchResults} isLoading={isSearching} />
					</div>
				)}

				{/* Comparison Dashboard - Shows unified search metrics */}
				{(dashboardData.parallelResults ||
					dashboardData.reasoningSteps ||
					dashboardData.addMetrics) && (
					<div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
						<div className="flex items-center gap-2 mb-3">
							<Brain className="w-5 h-5 text-cyan-400" />
							<h3 className="text-lg font-semibold text-white">
								Advanced Metrics & Analysis
							</h3>
						</div>
						<ComparisonDashboard
							parallelResults={
								dashboardData.parallelResults
									? {
											responses: dashboardData.parallelResults.models.map(
												(m) => ({
													modelName: m.model,
													response: m.response,
													confidence: m.confidence,
													tokenCount: m.tokenCount,
													processingTime: m.processingTime,
													reasoning: [],
												}),
											),
											consensus: dashboardData.parallelResults.consensus,
											confidenceScore:
												dashboardData.parallelResults.overallConfidence,
											totalTokens: dashboardData.parallelResults.models.reduce(
												(sum, m) => sum + m.tokenCount,
												0,
											),
											totalTime: dashboardData.parallelResults.models.reduce(
												(sum, m) => sum + m.processingTime,
												0,
											),
											consensusAnalysis: {
												text: dashboardData.parallelResults.consensus,
												agreementScore:
													dashboardData.parallelResults.agreementScore,
												agreedClaims: [],
												contradictions: [],
												strategy: "weighted" as const,
												modelWeights: {},
											},
										}
									: undefined
							}
							reasoningResult={
								dashboardData.reasoningSteps
									? {
											steps: dashboardData.reasoningSteps.map((s, idx) => ({
												id: `step-${idx}`,
												type: s.type,
												input: s.input,
												output: s.output,
												confidence: s.confidence,
												validated: s.isValid,
												validationErrors: s.error ? [s.error] : [],
												timestamp: Date.now(),
												tokenCount: 0, // Token count per step not available in current structure
											})),
											finalOutput:
												dashboardData.reasoningSteps[
													dashboardData.reasoningSteps.length - 1
												]?.output || "",
											overallConfidence:
												dashboardData.reasoningSteps.reduce(
													(sum, s) => sum + s.confidence,
													0,
												) / dashboardData.reasoningSteps.length,
											success: dashboardData.reasoningSteps.every(
												(s) => s.isValid,
											),
											errors: dashboardData.reasoningSteps.flatMap((s) =>
												s.error ? [s.error] : [],
											),
											totalTokens:
												dashboardData.parallelResults?.models.reduce((sum, m) => sum + m.tokenCount, 0) ?? 0,
											processingTime:
												dashboardData.parallelResults?.models.reduce((sum, m) => sum + m.processingTime, 0) ??
												dashboardData.reasoningSteps?.reduce(
													(sum, s) => sum + s.duration,
													0,
												) ?? 0,
										}
									: undefined
							}
							addMetrics={
								dashboardData.addMetrics
									? {
											currentScore: {
												relevanceScore: dashboardData.addMetrics.relevance,
												diversityScore: dashboardData.addMetrics.diversity,
												freshnessScore: dashboardData.addMetrics.freshness,
												consistencyScore: dashboardData.addMetrics.consistency,
												overallScore: dashboardData.addMetrics.overallScore,
												timestamp: Date.now(),
											},
											historicalAverage: dashboardData.addMetrics.overallScore, // Simplified - should track history
											driftDetected: dashboardData.addMetrics.drift > 0.1,
											recentTrend: dashboardData.addMetrics.trend,
											driftAnalysis: {
												isDrifting: dashboardData.addMetrics.drift > 0.1,
												driftMagnitude: dashboardData.addMetrics.drift,
												confidence: 0.8,
												recommendation: dashboardData.addMetrics
													.recommendation as "maintain" | "adjust" | "retrain",
												details: `Drift: ${(dashboardData.addMetrics.drift * 100).toFixed(1)}%`,
											},
										}
									: undefined
							}
							isLoading={isSearching}
						/>
					</div>
				)}

				{/* Loading indicator */}
				{status === "streaming" && (
					<div className="flex gap-3 justify-start">
						<div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
							<Bot className="w-4 h-4" />
						</div>
						<div className="bg-slate-800 rounded-lg p-3">
							<div className="flex gap-1">
								<div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
								<div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
								<div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="border-t border-slate-700 p-4 bg-slate-800/50">
				<form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
					<div className="relative">
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder={
								isReady
									? listening
										? "Listening..."
										: "Ask, type, or tap the mic to search the web..."
									: "Initializing security..."
							}
							disabled={
								!isReady ||
								status === "streaming" ||
								isSearching ||
								searchProgress.isSearching
							}
							className="w-full rounded-lg border border-slate-600 bg-slate-700 pl-4 pr-24 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
							rows={1}
							style={{ minHeight: "44px", maxHeight: "120px" }}
							onInput={(e) => {
								const target = e.target as HTMLTextAreaElement;
								target.style.height = "auto";
								target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(e);
								}
							}}
						/>
						{micSupported && (
							<button
								type="button"
								onClick={() => {
									if (listening) {
										stopListening();
									} else {
										stopSpeaking();
										lastVoiceSubmissionRef.current = "";
										clearTranscript();
										startListening();
									}
								}}
								disabled={isBusy}
								className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-300 disabled:text-slate-500 transition-colors"
								title={listening ? "Stop voice input" : "Start voice input"}
								aria-label={
									listening ? "Stop voice input" : "Start voice input"
								}
							>
								{listening ? (
									<MicOff className="w-4 h-4" />
								) : (
									<Mic className="w-4 h-4" />
								)}
							</button>
						)}
						<button
							type="submit"
							disabled={!input.trim() || isBusy}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-300 disabled:text-slate-500 transition-colors"
							title="Send message"
						>
							<Send className="w-4 h-4" />
						</button>
					</div>
					<p className="text-xs text-slate-400 mt-2 text-center">
						Tap the mic and speak. Voice input auto-runs search, and spoken
						results are {voiceResponsesEnabled ? "on" : "off"}.
					</p>
				</form>
			</div>
		</div>
	);
}
