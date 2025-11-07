/**
 * Unit Tests for Configuration Management
 * Tests localStorage operations, API key validation, and user preferences
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadConfig,
  saveConfig,
  updateAPIKey,
  validateAPIKey,
  maskAPIKey,
  getDefaultConfig,
} from '../src/lib/config';
import type { UserConfig } from '../src/lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Configuration Management', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('getDefaultConfig', () => {
    it('should return default configuration', () => {
      const config = getDefaultConfig();

      expect(config.modelProvider).toBe('local');
      expect(config.apiKeys).toEqual({});
      expect(config.preferences.enableOCR).toBe(true);
      expect(config.preferences.enableADDScoring).toBe(true);
      expect(config.preferences.parallelSearch).toBe(true);
      expect(config.preferences.maxResults).toBe(10);
    });

    it('should always return fresh object', () => {
      const config1 = getDefaultConfig();
      const config2 = getDefaultConfig();

      expect(config1).not.toBe(config2);
      expect(config1).toEqual(config2);
    });
  });

  describe('loadConfig', () => {
    it('should load configuration from localStorage', () => {
      const testConfig: UserConfig = {
        modelProvider: 'anthropic',
        apiKeys: {
          anthropic: 'sk-ant-test123',
        },
        preferences: {
          enableOCR: false,
          enableADDScoring: true,
          parallelSearch: false,
          maxResults: 20,
        },
      };

      localStorageMock.setItem('agentic-search-config', JSON.stringify(testConfig));

      const loaded = loadConfig();
      expect(loaded).toEqual(testConfig);
    });

    it('should return default config when localStorage is empty', () => {
      const loaded = loadConfig();
      expect(loaded).toEqual(getDefaultConfig());
    });

    it('should handle corrupted localStorage data gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem('agentic-search-config', 'invalid-json{');

      const loaded = loadConfig();
      expect(loaded).toEqual(getDefaultConfig());
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should merge with defaults for partial config', () => {
      const partialConfig = {
        modelProvider: 'openai',
      };

      localStorageMock.setItem('agentic-search-config', JSON.stringify(partialConfig));

      const loaded = loadConfig();
      expect(loaded.modelProvider).toBe('openai');
      expect(loaded.preferences).toEqual(getDefaultConfig().preferences);
    });
  });

  describe('saveConfig', () => {
    it('should save configuration to localStorage', () => {
      const config: UserConfig = {
        modelProvider: 'anthropic',
        apiKeys: {
          anthropic: 'sk-ant-test123',
        },
        preferences: {
          enableOCR: true,
          enableADDScoring: true,
          parallelSearch: true,
          maxResults: 15,
        },
      };

      saveConfig(config);

      const stored = localStorageMock.getItem('agentic-search-config');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(config);
    });

    it('should throw error when localStorage fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalSetItem = localStorageMock.setItem;

      localStorageMock.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const config = getDefaultConfig();
      expect(() => saveConfig(config)).toThrow('Failed to save configuration');

      localStorageMock.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });

    it('should overwrite existing configuration', () => {
      const config1: UserConfig = {
        modelProvider: 'local',
        apiKeys: {},
        preferences: {
          enableOCR: true,
          enableADDScoring: true,
          parallelSearch: true,
          maxResults: 10,
        },
      };

      const config2: UserConfig = {
        modelProvider: 'anthropic',
        apiKeys: { anthropic: 'sk-ant-test' },
        preferences: {
          enableOCR: false,
          enableADDScoring: false,
          parallelSearch: false,
          maxResults: 5,
        },
      };

      saveConfig(config1);
      saveConfig(config2);

      const loaded = loadConfig();
      expect(loaded).toEqual(config2);
    });
  });

  describe('updateAPIKey', () => {
    it('should update API key and save to localStorage', () => {
      const initialConfig = getDefaultConfig();
      saveConfig(initialConfig);

      const updated = updateAPIKey('anthropic', 'sk-ant-new-key');

      expect(updated.apiKeys.anthropic).toBe('sk-ant-new-key');

      const loaded = loadConfig();
      expect(loaded.apiKeys.anthropic).toBe('sk-ant-new-key');
    });

    it('should update multiple API keys independently', () => {
      updateAPIKey('anthropic', 'sk-ant-key1');
      updateAPIKey('openai', 'sk-openai-key1');
      updateAPIKey('deepseek', 'sk-deepseek-key1');

      const loaded = loadConfig();
      expect(loaded.apiKeys.anthropic).toBe('sk-ant-key1');
      expect(loaded.apiKeys.openai).toBe('sk-openai-key1');
      expect(loaded.apiKeys.deepseek).toBe('sk-deepseek-key1');
    });

    it('should overwrite existing API key', () => {
      updateAPIKey('anthropic', 'sk-ant-old');
      updateAPIKey('anthropic', 'sk-ant-new');

      const loaded = loadConfig();
      expect(loaded.apiKeys.anthropic).toBe('sk-ant-new');
    });

    it('should preserve other configuration when updating API key', () => {
      const config: UserConfig = {
        modelProvider: 'openai',
        apiKeys: {},
        preferences: {
          enableOCR: false,
          enableADDScoring: false,
          parallelSearch: false,
          maxResults: 25,
        },
      };

      saveConfig(config);
      updateAPIKey('openai', 'sk-test');

      const loaded = loadConfig();
      expect(loaded.modelProvider).toBe('openai');
      expect(loaded.preferences.maxResults).toBe(25);
    });
  });

  describe('validateAPIKey', () => {
    it('should validate Anthropic API key format', () => {
      const valid = validateAPIKey('anthropic', 'sk-ant-test123');
      expect(valid.isValid).toBe(true);
      expect(valid.error).toBeUndefined();

      const invalid = validateAPIKey('anthropic', 'invalid-key');
      expect(invalid.isValid).toBe(false);
      expect(invalid.error).toBe('Invalid API key format');
    });

    it('should validate OpenAI API key format', () => {
      const valid = validateAPIKey('openai', 'sk-test123');
      expect(valid.isValid).toBe(true);

      const invalid = validateAPIKey('openai', 'invalid-key');
      expect(invalid.isValid).toBe(false);
    });

    it('should validate DeepSeek API key format', () => {
      const valid = validateAPIKey('deepseek', 'sk-deepseek123');
      expect(valid.isValid).toBe(true);

      const invalid = validateAPIKey('deepseek', 'no-sk-prefix');
      expect(invalid.isValid).toBe(false);
    });

    it('should accept any non-empty key for autumn and firecrawl', () => {
      const autumnValid = validateAPIKey('autumn', 'any-key-format');
      expect(autumnValid.isValid).toBe(true);

      const firecrawlValid = validateAPIKey('firecrawl', 'fc-test123');
      expect(firecrawlValid.isValid).toBe(true);
    });

    it('should return error for unknown provider', () => {
      const result = validateAPIKey('unknown-provider', 'test-key');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unknown provider');
    });

    it('should include lastChecked timestamp', () => {
      const before = Date.now();
      const result = validateAPIKey('anthropic', 'sk-ant-test');
      const after = Date.now();

      expect(result.lastChecked).toBeGreaterThanOrEqual(before);
      expect(result.lastChecked).toBeLessThanOrEqual(after);
    });

    it('should handle empty API keys', () => {
      const result = validateAPIKey('anthropic', '');
      expect(result.isValid).toBe(false);
    });
  });

  describe('maskAPIKey', () => {
    it('should mask API key showing first 8 and last 4 characters', () => {
      const key = 'sk-ant-1234567890abcdef';
      const masked = maskAPIKey(key);

      // Should show first 8 and last 4, rest masked
      expect(masked.substring(0, 8)).toBe(key.substring(0, 8));
      expect(masked.substring(masked.length - 4)).toBe(key.substring(key.length - 4));
      expect(masked).toContain('*');
      expect(masked.length).toBe(key.length);
    });

    it('should fully mask short keys', () => {
      const shortKey = 'short';
      const masked = maskAPIKey(shortKey);

      expect(masked).toBe('*****');
      expect(masked.length).toBe(shortKey.length);
    });

    it('should handle keys exactly 12 characters', () => {
      const key = '123456789012';
      const masked = maskAPIKey(key);

      expect(masked).toBe('123456789012');
    });

    it('should mask long API keys correctly', () => {
      const longKey = 'sk-ant-api-key-1234567890abcdefghijklmnopqrstuvwxyz';
      const masked = maskAPIKey(longKey);

      expect(masked.substring(0, 8)).toBe(longKey.substring(0, 8));
      expect(masked.substring(masked.length - 4)).toBe(longKey.substring(longKey.length - 4));
      expect(masked).toContain('*');
    });

    it('should not reveal actual key in masked version', () => {
      const secretKey = 'sk-ant-secret-api-key-12345';
      const masked = maskAPIKey(secretKey);

      expect(masked).not.toContain('secret');
      expect(masked).not.toBe(secretKey);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete configuration workflow', () => {
      // Initial state
      const config1 = loadConfig();
      expect(config1.modelProvider).toBe('local');

      // Update provider
      config1.modelProvider = 'anthropic';
      saveConfig(config1);

      // Add API key
      updateAPIKey('anthropic', 'sk-ant-test123');

      // Validate
      const validation = validateAPIKey('anthropic', 'sk-ant-test123');
      expect(validation.isValid).toBe(true);

      // Load and verify
      const config2 = loadConfig();
      expect(config2.modelProvider).toBe('anthropic');
      expect(config2.apiKeys.anthropic).toBe('sk-ant-test123');

      // Mask for display
      const masked = maskAPIKey(config2.apiKeys.anthropic!);
      expect(masked).toContain('*');
    });

    it('should handle switching between multiple providers', () => {
      // Set up OpenAI
      updateAPIKey('openai', 'sk-openai-test');
      let config = loadConfig();
      config.modelProvider = 'openai';
      saveConfig(config);

      expect(loadConfig().modelProvider).toBe('openai');

      // Switch to Anthropic
      updateAPIKey('anthropic', 'sk-ant-test');
      config = loadConfig();
      config.modelProvider = 'anthropic';
      saveConfig(config);

      expect(loadConfig().modelProvider).toBe('anthropic');

      // Both keys should be preserved
      const final = loadConfig();
      expect(final.apiKeys.openai).toBe('sk-openai-test');
      expect(final.apiKeys.anthropic).toBe('sk-ant-test');
    });

    it('should persist preferences across API key updates', () => {
      const config = loadConfig();
      config.preferences.maxResults = 50;
      config.preferences.enableOCR = false;
      saveConfig(config);

      updateAPIKey('openai', 'sk-test');

      const loaded = loadConfig();
      expect(loaded.preferences.maxResults).toBe(50);
      expect(loaded.preferences.enableOCR).toBe(false);
    });
  });

  describe('Security', () => {
    it('should not expose API keys in console errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      localStorageMock.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const config = getDefaultConfig();
      config.apiKeys.anthropic = 'sk-ant-secret-key';

      try {
        saveConfig(config);
      } catch (error) {
        // Expected
      }

      const errorLogs = consoleSpy.mock.calls.map(call => JSON.stringify(call));
      errorLogs.forEach(log => {
        expect(log).not.toContain('sk-ant-secret-key');
      });

      consoleSpy.mockRestore();
    });
  });
});
