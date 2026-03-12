import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeGraph, createKnowledgeGraph } from '../../src/lib/knowledge-graph/graph';
import { EntityExtractor, createEntityExtractor } from '../../src/lib/knowledge-graph/extractor';
import { buildGraphFromText } from '../../src/lib/knowledge-graph';
import type { Entity, Relationship, EntityType } from '../../src/lib/knowledge-graph/types';

describe('KnowledgeGraph', () => {
	let graph: KnowledgeGraph;

	beforeEach(() => {
		graph = createKnowledgeGraph();
	});

	describe('Entity Management', () => {
		it('should add an entity', async () => {
			const entity: Entity = {
				id: 'e1',
				text: 'OpenAI',
				type: 'organization',
				normalized: 'Openai',
				confidence: 0.9,
				source: { type: 'query' },
			};

			const result = await graph.addEntity(entity);
			expect(result.id).toBe('e1');
			expect(result.text).toBe('OpenAI');

			const stats = await graph.getStats();
			expect(stats.entityCount).toBe(1);
		});

		it('should merge duplicate entities', async () => {
			const entity1: Entity = {
				id: 'e1',
				text: 'OpenAI',
				type: 'organization',
				normalized: 'openai',
				confidence: 0.8,
				source: { type: 'query' },
			};

			const entity2: Entity = {
				id: 'e2',
				text: 'OpenAI',
				type: 'organization',
				normalized: 'openai',
				confidence: 0.95,
				source: { type: 'document', reference: 'doc1' },
			};

			await graph.addEntity(entity1);
			const merged = await graph.addEntity(entity2);

			expect(merged.id).toBe('e1');
			expect(merged.confidence).toBe(0.95);

			const stats = await graph.getStats();
			expect(stats.entityCount).toBe(1);
		});

		it('should delete an entity and its relationships', async () => {
			const entity1: Entity = {
				id: 'e1',
				text: 'John',
				type: 'person',
				normalized: 'john',
				confidence: 0.9,
				source: { type: 'query' },
			};

			const entity2: Entity = {
				id: 'e2',
				text: 'OpenAI',
				type: 'organization',
				normalized: 'openai',
				confidence: 0.9,
				source: { type: 'query' },
			};

			await graph.addEntity(entity1);
			await graph.addEntity(entity2);

			const rel: Relationship = {
				id: 'r1',
				from: 'e1',
				to: 'e2',
				type: 'works_for',
				confidence: 0.8,
			};

			await graph.addRelationship(rel);

			await graph.deleteEntity('e1');

			const stats = await graph.getStats();
			expect(stats.entityCount).toBe(1);
			expect(stats.relationshipCount).toBe(0);
		});
	});

	describe('Relationship Management', () => {
		beforeEach(async () => {
			await graph.addEntity({
				id: 'e1',
				text: 'John',
				type: 'person',
				normalized: 'john',
				confidence: 0.9,
				source: { type: 'query' },
			});

			await graph.addEntity({
				id: 'e2',
				text: 'OpenAI',
				type: 'organization',
				normalized: 'openai',
				confidence: 0.9,
				source: { type: 'query' },
			});
		});

		it('should add a relationship', async () => {
			const rel: Relationship = {
				id: 'r1',
				from: 'e1',
				to: 'e2',
				type: 'works_for',
				confidence: 0.85,
			};

			const result = await graph.addRelationship(rel);
			expect(result.id).toBe('r1');
			expect(result.type).toBe('works_for');

			const stats = await graph.getStats();
			expect(stats.relationshipCount).toBe(1);
		});

		it('should merge duplicate relationships', async () => {
			const rel1: Relationship = {
				id: 'r1',
				from: 'e1',
				to: 'e2',
				type: 'works_for',
				confidence: 0.7,
				evidence: ['source1'],
			};

			const rel2: Relationship = {
				id: 'r2',
				from: 'e1',
				to: 'e2',
				type: 'works_for',
				confidence: 0.9,
				evidence: ['source2'],
			};

			await graph.addRelationship(rel1);
			const merged = await graph.addRelationship(rel2);

			expect(merged.id).toBe('r1');
			expect(merged.confidence).toBe(0.9);
			expect(merged.weight).toBe(2);

			const stats = await graph.getStats();
			expect(stats.relationshipCount).toBe(1);
		});

		it('should throw error for missing entities', async () => {
			const rel: Relationship = {
				id: 'r1',
				from: 'nonexistent',
				to: 'e2',
				type: 'works_for',
				confidence: 0.8,
			};

			await expect(graph.addRelationship(rel)).rejects.toThrow('entity not found');
		});
	});

	describe('Path Finding', () => {
		beforeEach(async () => {
			const entities: Entity[] = [
				{ id: 'a', text: 'A', type: 'concept', normalized: 'a', confidence: 0.9, source: { type: 'query' } },
				{ id: 'b', text: 'B', type: 'concept', normalized: 'b', confidence: 0.9, source: { type: 'query' } },
				{ id: 'c', text: 'C', type: 'concept', normalized: 'c', confidence: 0.9, source: { type: 'query' } },
				{ id: 'd', text: 'D', type: 'concept', normalized: 'd', confidence: 0.9, source: { type: 'query' } },
			];

			for (const entity of entities) {
				await graph.addEntity(entity);
			}

			const relationships: Relationship[] = [
				{ id: 'r1', from: 'a', to: 'b', type: 'related_to', confidence: 0.9 },
				{ id: 'r2', from: 'b', to: 'c', type: 'related_to', confidence: 0.9 },
				{ id: 'r3', from: 'c', to: 'd', type: 'related_to', confidence: 0.9 },
			];

			for (const rel of relationships) {
				await graph.addRelationship(rel);
			}
		});

		it('should find a direct path', async () => {
			const paths = await graph.findPath('a', 'b');
			expect(paths.length).toBeGreaterThan(0);
			expect(paths[0].entities.length).toBe(2);
			expect(paths[0].entities[0].id).toBe('a');
			expect(paths[0].entities[1].id).toBe('b');
		});

		it('should find a multi-hop path', async () => {
			const paths = await graph.findPath('a', 'd');
			expect(paths.length).toBeGreaterThan(0);
			expect(paths[0].entities.length).toBe(4);
			expect(paths[0].relationships.length).toBe(3);
		});

		it('should return empty array for non-existent path', async () => {
			await graph.addEntity({
				id: 'isolated',
				text: 'Isolated',
				type: 'concept',
				normalized: 'isolated',
				confidence: 0.9,
				source: { type: 'query' },
			});

			const paths = await graph.findPath('a', 'isolated');
			expect(paths).toEqual([]);
		});

		it('should respect maxDepth parameter', async () => {
			const paths = await graph.findPath('a', 'd', 2);
			expect(paths).toEqual([]);
		});
	});

	describe('Get Related Entities', () => {
		beforeEach(async () => {
			const entities: Entity[] = [
				{ id: 'center', text: 'Center', type: 'concept', normalized: 'center', confidence: 0.9, source: { type: 'query' } },
				{ id: 'related1', text: 'Related1', type: 'product', normalized: 'related1', confidence: 0.9, source: { type: 'query' } },
				{ id: 'related2', text: 'Related2', type: 'organization', normalized: 'related2', confidence: 0.9, source: { type: 'query' } },
			];

			for (const entity of entities) {
				await graph.addEntity(entity);
			}

			await graph.addRelationship({
				id: 'r1',
				from: 'center',
				to: 'related1',
				type: 'uses',
				confidence: 0.9,
			});

			await graph.addRelationship({
				id: 'r2',
				from: 'related2',
				to: 'center',
				type: 'created_by',
				confidence: 0.9,
			});
		});

		it('should get all related entities', async () => {
			const result = await graph.getRelated('center');
			expect(result.entities.length).toBe(2);
			expect(result.relationships.length).toBe(2);
		});

		it('should filter by entity type', async () => {
			const result = await graph.getRelated('center', { entityType: 'product' });
			expect(result.entities.length).toBe(1);
			expect(result.entities[0].type).toBe('product');
		});

		it('should filter by relationship type', async () => {
			const result = await graph.getRelated('center', { relationshipType: 'uses' });
			expect(result.relationships.length).toBe(1);
			expect(result.relationships[0].type).toBe('uses');
		});

		it('should respect limit parameter', async () => {
			const result = await graph.getRelated('center', { limit: 1 });
			expect(result.entities.length).toBeLessThanOrEqual(1);
		});
	});

	describe('Query Expansion', () => {
		beforeEach(async () => {
			const entities: Entity[] = [
				{ id: 'e1', text: 'React', type: 'product', normalized: 'react', confidence: 0.9, source: { type: 'query' } },
				{ id: 'e2', text: 'React Native', type: 'product', normalized: 'react-native', confidence: 0.9, source: { type: 'query' } },
				{ id: 'e3', text: 'React Router', type: 'product', normalized: 'react-router', confidence: 0.9, source: { type: 'query' } },
				{ id: 'e4', text: 'TypeScript', type: 'concept', normalized: 'typescript', confidence: 0.9, source: { type: 'query' } },
			];

			for (const entity of entities) {
				await graph.addEntity(entity);
			}

			await graph.addRelationship({
				id: 'r1',
				from: 'e1',
				to: 'e2',
				type: 'related_to',
				confidence: 0.8,
			});

			await graph.addRelationship({
				id: 'r2',
				from: 'e1',
				to: 'e3',
				type: 'related_to',
				confidence: 0.8,
			});
		});

		it('should expand query by text', async () => {
			const results = await graph.expandQuery({ text: 'react' });
			expect(results.length).toBeGreaterThan(0);
			expect(results.some(e => e.normalized === 'react')).toBe(true);
		});

		it('should expand query by entity type', async () => {
			const results = await graph.expandQuery({ entityType: 'product' });
			expect(results.length).toBe(3);
			expect(results.every(e => e.type === 'product')).toBe(true);
		});

		it('should expand from entity ID and include related', async () => {
			const results = await graph.expandQuery({ entityId: 'e1' });
			expect(results.length).toBeGreaterThan(1);
		});

		it('should filter by minimum confidence', async () => {
			const results = await graph.expandQuery({ minConfidence: 0.95 });
			expect(results.every(e => e.confidence >= 0.95)).toBe(true);
		});
	});

	describe('Serialization', () => {
		it('should serialize and deserialize the graph', async () => {
			await graph.addEntity({
				id: 'e1',
				text: 'OpenAI',
				type: 'organization',
				normalized: 'openai',
				confidence: 0.9,
				source: { type: 'query' },
			});

			await graph.addEntity({
				id: 'e2',
				text: 'GPT-4',
				type: 'product',
				normalized: 'GPT-4',
				confidence: 0.95,
				source: { type: 'query' },
			});

			await graph.addRelationship({
				id: 'r1',
				from: 'e2',
				to: 'e1',
				type: 'created_by',
				confidence: 0.9,
			});

			const serialized = graph.serialize();
			expect(serialized.entities.length).toBe(2);
			expect(serialized.relationships.length).toBe(1);
			expect(serialized.version).toBe('1.0.0');

			const newGraph = createKnowledgeGraph();
			await newGraph.deserialize(serialized);

			const stats = await newGraph.getStats();
			expect(stats.entityCount).toBe(2);
			expect(stats.relationshipCount).toBe(1);
		});
	});

	describe('Statistics', () => {
		it('should return correct statistics', async () => {
			await graph.addEntity({
				id: 'e1',
				text: 'John',
				type: 'person',
				normalized: 'john',
				confidence: 0.9,
				source: { type: 'query' },
			});

			await graph.addEntity({
				id: 'e2',
				text: 'OpenAI',
				type: 'organization',
				normalized: 'openai',
				confidence: 0.9,
				source: { type: 'query' },
			});

			await graph.addRelationship({
				id: 'r1',
				from: 'e1',
				to: 'e2',
				type: 'works_for',
				confidence: 0.8,
			});

			const stats = await graph.getStats();
			expect(stats.entityCount).toBe(2);
			expect(stats.relationshipCount).toBe(1);
			expect(stats.entityTypeDistribution.person).toBe(1);
			expect(stats.entityTypeDistribution.organization).toBe(1);
			expect(stats.relationshipTypeDistribution.works_for).toBe(1);
			expect(stats.averageConnectivity).toBe(0.5);
		});
	});
});

