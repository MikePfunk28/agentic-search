/**
 * AgenticChat Component
 * Main chat interface with interleaved reasoning and search integration
 */

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Brain, Search, Send, Sparkles, User, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { useCsrfToken } from "@/hooks/useCsrfToken";
import { EnhancedModelSelector } from "./EnhancedModelSelector";
import { ResultsList } from "./ResultsList";
import { SecurityBanner } from "./SecurityBanner";
import { ComparisonDashboard } from "./ComparisonDashboard";
import type { SearchResult } from "../lib/types";
import type { UnifiedSearchResult } from "../lib/unified-search-orchestrator";

interface ChatReasoningStep {
	id: string;
	type: "analysis" | "planning" | "search" | "synthesis";
	message: string;
	timestamp: number;
}

interface AgenticChatProps {
	onSearchResults?: (results: SearchResult[]) => void;
}

/**
 * Renders the Agentic Search Chat interface that combines a conversational chat UI with
 * interleaved reasoning steps, multi-model selection, integrated agentic search, and a results/metrics dashboard.
 *
 * The component manages security readiness (CSRF), detects user search intent, performs agentic searches, displays
 * reasoning steps and search results, and exposes search dashboard metrics when available.
 *
 * @param onSearchResults - Optional callback invoked with the array of `SearchResult` items whenever a search completes (including fallbacks).
 * @returns The rendered chat interface element.
 */
