/**
 * RAG Pipeline Types
 * Shared types for the Retrieval-Augmented Generation system.
 */

/** Which RAG level the user has selected */
export type RagLevel = "none" | "minimal" | "medium" | "full";

/** A single chunk returned from RAG retrieval */
export interface RagChunk {
	id: string;
	text: string;
	documentName: string;
	chunkIndex: number;
	page?: number;
	/** BM25 keyword relevance (minimal+) */
	bm25Score?: number;
	/** Cosine similarity from vector search (medium+) */
	vectorScore?: number;
	/** Blended score (higher = more relevant) */
	score: number;
	/** Knowledge domain/topic (full only) */
	domain?: string;
	topic?: string;
}

/** Result of a RAG retrieval pass */
export interface RagRetrievalResult {
	level: RagLevel;
	chunks: RagChunk[];
	totalChunksSearched: number;
	latencyMs: number;
	tokensUsed: number;
}

/** Options for RAG retrieval */
export interface RagSearchOptions {
	userId: string;
	query: string;
	knowledgeBaseId?: string;
	level: RagLevel;
	maxChunks?: number;
	/** For medium/full: embedding model config */
	embeddingConfig?: {
		provider: string;
		model: string;
		baseUrl?: string;
		apiKey?: string;
	};
}

/** Analytics event logged after each RAG-augmented search */
export interface RagAnalyticsEvent {
	userId: string;
	query: string;
	ragLevel: RagLevel;
	ragResultCount: number;
	webResultCount: number;
	mergedResultCount: number;
	addScoreRag?: number;
	addScoreWeb?: number;
	addScoreMerged: number;
	ragLatencyMs: number;
	webLatencyMs: number;
	totalLatencyMs: number;
	ragTokensUsed: number;
}

/** Document upload request */
export interface DocumentUploadRequest {
	userId: string;
	knowledgeBaseId: string;
	fileName: string;
	fileType: "pdf" | "docx" | "txt" | "md" | "url";
	content: string; // raw text or URL
	generateEmbeddings: boolean;
}

/** Crawl job request (full RAG) */
export interface CrawlJobRequest {
	userId: string;
	knowledgeBaseId: string;
	seedUrl: string;
	depth: number;
	maxPages: number;
}
