/**
 * Search Checkpoint Engine
 *
 * Captures state snapshots at key phases of the search pipeline so users
 * can view progress, rewind, edit, and resume from any checkpoint.
 *
 * Modes:
 *  - Auto-advance (default): checkpoints are captured silently; the search
 *    streams through without pausing.
 *  - Approve-at-checkpoint: the engine pauses after each checkpoint (or
 *    only at selected phases) and waits for the user to approve/edit before
 *    continuing.
 *
 * Corrections (edits + rewinds) are logged for ADD learning / fine-tuning.
 */

// ── Types ────────────────────────────────────────────────────────────

/** Phases where a checkpoint can be captured */
export type CheckpointPhase =
	| "query_parsed"
	| "intent_analyzed"
	| "strategy_planned"
	| "results_retrieved"
	| "results_scored"
	| "reasoning_complete"
	| "validation_complete";

/** Human-readable labels for each phase (for the UI) */
export const CHECKPOINT_LABELS: Record<CheckpointPhase, string> = {
	query_parsed: "Query Understanding",
	intent_analyzed: "Intent Analysis",
	strategy_planned: "Search Strategy",
	results_retrieved: "Raw Results",
	results_scored: "Quality Scored",
	reasoning_complete: "Reasoning",
	validation_complete: "Final Validation",
};

/** Ordered list of phases (canonical execution order) */
export const CHECKPOINT_ORDER: CheckpointPhase[] = [
	"query_parsed",
	"intent_analyzed",
	"strategy_planned",
	"results_retrieved",
	"results_scored",
	"reasoning_complete",
	"validation_complete",
];

export type CheckpointState = "idle" | "running" | "paused" | "completed";

export interface CheckpointSnapshot {
	phase: CheckpointPhase;
	index: number;
	data: Record<string, unknown>;
	timestamp: number;
	edited: boolean;
	originalData?: Record<string, unknown>;
}

export interface CorrectionEntry {
	action: "edit" | "rewind";
	targetPhase: CheckpointPhase;
	timestamp: number;
	/** For edits: the data before the edit */
	before?: Record<string, unknown>;
	/** For edits: the data after the edit */
	after?: Record<string, unknown>;
	/** For rewinds: which phases were discarded */
	discardedPhases?: CheckpointPhase[];
}

export interface TrainingExport {
	sessionId: string;
	checkpoints: CheckpointSnapshot[];
	corrections: CorrectionEntry[];
	config: SearchCheckpointConfig;
	completedAt?: number;
}

export interface SearchCheckpointConfig {
	/** When true, the engine will signal a pause after every checkpoint (or
	 *  only those in `pauseAtPhases`). The pipeline must honour the signal. */
	pauseAtCheckpoints: boolean;

	/** If set, only pause at these phases (ignored when pauseAtCheckpoints is false). */
	pauseAtPhases?: CheckpointPhase[];

	// ── Callbacks ────────────────────────────────────────────────────
	onCheckpoint?: (snapshot: CheckpointSnapshot) => void;
	onPause?: (phase: CheckpointPhase) => void;
	onResume?: (phase: CheckpointPhase) => void;
	onEdit?: (
		phase: CheckpointPhase,
		before: Record<string, unknown>,
		after: Record<string, unknown>,
	) => void;
}

// ── Engine ────────────────────────────────────────────────────────────

export class CheckpointEngine {
	private sessionId: string;
	private checkpoints: CheckpointSnapshot[] = [];
	private corrections: CorrectionEntry[] = [];
	private state: CheckpointState = "idle";
	private pausedAtPhase: CheckpointPhase | null = null;
	private config: SearchCheckpointConfig;
	private resumeResolver: (() => void) | null = null;

	constructor(config?: Partial<SearchCheckpointConfig>) {
		this.sessionId = this.generateSessionId();
		this.config = {
			pauseAtCheckpoints: config?.pauseAtCheckpoints ?? false,
			pauseAtPhases: config?.pauseAtPhases,
			onCheckpoint: config?.onCheckpoint,
			onPause: config?.onPause,
			onResume: config?.onResume,
			onEdit: config?.onEdit,
		};
	}

	// ── Session ──────────────────────────────────────────────────────

	getSessionId(): string {
		return this.sessionId;
	}

	getState(): CheckpointState {
		return this.state;
	}

	getConfig(): SearchCheckpointConfig {
		return { ...this.config };
	}

	// ── Capture ──────────────────────────────────────────────────────

	/** Capture a checkpoint snapshot at the given phase. */
	capture(phase: CheckpointPhase, data: Record<string, unknown>): void {
		if (this.state === "completed") {
			throw new Error(
				"Cannot capture checkpoints after search is completed. Call reset() first.",
			);
		}

		const snapshot: CheckpointSnapshot = {
			phase,
			index: this.checkpoints.length,
			data: structuredClone(data),
			timestamp: Date.now(),
			edited: false,
		};

		this.checkpoints.push(snapshot);

		if (this.state === "idle") {
			this.state = "running";
		}

		this.config.onCheckpoint?.(snapshot);
	}

	/**
	 * Convenience: capture a checkpoint and, if configured, pause and wait.
	 * The pipeline calls this at each phase boundary. If the engine is in
	 * auto-advance mode the promise resolves immediately.
	 */
	async captureAndMaybePause(
		phase: CheckpointPhase,
		data: Record<string, unknown>,
	): Promise<void> {
		this.capture(phase, data);
		if (this.shouldPause(phase)) {
			this.markPaused(phase);
			await this.waitForResume();
		}
	}

