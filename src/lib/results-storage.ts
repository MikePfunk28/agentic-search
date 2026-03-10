/**
 * Researcher-style result storage with best-effort persistence.
 *
 * Browser:
 * - localStorage
 *
 * Node/dev server:
 * - .agentic-search/research-storage.json
 *
 * Other runtimes:
 * - in-memory fallback
 */

import type { SearchResult } from "./types";

const BROWSER_STORAGE_KEY = "agentic-search-research-storage";
const NODE_STORAGE_DIR = ".agentic-search";
const NODE_STORAGE_FILE = "research-storage.json";

export interface ResearchAnnotation {
	id: string;
	timestamp: number;
	author: "user" | "ai" | "system";
	text: string;
	highlightedText?: string;
	tags: string[];
	confidence?: number;
}

export interface ResearchSegment {
	id: string;
	type:
		| "entity"
		| "relation"
		| "constraint"
		| "intent"
		| "context"
		| "comparison"
		| "synthesis";
	text: string;
	relevance: number;
	sources: string[];
	subSegments?: ResearchSegment[];
}

export interface ResearchProvenance {
	providers: string[];
	providerCount: number;
	crossCitedResults: number;
	topDomains: string[];
}

export interface StoredResearchResult {
	id: string;
	query: string;
	timestamp: number;
	results: SearchResult[];
	annotations: ResearchAnnotation[];
	segments: ResearchSegment[];
	addScore: number;
	userApproved: boolean;
	userModifications: string[];
	index: {
		entities: Record<string, string[]>;
		keywords: Record<string, string[]>;
		sources: Record<string, string[]>;
		dates: Record<string, string[]>;
	};
	exports: {
		markdown: string;
		json: string;
		jsonl: string;
		prompt: string;
	};
	modelUsed: string;
	tokensUsed: number;
	executionTimeMs: number;
	segmentCount: number;
	provenance: ResearchProvenance;
}

type PersistenceMode = "browser" | "node" | "memory";
type ErrnoLikeError = Error & { code?: string };

export class ResearchStorage {
	private storage: Map<string, StoredResearchResult> = new Map();
	private loaded = false;
	private persistenceMode: PersistenceMode = "memory";
	private pendingPersist: Promise<void> = Promise.resolve();

	private ensureLoadedSync(): void {
		if (this.loaded) {
			return;
		}

		if (typeof window === "undefined") {
			return;
		}

		try {
			const raw = window.localStorage.getItem(BROWSER_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as StoredResearchResult[];
				this.hydrate(parsed);
			}
			this.persistenceMode = "browser";
		} catch (error) {
			console.warn("[ResearchStorage] Failed to load browser cache:", error);
			this.persistenceMode = "memory";
		}

		this.loaded = true;
	}

	private async ensureLoaded(): Promise<void> {
		if (this.loaded) {
			return;
		}

		// Skip Node.js file persistence in browser or Cloudflare worker (no fs available)
		if (typeof window !== "undefined" || typeof globalThis.caches !== "undefined") {
			this.ensureLoadedSync();
			return;
		}

		try {
			const fsModuleId = "node:fs/promises";
			const pathModuleId = "node:path";
			const fs = await import(/* @vite-ignore */ fsModuleId);
			const path = await import(/* @vite-ignore */ pathModuleId);
			const cwd =
				typeof process !== "undefined" && typeof process.cwd === "function"
					? process.cwd()
					: ".";
			const storagePath = path.join(cwd, NODE_STORAGE_DIR, NODE_STORAGE_FILE);
			const raw = await fs
				.readFile(storagePath, "utf8")
				.catch((error: ErrnoLikeError) => {
					if (error.code === "ENOENT") {
						return "";
					}
					throw error;
				});

			if (raw) {
				const parsed = JSON.parse(raw) as StoredResearchResult[];
				this.hydrate(parsed);
			}

			this.persistenceMode = "node";
		} catch (error) {
			console.warn(
				"[ResearchStorage] Falling back to in-memory persistence:",
				error,
			);
			this.persistenceMode = "memory";
		}

		this.loaded = true;
	}

