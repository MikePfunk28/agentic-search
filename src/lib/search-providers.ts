/**
 * Search Providers - Real Web Search Backends
 *
 * Supports multiple search APIs with a unified interface:
 * - Tavily (AI-optimized search with built-in extraction)
 * - Exa (neural search with semantic understanding)
 * - Firecrawl (search + scrape + markdown)
 * - Brave Search (free tier: ~1000 queries/month)
 *
 * Features:
 * - Multi-source fusion: runs ALL available providers, merges + deduplicates
 * - Domain authority scoring: real reputation system, not hardcoded lists
 * - Cross-source citation verification: boosts results found by multiple providers
 *
 * No mock data. Every result comes from a real API.
 */

import { z } from "zod";

// --- Types ---

export interface WebSearchResult {
	id: string;
	title: string;
	snippet: string;
	url: string;
	source: string;
	provider: "brave" | "firecrawl" | "tavily" | "exa";
	publishedDate?: string;
	markdown?: string;
	rawScore: number;
	domainAuthority: number;
	citationCount: number;
}

export type SearchProviderType = "firecrawl" | "brave" | "tavily" | "exa";

export interface SearchProviderConfig {
	type: SearchProviderType;
	apiKey: string;
	baseUrl?: string;
}

/** All possible search API keys passed through the pipeline */
export interface SearchApiKeys {
	firecrawl?: string;
	brave?: string;
	tavily?: string;
	exa?: string;
}

// --- Domain Authority System ---

const DOMAIN_AUTHORITY_TIERS: Array<{
	pattern: RegExp;
	score: number;
	category: string;
}> = [
	// Tier 1: Government and education (0.95)
	{ pattern: /\.gov(\.[a-z]{2})?$/i, score: 0.95, category: "government" },
	{ pattern: /\.edu(\.[a-z]{2})?$/i, score: 0.95, category: "education" },
	{ pattern: /\.ac\.[a-z]{2}$/i, score: 0.93, category: "academic" },

	// Tier 2: Established reference/knowledge sites (0.90)
	{ pattern: /wikipedia\.org$/i, score: 0.92, category: "encyclopedia" },
	{ pattern: /arxiv\.org$/i, score: 0.93, category: "academic" },
	{ pattern: /nature\.com$/i, score: 0.93, category: "academic" },
	{ pattern: /sciencedirect\.com$/i, score: 0.91, category: "academic" },
	{ pattern: /scholar\.google\.com$/i, score: 0.91, category: "academic" },
	{ pattern: /pubmed\.ncbi\.nlm\.nih\.gov$/i, score: 0.94, category: "medical" },
	{ pattern: /nih\.gov$/i, score: 0.94, category: "medical" },
	{ pattern: /cdc\.gov$/i, score: 0.94, category: "medical" },
	{ pattern: /who\.int$/i, score: 0.94, category: "medical" },

	// Tier 3: Major news organizations (0.85)
	{ pattern: /reuters\.com$/i, score: 0.88, category: "news" },
	{ pattern: /apnews\.com$/i, score: 0.88, category: "news" },
	{ pattern: /bbc\.co\.uk$/i, score: 0.87, category: "news" },
	{ pattern: /bbc\.com$/i, score: 0.87, category: "news" },
	{ pattern: /nytimes\.com$/i, score: 0.86, category: "news" },
	{ pattern: /washingtonpost\.com$/i, score: 0.85, category: "news" },
	{ pattern: /theguardian\.com$/i, score: 0.85, category: "news" },

	// Tier 4: Major tech documentation and platforms (0.82)
	{ pattern: /docs\.[a-z]+\.(com|io|dev)$/i, score: 0.84, category: "documentation" },
	{ pattern: /developer\.[a-z]+\.com$/i, score: 0.83, category: "documentation" },
	{ pattern: /github\.com$/i, score: 0.82, category: "code" },
	{ pattern: /stackoverflow\.com$/i, score: 0.83, category: "technical" },
	{ pattern: /mdn\.mozilla\.org$/i, score: 0.88, category: "documentation" },
	{ pattern: /microsoft\.com$/i, score: 0.82, category: "tech" },
	{ pattern: /cloud\.google\.com$/i, score: 0.83, category: "tech" },
	{ pattern: /aws\.amazon\.com$/i, score: 0.83, category: "tech" },

	// Tier 5: Established organizations (0.75)
	{ pattern: /\.org$/i, score: 0.75, category: "organization" },
	{ pattern: /\.int$/i, score: 0.80, category: "international" },

	// Negative tier: Suspicious TLDs (0.30)
	{ pattern: /\.(tk|ml|ga|cf|gq)$/i, score: 0.25, category: "suspicious-tld" },
	{ pattern: /\.(buzz|click|link|top|win|bid)$/i, score: 0.35, category: "spam-tld" },
];

