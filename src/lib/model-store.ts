/**
 * Unified Model Store
 * Single source of truth for all model configuration.
 * Replaces the 3 separate localStorage keys that never talked to each other.
 *
 * Storage key: 'agentic-search-model-store'
 */

import { z } from "zod";
import { detectLMStudioModels, detectOllamaModels } from "./ai/model-detection";

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

const STORAGE_KEY = "agentic-search-model-store";

const DEFAULT_OLLAMA_URL = "http://localhost:11434";
const DEFAULT_LMSTUDIO_URL = "http://localhost:1234";

interface VolatileSecrets {
	ollamaApiKey?: string;
	lmstudioApiKey?: string;
	customApiKeys: Record<string, string | undefined>;
	firecrawlApiKey?: string;
	tavilyApiKey?: string;
	exaApiKey?: string;
	braveApiKey?: string;
}

const volatileSecrets: VolatileSecrets = {
	customApiKeys: {},
};

function captureVolatileSecrets(store: ModelStore): void {
	volatileSecrets.ollamaApiKey = store.ollama?.apiKey;
	volatileSecrets.lmstudioApiKey = store.lmstudio?.apiKey;
	volatileSecrets.customApiKeys = Object.fromEntries(
		store.custom
			.filter((provider) => !!provider.apiKey)
			.map((provider) => [provider.id, provider.apiKey]),
	);
	volatileSecrets.firecrawlApiKey = store.firecrawlApiKey;
	volatileSecrets.tavilyApiKey = store.tavilyApiKey;
	volatileSecrets.exaApiKey = store.exaApiKey;
	volatileSecrets.braveApiKey = store.braveApiKey;
}

function stripSecretsForPersistence(store: ModelStore): ModelStore {
	return {
		...store,
		ollama: store.ollama
			? {
					...store.ollama,
					apiKey: undefined,
				}
			: store.ollama,
		lmstudio: store.lmstudio
			? {
					...store.lmstudio,
					apiKey: undefined,
				}
			: store.lmstudio,
		custom: store.custom.map((provider) => ({
			...provider,
			apiKey: undefined,
		})),
		firecrawlApiKey: undefined,
		tavilyApiKey: undefined,
		exaApiKey: undefined,
		braveApiKey: undefined,
	};
}

function hydrateStoreWithVolatileSecrets(store: ModelStore): ModelStore {
	return {
		...store,
		ollama: store.ollama
			? {
					...store.ollama,
					apiKey: volatileSecrets.ollamaApiKey,
				}
			: store.ollama,
		lmstudio: store.lmstudio
			? {
					...store.lmstudio,
					apiKey: volatileSecrets.lmstudioApiKey,
				}
			: store.lmstudio,
		custom: store.custom.map((provider) => ({
			...provider,
			apiKey: volatileSecrets.customApiKeys[provider.id],
		})),
		firecrawlApiKey: volatileSecrets.firecrawlApiKey,
		tavilyApiKey: volatileSecrets.tavilyApiKey,
		exaApiKey: volatileSecrets.exaApiKey,
		braveApiKey: volatileSecrets.braveApiKey,
	};
}

function hasPersistedSecrets(store: ModelStore): boolean {
	return Boolean(
		store.ollama?.apiKey ||
			store.lmstudio?.apiKey ||
			store.custom.some((provider) => !!provider.apiKey) ||
			store.firecrawlApiKey ||
			store.tavilyApiKey ||
			store.exaApiKey ||
			store.braveApiKey,
	);
}

// --- Store Functions ---

/**
 * Get the current model store from localStorage.
 * Returns a default empty store if nothing is saved.
 */
export function getModelStore(): ModelStore {
	if (typeof window === "undefined") {
		return createDefaultStore();
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return createDefaultStore();

		const parsed = ModelStoreSchema.parse(JSON.parse(raw));
		captureVolatileSecrets(parsed);
		const sanitized = stripSecretsForPersistence(parsed);
		if (hasPersistedSecrets(parsed)) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
			console.warn(
				"[ModelStore] Removed persisted API keys from localStorage; keys are now session-volatile until secure backend storage is used.",
			);
		}
		return hydrateStoreWithVolatileSecrets(sanitized);
	} catch (error) {
		console.warn(
			"[ModelStore] Failed to parse stored config, using defaults:",
			error,
		);
		return createDefaultStore();
	}
}

/**
 * Save the model store to localStorage.
 */
