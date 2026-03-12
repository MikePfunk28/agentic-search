import { remove } from "lodash";
import type { ModelConfig } from "../model-config";
import { type LanguageDetector, languageDetector } from "./detector";
import { TranslationService, translationService } from "./service";
import type {
	EntityMatch,
	SupportedLanguage,
	TranslationOptions,
} from "./types";

export interface TranslatedQuery {
	original: string;
	translated: string;
	sourceLanguage: SupportedLanguage | "unknown";
	isTranslated: boolean;
	preservedEntities: EntityMatch[];
	confidence: number;
}

export interface EnhancedQuery {
	original: string;
	translated: string;
	combined: string;
	sourceLanguage: SupportedLanguage | "unknown";
	searchTerms: string[];
}

export class QueryTranslator {
	private detector: LanguageDetector;
	private translator: TranslationService;

	constructor(options?: { modelConfig?: ModelConfig }) {
		this.detector = languageDetector;
		this.translator = options?.modelConfig
			? new TranslationService({ modelConfig: options.modelConfig })
			: translationService;
	}

	setModelConfig(config: ModelConfig): void {
		this.translator.setModelConfig(config);
	}

	async translateQuery(
		query: string,
		options: TranslationOptions = {},
	): Promise<TranslatedQuery> {
		const detection = this.detector.detect(query);

		if (detection.isEnglish && detection.confidence > 0.7) {
			return {
				original: query,
				translated: query,
				sourceLanguage: detection.language,
				isTranslated: false,
				preservedEntities: [],
				confidence: detection.confidence,
			};
		}

		const entities = this.extractPreservedEntities(query);
		const maskedQuery = this.maskEntities(query, entities);

		try {
			const result = await this.translator.translate(maskedQuery, "en", {
				...options,
				preserveEntities: false,
			});

			const translatedWithEntities = this.unmaskEntities(
				result.translated,
				entities,
			);

			return {
				original: query,
				translated: translatedWithEntities,
				sourceLanguage: detection.language,
				isTranslated: true,
				preservedEntities: entities,
				confidence: result.confidence,
			};
		} catch (error) {
			console.error("[QueryTranslator] Translation failed:", error);

			return {
				original: query,
				translated: query,
				sourceLanguage: detection.language,
				isTranslated: false,
				preservedEntities: entities,
				confidence: 0,
			};
		}
	}

	async enhanceQuery(
		query: string,
		options: TranslationOptions = {},
	): Promise<EnhancedQuery> {
		const translated = await this.translateQuery(query, options);

		if (!translated.isTranslated) {
			return {
				original: query,
				translated: query,
				combined: query,
				sourceLanguage: translated.sourceLanguage,
				searchTerms: this.extractSearchTerms(query),
			};
		}

		const originalTerms = this.extractSearchTerms(translated.original);
		const translatedTerms = this.extractSearchTerms(translated.translated);

		const uniqueTerms = [
			...new Set([...translatedTerms, ...originalTerms.slice(0, 3)]),
		];

		const combined =
			uniqueTerms.length > translatedTerms.length
				? `${translated.translated} (${originalTerms.slice(0, 2).join(" ")})`
				: translated.translated;

		return {
			original: translated.original,
			translated: translated.translated,
			combined,
			sourceLanguage: translated.sourceLanguage,
			searchTerms: uniqueTerms,
		};
	}

	private extractPreservedEntities(query: string): EntityMatch[] {
		const entities: EntityMatch[] = [];

		const patterns: Array<{ regex: RegExp; type: EntityMatch["type"] }> = [
			{ regex: /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi, type: "url" },
			{
				regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
				type: "email",
			},
			{ regex: /```[\s\S]*?```|`[^`]+`/g, type: "code" },
			{
				regex:
					/\b(?:React|Vue|Angular|Svelte|TypeScript|JavaScript|Python|Java|Rust|Go|Node\.js|Next\.js|Docker|Kubernetes|AWS|GCP|Azure|OpenAI|Claude|GPT)\b/gi,
				type: "technical",
			},
			{
				regex: /\b[A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]{2,})*\b/g,
				type: "proper-noun",
			},
		];

		for (const { regex, type } of patterns) {
			let match;
			regex.lastIndex = 0;
			while ((match = regex.exec(query)) !== null) {
				entities.push({
					text: match[0],
					type,
					startIndex: match.index ?? 0,
					endIndex: (match.index ?? 0) + match[0].length,
				});
			}
		}

		return this.removeOverlappingEntities(entities);
	}

	private removeOverlappingEntities(entities: EntityMatch[]): EntityMatch[] {
		if (entities.length <= 1) return entities;

		entities.sort((a, b) => a.startIndex - b.startIndex);

		const result: EntityMatch[] = [];
		let current = entities[0];

		for (let i = 1; i < entities.length; i++) {
			const next = entities[i];

			if (next.startIndex < current.endIndex) {
				if (
					next.endIndex - next.startIndex >
					current.endIndex - current.startIndex
				) {
					current = next;
				}
			} else {
				result.push(current);
				current = next;
			}
		}

		result.push(current);
		return result;
	}

	private maskEntities(query: string, entities: EntityMatch[]): string {
		let masked = query;
		const sortedEntities = [...entities].sort(
			(a, b) => b.startIndex - a.startIndex,
		);

		for (let i = 0; i < sortedEntities.length; i++) {
			const entity = sortedEntities[i];
			const placeholder = `__ENTITY_${i}__`;
			masked =
				masked.slice(0, entity.startIndex) +
				placeholder +
				masked.slice(entity.endIndex);
		}

		return masked;
	}

	private unmaskEntities(translated: string, entities: EntityMatch[]): string {
		let result = translated;

		for (let i = entities.length - 1; i >= 0; i--) {
			const placeholder = `__ENTITY_${i}__`;
			result = result.replace(placeholder, entities[i].text);
		}

		return result;
	}

	private extractSearchTerms(text: string): string[] {
		const stopWords = new Set([
			"the",
			"a",
			"an",
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
			"can",
			"what",
			"how",
			"why",
			"when",
			"where",
			"who",
			"which",
			"that",
			"this",
			"these",
			"those",
		]);

		return text
			.toLowerCase()
			.replace(
				/[^\w\s\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af\u0400-\u04ff\u0600-\u06ff]/g,
				" ",
			)
			.split(/\s+/)
			.filter((word) => word.length > 1 && !stopWords.has(word))
			.slice(0, 10);
	}

	detectLanguage(query: string): {
		language: string;
		confidence: number;
		isEnglish: boolean;
	} {
		const detection = this.detector.detect(query);
		return {
			language: detection.language,
			confidence: detection.confidence,
			isEnglish: detection.isEnglish,
		};
	}

	needsTranslation(query: string): boolean {
		const detection = this.detector.detect(query);
		return !detection.isEnglish || detection.confidence < 0.5;
	}
}

export const queryTranslator = new QueryTranslator();
