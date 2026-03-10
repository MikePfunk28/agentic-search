/**
 * useRag Hook
 * Connects the RAG pipeline to Convex backend and model-store.
 * Provides knowledge base CRUD, document upload + chunking, and search-time retrieval.
 */

import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
	getRagLevel,
	setRagLevel as storeSetRagLevel,
	getRagKnowledgeBaseId,
	setRagKnowledgeBaseId,
	getRagEmbeddingConfig,
	setRagEmbeddingConfig as storeSetRagEmbeddingConfig,
	type RagLevel,
} from "../lib/model-store";
import { chunkText, estimateTokenCount } from "../lib/rag/retrieval";

export function useRag(userId: string | undefined) {
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	// ── Current settings from model-store ────────────────────────────
	const ragLevel = getRagLevel();
	const activeKbId = getRagKnowledgeBaseId();
	const embeddingConfig = getRagEmbeddingConfig();

	// ── Convex queries ───────────────────────────────────────────────
	const knowledgeBases = useQuery(
		api.rag.listKnowledgeBases,
		userId ? { userId } : "skip",
	);

	const analyticsSummary = useQuery(
		api.rag.getRagAnalyticsSummary,
		userId ? { userId } : "skip",
	);

	// ── Convex mutations ─────────────────────────────────────────────
	const createKbMutation = useMutation(api.rag.createKnowledgeBase);
	const deleteKbMutation = useMutation(api.rag.deleteKnowledgeBase);
	const toggleKbMutation = useMutation(api.rag.toggleKnowledgeBase);
	const storeChunksMutation = useMutation(api.rag.storeChunks);
	const logAnalyticsMutation = useMutation(api.rag.logRagAnalytics);
	const rateResultMutation = useMutation(api.rag.rateRagResult);

	// ── Actions ──────────────────────────────────────────────────────

	const setLevel = useCallback((level: RagLevel) => {
		storeSetRagLevel(level);
	}, []);

	const setEmbeddingConfig = useCallback((model: string, provider: string) => {
		storeSetRagEmbeddingConfig(model, provider);
	}, []);

	const createKnowledgeBase = useCallback(
		async (name: string, description?: string) => {
			if (!userId) return;
			const id = await createKbMutation({
				userId,
				name,
				description,
				ragLevel: ragLevel === "none" ? "minimal" : ragLevel,
				embeddingModel: embeddingConfig.model,
				embeddingProvider: embeddingConfig.provider,
			});
			setRagKnowledgeBaseId(id);
			return id;
		},
		[userId, ragLevel, embeddingConfig, createKbMutation],
	);

	const deleteKnowledgeBase = useCallback(
		async (id: string) => {
			await deleteKbMutation({ id: id as any });
			if (activeKbId === id) {
				setRagKnowledgeBaseId(undefined);
			}
		},
		[activeKbId, deleteKbMutation],
	);

	const selectKnowledgeBase = useCallback((id: string | undefined) => {
		setRagKnowledgeBaseId(id);
	}, []);

	/**
	 * Upload a text document: chunk it, optionally embed, store in Convex.
	 * Requires a documentId from the Convex `documents` table.
	 */
	const uploadDocument = useCallback(
		async (documentId: string, fileName: string, content: string) => {
			if (!userId || !activeKbId) {
				setUploadError("No user or knowledge base selected");
				return;
			}

			setUploading(true);
			setUploadError(null);

			try {
				const chunks = chunkText(content);

				await storeChunksMutation({
					userId,
					knowledgeBaseId: activeKbId as any,
					documentId: documentId as any,
					chunks: chunks.map((c) => ({
						text: c.text,
						chunkIndex: c.chunkIndex,
						tokenCount: c.tokenCount,
						page: c.page,
					})),
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Upload failed";
				setUploadError(msg);
				throw err;
			} finally {
				setUploading(false);
			}
		},
		[userId, activeKbId, storeChunksMutation],
	);

	/** Log an analytics event after a search completes */
	const logAnalytics = useCallback(
		async (event: {
			query: string;
			ragLevel: RagLevel;
			ragResultCount: number;
			webResultCount: number;
			mergedResultCount: number;
			addScoreRag?: number;
			addScoreWeb?: number;
			addScoreMerged: number;
			ragLatencyMs: number;
			webLatencyMs: number;
			totalLatencyMs: number;
			ragTokensUsed: number;
			searchHistoryId?: string;
		}) => {
			if (!userId) return;
			return await logAnalyticsMutation({
				userId,
				query: event.query,
				ragLevel: event.ragLevel,
				ragResultCount: event.ragResultCount,
				webResultCount: event.webResultCount,
				mergedResultCount: event.mergedResultCount,
				addScoreRag: event.addScoreRag,
				addScoreWeb: event.addScoreWeb,
				addScoreMerged: event.addScoreMerged,
				ragLatencyMs: event.ragLatencyMs,
				webLatencyMs: event.webLatencyMs,
				totalLatencyMs: event.totalLatencyMs,
				ragTokensUsed: event.ragTokensUsed,
				searchHistoryId: event.searchHistoryId as any,
			});
		},
		[userId, logAnalyticsMutation],
	);

	/** Rate a search result for analytics */
	const rateResult = useCallback(
		async (analyticsId: string, rating: number, preferredSource?: "rag" | "web" | "merged", feedback?: string) => {
			await rateResultMutation({
				id: analyticsId as any,
				userRating: rating,
				userPreferredSource: preferredSource,
				feedback,
			});
		},
		[rateResultMutation],
	);

	return {
		// State
		ragLevel,
		activeKbId,
		embeddingConfig,
		knowledgeBases: knowledgeBases ?? [],
		analyticsSummary,
		uploading,
		uploadError,
		// Actions
		setLevel,
		setEmbeddingConfig,
		createKnowledgeBase,
		deleteKnowledgeBase,
		selectKnowledgeBase,
		uploadDocument,
		logAnalytics,
		rateResult,
	};
}
