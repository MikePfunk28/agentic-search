/** Paid providers require an API key; free providers always run */
export type PaidSearchProviderType = "firecrawl" | "brave" | "tavily" | "exa";
export type FreeSearchProviderType =
	| "duckduckgo"
	| "wikipedia"
	| "semantic_scholar"
	| "arxiv";
export type SearchProviderType =
	| PaidSearchProviderType
	| FreeSearchProviderType;

export interface WebSearchResult {
	id: string;
	title: string;
	snippet: string;
	url: string;
	source: string;
	provider: SearchProviderType | "cache";
	publishedDate?: string;
	markdown?: string;
	rawScore: number;
	domainAuthority: number;
	citationCount: number;
}

export interface SearchProviderConfig {
	type: SearchProviderType;
	apiKey: string;
	baseUrl?: string;
}

export interface SearchApiKeys {
	firecrawl?: string;
	brave?: string;
	tavily?: string;
	exa?: string;
}

export interface SearchProviderCapabilities {
	supportsFreshness: boolean;
	supportsFullContent: boolean;
	supportsSemanticSearch: boolean;
	supportsStructuredExtraction: boolean;
	costClass: "free" | "low" | "medium" | "high";
	latencyClass: "fast" | "medium" | "slow";
}

/** Paid provider — requires an API key in SearchApiKeys */
export interface SearchProviderDefinition {
	type: PaidSearchProviderType;
	displayName: string;
	credentialKey: keyof SearchApiKeys;
	capabilities: SearchProviderCapabilities;
	search: (
		query: string,
		apiKey: string,
		limit: number,
	) => Promise<WebSearchResult[]>;
}

/** Free provider — no API key needed, always available */
export interface FreeSearchProviderDefinition {
	type: FreeSearchProviderType;
	displayName: string;
	capabilities: SearchProviderCapabilities;
	search: (query: string, limit: number) => Promise<WebSearchResult[]>;
}

export interface ExecuteWebSearchOptions {
	firecrawlApiKey?: string;
	braveApiKey?: string;
	tavilyApiKey?: string;
	exaApiKey?: string;
	limit?: number;
}
