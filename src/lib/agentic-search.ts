/**
 * Agentic Search Engine
 * Agentic search with active planning, multi-source search, and continuous learning
 *
 * Key accuracy features:
 * - Domain authority scoring (real reputation, not hardcoded)
 * - Cross-source citation verification (multi-provider boost)
 * - Exponential freshness decay (no arbitrary cliffs)
 * - N-gram semantic matching (beyond single-word regex)
 * - Comprehensive adversarial detection (spam, caps, URL patterns)
 * - Result deduplication (URL + content similarity)
 * - ADD quality scoring with all 5 discriminators
 */

import { ModelConfig, ModelConfigManager, ModelProvider } from "./model-config";
import { executeWebSearch } from "./search-providers";
import { calculateDomainAuthority } from "./search-providers";
import { validateServerFetchUrl } from "./url-validation";
import type { SearchResult } from "./types";

/** Check if URL ends with a version segment like /v1, /v4, /v1beta — no regex */
function hasVersionSegment(url: string): boolean {
	const lastSlash = url.lastIndexOf("/");
	if (lastSlash === -1) return false;
	const segment = url.slice(lastSlash + 1);
	return segment.length >= 2 && segment[0] === "v" && segment[1] >= "0" && segment[1] <= "9";
}

/** Strip trailing slashes from URL — no regex */
function stripTrailingSlashes(url: string): string {
	while (url.endsWith("/")) url = url.slice(0, -1);
	return url;
}

export interface SearchIntent {
	type: "factual" | "research" | "comparison" | "tutorial" | "news" | "analysis";
	complexity: "simple" | "moderate" | "complex";
	timeframe?: "recent" | "historical" | "current";
	sources: ("web" | "academic" | "news" | "documentation" | "social")[];
}

export interface SearchStrategy {
	primaryQuery: string;
	followUpQueries: string[];
	sources: string[];
	searchDepth: number;
	qualityThreshold: number;
}

export interface QualityAssessment {
	addScore: number; // Adversarial Differential Discrimination score
	credibility: number;
	freshness: number;
	relevance: number;
	diversity: number;
	flags: string[]; // adversarial content flags
}

/** Metrics tracked per search for monitoring accuracy over time */
export interface SearchMetrics {
	totalResults: number;
	filteredResults: number;
	avgAddScore: number;
	avgDomainAuthority: number;
	crossCitedCount: number;
	duplicatesRemoved: number;
	providersUsed: string[];
	searchTimeMs: number;
}

export class AgenticSearchEngine {
	private modelManager: ModelConfigManager;
	private searchMetrics: SearchMetrics[] = [];

	constructor() {
		this.modelManager = new ModelConfigManager();
	}

	/**
	 * Get recent search metrics for monitoring accuracy trends
	 */
	getRecentMetrics(count = 10): SearchMetrics[] {
		return this.searchMetrics.slice(-count);
	}

