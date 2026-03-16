/**
 * Unit Tests for Search Checkpoint Engine
 * Tests checkpoint creation, state machine, pause/resume, edit/rewind, and correction logging
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
	CheckpointEngine,
	type CheckpointPhase,
	type CheckpointState,
	type CheckpointSnapshot,
	type SearchCheckpointConfig,
} from "../../src/lib/search/checkpoint-engine";

describe("CheckpointEngine", () => {
	let engine: CheckpointEngine;

	beforeEach(() => {
		engine = new CheckpointEngine();
	});

	describe("initialization", () => {
		it("should start with no checkpoints", () => {
			expect(engine.getCheckpoints()).toEqual([]);
		});

		it("should default to auto-advance mode (no pause)", () => {
			expect(engine.getConfig().pauseAtCheckpoints).toBe(false);
		});

		it("should allow config override at construction", () => {
			const custom = new CheckpointEngine({ pauseAtCheckpoints: true });
			expect(custom.getConfig().pauseAtCheckpoints).toBe(true);
		});

		it("should generate a unique search session id", () => {
			const id = engine.getSessionId();
			expect(id).toBeTruthy();
			expect(typeof id).toBe("string");
			expect(id.length).toBeGreaterThan(0);
		});
	});

	describe("checkpoint creation", () => {
		it("should create a checkpoint with correct phase and data", () => {
			engine.capture("query_parsed", {
				enhancedQuery: "test search",
				entities: ["test"],
				corrections: [],
			});

			const checkpoints = engine.getCheckpoints();
			expect(checkpoints).toHaveLength(1);
			expect(checkpoints[0].phase).toBe("query_parsed");
			expect(checkpoints[0].data.enhancedQuery).toBe("test search");
			expect(checkpoints[0].timestamp).toBeGreaterThan(0);
		});

		it("should assign sequential indices", () => {
			engine.capture("query_parsed", { enhancedQuery: "q" });
			engine.capture("intent_analyzed", { type: "factual" });
			engine.capture("strategy_planned", { primaryQuery: "q" });

			const checkpoints = engine.getCheckpoints();
			expect(checkpoints[0].index).toBe(0);
			expect(checkpoints[1].index).toBe(1);
			expect(checkpoints[2].index).toBe(2);
		});

		it("should capture all defined checkpoint phases", () => {
			const phases: CheckpointPhase[] = [
				"query_parsed",
				"intent_analyzed",
				"strategy_planned",
				"results_retrieved",
				"results_scored",
				"reasoning_complete",
				"validation_complete",
			];

			for (const phase of phases) {
				engine.capture(phase, { phase });
			}

			expect(engine.getCheckpoints()).toHaveLength(7);
		});

		it("should store snapshot as deep copy so mutations don't affect it", () => {
			const data = { enhancedQuery: "original" };
			engine.capture("query_parsed", data);
			data.enhancedQuery = "mutated";

			const checkpoint = engine.getCheckpoint("query_parsed");
			expect(checkpoint?.data.enhancedQuery).toBe("original");
		});
	});

	describe("checkpoint retrieval", () => {
		beforeEach(() => {
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.capture("intent_analyzed", { type: "research", complexity: "complex" });
			engine.capture("strategy_planned", { primaryQuery: "test", followUps: ["a", "b"] });
		});

		it("should retrieve checkpoint by phase name", () => {
			const cp = engine.getCheckpoint("intent_analyzed");
			expect(cp).toBeDefined();
			expect(cp?.data.type).toBe("research");
		});

		it("should retrieve checkpoint by index", () => {
			const cp = engine.getCheckpointByIndex(1);
			expect(cp).toBeDefined();
			expect(cp?.phase).toBe("intent_analyzed");
		});

		it("should return undefined for missing phase", () => {
			expect(engine.getCheckpoint("reasoning_complete")).toBeUndefined();
		});

		it("should return undefined for out-of-bounds index", () => {
			expect(engine.getCheckpointByIndex(99)).toBeUndefined();
		});

		it("should return the latest checkpoint", () => {
			const latest = engine.getLatestCheckpoint();
			expect(latest?.phase).toBe("strategy_planned");
		});
	});

	describe("pause and resume (approval mode)", () => {
		it("should not pause when pauseAtCheckpoints is false", async () => {
			engine = new CheckpointEngine({ pauseAtCheckpoints: false });
			const shouldPause = engine.shouldPause("query_parsed");
			expect(shouldPause).toBe(false);
		});

		it("should pause at all checkpoints when pauseAtCheckpoints is true", () => {
			engine = new CheckpointEngine({ pauseAtCheckpoints: true });
			expect(engine.shouldPause("query_parsed")).toBe(true);
			expect(engine.shouldPause("intent_analyzed")).toBe(true);
			expect(engine.shouldPause("results_retrieved")).toBe(true);
		});

		it("should pause only at specific phases when pauseAtPhases is set", () => {
			engine = new CheckpointEngine({
				pauseAtCheckpoints: true,
				pauseAtPhases: ["intent_analyzed", "results_scored"],
			});
			expect(engine.shouldPause("query_parsed")).toBe(false);
			expect(engine.shouldPause("intent_analyzed")).toBe(true);
			expect(engine.shouldPause("strategy_planned")).toBe(false);
			expect(engine.shouldPause("results_scored")).toBe(true);
		});

		it("should track pending state when paused", () => {
			engine = new CheckpointEngine({ pauseAtCheckpoints: true });
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.markPaused("query_parsed");

			expect(engine.getState()).toBe("paused");
			expect(engine.getPausedAtPhase()).toBe("query_parsed");
		});

		it("should transition from paused to running on resume", () => {
			engine = new CheckpointEngine({ pauseAtCheckpoints: true });
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.markPaused("query_parsed");
			expect(engine.getState()).toBe("paused");

			engine.resume();
			expect(engine.getState()).toBe("running");
			expect(engine.getPausedAtPhase()).toBeNull();
		});

		it("should allow toggling pauseAtCheckpoints at runtime", () => {
			expect(engine.getConfig().pauseAtCheckpoints).toBe(false);
			engine.setPauseAtCheckpoints(true);
			expect(engine.getConfig().pauseAtCheckpoints).toBe(true);
			engine.setPauseAtCheckpoints(false);
			expect(engine.getConfig().pauseAtCheckpoints).toBe(false);
		});
	});

	describe("edit and rewind", () => {
		beforeEach(() => {
			engine.capture("query_parsed", { enhancedQuery: "test search" });
			engine.capture("intent_analyzed", { type: "factual", complexity: "simple" });
			engine.capture("strategy_planned", { primaryQuery: "test search", followUps: [] });
			engine.capture("results_retrieved", { resultCount: 10 });
		});

		it("should edit checkpoint data at a given phase", () => {
			engine.editCheckpoint("intent_analyzed", {
				type: "research",
				complexity: "complex",
			});

			const cp = engine.getCheckpoint("intent_analyzed");
			expect(cp?.data.type).toBe("research");
			expect(cp?.data.complexity).toBe("complex");
			expect(cp?.edited).toBe(true);
		});

		it("should record the original data when editing", () => {
			const originalData = engine.getCheckpoint("intent_analyzed")?.data;
			engine.editCheckpoint("intent_analyzed", {
				type: "research",
				complexity: "complex",
			});

			const cp = engine.getCheckpoint("intent_analyzed");
			expect(cp?.originalData).toEqual(originalData);
		});

		it("should rewind to a checkpoint and discard later ones", () => {
			engine.rewindTo("intent_analyzed");

			const checkpoints = engine.getCheckpoints();
			expect(checkpoints).toHaveLength(2); // query_parsed + intent_analyzed
			expect(checkpoints[1].phase).toBe("intent_analyzed");
		});

		it("should preserve checkpoints before the rewind target", () => {
			engine.rewindTo("intent_analyzed");

			const first = engine.getCheckpoint("query_parsed");
			expect(first?.data.enhancedQuery).toBe("test search");
		});

		it("should record rewind in correction log", () => {
			engine.rewindTo("intent_analyzed");

			const corrections = engine.getCorrections();
			expect(corrections).toHaveLength(1);
			expect(corrections[0].action).toBe("rewind");
			expect(corrections[0].targetPhase).toBe("intent_analyzed");
			expect(corrections[0].discardedPhases).toEqual([
				"strategy_planned",
				"results_retrieved",
			]);
		});

		it("should record edit in correction log", () => {
			engine.editCheckpoint("strategy_planned", {
				primaryQuery: "modified query",
				followUps: ["extra"],
			});

			const corrections = engine.getCorrections();
			expect(corrections).toHaveLength(1);
			expect(corrections[0].action).toBe("edit");
			expect(corrections[0].targetPhase).toBe("strategy_planned");
		});

		it("should throw on rewind to nonexistent phase", () => {
			expect(() => engine.rewindTo("reasoning_complete")).toThrow();
		});

		it("should throw on edit to nonexistent phase", () => {
			expect(() =>
				engine.editCheckpoint("reasoning_complete", {}),
			).toThrow();
		});
	});

	describe("correction log for learning", () => {
		it("should accumulate multiple corrections", () => {
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.capture("intent_analyzed", { type: "factual" });
			engine.capture("strategy_planned", { primaryQuery: "test" });

			engine.editCheckpoint("intent_analyzed", { type: "research" });
			engine.rewindTo("intent_analyzed");

			const corrections = engine.getCorrections();
			expect(corrections).toHaveLength(2);
		});

		it("should include timestamps on corrections", () => {
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.editCheckpoint("query_parsed", { enhancedQuery: "modified" });

			const corrections = engine.getCorrections();
			expect(corrections[0].timestamp).toBeGreaterThan(0);
		});

		it("should export corrections for fine-tuning data", () => {
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.capture("intent_analyzed", { type: "factual" });
			engine.editCheckpoint("intent_analyzed", { type: "research" });

			const exportData = engine.exportForTraining();
			expect(exportData.sessionId).toBe(engine.getSessionId());
			expect(exportData.corrections).toHaveLength(1);
			expect(exportData.checkpoints).toHaveLength(2);
			expect(exportData.corrections[0].before).toEqual({ type: "factual" });
			expect(exportData.corrections[0].after).toEqual({ type: "research" });
		});
	});

	describe("state machine", () => {
		it("should start in idle state", () => {
			expect(engine.getState()).toBe("idle");
		});

		it("should transition to running on first capture", () => {
			engine.capture("query_parsed", {});
			expect(engine.getState()).toBe("running");
		});

		it("should transition to completed when markComplete is called", () => {
			engine.capture("query_parsed", {});
			engine.capture("validation_complete", {});
			engine.markComplete();
			expect(engine.getState()).toBe("completed");
		});

		it("should not allow captures after completion", () => {
			engine.capture("query_parsed", {});
			engine.markComplete();
			expect(() => engine.capture("intent_analyzed", {})).toThrow();
		});

		it("should allow reset for a new search", () => {
			engine.capture("query_parsed", {});
			engine.markComplete();
			engine.reset();
			expect(engine.getState()).toBe("idle");
			expect(engine.getCheckpoints()).toEqual([]);
		});
	});

	describe("event callbacks", () => {
		it("should call onCheckpoint callback when a checkpoint is captured", () => {
			const callback = vi.fn();
			engine = new CheckpointEngine({ onCheckpoint: callback });
			engine.capture("query_parsed", { enhancedQuery: "test" });

			expect(callback).toHaveBeenCalledOnce();
			expect(callback).toHaveBeenCalledWith(
				expect.objectContaining({
					phase: "query_parsed",
					data: { enhancedQuery: "test" },
				}),
			);
		});

		it("should call onPause callback when paused", () => {
			const callback = vi.fn();
			engine = new CheckpointEngine({
				pauseAtCheckpoints: true,
				onPause: callback,
			});
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.markPaused("query_parsed");

			expect(callback).toHaveBeenCalledWith("query_parsed");
		});

		it("should call onResume callback when resumed", () => {
			const callback = vi.fn();
			engine = new CheckpointEngine({
				pauseAtCheckpoints: true,
				onResume: callback,
			});
			engine.capture("query_parsed", {});
			engine.markPaused("query_parsed");
			engine.resume();

			expect(callback).toHaveBeenCalledWith("query_parsed");
		});

		it("should call onEdit callback when a checkpoint is edited", () => {
			const callback = vi.fn();
			engine = new CheckpointEngine({ onEdit: callback });
			engine.capture("query_parsed", { enhancedQuery: "test" });
			engine.editCheckpoint("query_parsed", { enhancedQuery: "edited" });

			expect(callback).toHaveBeenCalledWith(
				"query_parsed",
				{ enhancedQuery: "test" },
				{ enhancedQuery: "edited" },
			);
		});
	});
});
