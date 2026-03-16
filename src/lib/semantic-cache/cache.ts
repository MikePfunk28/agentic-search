import type {
	CacheEntry,
	CacheResult,
	CacheStats,
	CacheTier,
	SemanticCacheOptions,
} from "./types";

const DEFAULT_SIMILARITY_THRESHOLD = 0.85;
const DEFAULT_MAX_MEMORY_ENTRIES = 1000;
const DEFAULT_TTL = 5 * 60 * 1000;

export class SemanticCache<T = unknown> {
	private memoryCache: Map<string, CacheEntry<T>> = new Map();
	private queryVectors: Map<string, number[]> = new Map();
	private similarityThreshold: number;
	private maxMemoryEntries: number;
	private defaultTtl: number;
	private enableEmbedding: boolean;
	private hits = 0;
	private misses = 0;
	private totalSimilarity = 0;
	private similarityCount = 0;

	constructor(options: SemanticCacheOptions = {}) {
		this.similarityThreshold =
			options.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
		this.maxMemoryEntries =
			options.maxMemoryEntries ?? DEFAULT_MAX_MEMORY_ENTRIES;
		this.defaultTtl = options.defaultTtl ?? DEFAULT_TTL;
		this.enableEmbedding = options.enableEmbedding ?? true;
	}

	async get(query: string): Promise<CacheResult<T>> {
		const normalizedQuery = this.normalizeQuery(query);
		const queryEmbedding = this.enableEmbedding
			? await this.generateEmbedding(normalizedQuery)
			: undefined;

		const exactMatch = this.memoryCache.get(normalizedQuery);
		if (exactMatch && !this.isExpired(exactMatch)) {
			exactMatch.hitCount++;
			exactMatch.lastAccessed = Date.now();
			this.hits++;
			return {
				hit: true,
				entry: exactMatch,
				similarity: 1.0,
				fromTier: "memory",
			};
		}

		if (queryEmbedding) {
			const semanticMatch = await this.findSemanticMatch(
				normalizedQuery,
				queryEmbedding,
			);
			if (semanticMatch) {
				this.hits++;
				return semanticMatch;
			}
		}

		this.misses++;
		return {
			hit: false,
			reason: exactMatch ? "expired" : "not_found",
		};
	}

	async set(
		query: string,
		value: T,
		metadata?: CacheEntry<T>["metadata"],
		ttl?: number,
	): Promise<void> {
		const normalizedQuery = this.normalizeQuery(query);
		const embedding = this.enableEmbedding
			? await this.generateEmbedding(normalizedQuery)
			: undefined;

		if (this.memoryCache.size >= this.maxMemoryEntries) {
			this.evictOldest();
		}

		const entry: CacheEntry<T> = {
			key: normalizedQuery,
			normalizedQuery,
			embedding,
			value,
			timestamp: Date.now(),
			ttl: ttl ?? this.defaultTtl,
			hitCount: 0,
			lastAccessed: Date.now(),
			metadata: metadata ?? {},
		};

		this.memoryCache.set(normalizedQuery, entry);
		if (embedding) {
			this.queryVectors.set(normalizedQuery, embedding);
		}
	}

	async delete(query: string): Promise<boolean> {
		const normalizedQuery = this.normalizeQuery(query);
		this.queryVectors.delete(normalizedQuery);
		return this.memoryCache.delete(normalizedQuery);
	}

	clear(): void {
		this.memoryCache.clear();
		this.queryVectors.clear();
		this.hits = 0;
		this.misses = 0;
		this.totalSimilarity = 0;
		this.similarityCount = 0;
	}

	getStats(): CacheStats {
		let oldest: number | undefined;
		let newest: number | undefined;

		for (const entry of this.memoryCache.values()) {
			if (!oldest || entry.timestamp < oldest) oldest = entry.timestamp;
			if (!newest || entry.timestamp > newest) newest = entry.timestamp;
		}

		return {
			memoryEntries: this.memoryCache.size,
			totalHits: this.hits,
			totalMisses: this.misses,
			hitRate:
				this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
			averageSimilarity:
				this.similarityCount > 0
					? this.totalSimilarity / this.similarityCount
					: 0,
			oldestEntry: oldest,
			newestEntry: newest,
		};
	}

	invalidateExpired(): number {
		let invalidated = 0;
		const now = Date.now();

		for (const [key, entry] of this.memoryCache) {
			if (now - entry.timestamp > entry.ttl) {
				this.memoryCache.delete(key);
				this.queryVectors.delete(key);
				invalidated++;
			}
		}

		return invalidated;
	}

	private normalizeQuery(query: string): string {
		return query
			.toLowerCase()
			.replace(/[^\w\s]/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	}

	private async generateEmbedding(text: string): Promise<number[]> {
		const words = text.split(/\s+/);
		const embedding: number[] = new Array(128).fill(0);

		for (let i = 0; i < words.length; i++) {
			const word = words[i];
			const hash = this.simpleHash(word);
			const position = i % 128;
			embedding[position] += hash / words.length;
		}

		const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
		if (norm > 0) {
			for (let i = 0; i < embedding.length; i++) {
				embedding[i] /= norm;
			}
		}

		return embedding;
	}

	private simpleHash(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return Math.abs(hash) / 2147483647;
	}

	private cosineSimilarity(a: number[], b: number[]): number {
		if (a.length !== b.length) return 0;

		let dotProduct = 0;
		let normA = 0;
		let normB = 0;

		for (let i = 0; i < a.length; i++) {
			dotProduct += a[i] * b[i];
			normA += a[i] * a[i];
			normB += b[i] * b[i];
		}

		if (normA === 0 || normB === 0) return 0;
		return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
	}

	private async findSemanticMatch(
		normalizedQuery: string,
		queryEmbedding: number[],
	): Promise<CacheResult<T> | null> {
		let bestMatch: CacheEntry<T> | null = null;
		let bestSimilarity = 0;

		for (const [key, entry] of this.memoryCache) {
			if (key === normalizedQuery) continue;
			if (this.isExpired(entry)) continue;

			const storedEmbedding = this.queryVectors.get(key);
			if (!storedEmbedding) continue;

			const similarity = this.cosineSimilarity(queryEmbedding, storedEmbedding);

			if (
				similarity >= this.similarityThreshold &&
				similarity > bestSimilarity
			) {
				bestMatch = entry;
				bestSimilarity = similarity;
			}
		}

		if (bestMatch) {
			this.totalSimilarity += bestSimilarity;
			this.similarityCount++;

			return {
				hit: true,
				entry: bestMatch,
				similarity: bestSimilarity,
				fromTier: "memory",
			};
		}

		return null;
	}

	private isExpired(entry: CacheEntry<T>): boolean {
		return Date.now() - entry.timestamp > entry.ttl;
	}

	private evictOldest(): void {
		let oldestKey: string | null = null;
		let oldestTime = Infinity;

		for (const [key, entry] of this.memoryCache) {
			if (entry.lastAccessed < oldestTime) {
				oldestTime = entry.lastAccessed;
				oldestKey = key;
			}
		}

		if (oldestKey) {
			this.memoryCache.delete(oldestKey);
			this.queryVectors.delete(oldestKey);
		}
	}
}

export type {
	CacheEntry,
	CacheResult,
	CacheStats,
	CacheTier,
	SemanticCacheOptions,
};
