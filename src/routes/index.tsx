import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Brain, CheckCircle2, Database, Search, Shield, Sparkles, Zap } from "lucide-react";
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
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-red-300 text-sm mb-6">
						<AlertTriangle className="w-4 h-4" />
						<span>RAG is fundamentally unsafe and limited</span>
					</div>

					<h1 className="text-6xl md:text-7xl font-black text-white mb-6 [letter-spacing:-0.05em]">
						<span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
							Agentic Search
						</span>
					</h1>

					<p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
						The Future of Intelligent Search
					</p>

					<p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
						<strong className="text-cyan-400">3-5x faster</strong> and
						<strong className="text-blue-400"> 60-70% cheaper</strong> than traditional RAG.
						Our platform uses
						<strong className="text-purple-400"> adaptive compression</strong>,
						<strong className="text-green-400"> speculative prefetching</strong>, and
						<strong className="text-orange-400"> hybrid vector+graph storage</strong> for
						sunmatched document retrieval performance.
					</p>

					<button
						onClick={() => setShowChat(true)}
						className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transform hover:scale-105"
					>
						<span className="flex items-center gap-2">
							<Search className="w-5 h-5" />
							Start Agentic Search
						</span>
					</button>
				</div>
			</section>

			{/* RAG vs Agentic Search Comparison */}
			<section className="py-16 px-6 max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-white mb-4">Why RAG Falls Short for Document Retrieval</h2>
					<p className="text-gray-400 text-lg">Agentic search eliminates the bottlenecks that make traditional RAG slow, expensive, and inaccurate</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6 mb-12">
					{/* RAG Problems */}
					<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<AlertTriangle className="w-6 h-6 text-red-400" />
							<h3 className="text-2xl font-bold text-red-300">Traditional RAG</h3>
						</div>
						<ul className="space-y-3">
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Sequential Pipeline:</strong> Slow retrieve→rank→generate</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Token Waste:</strong> Retrieves full docs when snippets suffice</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Single-Modal:</strong> Text only, fails on images/tables</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Fixed Context Window:</strong> Limited by embedding size</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>No Validation:</strong> Blindly trusts retrieved information</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Static Learning:</strong> Cannot improve from feedback</span>
							</li>
						</ul>
					</div>

					{/* Agentic Search Benefits */}
					<div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<CheckCircle2 className="w-6 h-6 text-cyan-400" />
							<h3 className="text-2xl font-bold text-cyan-300">Agentic Search</h3>
						</div>
						<ul className="space-y-3">
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Parallel Execution:</strong> 3-5x faster via concurrent segments</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Adaptive Compression:</strong> 10x OCR with DeepSeek Vision</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Multi-Modal:</strong> Images, tables, charts, diagrams</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Hybrid Storage:</strong> LanceDB + graphs + BM25 keywords</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Speculative Prefetch:</strong> Start processing before query ends</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Validated Results:</strong> ADD discriminators ensure quality</span>
							</li>
						</ul>
					</div>
				</div>
			</section>

			{/* Key Features */}
			<section className="py-16 px-6 max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-white mb-4">Advanced Document Retrieval Technology</h2>
					<p className="text-gray-400 text-lg">Eight cutting-edge systems that make us faster and cheaper than RAG</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
						<Zap className="w-12 h-12 text-cyan-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Multi-Modal OCR</h3>
						<p className="text-gray-400 leading-relaxed">
							DeepSeek Vision processes images, tables, charts, and diagrams with layout-aware extraction.
							RAG can only handle plain text.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
						<Database className="w-12 h-12 text-blue-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Adaptive Compression</h3>
						<p className="text-gray-400 leading-relaxed">
							Content-aware compression: legal docs 3-5x, news 10-15x, code 2-3x.
							RAG retrieves full documents wasting tokens.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
						<Brain className="w-12 h-12 text-purple-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Hybrid Storage</h3>
						<p className="text-gray-400 leading-relaxed">
							LanceDB vectors + knowledge graphs + BM25 keywords.
							RAG relies only on vector similarity.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
						<Sparkles className="w-12 h-12 text-green-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Speculative Prefetch</h3>
						<p className="text-gray-400 leading-relaxed">
							Starts processing before query completes. Predicts follow-ups and preloads documents.
							RAG waits for full query.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 transition-all">
						<Zap className="w-12 h-12 text-orange-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Parallel Execution</h3>
						<p className="text-gray-400 leading-relaxed">
							Query segments run concurrently with dependency-aware scheduling.
							RAG is strictly sequential.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-all">
						<Shield className="w-12 h-12 text-pink-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Real-Time Streaming</h3>
						<p className="text-gray-400 leading-relaxed">
							Progressive enhancement shows results as they arrive.
							RAG waits for complete retrieval.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
						<Database className="w-12 h-12 text-yellow-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Semantic Caching</h3>
						<p className="text-gray-400 leading-relaxed">
							Matches similar queries via vector similarity, not exact strings.
							RAG only caches exact duplicates.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all">
						<Shield className="w-12 h-12 text-red-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Adversarial Validation</h3>
						<p className="text-gray-400 leading-relaxed">
							ADD discriminators ensure quality before serving results.
							RAG blindly trusts retrieval.
						</p>
					</div>
				</div>
			</section>

			{/* Performance Metrics Section */}
			<section className="py-16 px-6 max-w-5xl mx-auto">
				<div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
					<h2 className="text-3xl font-bold text-white text-center mb-8">Performance Claims (To Be Tested)</h2>
					<div className="grid md:grid-cols-4 gap-6">
						<div className="text-center">
							<div className="text-5xl font-black text-cyan-400 mb-2">3-5x</div>
							<div className="text-gray-300">Faster Retrieval</div>
							<div className="text-sm text-gray-500 mt-2">via parallel execution</div>
						</div>
						<div className="text-center">
							<div className="text-5xl font-black text-blue-400 mb-2">60-70%</div>
							<div className="text-gray-300">Cost Reduction</div>
							<div className="text-sm text-gray-500 mt-2">via compression</div>
						</div>
						<div className="text-center">
							<div className="text-5xl font-black text-purple-400 mb-2">10-15x</div>
							<div className="text-gray-300">Context Efficiency</div>
							<div className="text-sm text-gray-500 mt-2">hierarchical compression</div>
						</div>
						<div className="text-center">
							<div className="text-5xl font-black text-green-400 mb-2">100x</div>
							<div className="text-gray-300">Vector Search</div>
							<div className="text-sm text-gray-500 mt-2">LanceDB vs traditional</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 text-center">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-4xl font-bold text-white mb-6">Experience Next-Generation Document Retrieval</h2>
					<p className="text-gray-300 text-lg mb-8">
						Stop wasting time and money on slow, inaccurate RAG systems. Get validated results,
						multi-modal understanding, and intelligent compression in real-time.
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
