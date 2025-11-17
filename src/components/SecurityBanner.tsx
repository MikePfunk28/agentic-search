/**
 * SecurityBanner Component
 * Explains security advantages over traditional RAG systems
 */

import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function SecurityBanner() {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="bg-gradient-to-r from-green-900/20 via-emerald-900/20 to-teal-900/20 border border-green-500/30 rounded-xl p-4 mb-6">
			<div className="flex items-start gap-3">
				<Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
				<div className="flex-1">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-lg font-semibold text-green-100">
							Safer Than Traditional RAG
						</h3>
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="text-sm text-green-300 hover:text-green-200 underline"
						>
							{isExpanded ? "Show less" : "Learn why"}
						</button>
					</div>

					<p className="text-green-200 text-sm mb-3">
						Agentic search with ADD (Adversarial Differential Discrimination)
						quality scoring provides better protection against RAG exploitation
						attacks.
					</p>

					{isExpanded && (
						<div className="space-y-3 mt-4 text-sm text-green-100">
							<div className="flex gap-3">
								<AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
								<div>
									<strong>Traditional RAG Vulnerability:</strong>
									<p className="text-green-200 mt-1">
										RAG systems blindly embed malicious content into context,
										allowing prompt injection attacks to manipulate outputs (
										<a
											href="https://youtu.be/O7BI4jfEFwA?si=pBcRqkYsl7Cbmyp3"
											target="_blank"
											rel="noopener noreferrer"
											className="text-cyan-300 hover:text-cyan-200 underline"
										>
											watch exploit demo
										</a>
										).
									</p>
								</div>
							</div>

							<div className="flex gap-3">
								<Lock className="w-5 h-5 text-green-400 flex-shrink-0" />
								<div>
									<strong>Our ADD Protection:</strong>
									<p className="text-green-200 mt-1">
										Every search result is scored for quality, source
										credibility, and content integrity BEFORE being included in
										the AI's context. Suspicious patterns are flagged and
										filtered.
									</p>
								</div>
							</div>

							<div className="flex gap-3">
								<Eye className="w-5 h-5 text-blue-400 flex-shrink-0" />
								<div>
									<strong>Transparent Reasoning:</strong>
									<p className="text-green-200 mt-1">
										You see exactly which sources are used, their quality
										scores, and how the AI reasoned through your query. No
										hidden manipulations.
									</p>
								</div>
							</div>

							<div className="bg-green-900/30 border border-green-500/20 rounded-lg p-3 mt-3">
								<p className="text-xs text-green-300 font-semibold mb-2">
									👥 Human-in-the-Loop Protection:
								</p>
								<ul className="text-xs text-green-200 space-y-1.5 ml-4">
									<li>✓ View detailed ADD scores for every result</li>
									<li>✓ Adjust quality thresholds in real-time</li>
									<li>✓ Flag suspicious results for immediate removal</li>
									<li>✓ Full reasoning transparency - see what AI sees</li>
								</ul>
								<div className="mt-3 p-2 bg-pink-500/20 border border-pink-400/30 rounded">
									<p className="text-xs text-pink-200 font-medium">
										📊 The ADD Quality Control panel appears after your first search, letting you inspect and filter results based on adversarial scoring.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
