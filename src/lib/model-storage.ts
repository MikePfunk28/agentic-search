/**
 * Model Configuration Storage
 * Handles localStorage persistence for model configurations
 * Uses encrypted storage for API keys
 *
 * ⚠️ DEPRECATED: This file uses browser localStorage.
 * New code should use Convex secure storage (convex/secureApiKeys.ts)
 * which stores API keys server-side with proper encryption.
 */

import {
	isSecureStorageAvailable,
	migrateToEncryptedStorage,
	secureGetItem,
	secureSetItem,
	testEncryption,
	secureRemoveItem,
} from "./crypto-storage";
import type { ModelConfig } from "./model-config";

const STORAGE_KEY = "agentic-search-model-config";
const STORAGE_VERSION = "1.1"; // Bumped version for encryption support
const API_KEY_PREFIX = "api-key-"; // Prefix for API key storage

interface StoredConfig {
	version: string;
	activeConfigId: string;
	configs: Record<string, Omit<ModelConfig, "apiKey">>;
	updatedAt: number;
}

/**
 * Save a model configuration to localStorage and store any API key in encrypted secure storage.
 *
 * The configuration's API key (if present) is removed from the stored config and saved separately in encrypted secure storage. The saved configuration becomes the active config and the storage timestamp is updated.
 *
 * @param id - Identifier for the model configuration
 * @param config - The model configuration to save; if `config.apiKey` is present it will be stored in encrypted secure storage and not kept directly in localStorage
 * @throws Error if an API key is provided but secure storage is unavailable (unencrypted storage of API keys is not allowed)
 * @throws Any error encountered while persisting the configuration or secure storage operations
 */
export async function saveModelConfig(
	id: string,
	config: ModelConfig,
): Promise<void> {
	try {
		const stored = loadAllConfigs();

		// Separate API key from config
		const { apiKey, ...configWithoutKey } = config;
		const apiKeyRef = apiKey ? `${API_KEY_PREFIX}${id}` : undefined;

		// Store config without API key or API key reference
		stored.configs[id] = configWithoutKey;
		stored.activeConfigId = id;
		stored.updatedAt = Date.now();

		// Store encrypted API key separately if present
		if (apiKey && isSecureStorageAvailable()) {
			await secureSetItem(apiKeyRef!, apiKey);
		} else if (apiKey) {
			// SECURITY: Do not store unencrypted API keys
			throw new Error(
				"Secure storage not available. API keys cannot be stored securely. " +
				"Please use a modern browser with Web Crypto API support, or use Convex secure storage instead."
			);
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
	} catch (error) {
		console.error("Failed to save model config to localStorage:", error);
		throw error;
	}
}

/**
 * Load a saved model configuration by id, including decrypting its API key when present.
 *
 * @param id - The identifier of the model configuration to load
 * @returns The reconstructed `ModelConfig` with a decrypted `apiKey` if available, or `null` if the config is not found or loading fails
 */
export async function loadModelConfig(id: string): Promise<ModelConfig | null> {
	try {
		const stored = loadAllConfigs();
		const storedConfig = stored.configs[id];

		if (!storedConfig) return null;

		// Load and decrypt API key using the deterministic storage key
		let apiKey: string | undefined;
		const apiKeyRef = `${API_KEY_PREFIX}${id}`;
		if (localStorage.getItem(apiKeyRef)) {
			if (isSecureStorageAvailable()) {
				apiKey = (await secureGetItem(apiKeyRef)) || undefined;
			} else {
				// SECURITY: Refuse to load unencrypted keys
				console.error("Secure storage not available. Cannot load API keys securely.");
				throw new Error("Secure storage required to load API keys. Please use a modern browser.");
			}
		}

		return {
			...storedConfig,
			apiKey,
		} as ModelConfig;
	} catch (error) {
		console.error("Failed to load model config from localStorage:", error);
		return null;
	}
}

/**
 * Load active model configuration
 * Decrypts API key if present
 */
export async function loadActiveConfig(): Promise<{
	id: string;
	config: ModelConfig;
} | null> {
	try {
		const stored = loadAllConfigs();
		const activeId = stored.activeConfigId;

		if (!activeId || !stored.configs[activeId]) return null;

		const config = await loadModelConfig(activeId);
		if (!config) return null;

		return {
			id: activeId,
			config,
		};
	} catch (error) {
		console.error("Failed to load active config from localStorage:", error);
		return null;
	}
}

/**
 * Load all configurations from localStorage
 */
export function loadAllConfigs(): StoredConfig {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);

		if (!stored) {
			return createDefaultStorage();
		}

		const parsed = JSON.parse(stored) as StoredConfig;
		const sanitizedConfigs = Object.fromEntries(
			Object.entries(parsed.configs || {}).map(([id, config]) => {
				const { apiKey, apiKeyRef, ...rest } = (config || {}) as Record<
					string,
					unknown
				>;
				return [id, rest as Omit<ModelConfig, "apiKey">];
			}),
		) as StoredConfig["configs"];
		const sanitizedParsed: StoredConfig = {
			...parsed,
			configs: sanitizedConfigs,
		};

		// Check version - migration happens separately via initializeEncryptedStorage
		if (sanitizedParsed.version !== STORAGE_VERSION) {
			console.warn(
				`Storage version mismatch: ${sanitizedParsed.version} vs ${STORAGE_VERSION}. Call initializeEncryptedStorage() to migrate.`,
			);
			// Return as-is, migration will happen later
		}

		return sanitizedParsed;
	} catch (error) {
		console.error("Failed to load configs from localStorage:", error);
		return createDefaultStorage();
	}
}

