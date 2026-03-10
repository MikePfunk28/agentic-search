/**
 * RAG Retrieval Engine
 *
 * Three retrieval levels:
 * 1. Minimal  — BM25 full-text search over Convex search index
 * 2. Medium   — BM25 + vector cosine similarity (user's local embedding model)
 * 3. Full     — BM25 + vector + knowledge graph traversal + web crawl
 *
 * Each level is additive — medium includes minimal, full includes both.
 */

import type { RagChunk, RagLevel, RagRetrievalResult, RagSearchOptions } from "./types";

// ── Token estimation ────────────────────────────────────────────────────

/** Rough token count: ~4 chars per token for English text */
export function estimateTokenCount(text: string): number {
	return Math.ceil(text.length / 4);
}

// ── Text chunking ───────────────────────────────────────────────────────

export interface TextChunk {
	text: string;
	chunkIndex: number;
	page?: number;
	tokenCount: number;
}

/**
 * Split raw text into semantically meaningful chunks.
 * Uses paragraph boundaries with a ~500-token target per chunk.
 */
export function chunkText(text: string, maxTokensPerChunk = 500): TextChunk[] {
	const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
	const chunks: TextChunk[] = [];
	let current = "";
	let currentTokens = 0;

	for (const para of paragraphs) {
		const paraTokens = estimateTokenCount(para);

		if (currentTokens + paraTokens > maxTokensPerChunk && current.length > 0) {
			chunks.push({
				text: current.trim(),
				chunkIndex: chunks.length,
				tokenCount: currentTokens,
			});
			current = para;
			currentTokens = paraTokens;
		} else {
			current += (current ? "\n\n" : "") + para;
			currentTokens += paraTokens;
		}
	}

	if (current.trim().length > 0) {
		chunks.push({
			text: current.trim(),
			chunkIndex: chunks.length,
			tokenCount: currentTokens,
		});
	}

	return chunks;
}

// ── BM25 scoring (minimal level) ───────────────────────────────────────

/**
 * Simple BM25-style relevance scoring.
 * k1 and b are standard BM25 tuning params.
 */
export function bm25Score(
	query: string,
	document: string,
	avgDocLength: number,
	k1 = 1.5,
	b = 0.75,
): number {
	const queryTerms = query.toLowerCase().split(/\s+/);
	const docTerms = document.toLowerCase().split(/\s+/);
	const docLength = docTerms.length;

	// Term frequency map
	const tf = new Map<string, number>();
	for (const term of docTerms) {
		tf.set(term, (tf.get(term) || 0) + 1);
	}

	let score = 0;
	for (const term of queryTerms) {
		const termFreq = tf.get(term) || 0;
		if (termFreq === 0) continue;

		// BM25 term score
		const numerator = termFreq * (k1 + 1);
		const denominator = termFreq + k1 * (1 - b + b * (docLength / avgDocLength));
		score += numerator / denominator;
	}

	return score;
}

// ── Vector similarity (medium level) ────────────────────────────────────

/** Cosine similarity between two equal-length vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
	if (a.length !== b.length || a.length === 0) return 0;

	let dotProduct = 0;
	let normA = 0;
	let normB = 0;

	for (let i = 0; i < a.length; i++) {
		dotProduct += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}

	const denom = Math.sqrt(normA) * Math.sqrt(normB);
	return denom === 0 ? 0 : dotProduct / denom;
}

/**
 * Generate an embedding vector for text using the user's configured model.
 * Supports Ollama (localhost) and any OpenAI-compatible endpoint.
 */
