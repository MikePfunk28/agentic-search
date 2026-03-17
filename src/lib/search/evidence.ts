import type { SearchResult } from "../types";

export interface SearchEvidenceItem {
	resultId: string;
	title: string;
	url: string;
	snippet: string;
	provider: string;
	publishedDate?: string;
	domainAuthority: number;
	citationCount: number;
	addScore: number;
	evidenceScore: number;
	claims: string[];
}

export interface SearchEvidenceBundle {
	query: string;
	items: SearchEvidenceItem[];
	digest: string;
}

function normalizeWhitespace(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}

function splitIntoClaims(text: string): string[] {
	return text
		.split(/(?<=[.!?])\s+|\n+| \.\.\. /)
		.map((fragment) => normalizeWhitespace(fragment))
		.filter((fragment) => fragment.length >= 24);
}

function dedupeClaims(claims: string[]): string[] {
	const seen = new Set<string>();
	const unique: string[] = [];

	for (const claim of claims) {
		const normalized = claim.toLowerCase();
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		unique.push(claim);
	}

	return unique;
}

function computeEvidenceScore(result: SearchResult): number {
	const addScore = result.addScore ?? 0.5;
	const domainAuthority = result.domainAuthority ?? 0.5;
	const citationCount = Math.max(1, result.citationCount ?? 1);
	const citationScore = Math.min(1, citationCount / 3);
	const freshnessScore = result.publishedDate ? 1 : 0.4;

	return (
		addScore * 0.45 +
		domainAuthority * 0.25 +
		citationScore * 0.2 +
		freshnessScore * 0.1
	);
}

function extractEvidenceClaims(result: SearchResult): string[] {
	const titleClaim = normalizeWhitespace(result.title);
	const snippetClaims = splitIntoClaims(result.snippet || "");
	const claims = dedupeClaims(
		[titleClaim.length >= 24 ? titleClaim : "", ...snippetClaims].filter(
			Boolean,
		),
	);

	if (claims.length > 0) {
		return claims.slice(0, 3);
	}

	const fallback = normalizeWhitespace(`${result.title}. ${result.snippet}`);
	return fallback ? [fallback.slice(0, 240)] : [];
}

function formatEvidenceItem(item: SearchEvidenceItem, index: number): string {
	const claimsText =
		item.claims.length > 0
			? item.claims.map((claim) => `- ${claim}`).join("\n")
			: "- No structured claims extracted";

	return [
		`[${index + 1}] resultId=${item.resultId}`,
		`title: ${item.title}`,
		`url: ${item.url}`,
		`provider: ${item.provider}`,
		`authority: ${item.domainAuthority.toFixed(2)}`,
		`citations: ${item.citationCount}`,
		item.publishedDate ? `published: ${item.publishedDate}` : null,
		`snippet: ${item.snippet}`,
		"claims:",
		claimsText,
	]
		.filter(Boolean)
		.join("\n");
}

export function buildSearchEvidence(
	query: string,
	results: SearchResult[],
	limit = 8,
): SearchEvidenceBundle {
	const items = [...results]
		.sort((left, right) => {
			const rightScore = computeEvidenceScore(right);
			const leftScore = computeEvidenceScore(left);
			return rightScore - leftScore;
		})
		.slice(0, limit)
		.map((result) => {
			const evidenceScore = computeEvidenceScore(result);
			return {
				resultId: result.id,
				title: result.title,
				url: result.url,
				snippet: normalizeWhitespace(result.snippet || "").slice(0, 400),
				provider: result.provider || result.source || "web",
				publishedDate: result.publishedDate,
				domainAuthority: result.domainAuthority ?? 0.5,
				citationCount: result.citationCount ?? 1,
				addScore: result.addScore ?? 0.5,
				evidenceScore,
				claims: extractEvidenceClaims(result),
			} satisfies SearchEvidenceItem;
		});

	return {
		query,
		items,
		digest: items
			.map((item, index) => formatEvidenceItem(item, index))
			.join("\n\n"),
	};
}

export function buildEvidenceVerificationPrompt(
	query: string,
	evidence: SearchEvidenceBundle,
	role: "validator" | "reasoner" | "synthesizer" | "orchestrator",
): string {
	const roleInstructionMap = {
		validator:
			"Be strict. Reject claims that are not directly supported by the evidence. Prefer fewer, stronger claims.",
		reasoner:
			"Connect the evidence carefully. Explain only what can be supported by the retrieved results.",
		synthesizer:
			"Write a concise supported answer using only the strongest evidence items and cite result IDs.",
		orchestrator:
			"Summarize the best-supported answer, surface uncertainty, and highlight conflicts or missing evidence.",
	} as const;

	return `You are verifying a search answer using retrieved evidence only.

Query: ${query}
Role: ${role}
Instruction: ${roleInstructionMap[role]}

Rules:
1. Use only the evidence items below.
2. Every factual claim must cite one or more resultIds from the evidence.
3. If evidence is weak or incomplete, say so.
4. Do not invent URLs, titles, sources, or facts.
5. Return strict JSON only.

Return this JSON shape:
{
  "answer": "short evidence-grounded answer",
  "verdict": "supported|mixed|insufficient",
  "supportedResultIds": ["result-id"],
  "agreedClaims": [
    { "claim": "supported claim", "resultIds": ["result-id"] }
  ],
  "contradictions": [
    { "claim": "claim with conflict or ambiguity", "resultIds": ["result-id"] }
  ],
  "openQuestions": ["what is still unverified"]
}

Evidence:
${evidence.digest}`;
}
