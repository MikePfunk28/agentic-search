import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const addEntity = mutation({
	args: {
		userId: v.string(),
		text: v.string(),
		type: v.union(
			v.literal('person'),
			v.literal('organization'),
			v.literal('location'),
			v.literal('concept'),
			v.literal('date'),
			v.literal('product'),
		),
		normalized: v.string(),
		confidence: v.number(),
		sourceType: v.union(
			v.literal('query'),
			v.literal('document'),
			v.literal('user'),
			v.literal('inferred'),
		),
		sourceReference: v.optional(v.string()),
		sourcePositionStart: v.optional(v.number()),
		sourcePositionEnd: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		const existing = await ctx.db
			.query('kgEntities')
			.withIndex('by_user_normalized', (q) =>
				q.eq('userId', args.userId).eq('normalized', args.normalized)
			)
			.first();

		if (existing) {
			const updated = await ctx.db.patch(existing._id, {
				confidence: Math.max(existing.confidence, args.confidence),
				updatedAt: now,
			});
			return existing._id;
		}

		return await ctx.db.insert('kgEntities', {
			userId: args.userId,
			text: args.text,
			type: args.type,
			normalized: args.normalized,
			confidence: args.confidence,
			source: {
				type: args.sourceType,
				reference: args.sourceReference,
				position:
					args.sourcePositionStart !== undefined && args.sourcePositionEnd !== undefined
						? { start: args.sourcePositionStart, end: args.sourcePositionEnd }
						: undefined,
			},
			createdAt: now,
			updatedAt: now,
		});
	},
});

export const addRelationship = mutation({
	args: {
		userId: v.string(),
		fromEntityId: v.id('kgEntities'),
		toEntityId: v.id('kgEntities'),
		type: v.union(
			v.literal('works_for'),
			v.literal('located_in'),
			v.literal('related_to'),
			v.literal('part_of'),
			v.literal('created_by'),
			v.literal('owns'),
			v.literal('knows'),
			v.literal('uses'),
		),
		confidence: v.number(),
		evidence: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('kgRelationships')
			.withIndex('by_from_to', (q) =>
				q.eq('fromEntityId', args.fromEntityId).eq('toEntityId', args.toEntityId)
			)
			.filter((q) => q.eq(q.field('type'), args.type))
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, {
				confidence: Math.max(existing.confidence, args.confidence),
				weight: (existing.weight ?? 1) + 1,
				evidence: args.evidence
					? [...(existing.evidence ?? []), ...args.evidence].slice(0, 10)
					: existing.evidence,
			});
			return existing._id;
		}

		return await ctx.db.insert('kgRelationships', {
			userId: args.userId,
			fromEntityId: args.fromEntityId,
			toEntityId: args.toEntityId,
			type: args.type,
			confidence: args.confidence,
			evidence: args.evidence,
			weight: 1,
			createdAt: Date.now(),
		});
	},
});

export const getEntitiesByUser = query({
	args: {
		userId: v.string(),
		type: v.optional(
			v.union(
				v.literal('person'),
				v.literal('organization'),
				v.literal('location'),
				v.literal('concept'),
				v.literal('date'),
				v.literal('product'),
			)
		),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		let results;

		if (args.type) {
			results = await ctx.db
				.query('kgEntities')
				.withIndex('by_user_type', (q) =>
					q.eq('userId', args.userId).eq('type', args.type as 'person' | 'organization' | 'location' | 'concept' | 'date' | 'product')
				)
				.collect();
		} else {
			results = await ctx.db
				.query('kgEntities')
				.withIndex('by_user', (q) => q.eq('userId', args.userId))
				.collect();
		}

		if (args.limit) {
			return results.slice(0, args.limit);
		}
		return results;
	},
});