	/**
	 * Main search method - active reasoning with multi-source validation
	 */
	async search(query: string, modelConfig?: ModelConfig, opts?: { searchApiKeys?: { firecrawl?: string; tavily?: string; exa?: string; brave?: string } }): Promise<{
		results: SearchResult[];
		reasoning: string[];
		strategy: SearchStrategy;
		quality: QualityAssessment[];
		metrics: SearchMetrics;
	}> {
		const searchStart = Date.now();
		// Model is optional - search works without one, just skips AI-enhanced phases
		// Only use the model explicitly passed in — never fall back to the internal
		// ModelConfigManager default (which points at Ollama localhost:11434).
		// When modelConfig is null the search runs in web-only mode.
		const model = modelConfig || null;

		const searchApiKeys = opts?.searchApiKeys || {};
		const reasoning: string[] = [];

		// Phase 1: Intent Analysis (uses AI if available, deterministic fallback otherwise)
		reasoning.push("Analyzing search intent and query complexity...");
		let intent: SearchIntent;
		if (model) {
			intent = await this.analyzeIntent(query, model);
		} else {
			intent = {
				type: this.detectIntentType(query),
				complexity: this.detectComplexity(query),
				sources: ["web"],
			};
			reasoning.push("(No AI model configured - using deterministic intent analysis)");
		}
		reasoning.push(`Identified intent: ${intent.type} query with ${intent.complexity} complexity`);

		// Phase 2: Strategy Planning (uses AI if available, deterministic fallback otherwise)
		reasoning.push("Planning optimal search strategy...");
		let strategy: SearchStrategy;
		if (model) {
			strategy = await this.planSearchStrategy(query, intent, model);
		} else {
			strategy = this.buildDeterministicStrategy(query, intent);
			reasoning.push("(No AI model configured - using deterministic query expansion)");
		}
		reasoning.push(`Strategy: ${strategy.followUpQueries.length + 1} queries across ${strategy.sources.length} sources`);

		// Phase 3: Multi-Source Web Search (always runs - this is the core)
		reasoning.push("Executing multi-source web search...");
		const rawResults = await this.executeMultiSourceSearch(strategy, searchApiKeys);
		const providers = [...new Set(rawResults.map((r: any) => r.provider).filter(Boolean))];
		reasoning.push(`Found ${rawResults.length} results from ${providers.length} provider(s): ${providers.join(", ") || "none"}`);

		if (rawResults.length === 0) {
			reasoning.push("No results from search providers. Add a Tavily, Exa, Firecrawl, or Brave API key in Settings.");
		}

		// Phase 4: Deduplication (before scoring to avoid wasting compute)
		const { unique: dedupedResults, duplicatesRemoved } = this.deduplicateResults(rawResults);
		if (duplicatesRemoved > 0) {
			reasoning.push(`Removed ${duplicatesRemoved} duplicate results`);
		}

		// Phase 5: Quality Assessment with ADD Scoring (always runs - deterministic)
		reasoning.push("Applying ADD quality assessment with domain authority and citation verification...");
		const { results, quality } = await this.assessAndRankResults(dedupedResults, strategy, query);
		const avgScore = quality.length > 0
			? (quality.reduce((sum, q) => sum + q.addScore, 0) / quality.length).toFixed(2)
			: "0";
		const crossCited = results.filter(r => (r.citationCount || 0) > 1).length;
		reasoning.push(`Filtered to ${results.length} high-quality results (avg ADD: ${avgScore}, ${crossCited} cross-cited)`);

		// Phase 6: Synthesis and Correlation (only with AI model)
		let synthesizedResults: SearchResult[];
		if (model && results.length > 3) {
			reasoning.push("Synthesizing findings and identifying correlations...");
			synthesizedResults = await this.synthesizeResults(results, model);
			reasoning.push("Synthesis complete - results ready");
		} else {
			synthesizedResults = results.slice(0, 10);
			if (!model) {
				reasoning.push("Skipping AI synthesis (no model configured) - returning ranked results");
			} else {
				reasoning.push("Results ready");
			}
		}

		// Phase 7: Learning Update (continuous improvement)
		await this.updateLearningModel(query, intent, strategy, synthesizedResults);

		// Track metrics
		const metrics: SearchMetrics = {
			totalResults: rawResults.length,
			filteredResults: results.length,
			avgAddScore: parseFloat(avgScore),
			avgDomainAuthority: results.length > 0
				? results.reduce((sum, r) => sum + (r.domainAuthority || 0), 0) / results.length
				: 0,
			crossCitedCount: crossCited,
			duplicatesRemoved,
			providersUsed: providers,
			searchTimeMs: Date.now() - searchStart,
		};
		this.searchMetrics.push(metrics);
		// Keep last 100 metrics
		if (this.searchMetrics.length > 100) {
			this.searchMetrics = this.searchMetrics.slice(-100);
		}

		return {
			results: synthesizedResults,
			reasoning,
			strategy,
			quality,
			metrics,
		};
	}

	/**
	 * Phase 1: Intent Analysis - What does the user really want?
	 */
	private async analyzeIntent(query: string, model: ModelConfig): Promise<SearchIntent> {
		const prompt = `Analyze this search query and determine the user's intent:

Query: "${query}"

Return a JSON object with:
{
  "type": "factual|research|comparison|tutorial|news|analysis",
  "complexity": "simple|moderate|complex",
  "timeframe": "recent|historical|current" (optional),
  "sources": ["web", "academic", "news", "documentation", "social"] (prioritized)
}

Be specific about the intent type and appropriate sources.`;

		try {
			// Use a constrained model config: short timeout + limited tokens for JSON tasks
			const fastModel = { ...model, maxTokens: model.maxTokens ?? 300, timeout: Math.min(model.timeout || 60000, 15000) };
			const response = await this.callModel(prompt, fastModel);
			const parsed = JSON.parse(response);
			return {
				type: parsed.type || "factual",
				complexity: parsed.complexity || "moderate",
				timeframe: parsed.timeframe,
				sources: parsed.sources || ["web"],
			};
		} catch (err) {
			console.warn('[AgenticSearch] analyzeIntent model call failed, using deterministic fallback:', err instanceof Error ? err.message : err);
			// Fallback intent analysis
			return {
				type: this.detectIntentType(query),
				complexity: this.detectComplexity(query),
				sources: ["web", "academic"],
			};
		}
	}

	/**
	 * Phase 2: Strategy Planning - How to search effectively?
	 */
	private async planSearchStrategy(originalQuery: string, intent: SearchIntent, model: ModelConfig): Promise<SearchStrategy> {
		const prompt = `Create an optimal search strategy for this intent:

Intent: ${JSON.stringify(intent, null, 2)}

Generate a search strategy with:
{
  "primaryQuery": "optimized main search query",
  "followUpQueries": ["refinement query 1", "refinement query 2"],
  "sources": ["source1", "source2"],
  "searchDepth": 2-5,
  "qualityThreshold": 0.3-0.6
}

Make queries specific and effective for the intent type.`;

		try {
			// Use a constrained model config: short timeout + limited tokens for JSON tasks
			const fastModel = { ...model, maxTokens: model.maxTokens ?? 300, timeout: Math.min(model.timeout || 60000, 15000) };
			const response = await this.callModel(prompt, fastModel);
			const parsed = JSON.parse(response);
			return {
				primaryQuery: parsed.primaryQuery || originalQuery,
				followUpQueries: parsed.followUpQueries || [],
				sources: parsed.sources || intent.sources,
				searchDepth: parsed.searchDepth || 3,
				qualityThreshold: Math.min(parsed.qualityThreshold || 0.4, 0.6),
			};
		} catch (err) {
			console.warn('[AgenticSearch] planSearchStrategy model call failed, using deterministic fallback:', err instanceof Error ? err.message : err);
			return this.buildDeterministicStrategy(originalQuery, intent);
		}
	}

