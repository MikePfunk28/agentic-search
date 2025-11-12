/**
 * Real-Time Comparison Dashboard
 * 
 * Displays parallel model outputs side-by-side with metrics
 */

import { Activity, Brain, Clock, Zap } from "lucide-react";
import type { ModelResponse, ParallelPromptResult } from "../lib/parallel-model-orchestrator";
import type { ADDMetrics } from "../lib/add-discriminator";
import type { ReasoningResult } from "../lib/interleaved-reasoning-engine";

export interface DashboardProps {
	parallelResults?: ParallelPromptResult;
	reasoningResult?: ReasoningResult;
	addMetrics?: ADDMetrics;
	isLoading?: boolean;
}

export function ComparisonDashboard({
	parallelResults,
	reasoningResult,
	addMetrics,
	isLoading = false,
}: DashboardProps) {
	if (isLoading) {
		return (
			<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
				<div className="flex items-center gap-3 text-slate-300">
					<Activity className="w-5 h-5 animate-pulse" />
					<span>Processing models in parallel...</span>
				</div>
			</div>
		);
	}

	if (!parallelResults && !reasoningResult && !addMetrics) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* Overall Metrics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<MetricCard
					icon={<Brain className="w-5 h-5" />}
					label="Overall Confidence"
					value={
						parallelResults
							? `${(parallelResults.confidenceScore * 100).toFixed(0)}%`
							: reasoningResult
								? `${(reasoningResult.overallConfidence * 100).toFixed(0)}%`
								: "N/A"
					}
					color="cyan"
				/>
				<MetricCard
					icon={<Zap className="w-5 h-5" />}
					label="Total Tokens"
					value={
						parallelResults
							? parallelResults.totalTokens.toString()
							: reasoningResult
								? reasoningResult.totalTokens.toString()
								: "N/A"
					}
					color="blue"
				/>
				<MetricCard
					icon={<Clock className="w-5 h-5" />}
					label="Processing Time"
					value={
						parallelResults
							? `${(parallelResults.totalTime / 1000).toFixed(2)}s`
							: reasoningResult
								? `${(reasoningResult.processingTime / 1000).toFixed(2)}s`
								: "N/A"
					}
					color="purple"
				/>
				<MetricCard
					icon={<Activity className="w-5 h-5" />}
					label="ADD Score"
					value={
						addMetrics
							? `${(addMetrics.currentScore.overallScore * 100).toFixed(0)}%`
							: "N/A"
					}
					color="green"
				/>
			</div>

			{/* Parallel Model Comparison */}
			{parallelResults && (
				<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
						<Brain className="w-5 h-5 text-cyan-400" />
						Parallel Model Outputs
					</h3>

					<div className="grid md:grid-cols-3 gap-4">
						{parallelResults.responses.map((response) => (
							<ModelOutputCard key={response.modelName} response={response} />
						))}
					</div>

					{parallelResults.consensus && (
						<div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
							<div className="text-sm font-medium text-slate-300 mb-2">
								Consensus Output:
							</div>
							<div className="text-white text-sm">
								{parallelResults.consensus}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Reasoning Steps */}
			{reasoningResult && (
				<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
						<Zap className="w-5 h-5 text-purple-400" />
						Reasoning Steps ({reasoningResult.steps.length})
					</h3>

					<div className="space-y-3">
						{reasoningResult.steps.map((step, index) => (
							<ReasoningStepCard key={step.id} step={step} index={index} />
						))}
					</div>

					{reasoningResult.errors.length > 0 && (
						<div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
							<div className="text-sm font-medium text-red-300 mb-2">
								Errors:
							</div>
							<ul className="text-red-200 text-sm space-y-1">
								{reasoningResult.errors.map((error, i) => (
									<li key={i}>• {error}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}

			{/* ADD Metrics */}
			{addMetrics && (
				<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
					<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
						<Activity className="w-5 h-5 text-green-400" />
						Quality Metrics (ADD)
					</h3>

					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<div className="text-sm text-slate-400 mb-3">Current Scores:</div>
							<div className="space-y-2">
								<ScoreBar
									label="Relevance"
									value={addMetrics.currentScore.relevanceScore}
									color="cyan"
								/>
								<ScoreBar
									label="Diversity"
									value={addMetrics.currentScore.diversityScore}
									color="blue"
								/>
								<ScoreBar
									label="Freshness"
									value={addMetrics.currentScore.freshnessScore}
									color="purple"
								/>
								<ScoreBar
									label="Consistency"
									value={addMetrics.currentScore.consistencyScore}
									color="green"
								/>
							</div>
						</div>

						<div>
							<div className="text-sm text-slate-400 mb-3">Drift Analysis:</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-slate-300 text-sm">Trend:</span>
									<span
										className={`text-sm font-medium ${
											addMetrics.recentTrend === "improving"
												? "text-green-400"
												: addMetrics.recentTrend === "declining"
													? "text-red-400"
													: "text-slate-400"
										}`}
									>
										{addMetrics.recentTrend}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300 text-sm">
										Drift Detected:
									</span>
									<span
										className={`text-sm font-medium ${
											addMetrics.driftDetected
												? "text-red-400"
												: "text-green-400"
										}`}
									>
										{addMetrics.driftDetected ? "Yes" : "No"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-300 text-sm">
										Historical Avg:
									</span>
									<span className="text-slate-300 text-sm">
										{(addMetrics.historicalAverage * 100).toFixed(0)}%
									</span>
								</div>
								{addMetrics.driftAnalysis && (
									<div className="mt-3 p-3 bg-slate-700/50 rounded">
										<div className="text-xs text-slate-400 mb-1">
											Recommendation:
										</div>
										<div className="text-sm text-white">
											{addMetrics.driftAnalysis.recommendation}
										</div>
										<div className="text-xs text-slate-300 mt-2">
											{addMetrics.driftAnalysis.details}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * Metric Card Component
 */
function MetricCard({
	icon,
	label,
	value,
	color,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	color: "cyan" | "blue" | "purple" | "green";
}) {
	const colorClasses = {
		cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
		blue: "text-blue-400 bg-blue-500/10 border-blue-500/30",
		purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
		green: "text-green-400 bg-green-500/10 border-green-500/30",
	};

	return (
		<div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
			<div className="flex items-center gap-2 mb-2">{icon}</div>
			<div className="text-2xl font-bold text-white mb-1">{value}</div>
			<div className="text-sm text-slate-400">{label}</div>
		</div>
	);
}

/**
 * Model Output Card Component
 */
function ModelOutputCard({ response }: { response: ModelResponse }) {
	return (
		<div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
			<div className="flex items-center justify-between mb-3">
				<div className="text-sm font-medium text-cyan-400">
					{response.modelName}
				</div>
				<div className="text-xs text-slate-400">
					{response.tokenCount} tokens
				</div>
			</div>

			<div className="text-sm text-white mb-3 line-clamp-4">
				{response.response}
			</div>

			<div className="flex items-center justify-between text-xs">
				<div className="flex items-center gap-2">
					<span className="text-slate-400">Confidence:</span>
					<span
						className={`font-medium ${
							response.confidence > 0.7
								? "text-green-400"
								: response.confidence > 0.5
									? "text-yellow-400"
									: "text-red-400"
						}`}
					>
						{(response.confidence * 100).toFixed(0)}%
					</span>
				</div>
				<div className="text-slate-400">
					{response.processingTime}ms
				</div>
			</div>
		</div>
	);
}

/**
 * Reasoning Step Card Component
 */
function ReasoningStepCard({
	step,
	index,
}: {
	step: {
		type: string;
		output: string;
		confidence: number;
		validated: boolean;
		validationErrors: string[];
		tokenCount: number;
	};
	index: number;
}) {
	const typeColors = {
		analysis: "blue",
		planning: "purple",
		execution: "cyan",
		validation: "green",
		synthesis: "orange",
	};

	const color =
		typeColors[step.type as keyof typeof typeColors] || "slate";

	// Map color names to Tailwind classes for JIT compiler compatibility
	const colorClasses: Record<string, string> = {
		blue: "bg-blue-500/20 text-blue-400",
		purple: "bg-purple-500/20 text-purple-400",
		cyan: "bg-cyan-500/20 text-cyan-400",
		green: "bg-green-500/20 text-green-400",
		orange: "bg-orange-500/20 text-orange-400",
		slate: "bg-slate-500/20 text-slate-400",
	};

	return (
		<div
			className={`p-4 rounded-lg border ${
				step.validated
					? "bg-slate-700/30 border-slate-600"
					: "bg-red-500/10 border-red-500/30"
			}`}
		>
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<span
						className={`text-xs font-medium px-2 py-1 rounded ${colorClasses[color]}`}
					>
						Step {index + 1}: {step.type}
					</span>
					{step.validated ? (
						<span className="text-xs text-green-400">✓ Validated</span>
					) : (
						<span className="text-xs text-red-400">✗ Failed</span>
					)}
				</div>
				<div className="text-xs text-slate-400">{step.tokenCount} tokens</div>
			</div>

			<div className="text-sm text-white mb-2 line-clamp-2">{step.output}</div>

			<div className="flex items-center justify-between text-xs">
				<div className="flex items-center gap-2">
					<span className="text-slate-400">Confidence:</span>
					<span
						className={`font-medium ${
							step.confidence > 0.7
								? "text-green-400"
								: step.confidence > 0.5
									? "text-yellow-400"
									: "text-red-400"
						}`}
					>
						{(step.confidence * 100).toFixed(0)}%
					</span>
				</div>
			</div>

			{step.validationErrors.length > 0 && (
				<div className="mt-2 text-xs text-red-300">
					Errors: {step.validationErrors.join(", ")}
				</div>
			)}
		</div>
	);
}

/**
 * Score Bar Component
 */
function ScoreBar({
	label,
	value,
	color,
}: {
	label: string;
	value: number;
	color: "cyan" | "blue" | "purple" | "green";
}) {
	const colorClasses = {
		cyan: "bg-cyan-500",
		blue: "bg-blue-500",
		purple: "bg-purple-500",
		green: "bg-green-500",
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-1">
				<span className="text-sm text-slate-300">{label}</span>
				<span className="text-sm text-slate-400">
					{(value * 100).toFixed(0)}%
				</span>
			</div>
			<div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
				<div
					className={`h-full ${colorClasses[color]} transition-all duration-300`}
					style={{ width: `${value * 100}%` }}
				/>
			</div>
		</div>
	);
}