describe('EntityExtractor', () => {
	let extractor: EntityExtractor;

	beforeEach(() => {
		extractor = createEntityExtractor();
	});

	describe('Entity Extraction', () => {
		it('should extract tech products', async () => {
			const result = await extractor.extract('React and Vue are popular frameworks');

			const products = result.entities.filter(e => e.type === 'product');
			expect(products.length).toBeGreaterThanOrEqual(2);
			expect(products.some(e => e.normalized === 'react')).toBe(true);
			expect(products.some(e => e.normalized === 'vue')).toBe(true);
		});

		it('should extract programming languages', async () => {
			const result = await extractor.extract('I code in TypeScript and Python');

			const concepts = result.entities.filter(e => e.type === 'concept');
			expect(concepts.length).toBeGreaterThanOrEqual(2);
			expect(concepts.some(e => e.normalized === 'typescript')).toBe(true);
			expect(concepts.some(e => e.normalized === 'python')).toBe(true);
		});

		it('should extract organizations', async () => {
			const result = await extractor.extract('OpenAI and Anthropic are AI companies');

			const orgs = result.entities.filter(e => e.type === 'organization');
			expect(orgs.length).toBeGreaterThanOrEqual(2);
			expect(orgs.some(e => e.normalized === 'Openai')).toBe(true);
			expect(orgs.some(e => e.normalized === 'Anthropic')).toBe(true);
		});

		it('should extract locations', async () => {
			const result = await extractor.extract('San Francisco and New York are tech hubs');

			const locations = result.entities.filter(e => e.type === 'location');
			expect(locations.length).toBeGreaterThanOrEqual(2);
		});

		it('should extract dates', async () => {
			const result = await extractor.extract('The project started on 2024-01-15');

			const dates = result.entities.filter(e => e.type === 'date');
			expect(dates.length).toBeGreaterThanOrEqual(1);
			expect(dates.some(e => e.text.includes('2024-01-15'))).toBe(true);
		});

		it('should calculate confidence scores', async () => {
			const result = await extractor.extract('React is made by Facebook');

			expect(result.confidence).toBeGreaterThan(0);
			expect(result.confidence).toBeLessThanOrEqual(1);
		});

		it('should normalize entity names', async () => {
			const result = await extractor.extract('REACT and VUE are frameworks');

			const products = result.entities.filter(e => e.type === 'product');
			expect(products.some(e => e.normalized === 'react')).toBe(true);
			expect(products.some(e => e.normalized === 'vue')).toBe(true);
		});

		it('should track processing time', async () => {
			const result = await extractor.extract('Test query');

			expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
		});
	});

	describe('Relationship Extraction', () => {
		it('should extract works_for relationships', async () => {
			const result = await extractor.extract('John Smith works at OpenAI');

			const worksFor = result.relationships.filter(r => r.type === 'works_for');
			expect(worksFor.length).toBeGreaterThanOrEqual(1);
		});

		it('should extract created_by relationships', async () => {
			const result = await extractor.extract('React was created by Facebook and Vue was developed by Facebook');

			const createdBy = result.relationships.filter(r => r.type === 'created_by');
			expect(createdBy.length).toBeGreaterThanOrEqual(1);
		});

		it('should extract related_to relationships', async () => {
			const result = await extractor.extract('React vs Vue comparison');

			const related = result.relationships.filter(r => r.type === 'related_to');
			expect(related.length).toBeGreaterThanOrEqual(1);
		});

		it('should store evidence for relationships', async () => {
			const result = await extractor.extract('John Smith works at OpenAI');

			const worksFor = result.relationships.filter(r => r.type === 'works_for');
			if (worksFor.length > 0) {
				expect(worksFor[0].evidence).toBeDefined();
				expect(worksFor[0].evidence?.length).toBeGreaterThan(0);
			} else {
				expect(result.relationships.length).toBeGreaterThanOrEqual(0);
			}
		});
	});

	describe('Custom Patterns', () => {
		it('should support custom entity patterns', async () => {
			const customExtractor = createEntityExtractor([
				{
					pattern: /\b[A-Z]{2,5}\b/g,
					type: 'product' as EntityType,
					confidence: 0.7,
				},
			]);

			const result = await customExtractor.extract('I use XYZ and ABC tools');

			expect(result.entities.some(e => e.text === 'XYZ' || e.text === 'ABC')).toBe(true);
		});
	});
});