	private buildDeterministicStrategy(query: string, intent: SearchIntent): SearchStrategy {
		const followUpQueries = this.buildDeterministicFollowUpQueries(query, intent);
		return {
			primaryQuery: query,
			followUpQueries,
			sources: intent.sources,
			searchDepth: Math.min(4, followUpQueries.length + 1),
			qualityThreshold: 0.4,
		};
	}

	private buildDeterministicFollowUpQueries(query: string, intent: SearchIntent): string[] {
		const normalizedQuery = query.trim().replace(/\s+/g, " ");
		const variants: string[] = [];
		const lower = normalizedQuery.toLowerCase();

		if (normalizedQuery.includes(" ")) {
			variants.push(`"${normalizedQuery}"`);
		}

		if (intent.type === "news" || /\b(latest|recent|today|new|news|update)\b/i.test(normalizedQuery)) {
			variants.push(`${normalizedQuery} latest updates`);
			variants.push(`${normalizedQuery} official announcement`);
		} else if (intent.type === "comparison") {
			variants.push(`${normalizedQuery} comparison`);
			variants.push(`${normalizedQuery} pros cons`);
		} else if (intent.type === "tutorial") {
			variants.push(`${normalizedQuery} step by step`);
			variants.push(`${normalizedQuery} guide`);
		} else if (intent.type === "research" || intent.type === "analysis") {
			variants.push(`${normalizedQuery} evidence`);
			variants.push(`${normalizedQuery} overview`);
		} else {
			variants.push(`${normalizedQuery} overview`);
			variants.push(`${normalizedQuery} official documentation`);
		}

		const keywordVariant = lower
			.split(/\s+/)
			.filter((word) => word.length > 3 && !["what", "when", "where", "which", "with", "from", "that", "this"].includes(word))
			.slice(0, 6)
			.join(" ");
		if (keywordVariant && keywordVariant !== lower) {
			variants.push(keywordVariant);
		}

		return [...new Set(
			variants
				.map((variant) => variant.trim())
				.filter((variant) => variant && variant.toLowerCase() !== lower),
		)].slice(0, 3);
	}

	/**
	 * Phase 3: Multi-Source Search Execution
	 * Uses real search providers (Firecrawl, Brave Search). No mock data.
	 */
	private async executeMultiSourceSearch(strategy: SearchStrategy, searchApiKeys: { firecrawl?: string; tavily?: string; exa?: string; brave?: string } = {}): Promise<any[]> {
		const queries = [
			strategy.primaryQuery,
			...strategy.followUpQueries.slice(0, Math.max(0, strategy.searchDepth - 1)),
		]
			.map((query) => query.trim())
			.filter(Boolean);
		const uniqueQueries = [...new Set(queries)];

		const queryResults = await Promise.all(
			uniqueQueries.map(async (searchQuery, index) => {
				try {
					const results = await executeWebSearch(searchQuery, {
						firecrawlApiKey: searchApiKeys.firecrawl,
						tavilyApiKey: searchApiKeys.tavily,
						exaApiKey: searchApiKeys.exa,
						braveApiKey: searchApiKeys.brave,
						limit: index === 0 ? 10 : 5,
					});
					return results.map((result) => this.sanitizeChunk(result));
				} catch (error) {
					console.warn(`[AgenticSearch] Query failed: ${searchQuery}`, error);
					return [];
				}
			}),
		);

		return queryResults.flat();
	}

	/**
	 * Deduplicate results by URL and content similarity.
	 * Keeps the version with higher rawScore and longer snippet.
	 */
	private deduplicateResults(results: any[]): { unique: any[]; duplicatesRemoved: number } {
		const urlMap = new Map<string, any>();
		let duplicatesRemoved = 0;

		for (const result of results) {
			const normalizedUrl = this.normalizeUrl(result.url);

			const existing = urlMap.get(normalizedUrl);
			if (!existing) {
				urlMap.set(normalizedUrl, result);
			} else {
				duplicatesRemoved++;
				// Keep the richer version
				if ((result.snippet?.length || 0) > (existing.snippet?.length || 0)) {
					urlMap.set(normalizedUrl, {
						...result,
						// Preserve citation count from fusion
						citationCount: Math.max(result.citationCount || 1, existing.citationCount || 1),
					});
				} else {
					existing.citationCount = Math.max(result.citationCount || 1, existing.citationCount || 1);
				}
			}
		}

		// Also check content similarity for different URLs with near-identical content
		const unique = [...urlMap.values()];
		const toRemove = new Set<number>();

		for (let i = 0; i < unique.length; i++) {
			if (toRemove.has(i)) continue;
			for (let j = i + 1; j < unique.length; j++) {
				if (toRemove.has(j)) continue;
				const similarity = this.calculateJaccardSimilarity(
					unique[i].snippet || "",
					unique[j].snippet || ""
				);
				// If >80% similar content, keep the one with higher score
				if (similarity > 0.8) {
					const keepIdx = (unique[i].rawScore || 0) >= (unique[j].rawScore || 0) ? i : j;
					const removeIdx = keepIdx === i ? j : i;
					toRemove.add(removeIdx);
					duplicatesRemoved++;
				}
			}
		}

		const filtered = unique.filter((_, idx) => !toRemove.has(idx));
		return { unique: filtered, duplicatesRemoved };
	}

