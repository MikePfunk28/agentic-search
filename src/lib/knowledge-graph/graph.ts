import type {
	Entity,
	EntityType,
	GraphPath,
	GraphQuery,
	GraphStats,
	KnowledgeGraphConfig,
	Relationship,
	RelationshipType,
	SerializedGraph,
} from "./types";

export class KnowledgeGraph {
	private entities: Map<string, Entity> = new Map();
	private relationships: Map<string, Relationship> = new Map();
	private adjacencyList: Map<string, Set<string>> = new Map();
	private reverseAdjacency: Map<string, Set<string>> = new Map();
	private entityTypeIndex: Map<EntityType, Set<string>> = new Map();
	private relationshipTypeIndex: Map<RelationshipType, Set<string>> = new Map();
	private config: Required<KnowledgeGraphConfig>;

	private static readonly DEFAULT_CONFIG: Required<KnowledgeGraphConfig> = {
		maxEntities: 10000,
		maxRelationships: 50000,
		minConfidence: 0.5,
		enableInference: true,
	};

	constructor(config?: KnowledgeGraphConfig) {
		this.config = { ...KnowledgeGraph.DEFAULT_CONFIG, ...config };
		this.initializeIndexes();
	}

	private initializeIndexes(): void {
		const entityTypes: EntityType[] = [
			"person",
			"organization",
			"location",
			"concept",
			"date",
			"product",
		];
		const relationshipTypes: RelationshipType[] = [
			"works_for",
			"located_in",
			"related_to",
			"part_of",
			"created_by",
			"owns",
			"knows",
			"uses",
		];

		for (const type of entityTypes) {
			this.entityTypeIndex.set(type, new Set());
		}
		for (const type of relationshipTypes) {
			this.relationshipTypeIndex.set(type, new Set());
		}
	}

	async addEntity(entity: Entity): Promise<Entity> {
		if (this.entities.size >= this.config.maxEntities) {
			this.evictLeastConnectedEntities(1);
		}

		const existingEntity = this.findDuplicateEntity(entity);
		if (existingEntity) {
			return this.mergeEntities(existingEntity, entity);
		}

		const entityWithTimestamp: Entity = {
			...entity,
			createdAt: entity.createdAt ?? Date.now(),
			updatedAt: Date.now(),
		};

		this.entities.set(entity.id, entityWithTimestamp);
		this.adjacencyList.set(entity.id, new Set());
		this.reverseAdjacency.set(entity.id, new Set());
		this.entityTypeIndex.get(entity.type)?.add(entity.id);

		return entityWithTimestamp;
	}

	private findDuplicateEntity(entity: Entity): Entity | undefined {
		for (const [, existing] of this.entities) {
			if (
				existing.type === entity.type &&
				existing.normalized.toLowerCase() === entity.normalized.toLowerCase()
			) {
				return existing;
			}
		}
		return undefined;
	}

	private mergeEntities(existing: Entity, newEntity: Entity): Entity {
		const merged: Entity = {
			...existing,
			confidence: Math.max(existing.confidence, newEntity.confidence),
			updatedAt: Date.now(),
		};

		if (
			newEntity.source.type === "document" &&
			existing.source.type !== "document"
		) {
			merged.source = newEntity.source;
		}

		this.entities.set(existing.id, merged);
		return merged;
	}

	async addRelationship(relationship: Relationship): Promise<Relationship> {
		if (
			!this.entities.has(relationship.from) ||
			!this.entities.has(relationship.to)
		) {
			throw new Error(`Cannot create relationship: entity not found`);
		}

		if (this.relationships.size >= this.config.maxRelationships) {
			this.evictLowestConfidenceRelationships(1);
		}

		const existingRel = this.findDuplicateRelationship(relationship);
		if (existingRel) {
			return this.mergeRelationships(existingRel, relationship);
		}

		const relWithTimestamp: Relationship = {
			...relationship,
			createdAt: relationship.createdAt ?? Date.now(),
			weight: relationship.weight ?? 1,
		};

		this.relationships.set(relWithTimestamp.id, relWithTimestamp);
		this.adjacencyList.get(relationship.from)?.add(relationship.to);
		this.reverseAdjacency.get(relationship.to)?.add(relationship.from);
		this.relationshipTypeIndex.get(relationship.type)?.add(relWithTimestamp.id);

		return relWithTimestamp;
	}