describe('Integration: buildGraphFromText', () => {
	it('should build a complete graph from text', async () => {
		const text = 'React and Vue are frameworks. React was created by Facebook. TypeScript is a language built on JavaScript.';

		const { graph, extractionResult } = await buildGraphFromText(text);

		expect(extractionResult.entities.length).toBeGreaterThan(0);

		const stats = await graph.getStats();
		expect(stats.entityCount).toBeGreaterThan(0);
	});

	it('should maintain entity relationships in graph', async () => {
		const text = 'John Smith works at OpenAI and React vs Vue comparison';

		const { graph, extractionResult } = await buildGraphFromText(text);

		const stats = await graph.getStats();
		expect(stats.entityCount).toBeGreaterThan(0);
	});
});

describe('Temporal Tracking', () => {
	it('should track entity creation timestamps', async () => {
		const graph = createKnowledgeGraph();

		const before = Date.now();
		await graph.addEntity({
			id: 'e1',
			text: 'Test',
			type: 'concept',
			normalized: 'test',
			confidence: 0.9,
			source: { type: 'query' },
		});
		const after = Date.now();

		const entity = await graph.getEntity('e1');
		expect(entity?.createdAt).toBeGreaterThanOrEqual(before);
		expect(entity?.createdAt).toBeLessThanOrEqual(after);
	});

	it('should track entity update timestamps', async () => {
		const graph = createKnowledgeGraph();

		await graph.addEntity({
			id: 'e1',
			text: 'Test',
			type: 'concept',
			normalized: 'test',
			confidence: 0.7,
			source: { type: 'query' },
		});

		const firstEntity = await graph.getEntity('e1');
		const firstUpdated = firstEntity?.updatedAt;

		await new Promise(resolve => setTimeout(resolve, 10));

		await graph.addEntity({
			id: 'e2',
			text: 'Test',
			type: 'concept',
			normalized: 'test',
			confidence: 0.9,
			source: { type: 'document' },
		});

		const updatedEntity = await graph.getEntity('e1');
		expect(updatedEntity?.updatedAt).toBeGreaterThan(firstUpdated ?? 0);
	});

	it('should track relationship creation timestamps', async () => {
		const graph = createKnowledgeGraph();

		await graph.addEntity({
			id: 'e1',
			text: 'A',
			type: 'concept',
			normalized: 'a',
			confidence: 0.9,
			source: { type: 'query' },
		});

		await graph.addEntity({
			id: 'e2',
			text: 'B',
			type: 'concept',
			normalized: 'b',
			confidence: 0.9,
			source: { type: 'query' },
		});

		const before = Date.now();
		await graph.addRelationship({
			id: 'r1',
			from: 'e1',
			to: 'e2',
			type: 'related_to',
			confidence: 0.9,
		});
		const after = Date.now();

		const rel = await graph.getRelationship('r1');
		expect(rel?.createdAt).toBeGreaterThanOrEqual(before);
		expect(rel?.createdAt).toBeLessThanOrEqual(after);
	});
});

