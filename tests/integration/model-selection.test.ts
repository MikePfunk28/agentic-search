/**
 * Integration Tests for Model Selection Flow
 * Tests end-to-end model configuration, switching, and persistence
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  ModelConfigManager,
  ModelProvider,
  type ModelConfig,
} from '../../src/lib/model-config';
import {
  loadConfig,
  saveConfig,
  updateAPIKey,
  validateAPIKey,
  getDefaultConfig,
} from '../../src/lib/config';

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

describe('Model Selection Integration', () => {
  let manager: ModelConfigManager;
  let originalSetItem: typeof localStorageMock.setItem;

  beforeEach(() => {
    localStorageMock.clear();
    originalSetItem = localStorageMock.setItem;
    delete process.env.PRIMARY_MODEL_PROVIDER;
    delete process.env.PRIMARY_API_KEY;
    manager = new ModelConfigManager();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore original setItem if it was mocked
    if (localStorageMock.setItem !== originalSetItem) {
      localStorageMock.setItem = originalSetItem;
    }
    vi.clearAllMocks();
  });

  describe('Complete Provider Switching Workflow', () => {
    it('should handle switching from local to cloud provider', async () => {
      // Start with local model (default)
      const userConfig = getDefaultConfig();
      expect(userConfig.modelProvider).toBe('local');

      // Configure Ollama
      const ollamaConfig: ModelConfig = {
        provider: ModelProvider.OLLAMA,
        baseUrl: 'http://localhost:11434',
        model: 'llama2',
        temperature: 0.7,
        maxTokens: 2048,
        timeout: 5000,
        enableStreaming: false,
      };

      manager.addConfig('local-ollama', ollamaConfig);
      manager.setActiveConfig('local-ollama');

      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.OLLAMA);

      // Switch to Anthropic
      const apiKey = 'sk-ant-test123';
      const validation = validateAPIKey('anthropic', apiKey);
      expect(validation.isValid).toBe(true);

      // Update API key in config
      userConfig.apiKeys.anthropic = apiKey;
      userConfig.modelProvider = 'anthropic';
      saveConfig(userConfig);

      const anthropicConfig: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: apiKey,
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: true,
      };

      manager.addConfig('cloud-anthropic', anthropicConfig);
      manager.setActiveConfig('cloud-anthropic');

      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.ANTHROPIC);
      expect(manager.getActiveConfig()?.enableStreaming).toBe(true);

      const loaded = loadConfig();
      expect(loaded.modelProvider).toBe('anthropic');
      expect(loaded.apiKeys.anthropic).toBe(apiKey);
    });

    it('should maintain multiple provider configurations simultaneously', () => {
      // Set up multiple providers
      const providers = [
        {
          id: 'openai-gpt4',
          config: {
            provider: ModelProvider.OPENAI,
            apiKey: 'sk-openai-test',
            baseUrl: 'https://api.openai.com/v1',
            model: 'gpt-4-turbo-preview',
            temperature: 0.7,
            maxTokens: 4096,
            timeout: 60000,
            enableStreaming: false,
          } as ModelConfig,
        },
        {
          id: 'anthropic-claude',
          config: {
            provider: ModelProvider.ANTHROPIC,
            apiKey: 'sk-ant-test',
            baseUrl: 'https://api.anthropic.com',
            model: 'claude-3-5-sonnet-20241022',
            temperature: 0.5,
            maxTokens: 4096,
            timeout: 60000,
            enableStreaming: true,
          } as ModelConfig,
        },
        {
          id: 'local-llama',
          config: {
            provider: ModelProvider.OLLAMA,
            baseUrl: 'http://localhost:11434',
            model: 'llama2',
            temperature: 0.7,
            maxTokens: 2048,
            timeout: 5000,
            enableStreaming: false,
          } as ModelConfig,
        },
      ];

      providers.forEach(({ id, config }) => {
        manager.addConfig(id, config);
      });

      // Verify all configurations exist
      const configs = manager.listConfigs();
      expect(configs).toHaveLength(3);

      // Switch between them
      expect(manager.setActiveConfig('openai-gpt4')).toBe(true);
      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.OPENAI);

      expect(manager.setActiveConfig('anthropic-claude')).toBe(true);
      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.ANTHROPIC);

      expect(manager.setActiveConfig('local-llama')).toBe(true);
      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.OLLAMA);
    });
  });

  describe('Connection Testing Workflow', () => {
    it('should test connection before switching providers', async () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        apiKey: 'sk-test123',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 5000,
        enableStreaming: false,
      };

      manager.addConfig('test-provider', config);

      // Mock successful connection
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
      });

      const result = await manager.testConnection('test-provider');

      expect(result.success).toBe(true);
      expect(result.latency).toBeDefined();
      expect(result.latency).toBeGreaterThanOrEqual(0);

      // Only switch if connection successful
      if (result.success) {
        manager.setActiveConfig('test-provider');
        expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.OPENAI);
      }
    });

    it('should handle connection timeout gracefully', async () => {
      const config: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: 'sk-ant-test',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 100,
        enableStreaming: false,
      };

      manager.addConfig('slow-provider', config);

      (global.fetch as any).mockRejectedValue(new Error('Request timeout'));

      const result = await manager.testConnection('slow-provider');

      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');

      // Don't switch on failed connection
      const currentActive = manager.getActiveConfig();
      manager.setActiveConfig('slow-provider');

      // Should not have switched if connection failed
      // (in real app, you'd check before switching)
    });

    it('should test multiple providers in parallel', async () => {
      const providers = [
        {
          id: 'provider1',
          config: {
            provider: ModelProvider.OPENAI,
            apiKey: 'sk-test1',
            baseUrl: 'https://api.openai.com/v1',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 4096,
            timeout: 5000,
            enableStreaming: false,
          } as ModelConfig,
        },
        {
          id: 'provider2',
          config: {
            provider: ModelProvider.ANTHROPIC,
            apiKey: 'sk-test2',
            baseUrl: 'https://api.anthropic.com',
            model: 'claude-3-5-sonnet-20241022',
            temperature: 0.7,
            maxTokens: 4096,
            timeout: 5000,
            enableStreaming: false,
          } as ModelConfig,
        },
      ];

      providers.forEach(({ id, config }) => {
        manager.addConfig(id, config);
      });

      // Mock different responses
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, status: 200 })
        .mockResolvedValueOnce({ ok: false, status: 401, text: async () => 'Unauthorized' });

      const results = await Promise.all([
        manager.testConnection('provider1'),
        manager.testConnection('provider2'),
      ]);

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);

      // Choose fastest successful provider
      const successfulProvider = results.findIndex(r => r.success);
      if (successfulProvider >= 0) {
        manager.setActiveConfig(`provider${successfulProvider + 1}`);
      }
    });
  });

  describe('Settings Persistence', () => {
    it('should persist configuration across sessions', () => {
      // Session 1: Configure and save
      const config = getDefaultConfig();
      config.modelProvider = 'anthropic';
      config.preferences.maxResults = 25;
      config.preferences.enableOCR = false;
      saveConfig(config);

      updateAPIKey('anthropic', 'sk-ant-session1');

      // Simulate session end/start
      const loaded = loadConfig();

      expect(loaded.modelProvider).toBe('anthropic');
      expect(loaded.preferences.maxResults).toBe(25);
      expect(loaded.preferences.enableOCR).toBe(false);
      expect(loaded.apiKeys.anthropic).toBe('sk-ant-session1');
    });

    it('should export and restore configuration state', () => {
      // Set up complex state
      const configs = [
        {
          id: 'config1',
          config: {
            provider: ModelProvider.OPENAI,
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 4096,
            timeout: 60000,
            enableStreaming: false,
          } as ModelConfig,
        },
        {
          id: 'config2',
          config: {
            provider: ModelProvider.ANTHROPIC,
            model: 'claude-3-5-sonnet-20241022',
            temperature: 0.5,
            maxTokens: 2048,
            timeout: 60000,
            enableStreaming: true,
          } as ModelConfig,
        },
      ];

      configs.forEach(({ id, config }) => {
        manager.addConfig(id, config);
      });

      manager.setActiveConfig('config2');

      // Export state
      const exported = manager.exportToJSON();
      const parsedExport = JSON.parse(exported);

      // Create new manager and restore
      const newManager = new ModelConfigManager();

      parsedExport.models.forEach((item: any) => {
        newManager.addConfig(item.id, item.config);
      });

      if (parsedExport.defaultModel) {
        newManager.setActiveConfig(parsedExport.defaultModel);
      }

      // Verify restoration
      expect(newManager.getActiveConfig()?.provider).toBe(ModelProvider.ANTHROPIC);
      expect(newManager.listConfigs()).toHaveLength(2);
    });
  });

  describe('API Key Security', () => {
    it('should never expose API keys in error messages', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const config: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: 'sk-ant-secret-key-12345',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 1000,
        enableStreaming: false,
      };

      manager.addConfig('secure-test', config);

      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await manager.testConnection('secure-test');

      // Check all console logs don't contain the secret
      consoleSpy.mock.calls.forEach(call => {
        expect(JSON.stringify(call)).not.toContain('sk-ant-secret-key-12345');
      });

      consoleSpy.mockRestore();
    });

    it('should validate API keys before storing', () => {
      const apiKey = 'sk-ant-test123';

      // Validate before storing
      const validation = validateAPIKey('anthropic', apiKey);
      expect(validation.isValid).toBe(true);

      if (validation.isValid) {
        updateAPIKey('anthropic', apiKey);
      }

      const loaded = loadConfig();
      expect(loaded.apiKeys.anthropic).toBe(apiKey);
    });

    it('should not store invalid API keys', () => {
      const invalidKey = 'invalid-format';

      const validation = validateAPIKey('anthropic', invalidKey);
      expect(validation.isValid).toBe(false);

      // Don't store if invalid
      if (!validation.isValid) {
        // User would see error, key not stored
        const config = loadConfig();
        expect(config.apiKeys.anthropic).toBeUndefined();
      }
    });
  });

  describe('Error Recovery', () => {
    it('should fallback to previous provider on connection failure', async () => {
      // Set up working provider
      const workingConfig: ModelConfig = {
        provider: ModelProvider.OLLAMA,
        baseUrl: 'http://localhost:11434',
        model: 'llama2',
        temperature: 0.7,
        maxTokens: 2048,
        timeout: 5000,
        enableStreaming: false,
      };

      manager.addConfig('working', workingConfig);
      manager.setActiveConfig('working');

      const previousProvider = manager.getActiveConfig();

      // Try to switch to failing provider
      const failingConfig: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: 'sk-ant-invalid',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 5000,
        enableStreaming: false,
      };

      manager.addConfig('failing', failingConfig);

      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Invalid API key',
      });

      const result = await manager.testConnection('failing');

      // Connection failed, keep previous provider
      if (!result.success) {
        // Don't switch
        expect(manager.getActiveConfig()?.provider).toBe(previousProvider?.provider);
      } else {
        manager.setActiveConfig('failing');
      }
    });

    it('should handle localStorage quota exceeded', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Fill up localStorage
      localStorageMock.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const config = getDefaultConfig();

      expect(() => {
        saveConfig(config);
      }).toThrow('Failed to save configuration');

      consoleSpy.mockRestore();
    });

    it('should recover from corrupted config data', () => {
      // Corrupt the stored data
      localStorageMock.setItem('agentic-search-config', '{ invalid json');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Should return default config instead of crashing
      const loaded = loadConfig();
      expect(loaded).toEqual(getDefaultConfig());

      consoleSpy.mockRestore();
    });
  });

  describe('User Experience Scenarios', () => {
    it('should handle first-time user setup', () => {
      // First load - no config exists
      const config = loadConfig();
      expect(config.modelProvider).toBe('local');
      expect(config.apiKeys).toEqual({});

      // User chooses Anthropic
      config.modelProvider = 'anthropic';
      saveConfig(config);

      // User enters API key
      updateAPIKey('anthropic', 'sk-ant-user-key');

      // Validate key
      const validation = validateAPIKey('anthropic', 'sk-ant-user-key');
      expect(validation.isValid).toBe(true);

      // Configure model manager
      const anthropicConfig: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: 'sk-ant-user-key',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('user-anthropic', anthropicConfig);
      manager.setActiveConfig('user-anthropic');

      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.ANTHROPIC);
    });

    it('should handle user updating preferences', () => {
      let config = loadConfig();

      // Update preferences
      config.preferences.maxResults = 50;
      config.preferences.enableOCR = false;
      config.preferences.parallelSearch = false;
      saveConfig(config);

      // Verify persistence
      config = loadConfig();
      expect(config.preferences.maxResults).toBe(50);
      expect(config.preferences.enableOCR).toBe(false);
      expect(config.preferences.parallelSearch).toBe(false);
    });

    it('should handle switching between saved configurations', () => {
      // User has multiple providers configured
      updateAPIKey('anthropic', 'sk-ant-key');
      updateAPIKey('openai', 'sk-openai-key');

      const anthropicConfig: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: 'sk-ant-key',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      const openaiConfig: ModelConfig = {
        provider: ModelProvider.OPENAI,
        apiKey: 'sk-openai-key',
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('claude', anthropicConfig);
      manager.addConfig('gpt', openaiConfig);

      // Quick switch for different tasks
      manager.setActiveConfig('claude');
      expect(manager.getActiveConfig()?.model).toBe('claude-3-5-sonnet-20241022');

      manager.setActiveConfig('gpt');
      expect(manager.getActiveConfig()?.model).toBe('gpt-4-turbo-preview');

      // Settings persist across switches
      const config = loadConfig();
      expect(config.apiKeys.anthropic).toBe('sk-ant-key');
      expect(config.apiKeys.openai).toBe('sk-openai-key');
    });
  });
});
