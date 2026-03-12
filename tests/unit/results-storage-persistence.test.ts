/**
 * Tests for ResearchStorage persistence adapter pattern
 *
 * Validates:
 * - PersistenceAdapter interface contract
 * - ResearchStorage delegates to adapter when provided
 * - S3 export wiring in finetuning exporter
 * - Fallback to in-memory when no adapter set
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { SearchResult } from "../../src/lib/types";
import type {
	PersistenceAdapter,
	StoredResearchResult,
} from "../../src/lib/results-storage";
import { ResearchStorage } from "../../src/lib/results-storage";

// Helper to create a mock search result
function createMockResult(overrides?: Partial<SearchResult>): SearchResult {
	return {
		id: `result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		title: "Test Result",
		snippet: "A test search result snippet",
		url: "https://example.com/test",
		source: "web",
		provider: "brave",
		addScore: 0.8,
		...overrides,
	};
}

// Helper to create a mock persistence adapter
function createMockAdapter(): PersistenceAdapter {
	const store = new Map<string, StoredResearchResult>();

	return {
		save: vi.fn(async (result: StoredResearchResult): Promise<string> => {
			store.set(result.id, result);
			return result.id;
		}),
		load: vi.fn(async (id: string): Promise<StoredResearchResult | null> => {
			return store.get(id) || null;
		}),
		list: vi.fn(
			async (
				_limit?: number,
				_offset?: number,
			): Promise<StoredResearchResult[]> => {
				return Array.from(store.values()).sort(
					(a, b) => b.timestamp - a.timestamp,
				);
			},
		),
		search: vi.fn(
			async (
				query: string,
				_limit?: number,
			): Promise<StoredResearchResult[]> => {
				const term = query.toLowerCase();
				return Array.from(store.values()).filter((r) =>
					r.query.toLowerCase().includes(term),
				);
			},
		),
		delete: vi.fn(async (id: string): Promise<boolean> => {
			return store.delete(id);
		}),
	};
}

describe("PersistenceAdapter interface", () => {
	test("mock adapter implements all required methods", () => {
		const adapter = createMockAdapter();
		expect(typeof adapter.save).toBe("function");
		expect(typeof adapter.load).toBe("function");
		expect(typeof adapter.list).toBe("function");
		expect(typeof adapter.search).toBe("function");
		expect(typeof adapter.delete).toBe("function");
	});

	test("mock adapter save returns the result ID", async () => {
		const adapter = createMockAdapter();
		const mockResult: StoredResearchResult = {
			id: "test-123",
			query: "test query",
			timestamp: Date.now(),
			results: [createMockResult()],
			annotations: [],
			segments: [],
			addScore: 0.75,
			userApproved: false,
			userModifications: [],
			index: { entities: {}, keywords: {}, sources: {}, dates: {} },
			exports: { markdown: "", json: "", jsonl: "", prompt: "" },
			modelUsed: "test-model",
			tokensUsed: 100,
			executionTimeMs: 500,
			segmentCount: 1,
			provenance: {
				providers: ["brave"],
				providerCount: 1,
				crossCitedResults: 0,
				topDomains: ["example.com"],
			},
		};

		const savedId = await adapter.save(mockResult);
		expect(savedId).toBe("test-123");
	});

	test("mock adapter load returns saved result", async () => {
		const adapter = createMockAdapter();
		const mockResult: StoredResearchResult = {
			id: "test-456",
			query: "load test",
			timestamp: Date.now(),
			results: [],
			annotations: [],
			segments: [],
			addScore: 0.5,
			userApproved: false,
			userModifications: [],
			index: { entities: {}, keywords: {}, sources: {}, dates: {} },
			exports: { markdown: "", json: "", jsonl: "", prompt: "" },
			modelUsed: "test-model",
			tokensUsed: 0,
			executionTimeMs: 0,
			segmentCount: 0,
			provenance: {
				providers: [],
				providerCount: 0,
				crossCitedResults: 0,
				topDomains: [],
			},
		};

		await adapter.save(mockResult);
		const loaded = await adapter.load("test-456");
		expect(loaded).not.toBeNull();
		expect(loaded?.query).toBe("load test");
	});

	test("mock adapter load returns null for missing ID", async () => {
		const adapter = createMockAdapter();
		const loaded = await adapter.load("nonexistent");
		expect(loaded).toBeNull();
	});

	test("mock adapter delete removes result", async () => {
		const adapter = createMockAdapter();
		const mockResult: StoredResearchResult = {
			id: "test-del",
			query: "delete me",
			timestamp: Date.now(),
			results: [],
			annotations: [],
			segments: [],
			addScore: 0.5,
			userApproved: false,
			userModifications: [],
			index: { entities: {}, keywords: {}, sources: {}, dates: {} },
			exports: { markdown: "", json: "", jsonl: "", prompt: "" },
			modelUsed: "test-model",
			tokensUsed: 0,
			executionTimeMs: 0,
			segmentCount: 0,
			provenance: {
				providers: [],
				providerCount: 0,
				crossCitedResults: 0,
				topDomains: [],
			},
		};

		await adapter.save(mockResult);
		const deleted = await adapter.delete("test-del");
		expect(deleted).toBe(true);

		const loaded = await adapter.load("test-del");
		expect(loaded).toBeNull();
	});
});

describe("ResearchStorage with adapter", () => {
	let storage: ResearchStorage;
	let adapter: PersistenceAdapter;

	beforeEach(() => {
		storage = new ResearchStorage();
		adapter = createMockAdapter();
	});

	test("setPersistenceAdapter sets the adapter", () => {
		// Should not throw
		storage.setPersistenceAdapter(adapter);
	});

	test("storeResults delegates to adapter.save when adapter is set", async () => {
		storage.setPersistenceAdapter(adapter);

		const result = await storage.storeResults(
			"test query",
			[createMockResult()],
			"test-model",
			{ addScore: 0.85, tokensUsed: 150, executionTimeMs: 300 },
		);

		expect(result.query).toBe("test query");
		expect(result.modelUsed).toBe("test-model");
		expect(result.addScore).toBe(0.85);
		expect(adapter.save).toHaveBeenCalledTimes(1);
	});

	test("storeResults works without adapter (memory mode)", async () => {
		// No adapter set - should use in-memory storage
		const result = await storage.storeResults(
			"memory query",
			[createMockResult()],
			"test-model",
		);

		expect(result.query).toBe("memory query");
		expect(result.id).toBeTruthy();
	});

	test("findRelevantResults uses adapter.search when set", async () => {
		storage.setPersistenceAdapter(adapter);

		// Store a result first
		await storage.storeResults(
			"quantum computing basics",
			[
				createMockResult({
					title: "Quantum Computing 101",
					url: "https://example.com/quantum",
				}),
			],
			"test-model",
		);

		const results = await storage.findRelevantResults("quantum");
		// Should have called adapter.search
		expect(adapter.search).toHaveBeenCalled();
	});

	test("getAllResults uses adapter.list when set", async () => {
		storage.setPersistenceAdapter(adapter);

		await storage.storeResults("query 1", [createMockResult()], "model-a");
		await storage.storeResults("query 2", [createMockResult()], "model-b");

		const all = await storage.getAllResultsAsync();
		expect(adapter.list).toHaveBeenCalled();
		// At least our 2 results are present (may have more from fs cache)
		expect(all.length).toBeGreaterThanOrEqual(2);
		const queries = all.map((r) => r.query);
		expect(queries).toContain("query 1");
		expect(queries).toContain("query 2");
	});

	test("deleteResult delegates to adapter.delete when set", async () => {
		storage.setPersistenceAdapter(adapter);

		const stored = await storage.storeResults(
			"to delete",
			[createMockResult()],
			"model",
		);

		const deleted = await storage.deleteResultAsync(stored.id);
		expect(deleted).toBe(true);
		expect(adapter.delete).toHaveBeenCalledWith(stored.id);
	});

	test("adapter receives correct StoredResearchResult shape", async () => {
		storage.setPersistenceAdapter(adapter);

		await storage.storeResults(
			"shape test",
			[
				createMockResult({
					title: "Shape Test Result",
					url: "https://example.com/shape",
				}),
			],
			"shape-model",
			{
				segments: [
					{
						id: "seg-1",
						type: "entity",
						text: "Shape",
						relevance: 0.9,
						sources: ["https://example.com/shape"],
					},
				],
				addScore: 0.92,
				tokensUsed: 200,
				executionTimeMs: 450,
			},
		);

		const savedArg = (adapter.save as ReturnType<typeof vi.fn>).mock
			.calls[0][0] as StoredResearchResult;

		expect(savedArg.query).toBe("shape test");
		expect(savedArg.modelUsed).toBe("shape-model");
		expect(savedArg.addScore).toBe(0.92);
		expect(savedArg.tokensUsed).toBe(200);
		expect(savedArg.executionTimeMs).toBe(450);
		expect(savedArg.segments).toHaveLength(1);
		expect(savedArg.segments[0].type).toBe("entity");
		expect(savedArg.results).toHaveLength(1);
		expect(savedArg.results[0].title).toBe("Shape Test Result");
		// Verify exports were generated
		expect(savedArg.exports.markdown).toContain("Shape Test Result");
		expect(savedArg.exports.json).toContain("shape test");
		// Verify index was built
		expect(savedArg.index).toBeDefined();
		expect(savedArg.provenance).toBeDefined();
		expect(savedArg.provenance.providers).toContain("brave");
	});
});

describe("ResearchStorage S3 export support", () => {
	test("exportResult returns formatted data for all formats", async () => {
		const storage = new ResearchStorage();

		const stored = await storage.storeResults(
			"export test",
			[
				createMockResult({
					title: "Export Result",
					url: "https://example.com/export",
					snippet: "This is an exportable result",
				}),
			],
			"export-model",
		);

		const markdown = storage.exportResult(stored.id, "markdown");
		expect(markdown).toContain("Export Result");
		expect(markdown).toContain("export-model");

		const json = storage.exportResult(stored.id, "json");
		expect(json).toContain("export test");

		const jsonl = storage.exportResult(stored.id, "jsonl");
		expect(jsonl).toContain("Export Result");

		const prompt = storage.exportResult(stored.id, "prompt");
		expect(prompt).toContain("export test");
	});

	test("exportResult returns null for unknown ID", () => {
		const storage = new ResearchStorage();
		const result = storage.exportResult("nonexistent", "json");
		expect(result).toBeNull();
	});
});
