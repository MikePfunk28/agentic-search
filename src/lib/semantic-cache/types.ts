export interface CacheEntry<T> {
	key: string;
	normalizedQuery: string;
	embedding?: number[];
	value: T;
	timestamp: number;
	ttl: number;
	hitCount: number;
	lastAccessed: number;
	metadata: {
		provider?: string;
		model?: string;
		tokensUsed?: number;
		quality?: number;
	};
}

export interface CacheHit<T> {
	hit: true;
	entry: CacheEntry<T>;
	similarity: number;
	fromTier: CacheTier;
}

export interface CacheMiss {
	hit: false;
	reason: "not_found" | "expired" | "similarity_too_low";
}

export type CacheResult<T> = CacheHit<T> | CacheMiss;

export type CacheTier = "memory" | "persistent";

export interface SemanticCacheOptions {
	similarityThreshold?: number;
	maxMemoryEntries?: number;
	defaultTtl?: number;
	enableEmbedding?: boolean;
}

export interface CacheStats {
	memoryEntries: number;
	totalHits: number;
	totalMisses: number;
	hitRate: number;
	averageSimilarity: number;
	oldestEntry?: number;
	newestEntry?: number;
}

export interface QueryVector {
	query: string;
	vector: number[];
	timestamp: number;
}

const _DEFAULT_SIMILARITY_THRESHOLD = 0.85;
const _DEFAULT_MAX_MEMORY_ENTRIES = 1000;
const _DEFAULT_TTL = 5 * 60 * 1000;