export function setModelStore(store: ModelStore): void {
	if (typeof window === "undefined") return;

	try {
		const validated = ModelStoreSchema.parse(store);
		captureVolatileSecrets(validated);
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(stripSecretsForPersistence(validated)),
		);
	} catch (error) {
		console.error("[ModelStore] Failed to save store:", error);
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
			baseUrl: `${rawUrl.replace(/\/+$/, "")}/v1`,
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
			baseUrl: `${rawUrl.replace(/\/+$/, "")}/v1`,
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
			baseUrl: `${store.ollama.baseUrl}/v1`,
			apiKey: store.ollama.apiKey,
			protocol: "openai-compatible",
			role,
		};
	}
	if (provider === "lmstudio" && store.lmstudio) {
		return {
			provider: "lm_studio",
			model,
			baseUrl: `${store.lmstudio.baseUrl}/v1`,
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
 */
const ANTHROPIC_KNOWN_MODELS = [
	"claude-opus-4-6",
	"claude-sonnet-4-6",
	"claude-opus-4-20250514",
	"claude-sonnet-4-20250514",
	"claude-haiku-4-5-20251001",
	"claude-sonnet-4-5-20250929",
];

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
): Promise<string[]> {
	// Ensure the URL is absolute — strip any accidental markdown link syntax
	const cleanedUrl = baseUrl.replace(/^\[/, "").replace(/\].*$/, "").trim();
	if (!/^https?:\/\//i.test(cleanedUrl)) {
		console.warn("[ModelStore] Invalid provider URL (not absolute):", baseUrl);
		return [];
	}
	baseUrl = cleanedUrl;

	// Anthropic protocol: no /v1/models endpoint exists.
	// Validate the key with a minimal request, then return known models.
	if (protocol === "anthropic") {
		if (!apiKey) {
			console.warn("[ModelStore] Anthropic requires an API key");
			return ANTHROPIC_KNOWN_MODELS; // Return list anyway so user can pick
		}
		try {
			const cleanBase = baseUrl.replace(/\/+$/, "");
			const response = await fetch(`${cleanBase}/v1/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": apiKey,
					"anthropic-version": "2023-06-01",
				},
				body: JSON.stringify({
					model: "claude-haiku-4-5-20251001",
					max_tokens: 1,
					messages: [{ role: "user", content: "hi" }],
				}),
				signal: AbortSignal.timeout(8000),
			});
			// Any response (even 400 for bad model) means the key/URL works
			if (response.ok || response.status === 400 || response.status === 429) {
				console.log("[ModelStore] Anthropic API key validated successfully");
				return ANTHROPIC_KNOWN_MODELS;
			}
			if (response.status === 401) {
				console.warn("[ModelStore] Anthropic API key is invalid (401)");
				return [];
			}
			console.warn("[ModelStore] Anthropic returned status", response.status);
			return ANTHROPIC_KNOWN_MODELS;
		} catch (error) {
			console.warn("[ModelStore] Failed to validate Anthropic key:", error);
			return ANTHROPIC_KNOWN_MODELS; // Return models anyway, let user try
		}
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
				signal: AbortSignal.timeout(8000),
			});
			if (response.ok) {
				const data = await response.json();
				return data.models || [];
			}
			return [];
		}

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};
		if (apiKey) {
			headers.Authorization = `Bearer ${apiKey}`;
		}

		const modelsUrl = baseUrl.endsWith("/v1")
			? `${baseUrl}/models`
			: baseUrl.endsWith("/v1/")
				? `${baseUrl}models`
				: `${baseUrl}/v1/models`;

		response = await fetch(modelsUrl, {
			method: "GET",
			headers,
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			console.warn("[ModelStore] Custom provider returned", response.status);
			return [];
		}

		const data = await response.json();
		// OpenAI-compatible format: { data: [{ id: "model-name" }] }
		if (data.data && Array.isArray(data.data)) {
			return data.data.map((m: { id: string }) => m.id);
		}
		// Some providers return { models: [{ name: "model-name" }] }
		if (data.models && Array.isArray(data.models)) {
			return data.models.map(
				(m: { name?: string; id?: string }) => m.name || m.id || "",
			);
		}

		return [];
	} catch (error) {
		console.warn(
			"[ModelStore] Failed to detect models from custom provider:",
			error,
		);
		return [];
	}
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
 * Migrate data from the old scattered localStorage keys to the unified store.
 * Run once on first load if old keys exist.
 */
export function migrateFromOldStorage(): boolean {
	if (typeof window === "undefined") return false;

	const store = getModelStore();
	let migrated = false;

	// Migrate from 'agentic-search-api-keys' (dashes - SettingsModal)
	try {
		const oldKeys = localStorage.getItem("agentic-search-api-keys");
		if (oldKeys) {
			const parsed = JSON.parse(oldKeys);
			if (parsed.firecrawl?.apiKey && !store.firecrawlApiKey) {
				store.firecrawlApiKey = parsed.firecrawl.apiKey;
				migrated = true;
			}
			// Migrate cloud API keys as custom providers
			for (const [provider, config] of Object.entries(parsed)) {
				const cfg = config as { apiKey?: string; baseUrl?: string };
				if (provider !== "firecrawl" && provider !== "ollama" && cfg?.apiKey) {
					const existing = store.custom.find(
						(c) => c.name.toLowerCase() === provider,
					);
					if (!existing) {
						store.custom.push({
							id: `migrated-${provider}`,
							name: provider.charAt(0).toUpperCase() + provider.slice(1),
							baseUrl: cfg.baseUrl || `https://api.${provider}.com/v1`,
							apiKey: cfg.apiKey,
							models: [],
							selectedModel: null,
							protocol:
								provider === "anthropic" ? "anthropic" : "openai-compatible",
						});
						migrated = true;
					}
				}
			}
		}
	} catch (error) {
		console.warn("[ModelStore] Migration from old keys failed:", error);
	}

	// Migrate from 'agentic-search-custom-models' (SettingsModal custom tab)
	try {
		const oldModels = localStorage.getItem("agentic-search-custom-models");
		if (oldModels) {
			const parsed = JSON.parse(oldModels);
			if (Array.isArray(parsed)) {
				for (const model of parsed) {
					if (model.provider === "ollama" && model.name) {
						// Add to Ollama detected list if not already there
						if (!store.ollama) {
							store.ollama = {
								baseUrl: model.baseUrl || DEFAULT_OLLAMA_URL,
								detectedModels: [model.name],
								selectedModel: model.name,
							};
						} else if (!store.ollama.detectedModels.includes(model.name)) {
							store.ollama.detectedModels.push(model.name);
						}
						migrated = true;
					}
				}
			}
		}
	} catch (error) {
		console.warn(
			"[ModelStore] Migration from old custom models failed:",
			error,
		);
	}

	if (migrated) {
		setModelStore(store);
		console.log("[ModelStore] Migrated data from old localStorage keys");
	}

	return migrated;
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
