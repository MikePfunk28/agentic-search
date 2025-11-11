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
						Move beyond unsafe RAG systems. Our agentic search platform uses
						<strong className="text-cyan-400"> multi-model reasoning</strong>,
						<strong className="text-blue-400"> adversarial validation</strong>, and
						<strong className="text-purple-400"> OCR compression</strong> to deliver
						superior results while building datasets for custom model fine-tuning.
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
					<h2 className="text-4xl font-bold text-white mb-4">Why RAG Falls Short</h2>
					<p className="text-gray-400 text-lg">Agentic search solves fundamental problems with traditional RAG systems</p>
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
								<span><strong>Unsafe:</strong> No validation of retrieved information</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Static:</strong> Single-pass retrieval, no reasoning</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Limited Context:</strong> Fixed embedding window</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>No Learning:</strong> Cannot improve from feedback</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-red-400 mt-1">✗</span>
								<span><strong>Token Heavy:</strong> Wastes tokens on irrelevant context</span>
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
								<span><strong>Validated:</strong> ADD scores ensure quality</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Multi-Step Reasoning:</strong> Interleaved agent collaboration</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Dynamic Context:</strong> OCR compression optimizes tokens</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Self-Improving:</strong> Logs data for fine-tuning</span>
							</li>
							<li className="flex items-start gap-2 text-gray-300">
								<span className="text-cyan-400 mt-1">✓</span>
								<span><strong>Efficient:</strong> Parallel small models beat large ones</span>
							</li>
						</ul>
					</div>
				</div>
			</section>

			{/* Key Features */}
			<section className="py-16 px-6 max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-white mb-4">Powered by Advanced AI Techniques</h2>
					<p className="text-gray-400 text-lg">Multiple cutting-edge systems working in harmony</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
						<Shield className="w-12 h-12 text-cyan-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Adversarial Differential Discriminator</h3>
						<p className="text-gray-400 leading-relaxed">
							ADD validates search quality by comparing results over time, detecting drift, and triggering
							adjustments when accuracy degrades.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
						<Database className="w-12 h-12 text-blue-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">OCR Contexts Optical Compression</h3>
						<p className="text-gray-400 leading-relaxed">
							Reduces token usage by 10x+ while preserving semantic meaning through intelligent
							compression and OCR processing.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
						<Brain className="w-12 h-12 text-purple-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Interleaved Reasoning</h3>
						<p className="text-gray-400 leading-relaxed">
							Multiple small models (qwen3:1.7b, gemma3:1b, gemma3:270m) work in parallel with
							prompt chaining for superior results.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
						<Sparkles className="w-12 h-12 text-green-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Multi-Model Orchestration</h3>
						<p className="text-gray-400 leading-relaxed">
							Seamlessly switches between local (Ollama, LM Studio) and cloud (OpenAI, Anthropic)
							models based on task requirements.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-orange-500/50 transition-all">
						<Zap className="w-12 h-12 text-orange-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Prompt Chaining & Validation</h3>
						<p className="text-gray-400 leading-relaxed">
							Each component validated independently before synthesis. Chains refine outputs
							through multiple reasoning steps.
						</p>
					</div>

					<div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 transition-all">
						<Database className="w-12 h-12 text-pink-400 mb-4" />
						<h3 className="text-xl font-semibold text-white mb-3">Fine-Tuning Dataset Generation</h3>
						<p className="text-gray-400 leading-relaxed">
							Every search logged with user feedback to create training datasets for custom model
							fine-tuning and continuous improvement.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 text-center">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-4xl font-bold text-white mb-6">Ready to Experience the Future?</h2>
					<p className="text-gray-300 text-lg mb-8">
						Move beyond unsafe RAG. Start using agentic search with validated results,
						token optimization, and continuous learning.
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