	private hydrate(records: StoredResearchResult[]): void {
		this.storage = new Map(records.map((record) => [record.id, record]));
	}

	private serialize(): StoredResearchResult[] {
		return Array.from(this.storage.values()).sort(
			(a, b) => b.timestamp - a.timestamp,
		);
	}

	private queuePersist(): Promise<void> {
		this.pendingPersist = this.pendingPersist
			.then(async () => {
				await this.persist();
			})
			.catch((error) => {
				console.warn("[ResearchStorage] Persist failed:", error);
			});
		return this.pendingPersist;
	}

	private async persist(): Promise<void> {
		if (!this.loaded) {
			return;
		}

		const serialized = JSON.stringify(this.serialize());

		if (this.persistenceMode === "browser" && typeof window !== "undefined") {
			try {
				window.localStorage.setItem(BROWSER_STORAGE_KEY, serialized);
			} catch (error) {
				console.warn(
					"[ResearchStorage] Failed to persist browser cache:",
					error,
				);
			}
			return;
		}

		if (this.persistenceMode === "node") {
			try {
				const fsModuleId = "node:fs/promises";
				const pathModuleId = "node:path";
				const fs = await import(/* @vite-ignore */ fsModuleId);
				const path = await import(/* @vite-ignore */ pathModuleId);
				const cwd =
					typeof process !== "undefined" && typeof process.cwd === "function"
						? process.cwd()
						: ".";
				const storageDir = path.join(cwd, NODE_STORAGE_DIR);
				const storagePath = path.join(storageDir, NODE_STORAGE_FILE);
				await fs.mkdir(storageDir, { recursive: true });
				await fs.writeFile(storagePath, serialized, "utf8");
			} catch (error) {
				console.warn("[ResearchStorage] Failed to persist node cache:", error);
			}
		}
	}

