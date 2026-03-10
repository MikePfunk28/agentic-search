const DOMAIN_AUTHORITY_TIERS: Array<{
	pattern: RegExp;
	score: number;
	category: string;
}> = [
	{ pattern: /\.gov(\.[a-z]{2})?$/i, score: 0.95, category: "government" },
	{ pattern: /\.edu(\.[a-z]{2})?$/i, score: 0.95, category: "education" },
	{ pattern: /\.ac\.[a-z]{2}$/i, score: 0.93, category: "academic" },
	{ pattern: /wikipedia\.org$/i, score: 0.92, category: "encyclopedia" },
	{ pattern: /arxiv\.org$/i, score: 0.93, category: "academic" },
	{ pattern: /nature\.com$/i, score: 0.93, category: "academic" },
	{ pattern: /sciencedirect\.com$/i, score: 0.91, category: "academic" },
	{ pattern: /scholar\.google\.com$/i, score: 0.91, category: "academic" },
	{
		pattern: /pubmed\.ncbi\.nlm\.nih\.gov$/i,
		score: 0.94,
		category: "medical",
	},
	{ pattern: /nih\.gov$/i, score: 0.94, category: "medical" },
	{ pattern: /cdc\.gov$/i, score: 0.94, category: "medical" },
	{ pattern: /who\.int$/i, score: 0.94, category: "medical" },
	{ pattern: /reuters\.com$/i, score: 0.88, category: "news" },
	{ pattern: /apnews\.com$/i, score: 0.88, category: "news" },
	{ pattern: /bbc\.co\.uk$/i, score: 0.87, category: "news" },
	{ pattern: /bbc\.com$/i, score: 0.87, category: "news" },
	{ pattern: /nytimes\.com$/i, score: 0.86, category: "news" },
	{ pattern: /washingtonpost\.com$/i, score: 0.85, category: "news" },
	{ pattern: /theguardian\.com$/i, score: 0.85, category: "news" },
	{
		pattern: /docs\.[a-z]+\.(com|io|dev)$/i,
		score: 0.84,
		category: "documentation",
	},
	{
		pattern: /developer\.[a-z]+\.com$/i,
		score: 0.83,
		category: "documentation",
	},
	{ pattern: /github\.com$/i, score: 0.82, category: "code" },
	{ pattern: /stackoverflow\.com$/i, score: 0.83, category: "technical" },
	{ pattern: /mdn\.mozilla\.org$/i, score: 0.88, category: "documentation" },
	{ pattern: /microsoft\.com$/i, score: 0.82, category: "tech" },
	{ pattern: /cloud\.google\.com$/i, score: 0.83, category: "tech" },
	{ pattern: /aws\.amazon\.com$/i, score: 0.83, category: "tech" },
	{ pattern: /\.org$/i, score: 0.75, category: "organization" },
	{ pattern: /\.int$/i, score: 0.8, category: "international" },
	{ pattern: /\.(tk|ml|ga|cf|gq)$/i, score: 0.25, category: "suspicious-tld" },
	{
		pattern: /\.(buzz|click|link|top|win|bid)$/i,
		score: 0.35,
		category: "spam-tld",
	},
];

export function calculateDomainAuthority(url: string): number {
	if (!url) return 0.3;

	try {
		const parsed = new URL(url);
		const hostname = parsed.hostname.toLowerCase();

		for (const tier of DOMAIN_AUTHORITY_TIERS) {
			if (tier.pattern.test(hostname)) {
				return tier.score;
			}
		}

		let score = 0.5;
		if (parsed.protocol === "https:") score += 0.05;
		const domainParts = hostname.split(".");
		const mainDomain = domainParts.slice(-2).join(".");
		if (mainDomain.length <= 10) score += 0.05;
		if (domainParts.length > 3) score -= 0.05;
		if (/\.(com|net|io|dev|co)$/i.test(hostname)) score += 0.03;

		return Math.max(0.1, Math.min(0.8, score));
	} catch {
		return 0.3;
	}
}
