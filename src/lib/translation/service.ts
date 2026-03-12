import type { ModelConfig } from "../model-config";
import { type LanguageDetector, languageDetector } from "./detector";
import type {
	CacheEntry,
	EntityMatch,
	SupportedLanguage,
	TranslationOptions,
	TranslationResult,
} from "./types";
import { DEFAULT_TIMEOUT_MS, DEFAULT_TTL_MS } from "./types";

export class TranslationService {
	private cache: Map<string, CacheEntry> = new Map();
	private detector: LanguageDetector;
	private modelConfig: ModelConfig | null = null;
	private readonly ttlMs: number;

	constructor(options?: { ttlMs?: number; modelConfig?: ModelConfig }) {
		this.detector = languageDetector;
		this.ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
		this.modelConfig = options?.modelConfig ?? null;
	}

	setModelConfig(config: ModelConfig): void {
		this.modelConfig = config;
	}

	async translate(
		text: string,
		targetLang: SupportedLanguage = "en",
		options: TranslationOptions = {},
	): Promise<TranslationResult> {
		const {
			cache = true,
			timeout = DEFAULT_TIMEOUT_MS,
			preserveEntities = true,
		} = options;

		const detection = this.detector.detect(text);

		if (detection.language === targetLang || detection.language === "unknown") {
			return {
				original: text,
				translated: text,
				sourceLang: detection.language as SupportedLanguage,
				targetLang,
				cached: false,
				confidence: detection.confidence,
			};
		}

		const cacheKey = this.getCacheKey(text, detection.language, targetLang);

		if (cache) {
			const cached = this.getFromCache(cacheKey);
			if (cached) {
				return {
					original: text,
					translated: cached.translated,
					sourceLang: cached.sourceLang,
					targetLang: cached.targetLang,
					cached: true,
					confidence: cached.confidence,
				};
			}
		}

		let processedText = text;
		let entities: EntityMatch[] = [];

		if (preserveEntities) {
			const result = this.extractAndMaskEntities(text);
			processedText = result.maskedText;
			entities = result.entities;
		}

		try {
			const translated = await this.callModel(
				processedText,
				detection.language,
				targetLang,
				timeout,
			);

			let finalTranslated = translated;
			if (preserveEntities && entities.length > 0) {
				finalTranslated = this.restoreEntities(translated, entities);
			}

			const result: TranslationResult = {
				original: text,
				translated: finalTranslated,
				sourceLang: detection.language as SupportedLanguage,
				targetLang,
				cached: false,
				confidence: 0.9,
			};

			if (cache) {
				this.setCache(cacheKey, {
					translated: finalTranslated,
					sourceLang: result.sourceLang,
					targetLang,
					timestamp: Date.now(),
					confidence: result.confidence,
				});
			}

			return result;
		} catch (error) {
			console.error("[TranslationService] Translation failed:", error);

			return {
				original: text,
				translated: text,
				sourceLang: detection.language as SupportedLanguage,
				targetLang,
				cached: false,
				confidence: 0,
			};
		}
	}

	private async callModel(
		text: string,
		sourceLang: SupportedLanguage | "unknown",
		targetLang: SupportedLanguage,
		timeout: number,
	): Promise<string> {
		if (!this.modelConfig) {
			throw new Error("No model configuration set for translation");
		}

		const prompt = this.buildTranslationPrompt(text, sourceLang, targetLang);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			if (this.modelConfig.apiKey) {
				headers["Authorization"] = `Bearer ${this.modelConfig.apiKey}`;
			}

			const baseUrl = this.modelConfig.baseUrl || "https://api.openai.com/v1";

			const response = await fetch(`${baseUrl}/chat/completions`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					model: this.modelConfig.model,
					messages: [
						{
							role: "system",
							content:
								"You are a professional translator. Translate the given text accurately while preserving the meaning and tone. Only output the translation, nothing else.",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.3,
					max_tokens: 2000,
				}),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`Translation API error: ${response.status}`);
			}

			const data = (await response.json()) as {
				choices?: Array<{ message?: { content?: string } }>;
			};
			const translated = data.choices?.[0]?.message?.content?.trim();

			if (!translated) {
				throw new Error("Empty translation response");
			}

			return translated;
		} catch (error) {
			clearTimeout(timeoutId);
			throw error;
		}
	}

	private buildTranslationPrompt(
		text: string,
		sourceLang: SupportedLanguage | "unknown",
		targetLang: SupportedLanguage,
	): string {
		const sourceLangName =
			sourceLang === "unknown"
				? "the source language"
				: this.getLanguageName(sourceLang);
		const targetLangName = this.getLanguageName(targetLang);

		return `Translate the following text from ${sourceLangName} to ${targetLangName}. Preserve any placeholders like {{ENTITY_N}} exactly as they appear.

Text to translate:
${text}`;
	}

	private getLanguageName(lang: SupportedLanguage): string {
		const names: Record<SupportedLanguage, string> = {
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
		return names[lang] || lang;
	}

	private extractAndMaskEntities(text: string): {
		maskedText: string;
		entities: EntityMatch[];
	} {
		const entities: EntityMatch[] = [];
		let maskedText = text;
		let entityIndex = 0;

		const patterns: Array<{ regex: RegExp; type: EntityMatch["type"] }> = [
			{ regex: /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi, type: "url" },
			{
				regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
				type: "email",
			},
			{ regex: /```[\s\S]*?```|`[^`]+`/g, type: "code" },
			{
				regex:
					/\b(?:React|Vue|Angular|TypeScript|JavaScript|Python|Node\.js|Docker|Kubernetes|AWS|GCP|Azure)\b/gi,
				type: "technical",
			},
		];

		for (const { regex, type } of patterns) {
			maskedText = maskedText.replace(regex, (match) => {
				const placeholder = `{{ENTITY_${entityIndex}}}`;
				entities.push({
					text: match,
					type,
					startIndex: -1,
					endIndex: -1,
				});
				entityIndex++;
				return placeholder;
			});
		}

		return { maskedText, entities };
	}

	private restoreEntities(translated: string, entities: EntityMatch[]): string {
		let result = translated;

		for (let i = 0; i < entities.length; i++) {
			const placeholder = `{{ENTITY_${i}}}`;
			result = result.replace(placeholder, entities[i].text);
		}

		return result;
	}

	private getCacheKey(
		text: string,
		sourceLang: string,
		targetLang: string,
	): string {
		const hash = this.simpleHash(text);
		return `${sourceLang}:${targetLang}:${hash}`;
	}

	private simpleHash(text: string): string {
		let hash = 0;
		for (let i = 0; i < text.length; i++) {
			const char = text.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return hash.toString(16);
	}

	private getFromCache(key: string): CacheEntry | null {
		const entry = this.cache.get(key);

		if (!entry) return null;

		if (Date.now() - entry.timestamp > this.ttlMs) {
			this.cache.delete(key);
			return null;
		}

		return entry;
	}

	private setCache(key: string, entry: CacheEntry): void {
		this.cache.set(key, entry);
	}

	clearCache(): void {
		this.cache.clear();
	}

	getCacheSize(): number {
		return this.cache.size;
	}

	pruneExpiredCache(): number {
		const now = Date.now();
		let pruned = 0;

		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > this.ttlMs) {
				this.cache.delete(key);
				pruned++;
			}
		}

		return pruned;
	}
}

export const translationService = new TranslationService();
