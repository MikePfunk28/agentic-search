/**
 * SearchProgressPanel Component
 * Real-time visibility into agentic search progress with human-in-the-loop controls
 * Shows what's being searched, pulled, and allows user adjustments mid-search
 */

import { Brain, Check, Pause, Play, Search, Settings, StopCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface SearchProgressStep {
	id: string;
	type: "segmentation" | "source" | "reasoning" | "synthesis" | "validation";
	status: "pending" | "in-progress" | "completed" | "paused" | "error";
	title: string;
	description?: string;
	timestamp: number;
	metadata?: {
		source?: string;
		tokensUsed?: number;
		confidence?: number;
		documentsFound?: number;
	};
}

export interface SearchScope {
	sources: {
		firecrawl: boolean;
		autumn: boolean;
		academic: boolean;
		news: boolean;
	};
	maxResults: number;
	useReasoning: boolean;
	useSegmentation: boolean;
}

interface SearchProgressPanelProps {
	query: string;
	steps: SearchProgressStep[];
	scope: SearchScope;
	isPaused: boolean;
	onPause: () => void;
	onResume: () => void;
	onStop: () => void;
	onScopeChange: (scope: SearchScope) => void;
	onApproveStep?: (stepId: string) => void;
	onModifyStep?: (stepId: string, modifications: any) => void;
}

export function SearchProgressPanel({
	query,
	steps,
	scope,
	isPaused,
	onPause,
	onResume,
	onStop,
	onScopeChange,
	onApproveStep,
	onModifyStep,
}: SearchProgressPanelProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [showScopeEditor, setShowScopeEditor] = useState(false);
	const [localScope, setLocalScope] = useState(scope);

	useEffect(() => {
		setLocalScope(scope);
	}, [scope]);

	const handleApplyScope = () => {
		onScopeChange(localScope);
		setShowScopeEditor(false);
	};

	const getStatusIcon = (status: SearchProgressStep["status"]) => {
		switch (status) {
			case "completed":
				return <Check className="w-4 h-4 text-green-500" />;
			case "in-progress":
				return <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />;
			case "paused":
				return <Pause className="w-4 h-4 text-yellow-500" />;
			case "error":
				return <X className="w-4 h-4 text-red-500" />;
			default:
				return <div className="w-4 h-4 rounded-full border-2 border-slate-600" />;
		}
	};

	const getTypeColor = (type: SearchProgressStep["type"]) => {
		switch (type) {
			case "segmentation":
				return "text-purple-400";
			case "source":
				return "text-cyan-400";
			case "reasoning":
				return "text-blue-400";
			case "synthesis":
				return "text-green-400";
			case "validation":
				return "text-yellow-400";
			default:
				return "text-slate-400";
		}
	};

	const activeSteps = steps.filter(s => s.status === "in-progress" || s.status === "pending");
	const completedSteps = steps.filter(s => s.status === "completed");
	const totalSteps = steps.length;
	const progress = totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;

	return (
		<div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
			{/* Header */}
			<div className="p-4 border-b border-slate-700 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Search className="w-5 h-5 text-cyan-400" />
					<div>
						<h3 className="font-semibold text-white">Agentic Search in Progress</h3>
						<p className="text-sm text-slate-400 truncate max-w-md">{query}</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{/* Control Buttons */}
					{!isPaused ? (
						<button
							onClick={onPause}
							className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
						>
							<Pause className="w-4 h-4" />
							Pause
						</button>
					) : (
						<button
							onClick={onResume}
							className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
						>
							<Play className="w-4 h-4" />
							Resume
						</button>
					)}

					<button
						onClick={onStop}
						className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
					>
						<StopCircle className="w-4 h-4" />
						Stop
					</button>

					<button
						onClick={() => setShowScopeEditor(!showScopeEditor)}
						className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
					>
						<Settings className="w-4 h-4" />
						Adjust
					</button>

					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
					>
						{isExpanded ? "−" : "+"}
					</button>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="px-4 py-2 bg-slate-900/50">
				<div className="flex items-center justify-between text-xs text-slate-400 mb-1">
					<span>{completedSteps.length} of {totalSteps} steps completed</span>
					<span>{Math.round(progress)}%</span>
				</div>
				<div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Scope Editor */}
			{showScopeEditor && (
				<div className="p-4 border-b border-slate-700 bg-slate-900/30">
					<h4 className="text-sm font-semibold text-white mb-3">Adjust Search Scope</h4>

					{/* Sources */}
					<div className="mb-4">
						<label className="text-xs text-slate-400 mb-2 block">Search Sources</label>
						<div className="grid grid-cols-2 gap-2">
							{Object.entries(localScope.sources).map(([source, enabled]) => (
								<label key={source} className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={enabled}
										onChange={(e) => setLocalScope({
											...localScope,
											sources: { ...localScope.sources, [source]: e.target.checked }
										})}
										className="rounded border-slate-600"
									/>
									<span className="text-white capitalize">{source}</span>
								</label>
							))}
						</div>
					</div>

					{/* Max Results */}
					<div className="mb-4">
						<label className="text-xs text-slate-400 mb-2 block">Max Results: {localScope.maxResults}</label>
						<input
							type="range"
							min="5"
							max="50"
							step="5"
							value={localScope.maxResults}
							onChange={(e) => setLocalScope({ ...localScope, maxResults: parseInt(e.target.value) })}
							className="w-full"
						/>
					</div>

					{/* Advanced Options */}
					<div className="space-y-2 mb-4">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={localScope.useReasoning}
								onChange={(e) => setLocalScope({ ...localScope, useReasoning: e.target.checked })}
								className="rounded border-slate-600"
							/>
							<span className="text-white">Use Advanced Reasoning</span>
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={localScope.useSegmentation}
								onChange={(e) => setLocalScope({ ...localScope, useSegmentation: e.target.checked })}
								className="rounded border-slate-600"
							/>
							<span className="text-white">Use Query Segmentation</span>
						</label>
					</div>

					<button
						onClick={handleApplyScope}
						className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
					>
						Apply Changes
					</button>
				</div>
			)}

			{/* Steps List */}
			{isExpanded && (
				<div className="p-4 space-y-2 max-h-96 overflow-y-auto">
					{steps.length === 0 ? (
						<div className="text-center text-slate-400 py-8">
							<Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>Preparing search strategy...</p>
						</div>
					) : (
						steps.map((step) => (
							<div
								key={step.id}
								className={`p-3 rounded-lg border ${
									step.status === "in-progress"
										? "border-cyan-500 bg-cyan-500/10"
										: step.status === "completed"
										? "border-green-500/30 bg-slate-800/50"
										: "border-slate-700 bg-slate-800/30"
								}`}
							>
								<div className="flex items-start gap-3">
									<div className="mt-0.5">{getStatusIcon(step.status)}</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className={`text-sm font-medium ${getTypeColor(step.type)}`}>
												{step.type.toUpperCase()}
											</span>
											<span className="text-white">{step.title}</span>
										</div>

										{step.description && (
											<p className="text-sm text-slate-400 mb-2">{step.description}</p>
										)}

										{/* Metadata */}
										{step.metadata && (
											<div className="flex flex-wrap gap-3 text-xs text-slate-500">
												{step.metadata.source && (
													<span>Source: {step.metadata.source}</span>
												)}
												{step.metadata.documentsFound !== undefined && (
													<span>Found: {step.metadata.documentsFound} docs</span>
												)}
												{step.metadata.tokensUsed !== undefined && (
													<span>Tokens: {step.metadata.tokensUsed}</span>
												)}
												{step.metadata.confidence !== undefined && (
													<span>Confidence: {(step.metadata.confidence * 100).toFixed(1)}%</span>
												)}
											</div>
										)}

										{/* Step Actions */}
										{step.status === "completed" && onApproveStep && (
											<div className="mt-2 flex gap-2">
												<button
													onClick={() => onApproveStep(step.id)}
													className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
												>
													✓ Approve
												</button>
												{onModifyStep && (
													<button
														onClick={() => onModifyStep(step.id, {})}
														className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
													>
														Modify
													</button>
												)}
											</div>
										)}
									</div>

									<span className="text-xs text-slate-500">
										{new Date(step.timestamp).toLocaleTimeString()}
									</span>
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}
