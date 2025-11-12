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

/**
 * Render a dashboard showing parallel model outputs, reasoning steps, and ADD quality metrics.
 *
 * Renders an overall metrics row plus conditional panels for parallel model comparison, reasoning steps,
 * and ADD (quality) metrics. Shows a loading panel when `isLoading` is true and returns `null` when no
 * input data is provided.
 *
 * @param parallelResults - Results from parallel model runs, used to populate model outputs, consensus, and overall metrics
 * @param reasoningResult - Structured reasoning steps and related metrics, used to populate the Reasoning Steps panel
 * @param addMetrics - ADD (Relevance, Diversity, Freshness, Consistency) metrics and drift analysis data
 * @param isLoading - When true, render a loading state instead of the dashboard
 * @returns A React element representing the comparison dashboard, or `null` when no data is available
 */
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
 * Renders a compact metric card showing an icon, a prominent value, and a label with color accents.
 *
 * @param icon - Visual icon displayed above the metric value.
 * @param label - Short descriptive label shown below the value.
 * @param value - Primary metric text shown prominently.
 * @param color - Accent color used for text, background tint, and border (`"cyan" | "blue" | "purple" | "green"`).
 * @returns A styled card element containing the provided icon, value, and label with the selected color accents.
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
 * Renders a compact card showing a single model's output, tokens, confidence and processing time.
 *
 * The card displays the model name, token count, a truncated response preview, a confidence value that is color-coded for visual emphasis, and the processing duration.
 *
 * @param response - The model response object to display
 * @returns A JSX element representing the model output card
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
 * Render a styled card summarizing a single reasoning step including its type, validation status, token count, output, confidence, and any validation errors.
 *
 * @param step - The reasoning step data:
 *   - `type`: step category (e.g., "analysis", "planning", "execution", "validation", "synthesis")
 *   - `output`: textual output produced by the step
 *   - `confidence`: numeric confidence in [0, 1]
 *   - `validated`: whether the step passed validation
 *   - `validationErrors`: list of validation error messages
 *   - `tokenCount`: number of tokens consumed by the step
 * @param index - Zero-based index of the step used for display (e.g., "Step 1")
 * @returns A JSX element representing the reasoning step card.
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
						className={`text-xs font-medium px-2 py-1 rounded bg-${color}-500/20 text-${color}-400`}
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
 * Renders a horizontal progress bar with a label and percentage for an ADD sub-score.
 *
 * @param label - Text label displayed above the bar.
 * @param value - Score between 0 and 1 that determines the filled width and displayed percentage.
 * @param color - Accent color for the filled portion; one of `"cyan" | "blue" | "purple" | "green"`.
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