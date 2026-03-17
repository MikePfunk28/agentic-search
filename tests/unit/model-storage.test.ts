import { beforeEach, describe, expect, test, vi } from "vitest";

const cryptoStorageMocks = vi.hoisted(() => ({
	secureGetItem: vi.fn(),
	secureRemoveItem: vi.fn(),
	secureSetItem: vi.fn(),
}));

vi.mock("../../src/lib/crypto-storage", () => ({
	isSecureStorageAvailable: vi.fn(() => true),
	migrateToEncryptedStorage: vi.fn(async () => ({ success: [], failed: [] })),
	secureGetItem: cryptoStorageMocks.secureGetItem,
	secureRemoveItem: cryptoStorageMocks.secureRemoveItem,
	secureSetItem: cryptoStorageMocks.secureSetItem,
	testEncryption: vi.fn(async () => true),
}));

import {
	loadModelConfig,
	saveModelConfig,
	setActiveConfig,
} from "../../src/lib/model-storage";
import { ModelProvider, type ModelConfig } from "../../src/lib/model-config";

function createStorageMock() {
	const data = new Map<string, string>();

	return {
		getItem: vi.fn((key: string) => data.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			data.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			data.delete(key);
		}),
		clear: vi.fn(() => {
			data.clear();
		}),
	};
}

describe("model-storage", () => {
	const localStorageMock = createStorageMock();

	beforeEach(() => {
		cryptoStorageMocks.secureGetItem.mockReset();
		cryptoStorageMocks.secureRemoveItem.mockReset();
		cryptoStorageMocks.secureSetItem.mockReset();
		localStorageMock.clear();
		vi.stubGlobal("localStorage", localStorageMock);
	});

	test("saveModelConfig stores only sanitized config metadata in localStorage", async () => {
		const config: ModelConfig = {
			provider: ModelProvider.OPENAI,
			model: "gpt-5.1",
			baseUrl: "https://api.openai.com/v1",
			apiKey: "sk-secret",
			temperature: 0.7,
			maxTokens: 4096,
			timeout: 60000,
			enableStreaming: false,
		};

		await saveModelConfig("primary", config);

		expect(cryptoStorageMocks.secureSetItem).toHaveBeenCalledWith(
			"api-key-primary",
			"sk-secret",
		);

		const rawStored = localStorageMock.getItem("agentic-search-model-config");
		expect(rawStored).not.toBeNull();
		const parsed = JSON.parse(rawStored!);
		expect(parsed.configs.primary.apiKey).toBeUndefined();
		expect(parsed.configs.primary.apiKeyRef).toBeUndefined();
		expect(parsed.configs.primary.provider).toBe(ModelProvider.OPENAI);
	});

	test("loadModelConfig derives the encrypted key reference from the config id", async () => {
		localStorageMock.setItem(
			"agentic-search-model-config",
			JSON.stringify({
				version: "1.1",
				activeConfigId: "primary",
				configs: {
					primary: {
						provider: ModelProvider.OPENAI,
						model: "gpt-5.1",
						baseUrl: "https://api.openai.com/v1",
						temperature: 0.7,
						maxTokens: 4096,
						timeout: 60000,
						enableStreaming: false,
					},
				},
				updatedAt: Date.now(),
			}),
		);
		localStorageMock.setItem("api-key-primary", "encrypted-value");
		cryptoStorageMocks.secureGetItem.mockResolvedValue("sk-secret");

		const config = await loadModelConfig("primary");

		expect(cryptoStorageMocks.secureGetItem).toHaveBeenCalledWith(
			"api-key-primary",
		);
		expect(config?.apiKey).toBe("sk-secret");
	});

	test("setActiveConfig persists a sanitized representation without apiKeyRef", () => {
		localStorageMock.setItem(
			"agentic-search-model-config",
			JSON.stringify({
				version: "1.1",
				activeConfigId: "",
				configs: {
					primary: {
						provider: ModelProvider.OPENAI,
						model: "gpt-5.1",
						baseUrl: "https://api.openai.com/v1",
						apiKeyRef: "api-key-primary",
						temperature: 0.7,
						maxTokens: 4096,
						timeout: 60000,
						enableStreaming: false,
					},
				},
				updatedAt: Date.now(),
			}),
		);

		expect(setActiveConfig("primary")).toBe(true);

		const rawStored = localStorageMock.getItem("agentic-search-model-config");
		expect(rawStored).not.toBeNull();
		const parsed = JSON.parse(rawStored!);
		expect(parsed.configs.primary.apiKeyRef).toBeUndefined();
	});
});