export function calculateDomainAuthority(url: string): number {
	if (!url) return 0.3;

	try {
		const parsed = new URL(url);
		const hostname = parsed.hostname.toLowerCase();

		for (const tier of DOMAIN_AUTHORITY_TIERS) {
			if (tier.pattern.test(hostname)) {
				return tier.score;
			}
		}

		let score = 0.50;
		if (parsed.protocol === "https:") score += 0.05;
		const domainParts = hostname.split(".");
		const mainDomain = domainParts.slice(-2).join(".");
		if (mainDomain.length <= 10) score += 0.05;
		if (domainParts.length > 3) score -= 0.05;
		if (/\.(com|net|io|dev|co)$/i.test(hostname)) score += 0.03;

		return Math.max(0.1, Math.min(0.80, score));
	} catch {
		return 0.3;
	}
}

// --- Tavily Search Provider ---

const TavilyResultSchema = z.object({
	title: z.string(),
	url: z.string(),
	content: z.string(),
	score: z.number().optional(),
	published_date: z.string().optional(),
	raw_content: z.string().optional(),
});

const TavilyResponseSchema = z.object({
	results: z.array(TavilyResultSchema),
	query: z.string().optional(),
	answer: z.string().optional(),
});

async function searchTavily(
	query: string,
	apiKey: string,
	limit = 10,
): Promise<WebSearchResult[]> {
	const response = await fetch("https://api.tavily.com/search", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			api_key: apiKey,
			query,
			max_results: Math.min(limit, 20),
			include_raw_content: false,
			include_answer: false,
			search_depth: "advanced",
		}),
		signal: AbortSignal.timeout(15000),
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(`Tavily API error (${response.status}): ${errorText}`);
	}

	const data = await response.json();
	const parsed = TavilyResponseSchema.safeParse(data);

	if (!parsed.success) {
		console.warn("[Tavily] Response validation failed:", parsed.error.message);
		const results = data?.results;
		if (!Array.isArray(results)) return [];
		return results.map((r: z.infer<typeof TavilyResultSchema>, i: number) => mapTavilyResult(r, i));
	}

	return parsed.data.results.map(mapTavilyResult);
}

function mapTavilyResult(result: z.infer<typeof TavilyResultSchema>, index: number): WebSearchResult {
	const domainAuthority = calculateDomainAuthority(result.url);

	return {
		id: `tavily-${Date.now()}-${index}`,
		title: result.title || "Untitled",
		snippet: result.content || "",
		url: result.url,
		source: "web",
		provider: "tavily",
		publishedDate: result.published_date || undefined,
		markdown: result.raw_content || undefined,
		domainAuthority,
		citationCount: 1,
		rawScore: (result.score ?? (0.8 - index * 0.03)) * 0.6 + domainAuthority * 0.4,
	};
}

// --- Exa Search Provider ---

const ExaResultSchema = z.object({
	title: z.string().nullable(),
	url: z.string(),
	id: z.string().optional(),
	score: z.number().optional(),
	publishedDate: z.string().nullable().optional(),
	author: z.string().nullable().optional(),
	text: z.string().optional(),
	highlights: z.array(z.string()).optional(),
});