export function AgenticChat({ onSearchResults }: AgenticChatProps) {
	const { token: csrfToken, error: csrfError } = useCsrfToken();
	const [input, setInput] = useState("");
	const [reasoningSteps, setReasoningSteps] = useState<ChatReasoningStep[]>([]);
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [selectedModels, setSelectedModels] = useState<string[]>(["ollama:qwen3:4b"]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Dashboard data from unified search
	const [dashboardData, setDashboardData] = useState<{
		parallelResults?: UnifiedSearchResult['parallelResults'];
		reasoningSteps?: UnifiedSearchResult['reasoningSteps'];
		addMetrics?: UnifiedSearchResult['addMetrics'];
	}>({});

	// Wait for CSRF token before allowing interactions
	const isReady = !!csrfToken && !csrfError;

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
			fetch: async (url, options) => {
				const headers = new Headers(options?.headers);
				if (csrfToken) {
					headers.set("X-CSRF-Token", csrfToken);
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
					// Use first selected model for chat (can be enhanced for multi-model later)
					const primaryModel = selectedModels[0] || "ollama:qwen3:4b";
					const enhancedBody = {
						...body,
						modelProvider: primaryModel.split(':')[0], // Extract provider
						model: primaryModel.split(':').slice(1).join(':'), // Extract model name
					};

				return fetch(url, {
					...options,
					headers,
					body: JSON.stringify(enhancedBody),
				});
			},
		}),
	});

	// Function to perform agentic search
	const performAgenticSearch = async (query: string): Promise<SearchResult[]> => {
		try {
			const response = await fetch("/api/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(csrfToken && { "X-CSRF-Token": csrfToken }),
				},
				body: JSON.stringify({
					query,
					modelProvider: (selectedModels[0] || "ollama:qwen3:4b").split(':')[0],
					model: (selectedModels[0] || "ollama:qwen3:4b").split(':').slice(1).join(':'),
					useParallelModels: selectedModels.length > 1, // Enable if multiple models selected
					useInterleavedReasoning: true,
				}),
			});

			if (!response.ok) {
				throw new Error(`Search failed: ${response.status}`);
			}

			const data: UnifiedSearchResult = await response.json();

			// Store dashboard data from unified search result
			setDashboardData({
				parallelResults: data.parallelResults,
				reasoningSteps: data.reasoningSteps,
				addMetrics: data.addMetrics,
			});

			return data.results || [];
		} catch (error) {
			console.error("Search error:", error);

			// Clear dashboard data on error
			setDashboardData({});

			// Return mock results as fallback
			return [
				{
					id: "error-fallback",
					title: `Search Results for: ${query}`,
					snippet: "Search functionality is currently in development. This is a placeholder result.",
					url: "https://example.com/placeholder",
					source: "firecrawl" as const,
					addScore: 0.5,
				}
			];
		}
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, reasoningSteps]);

	const addReasoningStep = (type: ChatReasoningStep["type"], message: string) => {
		const step: ChatReasoningStep = {
			id: Date.now().toString(),
			type,
			message,
			timestamp: Date.now(),
		};
		setReasoningSteps(prev => [...prev, step]);
	};

	const detectSearchIntent = (message: string): boolean => {
		const searchKeywords = [
			"search", "find", "look for", "research", "discover",
			"what is", "how to", "explain", "tell me about",
			"latest", "news", "information about"
		];
		return searchKeywords.some(keyword =>
			message.toLowerCase().includes(keyword)
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || status === "streaming" || !isReady) return;

		const userMessage = input.trim();
		setInput("");

		// Add reasoning step for intent analysis
		addReasoningStep("analysis", `Analyzing user query: "${userMessage}"`);

		// Check if this looks like a search query
		if (detectSearchIntent(userMessage)) {
			addReasoningStep("planning", "Detected search intent - planning agentic search strategy");
			addReasoningStep("search", "Initiating multi-source search with AI agents");

			setIsSearching(true);

			// Perform actual agentic search
			try {
				addReasoningStep("search", "Searching across web sources with Firecrawl");
				const searchResults = await performAgenticSearch(userMessage);

				addReasoningStep("search", "Applying ADD quality scoring to results");
				addReasoningStep("synthesis", "Synthesizing and ranking search results");

				setSearchResults(searchResults);
				setIsSearching(false);
				onSearchResults?.(searchResults);

				addReasoningStep("synthesis", `Found ${searchResults.length} high-quality results`);
			} catch (error) {
				console.error("Search failed:", error);
				addReasoningStep("synthesis", "Search completed with some issues - showing available results");

				// Fallback to basic results
				const fallbackResults: SearchResult[] = [
					{
						id: "fallback-1",
						title: `Search Results for: ${userMessage}`,
						snippet: "Search functionality encountered an issue. This is a fallback result.",
						url: "https://example.com/fallback",
						source: "firecrawl",
						addScore: 0.5,
					}
				];

				setSearchResults(fallbackResults);
				setIsSearching(false);
				onSearchResults?.(fallbackResults);
			}
		}

		// Send the message to the chat API
		sendMessage({ text: userMessage });
	};

	const ReasoningIcon = ({ type }: { type: ChatReasoningStep["type"] }) => {
		switch (type) {
			case "analysis": return <Brain className="w-4 h-4 text-blue-500" />;
			case "planning": return <Sparkles className="w-4 h-4 text-purple-500" />;
			case "search": return <Search className="w-4 h-4 text-green-500" />;
			case "synthesis": return <Zap className="w-4 h-4 text-orange-500" />;
		}
	};

	return (
		<div className="flex flex-col h-full bg-slate-900">
			{/* Header with Model Selector */}
			<div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
				<div className="flex items-center gap-3">
					<Bot className="w-6 h-6 text-primary-400" />
					<h2 className="text-lg font-semibold text-white">Agentic Search Chat</h2>
				</div>
				<EnhancedModelSelector
					selectedModels={selectedModels}
					onChange={setSelectedModels}
					allowMultiple={true}
				/>
			</div>

			{/* Chat Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{/* Security Banner - Shows when no messages yet */}
				{messages.length === 0 && (
					<SecurityBanner />
				)}
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex gap-3 ${
							message.role === "assistant" ? "justify-start" : "justify-end"
						}`}
					>
						<div className={`flex gap-3 max-w-4xl ${
							message.role === "assistant" ? "flex-row" : "flex-row-reverse"
						}`}>
							{/* Avatar */}
							<div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
								message.role === "assistant"
									? "bg-primary-600 text-white"
									: "bg-slate-600 text-white"
							}`}>
								{message.role === "assistant" ? (
									<Bot className="w-4 h-4" />
								) : (
									<User className="w-4 h-4" />
								)}
							</div>

							{/* Message Content */}
							<div className={`rounded-lg p-3 ${
								message.role === "assistant"
									? "bg-slate-800 text-white"
									: "bg-primary-600 text-white"
							}`}>
								<div key={index} className="prose prose-sm dark:prose-invert max-w-none">
													<ReactMarkdown
														remarkPlugins={[remarkGfm]}
														rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
													>
														{part.text}
													</ReactMarkdown>
												</div>
									}
									return null;
								})}
							</div>
						</div>
					</div>
				))}

				{/* Reasoning Steps */}
				{reasoningSteps.map((step) => (
					<div key={step.id} className="flex gap-3 justify-start">
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

				{/* Search Results */}
				{searchResults.length > 0 && (
					<div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
						<div className="flex items-center gap-2 mb-3">
							<Search className="w-5 h-5 text-primary-400" />
							<h3 className="text-lg font-semibold text-white">Search Results</h3>
						</div>
						<ResultsList results={searchResults} isLoading={isSearching} />
					</div>
				)}

				{/* Comparison Dashboard - Shows unified search metrics */}
				{(dashboardData.parallelResults || dashboardData.reasoningSteps || dashboardData.addMetrics) && (
					<div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
						<div className="flex items-center gap-2 mb-3">
							<Brain className="w-5 h-5 text-cyan-400" />
							<h3 className="text-lg font-semibold text-white">Advanced Metrics & Analysis</h3>
						</div>
						<ComparisonDashboard
							parallelResults={dashboardData.parallelResults ? {
								responses: dashboardData.parallelResults.models.map(m => ({
									modelName: m.model,
									response: m.response,
									confidence: m.confidence,
									tokenCount: m.tokenCount,
									processingTime: m.processingTime,
									reasoning: [],
								})),
								consensus: dashboardData.parallelResults.consensus,
								confidenceScore: dashboardData.parallelResults.overallConfidence,
								totalTokens: dashboardData.parallelResults.models.reduce((sum, m) => sum + m.tokenCount, 0),
								totalTime: dashboardData.parallelResults.models.reduce((sum, m) => sum + m.processingTime, 0),
							} : undefined}
							reasoningResult={dashboardData.reasoningSteps ? {
							reasoningResult={dashboardData.reasoningSteps && dashboardData.reasoningSteps.length > 0 ? {
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
								finalOutput: dashboardData.reasoningSteps[dashboardData.reasoningSteps.length - 1]?.output || '',
								overallConfidence: dashboardData.reasoningSteps.reduce((sum, s) => sum + s.confidence, 0) / dashboardData.reasoningSteps.length,
								success: dashboardData.reasoningSteps.every(s => s.isValid),
								errors: dashboardData.reasoningSteps.filter(s => s.error).map(s => s.error!),
								totalTokens: 0, // Total tokens tracked at search level
								processingTime: dashboardData.reasoningSteps.reduce((sum, s) => sum + s.duration, 0),
							} : undefined}
							addMetrics={dashboardData.addMetrics ? {
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
									recommendation: dashboardData.addMetrics.recommendation as "maintain" | "adjust" | "retrain",
									details: `Drift: ${(dashboardData.addMetrics.drift * 100).toFixed(1)}%`,
								},
							} : undefined}
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
						placeholder={isReady ? "Ask me anything or search the web with AI agents..." : "Initializing security..."}
						disabled={!isReady}
						className="w-full rounded-lg border border-slate-600 bg-slate-700 pl-4 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
							rows={1}
							style={{ minHeight: "44px", maxHeight: "120px" }}
							onInput={(e) => {
								const target = e.target as HTMLTextAreaElement;
								target.style.height = "auto";
								target.style.height = Math.min(target.scrollHeight, 120) + "px";
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(e);
								}
							}}
						/>
					<button
						type="submit"
						disabled={!input.trim() || status === "streaming" || !isReady}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-400 hover:text-primary-300 disabled:text-slate-500 transition-colors"
							title="Send message"
						>
							<Send className="w-4 h-4" />
						</button>
					</div>
					<p className="text-xs text-slate-400 mt-2 text-center">
						AI agents will automatically detect search intent and perform agentic searches
					</p>
				</form>
			</div>
		</div>
	);
}