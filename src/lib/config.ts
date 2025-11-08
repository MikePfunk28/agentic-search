/**
 * Configuration Management
 * Handles user preferences, API keys, and model selection
 */

import type { APIKeyStatus, UserConfig } from "./types";

const CONFIG_STORAGE_KEY = "agentic-search-config";

/**
 * Get default configuration
 */
export function getDefaultConfig(): UserConfig {
	return {
		modelProvider: "local",
		apiKeys: {},
		preferences: {
			enableOCR: true,
			enableADDScoring: true,
			parallelSearch: true,
			maxResults: 10,
		},
	};
}

/**
 * Load configuration from localStorage
 */
export function loadConfig(): UserConfig {
	try {
		const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
		if (!stored) return getDefaultConfig();

		const config = JSON.parse(stored) as UserConfig;
		return { ...getDefaultConfig(), ...config };
	} catch (error) {
		console.error("[Config] Failed to load configuration:", error);
		return getDefaultConfig();
	}
}

/**
 * Save configuration to localStorage
 */
export function saveConfig(config: UserConfig): void {
	try {
		localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
	} catch (error) {
		console.error("[Config] Failed to save configuration:", error);
		throw new Error("Failed to save configuration");
	}
}

/**
 * Update a specific API key
 */
export function updateAPIKey(
	provider: keyof UserConfig["apiKeys"],
	key: string,
): UserConfig {
	const config = loadConfig();
	config.apiKeys[provider] = key;
	saveConfig(config);
	return config;
}

/**
 * Validate an API key (basic format check)
 */
export function validateAPIKey(provider: string, key: string): APIKeyStatus {
	const now = Date.now();

	// Basic validation rules
	const validations: Record<string, RegExp> = {
		anthropic: /^sk-ant-/,
		openai: /^sk-/,
		deepseek: /^sk-/,
		autumn: /.+/,
		firecrawl: /.+/,
	};

	const regex = validations[provider];
	if (!regex) {
		return {
			provider,
			isValid: false,
			lastChecked: now,
			error: "Unknown provider",
		};
	}

	const isValid = regex.test(key);
	return {
		provider,
		isValid,
		lastChecked: now,
		error: isValid ? undefined : "Invalid API key format",
	};
}

/**
 * Mask API key for display (show first 8 and last 4 characters)
 */
export function maskAPIKey(key: string): string {
	if (key.length < 12) return "*".repeat(key.length);
	return `${key.substring(0, 8)}${"*".repeat(key.length - 12)}${key.substring(key.length - 4)}`;
}