	private findDuplicateRelationship(
		rel: Relationship,
	): Relationship | undefined {
		for (const [, existing] of this.relationships) {
			if (
				existing.from === rel.from &&
				existing.to === rel.to &&
				existing.type === rel.type
			) {
				return existing;
			}
		}
		return undefined;
	}

	private mergeRelationships(
		existing: Relationship,
		newRel: Relationship,
	): Relationship {
		const merged: Relationship = {
			...existing,
			confidence: Math.max(existing.confidence, newRel.confidence),
			weight: (existing.weight ?? 1) + (newRel.weight ?? 1),
			evidence: [
				...(existing.evidence ?? []),
				...(newRel.evidence ?? []),
			].slice(0, 10),
			createdAt: existing.createdAt,
		};

		this.relationships.set(existing.id, merged);
		return merged;
	}

	async getEntity(id: string): Promise<Entity | undefined> {
		return this.entities.get(id);
	}

	async getRelationship(id: string): Promise<Relationship | undefined> {
		return this.relationships.get(id);
	}

	async findPath(
		fromId: string,
		toId: string,
		maxDepth: number = 5,
	): Promise<GraphPath[]> {
		if (!this.entities.has(fromId) || !this.entities.has(toId)) {
			return [];
		}

		if (fromId === toId) {
			const entity = this.entities.get(fromId)!;
			return [{ entities: [entity], relationships: [], totalWeight: 0 }];
		}

		const paths: GraphPath[] = [];
		const queue: Array<{
			currentId: string;
			visited: Set<string>;
			entities: Entity[];
			relationships: Relationship[];
			totalWeight: number;
		}> = [
			{
				currentId: fromId,
				visited: new Set([fromId]),
				entities: [this.entities.get(fromId)!],
				relationships: [],
				totalWeight: 0,
			},
		];

		while (queue.length > 0 && paths.length < 10) {
			const current = queue.shift()!;

			if (current.visited.size >= maxDepth) continue;

			const neighbors = this.adjacencyList.get(current.currentId);
			if (!neighbors) continue;

			for (const neighborId of neighbors) {
				if (current.visited.has(neighborId)) continue;

				const neighborEntity = this.entities.get(neighborId);
				if (!neighborEntity) continue;

				const rel = this.findRelationshipBetween(current.currentId, neighborId);
				if (!rel) continue;

				const newPath = {
					currentId: neighborId,
					visited: new Set([...current.visited, neighborId]),
					entities: [...current.entities, neighborEntity],
					relationships: [...current.relationships, rel],
					totalWeight: current.totalWeight + (1 - (rel.weight ?? 1)),
				};

				if (neighborId === toId) {
					paths.push({
						entities: newPath.entities,
						relationships: newPath.relationships,
						totalWeight: newPath.totalWeight,
					});
				} else {
					queue.push(newPath);
				}
			}
		}

		return paths.sort((a, b) => a.totalWeight - b.totalWeight);
	}

	private findRelationshipBetween(
		fromId: string,
		toId: string,
	): Relationship | undefined {
		for (const [, rel] of this.relationships) {
			if (rel.from === fromId && rel.to === toId) {
				return rel;
			}
		}
		return undefined;
	}

	async getRelated(
		entityId: string,
		options?: GraphQuery,
	): Promise<{ entities: Entity[]; relationships: Relationship[] }> {
		const entity = this.entities.get(entityId);
		if (!entity) {
			return { entities: [], relationships: [] };
		}

		const relatedEntities: Entity[] = [];
		const relatedRelationships: Relationship[] = [];
		const visited = new Set<string>([entityId]);

		const outgoing = this.adjacencyList.get(entityId);
		const incoming = this.reverseAdjacency.get(entityId);

		const processNeighbor = (neighborId: string) => {
			if (visited.has(neighborId)) return;
			visited.add(neighborId);

			const neighbor = this.entities.get(neighborId);
			if (!neighbor) return;

			if (options?.entityType && neighbor.type !== options.entityType) return;
			if (options?.minConfidence && neighbor.confidence < options.minConfidence)
				return;

			relatedEntities.push(neighbor);
		};

		if (outgoing) {
			for (const neighborId of outgoing) {
				const rel = this.findRelationshipBetween(entityId, neighborId);
				if (rel) {
					if (
						options?.relationshipType &&
						rel.type !== options.relationshipType
					)
						continue;
					if (options?.minConfidence && rel.confidence < options.minConfidence)
						continue;
					relatedRelationships.push(rel);
				}
				processNeighbor(neighborId);
			}
		}

		if (incoming) {
			for (const neighborId of incoming) {
				const rel = this.findRelationshipBetween(neighborId, entityId);
				if (rel) {
					if (
						options?.relationshipType &&
						rel.type !== options.relationshipType
					)
						continue;
					if (options?.minConfidence && rel.confidence < options.minConfidence)
						continue;
					relatedRelationships.push(rel);
				}
				processNeighbor(neighborId);
			}
		}

		const limit = options?.limit ?? 50;
		return {
			entities: relatedEntities.slice(0, limit),
			relationships: relatedRelationships.slice(0, limit),
		};
	}

