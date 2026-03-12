export type EntityType =
	| "person"
	| "organization"
	| "location"
	| "concept"
	| "date"
	| "product";

export type RelationshipType =
	| "works_for"
	| "located_in"
	| "related_to"
	| "part_of"
	| "created_by"
	| "owns"
	| "knows"
	| "uses";

export interface Entity {
	id: string;
	text: string;
	type: EntityType;
	normalized: string;
	confidence: number;
	source: EntitySource;
	createdAt?: number;
	updatedAt?: number;
}

export interface EntitySource {
	type: "query" | "document" | "user" | "inferred";
	reference?: string;
	position?: {
		start: number;
		end: number;
	};
}

export interface Relationship {
	id: string;
	from: string;
	to: string;
	type: RelationshipType;
	confidence: number;
	evidence?: string[];
	weight?: number;
	createdAt?: number;
}

export interface GraphQuery {
	entityId?: string;
	entityType?: EntityType;
	text?: string;
	relationshipType?: RelationshipType;
	minConfidence?: number;
	maxDepth?: number;
	limit?: number;
}

export interface GraphPath {
	entities: Entity[];
	relationships: Relationship[];
	totalWeight: number;
}

export interface GraphStats {
	entityCount: number;
	relationshipCount: number;
	entityTypeDistribution: Record<EntityType, number>;
	relationshipTypeDistribution: Record<RelationshipType, number>;
	averageConnectivity: number;
}

export interface SerializedGraph {
	entities: Entity[];
	relationships: Relationship[];
	version: string;
	serializedAt: number;
}

export interface ExtractionResult {
	entities: Entity[];
	relationships: Relationship[];
	confidence: number;
	processingTimeMs: number;
}

export interface EntityPattern {
	pattern: RegExp;
	type: EntityType;
	normalizer?: (match: string) => string;
	confidence: number;
}

export interface RelationshipPattern {
	fromType: EntityType;
	toType: EntityType;
	relationshipType: RelationshipType;
	pattern: RegExp;
	confidence: number;
}

export interface KnowledgeGraphConfig {
	maxEntities?: number;
	maxRelationships?: number;
	minConfidence?: number;
	enableInference?: boolean;
}
