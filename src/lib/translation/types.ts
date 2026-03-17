export type SupportedLanguage =
	| "en"
	| "es"
	| "fr"
	| "de"
	| "zh"
	| "ja"
	| "ko"
	| "pt"
	| "ru"
	| "ar";

export interface LanguageDetection {
	language: SupportedLanguage | "unknown";
	confidence: number;
	isEnglish: boolean;
	characterSets: string[];
}

export interface TranslationResult {
	original: string;
	translated: string;
	sourceLang: SupportedLanguage;
	targetLang: SupportedLanguage;
	cached: boolean;
	confidence: number;
}

export interface TranslationOptions {
	cache?: boolean;
	timeout?: number;
	preserveEntities?: boolean;
}

export interface CacheEntry {
	translated: string;
	sourceLang: SupportedLanguage;
	targetLang: SupportedLanguage;
	timestamp: number;
	confidence: number;
}

export interface EntityMatch {
	text: string;
	type: "url" | "code" | "email" | "technical" | "proper-noun";
	startIndex: number;
	endIndex: number;
}

export interface DetectionPattern {
	language: SupportedLanguage;
	characterRanges: Array<[number, number]>;
	commonWords: Set<string>;
	bigrams: Set<string>;
	trigrams: Set<string>;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
	"en",
	"es",
	"fr",
	"de",
	"zh",
	"ja",
	"ko",
	"pt",
	"ru",
	"ar",
];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
	en: "English",
	es: "Spanish",
	fr: "French",
	de: "German",
	zh: "Chinese",
	ja: "Japanese",
	ko: "Korean",
	pt: "Portuguese",
	ru: "Russian",
	ar: "Arabic",
};

export const DEFAULT_TTL_MS = 60 * 60 * 1000;
export const DEFAULT_TIMEOUT_MS = 30000;
