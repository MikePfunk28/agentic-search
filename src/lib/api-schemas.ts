/**
 * Shared Zod schemas for API route request validation.
 * Import from here in all API route handlers to keep validation in one place.
 */

import { z } from "zod";

const modelConfigSchema = z.object({
	provider: z.string(),
	model: z.string(),
	apiKey: z.string().optional(),
	baseUrl: z.string().optional(),
});

export const searchRequestSchema = z.object({
	query: z.string().min(1).max(2000),
	useParallelModels: z.boolean().optional().default(true),
	useInterleavedReasoning: z.boolean().optional().default(true),
	useSegmentation: z.boolean().optional().default(false),
	modelConfig: modelConfigSchema.optional(),
	modelConfigs: z.array(modelConfigSchema).optional(),
	searchApiKeys: z.record(z.string(), z.string()).optional(),
	ragConfig: z.any().optional(),
});

export const chatRequestSchema = z.object({
	messages: z
		.array(
			z.object({
				role: z.string().min(1),
				content: z.string().min(1),
			}),
		)
		.min(1),
	modelProvider: z.string().optional(),
	model: z.string().optional(),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
