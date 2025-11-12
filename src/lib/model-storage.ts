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
} from "./crypto-storage";
import type { ModelConfig } from "./model-config";

const STORAGE_KEY = "agentic-search-model-config";
const STORAGE_VERSION = "1.1"; // Bumped version for encryption support
const API_KEY_PREFIX = "api-key-"; // Prefix for API key storage

interface StoredConfig {
	version: string;
	activeConfigId: string;
	configs: Record<string, Omit<ModelConfig, "apiKey"> & { apiKeyRef?: string }>;
	updatedAt: number;
}

/**
 * Save model configuration to localStorage
 * API keys are encrypted and stored separately
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

		// Store config without API key
		stored.configs[id] = {
			...configWithoutKey,
			apiKeyRef,
		};
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
 * Load specific model configuration from localStorage
 * Decrypts API key if present
 */
export async function loadModelConfig(id: string): Promise<ModelConfig | null> {
	try {
		const stored = loadAllConfigs();
		const storedConfig = stored.configs[id];

		if (!storedConfig) return null;

		// Load and decrypt API key if reference exists
		let apiKey: string | undefined;
		if (storedConfig.apiKeyRef) {
			if (isSecureStorageAvailable()) {
				apiKey = (await secureGetItem(storedConfig.apiKeyRef)) || undefined;
			} else {
				// SECURITY: Refuse to load unencrypted keys
				console.error("Secure storage not available. Cannot load API keys securely.");
				throw new Error("Secure storage required to load API keys. Please use a modern browser.");
			}
		}

		// Reconstruct full config with decrypted API key
		const { apiKeyRef, ...configWithoutRef } = storedConfig;
		return {
			...configWithoutRef,
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

		// Check version - migration happens separately via initializeEncryptedStorage
		if (parsed.version !== STORAGE_VERSION) {
			console.warn(
				`Storage version mismatch: ${parsed.version} vs ${STORAGE_VERSION}. Call initializeEncryptedStorage() to migrate.`,
			);
			// Return as-is, migration will happen later
		}

		return parsed;
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
		if (config?.apiKeyRef) {
			localStorage.removeItem(config.apiKeyRef);
		}

		delete stored.configs[id];

		// If we deleted the active config, reset to first available
		if (stored.activeConfigId === id) {
			const configIds = Object.keys(stored.configs);
			stored.activeConfigId = configIds.length > 0 ? configIds[0] : "";
		}

		stored.updatedAt = Date.now();
		localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
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
		localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

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
		for (const config of Object.values(stored.configs)) {
			if (config.apiKeyRef) {
				localStorage.removeItem(config.apiKeyRef);
			}
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
		return JSON.stringify(stored, null, 2);
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

		localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
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

				// Create reference for API key
				const apiKeyRef = apiKey ? `${API_KEY_PREFIX}${id}` : undefined;

				// Store encrypted API key if present
				if (apiKey) {
					await secureSetItem(apiKeyRef!, apiKey);
				}

				newConfigs[id] = {
					...configWithoutKey,
					apiKeyRef,
				};
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

		// Get all API key references that need migration
		const stored = loadAllConfigs();
		const apiKeyRefs = Object.values(stored.configs)
			.map((c) => c.apiKeyRef)
			.filter((ref): ref is string => !!ref);

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
