import type {
	BatchInsertResult,
	SearchOptions,
	SearchResult,
	StorageStats,
	VectorDocument,
	VectorStorageConfig,
} from "./types";
import {
	DEFAULT_DIMENSION,
	DEFAULT_K,
	DEFAULT_MIN_SCORE,
	DEFAULT_TABLE_NAME,
} from "./types";

type LanceDBConnection = // eslint-disable-next-line @typescript-eslint/no-explicit-any
	any;
type LanceDBTable = // eslint-disable-next-line @typescript-eslint/no-explicit-any
	any;

function cosineSimilarity(a: number[], b: number[]): number {
	if (a.length !== b.length) {
		throw new Error("Vectors must have the same dimension");
	}
	let dotProduct = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < a.length; i++) {
		dotProduct += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	if (normA === 0 || normB === 0) {
		return 0;
	}
	return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function matchesFilter(
	metadata: Record<string, unknown>,
	filter: Record<string, unknown>,
): boolean {
	for (const [key, value] of Object.entries(filter)) {
		if (metadata[key] !== value) {
			return false;
		}
	}
	return true;
}

class InMemoryVectorStore {
	private documents: Map<string, VectorDocument> = new Map();
	private dimension: number;

	constructor(dimension: number) {
		this.dimension = dimension;
	}

	async insert(doc: VectorDocument): Promise<void> {
		if (doc.embedding.length !== this.dimension) {
			throw new Error(
				`Embedding dimension mismatch: expected ${this.dimension}, got ${doc.embedding.length}`,
			);
		}
		this.documents.set(doc.id, { ...doc });
	}

	async insertBatch(docs: VectorDocument[]): Promise<BatchInsertResult> {
		const errors: Array<{ id: string; error: string }> = [];
		let insertedCount = 0;

		for (const doc of docs) {
			try {
				await this.insert(doc);
				insertedCount++;
			} catch (error) {
				errors.push({
					id: doc.id,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		return {
			success: errors.length === 0,
			insertedCount,
			errors: errors.length > 0 ? errors : undefined,
		};
	}

	async search(
		query: number[],
		options: SearchOptions,
	): Promise<SearchResult[]> {
		const { k = DEFAULT_K, filter, minScore = DEFAULT_MIN_SCORE } = options;

		const results: SearchResult[] = [];

		for (const doc of this.documents.values()) {
			if (filter && !matchesFilter(doc.metadata, filter)) {
				continue;
			}

			const score = cosineSimilarity(query, doc.embedding);
			if (score >= minScore) {
				results.push({ document: doc, score });
			}
		}

		results.sort((a, b) => b.score - a.score);
		return results.slice(0, k);
	}

	async delete(id: string): Promise<boolean> {
		return this.documents.delete(id);
	}

	async update(
		id: string,
		updates: Partial<Omit<VectorDocument, "id" | "createdAt">>,
	): Promise<boolean> {
		const existing = this.documents.get(id);
		if (!existing) {
			return false;
		}

		const updated: VectorDocument = {
			...existing,
			...updates,
			id,
			createdAt: existing.createdAt,
			updatedAt: Date.now(),
		};

		if (updates.embedding && updates.embedding.length !== this.dimension) {
			throw new Error(
				`Embedding dimension mismatch: expected ${this.dimension}, got ${updates.embedding.length}`,
			);
		}

		this.documents.set(id, updated);
		return true;
	}

	get(id: string): VectorDocument | undefined {
		return this.documents.get(id);
	}

	get count(): number {
		return this.documents.size;
	}

	get dim(): number {
		return this.dimension;
	}
}

/**
 * VectorStorage - A vector database storage module with LanceDB support and in-memory fallback.
 *
 * Supports 1536-dimensional embeddings (OpenAI compatible) with cosine similarity search.
 * Automatically falls back to in-memory storage when LanceDB is unavailable (browser/Cloudflare).
 *
 * @example
 * ```ts
 * const storage = new VectorStorage({ persistPath: "./data/vectors" });
 * await storage.initialize();
 *
 * await storage.insert({
 *   id: "doc1",
 *   content: "Hello world",
 *   embedding: [0.1, 0.2, ...], // 1536 dimensions
 *   metadata: { source: "web" }
 * });
 *
 * const results = await storage.search(queryEmbedding, { k: 10, minScore: 0.7 });
 * ```
 */
export class VectorStorage {
	private db: LanceDBConnection | null = null;
	private table: LanceDBTable | null = null;
	private memoryStore: InMemoryVectorStore;
	private config: Required<VectorStorageConfig>;
	private initialized = false;
	private useLanceDB = false;
	private tableName: string;

	/**
	 * Create a new VectorStorage instance.
	 * @param config - Configuration options including dimension, persistPath, and tableName
	 */
	constructor(config: VectorStorageConfig = {}) {
		this.config = {
			dimension: config.dimension ?? DEFAULT_DIMENSION,
			persistPath: config.persistPath ?? ":memory:",
			tableName: config.tableName ?? DEFAULT_TABLE_NAME,
		};
		this.tableName = this.config.tableName;
		this.memoryStore = new InMemoryVectorStore(this.config.dimension);
	}

	/**
	 * Initialize the vector storage. Must be called before any other operations.
	 * Attempts to connect to LanceDB if a persistPath is provided, otherwise uses in-memory storage.
	 */
	async initialize(): Promise<void> {
		if (this.initialized) {
			return;
		}

		try {
			const lancedb = await this.loadLanceDB();
			if (lancedb && this.config.persistPath !== ":memory:") {
				this.db = await lancedb.connect(this.config.persistPath);
				const tables = await this.db.tableNames();

				if (tables.includes(this.tableName)) {
					this.table = await this.db.openTable(this.tableName);
				} else {
					this.table = await this.db.createTable(this.tableName, [
						this.createEmptyRow(),
					]);
				}
				this.useLanceDB = true;
				console.log(
					`[VectorStorage] LanceDB initialized at ${this.config.persistPath}`,
				);
			} else {
				console.log("[VectorStorage] Using in-memory fallback");
			}
		} catch (error) {
			console.warn(
				"[VectorStorage] LanceDB unavailable, using in-memory fallback:",
				error instanceof Error ? error.message : error,
			);
		}

		this.initialized = true;
	}

	private async loadLanceDB(): Promise<typeof import("vectordb") | null> {
		try {
			const module = await import("vectordb");
			return module;
		} catch {
			return null;
		}
	}

	private createEmptyRow(): Record<string, unknown> {
		return {
			id: "placeholder",
			content: "",
			embedding: new Array(this.config.dimension).fill(0),
			metadata: {},
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
	}

	private ensureInitialized(): void {
		if (!this.initialized) {
			throw new Error(
				"VectorStorage not initialized. Call initialize() first.",
			);
		}
	}

	/**
	 * Insert a single document into the vector store.
	 * @param doc - The document to insert with id, content, embedding, and optional metadata
	 * @throws Error if not initialized or embedding dimension mismatch
	 */
	async insert(doc: VectorDocument): Promise<void> {
		this.ensureInitialized();

		if (doc.embedding.length !== this.config.dimension) {
			throw new Error(
				`Embedding dimension mismatch: expected ${this.config.dimension}, got ${doc.embedding.length}`,
			);
		}

		const docWithTimestamps: VectorDocument = {
			...doc,
			createdAt: doc.createdAt ?? Date.now(),
			updatedAt: doc.updatedAt ?? Date.now(),
		};

		if (this.useLanceDB && this.table) {
			await this.table.add([
				docWithTimestamps as unknown as Record<string, unknown>,
			]);
		} else {
			await this.memoryStore.insert(docWithTimestamps);
		}
	}

	/**
	 * Insert multiple documents in a batch operation.
	 * @param docs - Array of documents to insert
	 * @returns Result with success status, inserted count, and any errors
	 */
	async insertBatch(docs: VectorDocument[]): Promise<BatchInsertResult> {
		this.ensureInitialized();

		const docsWithTimestamps = docs.map((doc) => ({
			...doc,
			createdAt: doc.createdAt ?? Date.now(),
			updatedAt: doc.updatedAt ?? Date.now(),
		}));

		if (this.useLanceDB && this.table) {
			try {
				await this.table.add(
					docsWithTimestamps as unknown as Record<string, unknown>[],
				);
				return { success: true, insertedCount: docs.length };
			} catch (error) {
				return {
					success: false,
					insertedCount: 0,
					errors: [
						{
							id: "batch",
							error:
								error instanceof Error ? error.message : "Batch insert failed",
						},
					],
				};
			}
		}

		return this.memoryStore.insertBatch(docsWithTimestamps);
	}

	/**
	 * Search for similar documents using vector similarity.
	 * @param query - Query embedding vector (must match configured dimension)
	 * @param options - Search options including k (limit), filter (metadata), and minScore
	 * @returns Array of search results sorted by similarity score (descending)
	 */
	async search(
		query: number[],
		options: SearchOptions = {},
	): Promise<SearchResult[]> {
		this.ensureInitialized();

		if (query.length !== this.config.dimension) {
			throw new Error(
				`Query dimension mismatch: expected ${this.config.dimension}, got ${query.length}`,
			);
		}

		const { k = DEFAULT_K, minScore = DEFAULT_MIN_SCORE, filter } = options;

		if (this.useLanceDB && this.table) {
			let searchBuilder = this.table.search(query).limit(k);

			if (filter) {
				const filterStr = this.buildFilterString(filter);
				searchBuilder = searchBuilder.where(filterStr);
			}

			const results = await searchBuilder.toArray();

			return results
				.filter((row) => {
					const score = (row._distance as number) ?? 0;
					const convertedScore = 1 - score;
					return convertedScore >= minScore;
				})
				.map((row) => ({
					document: this.rowToDocument(row),
					score: 1 - ((row._distance as number) ?? 0),
				}));
		}

		return this.memoryStore.search(query, options);
	}

	private buildFilterString(filter: Record<string, unknown>): string {
		const conditions: string[] = [];
		for (const [key, value] of Object.entries(filter)) {
			if (typeof value === "string") {
				conditions.push(`metadata["${key}"] = "${value}"`);
			} else if (typeof value === "number") {
				conditions.push(`metadata["${key}"] = ${value}`);
			} else if (typeof value === "boolean") {
				conditions.push(`metadata["${key}"] = ${value}`);
			}
		}
		return conditions.join(" AND ");
	}

	private rowToDocument(row: Record<string, unknown>): VectorDocument {
		return {
			id: row.id as string,
			content: row.content as string,
			embedding: row.embedding as number[],
			metadata: (row.metadata as Record<string, unknown>) ?? {},
			createdAt: row.createdAt as number,
			updatedAt: row.updatedAt as number,
		};
	}

	/**
	 * Delete a document by ID.
	 * @param id - The document ID to delete
	 * @returns true if deleted, false if not found
	 */
	async delete(id: string): Promise<boolean> {
		this.ensureInitialized();

		if (this.useLanceDB && this.table) {
			try {
				await this.table.delete(`id = "${id}"`);
				return true;
			} catch {
				return false;
			}
		}

		return this.memoryStore.delete(id);
	}

	/**
	 * Update an existing document.
	 * @param id - The document ID to update
	 * @param updates - Partial document updates (cannot change id or createdAt)
	 * @returns true if updated, false if not found
	 * @throws Error if embedding dimension mismatch
	 */
	async update(
		id: string,
		updates: Partial<Omit<VectorDocument, "id" | "createdAt">>,
	): Promise<boolean> {
		this.ensureInitialized();

		if (this.useLanceDB && this.table) {
			try {
				await this.table.delete(`id = "${id}"`);
				const existing = await this.getById(id);
				if (!existing) {
					return false;
				}
				const updated: VectorDocument = {
					...existing,
					...updates,
					id,
					updatedAt: Date.now(),
				};
				await this.table.add([updated as unknown as Record<string, unknown>]);
				return true;
			} catch {
				return false;
			}
		}

		return this.memoryStore.update(id, updates);
	}

	/**
	 * Get a document by ID.
	 * @param id - The document ID to retrieve
	 * @returns The document or null if not found
	 */
	async getById(id: string): Promise<VectorDocument | null> {
		this.ensureInitialized();

		if (this.useLanceDB && this.table) {
			const results = await this.table
				.filter?.(`id = "${id}"`)
				.limit(1)
				.toArray();
			if (results.length > 0) {
				return this.rowToDocument(results[0]);
			}
			return null;
		}

		return this.memoryStore.get(id) ?? null;
	}

	/**
	 * Get storage statistics including document count and backend type.
	 * @returns Storage statistics
	 */
	async getStats(): Promise<StorageStats> {
		this.ensureInitialized();

		let count: number;
		if (this.useLanceDB && this.table) {
			count = await this.table.countRows();
		} else {
			count = this.memoryStore.count;
		}

		return {
			documentCount: count,
			dimension: this.config.dimension,
			tableName: this.tableName,
			backend: this.useLanceDB ? "lancedb" : "memory",
		};
	}

	/**
	 * Clear all documents from storage.
	 */
	async clear(): Promise<void> {
		this.ensureInitialized();

		if (this.useLanceDB && this.db) {
			const tables = await this.db.tableNames();
			if (tables.includes(this.tableName)) {
				const allDocs = await this.table!.search(
					new Array(this.config.dimension).fill(0),
				)
					.limit(Number.MAX_SAFE_INTEGER)
					.toArray();
				for (const doc of allDocs) {
					if (doc.id !== "placeholder") {
						await this.table!.delete(`id = "${doc.id}"`);
					}
				}
			}
		}

		this.memoryStore = new InMemoryVectorStore(this.config.dimension);
	}
}

/** Default singleton instance of VectorStorage with in-memory storage */
export const vectorStorage = new VectorStorage();