	async storeResults(
		query: string,
		results: SearchResult[],
		modelUsed: string,
		options?: {
			segments?: ResearchSegment[];
			addScore?: number;
			tokensUsed?: number;
			executionTimeMs?: number;
		},
	): Promise<StoredResearchResult> {
		await this.ensureLoaded();

		const id = `research-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
		const index = this.buildIndex(results);
		const exports = this.generateExports(query, results, modelUsed);
		const segments =
			options?.segments || this.autoGenerateSegments(query, results);

		const storedResult: StoredResearchResult = {
			id,
			query,
			timestamp: Date.now(),
			results,
			annotations: [],
			segments,
			addScore: options?.addScore || 0.5,
			userApproved: false,
			userModifications: [],
			index,
			exports,
			modelUsed,
			tokensUsed: options?.tokensUsed || 0,
			executionTimeMs: options?.executionTimeMs || 0,
			segmentCount: segments.length,
			provenance: this.buildProvenance(results),
		};

		this.storage.set(id, storedResult);
		await this.queuePersist();

		return storedResult;
	}

	addAnnotation(
		resultId: string,
		annotation: Omit<ResearchAnnotation, "id" | "timestamp">,
	): boolean {
		this.ensureLoadedSync();
		const result = this.storage.get(resultId);
		if (!result) return false;

		result.annotations.push({
			id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
			timestamp: Date.now(),
			...annotation,
		});
		void this.queuePersist();
		return true;
	}

	approveResult(resultId: string, modifications?: string[]): boolean {
		this.ensureLoadedSync();
		const result = this.storage.get(resultId);
		if (!result) return false;

		result.userApproved = true;
		if (modifications) {
			result.userModifications.push(...modifications);
		}

		void this.queuePersist();
		return true;
	}

	private buildIndex(results: SearchResult[]): StoredResearchResult["index"] {
		const index: StoredResearchResult["index"] = {
			entities: {},
			keywords: {},
			sources: {},
			dates: {},
		};

		for (const result of results) {
			const text = `${result.title} ${result.snippet}`;
			const entities = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];

			for (const entity of entities) {
				if (!index.entities[entity]) index.entities[entity] = [];
				index.entities[entity].push(result.id);
			}

			const keywords = text
				.toLowerCase()
				.split(/\s+/)
				.filter((word) => word.length > 3);
			for (const keyword of keywords) {
				if (!index.keywords[keyword]) index.keywords[keyword] = [];
				if (!index.keywords[keyword].includes(result.id)) {
					index.keywords[keyword].push(result.id);
				}
			}

			const source = result.source || "unknown";
			if (!index.sources[source]) index.sources[source] = [];
			index.sources[source].push(result.id);

			if (result.publishedDate) {
				const date = new Date(result.publishedDate);
				const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
				if (!index.dates[dateKey]) index.dates[dateKey] = [];
				index.dates[dateKey].push(result.id);
			}
		}

		return index;
	}

	private buildProvenance(results: SearchResult[]): ResearchProvenance {
		const providers = Array.from(
			new Set(results.map((result) => result.provider).filter(Boolean)),
		) as string[];
		const hostnames = results
			.map((result) => {
				try {
					return new URL(result.url).hostname.replace(/^www\./, "");
				} catch {
					return "";
				}
			})
			.filter(Boolean);

		const hostnameCounts = new Map<string, number>();
		for (const hostname of hostnames) {
			hostnameCounts.set(hostname, (hostnameCounts.get(hostname) || 0) + 1);
		}

		const topDomains = Array.from(hostnameCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([hostname]) => hostname);

		return {
			providers,
			providerCount: providers.length,
			crossCitedResults: results.filter(
				(result) => (result.citationCount || 0) > 1,
			).length,
			topDomains,
		};
	}

	private autoGenerateSegments(
		query: string,
		results: SearchResult[],
	): ResearchSegment[] {
		const segments: ResearchSegment[] = [];
		const entities = query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];

		for (const entity of entities) {
			segments.push({
				id: `seg-entity-${segments.length}`,
				type: "entity",
				text: entity,
				relevance: 0.9,
				sources: results.map((result) => result.url),
			});
		}

		const intentKeywords = ["explain", "how", "what", "why", "when", "compare"];
		const intent = intentKeywords.find((keyword) =>
			query.toLowerCase().includes(keyword),
		);
		if (intent) {
			segments.push({
				id: `seg-intent-${segments.length}`,
				type: "intent",
				text: `${intent} query`,
				relevance: 0.85,
				sources: [],
			});
		}

		segments.push({
			id: `seg-synthesis-${segments.length}`,
			type: "synthesis",
			text: `Synthesis of ${results.length} results`,
			relevance: 1,
			sources: results.map((result) => result.url),
		});

		return segments;
	}

	private generateExports(
		query: string,
		results: SearchResult[],
		modelUsed: string,
	): StoredResearchResult["exports"] {
		const markdown = `# Research Results: ${query}\n\n**Model Used:** ${modelUsed}\n**Results Found:** ${results.length}\n**Timestamp:** ${new Date().toISOString()}\n\n## Results\n\n${results.map((result, index) => `### ${index + 1}. ${result.title}\n\n**Source:** ${result.url}\n**Quality Score:** ${result.addScore?.toFixed(2) || "N/A"}\n\n${result.snippet}\n\n---\n`).join("\n")}`;

		const json = JSON.stringify(
			{
				query,
				modelUsed,
				timestamp: new Date().toISOString(),
				results: results.map((result) => ({
					id: result.id,
					title: result.title,
					snippet: result.snippet,
					url: result.url,
					source: result.source,
					addScore: result.addScore,
					publishedDate: result.publishedDate,
					provider: result.provider,
				})),
			},
			null,
			2,
		);

		const jsonl = results
			.map((result) =>
				JSON.stringify({
					query,
					result: {
						title: result.title,
						snippet: result.snippet,
						url: result.url,
						addScore: result.addScore,
						provider: result.provider,
					},
				}),
			)
			.join("\n");

		const prompt = `You are analyzing search results for the query: "${query}"\n\nHere are ${results.length} high-quality results:\n\n${results.map((result, index) => `[${index + 1}] ${result.title}\nSource: ${result.url}\nProvider: ${result.provider || "unknown"}\nQuality: ${result.addScore?.toFixed(2)}\nContent: ${result.snippet}\n`).join("\n")}\n\nPlease analyze these results and provide insights.`;

		return { markdown, json, jsonl, prompt };
	}

