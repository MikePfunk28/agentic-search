import type {
	DetectionPattern,
	LanguageDetection,
	SupportedLanguage,
} from "./types";

const LANGUAGE_PATTERNS: DetectionPattern[] = [
	{
		language: "en",
		characterRanges: [[0x0041, 0x007a]],
		commonWords: new Set([
			"the",
			"be",
			"to",
			"of",
			"and",
			"a",
			"in",
			"that",
			"have",
			"i",
			"it",
			"for",
			"not",
			"on",
			"with",
			"he",
			"as",
			"you",
			"do",
			"at",
			"this",
			"but",
			"his",
			"by",
			"from",
			"they",
			"we",
			"say",
			"her",
			"she",
			"or",
			"an",
			"will",
			"my",
			"one",
			"all",
			"would",
			"there",
			"their",
			"what",
			"so",
			"up",
			"out",
			"if",
			"about",
			"who",
			"get",
			"which",
			"go",
			"me",
			"when",
			"make",
			"can",
			"like",
			"time",
			"no",
			"just",
			"him",
			"know",
			"take",
		]),
		bigrams: new Set([
			"th",
			"he",
			"in",
			"er",
			"an",
			"re",
			"on",
			"at",
			"en",
			"nd",
		]),
		trigrams: new Set([
			"the",
			"and",
			"ing",
			"ion",
			"tio",
			"ent",
			"ati",
			"for",
			"her",
			"ter",
		]),
	},
	{
		language: "es",
		characterRanges: [
			[0x0041, 0x007a],
			[0x00c0, 0x00ff],
		],
		commonWords: new Set([
			"el",
			"la",
			"de",
			"que",
			"y",
			"a",
			"en",
			"un",
			"ser",
			"se",
			"no",
			"haber",
			"por",
			"con",
			"su",
			"para",
			"como",
			"estar",
			"tener",
			"le",
			"lo",
			"todo",
			"pero",
			"más",
			"hacer",
			"o",
			"poder",
			"decir",
			"este",
			"ir",
			"otro",
			"ese",
			"si",
			"me",
			"ya",
			"ver",
			"porque",
			"dar",
			"cuando",
			"muy",
			"sin",
			"vez",
			"mucho",
			"saber",
			"qué",
			"sobre",
			"mi",
			"alguno",
			"mismo",
			"yo",
		]),
		bigrams: new Set([
			"de",
			"en",
			"es",
			"el",
			"la",
			"ue",
			"er",
			"os",
			"as",
			"ar",
		]),
		trigrams: new Set([
			"que",
			"los",
			"del",
			"las",
			"por",
			"con",
			"una",
			"par",
			"odo",
			"ent",
		]),
	},
	{
		language: "fr",
		characterRanges: [
			[0x0041, 0x007a],
			[0x00c0, 0x00ff],
		],
		commonWords: new Set([
			"le",
			"de",
			"un",
			"être",
			"et",
			"à",
			"il",
			"avoir",
			"ne",
			"je",
			"se",
			"qui",
			"ce",
			"dans",
			"en",
			"du",
			"que",
			"pour",
			"pas",
			"sur",
			"faire",
			"plus",
			"dire",
			"me",
			"on",
			"mon",
			"lui",
			"nous",
			"comme",
			"mais",
			"pouvoir",
			"avec",
			"tout",
			"y",
			"aller",
			"voir",
			"bien",
			"où",
			"sans",
			"tu",
			"ou",
			"leur",
			"homme",
			"si",
			"deux",
			"mari",
			"moi",
			"vouloir",
			"te",
			"venir",
		]),
		bigrams: new Set([
			"es",
			"de",
			"le",
			"en",
			"re",
			"on",
			"ou",
			"nt",
			"er",
			"te",
		]),
		trigrams: new Set([
			"les",
			"des",
			"que",
			"est",
			"tion",
			"pas",
			"ent",
			"pour",
			"ais",
			"dan",
		]),
	},
	{
		language: "de",
		characterRanges: [
			[0x0041, 0x007a],
			[0x00c0, 0x00ff],
		],
		commonWords: new Set([
			"der",
			"die",
			"und",
			"in",
			"den",
			"von",
			"zu",
			"das",
			"mit",
			"sich",
			"des",
			"auf",
			"ein",
			"im",
			"nicht",
			"sein",
			"ist",
			"an",
			"für",
			"auch",
			"es",
			"als",
			"aus",
			"er",
			"hat",
			"dass",
			"wie",
			"nach",
			"bei",
			"um",
			"sind",
			"noch",
			"von",
			"wir",
			"ihr",
			"kann",
			"sie",
			"so",
			"oder",
			"haben",
			"was",
			"wird",
			"durch",
			"über",
			"wenn",
			"ihr",
			"ihm",
			"diese",
			"dies",
			"nur",
		]),
		bigrams: new Set([
			"er",
			"en",
			"ch",
			"te",
			"nd",
			"ge",
			"st",
			"ne",
			"in",
			"de",
		]),
		trigrams: new Set([
			"ich",
			"sch",
			"den",
			"nde",
			"die",
			"gen",
			"ein",
			"che",
			"ter",
			"ten",
		]),
	},
	{
		language: "zh",
		characterRanges: [
			[0x4e00, 0x9fff],
			[0x3400, 0x4dbf],
		],
		commonWords: new Set([
			"的",
			"是",
			"在",
			"不",
			"了",
			"有",
			"和",
			"人",
			"这",
			"中",
			"大",
			"为",
			"上",
			"个",
			"国",
			"我",
			"以",
			"要",
			"他",
			"时",
			"来",
			"用",
			"们",
			"生",
			"到",
			"作",
			"地",
			"于",
			"出",
			"就",
			"分",
			"对",
			"成",
			"会",
			"可",
			"主",
			"发",
			"年",
			"动",
			"同",
			"工",
			"也",
			"能",
			"下",
			"过",
			"子",
			"说",
			"产",
			"种",
			"面",
		]),
		bigrams: new Set(["的", "是", "在", "不", "了"]),
		trigrams: new Set(["的", "是", "在"]),
	},
	{
		language: "ja",
		characterRanges: [
			[0x3040, 0x309f],
			[0x30a0, 0x30ff],
			[0x4e00, 0x9fff],
		],
		commonWords: new Set([
			"の",
			"に",
			"は",
			"を",
			"た",
			"が",
			"で",
			"て",
			"と",
			"し",
			"れ",
			"さ",
			"ある",
			"いる",
			"も",
			"する",
			"から",
			"な",
			"こと",
			" as ",
			"いう",
			"もの",
			"これ",
			"それ",
			"あれ",
			"どこ",
			"だれ",
			"なに",
			"なん",
			"どう",
			"人",
			"年",
			"日",
			"月",
			"時",
			"分",
			"秒",
			"円",
			"万",
			"億",
		]),
		bigrams: new Set(["の", "に", "は", "を", "た"]),
		trigrams: new Set(["の", "に", "は"]),
	},
	{
		language: "ko",
		characterRanges: [
			[0xac00, 0xd7af],
			[0x1100, 0x11ff],
		],
		commonWords: new Set([
			"하다",
			"있다",
			"되다",
			"없다",
			"이다",
			"않다",
			"그",
			"이",
			"다",
			"에",
			"를",
			"을",
			"가",
			"는",
			"은",
			"도",
			"의",
			"한",
			"부터",
			"까지",
			"에서",
			"으로",
			"에게",
			"한테",
			"께",
			"보다",
			"같이",
			"처럼",
			"만큼",
			"뿐",
			"사람",
			"것",
			"때",
			"년",
			"월",
			"일",
			"시",
			"분",
			"초",
			"원",
		]),
		bigrams: new Set(["하", "있", "되", "없", "이"]),
		trigrams: new Set(["하다", "있다", "되다"]),
	},
	{
		language: "pt",
		characterRanges: [
			[0x0041, 0x007a],
			[0x00c0, 0x00ff],
		],
		commonWords: new Set([
			"o",
			"a",
			"de",
			"que",
			"e",
			"do",
			"da",
			"em",
			"um",
			"para",
			"é",
			"com",
			"não",
			"uma",
			"os",
			"no",
			"se",
			"na",
			"por",
			"mais",
			"as",
			"dos",
			"como",
			"mas",
			"foi",
			"ao",
			"ele",
			"das",
			"tem",
			"à",
			"seu",
			"sua",
			"ou",
			"quando",
			"muito",
			"nos",
			"já",
			"está",
			"eu",
			"também",
			"só",
			"pelo",
			"pela",
			"até",
			"isso",
			"ela",
			"entre",
			"era",
			"depois",
			"sem",
			"sobre",
			"você",
			"são",
			"não",
			"então",
			"também",
			"ainda",
			"aqui",
			"hoje",
			"quero",
			"sair",
			"meu",
			"posso",
			"preciso",
			"poderia",
			"ajudar",
			"entender",
			"funciona",
			"fora",
			"tempo",
			"bonito",
			"passear",
			"aproveitar",
			"ensolarado",
			"acontecer",
			"continua",
			"persistente",
			"resolver",
			"dados",
			"banco",
			"pesquisar",
			"criar",
			"modernos",
			"recomendadas",
		]),
		bigrams: new Set([
			"os",
			"de",
			"em",
			"as",
			"do",
			"es",
			"ao",
			"da",
			"er",
			"ar",
			"ão",
			"çã",
			"nh",
			"lh",
			"ei",
			"ou",
			"ue",
			"re",
			"se",
			"te",
		]),
		trigrams: new Set([
			"que",
			"dos",
			"uma",
			"com",
			"par",
			"ent",
			"ais",
			"ção",
			"ões",
			"nho",
			"lho",
			"são",
			"não",
			"est",
			"nte",
			"men",
			"ade",
			"ido",
			"ara",
			"ode",
		]),
	},
	{
		language: "ru",
		characterRanges: [[0x0400, 0x04ff]],
		commonWords: new Set([
			"и",
			"в",
			"не",
			"на",
			"я",
			"что",
			"он",
			"с",
			"как",
			"а",
			"то",
			"все",
			"она",
			"так",
			"его",
			"но",
			"да",
			"ты",
			"к",
			"у",
			"же",
			"вы",
			"за",
			"бы",
			"по",
			"только",
			"её",
			"мне",
			"было",
			"вот",
			"от",
			"меня",
			"ещё",
			"нет",
			"о",
			"из",
			"ему",
			"теперь",
			"когда",
			"даже",
			"ну",
			"вдруг",
			"ли",
			"если",
			"уже",
			"или",
			"ни",
			"быть",
			"был",
			"него",
		]),
		bigrams: new Set([
			"ст",
			"но",
			"ен",
			"то",
			"ов",
			"на",
			"ер",
			"он",
			"ни",
			"ро",
		]),
		trigrams: new Set([
			"сто",
			"нов",
			"ени",
			"тов",
			"нос",
			"ров",
			"оло",
			"ера",
			"оль",
			"ова",
		]),
	},
	{
		language: "ar",
		characterRanges: [[0x0600, 0x06ff]],
		commonWords: new Set([
			"في",
			"من",
			"على",
			"إلى",
			"أن",
			"في",
			"هذا",
			"عن",
			"مع",
			"هو",
			"هي",
			"لا",
			"ما",
			"كان",
			"كانت",
			"ذا",
			"التي",
			"الذي",
			"هذه",
			"ذلك",
			"قد",
			"كل",
			"لم",
			"بين",
			"أما",
			"أو",
			"فيه",
			"هذا",
			"أن",
			"به",
			"حتى",
			"عند",
			"لقد",
			"أي",
			"ذلك",
			"ذالك",
			"الذين",
			"اللذين",
			"اللواتي",
			"اللائي",
		]),
		bigrams: new Set([
			"ال",
			"في",
			"من",
			"على",
			"إلى",
			"أن",
			"مع",
			"هذا",
			"ذلك",
			"هذه",
		]),
		trigrams: new Set(["الل", "في", "من", "على", "إلى"]),
	},
];