	// ── Retrieval ────────────────────────────────────────────────────

	getCheckpoints(): CheckpointSnapshot[] {
		return [...this.checkpoints];
	}

	getCheckpoint(phase: CheckpointPhase): CheckpointSnapshot | undefined {
		return this.checkpoints.find((c) => c.phase === phase);
	}

	getCheckpointByIndex(index: number): CheckpointSnapshot | undefined {
		return this.checkpoints[index];
	}

	getLatestCheckpoint(): CheckpointSnapshot | undefined {
		return this.checkpoints.length > 0
			? this.checkpoints[this.checkpoints.length - 1]
			: undefined;
	}

	// ── Pause / Resume ───────────────────────────────────────────────

	/** Should the pipeline pause after capturing `phase`? */
	shouldPause(phase: CheckpointPhase): boolean {
		if (!this.config.pauseAtCheckpoints) return false;
		if (this.config.pauseAtPhases && this.config.pauseAtPhases.length > 0) {
			return this.config.pauseAtPhases.includes(phase);
		}
		return true; // pause at all
	}

	markPaused(phase: CheckpointPhase): void {
		this.state = "paused";
		this.pausedAtPhase = phase;
		this.config.onPause?.(phase);
	}

	resume(): void {
		const wasAt = this.pausedAtPhase;
		this.state = "running";
		this.pausedAtPhase = null;
		if (wasAt) {
			this.config.onResume?.(wasAt);
		}
		// Resolve any pending waitForResume() promise
		if (this.resumeResolver) {
			const resolve = this.resumeResolver;
			this.resumeResolver = null;
			resolve();
		}
	}

	/**
	 * Returns a promise that resolves when `resume()` is called.
	 * Used inside the pipeline to await user approval at a checkpoint.
	 */
	waitForResume(): Promise<void> {
		if (this.state !== "paused") {
			return Promise.resolve();
		}
		return new Promise<void>((resolve) => {
			this.resumeResolver = resolve;
		});
	}

	getPausedAtPhase(): CheckpointPhase | null {
		return this.pausedAtPhase;
	}

	setPauseAtCheckpoints(enabled: boolean): void {
		this.config.pauseAtCheckpoints = enabled;
	}

	setPauseAtPhases(phases: CheckpointPhase[] | undefined): void {
		this.config.pauseAtPhases = phases;
	}

	// ── Edit / Rewind ────────────────────────────────────────────────

	/** Replace the data at a given checkpoint. The search should re-run from here. */
	editCheckpoint(
		phase: CheckpointPhase,
		newData: Record<string, unknown>,
	): void {
		const idx = this.checkpoints.findIndex((c) => c.phase === phase);
		if (idx === -1) {
			throw new Error(`Checkpoint "${phase}" not found`);
		}

		const checkpoint = this.checkpoints[idx];
		const before = structuredClone(checkpoint.data);

		// Record correction
		this.corrections.push({
			action: "edit",
			targetPhase: phase,
			timestamp: Date.now(),
			before,
			after: structuredClone(newData),
		});

		// Save original if first edit
		if (!checkpoint.originalData) {
			checkpoint.originalData = before;
		}

		checkpoint.data = structuredClone(newData);
		checkpoint.edited = true;

		this.config.onEdit?.(phase, before, newData);
	}

	/** Rewind to the given checkpoint, discarding all later checkpoints. */
	rewindTo(phase: CheckpointPhase): void {
		const idx = this.checkpoints.findIndex((c) => c.phase === phase);
		if (idx === -1) {
			throw new Error(`Checkpoint "${phase}" not found — cannot rewind`);
		}

		const discarded = this.checkpoints.slice(idx + 1);
		const discardedPhases = discarded.map((c) => c.phase);

		this.corrections.push({
			action: "rewind",
			targetPhase: phase,
			timestamp: Date.now(),
			discardedPhases,
		});

		this.checkpoints = this.checkpoints.slice(0, idx + 1);
	}

	// ── Corrections / Learning ───────────────────────────────────────

	getCorrections(): CorrectionEntry[] {
		return [...this.corrections];
	}

	/** Export all checkpoint + correction data in a format suitable for
	 *  fine-tuning datasets or ADD feedback loops. */
	exportForTraining(): TrainingExport {
		return {
			sessionId: this.sessionId,
			checkpoints: structuredClone(this.checkpoints),
			corrections: this.corrections.map((c) => ({
				...c,
				before: c.before ? structuredClone(c.before) : undefined,
				after: c.after ? structuredClone(c.after) : undefined,
			})),
			config: { ...this.config, onCheckpoint: undefined, onPause: undefined, onResume: undefined, onEdit: undefined },
			completedAt: this.state === "completed" ? Date.now() : undefined,
		};
	}

	// ── Lifecycle ────────────────────────────────────────────────────

	markComplete(): void {
		this.state = "completed";
	}

	reset(): void {
		this.sessionId = this.generateSessionId();
		this.checkpoints = [];
		this.corrections = [];
		this.state = "idle";
		this.pausedAtPhase = null;
	}

	// ── Internals ────────────────────────────────────────────────────

	private generateSessionId(): string {
		const ts = Date.now().toString(36);
		const rand = Math.random().toString(36).slice(2, 8);
		return `search-${ts}-${rand}`;
	}
}
