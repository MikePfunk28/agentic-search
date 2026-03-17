/**
 * Unified Model Store
 * Single source of truth for all model configuration.
 *
 * SECURITY: ALL state is in-memory only. NOTHING is written to localStorage.
 * API keys for authenticated users are stored in Convex (server-side).
 * Model detection re-runs on every page load so persistence is not needed.
 */

import { z } from "zod";
import { detectLMStudioModels, detectOllamaModels } from "./ai/model-detection";
import { AVAILABLE_MODELS } from "./model-config";

// --- Zod Schemas ---

const LocalProviderSchema = z.object({
	baseUrl: z.string(),
	apiKey: z.string().optional(),
	detectedModels: z.array(z.string()),
	selectedModel: z.string().nullable(),
	lastDetected: z.number().optional(),
});

const CustomProviderSchema = z.object({
	id: z.string(),
	name: z.string(),
	baseUrl: z.string(),
	apiKey: z.string().optional(),
	models: z.array(z.string()),
	selectedModel: z.string().nullable(),
	protocol: z
		.enum(["openai-compatible", "anthropic"])
		.default("openai-compatible"),
});

const ActiveModelEntrySchema = z.object({
	provider: z.string(),
	model: z.string(),
	role: z
		.enum(["validator", "reasoner", "synthesizer", "orchestrator"])
		.default("reasoner"),
});

const RagLevelSchema = z
	.enum(["none", "minimal", "medium", "full"])
	.default("none");

const ModelStoreSchema = z.object({
	version: z.number().default(1),
	activeProvider: z.string().nullable(),
	activeModel: z.string().nullable(),
	/** Multiple active models for parallel execution */
	activeModels: z.array(ActiveModelEntrySchema).default([]),
	ollama: LocalProviderSchema.optional(),
	lmstudio: LocalProviderSchema.optional(),
	custom: z.array(CustomProviderSchema).default([]),
	firecrawlApiKey: z.string().optional(),
	tavilyApiKey: z.string().optional(),
	exaApiKey: z.string().optional(),
	braveApiKey: z.string().optional(),
	/** RAG pipeline level: none | minimal (BM25) | medium (+embeddings) | full (+crawl+graph) */
	ragLevel: RagLevelSchema.optional(),
	/** Active knowledge base ID (Convex doc ID string) */
	ragKnowledgeBaseId: z.string().optional(),
	/** Embedding model for medium/full RAG */
	ragEmbeddingModel: z.string().optional(),
	ragEmbeddingProvider: z.string().optional(),
});

export type RagLevel = z.infer<typeof RagLevelSchema>;
export type ActiveModelEntry = z.infer<typeof ActiveModelEntrySchema>;
export type LocalProvider = z.infer<typeof LocalProviderSchema>;
export type CustomProvider = z.infer<typeof CustomProviderSchema>;
export type ModelStore = z.infer<typeof ModelStoreSchema>;

// --- Constants ---

const DEFAULT_OLLAMA_URL = "http://localhost:11434";
const DEFAULT_LMSTUDIO_URL = "http://localhost:1234";

// --- Helpers ---

/**
 * Normalise a provider base URL so it always ends with exactly /v1.
 * Prevents double /v1/v1 when the stored URL already includes a /v1 suffix.
 */
