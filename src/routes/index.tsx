import { createFileRoute } from "@tanstack/react-router";
import { Brain, CheckCircle2, Database, Search, Shield, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { AgenticChat } from "../components/AgenticChat";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [showChat, setShowChat] = useState(false);

	if (showChat) {
		return (
			<div className="h-screen bg-slate-900">
				<AgenticChat />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			{/* Hero Section */}
			<section className="relative py-20 px-6 text-center overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 animate-pulse"></div>
				<div className="relative max-w-6xl mx-auto">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm mb-6">
						<CheckCircle2 className="w-4 h-4" />
						<span>Free with your own model or API key</span>
					</div>

					<h1 className="text-6xl md:text-7xl font-black text-white mb-6 [letter-spacing:-0.05em]">
						<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
							Agentic Search
						</span>
					</h1>

					<p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
						A Smarter Way to Search
					</p>

					<p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
						Bring your own model &mdash; <strong className="text-cyan-400">Ollama</strong>,{" "}
						<strong className="text-blue-400">LM Studio</strong>,{" "}
						<strong className="text-purple-400">OpenAI</strong>,{" "}
						<strong className="text-green-400">Anthropic</strong>,{" "}
						<strong className="text-orange-400">DeepSeek</strong>, or any OpenAI-compatible API.
						Agentic search breaks your query into intelligent segments, searches multiple sources
						in parallel, and validates every result before showing it to you.
					</p>

					<button
						onClick={() => setShowChat(true)}
						className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transform hover:scale-105"
					>
						<span className="flex items-center gap-2">
							<Search className="w-5 h-5" />
							Start Searching
						</span>
					</button>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-16 px-6 max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
					<p className="text-gray-400 text-lg">Your model, your keys, your search &mdash; we just make it smarter</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-12">
					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
						<div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-2xl font-bold text-cyan-400">1</span>
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">Connect Your Model</h3>
						<p className="text-gray-400">
							Point to a local Ollama or LM Studio instance, or add any cloud API key.
							No account required for the free tier.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
						<div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-2xl font-bold text-blue-400">2</span>
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">Ask Anything</h3>
						<p className="text-gray-400">
							Type your query. The system breaks it into focused sub-queries,
							searches the web, and gathers results from multiple sources.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
						<div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-2xl font-bold text-purple-400">3</span>
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">Get Validated Results</h3>
						<p className="text-gray-400">
							Every result is quality-scored and validated before you see it.
							Full transparency into reasoning and sources.
						</p>
					</div>
				</div>
			</section>

			{/* Key Features */}
			<section className="py-16 px-6 max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-white mb-4">What Makes It Better</h2>
					<p className="text-gray-400 text-lg">Intelligent search powered by your choice of AI model</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
						<Zap className="w-12 h-12 text-cyan-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Parallel Execution</h3>
						<p className="text-gray-400 leading-relaxed">
							Query segments run concurrently with dependency-aware scheduling.
							Get results faster by searching multiple sources at once.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
						<Brain className="w-12 h-12 text-blue-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Query Segmentation</h3>
						<p className="text-gray-400 leading-relaxed">
							Complex questions are broken into focused sub-queries that each
							get the best possible answer, then synthesized together.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
						<Shield className="w-12 h-12 text-purple-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Quality Validation</h3>
						<p className="text-gray-400 leading-relaxed">
							ADD (Adversarial Differential Discrimination) scores every result for
							relevance, diversity, freshness, and consistency.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
						<Sparkles className="w-12 h-12 text-green-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Real-Time Streaming</h3>
						<p className="text-gray-400 leading-relaxed">
							Watch your search progress step-by-step with full transparency.
							Pause, resume, or adjust scope mid-search.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 transition-all">
						<Zap className="w-12 h-12 text-orange-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">BYOK / BYOM</h3>
						<p className="text-gray-400 leading-relaxed">
							Bring Your Own Key or Bring Your Own Model. Works with Ollama,
							LM Studio, OpenAI, Anthropic, DeepSeek, and more.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-all">
						<Database className="w-12 h-12 text-pink-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Multi-Source Search</h3>
						<p className="text-gray-400 leading-relaxed">
							Searches across Firecrawl, Brave Search, and more.
							Add your own search API keys to unlock additional sources.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
						<Database className="w-12 h-12 text-yellow-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Interleaved Reasoning</h3>
						<p className="text-gray-400 leading-relaxed">
							The AI reasons through results step-by-step, cross-referencing
							sources to build a coherent, accurate answer.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all">
						<Shield className="w-12 h-12 text-red-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Human-in-the-Loop</h3>
						<p className="text-gray-400 leading-relaxed">
							Pause, adjust, approve, or modify search steps as they happen.
							You stay in control of the entire process.
						</p>
					</div>
				</div>
			</section>

			{/* Free Tier Callout */}
			<section className="py-16 px-6 max-w-5xl mx-auto">
				<div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
					<h2 className="text-3xl font-bold text-white text-center mb-4">Free to Use</h2>
					<p className="text-gray-300 text-center text-lg mb-8">
						Run it locally with your own model &mdash; no API costs, no accounts, no limits.
					</p>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-4xl font-black text-cyan-400 mb-2">Local</div>
							<div className="text-gray-300 font-medium">Ollama &amp; LM Studio</div>
							<div className="text-sm text-gray-500 mt-2">Auto-detected, zero config</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-black text-blue-400 mb-2">Cloud</div>
							<div className="text-gray-300 font-medium">Any OpenAI-compatible API</div>
							<div className="text-sm text-gray-500 mt-2">Bring your own key</div>
						</div>
						<div className="text-center">
							<div className="text-4xl font-black text-purple-400 mb-2">Open</div>
							<div className="text-gray-300 font-medium">Fully transparent</div>
							<div className="text-sm text-gray-500 mt-2">See every step and source</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 text-center">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-4xl font-bold text-white mb-6">Ready to Search Smarter?</h2>
					<p className="text-gray-300 text-lg mb-8">
						Connect your model, type a question, and see the difference.
						No sign-up required for the free tier.
					</p>
					<button
						onClick={() => setShowChat(true)}
						className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transform hover:scale-105"
					>
						<span className="flex items-center gap-2">
							<Search className="w-5 h-5" />
							Launch Agentic Search
						</span>
					</button>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-6 border-t border-slate-700/50">
				<div className="max-w-7xl mx-auto text-center">
					<p className="text-gray-400 text-sm">
						Built with{" "}
						<a
							href="https://tanstack.com/start"
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
						>
							TanStack Start
						</a>
						{" "}&middot; The modern web framework for React
					</p>
				</div>
			</footer>
		</div>
	);
}