	/**
	 * Phase 4: Quality Assessment with ADD Scoring
	 */
	private async assessAndRankResults(
		rawResults: any[],
		strategy: SearchStrategy,
		originalQuery: string
	): Promise<{ results: SearchResult[]; quality: QualityAssessment[] }> {
		const assessments: QualityAssessment[] = [];
		const filteredResults: SearchResult[] = [];

		for (const result of rawResults) {
			// Skip any chunk marked BLOCK or SUSPICIOUS
			if (result.risk_flag && result.risk_flag !== 'SAFE') {
				continue;
			}
			const assessment = await this.assessQuality(result, strategy, originalQuery);
			assessments.push(assessment);

			if (assessment.addScore >= strategy.qualityThreshold) {
				const sourceType = result.provider || 'web';

				filteredResults.push({
					id: result.id,
					title: result.title,
					// Pass sanitized summary into downstream reasoning
					snippet: result.safe_summary || result.snippet,
					url: result.url,
					source: sourceType,
					provider: result.provider,
					addScore: assessment.addScore,
					domainAuthority: result.domainAuthority || calculateDomainAuthority(result.url),
					citationCount: result.citationCount || 1,
					publishedDate: result.publishedDate,
				});
			}
		}

		// Sort by ADD score descending
		filteredResults.sort((a, b) => (b.addScore || 0) - (a.addScore || 0));

		return { results: filteredResults, quality: assessments };
	}

	/**
	 * Assess individual result quality using ADD (Adversarial Differential Discrimination)
	 *
	 * Real ADD implementation using multiple discriminators:
	 * 1. Content Discriminator - validates content quality
	 * 2. Source Discriminator - uses domain authority scoring
	 * 3. Temporal Discriminator - exponential freshness decay
	 * 4. Semantic Discriminator - n-gram query-result alignment
	 * 5. Adversarial Check - comprehensive manipulation detection
	 * 6. Citation Boost - cross-source verification
	 */
	private async assessQuality(result: any, strategy: SearchStrategy, originalQuery: string): Promise<QualityAssessment> {
		// Validate inputs
		if (!result || typeof result !== 'object') {
			return this.getFallbackAssessment();
		}

		if (!strategy || typeof strategy !== 'object') {
			return this.getFallbackAssessment();
		}

		// Run parallel discriminator checks
		const [contentScore, sourceScore, temporalScore, semanticScore, adversarialScore] = await Promise.all([
			this.runContentDiscriminator(result),
			this.runSourceDiscriminator(result),
			this.runTemporalDiscriminator(result),
			this.runSemanticDiscriminator(result, strategy, originalQuery),
			this.runAdversarialCheck(result),
		]);

		// If adversarial content detected, heavily penalize
		if (adversarialScore < 0.3) {
			return {
				addScore: adversarialScore,
				credibility: 0.1,
				freshness: temporalScore,
				relevance: semanticScore,
				diversity: 0.1,
				flags: [...this.detectQualityFlags(result), 'adversarial-content'],
			};
		}

		// Weighted ADD score calculation
		const credibility = sourceScore;
		const freshness = temporalScore;
		const relevance = semanticScore;
		const diversity = contentScore;

		// Final ADD score with adversarial weighting
		const baseScore = (credibility * 0.30 + freshness * 0.15 + relevance * 0.35 + diversity * 0.10);

		// Citation boost: results verified by multiple providers get a bonus
		const citationBoost = (result.citationCount || 1) > 1 ? 0.10 : 0;

		const addScore = Math.min(1.0, (baseScore + citationBoost) * adversarialScore);

		return {
			addScore,
			credibility,
			freshness,
			relevance,
			diversity,
			flags: this.detectQualityFlags(result),
		};
	}

	/**
	 * Content Discriminator - validates content quality and completeness
	 */
	private async runContentDiscriminator(result: any): Promise<number> {
		const snippet = result.snippet || '';

		// Content length signals (normalized with diminishing returns)
		const lengthScore = Math.min(1.0, Math.log1p(snippet.length) / Math.log1p(500));

		// Information density (unique words / total words)
		const words = snippet.toLowerCase().split(/\s+/).filter((w: string) => w.length > 0);
		const uniqueWords = new Set(words);
		const densityScore = words.length > 0 ? Math.min(1.0, uniqueWords.size / words.length) : 0;

		// Structure signals (has proper sentences, paragraphs)
		const sentences = snippet.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
		const structureScore = sentences.length >= 3 ? 0.9 :
			sentences.length >= 2 ? 0.7 :
			sentences.length >= 1 ? 0.5 : 0.2;

		// Has factual markers (numbers, dates, proper nouns, citations)
		const hasNumbers = /\d+/.test(snippet);
		const hasProperNouns = /[A-Z][a-z]{2,}/.test(snippet);
		const factualBonus = (hasNumbers ? 0.05 : 0) + (hasProperNouns ? 0.05 : 0);

		return Math.min(1.0, (lengthScore * 0.30 + densityScore * 0.30 + structureScore * 0.30) + factualBonus);
	}