function normalizeBaseUrl(url: string): string {
	return url.replace(/\/v1\/?$/, "").replace(/\/+$/, "") + "/v1";
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
	return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function cleanProviderUrl(baseUrl: string): string {
	return baseUrl.replace(/^\[/, "").replace(/\].*$/, "").trim().replace(/\/+$/, "");
}

function tryParseProviderUrl(baseUrl: string): URL | null {
	try {
		return new URL(baseUrl);
	} catch {
		return null;
	}
}

function buildDetectedModelList(
	knownModels: string[],
	preferredModel?: string,
): string[] {
	const manualModel = preferredModel?.trim();
	return uniqueStrings([manualModel, ...knownModels]);
}

function extractModelIds(payload: unknown): string[] {
	if (!payload || typeof payload !== "object") {
		return [];
	}

	const data = payload as {
		data?: Array<{ id?: string }>;
		models?: Array<{ id?: string; name?: string }>;
	};

	if (Array.isArray(data.data)) {
		return data.data
			.map((model) => model?.id?.trim())
			.filter((model): model is string => Boolean(model));
	}

	if (Array.isArray(data.models)) {
		return data.models
			.map((model) => model?.id?.trim() || model?.name?.trim())
			.filter((model): model is string => Boolean(model));
	}

	return [];
}

function buildOpenAIModelUrls(baseUrl: string): string[] {
	const cleanBase = cleanProviderUrl(baseUrl);
	const parsed = tryParseProviderUrl(cleanBase);
	const path = parsed?.pathname.toLowerCase() || "";
	const isVersionedPath = /\/v\d+(\/|$)/.test(path);

	if (cleanBase.endsWith("/v1")) {
		return [`${cleanBase}/models`];
	}

	if (isVersionedPath) {
		return [`${cleanBase}/models`];
	}

	return uniqueStrings([`${cleanBase}/v1/models`, `${cleanBase}/models`]);
}

function buildOpenAICompletionUrls(baseUrl: string): string[] {
	const cleanBase = cleanProviderUrl(baseUrl);
	const parsed = tryParseProviderUrl(cleanBase);
	const path = parsed?.pathname.toLowerCase() || "";
	const isVersionedPath = /\/v\d+(\/|$)/.test(path);

	if (cleanBase.endsWith("/v1")) {
		return [`${cleanBase}/chat/completions`];
	}

	if (isVersionedPath) {
		return [`${cleanBase}/chat/completions`];
	}

	return uniqueStrings([
		`${cleanBase}/v1/chat/completions`,
		`${cleanBase}/chat/completions`,
	]);
}

function buildAnthropicMessageUrls(baseUrl: string): string[] {
	const cleanBase = cleanProviderUrl(baseUrl);

	if (cleanBase.endsWith("/v1")) {
		return [`${cleanBase}/messages`];
	}

	return uniqueStrings([`${cleanBase}/v1/messages`, `${cleanBase}/messages`]);
}

interface ProviderDetectionHints {
	knownModels: string[];
	manualEntryMessage: string;
}

function getProviderDetectionHints(
	baseUrl: string,
	protocol: "openai-compatible" | "anthropic",
): ProviderDetectionHints {
	const parsed = tryParseProviderUrl(baseUrl);
	const host = parsed?.hostname.toLowerCase() || "";
	const path = parsed?.pathname.toLowerCase() || "";
	const isZai = host === "api.z.ai";

	if (isZai && path.includes("/api/anthropic")) {
		return {
			knownModels: ["glm-5", "glm-4.7", "glm-4.5-air"],
			manualEntryMessage:
				"Z.AI Anthropic-compatible endpoints do not expose Claude model listings. Using known GLM models instead.",
		};
	}

	if (isZai && path.includes("/api/coding/paas/")) {
		return {
			knownModels: [
				"glm-5",
				"glm-4.7",
				"glm-4.6",
				"glm-4.5",
				"glm-4.5-air",
				"glm-4.6v",
				"glm-4.5v",
			],
			manualEntryMessage:
				"This Z.AI coding endpoint does not publish a standard /models list. Enter a model manually or use the known coding models.",
		};
	}

	if (isZai && path.includes("/api/paas/")) {
		return {
			knownModels: [
				"glm-5",
				"glm-5-code",
				"glm-4.7",
				"glm-4.7-flash",
				"glm-4.6",
				"glm-4.5",
				"glm-4.5-x",
				"glm-4.5-air",
				"glm-4.5-flash",
			],
			manualEntryMessage:
				"Automatic model listing is limited for this Z.AI endpoint. Enter a model manually if detection cannot confirm it.",
		};
	}

	if (protocol === "anthropic") {
		return {
			knownModels: [...AVAILABLE_MODELS.Anthropic],
			manualEntryMessage:
				"This Anthropic-compatible endpoint does not expose a model list. Enter a model manually if needed.",
		};
	}

	return {
		knownModels: [],
		manualEntryMessage:
			"Automatic model detection is unavailable for this endpoint. Enter a model name manually and add the provider.",
	};
}

// --- In-Memory Store (no localStorage, no persistence) ---

let _memoryStore: ModelStore = createDefaultStore();

// --- Store Functions ---

/**
 * Get the current model store from memory.
 * Returns a default empty store if nothing has been set.
 * SECURITY: No localStorage reads — all state is volatile.
 */
export function getModelStore(): ModelStore {
	return _memoryStore;
}

/**
 * Save the model store to memory.
 * SECURITY: No localStorage writes — all state is volatile.
 */
export function setModelStore(store: ModelStore): void {
	try {
		_memoryStore = ModelStoreSchema.parse(store);
	} catch (error) {
		console.error("[ModelStore] Failed to validate store:", error);
	}
}

/**
 * Get the active model configuration for use by the search API.
 * Returns null if no model is configured/active.
 */
export function getActiveModelConfig(): {
	provider: string;
	model: string;
	baseUrl: string;
	apiKey?: string;
	protocol: "openai-compatible" | "anthropic";
} | null {
	const store = getModelStore();

	if (!store.activeProvider || !store.activeModel) {
		return null;
	}

	if (store.activeProvider === "ollama" && store.ollama) {
		const rawUrl = store.ollama.baseUrl || "";
		try {
			new URL(rawUrl);
		} catch {
			return null;
		} // Invalid stored URL — bail
		return {
			provider: "ollama",
			model: store.activeModel,
			baseUrl: normalizeBaseUrl(rawUrl),
			apiKey: store.ollama.apiKey,
			protocol: "openai-compatible",
		};
	}

	if (store.activeProvider === "lmstudio" && store.lmstudio) {
		const rawUrl = store.lmstudio.baseUrl || "";
		try {
			new URL(rawUrl);
		} catch {
			return null;
		} // Invalid stored URL — bail
		return {
			provider: "lm_studio",
			model: store.activeModel,
			baseUrl: normalizeBaseUrl(rawUrl),
			apiKey: store.lmstudio.apiKey,
			protocol: "openai-compatible",
		};
	}

	// Custom providers
	const customProvider = store.custom.find(
		(c) => c.id === store.activeProvider,
	);
	if (customProvider) {
		return {
			provider: customProvider.id,
			model: store.activeModel,
			baseUrl: customProvider.baseUrl,
			apiKey: customProvider.apiKey,
			protocol: customProvider.protocol,
		};
	}

	return null;
}

/** Resolved config for a single active model */
export interface ResolvedModelConfig {
	provider: string;
	model: string;
	baseUrl: string;
	apiKey?: string;
	protocol: "openai-compatible" | "anthropic";
	role: "validator" | "reasoner" | "synthesizer" | "orchestrator";
}

/**
 * Resolve a provider+model pair into a full config with baseUrl/apiKey.
 */
function resolveModelConfig(
	store: ModelStore,
	provider: string,
	model: string,
	role: "validator" | "reasoner" | "synthesizer" | "orchestrator" = "reasoner",
): ResolvedModelConfig | null {
	if (provider === "ollama" && store.ollama) {
		return {
			provider: "ollama",
			model,
			baseUrl: normalizeBaseUrl(store.ollama.baseUrl),
			apiKey: store.ollama.apiKey,
			protocol: "openai-compatible",
			role,
		};
	}
	if (provider === "lmstudio" && store.lmstudio) {
		return {
			provider: "lm_studio",
			model,
			baseUrl: normalizeBaseUrl(store.lmstudio.baseUrl),
			apiKey: store.lmstudio.apiKey,
			protocol: "openai-compatible",
			role,
		};
	}
	const customProvider = store.custom.find((c) => c.id === provider);
	if (customProvider) {
		return {
			provider: customProvider.id,
			model,
			baseUrl: customProvider.baseUrl,
			apiKey: customProvider.apiKey,
			protocol: customProvider.protocol,
			role,
		};
	}
	return null;
}

/**
 * Get ALL active model configurations for parallel execution.
 * Falls back to the single activeProvider/activeModel if no activeModels array.
 */
export function getActiveModelConfigs(): ResolvedModelConfig[] {
	const store = getModelStore();

	// If multi-model array has entries, use those
	if (store.activeModels && store.activeModels.length > 0) {
		const configs: ResolvedModelConfig[] = [];
		for (const entry of store.activeModels) {
			const resolved = resolveModelConfig(
				store,
				entry.provider,
				entry.model,
				entry.role,
			);
			if (resolved) configs.push(resolved);
		}
		if (configs.length > 0) return configs;
	}

	// Fallback to single active model
	if (store.activeProvider && store.activeModel) {
		const resolved = resolveModelConfig(
			store,
			store.activeProvider,
			store.activeModel,
		);
		if (resolved) return [resolved];
	}

	return [];
}

/**
 * Toggle a model on/off in the activeModels list.
 * Returns true if the model was added, false if removed.
 */
export function toggleActiveModel(
	provider: string,
	model: string,
	role: "validator" | "reasoner" | "synthesizer" | "orchestrator" = "reasoner",
): boolean {
	const store = getModelStore();

	const existingIdx = store.activeModels.findIndex(
		(m) => m.provider === provider && m.model === model,
	);

	if (existingIdx !== -1) {
		// Remove it
		store.activeModels.splice(existingIdx, 1);
		// Keep legacy fields in sync with first active model
		if (store.activeModels.length > 0) {
			store.activeProvider = store.activeModels[0].provider;
			store.activeModel = store.activeModels[0].model;
		} else {
			store.activeProvider = null;
			store.activeModel = null;
		}
		setModelStore(store);
		return false;
	}

	// Add it
	store.activeModels.push({ provider, model, role });
	// Keep legacy fields in sync
	if (store.activeModels.length === 1) {
		store.activeProvider = provider;
		store.activeModel = model;
	}
	setModelStore(store);
	return true;
}

/**
 * Update the role for an active model.
 */
export function updateActiveModelRole(
	provider: string,
	model: string,
	role: "validator" | "reasoner" | "synthesizer" | "orchestrator",
): void {
	const store = getModelStore();
	const entry = store.activeModels.find(
		(m) => m.provider === provider && m.model === model,
	);
	if (entry) {
		entry.role = role;
		setModelStore(store);
	}
}

/**
 * Check if a specific model is in the active list.
 */
export function isModelActive(provider: string, model: string): boolean {
	const store = getModelStore();
	// Check multi-model array
	if (store.activeModels.length > 0) {
		return store.activeModels.some(
			(m) => m.provider === provider && m.model === model,
		);
	}
	// Fallback to legacy single model
	return store.activeProvider === provider && store.activeModel === model;
}

/**
 * Get the Firecrawl API key from the store.
 */
export function getFirecrawlApiKey(): string | undefined {
	const store = getModelStore();
	return store.firecrawlApiKey;
}

/**
 * Get all search provider API keys from the store.
 */
export function getSearchApiKeys(): {
	firecrawl?: string;
	tavily?: string;
	exa?: string;
	brave?: string;
} {
	const store = getModelStore();
	return {
		firecrawl: store.firecrawlApiKey,
		tavily: store.tavilyApiKey,
		exa: store.exaApiKey,
		brave: store.braveApiKey,
	};
}

/**
 * Set a search provider API key.
 */
export function setSearchApiKey(
	provider: "firecrawl" | "tavily" | "exa" | "brave",
	key: string,
): void {
	const store = getModelStore();
	const keyMap = {
		firecrawl: "firecrawlApiKey" as const,
		tavily: "tavilyApiKey" as const,
		exa: "exaApiKey" as const,
		brave: "braveApiKey" as const,
	};
	store[keyMap[provider]] = key || undefined;
	setModelStore(store);
}

/**
 * Get all client config needed by the search endpoints.
 * Returns all active models for parallel execution.
 */
export function getClientSearchConfig(): {
	modelConfig: ReturnType<typeof getActiveModelConfig>;
	modelConfigs: ResolvedModelConfig[];
	searchApiKeys: ReturnType<typeof getSearchApiKeys>;
} {
	return {
		modelConfig: getActiveModelConfig(),
		modelConfigs: getActiveModelConfigs(),
		searchApiKeys: getSearchApiKeys(),
	};
}

/**
 * Check if a local provider (Ollama, LM Studio, etc.) is reachable.
 * Used before attempting parallel execution to avoid wasting resources.
 */
export async function checkProviderHealth(baseUrl: string): Promise<boolean> {
	try {
		const cleanUrl = baseUrl.replace(/\/v1\/?$/, "");
		const response = await fetch(`${cleanUrl}/api/tags`, {
			signal: AbortSignal.timeout(3000),
		});
		return response.ok;
	} catch {
		// Try OpenAI-compatible /v1/models fallback
		try {
			const v1Url = baseUrl.endsWith("/v1")
				? `${baseUrl}/models`
				: `${baseUrl}/v1/models`;
			const res = await fetch(v1Url, { signal: AbortSignal.timeout(3000) });
			return res.ok;
		} catch {
			return false;
		}
	}
}

/**
 * Detect locally running models (Ollama + LM Studio) and update the store.
 * Returns the updated store.
 */
export async function detectAndUpdateLocalModels(): Promise<ModelStore> {
	const store = getModelStore();
	const now = Date.now();

	// Detect Ollama models
	const ollamaBaseUrl = store.ollama?.baseUrl || DEFAULT_OLLAMA_URL;
	const ollamaModels = await detectOllamaModels(ollamaBaseUrl);

	if (ollamaModels.length > 0) {
		const modelIds = ollamaModels.map((m) => m.modelId);
		const currentSelected = store.ollama?.selectedModel;
		// Keep current selection if still valid, otherwise use the first detected
		const selectedModel =
			currentSelected && modelIds.includes(currentSelected)
				? currentSelected
				: modelIds[0];

		store.ollama = {
			baseUrl: ollamaBaseUrl,
			apiKey: store.ollama?.apiKey,
			detectedModels: modelIds,
			selectedModel,
			lastDetected: now,
		};

		// Auto-activate if nothing else is active
		if (!store.activeProvider) {
			store.activeProvider = "ollama";
			store.activeModel = selectedModel;
		}
	} else {
		// Ollama not running - clear detected models but keep config
		if (store.ollama) {
			store.ollama.detectedModels = [];
			store.ollama.lastDetected = now;
		}
	}

	// Detect LM Studio models
	const lmstudioBaseUrl = store.lmstudio?.baseUrl || DEFAULT_LMSTUDIO_URL;
	const lmstudioModels = await detectLMStudioModels(lmstudioBaseUrl);

	if (lmstudioModels.length > 0) {
		const modelIds = lmstudioModels.map((m) => m.modelId);
		const currentSelected = store.lmstudio?.selectedModel;
		const selectedModel =
			currentSelected && modelIds.includes(currentSelected)
				? currentSelected
				: modelIds[0];

		store.lmstudio = {
			baseUrl: lmstudioBaseUrl,
			apiKey: store.lmstudio?.apiKey,
			detectedModels: modelIds,
			selectedModel,
			lastDetected: now,
		};

		// Auto-activate if nothing else is active
		if (!store.activeProvider) {
			store.activeProvider = "lmstudio";
			store.activeModel = selectedModel;
		}
	} else {
		if (store.lmstudio) {
			store.lmstudio.detectedModels = [];
			store.lmstudio.lastDetected = now;
		}
	}

	setModelStore(store);
	return store;
}

/**
 * Well-known Anthropic models returned as a static fallback since Anthropic
 * has no /v1/models listing endpoint.
 * Single source of truth: src/lib/model-config.ts AVAILABLE_MODELS.Anthropic
 */
const ANTHROPIC_KNOWN_MODELS: string[] = [...AVAILABLE_MODELS.Anthropic];

/**
 * Detect models for a custom provider.
 * For OpenAI-compatible APIs, calls /v1/models.
 * For Anthropic protocol, returns a static list (Anthropic has no listing endpoint)
 * and validates the API key with a lightweight request.
 */
export async function detectCustomProviderModels(
	baseUrl: string,
	apiKey?: string,
	protocol: "openai-compatible" | "anthropic" = "openai-compatible",
	options: { preferredModel?: string } = {},
): Promise<{ models: string[]; error: string | null }> {
	// Ensure the URL is absolute — strip any accidental markdown link syntax
	const cleanedUrl = cleanProviderUrl(baseUrl);
	if (!/^https?:\/\//i.test(cleanedUrl)) {
		console.warn("[ModelStore] Invalid provider URL (not absolute):", baseUrl);
		return { models: [], error: "Invalid provider URL: must be an absolute http/https URL" };
	}
	baseUrl = cleanedUrl;
	const hints = getProviderDetectionHints(baseUrl, protocol);
	const fallbackModels = buildDetectedModelList(
		hints.knownModels,
		options.preferredModel,
	);

	// Anthropic protocol: no /v1/models endpoint exists.
	// Validate the key with a minimal request, then return known models.
	if (protocol === "anthropic") {
		if (!apiKey) {
			return { models: fallbackModels, error: null };
		}

		let lastStatus: number | null = null;
		let lastError: string | null = null;
		const probeModel = fallbackModels[0] || ANTHROPIC_KNOWN_MODELS[0];

		for (const messagesUrl of buildAnthropicMessageUrls(baseUrl)) {
			try {
				const response = await fetch(messagesUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": apiKey,
						"anthropic-version": "2023-06-01",
					},
					body: JSON.stringify({
						model: probeModel,
						max_tokens: 1,
						messages: [{ role: "user", content: "hi" }],
					}),
					signal: AbortSignal.timeout(10000),
				});

				if (response.ok || response.status === 400 || response.status === 429) {
					return { models: fallbackModels, error: null };
				}

				if (response.status === 401 || response.status === 403) {
					console.warn("[ModelStore] Anthropic API key is invalid (401/403)");
					return { models: [], error: "Invalid API key or unauthorized" };
				}

				lastStatus = response.status;
			} catch (error) {
				lastError = classifyDetectionError(error);
			}
		}

		if (fallbackModels.length > 0) {
			return {
				models: fallbackModels,
				error:
					lastStatus && lastStatus !== 404
						? `Connected, but automatic model detection is unavailable (HTTP ${lastStatus}).`
						: lastError,
			};
		}

		return {
			models: [],
			error:
				lastStatus !== null
					? `Failed to detect models: HTTP ${lastStatus}`
					: lastError || hints.manualEntryMessage,
		};
	}

	// OpenAI-compatible: call /v1/models
	// Route localhost URLs through server proxy (miniflare blocks browser→localhost)
	const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
		baseUrl,
	);
	try {
		let response: Response;
		if (isLocalhost) {
			response = await fetch("/api/detect-models", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					provider: "custom",
					baseUrl,
					...(apiKey ? { apiKey } : {}),
				}),
				signal: AbortSignal.timeout(10000),
			});
			if (response.ok) {
				const data = await response.json();
				return { models: data.models || [], error: null };
			}
			if (response.status === 401 || response.status === 403) {
				return { models: [], error: "Invalid API key or unauthorized" };
			}
			return { models: [], error: `Failed to detect models: HTTP ${response.status}` };
		}

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};
		if (apiKey) {
			headers.Authorization = `Bearer ${apiKey}`;
		}

		let lastStatus: number | null = null;
		for (const modelsUrl of buildOpenAIModelUrls(baseUrl)) {
			response = await fetch(modelsUrl, {
				method: "GET",
				headers,
				signal: AbortSignal.timeout(10000),
			});

			if (!response.ok) {
				console.warn("[ModelStore] Custom provider returned", response.status);
				if (response.status === 401 || response.status === 403) {
					return { models: [], error: "Invalid API key or unauthorized" };
				}
				lastStatus = response.status;
				continue;
			}

			const detectedModels = extractModelIds(await response.json());
			if (detectedModels.length > 0) {
				return { models: detectedModels, error: null };
			}
		}

		const probeModel = fallbackModels[0];
		if (probeModel) {
			for (const completionsUrl of buildOpenAICompletionUrls(baseUrl)) {
				response = await fetch(completionsUrl, {
					method: "POST",
					headers,
					body: JSON.stringify({
						model: probeModel,
						messages: [{ role: "user", content: "hi" }],
						max_tokens: 1,
					}),
					signal: AbortSignal.timeout(10000),
				});

				if (response.ok || response.status === 400 || response.status === 429) {
					return { models: fallbackModels, error: null };
				}

				if (response.status === 401 || response.status === 403) {
					return { models: [], error: "Invalid API key or unauthorized" };
				}

				lastStatus = response.status;
			}
		}

		return {
			models: fallbackModels,
			error:
				fallbackModels.length > 0
					? null
					: lastStatus !== null
						? `Failed to detect models: HTTP ${lastStatus}. ${hints.manualEntryMessage}`
						: hints.manualEntryMessage,
		};
	} catch (error) {
		const classified = classifyDetectionError(error);
		console.warn(
			"[ModelStore] Failed to detect models from custom provider:",
			classified,
		);
		return {
			models: fallbackModels,
			error: fallbackModels.length > 0 ? null : classified,
		};
	}
}

