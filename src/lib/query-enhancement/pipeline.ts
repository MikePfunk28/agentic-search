import {
	COMMON_MISSPELLINGS,
	type EnhancementOptions,
	type Entity,
	type LanguageDetection,
	type QueryEnhancement,
	type QueryExpansion,
	type SpellingCorrection,
	STOP_WORDS,
	SYNONYM_MAP,
	TECH_ENTITY_PATTERNS,
	type UserContext,
} from "./types";

export class QueryEnhancementPipeline {
	private readonly defaultOptions: EnhancementOptions = {
		enableSpellingCorrection: true,
		enableEntityRecognition: true,
		enableQueryExpansion: true,
		enableContextInjection: true,
		enableTranslation: false,
		maxExpansions: 3,
		confidenceThreshold: 0.7,
	};

	async enhance(
		query: string,
		options: EnhancementOptions = {},
	): Promise<QueryEnhancement> {
		const startTime = Date.now();
		const opts = { ...this.defaultOptions, ...options };
		let enhancedQuery = query;
		const corrections: SpellingCorrection[] = [];
		const entities: Entity[] = [];
		const expansions: QueryExpansion[] = [];
		const contextAdded: string[] = [];

		if (opts.enableSpellingCorrection) {
			const spellResult = this.correctSpelling(enhancedQuery);
			enhancedQuery = spellResult.corrected;
			corrections.push(...spellResult.corrections);
		}

		if (opts.enableEntityRecognition) {
			const entityResult = this.recognizeEntities(enhancedQuery);
			entities.push(...entityResult);
		}

		if (opts.enableQueryExpansion) {
			const expansionResult = this.expandQuery(
				enhancedQuery,
				opts.maxExpansions ?? 3,
			);
			expansions.push(...expansionResult.expansions);
		}

		if (opts.enableContextInjection && opts.userContext) {
			const contextResult = this.injectContext(enhancedQuery, opts.userContext);
			if (contextResult.added.length > 0) {
				contextAdded.push(...contextResult.added);
			}
		}

		const language = this.detectLanguage(enhancedQuery);

		const confidence = this.calculateConfidence(
			corrections,
			entities,
			expansions,
		);

		return {
			originalQuery: query,
			enhancedQuery,
			corrections,
			entities,
			expansions,
			language,
			contextAdded,
			confidence,
			processingTimeMs: Date.now() - startTime,
		};
	}

