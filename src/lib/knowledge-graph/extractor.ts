import type {
	Entity,
	EntityPattern,
	EntitySource,
	EntityType,
	ExtractionResult,
	Relationship,
	RelationshipPattern,
} from "./types";

const TECH_ENTITY_PATTERNS: EntityPattern[] = [
	{
		pattern:
			/\b(react|vue|angular|svelte|next\.js|nuxt|gatsby|astro|remix|tanstack)\b/gi,
		type: "product",
		normalizer: (m) => m.toLowerCase().replace(".js", ""),
		confidence: 0.95,
	},
	{
		pattern:
			/\b(typescript|javascript|python|rust|go|java|kotlin|swift|ruby|php|scala|elixir|haskell)\b/gi,
		type: "concept",
		normalizer: (m) => m.toLowerCase(),
		confidence: 0.95,
	},
	{
		pattern: /C\+\+/gi,
		type: "concept",
		normalizer: () => "c++",
		confidence: 0.95,
	},
	{
		pattern: /C#/gi,
		type: "concept",
		normalizer: () => "c#",
		confidence: 0.95,
	},
	{
		pattern:
			/\b(openai|anthropic|google|meta|microsoft|amazon|apple|netflix|uber|airbnb|stripe|vercel|cloudflare|docker|kubernetes|aws|azure|gcp|facebook|twitter|linkedin|github|gitlab)\b/gi,
		type: "organization",
		normalizer: (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase(),
		confidence: 0.9,
	},
	{
		pattern:
			/\b(chatgpt|gpt-4|gpt-4o|gpt-3\.5|claude|gemini|llama|mistral|deepseek|codex|dall-e|midjourney)\b/gi,
		type: "product",
		normalizer: (m) => m.toUpperCase(),
		confidence: 0.95,
	},
	{
		pattern: /\b(api|rest|graphql|grpc|websocket|http|https|json|xml|yaml)\b/gi,
		type: "concept",
		normalizer: (m) => m.toUpperCase(),
		confidence: 0.85,
	},
	{
		pattern:
			/\b(new york|san francisco|london|tokyo|paris|berlin|singapore|sydney|seattle|boston|chicago|los angeles|beijing|shanghai)\b/gi,
		type: "location",
		normalizer: (m) =>
			m
				.split(" ")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
				.join(" "),
		confidence: 0.8,
	},
	{
		pattern: /\b(\d{4}-\d{2}-\d{2})\b/g,
		type: "date",
		normalizer: (m) => m,
		confidence: 0.9,
	},
	{
		pattern: /\b(\d{2}\/\d{2}\/\d{4})\b/g,
		type: "date",
		normalizer: (m) => {
			const parts = m.split("/");
			return `${parts[2]}-${parts[0]}-${parts[1]}`;
		},
		confidence: 0.85,
	},
	{
		pattern:
			/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b/gi,
		type: "date",
		normalizer: (m) => m,
		confidence: 0.9,
	},
];

const ORGANIZATION_SUFFIXES = [
	"Inc",
	"Corp",
	"LLC",
	"Ltd",
	"Company",
	"Co",
	"Foundation",
	"Institute",
	"University",
	"Lab",
	"Labs",
];

const PERSON_PATTERNS: EntityPattern[] = [
	{
		pattern: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
		type: "person",
		normalizer: (m) => m,
		confidence: 0.5,
	},
];

const RELATIONSHIP_PATTERNS: RelationshipPattern[] = [
	{
		fromType: "person",
		toType: "organization",
		relationshipType: "works_for",
		pattern:
			/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+(?:works?\s+(?:at|for)|joined|is\s+(?:at|with))\s+([A-Z][a-zA-Z]+(?:\s+(?:Inc|Corp|LLC|Ltd|Company|Co|Labs?))?)\b/gi,
		confidence: 0.8,
	},
	{
		fromType: "product",
		toType: "organization",
		relationshipType: "created_by",
		pattern:
			/\b([a-zA-Z-]+)\s+(?:was\s+)?(?:created\s+by|developed\s+by|built\s+by|made\s+by)\s+([A-Z][a-zA-Z]+)\b/gi,
		confidence: 0.75,
	},
	{
		fromType: "product",
		toType: "product",
		relationshipType: "related_to",
		pattern:
			/\b([a-zA-Z-]+)\s+(?:vs|versus|compared\s+to|alternative\s+to)\s+([a-zA-Z-]+)\b/gi,
		confidence: 0.7,
	},
	{
		fromType: "concept",
		toType: "product",
		relationshipType: "uses",
		pattern:
			/\b([a-zA-Z+]+)\s+(?:using|built\s+with|powered\s+by|written\s+in)\s+([a-zA-Z-]+)\b/gi,
		confidence: 0.75,
	},
	{
		fromType: "product",
		toType: "location",
		relationshipType: "located_in",
		pattern:
			/\b([A-Z][a-zA-Z]+)\s+(?:headquarters?\s+(?:in|at)|based\s+in|located\s+in)\s+([A-Z][a-zA-Z\s]+)\b/gi,
		confidence: 0.8,
	},
	{
		fromType: "person",
		toType: "person",
		relationshipType: "knows",
		pattern:
			/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+(?:knows|worked\s+with|collaborated\s+with|co-founded\s+with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/gi,
		confidence: 0.7,
	},
];

const STOP_WORDS = new Set([
	"the",
	"a",
	"an",
	"is",
	"are",
	"was",
	"were",
	"be",
	"been",
	"being",
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
	"how",
	"when",
	"where",
	"why",
	"if",
	"then",
	"else",
	"so",
	"just",
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
]);

export class EntityExtractor {
	private entityPatterns: EntityPattern[];
	private relationshipPatterns: RelationshipPattern[];
	private entityIdCounter: number = 0;
	private relationshipIdCounter: number = 0;

	constructor(
		customEntityPatterns?: EntityPattern[],
		customRelationshipPatterns?: RelationshipPattern[],
	) {
		this.entityPatterns = [...TECH_ENTITY_PATTERNS, ...PERSON_PATTERNS];
		if (customEntityPatterns) {
			this.entityPatterns.push(...customEntityPatterns);
		}

		this.relationshipPatterns = [...RELATIONSHIP_PATTERNS];
		if (customRelationshipPatterns) {
			this.relationshipPatterns.push(...customRelationshipPatterns);
		}
	}

	async extract(
		text: string,
		source?: Partial<EntitySource>,
	): Promise<ExtractionResult> {
		const startTime = Date.now();
		const entities: Entity[] = [];
		const relationships: Relationship[] = [];
		const entityMap = new Map<string, Entity>();

		const extractedEntities = await this.extractEntities(text, source);
		for (const entity of extractedEntities) {
			const key = `${entity.type}:${entity.normalized}`;
			if (!entityMap.has(key)) {
				entityMap.set(key, entity);
				entities.push(entity);
			}
		}

		const extractedRelationships = await this.extractRelationships(
			text,
			entities,
		);
		relationships.push(...extractedRelationships);

		const avgConfidence =
			entities.length > 0
				? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length
				: 0;

		return {
			entities,
			relationships,
			confidence: avgConfidence,
			processingTimeMs: Date.now() - startTime,
		};
	}

	private async extractEntities(
		text: string,
		source?: Partial<EntitySource>,
	): Promise<Entity[]> {
		const entities: Entity[] = [];
		const usedPositions = new Set<number>();

		for (const pattern of this.entityPatterns) {
			const matches = text.matchAll(pattern.pattern);

			for (const match of matches) {
				if (match.index === undefined) continue;

				const startPos = match.index;
				const endPos = startPos + match[0].length;

				let overlaps = false;
				for (const pos of usedPositions) {
					if (pos >= startPos && pos < endPos) {
						overlaps = true;
						break;
					}
				}
				if (overlaps) continue;

				for (let i = startPos; i < endPos; i++) {
					usedPositions.add(i);
				}

				const entityText = match[0];
				const normalized = pattern.normalizer
					? pattern.normalizer(entityText)
					: entityText.toLowerCase();

				const entity: Entity = {
					id: this.generateEntityId(),
					text: entityText,
					type: pattern.type,
					normalized,
					confidence: pattern.confidence,
					source: {
						type: source?.type ?? "query",
						reference: source?.reference,
						position: { start: startPos, end: endPos },
					},
				};

				entities.push(entity);
			}
		}

		await this.extractOrganizations(text, entities, usedPositions, source);
		await this.extractProductNames(text, entities, usedPositions, source);

		return entities;
	}

	private async extractOrganizations(
		text: string,
		entities: Entity[],
		usedPositions: Set<number>,
		source?: Partial<EntitySource>,
	): Promise<void> {
		const suffixPattern = new RegExp(
			`\\b([A-Z][a-zA-Z]*(?:\\s+[A-Z][a-zA-Z]+)*)\\s+(?:${ORGANIZATION_SUFFIXES.join("|")})\\b`,
			"g",
		);

		const matches = text.matchAll(suffixPattern);
		for (const match of matches) {
			if (match.index === undefined) continue;

			const startPos = match.index;
			const endPos = startPos + match[0].length;

			let overlaps = false;
			for (const pos of usedPositions) {
				if (pos >= startPos && pos < endPos) {
					overlaps = true;
					break;
				}
			}
			if (overlaps) continue;

			for (let i = startPos; i < endPos; i++) {
				usedPositions.add(i);
			}

			const entityText = match[0];
			const normalized = entityText
				.split(" ")
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
				.join(" ");

			const entity: Entity = {
				id: this.generateEntityId(),
				text: entityText,
				type: "organization",
				normalized,
				confidence: 0.85,
				source: {
					type: source?.type ?? "query",
					reference: source?.reference,
					position: { start: startPos, end: endPos },
				},
			};

			entities.push(entity);
		}
	}

	private async extractProductNames(
		text: string,
		entities: Entity[],
		usedPositions: Set<number>,
		source?: Partial<EntitySource>,
	): Promise<void> {
		const productIndicators = [
			"app",
			"application",
			"platform",
			"service",
			"tool",
			"software",
			"framework",
			"library",
			"package",
			"module",
			"extension",
			"plugin",
		];

		const pattern = new RegExp(
			`\\b([A-Z][a-zA-Z0-9]*(?:\\s+[a-z]+)?)\\s+(?:${productIndicators.join("|")})\\b`,
			"g",
		);

		const matches = text.matchAll(pattern);
		for (const match of matches) {
			if (match.index === undefined) continue;

			const startPos = match.index;
			const endPos = startPos + match[0].length;

			let overlaps = false;
			for (const pos of usedPositions) {
				if (pos >= startPos && pos < endPos) {
					overlaps = true;
					break;
				}
			}
			if (overlaps) continue;

			for (let i = startPos; i < endPos; i++) {
				usedPositions.add(i);
			}

			const productName = match[1];
			if (STOP_WORDS.has(productName.toLowerCase())) continue;

			const normalized =
				productName.charAt(0).toUpperCase() +
				productName.slice(1).toLowerCase();

			const entity: Entity = {
				id: this.generateEntityId(),
				text: match[0],
				type: "product",
				normalized,
				confidence: 0.7,
				source: {
					type: source?.type ?? "query",
					reference: source?.reference,
					position: { start: startPos, end: endPos },
				},
			};

			entities.push(entity);
		}
	}

	private async extractRelationships(
		text: string,
		entities: Entity[],
	): Promise<Relationship[]> {
		const relationships: Relationship[] = [];

		for (const pattern of RELATIONSHIP_PATTERNS) {
			const matches = text.matchAll(pattern.pattern);

			for (const match of matches) {
				const fromText = match[1];
				const toText = match[2];

				const fromEntity = this.findMatchingEntity(
					fromText,
					entities,
					pattern.fromType,
				);
				const toEntity = this.findMatchingEntity(
					toText,
					entities,
					pattern.toType,
				);

				if (fromEntity && toEntity) {
					const relationship: Relationship = {
						id: this.generateRelationshipId(),
						from: fromEntity.id,
						to: toEntity.id,
						type: pattern.relationshipType,
						confidence: pattern.confidence,
						evidence: [match[0]],
					};

					relationships.push(relationship);
				}
			}
		}

		await this.inferRelatedRelationships(entities, relationships);

		return relationships;
	}

	private findMatchingEntity(
		text: string,
		entities: Entity[],
		type: EntityType,
	): Entity | undefined {
		const normalized = text.toLowerCase();
		return entities.find(
			(e) =>
				e.type === type &&
				(e.normalized.toLowerCase() === normalized ||
					e.text.toLowerCase() === normalized),
		);
	}

	private async inferRelatedRelationships(
		entities: Entity[],
		relationships: Relationship[],
	): Promise<void> {
		const concepts = entities.filter((e) => e.type === "concept");
		const products = entities.filter((e) => e.type === "product");

		for (const concept of concepts) {
			for (const product of products) {
				const existingRel = relationships.find(
					(r) =>
						(r.from === concept.id && r.to === product.id) ||
						(r.from === product.id && r.to === concept.id),
				);

				if (!existingRel) {
					relationships.push({
						id: this.generateRelationshipId(),
						from: concept.id,
						to: product.id,
						type: "related_to",
						confidence: 0.4,
						evidence: ["Inferred from co-occurrence"],
					});
				}
			}
		}
	}

	private generateEntityId(): string {
		return `entity_${Date.now()}_${++this.entityIdCounter}`;
	}

	private generateRelationshipId(): string {
		return `rel_${Date.now()}_${++this.relationshipIdCounter}`;
	}

	addEntityPattern(pattern: EntityPattern): void {
		this.entityPatterns.push(pattern);
	}

	addRelationshipPattern(pattern: RelationshipPattern): void {
		this.relationshipPatterns.push(pattern);
	}

	normalizeEntityName(text: string, type: EntityType): string {
		switch (type) {
			case "organization":
				return text
					.split(/[\s-]+/)
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
					.join(" ");
			case "product":
			case "concept":
				return text.toLowerCase().replace(/[\s-]+/g, "-");
			case "location":
				return text
					.split(" ")
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
					.join(" ");
			case "person":
				return text.trim();
			case "date":
				return text;
			default:
				return text.toLowerCase();
		}
	}

	calculateConfidence(
		text: string,
		entityType: EntityType,
		matchCount: number,
	): number {
		let confidence = 0.5;

		switch (entityType) {
			case "product":
				if (/^[A-Z]/.test(text)) confidence += 0.2;
				if (text.includes("-")) confidence += 0.1;
				break;
			case "organization":
				if (/[A-Z][a-z]+\s+[A-Z]/.test(text)) confidence += 0.15;
				break;
			case "person":
				if (/^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(text)) confidence += 0.3;
				break;
			case "date":
				if (/^\d{4}-\d{2}-\d{2}$/.test(text)) confidence += 0.4;
				break;
			case "location":
				if (/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/.test(text)) confidence += 0.2;
				break;
		}

		confidence += Math.min(matchCount * 0.05, 0.2);

		return Math.min(confidence, 1.0);
	}
}

export const createEntityExtractor = (
	customEntityPatterns?: EntityPattern[],
	customRelationshipPatterns?: RelationshipPattern[],
): EntityExtractor => {
	return new EntityExtractor(customEntityPatterns, customRelationshipPatterns);
};