/**
 * Classify a fetch/network error into a user-readable message.
 */
function classifyDetectionError(error: unknown): string {
	if (error instanceof DOMException && error.name === "TimeoutError") {
		return "Detection timed out";
	}
	if (error instanceof Error) {
		const msg = error.message.toLowerCase();
		if (msg.includes("timeout") || msg.includes("timed out")) {
			return "Detection timed out";
		}
		return `Failed to detect models: ${error.message}`;
	}
	return `Failed to detect models: ${String(error)}`;
}

/**
 * Add a custom provider to the store.
 */
export function addCustomProvider(
	provider: Omit<CustomProvider, "id">,
): CustomProvider {
	const store = getModelStore();
	const id = `custom-${Date.now()}`;
	const newProvider: CustomProvider = { ...provider, id };

	store.custom.push(newProvider);

	// Auto-activate if nothing else is active
	if (!store.activeProvider && newProvider.selectedModel) {
		store.activeProvider = id;
		store.activeModel = newProvider.selectedModel;
	}

	setModelStore(store);
	return newProvider;
}

/**
 * Update a custom provider in the store.
 */
export function updateCustomProvider(
	id: string,
	updates: Partial<CustomProvider>,
): void {
	const store = getModelStore();
	const index = store.custom.findIndex((c) => c.id === id);
	if (index === -1) return;

	store.custom[index] = { ...store.custom[index], ...updates, id };
	setModelStore(store);
}