	async expandQuery(query: GraphQuery): Promise<Entity[]> {
		const results: Entity[] = [];

		if (query.entityId) {
			const entity = this.entities.get(query.entityId);
			if (entity) {
				results.push(entity);
				const related = await this.getRelated(query.entityId, query);
				results.push(...related.entities);
			}
		}

		if (query.text) {
			const textLower = query.text.toLowerCase();
			for (const [, entity] of this.entities) {
				if (
					entity.text.toLowerCase().includes(textLower) ||
					entity.normalized.toLowerCase().includes(textLower)
				) {
					if (!results.find((e) => e.id === entity.id)) {
						if (query.minConfidence && entity.confidence < query.minConfidence)
							continue;
						results.push(entity);
					}
				}
			}
		}

		if (query.entityType) {
			const entityIds = this.entityTypeIndex.get(query.entityType);
			if (entityIds) {
				for (const id of entityIds) {
					const entity = this.entities.get(id);
					if (entity && !results.find((e) => e.id === id)) {
						if (query.minConfidence && entity.confidence < query.minConfidence)
							continue;
						results.push(entity);
					}
				}
			}
		}

		return results.slice(0, query.limit ?? 100);
	}

	async query(
		query: GraphQuery,
	): Promise<{ entities: Entity[]; relationships: Relationship[] }> {
		const entities = await this.expandQuery(query);
		const relationships: Relationship[] = [];
		const visitedRels = new Set<string>();

		for (const entity of entities) {
			const related = await this.getRelated(entity.id, query);
			for (const rel of related.relationships) {
				if (!visitedRels.has(rel.id)) {
					visitedRels.add(rel.id);
					relationships.push(rel);
				}
			}
		}

		return {
			entities,
			relationships: relationships.slice(0, query.limit ?? 100),
		};
	}

	async getStats(): Promise<GraphStats> {
		const entityTypeDistribution: Record<EntityType, number> = {
			person: 0,
			organization: 0,
			location: 0,
			concept: 0,
			date: 0,
			product: 0,
		};

		const relationshipTypeDistribution: Record<RelationshipType, number> = {
			works_for: 0,
			located_in: 0,
			related_to: 0,
			part_of: 0,
			created_by: 0,
			owns: 0,
			knows: 0,
			uses: 0,
		};

		for (const [, entity] of this.entities) {
			entityTypeDistribution[entity.type]++;
		}

		for (const [, rel] of this.relationships) {
			relationshipTypeDistribution[rel.type]++;
		}

		let totalConnections = 0;
		for (const [, neighbors] of this.adjacencyList) {
			totalConnections += neighbors.size;
		}
		const averageConnectivity =
			this.entities.size > 0 ? totalConnections / this.entities.size : 0;

		return {
			entityCount: this.entities.size,
			relationshipCount: this.relationships.size,
			entityTypeDistribution,
			relationshipTypeDistribution,
			averageConnectivity,
		};
	}

	serialize(): SerializedGraph {
		return {
			entities: Array.from(this.entities.values()),
			relationships: Array.from(this.relationships.values()),
			version: "1.0.0",
			serializedAt: Date.now(),
		};
	}

	async deserialize(data: SerializedGraph): Promise<void> {
		this.entities.clear();
		this.relationships.clear();
		this.initializeIndexes();

		for (const entity of data.entities) {
			await this.addEntity(entity);
		}

		for (const relationship of data.relationships) {
			await this.addRelationship(relationship);
		}
	}

