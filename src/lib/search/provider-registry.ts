import { researchStorage } from "../results-storage";
import {
	searchArxiv,
	searchDuckDuckGo,
	searchSemanticScholar,
	searchWikipedia,
} from "./free-providers";
import {
	searchBrave,
	searchExa,
	searchFirecrawl,
	searchTavily,
} from "./provider-runners";
import type {
	ExecuteWebSearchOptions,
	FreeSearchProviderDefinition,
	SearchApiKeys,
	SearchProviderDefinition,
	SearchProviderType,
	WebSearchResult,
} from "./types";

// ---------------------------------------------------------------------------
// Free providers — always active, no API key needed
// ---------------------------------------------------------------------------
const FREE_PROVIDERS: FreeSearchProviderDefinition[] = [
	{
		type: "duckduckgo",
		displayName: "DuckDuckGo",
		capabilities: {
			supportsFreshness: false,
			supportsFullContent: false,
			supportsSemanticSearch: false,
			supportsStructuredExtraction: false,
			costClass: "free",
			latencyClass: "fast",
		},
		search: searchDuckDuckGo,
	},
	{
		type: "wikipedia",
		displayName: "Wikipedia",
		capabilities: {
			supportsFreshness: false,
			supportsFullContent: true,
			supportsSemanticSearch: false,
			supportsStructuredExtraction: false,
			costClass: "free",
			latencyClass: "fast",
		},
		search: searchWikipedia,
	},
	{
		type: "semantic_scholar",
		displayName: "Semantic Scholar",
		capabilities: {
			supportsFreshness: true,
			supportsFullContent: false,
			supportsSemanticSearch: true,
			supportsStructuredExtraction: false,
			costClass: "free",
			latencyClass: "medium",
		},
		search: searchSemanticScholar,
	},
	{
		type: "arxiv",
		displayName: "arXiv",
		capabilities: {
			supportsFreshness: true,
			supportsFullContent: false,
			supportsSemanticSearch: false,
			supportsStructuredExtraction: false,
			costClass: "free",
			latencyClass: "medium",
		},
		search: searchArxiv,
	},
];

