import type { ComplexityAnalysis, QueryComplexity } from "./types";

const MULTI_STEP_INDICATORS = [
	"then",
	"after that",
	"next",
	"finally",
	"step by step",
	"first",
	"second",
	"third",
	"lastly",
	"subsequently",
	"meanwhile",
	"before",
	"once",
	"when done",
	"and then",
	"followed by",
	"additionally",
	"furthermore",
	"moreover",
	"also need to",
	"need to also",
	"must also",
];

const CODE_INDICATORS = [
	"code",
	"function",
	"class",
	"method",
	"variable",
	"algorithm",
	"implement",
	"write a program",
	"write a script",
	"debug",
	"fix the bug",
	"syntax",
	"compile",
	"runtime",
	"api",
	"endpoint",
	"library",
	"package",
	"module",
	"import",
	"export",
	"typescript",
	"javascript",
	"python",
	"rust",
	"golang",
	"java",
	"c++",
	"react",
	"vue",
	"angular",
	"node",
	"express",
	"sql",
	"query",
	"database",
	"recursion",
	"iteration",
	"loop",
	"array",
	"object",
	"interface",
	"type definition",
];

const CREATIVE_INDICATORS = [
	"write a story",
	"write a poem",
	"creative",
	"imagine",
	"fiction",
	"narrative",
	"character",
	"plot",
	"dialogue",
	"scene",
	"screenplay",
	"script for",
	"lyrics",
	"song",
	"joke",
	"humor",
	"satire",
	"metaphor",
	"analogy",
	"brainstorm",
	"ideate",
	"invent",
	"design a",
	"create a",
	"compose",
	"original",
];

const TECHNICAL_TERMS = [
	"architecture",
	"scalability",
	"performance",
	"optimization",
	"security",
	"authentication",
	"authorization",
	"encryption",
	"decryption",
	"distributed",
	"microservices",
	"kubernetes",
	"docker",
	"container",
	"orchestration",
	"load balancing",
	"caching",
	"database",
	"indexing",
	"sharding",
	"replication",
	"consistency",
	"availability",
	"partition",
	"latency",
	"throughput",
	"bandwidth",
	"concurrency",
	"parallelism",
	"asynchronous",
	"synchronous",
	"mutex",
	"semaphore",
	"deadlock",
	"race condition",
	"memory leak",
	"garbage collection",
	"heap",
	"stack",
	"pointer",
	"reference",
	"garbage",
	"serialization",
	"deserialization",
	"compression",
	"encoding",
	"decoding",
	"hashing",
	"checksum",
	"validation",
	"verification",
	"integration",
	"deployment",
	"pipeline",
	"ci/cd",
	"testing",
	"unit test",
	"integration test",
	"e2e",
	"mock",
	"stub",
	"spy",
];

const COMPLEX_QUESTION_INDICATORS = [
	"why",
	"how does",
	"explain in detail",
	"compare and contrast",
	"analyze",
	"evaluate",
	"critique",
	"synthesize",
	"derive",
	"prove",
	"demonstrate",
	"justify",
	"argue",
	"debate",
	"pros and cons",
	"advantages and disadvantages",
	"implications",
	"consequences",
	"trade-offs",
	"relationship between",
	"correlation",
	"causation",
	"impact of",
	"effect of",
	"underlying",
	"fundamental",
	"theoretical",
	"conceptual",
	"abstract",
	"philosophical",
	"ethical",
	"moral",
];

export class QueryComplexityAnalyzer {
	private customMultiStepIndicators: string[] = [];
	private customCodeIndicators: string[] = [];
	private customCreativeIndicators: string[] = [];

	addMultiStepIndicator(indicator: string): void {
		this.customMultiStepIndicators.push(indicator.toLowerCase());
	}

	addCodeIndicator(indicator: string): void {
		this.customCodeIndicators.push(indicator.toLowerCase());
	}

	addCreativeIndicator(indicator: string): void {
		this.customCreativeIndicators.push(indicator.toLowerCase());
	}

	analyze(query: string): ComplexityAnalysis {
		const normalizedQuery = query.toLowerCase().trim();

		const factors = {
			length: this.analyzeLength(normalizedQuery),
			hasMultiStepReasoning: this.detectMultiStepReasoning(normalizedQuery),
			hasCodeGeneration: this.detectCodeGeneration(normalizedQuery),
			hasCreativeWriting: this.detectCreativeWriting(normalizedQuery),
			technicalTerms: this.countTechnicalTerms(normalizedQuery),
			questionComplexity: this.analyzeQuestionComplexity(normalizedQuery),
		};

		const score = this.calculateComplexityScore(factors);
		const classification = this.classifyComplexity(score);
		const confidence = this.calculateConfidence(factors, score);

		return {
			score,
			classification,
			factors,
			confidence,
		};
	}