	/**
	 * Source Discriminator - uses real domain authority scoring
	 */
	private async runSourceDiscriminator(result: any): Promise<number> {
		const url = result.url || '';

		// Use the domain authority system (no hardcoded lists)
		const domainAuth = result.domainAuthority || calculateDomainAuthority(url);

		// HTTPS bonus
		const httpsBonus = url.startsWith('https://') ? 0.05 : 0;

		// URL structure quality (clean URLs score higher)
		const urlQuality = this.assessUrlQuality(url);

		return Math.min(1.0, domainAuth * 0.75 + httpsBonus + urlQuality * 0.20);
	}

	/**
	 * Temporal Discriminator - exponential freshness decay (no arbitrary cliffs)
	 */
	private async runTemporalDiscriminator(result: any): Promise<number> {
		if (!result.publishedDate) return 0.5; // Unknown date gets neutral score

		return this.calculateFreshnessScore(result.publishedDate);
	}

	/**
	 * Semantic Discriminator - n-gram query-result alignment
	 * Uses unigrams, bigrams, and trigrams for better matching
	 */
	private async runSemanticDiscriminator(result: any, strategy: SearchStrategy, originalQuery: string): Promise<number> {
		const query = (originalQuery || strategy.primaryQuery || '').toLowerCase();
		const snippet = (result.snippet || '').toLowerCase();
		const title = (result.title || '').toLowerCase();

		if (!query || (!snippet && !title)) return 0.3;

		// Generate n-grams for query
		const queryWords = query.split(/\s+/).filter((t: string) => t.length > 2);
		const queryUnigrams = new Set(queryWords);
		const queryBigrams = this.generateNgrams(queryWords, 2);
		const queryTrigrams = this.generateNgrams(queryWords, 3);

		// Generate n-grams for content
		const contentWords = `${title} ${snippet}`.split(/\s+/).filter((t: string) => t.length > 2);
		const contentUnigrams = new Set(contentWords);
		const contentBigrams = this.generateNgrams(contentWords, 2);
		const contentTrigrams = this.generateNgrams(contentWords, 3);

		// Calculate overlap at each level
		const unigramOverlap = this.setOverlap(queryUnigrams, contentUnigrams);
		const bigramOverlap = this.setOverlap(queryBigrams, contentBigrams);
		const trigramOverlap = this.setOverlap(queryTrigrams, contentTrigrams);

		// Weighted: trigrams > bigrams > unigrams (higher n-grams = more meaningful match)
		const semanticScore = unigramOverlap * 0.30 + bigramOverlap * 0.40 + trigramOverlap * 0.30;

		// Title match bonus (query terms in title are more relevant)
		const titleWords = title.split(/\s+/);
		const titleMatchRatio = queryWords.length > 0
			? queryWords.filter((w: string) => titleWords.some((tw: string) => tw.includes(w))).length / queryWords.length
			: 0;
		const titleBonus = titleMatchRatio * 0.15;

		return Math.min(1.0, semanticScore + titleBonus);
	}

	/**
	 * Adversarial Check - comprehensive manipulation, spam, and low-quality detection
	 */
	private async runAdversarialCheck(result: any): Promise<number> {
		const snippet = (result.safe_summary || result.snippet || '');
		const title = result.title || '';
		const url = result.url || '';
		const lowerSnippet = snippet.toLowerCase();
		const lowerTitle = title.toLowerCase();

		let penaltyScore = 1.0;

		// Check for spam patterns (expanded list)
		const spamPatterns = [
			'click here', 'buy now', 'limited time', 'act now', 'free money',
			'order now', 'special offer', 'you won', 'congratulations',
			'make money fast', 'work from home', 'no experience needed',
			'guaranteed results', 'risk free', 'double your', 'earn extra',
			'as seen on', "don't miss", 'exclusive deal', 'last chance',
		];
		const spamCount = spamPatterns.filter(pattern =>
			lowerSnippet.includes(pattern) || lowerTitle.includes(pattern)
		).length;
		if (spamCount >= 3) penaltyScore *= 0.1; // Multiple spam signals = very suspicious
		else if (spamCount >= 2) penaltyScore *= 0.3;
		else if (spamCount >= 1) penaltyScore *= 0.5;

		// Check for excessive capitalization (skip short titles, skip acronyms)
		if (title.length > 15) {
			const words = title.split(/\s+/);
			const allCapsWords = words.filter((w: string) => w.length > 3 && w === w.toUpperCase());
			const capsRatio = allCapsWords.length / words.length;
			if (capsRatio > 0.5) penaltyScore *= 0.5;
		}

		// Check for suspicious TLDs (expanded list)
		const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.click', '.link', '.top', '.win', '.bid'];
		if (suspiciousTlds.some(tld => url.endsWith(tld))) penaltyScore *= 0.3;

		// Check for URL shorteners
		const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'is.gd'];
		if (shorteners.some(s => url.includes(s))) penaltyScore *= 0.5;

		// Check for excessive repetition in content
		const contentSentences = snippet.split(/[.!?]/).map((s: string) => s.trim().toLowerCase()).filter((s: string) => s.length > 10);
		if (contentSentences.length > 2) {
			const uniqueSentences = new Set(contentSentences);
			const repetitionRatio = uniqueSentences.size / contentSentences.length;
			if (repetitionRatio < 0.5) penaltyScore *= 0.4; // More than half repeated
			else if (repetitionRatio < 0.7) penaltyScore *= 0.6;
		}