export async function generateEmbedding(
	text: string,
	config: { provider: string; model: string; baseUrl?: string; apiKey?: string },
): Promise<number[]> {
	const baseUrl = config.baseUrl || (config.provider === "ollama" ? "http://localhost:11434" : "");

	if (config.provider === "ollama") {
		const resp = await fetch(`${baseUrl}/api/embeddings`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ model: config.model, prompt: text }),
		});
		if (!resp.ok) throw new Error(`Ollama embedding failed: ${resp.status}`);
		const data = await resp.json();
		return data.embedding;
	}

	// OpenAI-compatible embedding endpoint
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	if (config.apiKey) headers["Authorization"] = `Bearer ${config.apiKey}`;

	const resp = await fetch(`${baseUrl}/v1/embeddings`, {
		method: "POST",
		headers,
		body: JSON.stringify({ model: config.model, input: text }),
	});
	if (!resp.ok) throw new Error(`Embedding API failed: ${resp.status}`);
	const data = await resp.json();
	return data.data?.[0]?.embedding ?? [];
}

// ── Merged retrieval ────────────────────────────────────────────────────

/**
 * Score and rank chunks using the appropriate method(s) for the RAG level.
 *
 * - minimal: BM25 only
 * - medium:  BM25 + vector similarity (blended 0.4 BM25 / 0.6 vector)
 * - full:    BM25 + vector + domain/topic boost
 */
export function rankChunks(
	query: string,
	chunks: Array<{
		id: string;
		text: string;
		documentName: string;
		chunkIndex: number;
		page?: number;
		embedding?: number[];
		domain?: string;
		topic?: string;
	}>,
	level: RagLevel,
	queryEmbedding?: number[],
	maxResults = 10,
): RagChunk[] {
	if (chunks.length === 0) return [];

	const avgDocLen = chunks.reduce((s, c) => s + c.text.split(/\s+/).length, 0) / chunks.length;

	const scored: RagChunk[] = chunks.map((chunk) => {
		const bm25 = bm25Score(query, chunk.text, avgDocLen);

		let vectorSim = 0;
		if ((level === "medium" || level === "full") && queryEmbedding && chunk.embedding) {
			vectorSim = cosineSimilarity(queryEmbedding, chunk.embedding);
		}

		// Domain/topic boost for full RAG
		let domainBoost = 0;
		if (level === "full" && chunk.domain) {
			const queryLower = query.toLowerCase();
			if (chunk.domain.toLowerCase().split(/\s+/).some((w) => queryLower.includes(w))) {
				domainBoost = 0.1;
			}
			if (chunk.topic && chunk.topic.toLowerCase().split(/\s+/).some((w) => queryLower.includes(w))) {
				domainBoost += 0.15;
			}
		}

		// Blend scores based on level
		let finalScore: number;
		if (level === "minimal") {
			finalScore = bm25;
		} else {
			// medium or full: weight vector higher
			finalScore = 0.4 * bm25 + 0.6 * vectorSim + domainBoost;
		}

		return {
			id: chunk.id,
			text: chunk.text,
			documentName: chunk.documentName,
			chunkIndex: chunk.chunkIndex,
			page: chunk.page,
			bm25Score: bm25,
			vectorScore: vectorSim || undefined,
			score: finalScore,
			domain: chunk.domain,
			topic: chunk.topic,
		};
	});

	// Sort descending by score, take top N
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, maxResults);
}

/**
 * Build context string from ranked RAG chunks for injection into LLM prompt.
 * Respects a maximum token budget.
 */
export function buildRagContext(chunks: RagChunk[], maxTokens = 2000): string {
	const parts: string[] = [];
	let tokens = 0;

	for (const chunk of chunks) {
		const chunkTokens = estimateTokenCount(chunk.text);
		if (tokens + chunkTokens > maxTokens) break;

		parts.push(`[${chunk.documentName} — chunk ${chunk.chunkIndex + 1}${chunk.page ? `, p${chunk.page}` : ""}]\n${chunk.text}`);
		tokens += chunkTokens;
	}

	if (parts.length === 0) return "";

	return `--- Relevant knowledge from your documents ---\n\n${parts.join("\n\n---\n\n")}\n\n--- End of document context ---`;
}