/**
 * Delete specific configuration
 * Removes encrypted API key as well
 */
export function deleteModelConfig(id: string): void {
	try {
		const stored = loadAllConfigs();
		const config = stored.configs[id];

		// Remove encrypted API key if it exists
		if (config) {
			secureRemoveItem(`${API_KEY_PREFIX}${id}`);
		}

		delete stored.configs[id];

		// If we deleted the active config, reset to first available
		if (stored.activeConfigId === id) {
			const configIds = Object.keys(stored.configs);
			stored.activeConfigId = configIds.length > 0 ? configIds[0] : "";
		}

		stored.updatedAt = Date.now();
		const sanitizedStored = {
			...stored,
			configs: Object.fromEntries(
				Object.entries(stored.configs).map(([configId, storedConfig]) => {
					const { apiKey, apiKeyRef, ...rest } = storedConfig as any;
					return [configId, rest];
				}),
			),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedStored));
	} catch (error) {
		console.error("Failed to delete model config:", error);
	}
}

/**
 * Set active configuration
 */
export function setActiveConfig(id: string): boolean {
	try {
		const stored = loadAllConfigs();

		if (!stored.configs[id]) {
			console.error(`Config ${id} not found`);
			return false;
		}

		stored.activeConfigId = id;
		stored.updatedAt = Date.now();
		// Ensure no API keys or API key references are included in persisted config
		const sanitizedStored = {
			...stored,
			configs: Object.fromEntries(
				Object.entries(stored.configs).map(([id, config]) => {
					// Remove apiKey and apiKeyRef fields if present before persisting
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { apiKey, apiKeyRef, ...rest } = config as any;
					return [id, rest];
				}),
			),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedStored));

		return true;
	} catch (error) {
		console.error("Failed to set active config:", error);
		return false;
	}
}

/**
 * List all saved configuration IDs
 */
export function listConfigIds(): string[] {
	try {
		const stored = loadAllConfigs();
		return Object.keys(stored.configs);
	} catch (error) {
		console.error("Failed to list config IDs:", error);
		return [];
	}
}

/**
 * Clear all stored configurations
 * Removes all encrypted API keys as well
 */