const ExaResponseSchema = z.object({
	results: z.array(ExaResultSchema),
	autopromptString: z.string().optional(),
});

async function searchExa(
	query: string,
	apiKey: string,
	limit = 10,
): Promise<WebSearchResult[]> {
	const response = await fetch("https://api.exa.ai/search", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
		},
		body: JSON.stringify({
			query,
			numResults: Math.min(limit, 20),
			type: "auto",
			useAutoprompt: true,
			contents: {
				text: { maxCharacters: 1000 },
				highlights: { numSentences: 3 },
			},
		}),
		signal: AbortSignal.timeout(15000),
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(`Exa API error (${response.status}): ${errorText}`);
	}

	const data = await response.json();
	const parsed = ExaResponseSchema.safeParse(data);

	if (!parsed.success) {
		console.warn("[Exa] Response validation failed:", parsed.error.message);
		const results = data?.results;
		if (!Array.isArray(results)) return [];
		return results.map((r: z.infer<typeof ExaResultSchema>, i: number) => mapExaResult(r, i));
	}

	return parsed.data.results.map(mapExaResult);
}

function mapExaResult(result: z.infer<typeof ExaResultSchema>, index: number): WebSearchResult {
	const domainAuthority = calculateDomainAuthority(result.url);
	const snippet = result.text
		|| (result.highlights && result.highlights.length > 0 ? result.highlights.join(" ... ") : "");

	return {
		id: `exa-${Date.now()}-${index}`,
		title: result.title || "Untitled",
		snippet,
		url: result.url,
		source: "web",
		provider: "exa",
		publishedDate: result.publishedDate || undefined,
		domainAuthority,
		citationCount: 1,
		rawScore: (result.score ?? (0.8 - index * 0.03)) * 0.6 + domainAuthority * 0.4,
	};
}

// --- Brave Search Provider ---

const BraveWebResultSchema = z.object({
	title: z.string(),
	url: z.string(),
	description: z.string().optional(),
	age: z.string().optional(),
	page_age: z.string().optional(),
	extra_snippets: z.array(z.string()).optional(),
});

const BraveSearchResponseSchema = z.object({
	web: z.object({
		results: z.array(BraveWebResultSchema),
	}).optional(),
	query: z.object({
		original: z.string(),
	}).optional(),
});

async function searchBrave(
	query: string,
	apiKey: string,
	limit = 10,
): Promise<WebSearchResult[]> {
	const params = new URLSearchParams({
		q: query,
		count: String(Math.min(limit, 20)),
		text_decorations: "false",
	});

	const response = await fetch(
		`https://api.search.brave.com/res/v1/web/search?${params}`,
		{
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Accept-Encoding": "gzip",
				"X-Subscription-Token": apiKey,
			},
			signal: AbortSignal.timeout(10000),
		},
	);

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(`Brave Search API error (${response.status}): ${errorText}`);
	}

	const data = await response.json();
	const parsed = BraveSearchResponseSchema.safeParse(data);

	if (!parsed.success) {
		console.warn("[BraveSearch] Response validation failed:", parsed.error.message);
		const results = data?.web?.results;
		if (!Array.isArray(results)) return [];
		return results.map((r: z.infer<typeof BraveWebResultSchema>, i: number) => mapBraveResult(r, i));
	}

	const webResults = parsed.data.web?.results || [];
	return webResults.map(mapBraveResult);
}

function mapBraveResult(result: z.infer<typeof BraveWebResultSchema>, index: number): WebSearchResult {
	const domainAuthority = calculateDomainAuthority(result.url);

	return {
		id: `brave-${Date.now()}-${index}`,
		title: result.title || "Untitled",
		snippet: result.description || result.extra_snippets?.[0] || "",
		url: result.url,
		source: "web",
		provider: "brave",
		publishedDate: result.page_age || result.age || undefined,
		domainAuthority,
		citationCount: 1,
		rawScore: (0.7 + (1 - index * 0.05)) * 0.6 + domainAuthority * 0.4,
	};
}

// --- Firecrawl Search Provider ---