	private analyzeLength(query: string): number {
		const wordCount = query.split(/\s+/).filter((w) => w.length > 0).length;
		if (wordCount <= 10) return 0.1;
		if (wordCount <= 25) return 0.3;
		if (wordCount <= 50) return 0.5;
		if (wordCount <= 100) return 0.7;
		return 0.9;
	}

	private detectMultiStepReasoning(query: string): boolean {
		const allIndicators = [
			...MULTI_STEP_INDICATORS,
			...this.customMultiStepIndicators,
		];

		const matches = allIndicators.filter((indicator) =>
			query.includes(indicator),
		).length;

		return matches >= 2;
	}

	private detectCodeGeneration(query: string): boolean {
		const allIndicators = [...CODE_INDICATORS, ...this.customCodeIndicators];

		return allIndicators.some((indicator) => query.includes(indicator));
	}

	private detectCreativeWriting(query: string): boolean {
		const allIndicators = [
			...CREATIVE_INDICATORS,
			...this.customCreativeIndicators,
		];

		return allIndicators.some((indicator) => query.includes(indicator));
	}

	private countTechnicalTerms(query: string): number {
		const words = query.split(/\s+/);
		let count = 0;

		for (const term of TECHNICAL_TERMS) {
			if (query.includes(term)) {
				count++;
			}
		}

		for (const word of words) {
			if (word.match(/^[A-Z]{2,}$/)) {
				count++;
			}
		}

		return Math.min(count / 10, 1);
	}

	private analyzeQuestionComplexity(query: string): number {
		let complexity = 0;

		for (const indicator of COMPLEX_QUESTION_INDICATORS) {
			if (query.includes(indicator)) {
				complexity += 0.15;
			}
		}

		const questionMarks = (query.match(/\?/g) || []).length;
		complexity += Math.min(questionMarks * 0.1, 0.3);

		const hasMultipleClauses =
			query.includes(" and ") ||
			query.includes(" or ") ||
			query.includes(" but ") ||
			query.includes(" however ");
		if (hasMultipleClauses) {
			complexity += 0.15;
		}

		return Math.min(complexity, 1);
	}

	private calculateComplexityScore(
		factors: ComplexityAnalysis["factors"],
	): number {
		const weights = {
			length: 0.1,
			hasMultiStepReasoning: 0.25,
			hasCodeGeneration: 0.2,
			hasCreativeWriting: 0.15,
			technicalTerms: 0.15,
			questionComplexity: 0.15,
		};

		let score = 0;
		score += factors.length * weights.length;
		score +=
			(factors.hasMultiStepReasoning ? 1 : 0) * weights.hasMultiStepReasoning;
		score += (factors.hasCodeGeneration ? 1 : 0) * weights.hasCodeGeneration;
		score += (factors.hasCreativeWriting ? 1 : 0) * weights.hasCreativeWriting;
		score += factors.technicalTerms * weights.technicalTerms;
		score += factors.questionComplexity * weights.questionComplexity;

		return Math.min(Math.max(score, 0), 1);
	}

	private classifyComplexity(score: number): QueryComplexity {
		if (score < 0.35) return "simple";
		if (score < 0.65) return "moderate";
		return "complex";
	}

	private calculateConfidence(
		factors: ComplexityAnalysis["factors"],
		score: number,
	): number {
		let confidence = 0.5;

		const strongSignals = [
			factors.hasMultiStepReasoning,
			factors.hasCodeGeneration,
			factors.hasCreativeWriting,
		].filter(Boolean).length;

		confidence += strongSignals * 0.15;

		if (factors.technicalTerms > 0.5) {
			confidence += 0.1;
		}

		if (factors.questionComplexity > 0.5) {
			confidence += 0.1;
		}

		if (score < 0.2 || score > 0.8) {
			confidence += 0.1;
		}

		return Math.min(confidence, 1);
	}

	isSimpleQuery(query: string): boolean {
		return this.analyze(query).classification === "simple";
	}

	isComplexQuery(query: string): boolean {
		return this.analyze(query).classification === "complex";
	}

	getRecommendedModelTier(
		analysis: ComplexityAnalysis,
	): "local" | "cheap" | "capable" {
		switch (analysis.classification) {
			case "simple":
				return "local";
			case "moderate":
				return "cheap";
			case "complex":
				return "capable";
		}
	}
}

export const queryComplexityAnalyzer = new QueryComplexityAnalyzer();
