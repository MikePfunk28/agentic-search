/**
 * SecurityBanner Component
 * Explains quality validation and security features
 */

import { Shield, Lock, Eye } from "lucide-react";
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
							Validated Search Results
						</h3>
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="text-sm text-green-300 hover:text-green-200 underline"
						>
							{isExpanded ? "Show less" : "Learn more"}
						</button>
					</div>

					<p className="text-green-200 text-sm mb-3">
						Every result is quality-scored with ADD (Adversarial Differential
						Discrimination) before being shown to you. Your keys stay local.
					</p>

					{isExpanded && (
						<div className="space-y-3 mt-4 text-sm text-green-100">
							<div className="flex gap-3">
								<Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
								<div>
									<strong>Quality Scoring:</strong>
									<p className="text-green-200 mt-1">
										Every search result is scored for relevance, diversity,
										freshness, and source consistency before being included
										in the response. Low-quality or suspicious content is
										flagged and filtered automatically.
									</p>
								</div>
							</div>

							<div className="flex gap-3">
								<Lock className="w-5 h-5 text-green-400 flex-shrink-0" />
								<div>
									<strong>Your Keys, Your Control:</strong>
									<p className="text-green-200 mt-1">
										API keys are stored locally in your browser and never
										sent to our servers. All model calls go directly from
										your browser to your chosen provider.
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
									Human-in-the-Loop Controls:
								</p>
								<ul className="text-xs text-green-200 space-y-1.5 ml-4">
									<li>View detailed ADD scores for every result</li>
									<li>Adjust quality thresholds in real-time</li>
									<li>Flag suspicious results for immediate removal</li>
									<li>Pause, resume, or modify search mid-flight</li>
								</ul>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