export function clearAllConfigs(): void {
	try {
		const stored = loadAllConfigs();

		// Remove all encrypted API keys
		for (const id of Object.keys(stored.configs)) {
			localStorage.removeItem(`${API_KEY_PREFIX}${id}`);
		}

		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear configs:", error);
	}
}

/**
 * Export configurations as JSON
 */
export function exportConfigs(): string {
	try {
		const stored = loadAllConfigs();
		return JSON.stringify(
			{
				...stored,
				configs: Object.fromEntries(
					Object.entries(stored.configs).map(([id, config]) => {
						const { apiKey, apiKeyRef, ...rest } = config as any;
						return [id, rest];
					}),
				),
			},
			null,
			2,
		);
	} catch (error) {
		console.error("Failed to export configs:", error);
		return "{}";
	}
}

/**
 * Import configurations from JSON
 */
export function importConfigs(json: string): boolean {
	try {
		const parsed = JSON.parse(json) as StoredConfig;

		// Validate structure
		if (!parsed.configs || typeof parsed.configs !== "object") {
			throw new Error("Invalid config format");
		}

		const sanitizedParsed = {
			...parsed,
			configs: Object.fromEntries(
				Object.entries(parsed.configs).map(([id, config]) => {
					const { apiKey, apiKeyRef, ...rest } = config as any;
					return [id, rest];
				}),
			),
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedParsed));
		return true;
	} catch (error) {
		console.error("Failed to import configs:", error);
		return false;
	}
}

/**
 * Create default storage structure
 */
function createDefaultStorage(): StoredConfig {
	return {
		version: STORAGE_VERSION,
		activeConfigId: "",
		configs: {},
		updatedAt: Date.now(),
	};
}

/**
 * Migrate storage from old version to new version
 * Handles migration to encrypted API key storage
 */
async function migrateStorage(old: StoredConfig): Promise<StoredConfig> {
	console.log(
		`Migrating storage from version ${old.version} to ${STORAGE_VERSION}`,
	);

	try {
		// If migrating from v1.0 (unencrypted) to v1.1 (encrypted)
		if (old.version === "1.0" && isSecureStorageAvailable()) {
			console.log("Migrating API keys to encrypted storage...");

			const newConfigs: StoredConfig["configs"] = {};

			// Migrate each config
			for (const [id, config] of Object.entries(old.configs)) {
				const modelConfig = config as unknown as ModelConfig;
				const { apiKey, ...configWithoutKey } = modelConfig;

				// Store encrypted API key if present using the deterministic key
				if (apiKey) {
					await secureSetItem(`${API_KEY_PREFIX}${id}`, apiKey);
				}

				newConfigs[id] = configWithoutKey;
			}

			return {
				version: STORAGE_VERSION,
				activeConfigId: old.activeConfigId,
				configs: newConfigs,
				updatedAt: Date.now(),
			};
		}
	} catch (error) {
		console.error("Migration failed:", error);
	}

	// Fallback: create fresh storage
	console.warn("Could not migrate storage, creating new storage");
	return createDefaultStorage();
}

/**
 * Initialize encrypted storage on first use
 * Migrates existing unencrypted data if present
 */
export async function initializeEncryptedStorage(): Promise<void> {
	if (!isSecureStorageAvailable()) {
		console.warn(
			"Encrypted storage not available - Web Crypto API not supported",
		);
		return;
	}

	try {
		// Test encryption functionality
		const encryptionWorks = await testEncryption();
		if (!encryptionWorks) {
			throw new Error("Encryption test failed");
		}

		// Get all API key storage keys that need migration
		const stored = loadAllConfigs();
		const apiKeyRefs = Object.keys(stored.configs).map(
			(id) => `${API_KEY_PREFIX}${id}`,
		);

		// Migrate unencrypted API keys to encrypted storage
		await migrateToEncryptedStorage(apiKeyRefs);

		console.log("✅ Encrypted storage initialized successfully");
	} catch (error) {
		console.error("Failed to initialize encrypted storage:", error);
	}
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
	try {
		const test = "__storage_test__";
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (error) {
		return false;
	}
}