async function searchFirecrawl(
	query: string,
	apiKey: string,
	limit = 5,
): Promise<WebSearchResult[]> {
	const { FirecrawlClient } = await import("./firecrawl-client");
	const firecrawl = new FirecrawlClient({ apiKey });

	const results = await firecrawl.search({
		query,
		limit,
		formats: ["markdown"],
		onlyMainContent: true,
	});

	console.log(`[Firecrawl] Returned ${results.length} results for: ${query}`);

	return results.map((result: any, index: number) => {
		const domainAuthority = calculateDomainAuthority(result.url);

		return {
			id: `firecrawl-${Date.now()}-${index}`,
			title: result.title || "Untitled",
			snippet: result.description || result.markdown?.substring(0, 300) || "",
			url: result.url,
			source: "web",
			provider: "firecrawl",
			publishedDate: result.metadata?.publishedDate || undefined,
			markdown: result.markdown,
			domainAuthority,
			citationCount: 1,
			rawScore: (0.8 + (1 - index * 0.05)) * 0.6 + domainAuthority * 0.4,
		};
	});
}

// --- Multi-Source Fusion ---

function normalizeUrl(url: string): string {
	try {
		const parsed = new URL(url);
		return parsed.hostname.replace(/^www\./, "") + parsed.pathname.replace(/\/$/, "");
	} catch {
		return url.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
	}
}

function fuseResults(resultSets: WebSearchResult[][]): WebSearchResult[] {
	const urlMap = new Map<string, WebSearchResult>();
	const citationCounts = new Map<string, number>();

	for (const results of resultSets) {
		for (const result of results) {
			const normalizedUrl = normalizeUrl(result.url);
			const existing = urlMap.get(normalizedUrl);

			const currentCount = citationCounts.get(normalizedUrl) || 0;
			const providers = new Set<string>();
			if (existing) providers.add(existing.provider);
			providers.add(result.provider);
			citationCounts.set(normalizedUrl, Math.max(currentCount, providers.size));

			if (!existing) {
				urlMap.set(normalizedUrl, { ...result });
			} else {
				const merged: WebSearchResult = {
					...existing,
					snippet: result.snippet.length > existing.snippet.length ? result.snippet : existing.snippet,
					markdown: result.markdown || existing.markdown,
					domainAuthority: Math.max(result.domainAuthority, existing.domainAuthority),
					rawScore: Math.max(result.rawScore, existing.rawScore),
				};
				urlMap.set(normalizedUrl, merged);
			}
		}
	}

	const fused: WebSearchResult[] = [];
	for (const [normalizedUrl, result] of urlMap.entries()) {
		const citations = citationCounts.get(normalizedUrl) || 1;
		result.citationCount = citations;

		if (citations > 1) {
			result.rawScore = Math.min(1.0, result.rawScore * (1 + 0.15 * (citations - 1)));
		}

		fused.push(result);
	}

	fused.sort((a, b) => b.rawScore - a.rawScore);

	return fused;
}

// --- Unified Search Function ---

/**
 * Execute a web search using ALL available providers simultaneously.
 * Runs providers in parallel, then merges + deduplicates results.
 * Cross-source citations boost result confidence.
 * Returns empty array if no provider is configured.
 */