export const getRelationshipsByUser = query({
	args: {
		userId: v.string(),
		type: v.optional(
			v.union(
				v.literal('works_for'),
				v.literal('located_in'),
				v.literal('related_to'),
				v.literal('part_of'),
				v.literal('created_by'),
				v.literal('owns'),
				v.literal('knows'),
				v.literal('uses'),
			)
		),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		let results;

		if (args.type) {
			results = await ctx.db
				.query('kgRelationships')
				.withIndex('by_user_type', (q) =>
					q.eq('userId', args.userId).eq('type', args.type as 'works_for' | 'located_in' | 'related_to' | 'part_of' | 'created_by' | 'owns' | 'knows' | 'uses')
				)
				.collect();
		} else {
			results = await ctx.db
				.query('kgRelationships')
				.withIndex('by_user', (q) => q.eq('userId', args.userId))
				.collect();
		}

		if (args.limit) {
			return results.slice(0, args.limit);
		}
		return results;
	},
});

export const getRelatedEntities = query({
	args: {
		entityId: v.id('kgEntities'),
	},
	handler: async (ctx, args) => {
		const outgoing = await ctx.db
			.query('kgRelationships')
			.withIndex('by_from', (q) => q.eq('fromEntityId', args.entityId))
			.collect();

		const incoming = await ctx.db
			.query('kgRelationships')
			.withIndex('by_to', (q) => q.eq('toEntityId', args.entityId))
			.collect();

		const relatedEntityIds = new Set([
			...outgoing.map((r) => r.toEntityId),
			...incoming.map((r) => r.fromEntityId),
		]);

		const entities = await Promise.all(
			Array.from(relatedEntityIds).map((id) => ctx.db.get(id))
		);

		return {
			relationships: [...outgoing, ...incoming],
			entities: entities.filter((e) => e !== null),
		};
	},
});

export const searchEntities = query({
	args: {
		userId: v.string(),
		query: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const allEntities = await ctx.db
			.query('kgEntities')
			.withIndex('by_user', (q) => q.eq('userId', args.userId))
			.collect();

		const queryLower = args.query.toLowerCase();
		const matches = allEntities.filter(
			(e) =>
				e.text.toLowerCase().includes(queryLower) ||
				e.normalized.toLowerCase().includes(queryLower)
		);

		return matches.slice(0, args.limit ?? 50);
	},
});

export const deleteEntity = mutation({
	args: {
		entityId: v.id('kgEntities'),
	},
	handler: async (ctx, args) => {
		const entity = await ctx.db.get(args.entityId);
		if (!entity) return false;

		const outgoing = await ctx.db
			.query('kgRelationships')
			.withIndex('by_from', (q) => q.eq('fromEntityId', args.entityId))
			.collect();

		const incoming = await ctx.db
			.query('kgRelationships')
			.withIndex('by_to', (q) => q.eq('toEntityId', args.entityId))
			.collect();

		for (const rel of [...outgoing, ...incoming]) {
			await ctx.db.delete(rel._id);
		}

		await ctx.db.delete(args.entityId);
		return true;
	},
});

export const deleteRelationship = mutation({
	args: {
		relationshipId: v.id('kgRelationships'),
	},
	handler: async (ctx, args) => {
		const rel = await ctx.db.get(args.relationshipId);
		if (!rel) return false;

		await ctx.db.delete(args.relationshipId);
		return true;
	},
});

export const getGraphStats = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const entities = await ctx.db
			.query('kgEntities')
			.withIndex('by_user', (q) => q.eq('userId', args.userId))
			.collect();

		const relationships = await ctx.db
			.query('kgRelationships')
			.withIndex('by_user', (q) => q.eq('userId', args.userId))
			.collect();

		const entityTypeDistribution: Record<string, number> = {
			person: 0,
			organization: 0,
			location: 0,
			concept: 0,
			date: 0,
			product: 0,
		};

		const relationshipTypeDistribution: Record<string, number> = {
			works_for: 0,
			located_in: 0,
			related_to: 0,
			part_of: 0,
			created_by: 0,
			owns: 0,
			knows: 0,
			uses: 0,
		};

		for (const entity of entities) {
			entityTypeDistribution[entity.type]++;
		}

		for (const rel of relationships) {
			relationshipTypeDistribution[rel.type]++;
		}

		const avgConnectivity =
			entities.length > 0 ? relationships.length / entities.length : 0;

		return {
			entityCount: entities.length,
			relationshipCount: relationships.length,
			entityTypeDistribution,
			relationshipTypeDistribution,
			averageConnectivity: avgConnectivity,
		};
	},
});