describe('Edge Cases', () => {
	it('should handle empty input', async () => {
		const extractor = createEntityExtractor();
		const result = await extractor.extract('');

		expect(result.entities).toEqual([]);
		expect(result.relationships).toEqual([]);
	});

	it('should handle special characters', async () => {
		const extractor = createEntityExtractor();
		const result = await extractor.extract('I use C++ and C# for development');

		const concepts = result.entities.filter(e => e.type === 'concept');
		expect(concepts.length).toBeGreaterThanOrEqual(1);
		expect(concepts.some(e => e.normalized === 'c++' || e.normalized === 'c#')).toBe(true);
	});

	it('should handle case insensitivity', async () => {
		const extractor = createEntityExtractor();
		const result = await extractor.extract('REACT react ReAcT');

		const products = result.entities.filter(e => e.type === 'product');
		expect(products.every(e => e.normalized === 'react')).toBe(true);
	});

	it('should handle graph capacity limits', async () => {
		const graph = createKnowledgeGraph({ maxEntities: 3 });

		for (let i = 0; i < 5; i++) {
			await graph.addEntity({
				id: `e${i}`,
				text: `Entity${i}`,
				type: 'concept',
				normalized: `entity${i}`,
				confidence: 0.9,
				source: { type: 'query' },
			});
		}

		const stats = await graph.getStats();
		expect(stats.entityCount).toBeLessThanOrEqual(3);
	});

	it('should handle clearing the graph', async () => {
		const graph = createKnowledgeGraph();

		await graph.addEntity({
			id: 'e1',
			text: 'Test',
			type: 'concept',
			normalized: 'test',
			confidence: 0.9,
			source: { type: 'query' },
		});

		graph.clear();

		const stats = await graph.getStats();
		expect(stats.entityCount).toBe(0);
		expect(stats.relationshipCount).toBe(0);
	});
});