/**
 * Remove a custom provider from the store.
 */
export function removeCustomProvider(id: string): void {
	const store = getModelStore();
	store.custom = store.custom.filter((c) => c.id !== id);

	// Clear active if it was the removed provider
	if (store.activeProvider === id) {
		store.activeProvider = null;
		store.activeModel = null;
	}

	setModelStore(store);
}

/**
 * Set the active provider and model.
 * Also adds it to the activeModels array if not already present.
 */
export function setActiveModel(provider: string, model: string): void {
	const store = getModelStore();
	store.activeProvider = provider;
	store.activeModel = model;

	// Also add to multi-model list if not there
	const exists = store.activeModels.some(
		(m) => m.provider === provider && m.model === model,
	);
	if (!exists) {
		store.activeModels.push({ provider, model, role: "reasoner" });
	}

	setModelStore(store);
}

/**
 * Set the Firecrawl API key.
 */
export function setFirecrawlApiKey(key: string): void {
	const store = getModelStore();
	store.firecrawlApiKey = key || undefined;
	setModelStore(store);
}

// --- RAG Configuration ---

/** Get the current RAG level */
export function getRagLevel(): RagLevel {
	return getModelStore().ragLevel ?? "none";
}

/** Set the RAG level */
export function setRagLevel(level: RagLevel): void {
	const store = getModelStore();
	store.ragLevel = level;
	setModelStore(store);
}