		// Check for keyword stuffing (same word appearing too frequently)
		const words = lowerSnippet.split(/\s+/);
		if (words.length > 20) {
			const wordFreq = new Map<string, number>();
			for (const w of words) {
				if (w.length > 3) wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
			}
			const maxFreq = Math.max(...wordFreq.values(), 0);
			if (maxFreq / words.length > 0.15) penaltyScore *= 0.5; // One word is >15% of content
		}

		// Check for code injection patterns (security)
		const injectionPatterns = ['javascript:', '<script', 'onerror=', 'onclick='];
		if (injectionPatterns.some(p => lowerSnippet.includes(p) || url.toLowerCase().includes(p))) {
			penaltyScore *= 0.1;
		}

		return Math.max(0.1, penaltyScore);
	}

	/**
	 * Assess URL structural quality
	 */
	private assessUrlQuality(url: string): number {
		if (!url) return 0.2;
		try {
			const parsed = new URL(url);
			let score = 0.5;

			// Clean path (no excessive params or fragments)
			if (parsed.search.length < 50) score += 0.1;
			if (parsed.pathname.length < 100) score += 0.1;

			// Human-readable path segments
			const pathSegments = parsed.pathname.split('/').filter(Boolean);
			const readableSegments = pathSegments.filter((s: string) => /^[a-z0-9-]+$/i.test(s));
			if (pathSegments.length > 0 && readableSegments.length / pathSegments.length > 0.5) {
				score += 0.15;
			}

			// Not too deep (deeply nested pages less authoritative)
			if (pathSegments.length <= 4) score += 0.1;

			return Math.min(1.0, score);
		} catch {
			return 0.2;
		}
	}

	/**
	 * Calculate freshness score using exponential decay.
	 * No arbitrary cliffs — smooth continuous function.
	 * Half-life of ~90 days: content loses half its freshness score every 3 months.
	 */
	private calculateFreshnessScore(publishedDate: string | number): number {
		try {
			const date = new Date(publishedDate);
			if (isNaN(date.getTime())) return 0.5;

			const now = Date.now();
			const ageInDays = (now - date.getTime()) / (1000 * 60 * 60 * 24);

			if (ageInDays < 0) return 0.5; // Future dates are suspicious

			// Exponential decay with half-life of 90 days
			// At 0 days: 1.0, 90 days: 0.5, 180 days: 0.25, 365 days: ~0.06
			// But we floor at 0.3 to not completely discount older but still valid content
			const decayRate = Math.LN2 / 90;
			const rawScore = Math.exp(-decayRate * ageInDays);

			// Floor at 0.3 — old content still has value
			return Math.max(0.3, rawScore);
		} catch {
			return 0.5;
		}
	}

	/**
	 * Generate n-grams from word array
	 */
	private generateNgrams(words: string[], n: number): Set<string> {
		const ngrams = new Set<string>();
		for (let i = 0; i <= words.length - n; i++) {
			ngrams.add(words.slice(i, i + n).join(' '));
		}
		return ngrams;
	}

	/**
	 * Calculate overlap ratio between two sets
	 */
	private setOverlap(setA: Set<string>, setB: Set<string>): number {
		if (setA.size === 0) return 0;
		let overlap = 0;
		for (const item of setA) {
			if (setB.has(item)) overlap++;
		}
		return overlap / setA.size;
	}

	/**
	 * Calculate Jaccard similarity between two texts
	 */
	private calculateJaccardSimilarity(text1: string, text2: string): number {
		const words1 = new Set(text1.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2));
		const words2 = new Set(text2.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2));
		if (words1.size === 0 && words2.size === 0) return 1;
		if (words1.size === 0 || words2.size === 0) return 0;

		let intersection = 0;
		for (const w of words1) {
			if (words2.has(w)) intersection++;
		}
		const union = words1.size + words2.size - intersection;
		return union > 0 ? intersection / union : 0;
	}

	/**
	 * Normalize URL for deduplication
	 */
	private normalizeUrl(url: string): string {
		try {
			const parsed = new URL(url);
			return parsed.hostname.replace(/^www\./, "") + parsed.pathname.replace(/\/$/, "");
		} catch {
			return url?.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "") || "";
		}
	}

	/**
	 * Detect quality flags in result
	 */
	private detectQualityFlags(result: any): string[] {
		const flags: string[] = [];

		if (!result.snippet || result.snippet.length < 50) {
			flags.push('low-content');
		}

		if (!result.publishedDate) {
			flags.push('no-date');
		}

		if (!result.source) {
			flags.push('unknown-source');
		}

		if ((result.citationCount || 0) > 1) {
			flags.push('cross-cited');
		}

		if ((result.domainAuthority || 0) >= 0.85) {
			flags.push('high-authority');
		}

		return flags;
	}

	/**
	 * Fallback assessment for error cases
	 */
	private getFallbackAssessment(): QualityAssessment {
		return {
			addScore: 0.5,
			credibility: 0.5,
			freshness: 0.5,
			relevance: 0.5,
			diversity: 0.5,
			flags: ['error-fallback'],
		};
	}

	/**
	 * Phase 5: Synthesis and Correlation
	 */
	private async synthesizeResults(
		results: SearchResult[],
		model: ModelConfig
	): Promise<SearchResult[]> {
		if (results.length <= 3) return results;

		// Use AI to identify correlations and remove duplicates
		const synthesisPrompt = `Synthesize these search results, identify correlations, and remove duplicates:

Results: ${JSON.stringify(results.slice(0, 10), null, 2)}

Return the top 5 most relevant, non-duplicate results with improved titles and snippets.`;

		try {
			// Use a constrained timeout for synthesis — fall back to simple ranking if model is slow
			const fastModel = { ...model, maxTokens: model.maxTokens ?? 500, timeout: Math.min(model.timeout || 60000, 20000) };
			const response = await this.callModel(synthesisPrompt, fastModel);
			const synthesized = JSON.parse(response);

			// Verify the response is an array before using it
			if (Array.isArray(synthesized)) {
				return synthesized.slice(0, 5);
			} else {
				console.warn('[synthesizeResults] AI response was not an array:', typeof synthesized);
				return results.slice(0, 5);
			}
		} catch (error) {
			console.error('[synthesizeResults] Failed to parse or synthesize results:', error);
			// Fallback: return top results
			return results.slice(0, 5);
		}
	}

	/**
	 * Phase 6: Continuous Learning
	 */
	private async updateLearningModel(
		query: string,
		intent: SearchIntent,
		strategy: SearchStrategy,
		results: SearchResult[]
	): Promise<void> {
		// Guard against division by zero
		const resultCount = results.length;
		const avgScore = resultCount > 0
			? results.reduce((sum, r) => sum + (r.addScore || 0), 0) / resultCount
			: 0;

		// Ensure avgScore is finite
		const validAvgScore = Number.isFinite(avgScore) ? avgScore : 0;

		const learningData = {
			query,
			intent,
			strategy,
			resultCount,
			avgScore: validAvgScore,
			timestamp: Date.now(),
		};

		// In production, this would update a database or ML model
		console.log("Learning update:", learningData);
	}

	/**
	 * Call the configured AI model
	 */
	private async callModel(prompt: string, model: ModelConfig): Promise<string> {
		// SSRF protection: validate the base URL before making any fetch call
		if (model.baseUrl) {
			validateServerFetchUrl(model.baseUrl);
		}

		switch (model.provider) {
			case ModelProvider.OLLAMA:
				return this.callOllama(prompt, model);
			case ModelProvider.ANTHROPIC:
				return this.callAnthropic(prompt, model);
			case ModelProvider.OPENAI:
			case ModelProvider.LM_STUDIO:
			case ModelProvider.VLLM:
			case ModelProvider.GGUF:
			case ModelProvider.ONNX:
			case ModelProvider.DEEPSEEK:
			case ModelProvider.MOONSHOT:
			case ModelProvider.KIMI:
			case ModelProvider.OPENROUTER:
			case ModelProvider.AZURE_OPENAI:
			case ModelProvider.GOOGLE:
			default:
				// All OpenAI-compatible providers use the same chat completions API
				return this.callOpenAI(prompt, model);
		}
	}

	/**
	 * Call Ollama model
	 */
	private async callOllama(prompt: string, model: ModelConfig): Promise<string> {
		try {
			if (!model.baseUrl) throw new Error("Ollama baseUrl is required in model config");
			let baseUrl = stripTrailingSlashes(model.baseUrl);
			// Ollama uses /api/generate, not /v1 — strip /v1 suffix if present
			if (baseUrl.endsWith("/v1")) baseUrl = baseUrl.slice(0, -3);
			validateServerFetchUrl(baseUrl);
			const response = await fetch(`${baseUrl}/api/generate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: model.model,
					prompt,
					stream: false,
					options: {
						temperature: model.temperature,
						num_predict: model.maxTokens,
					},
				}),
				signal: AbortSignal.timeout(model.timeout || 60000),
			});

			if (!response.ok || response.status < 200 || response.status >= 300) {
				throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			return data.response || "";
		} catch (error) {
			console.error("Ollama call failed:", error);
			throw new Error(`Failed to call Ollama: ${error}`);
		}
	}

	/**
	 * Call Anthropic API
	 */
	private async callAnthropic(prompt: string, model: ModelConfig): Promise<string> {
		try {
			if (!model.baseUrl) throw new Error("Anthropic baseUrl is required in model config");
			let baseUrl = stripTrailingSlashes(model.baseUrl);
			// Anthropic endpoint is /v1/messages — strip /v1 if user included it so we don't double it
			if (baseUrl.endsWith("/v1")) baseUrl = baseUrl.slice(0, -3);
			validateServerFetchUrl(baseUrl);
			const response = await fetch(`${baseUrl}/v1/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": model.apiKey || "",
					"anthropic-version": "2023-06-01",
				},
				body: JSON.stringify({
					model: model.model,
					max_tokens: model.maxTokens,
					temperature: model.temperature,
					messages: [{ role: "user", content: prompt }],
				}),
			});

			if (!response.ok || response.status < 200 || response.status >= 300) {
				throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			return data.content?.[0]?.text || "";
		} catch (error) {
			console.error("Anthropic call failed:", error);
			throw new Error(`Failed to call Anthropic: ${error}`);
		}
	}

	/**
	 * Call OpenAI API (or any OpenAI-compatible provider).
	 * Handles various baseUrl formats: "/v1", "/v4", or custom paths.
	 */
	private async callOpenAI(prompt: string, model: ModelConfig): Promise<string> {
		try {
			if (!model.baseUrl) throw new Error("OpenAI-compatible baseUrl is required in model config");
			const rawBase = stripTrailingSlashes(model.baseUrl);
			validateServerFetchUrl(rawBase);

			// Build the chat completions URL — no regex, plain string checks only
			let chatUrl: string;
			if (rawBase.includes("/chat/completions")) {
				// Already a full endpoint URL — use as-is
				chatUrl = rawBase;
			} else if (hasVersionSegment(rawBase)) {
				// Ends with /v1, /v4, /v1beta, etc. — append /chat/completions
				chatUrl = `${rawBase}/chat/completions`;
			} else {
				// No version segment — append /v1/chat/completions (standard OpenAI-compatible)
				chatUrl = `${rawBase}/v1/chat/completions`;
			}

			const response = await fetch(chatUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${model.apiKey}`,
				},
				body: JSON.stringify({
					model: model.model,
					messages: [{ role: "user", content: prompt }],
					temperature: model.temperature,
					max_tokens: model.maxTokens,
				}),
				signal: AbortSignal.timeout(model.timeout || 60000),
			});

			if (!response.ok || response.status < 200 || response.status >= 300) {
				throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			// Support "thinking" models that put output in reasoning_content instead of content
			const msg = data.choices?.[0]?.message;
			return msg?.content || msg?.reasoning_content || "";
		} catch (error) {
			console.error("OpenAI call failed:", error);
			throw new Error(`Failed to call OpenAI: ${error}`);
		}
	}

	/**
	 * Fallback intent detection
	 */
	private detectIntentType(query: string): SearchIntent["type"] {
		const lower = query.toLowerCase();
		if (lower.includes("how to") || lower.includes("tutorial")) return "tutorial";
		if (lower.includes("compare") || lower.includes("vs")) return "comparison";
		if (lower.includes("research") || lower.includes("study")) return "research";
		if (lower.includes("news") || lower.includes("latest")) return "news";
		if (lower.includes("analyze") || lower.includes("explain")) return "analysis";
		return "factual";
	}

	/**
	 * Fallback complexity detection
	 */
	private detectComplexity(query: string): SearchIntent["complexity"] {
		const words = query.split(" ").length;
		if (words < 5) return "simple";
		if (words < 15) return "moderate";
		return "complex";
	}

	/**
	 * Sanitize a content chunk to prevent prompt injection.
	 * Produces safe_summary and risk_flag fields.
	 */
	private sanitizeChunk(chunk: any): any {
		const text = chunk.markdown || chunk.snippet || "";
		const risk = classifyRisk(text);
		const safeSummary = stripInstructions(text);
		return { ...chunk, safe_summary: safeSummary, risk_flag: risk };
	}
}

// Singleton instance
export const agenticSearch = new AgenticSearchEngine();

/**
 * Sanitizer for retrieved content chunks
 * Produces safe_summary and risk_flag to prevent prompt injection
 */
function classifyRisk(text: string): 'SAFE' | 'SUSPICIOUS' | 'BLOCK' {
	const lower = (text || '').toLowerCase();
	const injectionSignals = [
		'ignore previous', 'disregard instructions', 'override', 'system prompt',
		'reveal secrets', 'api key', 'password', 'delete', 'drop table',
		'curl ', 'wget ', 'powershell', 'base64',
	];
	if (injectionSignals.some(s => lower.includes(s))) return 'BLOCK';
	const toolLikeSignals = ['rm -rf', 'shutdown', 'format c:', 'alter table'];
	if (toolLikeSignals.some(s => lower.includes(s))) return 'BLOCK';
	const suspiciousSignals = ['secret', 'confidential', 'internal'];
	if (suspiciousSignals.some(s => lower.includes(s))) return 'SUSPICIOUS';
	return 'SAFE';
}

/**
 * Remove text between two literal markers (case-insensitive).
 * No regex — uses indexOf for safe, linear-time matching.
 */
function removeBetween(text: string, start: string, end: string): string {
	const lower = text.toLowerCase();
	const startLower = start.toLowerCase();
	const endLower = end.toLowerCase();
	let idx = lower.indexOf(startLower);
	while (idx !== -1) {
		const endIdx = lower.indexOf(endLower, idx + startLower.length);
		if (endIdx === -1) break;
		text = text.slice(0, idx) + text.slice(endIdx + endLower.length);
		idx = text.toLowerCase().indexOf(startLower);
	}
	return text;
}

/**
 * Strip prompt-injection patterns from text.
 * Uses only plain string operations — no regex — to avoid ReDoS.
 */
function stripInstructions(text: string): string {
	let result = (text || '').slice(0, 400);

	// Remove dangerous URI scheme prefixes
	const dangerousPatterns = ['javascript:', 'data:', 'base64'];
	for (const pattern of dangerousPatterns) {
		while (result.toLowerCase().includes(pattern)) {
			const idx = result.toLowerCase().indexOf(pattern);
			result = result.slice(0, idx) + result.slice(idx + pattern.length);
		}
	}

	// Remove prompt injection phrases (everything between start..end markers)
	result = removeBetween(result, 'ignore', 'instructions');
	result = removeBetween(result, 'system prompt', '\n');

	return result;
}
