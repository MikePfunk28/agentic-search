export interface Entity {
	text: string;
	type:
		| "person"
		| "organization"
		| "location"
		| "date"
		| "product"
		| "concept"
		| "unknown";
	normalized?: string;
	confidence: number;
	startIndex: number;
	endIndex: number;
}

export interface QueryEnhancement {
	originalQuery: string;
	enhancedQuery: string;
	corrections: SpellingCorrection[];
	entities: Entity[];
	expansions: QueryExpansion[];
	language: LanguageDetection;
	contextAdded: string[];
	confidence: number;
	processingTimeMs: number;
}

export interface SpellingCorrection {
	original: string;
	corrected: string;
	position: number;
	confidence: number;
	type: "typo" | "misspelling" | "autocorrect";
}

export interface QueryExpansion {
	term: string;
	synonyms: string[];
	relatedTerms: string[];
	type: "synonym" | "hypernym" | "hyponym" | "related";
}

export interface LanguageDetection {
	language: string;
	confidence: number;
	isEnglish: boolean;
	needsTranslation: boolean;
	translatedQuery?: string;
}

export interface EnhancementOptions {
	enableSpellingCorrection?: boolean;
	enableEntityRecognition?: boolean;
	enableQueryExpansion?: boolean;
	enableContextInjection?: boolean;
	enableTranslation?: boolean;
	userContext?: UserContext;
	maxExpansions?: number;
	confidenceThreshold?: number;
}

export interface UserContext {
	recentQueries?: string[];
	preferredDomains?: string[];
	excludedTerms?: string[];
	userLocation?: string;
	language?: string;
}

export interface EnhancementResult {
	success: boolean;
	enhancement?: QueryEnhancement;
	error?: string;
}

const COMMON_MISSPELLINGS: Record<string, string> = {
	teh: "the",
	adn: "and",
	taht: "that",
	wiht: "with",
	thier: "their",
	recieve: "receive",
	occured: "occurred",
	seperate: "separate",
	definately: "definitely",
	occassion: "occasion",
	accomodate: "accommodate",
	untill: "until",
	begining: "beginning",
	beleive: "believe",
	calender: "calendar",
	collegue: "colleague",
	commited: "committed",
	concious: "conscious",
	embarass: "embarrass",
	enviroment: "environment",
	goverment: "government",
	greivance: "grievance",
	harassement: "harassment",
	immediatly: "immediately",
	independant: "independent",
	knowlege: "knowledge",
	liason: "liaison",
	maintainance: "maintenance",
	millenium: "millennium",
	neccessary: "necessary",
	noticable: "noticeable",
	occurence: "occurrence",
	paralell: "parallel",
	particulary: "particularly",
	perseverence: "perseverance",
	posession: "possession",
	prefered: "preferred",
	privelege: "privilege",
	profesion: "profession",
	pronounciation: "pronunciation",
	publically: "publicly",
	recomend: "recommend",
	refered: "referred",
	relevent: "relevant",
	restraunt: "restaurant",
	rythm: "rhythm",
	schedual: "schedule",
	seige: "siege",
	succesful: "successful",
	suprise: "surprise",
	tendancy: "tendency",
	therefor: "therefore",
	threshhold: "threshold",
	tommorow: "tomorrow",
	truely: "truly",
	unfortunatly: "unfortunately",
	wierd: "weird",
	wich: "which",
	writting: "writing",
};

const SYNONYM_MAP: Record<string, string[]> = {
	search: ["find", "look for", "query", "seek", "locate"],
	find: ["search", "discover", "locate", "identify", "retrieve"],
	fast: ["quick", "rapid", "speedy", "swift", "expedited"],
	slow: ["gradual", "sluggish", "unhurried", "leisurely"],
	big: ["large", "huge", "massive", "enormous", "substantial"],
	small: ["tiny", "little", "miniature", "compact", "minor"],
	good: ["excellent", "great", "quality", "superior", "effective"],
	bad: ["poor", "inferior", "substandard", "inadequate"],
	new: ["recent", "latest", "current", "modern", "contemporary"],
	old: ["ancient", "dated", "previous", "former", "traditional"],
	help: ["assist", "aid", "support", "guide", "facilitate"],
	create: ["build", "make", "develop", "construct", "establish"],
	delete: ["remove", "eliminate", "erase", "discard", "purge"],
	update: ["modify", "change", "revise", "amend", "refresh"],
	show: ["display", "present", "exhibit", "demonstrate", "reveal"],
	hide: ["conceal", "mask", "cover", "obscure"],
	start: ["begin", "initiate", "launch", "commence", "activate"],
	stop: ["halt", "cease", "end", "terminate", "discontinue"],
	error: ["mistake", "fault", "problem", "issue", "bug"],
	fix: ["repair", "resolve", "correct", "remedy", "patch"],
};

const TECH_ENTITY_PATTERNS: Array<{
	pattern: RegExp;
	type: Entity["type"];
	normalizer?: (match: string) => string;
}> = [
	{
		pattern:
			/\b(react|vue|angular|svelte|next\.js|nuxt|gatsby|astro|remix|tanstack)\b/gi,
		type: "product",
		normalizer: (m) => m.toLowerCase().replace(".js", ""),
	},
	{
		pattern:
			/\b(typescript|javascript|python|rust|go|java|kotlin|swift|c\+\+|c#|ruby|php)\b/gi,
		type: "product",
		normalizer: (m) => m.toLowerCase(),
	},
	{
		pattern:
			/\b(openai|anthropic|google|meta|microsoft|amazon|apple|netflix|uber|airbnb)\b/gi,
		type: "organization",
		normalizer: (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase(),
	},
	{
		pattern:
			/\b(chatgpt|gpt-4|gpt-4o|claude|gemini|llama|mistral|deepseek)\b/gi,
		type: "product",
		normalizer: (m) => m.toUpperCase(),
	},
	{
		pattern: /\b(api|rest|graphql|grpc|websocket|http|https)\b/gi,
		type: "concept",
		normalizer: (m) => m.toUpperCase(),
	},
	{
		pattern:
			/\b(docker|kubernetes|aws|azure|gcp|cloudflare|vercel|netlify)\b/gi,
		type: "product",
		normalizer: (m) => m.toLowerCase(),
	},
	{
		pattern:
			/\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|january|february|march|april|may|june|july|august|september|october|november|december)\b/gi,
		type: "date",
	},
];

const STOP_WORDS = new Set([
	"a",
	"an",
	"the",
	"and",
	"or",
	"but",
	"in",
	"on",
	"at",
	"to",
	"for",
	"of",
	"with",
	"by",
	"from",
	"as",
	"is",
	"was",
	"are",
	"were",
	"been",
	"be",
	"have",
	"has",
	"had",
	"do",
	"does",
	"did",
	"will",
	"would",
	"could",
	"should",
	"may",
	"might",
	"must",
	"shall",
	"can",
	"need",
	"dare",
	"ought",
	"used",
	"it",
	"its",
	"this",
	"that",
	"these",
	"those",
	"i",
	"you",
	"he",
	"she",
	"we",
	"they",
	"what",
	"which",
	"who",
	"whom",
	"how",
	"when",
	"where",
	"why",
	"if",
	"then",
	"else",
	"so",
	"just",
]);

export { COMMON_MISSPELLINGS, SYNONYM_MAP, TECH_ENTITY_PATTERNS, STOP_WORDS };
