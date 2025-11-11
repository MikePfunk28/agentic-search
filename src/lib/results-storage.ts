/**
 * Researcher-Style Search Results Storage
 * 
 * Provides annotated, indexed, packaged results for use with other models/agents
 * Replaces traditional RAG with intelligent segmentation and structured storage
 */

import type { SearchResult } from './types';

export interface ResearchAnnotation {
	id: string;
	timestamp: number;
	author: 'user' | 'ai' | 'system';
	text: string;
	highlightedText?: string;
	tags: string[];
	confidence?: number;
}

export interface ResearchSegment {
	id: string;
	type: 'entity' | 'relation' | 'constraint' | 'intent' | 'context' | 'comparison' | 'synthesis';
	text: string;
	relevance: number;
	sources: string[];
	subSegments?: ResearchSegment[];
}

export interface StoredResearchResult {
	// Core result data
	id: string;
	query: string;
	timestamp: number;
	
	// Search results with enhanced metadata
	results: SearchResult[];
	
	// Researcher annotations
	annotations: ResearchAnnotation[];
	
	// Intelligent segmentation
	segments: ResearchSegment[];
	
	// Quality metrics
	addScore: number;
	userApproved: boolean;
	userModifications: string[];
	
	// Indexing for retrieval
	index: {
		entities: Record<string, string[]>; // entity -> result IDs
		keywords: Record<string, string[]>; // keyword -> result IDs
		sources: Record<string, string[]>; // source -> result IDs
		dates: Record<string, string[]>; // date range -> result IDs
	};
	
	// Export formats for other agents/models
	exports: {
		markdown: string;
		json: string;
		jsonl: string; // One result per line for training
		prompt: string; // Ready-to-use prompt format
	};
	
	// Metadata
	modelUsed: string;
	tokensUsed: number;
	executionTimeMs: number;
	segmentCount: number;
}

export class ResearchStorage {
	private storage: Map<string, StoredResearchResult> = new Map();
	