// ---------------------------------------------------------------------------
// Paid providers — require an API key in SearchApiKeys
// ---------------------------------------------------------------------------
const PAID_PROVIDERS: SearchProviderDefinition[] = [
	{
		type: "tavily",
		displayName: "Tavily",
		credentialKey: "tavily",
		capabilities: {
			supportsFreshness: true,
			supportsFullContent: false,
			supportsSemanticSearch: true,
			supportsStructuredExtraction: true,
			costClass: "medium",
			latencyClass: "medium",
		},
		search: searchTavily,
	},
	{
		type: "exa",
		displayName: "Exa",
		credentialKey: "exa",
		capabilities: {
			supportsFreshness: true,
			supportsFullContent: false,
			supportsSemanticSearch: true,
			supportsStructuredExtraction: false,
			costClass: "medium",
			latencyClass: "medium",
		},
		search: searchExa,
	},
	{
		type: "firecrawl",
		displayName: "Firecrawl",
		credentialKey: "firecrawl",
		capabilities: {
			supportsFreshness: true,
			supportsFullContent: true,
			supportsSemanticSearch: false,
			supportsStructuredExtraction: true,
			costClass: "high",
			latencyClass: "slow",
		},
		search: searchFirecrawl,
	},
	{
		type: "brave",
		displayName: "Brave Search",
		credentialKey: "brave",
		capabilities: {
			supportsFreshness: true,
			supportsFullContent: false,
			supportsSemanticSearch: false,
			supportsStructuredExtraction: false,
			costClass: "low",
			latencyClass: "fast",
		},
		search: searchBrave,
	},
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeUrl(url: string): string {
	try {
		const parsed = new URL(url);
		return (
			parsed.hostname.replace(/^www\./, "") + parsed.pathname.replace(/\/$/, "")
		);
	} catch {
		return url
			.toLowerCase()
			.replace(/^https?:\/\//, "")
			.replace(/^www\./, "")
			.replace(/\/$/, "");
	}
}

/**
 * Reciprocal Rank Fusion (RRF) — the gold-standard algorithm for combining
 * ranked result lists from multiple search providers.
 *
 * RRF_score(doc) = Σ  1 / (k + rank_in_list)
 *
 * With k = 60 (Cormack et al. 2009), the top result scores 1/61 ≈ 0.0164
 * and the 10th result scores 1/70 ≈ 0.0143 — only a 13% difference.
 * This prevents any single provider's ranking from dominating and rewards
 * results that appear across MULTIPLE providers (additive scoring).
 *
 * Previous approach used Math.max(rawScore) which lost cross-provider signal
 * and was biased by incomparable rawScore scales across providers.
 */
function fuseResults(resultSets: WebSearchResult[][]): WebSearchResult[] {
	const RRF_K = 60;

	const scoreMap = new Map<
		string,
		{ rrfScore: number; result: WebSearchResult; providers: Set<string> }
	>();

	for (const rankedList of resultSets) {
		for (let rank = 0; rank < rankedList.length; rank++) {
			const result = rankedList[rank];
			const key = normalizeUrl(result.url);
			const rrfIncrement = 1.0 / (RRF_K + rank + 1);

			const existing = scoreMap.get(key);
			if (existing) {
				existing.rrfScore += rrfIncrement;
				existing.providers.add(result.provider);
				// Keep the richer version (longer snippet, more metadata)
				if (result.snippet.length > existing.result.snippet.length) {
					const prevScore = existing.result.rawScore;
					existing.result = {
						...result,
						markdown: result.markdown || existing.result.markdown,
						domainAuthority: Math.max(
							result.domainAuthority,
							existing.result.domainAuthority,
						),
						rawScore: Math.max(result.rawScore, prevScore),
					};
				} else {
					existing.result.markdown =
						result.markdown || existing.result.markdown;
					existing.result.domainAuthority = Math.max(
						result.domainAuthority,
						existing.result.domainAuthority,
					);
					existing.result.rawScore = Math.max(
						result.rawScore,
						existing.result.rawScore,
					);
				}
			} else {
				scoreMap.set(key, {
					rrfScore: rrfIncrement,
					result: { ...result },
					providers: new Set([result.provider]),
				});
			}
		}
	}

	const fused: WebSearchResult[] = [];
	// Find max RRF score for normalization to 0-1
	let maxRrf = 0;
	for (const entry of scoreMap.values()) {
		if (entry.rrfScore > maxRrf) maxRrf = entry.rrfScore;
	}

	for (const entry of scoreMap.values()) {
		const { result, providers } = entry;
		result.citationCount = providers.size;
		// Normalize RRF score to 0-1 range and use as rawScore
		result.rawScore = maxRrf > 0 ? entry.rrfScore / maxRrf : 0;
		fused.push(result);
	}

	fused.sort((a, b) => b.rawScore - a.rawScore);
	return fused;
}

function toApiKeys(options?: ExecuteWebSearchOptions): SearchApiKeys {
	return {
		firecrawl: options?.firecrawlApiKey || undefined,
		brave: options?.braveApiKey || undefined,
		tavily: options?.tavilyApiKey || undefined,
		exa: options?.exaApiKey || undefined,
	};
}

async function getCachedResults(
	query: string,
	limit: number,
): Promise<WebSearchResult[]> {
	const cachedResults = await researchStorage.findRelevantResults(query, limit);

	return cachedResults.map((result, index) => ({
		id: result.id,
		title: result.title,
		snippet: result.snippet,
		url: result.url,
		source: result.source,
		provider: "cache" as const,
		publishedDate: result.publishedDate,
		rawScore: result.addScore ?? Math.max(0.3, 1 - index * 0.05),
		domainAuthority: result.domainAuthority ?? 0.5,
		citationCount: result.citationCount ?? 1,
	}));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getSearchProviderRegistry(): SearchProviderDefinition[] {
	return [...PAID_PROVIDERS];
}

export function getFreeProviderRegistry(): FreeSearchProviderDefinition[] {
	return [...FREE_PROVIDERS];
}

/**
 * Returns the list of PAID providers that have active API keys.
 * Free providers (DuckDuckGo, Wikipedia) are always available and not listed
 * here — they run unconditionally inside executeWebSearch.
 */
export function getAvailableProviders(
	options?: SearchApiKeys,
): SearchProviderType[] {
	const keys = options || {};
	return [
		...FREE_PROVIDERS.map((provider) => provider.type),
		...PAID_PROVIDERS.filter((provider) =>
			Boolean(keys[provider.credentialKey]),
		).map((provider) => provider.type),
	];
}

/**
 * Execute web search across ALL available providers.
 *
 * Execution order:
 * 1. Free providers (DuckDuckGo + Wikipedia) — always run, no keys needed
 * 2. Paid providers (Tavily, Exa, Brave, Firecrawl) — run if keys are present
 * 3. Cache fallback — checked if both free + paid return nothing
 *
 * Results are fused, deduplicated, and sorted by quality score.
 */
export async function executeWebSearch(
	query: string,
	options?: ExecuteWebSearchOptions,
): Promise<WebSearchResult[]> {
	const limit = options?.limit || 10;
	const apiKeys = toApiKeys(options);

	const errors: string[] = [];
	const resultSets: WebSearchResult[][] = [];

	// --- Free providers (always run) ---
	const freeResults = await Promise.all(
		FREE_PROVIDERS.map(async (provider) => {
			try {
				const results = await provider.search(query, limit);
				return { provider: provider.type, results };
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Unknown error";
				console.warn(
					`[SearchProviders] ${provider.displayName} (free) failed:`,
					message,
				);
				errors.push(`${provider.displayName}: ${message}`);
				return { provider: provider.type, results: [] as WebSearchResult[] };
			}
		}),
	);

	for (const { provider, results } of freeResults) {
		if (results.length > 0) {
			console.log(
				`[SearchProviders] ${provider} returned ${results.length} results`,
			);
			resultSets.push(results);
		}
	}

	// --- Paid providers (run if keys available) ---
	const activePaidProviders = PAID_PROVIDERS.filter((provider) =>
		Boolean(apiKeys[provider.credentialKey]),
	);

	if (activePaidProviders.length > 0) {
		const paidResults = await Promise.all(
			activePaidProviders.map(async (provider) => {
				const apiKey = apiKeys[provider.credentialKey];
				if (!apiKey) {
					return { provider: provider.type, results: [] as WebSearchResult[] };
				}

				try {
					const providerLimit =
						provider.type === "firecrawl" ? Math.min(limit, 5) : limit;
					const results = await provider.search(query, apiKey, providerLimit);
					return { provider: provider.type, results };
				} catch (error) {
					const message =
						error instanceof Error ? error.message : "Unknown error";
					console.warn(
						`[SearchProviders] ${provider.displayName} failed:`,
						message,
					);
					errors.push(`${provider.displayName}: ${message}`);
					return { provider: provider.type, results: [] as WebSearchResult[] };
				}
			}),
		);

		for (const { provider, results } of paidResults) {
			if (results.length > 0) {
				console.log(
					`[SearchProviders] ${provider} returned ${results.length} results`,
				);
				resultSets.push(results);
			}
		}
	}

	// --- Cache fallback (only if everything else returned nothing) ---
	if (resultSets.length === 0) {
		const cachedResults = await getCachedResults(query, limit);
		if (cachedResults.length > 0) {
			console.warn(
				`[SearchProviders] All providers returned nothing. Falling back to ${cachedResults.length} cached result(s).`,
			);
			return cachedResults;
		}

		if (errors.length > 0) {
			console.error(
				"[SearchProviders] All search providers failed:",
				errors.join("; "),
			);
		}
		return [];
	}

	// --- Fuse, deduplicate, sort ---
	const fused = fuseResults(resultSets);
	const citedCount = fused.filter((result) => result.citationCount > 1).length;
	const providerNames = [...new Set(fused.map((r) => r.provider))].join(", ");
	console.log(
		`[SearchProviders] Fused ${fused.length} unique results from ${resultSets.length} provider(s) (${providerNames})` +
			(citedCount > 0 ? `, ${citedCount} cross-cited` : ""),
	);

	return fused;
}