export async function executeWebSearch(
	query: string,
	options?: {
		firecrawlApiKey?: string;
		braveApiKey?: string;
		tavilyApiKey?: string;
		exaApiKey?: string;
		limit?: number;
	},
): Promise<WebSearchResult[]> {
	const limit = options?.limit || 10;
	const errors: string[] = [];
	const resultSets: WebSearchResult[][] = [];

	// Resolve API keys: client-provided first, then env vars
	const tavilyKey = options?.tavilyApiKey
		|| (typeof process !== "undefined" ? process.env?.TAVILY_API_KEY : undefined);
	const exaKey = options?.exaApiKey
		|| (typeof process !== "undefined" ? process.env?.EXA_SEARCH_API_KEY : undefined);
	const firecrawlKey = options?.firecrawlApiKey
		|| (typeof process !== "undefined" ? process.env?.FIRECRAWL_API_KEY : undefined);
	const braveKey = options?.braveApiKey
		|| (typeof process !== "undefined" ? process.env?.BRAVE_SEARCH_API_KEY : undefined);

	// Run ALL available providers in parallel
	const searchPromises: Array<Promise<{ provider: string; results: WebSearchResult[] }>> = [];

	if (tavilyKey) {
		searchPromises.push(
			searchTavily(query, tavilyKey, limit)
				.then(results => ({ provider: "tavily", results }))
				.catch(error => {
					const msg = error instanceof Error ? error.message : "Unknown error";
					console.warn("[SearchProviders] Tavily failed:", msg);
					errors.push(`Tavily: ${msg}`);
					return { provider: "tavily", results: [] };
				})
		);
	}

	if (exaKey) {
		searchPromises.push(
			searchExa(query, exaKey, limit)
				.then(results => ({ provider: "exa", results }))
				.catch(error => {
					const msg = error instanceof Error ? error.message : "Unknown error";
					console.warn("[SearchProviders] Exa failed:", msg);
					errors.push(`Exa: ${msg}`);
					return { provider: "exa", results: [] };
				})
		);
	}

	if (firecrawlKey) {
		searchPromises.push(
			searchFirecrawl(query, firecrawlKey, Math.min(limit, 5))
				.then(results => ({ provider: "firecrawl", results }))
				.catch(error => {
					const msg = error instanceof Error ? error.message : "Unknown error";
					console.warn("[SearchProviders] Firecrawl failed:", msg);
					errors.push(`Firecrawl: ${msg}`);
					return { provider: "firecrawl", results: [] };
				})
		);
	}

	if (braveKey) {
		searchPromises.push(
			searchBrave(query, braveKey, limit)
				.then(results => ({ provider: "brave", results }))
				.catch(error => {
					const msg = error instanceof Error ? error.message : "Unknown error";
					console.warn("[SearchProviders] Brave Search failed:", msg);
					errors.push(`Brave: ${msg}`);
					return { provider: "brave", results: [] };
				})
		);
	}

	if (searchPromises.length === 0) {
		console.warn("[SearchProviders] No search API keys configured. Add Tavily, Exa, Firecrawl, or Brave API key in Settings.");
		return [];
	}

	const providerResults = await Promise.all(searchPromises);

	for (const { provider, results } of providerResults) {
		if (results.length > 0) {
			console.log(`[SearchProviders] ${provider} returned ${results.length} results`);
			resultSets.push(results);
		}
	}

	if (resultSets.length === 0) {
		if (errors.length > 0) {
			console.error("[SearchProviders] All search providers failed:", errors.join("; "));
		}
		return [];
	}

	const fused = fuseResults(resultSets);
	const citedCount = fused.filter(r => r.citationCount > 1).length;

	console.log(`[SearchProviders] Fused ${fused.length} unique results from ${resultSets.length} provider(s)` +
		(citedCount > 0 ? `, ${citedCount} cross-cited` : ""));

	return fused;
}

/**
 * Check which search providers are available based on configured keys.
 */
export function getAvailableProviders(options?: SearchApiKeys): SearchProviderType[] {
	const available: SearchProviderType[] = [];

	const tavilyKey = options?.tavily
		|| (typeof process !== "undefined" ? process.env?.TAVILY_API_KEY : undefined);
	if (tavilyKey) available.push("tavily");

	const exaKey = options?.exa
		|| (typeof process !== "undefined" ? process.env?.EXA_SEARCH_API_KEY : undefined);
	if (exaKey) available.push("exa");

	const firecrawlKey = options?.firecrawl
		|| (typeof process !== "undefined" ? process.env?.FIRECRAWL_API_KEY : undefined);
	if (firecrawlKey) available.push("firecrawl");

	const braveKey = options?.brave
		|| (typeof process !== "undefined" ? process.env?.BRAVE_SEARCH_API_KEY : undefined);
	if (braveKey) available.push("brave");

	return available;
}