	/**
	 * Store search results with full research context
	 */
	async storeResults(
		query: string,
		results: SearchResult[],
		modelUsed: string,
		options?: {
			segments?: ResearchSegment[];
			addScore?: number;
			tokensUsed?: number;
			executionTimeMs?: number;
		}
	): Promise<StoredResearchResult> {
		const id = `research-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		
		// Build index
		const index = this.buildIndex(results);
		
		// Generate exports
		const exports = this.generateExports(query, results, modelUsed);
		
		// Auto-generate segments if not provided
		const segments = options?.segments || this.autoGenerateSegments(query, results);
		
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
		};
		
		this.storage.set(id, storedResult);
		
		return storedResult;
	}
	
	/**
	 * Add user annotation to result
	 */
	addAnnotation(
		resultId: string,
		annotation: Omit<ResearchAnnotation, 'id' | 'timestamp'>
	): boolean {
		const result = this.storage.get(resultId);
		if (!result) return false;
		
		const fullAnnotation: ResearchAnnotation = {
			id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			timestamp: Date.now(),
			...annotation,
		};
		
		result.annotations.push(fullAnnotation);
		return true;
	}
	
	/**
	 * Mark result as user-approved
	 */
	approveResult(resultId: string, modifications?: string[]): boolean {
		const result = this.storage.get(resultId);
		if (!result) return false;
		
		result.userApproved = true;
		if (modifications) {
			result.userModifications.push(...modifications);
		}
		
		return true;
	}
	
	/**
	 * Build searchable index from results
	 */
	private buildIndex(results: SearchResult[]): StoredResearchResult['index'] {
		const index: StoredResearchResult['index'] = {
			entities: {},
			keywords: {},
			sources: {},
			dates: {},
		};
		
		for (const result of results) {
			// Extract entities (capitalized words, tech terms)
			const text = `${result.title} ${result.snippet}`;
			const entities = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
			
			for (const entity of entities) {
				if (!index.entities[entity]) index.entities[entity] = [];
				index.entities[entity].push(result.id);
			}
			
			// Extract keywords (meaningful words > 3 chars)
			const keywords = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
			for (const keyword of keywords) {
				if (!index.keywords[keyword]) index.keywords[keyword] = [];
				if (!index.keywords[keyword].includes(result.id)) {
					index.keywords[keyword].push(result.id);
				}
			}
			
			// Index by source
			const source = result.source || 'unknown';
			if (!index.sources[source]) index.sources[source] = [];
			index.sources[source].push(result.id);
			
			// Index by date (year-month)
			if (result.publishedDate) {
				const date = new Date(result.publishedDate);
				const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
				if (!index.dates[dateKey]) index.dates[dateKey] = [];
				index.dates[dateKey].push(result.id);
			}
		}
		
		return index;
	}
	
	/**
	 * Auto-generate segments from query and results
	 */
	private autoGenerateSegments(query: string, results: SearchResult[]): ResearchSegment[] {
		const segments: ResearchSegment[] = [];
		
		// Entity segments - extract main entities from query
		const entities = query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
		for (const entity of entities) {
			segments.push({
				id: `seg-entity-${segments.length}`,
				type: 'entity',
				text: entity,
				relevance: 0.9,
				sources: results.map(r => r.url),
			});
		}
		
		// Intent segment - determine what user wants
		const intentKeywords = ['explain', 'how', 'what', 'why', 'when', 'compare'];
		const intent = intentKeywords.find(kw => query.toLowerCase().includes(kw));
		if (intent) {
			segments.push({
				id: `seg-intent-${segments.length}`,
				type: 'intent',
				text: `${intent} query`,
				relevance: 0.85,
				sources: [],
			});
		}
		
		// Synthesis segment - overall findings
		segments.push({
			id: `seg-synthesis-${segments.length}`,
			type: 'synthesis',
			text: `Synthesis of ${results.length} results`,
			relevance: 1.0,
			sources: results.map(r => r.url),
		});
		
		return segments;
	}
	
	/**
	 * Generate export formats for other agents/models
	 */
	private generateExports(
		query: string,
		results: SearchResult[],
		modelUsed: string
	): StoredResearchResult['exports'] {
		// Markdown format
		const markdown = `# Research Results: ${query}\n\n**Model Used:** ${modelUsed}\n**Results Found:** ${results.length}\n**Timestamp:** ${new Date().toISOString()}\n\n## Results\n\n${results.map((r, i) => `### ${i + 1}. ${r.title}\n\n**Source:** ${r.url}\n**Quality Score:** ${r.addScore?.toFixed(2) || 'N/A'}\n\n${r.snippet}\n\n---\n`).join('\n')}`;
		
		// JSON format
		const json = JSON.stringify({
			query,
			modelUsed,
			timestamp: new Date().toISOString(),
			results: results.map(r => ({
				id: r.id,
				title: r.title,
				snippet: r.snippet,
				url: r.url,
				source: r.source,
				addScore: r.addScore,
				publishedDate: r.publishedDate,
			})),
		}, null, 2);
		
		// JSONL format (one result per line for training)
		const jsonl = results.map(r => JSON.stringify({
			query,
			result: {
				title: r.title,
				snippet: r.snippet,
				url: r.url,
				addScore: r.addScore,
			},
		})).join('\n');
		
		// Prompt format (ready for other models)
		const prompt = `You are analyzing search results for the query: "${query}"\n\nHere are ${results.length} high-quality results:\n\n${results.map((r, i) => `[${i + 1}] ${r.title}\nSource: ${r.url}\nQuality: ${r.addScore?.toFixed(2)}\nContent: ${r.snippet}\n`).join('\n')}\n\nPlease analyze these results and provide insights.`;
		
		return { markdown, json, jsonl, prompt };
	}
	
	/**
	 * Search stored results by query, entity, or keyword
	 */
	search(searchTerm: string): StoredResearchResult[] {
		const term = searchTerm.toLowerCase();
		const results: StoredResearchResult[] = [];
		
		for (const result of this.storage.values()) {
			// Search in query
			if (result.query.toLowerCase().includes(term)) {
				results.push(result);
				continue;
			}
			
			// Search in index
			if (result.index.keywords[term] || result.index.entities[term]) {
				results.push(result);
				continue;
			}
			
			// Search in annotations
			if (result.annotations.some(a => a.text.toLowerCase().includes(term))) {
				results.push(result);
			}
		}
		
		return results;
	}
	
	/**
	 * Get result by ID
	 */
	getResult(id: string): StoredResearchResult | null {
		return this.storage.get(id) || null;
	}
	
	/**
	 * Get all results
	 */
	getAllResults(): StoredResearchResult[] {
		return Array.from(this.storage.values());
	}
	
	/**
	 * Export result in specified format
	 */
	exportResult(id: string, format: 'markdown' | 'json' | 'jsonl' | 'prompt'): string | null {
		const result = this.storage.get(id);
		if (!result) return null;
		
		return result.exports[format];
	}
	
	/**
	 * Delete result
	 */
	deleteResult(id: string): boolean {
		return this.storage.delete(id);
	}
	
	/**
	 * Clear all results
	 */
	clearAll(): void {
		this.storage.clear();
	}
}

// Singleton instance
export const researchStorage = new ResearchStorage();
