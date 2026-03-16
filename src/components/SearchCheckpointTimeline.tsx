/**
 * SearchCheckpointTimeline
 *
 * Displays the checkpoint phases of a search as a horizontal timeline.
 * Each checkpoint is a labeled node showing its phase, status, and a
 * summary of captured data.  Users can expand a checkpoint to inspect
 * details and (when approve-at-checkpoint mode is on) approve / edit
 * before the search continues.
 */

import { CheckCircle, Circle, Clock, Eye, Pause } from "lucide-react";
import { useState } from "react";

import {
	CHECKPOINT_LABELS,
	CHECKPOINT_ORDER,
	type CheckpointPhase,
	type CheckpointSnapshot,
} from "../lib/search/checkpoint-engine";

// ── Props ────────────────────────────────────────────────────────────

export interface SearchCheckpointTimelineProps {
	/** Snapshots captured so far (may grow during a live search) */
	checkpoints: CheckpointSnapshot[];
	/** Session identifier for this search */
	sessionId?: string;
	/** Whether the user has the "approve at checkpoints" toggle on */
	approveMode?: boolean;
	/** Called when the user toggles approve-at-checkpoint mode */
	onToggleApproveMode?: (enabled: boolean) => void;
	/** Called when the user approves a paused checkpoint */
	onApprove?: (phase: CheckpointPhase) => void;
	/** Called when the user edits checkpoint data (future: inline editing) */
	onEdit?: (phase: CheckpointPhase, newData: Record<string, unknown>) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────

function phaseStatus(
	phase: CheckpointPhase,
	checkpoints: CheckpointSnapshot[],
): "completed" | "active" | "pending" {
	const cp = checkpoints.find((c) => c.phase === phase);
	if (!cp) return "pending";
	// If it's the last checkpoint AND the search isn't done, it's "active"
	const lastCp = checkpoints[checkpoints.length - 1];
	if (lastCp?.phase === phase && CHECKPOINT_ORDER.indexOf(phase) < CHECKPOINT_ORDER.length - 1) {
		// Only mark active if there are still phases after it that haven't been captured
		const nextIdx = CHECKPOINT_ORDER.indexOf(phase) + 1;
		const nextPhase = CHECKPOINT_ORDER[nextIdx];
		if (!checkpoints.find((c) => c.phase === nextPhase)) {
			return "active";
		}
	}
	return "completed";
}

function formatDataSummary(data: Record<string, unknown>): string {
	const parts: string[] = [];
	if (typeof data.enhancedQuery === "string") {
		parts.push(`"${data.enhancedQuery}"`);
	}
	if (typeof data.complexity === "string") {
		parts.push(`Complexity: ${data.complexity}`);
	}
	if (typeof data.resultCount === "number") {
		parts.push(`${data.resultCount} results`);
	}
	if (typeof data.stepCount === "number") {
		parts.push(`${data.stepCount} steps`);
	}
	if (typeof data.executionMode === "string") {
		parts.push(`Mode: ${data.executionMode}`);
	}
	if (data.addMetrics && typeof data.addMetrics === "object") {
		const m = data.addMetrics as Record<string, unknown>;
		if (typeof m.overallScore === "number") {
			parts.push(`ADD: ${(m.overallScore * 100).toFixed(0)}%`);
		}
	}
	if (data.retrieval && typeof data.retrieval === "object") {
		const v = data.retrieval as Record<string, unknown>;
		parts.push(`Retrieval: ${v.valid ? "valid" : "invalid"}`);
	}
	return parts.join(" · ") || "Captured";
}

// ── Component ────────────────────────────────────────────────────────

export function SearchCheckpointTimeline({
	checkpoints,
	sessionId,
	approveMode = false,
	onToggleApproveMode,
	onApprove,
}: SearchCheckpointTimelineProps) {
	const [expandedPhase, setExpandedPhase] = useState<CheckpointPhase | null>(
		null,
	);

	if (checkpoints.length === 0) return null;

	return (
		<div className="bg-slate-800/40 rounded-lg border border-slate-600/50 p-3 mb-4">
			{/* Header row */}
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<Clock className="w-4 h-4 text-cyan-400" />
					<span className="text-sm font-medium text-slate-200">
						Search Checkpoints
					</span>
					{sessionId && (
						<span className="text-[10px] text-slate-500 font-mono">
							{sessionId}
						</span>
					)}
				</div>
				{/* Approve-at-checkpoint toggle */}
				{onToggleApproveMode && (
					<button
						type="button"
						onClick={() => onToggleApproveMode(!approveMode)}
						className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors ${
							approveMode
								? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
								: "bg-slate-700/50 text-slate-400 border border-slate-600/40 hover:text-slate-300"
						}`}
					>
						<Pause className="w-3 h-3" />
						{approveMode ? "Approve Mode ON" : "Approve Mode"}
					</button>
				)}
			</div>

			{/* Timeline bar */}
			<div className="flex items-start gap-0 overflow-x-auto pb-1">
				{CHECKPOINT_ORDER.map((phase, idx) => {
					const status = phaseStatus(phase, checkpoints);
					const cp = checkpoints.find((c) => c.phase === phase);
					const isExpanded = expandedPhase === phase;
					const isLast = idx === CHECKPOINT_ORDER.length - 1;

					return (
						<div key={phase} className="flex items-start flex-shrink-0">
							{/* Node */}
							<button
								type="button"
								disabled={status === "pending"}
								onClick={() =>
									setExpandedPhase(isExpanded ? null : phase)
								}
								className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md transition-all min-w-[80px] ${
									status === "pending"
										? "opacity-30 cursor-default"
										: "hover:bg-slate-700/50 cursor-pointer"
								} ${isExpanded ? "bg-slate-700/60" : ""}`}
							>
								{/* Icon */}
								{status === "completed" && (
									<CheckCircle
										className={`w-4 h-4 ${cp?.edited ? "text-amber-400" : "text-emerald-400"}`}
									/>
								)}
								{status === "active" && (
									<div className="relative">
										<Circle className="w-4 h-4 text-cyan-400 animate-pulse" />
									</div>
								)}
								{status === "pending" && (
									<Circle className="w-4 h-4 text-slate-600" />
								)}

								{/* Label */}
								<span
									className={`text-[10px] leading-tight text-center ${
										status === "completed"
											? "text-slate-300"
											: status === "active"
												? "text-cyan-300"
												: "text-slate-600"
									}`}
								>
									{CHECKPOINT_LABELS[phase]}
								</span>

								{/* Edited badge */}
								{cp?.edited && (
									<span className="text-[8px] text-amber-400 font-semibold">
										EDITED
									</span>
								)}
							</button>

							{/* Connector line */}
							{!isLast && (
								<div className="flex items-center pt-3">
									<div
										className={`w-4 h-px ${
											status !== "pending"
												? "bg-emerald-500/50"
												: "bg-slate-700"
										}`}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Expanded detail panel */}
			{expandedPhase && (() => {
				const cp = checkpoints.find((c) => c.phase === expandedPhase);
				if (!cp) return null;
				return (
					<div className="mt-2 bg-slate-900/50 rounded-md border border-slate-700/50 p-3">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<Eye className="w-3.5 h-3.5 text-cyan-400" />
								<span className="text-xs font-medium text-slate-200">
									{CHECKPOINT_LABELS[expandedPhase]}
								</span>
								<span className="text-[10px] text-slate-500">
									{new Date(cp.timestamp).toLocaleTimeString()}
								</span>
							</div>
							{approveMode && onApprove && (
								<button
									type="button"
									onClick={() => onApprove(expandedPhase)}
									className="text-xs px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/50"
								>
									Approve
								</button>
							)}
						</div>
						<p className="text-xs text-slate-400 mb-2">
							{formatDataSummary(cp.data)}
						</p>
						<pre className="text-[10px] text-slate-500 bg-slate-950/50 rounded p-2 overflow-x-auto max-h-40 overflow-y-auto">
							{JSON.stringify(cp.data, null, 2)}
						</pre>
						{cp.originalData && (
							<details className="mt-2">
								<summary className="text-[10px] text-amber-400 cursor-pointer">
									Original data (before edit)
								</summary>
								<pre className="text-[10px] text-slate-600 bg-slate-950/50 rounded p-2 mt-1 overflow-x-auto max-h-32 overflow-y-auto">
									{JSON.stringify(cp.originalData, null, 2)}
								</pre>
							</details>
						)}
					</div>
				);
			})()}
		</div>
	);
}
