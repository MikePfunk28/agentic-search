/**
 * Free Search Providers — no API key required
 *
 * These providers enable REAL search functionality with zero configuration.
 * Paid providers (Tavily, Exa, Brave, Firecrawl) enhance results when users
 * bring their own keys (BYOK).
 *
 * DuckDuckGo:        Real web search via HTML endpoint (NOT the useless Instant Answer API)
 * Wikipedia:          Article search + summaries via MediaWiki REST API
 * Semantic Scholar:   Academic papers via free API (no key required)
 * arXiv:              Preprint papers via free Atom API (no key required)
 */

import { calculateDomainAuthority } from "./domain-authority";
import type { WebSearchResult } from "./types";

// ---------------------------------------------------------------------------
// DuckDuckGo HTML Search
// Fetches real web search results from html.duckduckgo.com — the same results
// you'd see on duckduckgo.com. This replaces the old Instant Answer API
// (api.duckduckgo.com) which only returned encyclopedia abstracts, not web results.
// ---------------------------------------------------------------------------

/** Strip HTML tags from text — safe against nested/encoded tag injection.
 * 1. Decode HTML entities first so encoded tags become real tags.
 * 2. Strip tags in a loop until stable (handles <scr<script>ipt> nesting).
 * 3. Remove any remaining angle brackets as a final safety net.
 */
function stripHtml(text: string): string {
	// Step 1: Decode HTML entities to their characters
	let decoded = text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/&#x27;/g, "'")
		.replace(/&nbsp;/g, " ");

	// Step 2: Strip tags in a loop — a single pass of /<[^>]+>/g can leave
	// residual tags when tags were nested inside entity-encoded tags.
	let prev: string;
	do {
		prev = decoded;
		decoded = decoded.replace(/<[^>]+>/g, "");
	} while (decoded !== prev);

	// Step 3: Remove any remaining < or > so no tag can survive
	decoded = decoded.replace(/[<>]/g, "");

	return decoded.replace(/\s+/g, " ").trim();
}

/** Decode DDG redirect URLs (//duckduckgo.com/l/?uddg=ENCODED_URL&...) */
function decodeDdgUrl(href: string): string {
	if (href.includes("duckduckgo.com/l/?uddg=")) {
		const match = href.match(/uddg=([^&]+)/);
		if (match) {
			try {
				return decodeURIComponent(match[1]);
			} catch {
				return href;
			}
		}
	}
	// Handle protocol-relative URLs
	if (href.startsWith("//")) return `https:${href}`;
	return href;
}

export async function searchDuckDuckGo(
	query: string,
	limit = 10,
): Promise<WebSearchResult[]> {
	const encoded = encodeURIComponent(query);
	const url = `https://html.duckduckgo.com/html/?q=${encoded}`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			Accept: "text/html",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `q=${encoded}`,
		signal: AbortSignal.timeout(12000),
	});

	if (!response.ok) {
		console.warn(`[DuckDuckGo] HTML search returned ${response.status}`);
		return [];
	}

	const html = await response.text();
	const results: WebSearchResult[] = [];

	// Parse result blocks from DDG HTML
	// Each result is a <div class="result ..."> containing:
	//   <a class="result__a" href="...">Title</a>
	//   <a class="result__snippet">Snippet text</a>
	const resultBlocks = html.split(/class="result\s/g).slice(1);

	for (let i = 0; i < resultBlocks.length && results.length < limit; i++) {
		const block = resultBlocks[i];

		// Extract URL from result__a href
		const linkMatch = block.match(
			/class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i,
		);
		if (!linkMatch) continue;

		const rawUrl = linkMatch[1];
		const rawTitle = linkMatch[2];

		// Extract snippet
		const snippetMatch = block.match(
			/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i,
		);
		const rawSnippet = snippetMatch ? snippetMatch[1] : "";

		const decodedUrl = decodeDdgUrl(rawUrl);
		const title = stripHtml(rawTitle);
		const snippet = stripHtml(rawSnippet);

		// Validate URL and ignore DuckDuckGo internal pages
		let parsedUrl: URL;
		try {
			parsedUrl = new URL(decodedUrl);
		} catch {
			continue;
		}
		if (
			!title ||
			!decodedUrl ||
			parsedUrl.hostname === "duckduckgo.com" ||
			parsedUrl.hostname === "www.duckduckgo.com" ||
			parsedUrl.hostname === "html.duckduckgo.com"
		) {
			continue;
		}

		const domainAuthority = calculateDomainAuthority(decodedUrl);
		results.push({
			id: `ddg-${Date.now()}-${results.length}`,
			title,
			snippet,
			url: decodedUrl,
			source: "web",
			provider: "duckduckgo",
			domainAuthority,
			citationCount: 1,
			rawScore: Math.min(
				1.0,
				(0.85 - results.length * 0.03) * 0.6 + domainAuthority * 0.4,
			),
		});
	}

	console.log(
		`[DuckDuckGo] HTML search returned ${results.length} results for: ${query}`,
	);
	return results;
}

// ---------------------------------------------------------------------------
// Wikipedia Search + Summary API
// Uses the MediaWiki REST API — free, no key, CORS-friendly.
// ---------------------------------------------------------------------------