	private correctSpelling(query: string): {
		corrected: string;
		corrections: SpellingCorrection[];
	} {
		const corrections: SpellingCorrection[] = [];
		const words = query.split(/(\s+)/);
		const correctedWords = words.map((word, index) => {
			const lowerWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
			const punctuation = word.match(/[.,!?;:'"]+$/)?.[0] || "";
			const cleanWord = lowerWord;

			if (COMMON_MISSPELLINGS[cleanWord]) {
				const corrected = COMMON_MISSPELLINGS[cleanWord];
				const originalPunctuation = word.match(/^[.,!?;:'"]+/)?.[0] || "";
				corrections.push({
					original: cleanWord,
					corrected,
					position: index,
					confidence: 0.95,
					type: "misspelling",
				});
				return (
					originalPunctuation +
					corrected.charAt(0).toUpperCase() +
					corrected.slice(1) +
					punctuation
				);
			}

			const typoCorrected = this.detectTypo(cleanWord);
			if (typoCorrected) {
				corrections.push({
					original: cleanWord,
					corrected: typoCorrected,
					position: index,
					confidence: 0.8,
					type: "typo",
				});
				return (
					word.charAt(0).toUpperCase() + typoCorrected.slice(1) + punctuation
				);
			}

			return word;
		});

		return {
			corrected: correctedWords.join(""),
			corrections,
		};
	}

	private detectTypo(word: string): string | null {
		if (word.length < 4) return null;

		const doubledChars = word.match(/(.)\1{2,}/g);
		if (doubledChars) {
			return word.replace(/(.)\1{2,}/g, "$1$1");
		}

		const transpositions: string[] = [];
		for (let i = 0; i < word.length - 1; i++) {
			const transposed =
				word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);
			transpositions.push(transposed);
		}

		for (const transposed of transpositions) {
			if (COMMON_MISSPELLINGS[transposed]) {
				return COMMON_MISSPELLINGS[transposed];
			}
		}

		return null;
	}

	private recognizeEntities(query: string): Entity[] {
		const entities: Entity[] = [];

		for (const { pattern, type, normalizer } of TECH_ENTITY_PATTERNS) {
			const matches = query.matchAll(pattern);
			for (const match of matches) {
				if (match.index !== undefined) {
					const text = match[0];
					entities.push({
						text,
						type,
						normalized: normalizer ? normalizer(text) : text.toLowerCase(),
						confidence: 0.9,
						startIndex: match.index,
						endIndex: match.index + text.length,
					});
				}
			}
		}

		const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
		const capitalizedMatches = query.matchAll(capitalizedPattern);
		for (const match of capitalizedMatches) {
			if (match.index !== undefined) {
				const text = match[0];
				const isDuplicate = entities.some(
					(e) =>
						e.startIndex === match.index ||
						(e.text.toLowerCase() === text.toLowerCase() &&
							Math.abs(e.startIndex - match.index) < text.length),
				);
				if (!isDuplicate && !STOP_WORDS.has(text.toLowerCase())) {
					entities.push({
						text,
						type: "unknown",
						normalized: text,
						confidence: 0.6,
						startIndex: match.index,
						endIndex: match.index + text.length,
					});
				}
			}
		}

		return entities;
	}

	private expandQuery(
		query: string,
		maxExpansions: number,
	): { expansions: QueryExpansion[]; expandedTerms: string[] } {
		const expansions: QueryExpansion[] = [];
		const expandedTerms: string[] = [];
		const words = query.toLowerCase().split(/\s+/);
		let count = 0;

		for (const word of words) {
			if (count >= maxExpansions) break;

			const cleanWord = word.replace(/[.,!?;:'"]/g, "");
			if (STOP_WORDS.has(cleanWord)) continue;

			const synonyms = SYNONYM_MAP[cleanWord];
			if (synonyms && synonyms.length > 0) {
				expansions.push({
					term: cleanWord,
					synonyms: synonyms.slice(0, 3),
					relatedTerms: [],
					type: "synonym",
				});
				expandedTerms.push(cleanWord);
				count++;
			}
		}

		return { expansions, expandedTerms };
	}

	private injectContext(
		query: string,
		context: UserContext,
	): { query: string; added: string[] } {
		const added: string[] = [];

		if (context.recentQueries && context.recentQueries.length > 0) {
			const recentTerms = this.extractKeyTerms(
				context.recentQueries.slice(0, 3).join(" "),
			);
			const queryTerms = new Set(query.toLowerCase().split(/\s+/));

			for (const term of recentTerms.slice(0, 2)) {
				if (!queryTerms.has(term.toLowerCase())) {
					added.push(`context:${term}`);
				}
			}
		}

		if (context.preferredDomains && context.preferredDomains.length > 0) {
			for (const domain of context.preferredDomains.slice(0, 2)) {
				added.push(`site:${domain}`);
			}
		}

		return { query, added };
	}

	private extractKeyTerms(text: string): string[] {
		const words = text.toLowerCase().split(/\s+/);
		return words
			.filter((w) => w.length > 3 && !STOP_WORDS.has(w))
			.filter((w) => !/^\d+$/.test(w))
			.slice(0, 5);
	}

	private detectLanguage(query: string): LanguageDetection {
		const englishPattern = /^[a-zA-Z0-9\s.,!?;:'"\-+\p{Emoji_Presentation}]*$/u;
		const isLikelyEnglish = englishPattern.test(query);

		const commonEnglishWords = [
			"the",
			"is",
			"are",
			"was",
			"were",
			"have",
			"has",
			"will",
			"would",
			"could",
			"should",
			"can",
			"what",
			"how",
			"why",
			"when",
			"where",
		];
		const queryWords = query.toLowerCase().split(/\s+/);
		const englishWordCount = queryWords.filter((w) =>
			commonEnglishWords.includes(w),
		).length;

		const confidence =
			(isLikelyEnglish ? 0.5 : 0) + Math.min(englishWordCount * 0.2, 0.5);

		return {
			language: confidence > 0.5 ? "en" : "unknown",
			confidence,
			isEnglish: confidence > 0.5,
			needsTranslation: confidence < 0.3,
		};
	}

	private calculateConfidence(
		corrections: SpellingCorrection[],
		entities: Entity[],
		expansions: QueryExpansion[],
	): number {
		let confidence = 1.0;

		if (corrections.length > 0) {
			const avgCorrectionConf =
				corrections.reduce((sum, c) => sum + c.confidence, 0) /
				corrections.length;
			confidence *= avgCorrectionConf;
		}

		if (entities.length > 0) {
			const avgEntityConf =
				entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length;
			confidence = confidence * 0.7 + avgEntityConf * 0.3;
		}

		if (expansions.length > 0) {
			confidence = Math.min(confidence, 0.95);
		}

		return Math.max(0.1, Math.min(1.0, confidence));
	}

	buildEnhancedQueryString(enhancement: QueryEnhancement): string {
		let query = enhancement.enhancedQuery;

		const significantEntities = enhancement.entities
			.filter((e) => e.confidence > 0.7)
			.map((e) => e.normalized || e.text);

		if (significantEntities.length > 0) {
			const entityHints = significantEntities
				.slice(0, 3)
				.map((e) => `"${e}"`)
				.join(" OR ");
			query = `${query} (${entityHints})`;
		}

		return query;
	}

	getExpansionTerms(enhancement: QueryEnhancement): string[] {
		const terms: string[] = [];

		for (const expansion of enhancement.expansions) {
			terms.push(...expansion.synonyms.slice(0, 2));
		}

		return [...new Set(terms)];
	}
}

export const queryEnhancementPipeline = new QueryEnhancementPipeline();