	async deleteEntity(id: string): Promise<boolean> {
		const entity = this.entities.get(id);
		if (!entity) return false;

		const relsToDelete: string[] = [];
		for (const [relId, rel] of this.relationships) {
			if (rel.from === id || rel.to === id) {
				relsToDelete.push(relId);
			}
		}

		for (const relId of relsToDelete) {
			await this.deleteRelationship(relId);
		}

		this.entities.delete(id);
		this.adjacencyList.delete(id);
		this.reverseAdjacency.delete(id);
		this.entityTypeIndex.get(entity.type)?.delete(id);

		return true;
	}

	async deleteRelationship(id: string): Promise<boolean> {
		const rel = this.relationships.get(id);
		if (!rel) return false;

		this.relationships.delete(id);
		this.adjacencyList.get(rel.from)?.delete(rel.to);
		this.reverseAdjacency.get(rel.to)?.delete(rel.from);
		this.relationshipTypeIndex.get(rel.type)?.delete(id);

		return true;
	}

	clear(): void {
		this.entities.clear();
		this.relationships.clear();
		this.initializeIndexes();
		this.adjacencyList.clear();
		this.reverseAdjacency.clear();
	}

	private evictLeastConnectedEntities(count: number): void {
		const connectivityScores: Array<{ id: string; score: number }> = [];

		for (const [id] of this.entities) {
			const outgoing = this.adjacencyList.get(id)?.size ?? 0;
			const incoming = this.reverseAdjacency.get(id)?.size ?? 0;
			connectivityScores.push({ id, score: outgoing + incoming });
		}

		connectivityScores.sort((a, b) => a.score - b.score);

		for (let i = 0; i < Math.min(count, connectivityScores.length); i++) {
			this.deleteEntity(connectivityScores[i].id);
		}
	}

	private evictLowestConfidenceRelationships(count: number): void {
		const confidenceScores: Array<{ id: string; confidence: number }> = [];

		for (const [id, rel] of this.relationships) {
			confidenceScores.push({ id, confidence: rel.confidence });
		}

		confidenceScores.sort((a, b) => a.confidence - b.confidence);

		for (let i = 0; i < Math.min(count, confidenceScores.length); i++) {
			this.deleteRelationship(confidenceScores[i].id);
		}
	}

	async inferRelationships(): Promise<Relationship[]> {
		if (!this.config.enableInference) return [];

		const inferred: Relationship[] = [];

		for (const [, entityA] of this.entities) {
			for (const [, entityB] of this.entities) {
				if (entityA.id === entityB.id) continue;

				const inferredRel = this.tryInferRelationship(entityA, entityB);
				if (inferredRel) {
					inferred.push(inferredRel);
				}
			}
		}

		for (const rel of inferred) {
			try {
				await this.addRelationship(rel);
			} catch {
				// Skip if relationship already exists or entities missing
			}
		}

		return inferred;
	}

	private tryInferRelationship(
		entityA: Entity,
		entityB: Entity,
	): Relationship | null {
		if (entityA.type === "person" && entityB.type === "organization") {
			const existingRel = this.findRelationshipByType(
				entityA.id,
				entityB.id,
				"works_for",
			);
			if (existingRel) return null;

			return {
				id: `inferred_${entityA.id}_${entityB.id}_works_for`,
				from: entityA.id,
				to: entityB.id,
				type: "works_for",
				confidence: 0.3,
				evidence: ["Inferred based on entity types"],
			};
		}

		if (entityA.type === "product" && entityB.type === "organization") {
			const existingRel = this.findRelationshipByType(
				entityA.id,
				entityB.id,
				"created_by",
			);
			if (existingRel) return null;

			return {
				id: `inferred_${entityA.id}_${entityB.id}_created_by`,
				from: entityA.id,
				to: entityB.id,
				type: "created_by",
				confidence: 0.3,
				evidence: ["Inferred based on entity types"],
			};
		}

		return null;
	}

	private findRelationshipByType(
		fromId: string,
		toId: string,
		type: RelationshipType,
	): Relationship | undefined {
		for (const [, rel] of this.relationships) {
			if (rel.from === fromId && rel.to === toId && rel.type === type) {
				return rel;
			}
		}
		return undefined;
	}
}

export const createKnowledgeGraph = (
	config?: KnowledgeGraphConfig,
): KnowledgeGraph => {
	return new KnowledgeGraph(config);
};
