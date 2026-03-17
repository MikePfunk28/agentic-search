/** Document stored in the vector database */
export interface VectorDocument {
	/** Unique identifier for the document */
	id: string;
	/** Text content of the document */
	content: string;
	/** Vector embedding (default 1536 dimensions for OpenAI compatibility) */
	embedding: number[];
	/** Arbitrary metadata associated with the document */
	metadata: Record<string, unknown>;
	/** Unix timestamp when document was created */
	createdAt: number;
	/** Unix timestamp when document was last updated */
	updatedAt: number;
}

/** Options for vector similarity search */
export interface SearchOptions {
	/** Maximum number of results to return (default: 10) */
	k?: number;
	/** Metadata filter for narrowing results */
	filter?: Record<string, unknown>;
	/** Minimum similarity score threshold (0-1, default: 0) */
	minScore?: number;
}

/** Result from vector similarity search */
export interface SearchResult {
	/** The matched document */
	document: VectorDocument;
	/** Similarity score (0-1, higher is more similar) */
	score: number;
}

/** Configuration for VectorStorage */
export interface VectorStorageConfig {
	/** Embedding dimension (default: 1536 for OpenAI compatibility) */
	dimension?: number;
	/** Path for persistent storage, or ":memory:" for in-memory (default: ":memory:") */
	persistPath?: string;
	/** Table name in the database (default: "vectors") */
	tableName?: string;
}

/** Result of batch insert operation */
export interface BatchInsertResult {
	/** Whether all inserts succeeded */
	success: boolean;
	/** Number of documents successfully inserted */
	insertedCount: number;
	/** Errors for failed inserts (if any) */
	errors?: Array<{ id: string; error: string }>;
}

/** Statistics about the vector storage */
export interface StorageStats {
	/** Total number of documents in storage */
	documentCount: number;
	/** Configured embedding dimension */
	dimension: number;
	/** Table name */
	tableName: string;
	/** Backend being used */
	backend: "lancedb" | "memory";
}

/** Metadata filter type */
export type VectorFilter = Record<string, unknown>;

/** Default embedding dimension (OpenAI text-embedding-ada-002 compatible) */
export const DEFAULT_DIMENSION = 1536;

/** Default table name */
export const DEFAULT_TABLE_NAME = "vectors";

/** Default minimum similarity score */
export const DEFAULT_MIN_SCORE = 0.0;

/** Default number of results */
export const DEFAULT_K = 10;