/** Get the active knowledge base ID */
export function getRagKnowledgeBaseId(): string | undefined {
	return getModelStore().ragKnowledgeBaseId;
}

/** Set the active knowledge base ID */
export function setRagKnowledgeBaseId(id: string | undefined): void {
	const store = getModelStore();
	store.ragKnowledgeBaseId = id;
	setModelStore(store);
}

/** Get RAG embedding config */
export function getRagEmbeddingConfig(): { model?: string; provider?: string } {
	const store = getModelStore();
	return {
		model: store.ragEmbeddingModel,
		provider: store.ragEmbeddingProvider,
	};
}

/** Set RAG embedding config */
export function setRagEmbeddingConfig(model: string, provider: string): void {
	const store = getModelStore();
	store.ragEmbeddingModel = model;
	store.ragEmbeddingProvider = provider;
	setModelStore(store);
}

/**
 * Migration stub — localStorage migration is no longer needed.
 * API keys are now stored in Convex (server-side).
 * Kept for backward compatibility with callers.
 */
export function migrateFromOldStorage(): boolean {
	return false;
}

// --- Helpers ---

function createDefaultStore(): ModelStore {
	return {
		version: 1,
		activeProvider: null,
		activeModel: null,
		activeModels: [],
		ollama: {
			baseUrl: DEFAULT_OLLAMA_URL,
			detectedModels: [],
			selectedModel: null,
		},
		lmstudio: {
			baseUrl: DEFAULT_LMSTUDIO_URL,
			detectedModels: [],
			selectedModel: null,
		},
		custom: [],
	};
}