interface WikiSearchResult {
	id: number;
	key: string;
	title: string;
	description?: string;
	excerpt?: string;
	thumbnail?: { url: string; width: number; height: number };
}

interface WikiSearchResponse {
	pages: WikiSearchResult[];
}

interface WikiSummary {
	title: string;
	extract: string;
	content_urls?: {
		desktop?: { page?: string };
	};
	description?: string;
	timestamp?: string;
}

export async function searchWikipedia(
	query: string,
	limit = 5,
): Promise<WebSearchResult[]> {
	// Cap Wikipedia to 3 results max — it's a reference supplement, not the
	// primary search engine.  Without this cap Wikipedia dominates RRF fusion
	// because every query matches *some* Wikipedia article.
	const wikiLimit = Math.min(limit, 3);
	const encoded = encodeURIComponent(query);
	const searchUrl = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encoded}&limit=${wikiLimit}`;

	const response = await fetch(searchUrl, {
		headers: {
			Accept: "application/json",
			"User-Agent":
				"AgenticSearch/1.0 (https://github.com/MikePfunk28/agentic-search)",
		},
		signal: AbortSignal.timeout(8000),
	});

	if (!response.ok) {
		console.warn(`[Wikipedia] Search API returned ${response.status}`);
		return [];
	}

	const data: WikiSearchResponse = await response.json();

	if (!data.pages || data.pages.length === 0) {
		return [];
	}

	// Fetch summaries in parallel for richer snippets
	const summaryResults = await Promise.all(
		data.pages.slice(0, wikiLimit).map(async (page, index) => {
			try {
				const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.key)}`;
				const summaryResp = await fetch(summaryUrl, {
					headers: {
						Accept: "application/json",
						"User-Agent":
							"AgenticSearch/1.0 (https://github.com/MikePfunk28/agentic-search)",
					},
					signal: AbortSignal.timeout(5000),
				});

				if (summaryResp.ok) {
					const summary: WikiSummary = await summaryResp.json();
					const pageUrl =
						summary.content_urls?.desktop?.page ||
						`https://en.wikipedia.org/wiki/${encodeURIComponent(page.key)}`;

					return {
						id: `wiki-${Date.now()}-${index}`,
						title: summary.title || page.title,
						snippet: summary.extract || page.excerpt || page.description || "",
						url: pageUrl,
						source: "encyclopedia",
						provider: "wikipedia" as const,
						// Wikipedia revision timestamps are not publication dates and
						// should not influence freshness scoring for "latest" queries.
						domainAuthority: 0.7,
						citationCount: 1,
						rawScore: Math.max(0.5, 0.85 - index * 0.05),
					};
				}
			} catch {
				// Summary fetch failed — use search data
			}

			const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(page.key)}`;
			return {
				id: `wiki-${Date.now()}-${index}`,
				title: page.title,
				snippet: stripHtml(page.excerpt || page.description || ""),
				url: pageUrl,
				source: "encyclopedia",
				provider: "wikipedia" as const,
				domainAuthority: 0.7,
				citationCount: 1,
				rawScore: Math.max(0.45, 0.8 - index * 0.05),
			};
		}),
	);

	const results: WebSearchResult[] = summaryResults.filter(
		(r) => r !== null && r.snippet.length > 0,
	);

	console.log(`[Wikipedia] Returned ${results.length} results for: ${query}`);
	return results;
}

// ---------------------------------------------------------------------------
// Semantic Scholar — Free academic paper search, no API key required
// https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/post_graph_get_papers_search
// Rate limit: 100 requests per 5 minutes (unauthenticated)
// ---------------------------------------------------------------------------

interface SemanticScholarPaper {
	paperId: string;
	title: string;
	abstract?: string | null;
	url?: string;
	year?: number | null;
	citationCount?: number;
	authors?: Array<{ name: string }>;
	externalIds?: {
		ArXiv?: string;
		DOI?: string;
	};
}

interface SemanticScholarResponse {
	total: number;
	data: SemanticScholarPaper[];
}

export async function searchSemanticScholar(
	query: string,
	limit = 5,
): Promise<WebSearchResult[]> {
	const params = new URLSearchParams({
		query,
		limit: String(Math.min(limit, 10)),
		fields: "title,abstract,url,year,citationCount,authors,externalIds",
	});

	const url = `https://api.semanticscholar.org/graph/v1/paper/search?${params}`;

	let response = await fetch(url, {
		headers: {
			Accept: "application/json",
		},
		signal: AbortSignal.timeout(10000),
	});

	// Retry once on 429 rate limit — Semantic Scholar allows 100 req/5min
	if (response.status === 429) {
		const retryAfter = Number(response.headers.get("Retry-After")) || 2;
		console.warn(
			`[SemanticScholar] Rate limited (429), retrying in ${retryAfter}s`,
		);
		await new Promise((r) => setTimeout(r, retryAfter * 1000));
		response = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(10000),
		});
	}

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		console.warn(
			`[SemanticScholar] API returned ${response.status}: ${errorText.slice(0, 200)}`,
		);
		return [];
	}

	const data: SemanticScholarResponse = await response.json();

	if (!data.data || data.data.length === 0) {
		console.log("[SemanticScholar] No results found");
		return [];
	}

	const results: WebSearchResult[] = data.data
		.filter((paper) => paper.title)
		.map((paper, index) => {
			const paperUrl =
				paper.url ||
				(paper.externalIds?.DOI
					? `https://doi.org/${paper.externalIds.DOI}`
					: paper.externalIds?.ArXiv
						? `https://arxiv.org/abs/${paper.externalIds.ArXiv}`
						: `https://www.semanticscholar.org/paper/${paper.paperId}`);

			const authorStr =
				paper.authors && paper.authors.length > 0
					? paper.authors
							.slice(0, 3)
							.map((a) => a.name)
							.join(", ") + (paper.authors.length > 3 ? ` et al.` : "")
					: "";

			const snippet = [
				paper.abstract ? paper.abstract.slice(0, 300) : "",
				authorStr ? `Authors: ${authorStr}` : "",
				paper.year ? `Published: ${paper.year}` : "",
				paper.citationCount ? `Citations: ${paper.citationCount}` : "",
			]
				.filter(Boolean)
				.join(". ");

			const domainAuthority = calculateDomainAuthority(paperUrl);
			// Citation-weighted score: papers with many citations rank higher
			const citationBoost = paper.citationCount
				? Math.min(0.15, Math.log10(paper.citationCount + 1) * 0.05)
				: 0;

			return {
				id: `scholar-${Date.now()}-${index}`,
				title: paper.title,
				snippet,
				url: paperUrl,
				source: "academic" as const,
				provider: "semantic_scholar" as const,
				publishedDate: paper.year ? `${paper.year}` : undefined,
				domainAuthority,
				citationCount: 1,
				rawScore: Math.min(
					1.0,
					(0.8 - index * 0.04) * 0.5 + domainAuthority * 0.35 + citationBoost,
				),
			};
		});

	console.log(
		`[SemanticScholar] Returned ${results.length} results for: ${query}`,
	);
	return results;
}

