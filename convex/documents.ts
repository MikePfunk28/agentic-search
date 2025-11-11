/**
 * Document Storage System with Convex + S3
 * Stores document metadata in Convex, large files in S3
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Document upload mutation
export const uploadDocument = mutation({
	args: {
		name: v.string(),
		type: v.string(), // pdf, docx, txt, md, etc.
		size: v.number(),
		content: v.optional(v.string()), // For small text files
		s3Url: v.optional(v.string()), // For large files stored in S3
		metadata: v.optional(v.object({
			author: v.optional(v.string()),
			createdAt: v.optional(v.string()),
			tags: v.optional(v.array(v.string())),
		})),
	},
	handler: async (ctx, args) => {
		const userIdentity = await ctx.auth.getUserIdentity();
    	if (!userIdentity) {
      		throw new Error("Authentication required");
    }
		const documentId = await ctx.db.insert("documents", {
			userId: userIdentity.subject,
			name: args.name,
			type: args.type,
			size: args.size,
			content: args.content,
			s3Url: args.s3Url,
			metadata: args.metadata,
			uploadedAt: Date.now(),
			processedAt: undefined,
			status: "pending" as const,
			chunks: [],
		});

		return documentId;
	},
});

// Process document into searchable chunks
export const processDocument = mutation({
	args: {
		documentId: v.id("documents"),
		chunks: v.array(v.object({
			text: v.string(),
			embedding: v.optional(v.array(v.number())),
			page: v.optional(v.number()),
			chunkIndex: v.number(),
		})),
	},
	handler: async (ctx, args) => {
		const userIdentity = await ctx.auth.getUserIdentity();
		if (!userIdentity) {
		throw new Error("Authentication required");
		}

		const document = await ctx.db.get(args.documentId);
		if (!document || document.userId !== userIdentity.subject) {
		throw new Error("Unauthorized: You do not own this document");
		}
		await ctx.db.patch(args.documentId, {
			chunks: args.chunks,
			processedAt: Date.now(),
			status: "processed" as const,
		});
	},
});

// Search documents by semantic similarity
export const searchDocuments = query({
	args: {
		query: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit || 10;

		// Get all processed documents
		const documents = await ctx.db
			.query("documents")
			.filter((q) => q.eq(q.field("status"), "processed"))
			.take(100);

		// Simple text search for now (can be upgraded to vector search)
		const results = documents
			.filter((doc) => {
				const searchLower = args.query.toLowerCase();
				return (
					doc.name.toLowerCase().includes(searchLower) ||
					doc.content?.toLowerCase().includes(searchLower) ||
					doc.chunks.some((chunk) =>
						chunk.text.toLowerCase().includes(searchLower)
					)
				);
			})
			.slice(0, limit);

		return results;
	},
});

// Get document by ID
export const getDocument = query({
	args: { id: v.id("documents") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

// List all documents
export const listDocuments = query({
	args: {
		limit: v.optional(v.number()),
		status: v.optional(v.union(
			v.literal("pending"),
			v.literal("processing"),
			v.literal("processed"),
			v.literal("failed")
		)),
	},
	handler: async (ctx, args) => {
		const limit = args.limit || 50;

		let query = ctx.db.query("documents");

		if (args.status) {
			query = query.filter((q) => q.eq(q.field("status"), args.status));
		}

		return await query
			.order("desc")
			.take(limit);
	},
});

// Delete document
export const deleteDocument = mutation({
	args: { id: v.id("documents") },
	handler: async (ctx, args) => {
		const userIdentity = await ctx.auth.getUserIdentity();
		if (!userIdentity) {
			throw new Error("Authentication required");
		}

		const document = await ctx.db.get(args.id);
		if (!document) {
			throw new Error("Document not found");
		}

		if (document.userId !== userIdentity.subject) {
			throw new Error("Unauthorized: You do not own this document");
		}
		await ctx.db.delete(args.id);
	},
});

// Update document metadata
export const updateDocumentMetadata = mutation({
	args: {
		id: v.id("documents"),
		metadata: v.object({
			author: v.optional(v.string()),
			createdAt: v.optional(v.string()),
			tags: v.optional(v.array(v.string())),
		}),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			metadata: args.metadata,
		});
	},
});

// Get documents by tag
export const getDocumentsByTag = query({
	args: {
		tag: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit || 50;

		const documents = await ctx.db
			.query("documents")
			.filter((q) => q.eq(q.field("status"), "processed"))
			.take(100);

		return documents
			.filter((doc) => doc.metadata?.tags?.includes(args.tag))
			.slice(0, limit);
	},
});
