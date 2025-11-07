/**
 * Unit Tests for ModelConfigManager
 * Tests configuration management, validation, and provider switching
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  ModelConfigManager,
  ModelProvider,
  ModelConfigSchema,
  ProviderDefaults,
  type ModelConfig,
} from '../src/lib/model-config';

describe('ModelConfigManager', () => {
  let manager: ModelConfigManager;

  beforeEach(() => {
    // Clear environment variables
    delete process.env.PRIMARY_MODEL_PROVIDER;
    delete process.env.PRIMARY_API_KEY;
    delete process.env.LOCAL_MODEL_PROVIDER;

    // Create fresh instance
    manager = new ModelConfigManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration Management', () => {
    it('should add and retrieve configuration by ID', () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        apiKey: 'sk-test123',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('test-config', config);
      const retrieved = manager.getConfig('test-config');

      expect(retrieved).toEqual(config);
    });

    it('should return null for non-existent configuration', () => {
      const result = manager.getConfig('non-existent');
      expect(result).toBeNull();
    });

    it('should validate configuration with Zod schema', () => {
      const invalidConfig = {
        provider: 'invalid-provider',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      expect(() => {
        manager.addConfig('invalid', invalidConfig as any);
      }).toThrow();
    });

    it('should list all configurations', () => {
      const config1: ModelConfig = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      const config2: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('config1', config1);
      manager.addConfig('config2', config2);

      const list = manager.listConfigs();
      expect(list).toHaveLength(2);
      expect(list[0].id).toBe('config1');
      expect(list[1].id).toBe('config2');
    });
  });

  describe('Active Configuration', () => {
    it('should set and get active configuration', () => {
      const config: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('active-test', config);
      const success = manager.setActiveConfig('active-test');

      expect(success).toBe(true);
      expect(manager.getActiveConfig()).toEqual(config);
    });

    it('should return false when setting non-existent config as active', () => {
      const success = manager.setActiveConfig('non-existent');
      expect(success).toBe(false);
    });

    it('should return null when no active configuration is set', () => {
      expect(manager.getActiveConfig()).toBeNull();
    });

    it('should allow switching active configuration', () => {
      const config1: ModelConfig = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      const config2: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.5,
        maxTokens: 2048,
        timeout: 60000,
        enableStreaming: true,
      };

      manager.addConfig('config1', config1);
      manager.addConfig('config2', config2);

      manager.setActiveConfig('config1');
      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.OPENAI);

      manager.setActiveConfig('config2');
      expect(manager.getActiveConfig()?.provider).toBe(ModelProvider.ANTHROPIC);
      expect(manager.getActiveConfig()?.enableStreaming).toBe(true);
    });
  });

  describe('Provider Defaults', () => {
    it('should have defaults for all providers', () => {
      expect(ProviderDefaults[ModelProvider.OPENAI]).toBeDefined();
      expect(ProviderDefaults[ModelProvider.ANTHROPIC]).toBeDefined();
      expect(ProviderDefaults[ModelProvider.GOOGLE]).toBeDefined();
      expect(ProviderDefaults[ModelProvider.OLLAMA]).toBeDefined();
      expect(ProviderDefaults[ModelProvider.LM_STUDIO]).toBeDefined();
      expect(ProviderDefaults[ModelProvider.AZURE_OPENAI]).toBeDefined();
    });

    it('should have valid baseUrl for cloud providers', () => {
      expect(ProviderDefaults[ModelProvider.OPENAI].baseUrl).toContain('https://');
      expect(ProviderDefaults[ModelProvider.ANTHROPIC].baseUrl).toContain('https://');
      expect(ProviderDefaults[ModelProvider.GOOGLE].baseUrl).toContain('https://');
    });

    it('should have localhost baseUrl for local providers', () => {
      expect(ProviderDefaults[ModelProvider.OLLAMA].baseUrl).toContain('localhost');
      expect(ProviderDefaults[ModelProvider.LM_STUDIO].baseUrl).toContain('localhost');
    });
  });

  describe('Validation', () => {
    it('should reject invalid temperature values', () => {
      const config = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: 3.0, // Invalid: > 2.0
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      expect(() => {
        manager.addConfig('invalid-temp', config as any);
      }).toThrow();
    });

    it('should reject negative temperature', () => {
      const config = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: -0.5,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      expect(() => {
        manager.addConfig('invalid-temp', config as any);
      }).toThrow();
    });

    it('should reject non-positive maxTokens', () => {
      const config = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: -100,
        timeout: 60000,
        enableStreaming: false,
      };

      expect(() => {
        manager.addConfig('invalid-tokens', config as any);
      }).toThrow();
    });

    it('should accept valid temperature range', () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: 1.5,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      expect(() => {
        manager.addConfig('valid-temp', config);
      }).not.toThrow();
    });
  });

  describe('Connection Testing', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should return success for valid connection', async () => {
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

      manager.addConfig('test', config);

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
      });

      const result = await manager.testConnection('test');

      expect(result.success).toBe(true);
      expect(result.latency).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeUndefined();
    });

    it('should return error for failed connection', async () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        apiKey: 'sk-invalid',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 5000,
        enableStreaming: false,
      };

      manager.addConfig('test', config);

      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      const result = await manager.testConnection('test');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for non-existent configuration', async () => {
      const result = await manager.testConnection('non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Configuration not found');
    });

    it('should handle network timeout', async () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        apiKey: 'sk-test123',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 100,
        enableStreaming: false,
      };

      manager.addConfig('test', config);

      (global.fetch as any).mockRejectedValue(new Error('Timeout'));

      const result = await manager.testConnection('test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Timeout');
    });

    it('should use correct headers for Anthropic', async () => {
      const config: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: 'sk-ant-test123',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 5000,
        enableStreaming: false,
      };

      manager.addConfig('test', config);

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
      });

      await manager.testConnection('test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.anthropic.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'sk-ant-test123',
            'anthropic-version': '2023-06-01',
          }),
        })
      );
    });

    it('should use different endpoint for Ollama', async () => {
      const config: ModelConfig = {
        provider: ModelProvider.OLLAMA,
        baseUrl: 'http://localhost:11434',
        model: 'llama2',
        temperature: 0.7,
        maxTokens: 2048,
        timeout: 5000,
        enableStreaming: false,
      };

      manager.addConfig('test', config);

      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
      });

      await manager.testConnection('test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/tags',
        expect.any(Object)
      );
    });
  });

  describe('JSON Export/Import', () => {
    it('should export configurations to JSON', () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('export-test', config);
      manager.setActiveConfig('export-test');

      const json = manager.exportToJSON();
      const parsed = JSON.parse(json);

      expect(parsed.defaultModel).toBe('export-test');
      expect(parsed.models).toHaveLength(1);
      expect(parsed.models[0].id).toBe('export-test');
    });

    it('should export empty state correctly', () => {
      const json = manager.exportToJSON();
      const parsed = JSON.parse(json);

      expect(parsed.defaultModel).toBeNull();
      expect(parsed.models).toHaveLength(0);
    });
  });

  describe('LLM Instance Creation', () => {
    it('should create OpenAI instance with correct configuration', () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        apiKey: 'sk-test123',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: true,
      };

      manager.addConfig('openai', config);
      const instance = manager.createLLMInstance('openai') as any;

      expect(instance._type).toBe('openai');
      expect(instance.modelName).toBe('gpt-4');
      expect(instance.temperature).toBe(0.7);
      expect(instance.maxTokens).toBe(4096);
      expect(instance.streaming).toBe(true);
    });

    it('should create Anthropic instance with correct configuration', () => {
      const config: ModelConfig = {
        provider: ModelProvider.ANTHROPIC,
        apiKey: 'sk-ant-test123',
        baseUrl: 'https://api.anthropic.com',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.5,
        maxTokens: 2048,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('anthropic', config);
      const instance = manager.createLLMInstance('anthropic') as any;

      expect(instance._type).toBe('anthropic');
      expect(instance.modelName).toBe('claude-3-5-sonnet-20241022');
      expect(instance.temperature).toBe(0.5);
      expect(instance.maxTokens).toBe(2048);
      expect(instance.streaming).toBe(false);
    });

    it('should create Ollama instance with correct configuration', () => {
      const config: ModelConfig = {
        provider: ModelProvider.OLLAMA,
        baseUrl: 'http://localhost:11434',
        model: 'llama2',
        temperature: 0.7,
        maxTokens: 2048,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('ollama', config);
      const instance = manager.createLLMInstance('ollama') as any;

      expect(instance._type).toBe('ollama');
      expect(instance.model).toBe('llama2');
      expect(instance.temperature).toBe(0.7);
      expect(instance.numPredict).toBe(2048);
    });

    it('should throw error when no active configuration', () => {
      expect(() => {
        manager.createLLMInstance();
      }).toThrow('No active model configuration');
    });

    it('should use active configuration when no ID specified', () => {
      const config: ModelConfig = {
        provider: ModelProvider.OPENAI,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      manager.addConfig('active', config);
      manager.setActiveConfig('active');

      const instance = manager.createLLMInstance() as any;
      expect(instance._type).toBe('openai');
    });
  });

  describe('Security', () => {
    it('should not log API keys in errors', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config = {
        provider: 'invalid',
        apiKey: 'sk-secret-key-12345',
        model: 'test',
        temperature: 0.7,
        maxTokens: 4096,
        timeout: 60000,
        enableStreaming: false,
      };

      try {
        manager.addConfig('test', config as any);
      } catch (error) {
        // Expected to fail
      }

      const logCalls = consoleSpy.mock.calls;
      logCalls.forEach(call => {
        expect(JSON.stringify(call)).not.toContain('sk-secret-key-12345');
      });

      consoleSpy.mockRestore();
    });
  });
});