// ---------------------------------------------------------------------------
// arXiv — Free preprint paper search via Atom API, no key required
// https://info.arxiv.org/help/api/basics.html
// No strict rate limit for reasonable usage
// ---------------------------------------------------------------------------

export async function searchArxiv(
	query: string,
	limit = 5,
): Promise<WebSearchResult[]> {
	// arXiv search supports field prefixes: all, ti (title), au (author), abs (abstract)
	const encoded = encodeURIComponent(`all:${query}`);
	const url = `https://export.arxiv.org/api/query?search_query=${encoded}&max_results=${Math.min(limit, 10)}&sortBy=relevance&sortOrder=descending`;

	const response = await fetch(url, {
		headers: {
			Accept: "application/xml",
			"User-Agent":
				"AgenticSearch/1.0 (https://github.com/MikePfunk28/agentic-search)",
		},
		signal: AbortSignal.timeout(10000),
	});

	if (!response.ok) {
		console.warn(`[arXiv] API returned ${response.status}`);
		return [];
	}

	const xml = await response.text();
	const results: WebSearchResult[] = [];

	// Parse Atom XML entries using regex (no DOM parser in Cloudflare Workers)
	const entries = xml.split(/<entry>/g).slice(1);

	for (let i = 0; i < entries.length && results.length < limit; i++) {
		const entry = entries[i];

		// Extract fields from XML
		const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/);
		const summaryMatch = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
		const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
		const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);

		// Extract authors
		const authorMatches = entry.match(/<name>([\s\S]*?)<\/name>/g);
		const authors = authorMatches
			? authorMatches.map((m) => m.replace(/<\/?name>/g, "").trim()).slice(0, 3)
			: [];

		if (!titleMatch || !idMatch) continue;

		const title = titleMatch[1].replace(/\s+/g, " ").trim();
		const abstract = summaryMatch
			? summaryMatch[1].replace(/\s+/g, " ").trim().slice(0, 300)
			: "";
		const arxivUrl = idMatch[1].trim().replace("http://", "https://");
		const published = publishedMatch
			? publishedMatch[1].trim().slice(0, 10)
			: undefined;

		const authorStr =
			authors.length > 0
				? authors.join(", ") +
					(authorMatches && authorMatches.length > 3 ? " et al." : "")
				: "";

		const snippet = [
			abstract,
			authorStr ? `Authors: ${authorStr}` : "",
			published ? `Published: ${published}` : "",
		]
			.filter(Boolean)
			.join(". ");

		results.push({
			id: `arxiv-${Date.now()}-${results.length}`,
			title,
			snippet,
			url: arxivUrl,
			source: "academic" as const,
			provider: "arxiv" as const,
			publishedDate: published,
			domainAuthority: 0.93, // arXiv is Tier 1 for academic content
			citationCount: 1,
			rawScore: Math.min(
				1.0,
				(0.82 - results.length * 0.04) * 0.6 + 0.93 * 0.4,
			),
		});
	}

	console.log(`[arXiv] Returned ${results.length} results for: ${query}`);
	return results;
}