export class LanguageDetector {
	private readonly minTextLength = 3;

	detect(text: string): LanguageDetection {
		if (!text || text.length < this.minTextLength) {
			return {
				language: "unknown",
				confidence: 0,
				isEnglish: false,
				characterSets: [],
			};
		}

		const cleanText = text.toLowerCase().trim();
		const detectedSets = this.detectCharacterSets(cleanText);
		const scores = this.calculateLanguageScores(cleanText, detectedSets, cleanText);

		const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);

		if (sortedScores.length === 0 || sortedScores[0][1] === 0) {
			return {
				language: "unknown",
				confidence: 0,
				isEnglish: false,
				characterSets: detectedSets,
			};
		}

		const [topLanguage, topScore] = sortedScores[0];
		const [, secondScore] = sortedScores[1] || ["", 0];

		const confidence = this.calculateConfidence(topScore, secondScore);

		return {
			language: topLanguage as SupportedLanguage,
			confidence,
			isEnglish: topLanguage === "en",
			characterSets: detectedSets,
		};
	}

	private detectCharacterSets(text: string): string[] {
		const sets: string[] = [];

		if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(text)) sets.push("cjk-chinese");
		if (/[\u3040-\u309f]/.test(text)) sets.push("hiragana");
		if (/[\u30a0-\u30ff]/.test(text)) sets.push("katakana");
		if (/[\uac00-\ud7af\u1100-\u11ff]/.test(text)) sets.push("hangul");
		if (/[\u0400-\u04ff]/.test(text)) sets.push("cyrillic");
		if (/[\u0600-\u06ff]/.test(text)) sets.push("arabic");
		if (/[\u00c0-\u00ff]/.test(text)) sets.push("latin-extended");
		if (/^[\u0000-\u007f]*$/.test(text)) sets.push("ascii");

		return sets;
	}

	private calculateLanguageScores(
		text: string,
		charSets: string[],
		originalText?: string,
	): Record<string, number> {
		const scores: Record<string, number> = {};
		const words = text.split(/\s+/).filter((w) => w.length > 0);
		const bigrams = this.getNgrams(text, 2);
		const trigrams = this.getNgrams(text, 3);

		for (const pattern of LANGUAGE_PATTERNS) {
			let score = 0;

			const charSetMatch = this.matchCharacterSets(charSets, pattern, originalText);
			score += charSetMatch * 40;

			const wordMatches = words.filter((w) =>
				pattern.commonWords.has(w),
			).length;
			score += (wordMatches / Math.max(words.length, 1)) * 40;

			const bigramMatches = bigrams.filter((b) =>
				pattern.bigrams.has(b),
			).length;
			score += (bigramMatches / Math.max(bigrams.length, 1)) * 10;

			const trigramMatches = trigrams.filter((t) =>
				pattern.trigrams.has(t),
			).length;
			score += (trigramMatches / Math.max(trigrams.length, 1)) * 10;

			scores[pattern.language] = score;
		}

		return scores;
	}

	private matchCharacterSets(
		detected: string[],
		pattern: DetectionPattern,
		text?: string,
	): number {
		if (pattern.language === "zh") {
			return detected.includes("cjk-chinese") &&
				!detected.includes("hiragana") &&
				!detected.includes("katakana")
				? 1
				: 0;
		}
		if (pattern.language === "ja") {
			return detected.includes("hiragana") || detected.includes("katakana")
				? 1
				: 0;
		}
		if (pattern.language === "ko") {
			return detected.includes("hangul") ? 1 : 0;
		}
		if (pattern.language === "ru") {
			return detected.includes("cyrillic") ? 1 : 0;
		}
		if (pattern.language === "ar") {
			return detected.includes("arabic") ? 1 : 0;
		}

		if (detected.includes("ascii") || detected.includes("latin-extended")) {
			// Differentiate Latin-based languages by distinctive diacritics
			if (text) {
				if (pattern.language === "pt" && /[ãõ]/.test(text)) return 0.8;
				if (pattern.language === "es" && /[ñ¡¿]/.test(text)) return 0.8;
				if (pattern.language === "fr" && /[êèùœæ]/.test(text)) return 0.8;
				if (pattern.language === "de" && /[äöüß]/.test(text)) return 0.8;
			}
			return 0.5;
		}

		return 0;
	}

	private getNgrams(text: string, n: number): string[] {
		const cleanText = text.replace(/\s+/g, " ").toLowerCase();
		const ngrams: string[] = [];

		for (let i = 0; i <= cleanText.length - n; i++) {
			ngrams.push(cleanText.slice(i, i + n));
		}

		return ngrams;
	}

	private calculateConfidence(topScore: number, secondScore: number): number {
		if (topScore === 0) return 0;

		const gap = topScore - secondScore;
		const ratio = gap / topScore;

		const baseConfidence = Math.min(topScore / 100, 0.95);
		const adjustedConfidence = baseConfidence * (0.5 + ratio * 0.5);

		return Math.max(0, Math.min(1, adjustedConfidence));
	}

	isEnglish(text: string): boolean {
		const detection = this.detect(text);
		return detection.isEnglish && detection.confidence > 0.5;
	}

	getSupportedLanguages(): SupportedLanguage[] {
		return LANGUAGE_PATTERNS.map((p) => p.language);
	}
}

export const languageDetector = new LanguageDetector();