	search(searchTerm: string): StoredResearchResult[] {
		this.ensureLoadedSync();
		const term = searchTerm.toLowerCase();
		const results: StoredResearchResult[] = [];

		for (const result of this.storage.values()) {
			if (result.query.toLowerCase().includes(term)) {
				results.push(result);
				continue;
			}

			if (result.index.keywords[term] || result.index.entities[term]) {
				results.push(result);
				continue;
			}

			if (
				result.annotations.some((annotation) =>
					annotation.text.toLowerCase().includes(term),
				)
			) {
				results.push(result);
			}
		}

		return results;
	}

	async findRelevantResults(
		query: string,
		limit = 10,
	): Promise<SearchResult[]> {
		await this.ensureLoaded();
		const normalizedQuery = query.toLowerCase().trim();
		if (!normalizedQuery) {
			return [];
		}

		const queryTerms = normalizedQuery
			.split(/\s+/)
			.filter((term) => term.length > 2);

		const candidates = this.serialize()
			.map((entry) => {
				const haystack = [
					entry.query,
					...entry.results.map((result) => `${result.title} ${result.snippet}`),
				]
					.join(" ")
					.toLowerCase();

				const exactQueryMatch = entry.query
					.toLowerCase()
					.includes(normalizedQuery)
					? 3
					: 0;
				const termMatches = queryTerms.reduce(
					(score, term) => score + (haystack.includes(term) ? 1 : 0),
					0,
				);
				const ageInDays = Math.max(
					1,
					(Date.now() - entry.timestamp) / (1000 * 60 * 60 * 24),
				);
				const recencyBoost = 1 / ageInDays;

				return {
					entry,
					score: exactQueryMatch + termMatches + recencyBoost,
				};
			})
			.filter((candidate) => candidate.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 5);

		const deduped = new Map<string, SearchResult>();

		for (const { entry } of candidates) {
			for (const result of entry.results) {
				const key = result.url.toLowerCase();
				if (deduped.has(key)) {
					continue;
				}

				deduped.set(key, {
					...result,
					id: `cache-${result.id}`,
					source: "web",
					provider: "cache",
				});

				if (deduped.size >= limit) {
					return Array.from(deduped.values());
				}
			}
		}

		return Array.from(deduped.values());
	}

	getResult(id: string): StoredResearchResult | null {
		this.ensureLoadedSync();
		return this.storage.get(id) || null;
	}

	getAllResults(): StoredResearchResult[] {
		this.ensureLoadedSync();
		return this.serialize();
	}

	exportResult(
		id: string,
		format: "markdown" | "json" | "jsonl" | "prompt",
	): string | null {
		this.ensureLoadedSync();
		const result = this.storage.get(id);
		if (!result) return null;
		return result.exports[format];
	}

	deleteResult(id: string): boolean {
		this.ensureLoadedSync();
		const deleted = this.storage.delete(id);
		if (deleted) {
			void this.queuePersist();
		}
		return deleted;
	}

	clearAll(): void {
		this.ensureLoadedSync();
		this.storage.clear();
		void this.queuePersist();
	}
}

export const researchStorage = new ResearchStorage();
