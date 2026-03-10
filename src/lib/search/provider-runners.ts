import { z } from "zod";
import {
	FirecrawlClient,
	type FirecrawlSearchResult,
} from "../firecrawl-client";
import { calculateDomainAuthority } from "./domain-authority";
import type { WebSearchResult } from "./types";

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

export async function searchTavily(
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
		return results.map(
			(result: z.infer<typeof TavilyResultSchema>, index: number) =>
				mapTavilyResult(result, index),
		);
	}

	return parsed.data.results.map(mapTavilyResult);
}

function mapTavilyResult(
	result: z.infer<typeof TavilyResultSchema>,
	index: number,
): WebSearchResult {
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
		rawScore:
			(result.score ?? 0.8 - index * 0.03) * 0.6 + domainAuthority * 0.4,
	};
}

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

export async function searchExa(
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
		return results.map(
			(result: z.infer<typeof ExaResultSchema>, index: number) =>
				mapExaResult(result, index),
		);
	}

	return parsed.data.results.map(mapExaResult);
}

function mapExaResult(
	result: z.infer<typeof ExaResultSchema>,
	index: number,
): WebSearchResult {
	const domainAuthority = calculateDomainAuthority(result.url);
	const snippet =
		result.text ||
		(result.highlights && result.highlights.length > 0
			? result.highlights.join(" ... ")
			: "");

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
		rawScore:
			(result.score ?? 0.8 - index * 0.03) * 0.6 + domainAuthority * 0.4,
	};
}

const BraveWebResultSchema = z.object({
	title: z.string(),
	url: z.string(),
	description: z.string().optional(),
	age: z.string().optional(),
	page_age: z.string().optional(),
	extra_snippets: z.array(z.string()).optional(),
});

const BraveSearchResponseSchema = z.object({
	web: z
		.object({
			results: z.array(BraveWebResultSchema),
		})
		.optional(),
	query: z
		.object({
			original: z.string(),
		})
		.optional(),
});

export async function searchBrave(
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
				Accept: "application/json",
				"Accept-Encoding": "gzip",
				"X-Subscription-Token": apiKey,
			},
			signal: AbortSignal.timeout(10000),
		},
	);

	if (!response.ok) {
		const errorText = await response.text().catch(() => "");
		throw new Error(
			`Brave Search API error (${response.status}): ${errorText}`,
		);
	}

	const data = await response.json();
	const parsed = BraveSearchResponseSchema.safeParse(data);

	if (!parsed.success) {
		console.warn(
			"[BraveSearch] Response validation failed:",
			parsed.error.message,
		);
		const results = data?.web?.results;
		if (!Array.isArray(results)) return [];
		return results.map(
			(result: z.infer<typeof BraveWebResultSchema>, index: number) =>
				mapBraveResult(result, index),
		);
	}

	const webResults = parsed.data.web?.results || [];
	return webResults.map(mapBraveResult);
}

function mapBraveResult(
	result: z.infer<typeof BraveWebResultSchema>,
	index: number,
): WebSearchResult {
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
		rawScore: Math.min(1.0, (0.85 - index * 0.03) * 0.6 + domainAuthority * 0.4),
	};
}

export async function searchFirecrawl(
	query: string,
	apiKey: string,
	limit = 5,
): Promise<WebSearchResult[]> {
	const firecrawl = new FirecrawlClient({ apiKey });
	const results = await firecrawl.search({
		query,
		limit,
		formats: ["markdown"],
		onlyMainContent: true,
	});

	console.log(`[Firecrawl] Returned ${results.length} results for: ${query}`);

	return results.map((result: FirecrawlSearchResult, index: number) => {
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
			rawScore: Math.min(1.0, (0.85 - index * 0.03) * 0.6 + domainAuthority * 0.4),
		};
	});
}
