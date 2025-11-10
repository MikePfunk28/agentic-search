/**
 * Model Detection and Auto-Discovery System
 * Automatically detects available Ollama models and cloud provider configurations
 */

import { ModelProvider } from '../model-config';

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    parent_model?: string;
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export interface OllamaTagsResponse {
  models: OllamaModel[];
}

export interface DetectedModel {
  provider: ModelProvider;
  modelId: string;
  displayName: string;
  size?: number;
  family?: string;
  recommended?: boolean;
}

/**
 * Detect all available Ollama models on localhost
 */
export async function detectOllamaModels(baseURL = 'http://localhost:11434'): Promise<DetectedModel[]> {
  try {
    console.log('[ModelDetection] Checking Ollama at', baseURL);

    const response = await fetch(`${baseURL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      console.log('[ModelDetection] Ollama not available:', response.status);
      return [];
    }

    const data: OllamaTagsResponse = await response.json();

    const models: DetectedModel[] = data.models.map((model) => ({
      provider: 'ollama' as ModelProvider,
      modelId: model.name,
      displayName: model.name,
      size: model.size,
      family: model.details?.family || model.details?.families?.[0],
      recommended: false,
    }));

    console.log('[ModelDetection] Found', models.length, 'Ollama models:', models.map(m => m.modelId));

    return models;
  } catch (error) {
    console.log('[ModelDetection] Failed to detect Ollama models:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Get the best available Ollama model
 * Prioritizes qwen3:4b only - user chooses best for their machine
 */
export function getBestOllamaModel(models: DetectedModel[]): DetectedModel | null {
  if (models.length === 0) return null;

  // Only look for qwen3:4b variants
  const model = models.find((m) => m.modelId.startsWith('qwen3:4b'));

  if (model) {
    console.log('[ModelDetection] Ollama model: Qwen3:4B:', model.modelId);
    return { ...model, recommended: true };
  }

  // If qwen3:4b not found, return first available and let user choose
  console.log('[ModelDetection] qwen3:4b not found. Available models:', models.map(m => m.modelId).join(', '));
  return { ...models[0], recommended: false };
}

/**
 * Get cloud provider models (when API keys are configured)
 */
export function getCloudProviderModels(provider: ModelProvider): DetectedModel[] {
  const cloudModels: Record<Exclude<ModelProvider, ModelProvider.OLLAMA | ModelProvider.LM_STUDIO>, DetectedModel[]> = {
    [ModelProvider.OPENAI]: [
      { provider: ModelProvider.OPENAI, modelId: 'gpt-5', displayName: 'GPT-5', recommended: true },
      { provider: ModelProvider.OPENAI, modelId: 'gpt-5-mini', displayName: 'GPT-5 Mini' },
      { provider: ModelProvider.OPENAI, modelId: 'gpt-4-turbo', displayName: 'GPT-4 Turbo' },
      { provider: ModelProvider.OPENAI, modelId: 'gpt-4', displayName: 'GPT-4' },
      { provider: ModelProvider.OPENAI, modelId: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo' },
    ],
    [ModelProvider.ANTHROPIC]: [
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-5-sonnet-20241022', displayName: 'Claude 3.5 Sonnet', recommended: true },
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-5-haiku-20241022', displayName: 'Claude 3.5 Haiku' },
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus' },
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-sonnet-20240229', displayName: 'Claude 3 Sonnet' },
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-haiku-20240307', displayName: 'Claude 3 Haiku' },
    ],
    [ModelProvider.GOOGLE]: [
      { provider: ModelProvider.GOOGLE, modelId: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro', recommended: true },
      { provider: ModelProvider.GOOGLE, modelId: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash' },
      { provider: ModelProvider.GOOGLE, modelId: 'gemini-1.0-pro', displayName: 'Gemini 1.0 Pro' },
    ],
    [ModelProvider.AZURE_OPENAI]: [
      { provider: ModelProvider.AZURE_OPENAI, modelId: 'gpt-5', displayName: 'GPT-5 (Azure)', recommended: true },
      { provider: ModelProvider.AZURE_OPENAI, modelId: 'gpt-5-mini', displayName: 'GPT-5 Mini (Azure)' },
      { provider: ModelProvider.AZURE_OPENAI, modelId: 'gpt-5-nano', displayName: 'GPT-5 Nano (Azure)' },
    ],
  };

  return cloudModels[provider as keyof typeof cloudModels] || [];
}

/**
 * Detect all available models across all providers
 */
export async function detectAllAvailableModels(): Promise<{
  ollama: DetectedModel[];
  cloud: Record<string, DetectedModel[]>;
  recommended: DetectedModel | null;
}> {
  // Detect Ollama models
  const ollamaModels = await detectOllamaModels();

  // Get best Ollama model
  const recommended = getBestOllamaModel(ollamaModels);

  // Check for cloud provider API keys (client-side only)
  const cloudModels: Record<string, DetectedModel[]> = {};

  if (typeof window !== 'undefined') {
    // Check localStorage for saved API keys
    const savedConfig = localStorage.getItem('agentic-search-model-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.provider && config.apiKey) {
          cloudModels[config.provider] = getCloudProviderModels(config.provider);
        }
      } catch (error) {
        console.error('[ModelDetection] Failed to parse saved config:', error);
      }
    }

    // Check environment variables (Vite exposes them as import.meta.env.VITE_*)
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      cloudModels[ModelProvider.OPENAI] = getCloudProviderModels(ModelProvider.OPENAI);
    }
    if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
      cloudModels[ModelProvider.ANTHROPIC] = getCloudProviderModels(ModelProvider.ANTHROPIC);
    }
    if (import.meta.env.VITE_GOOGLE_API_KEY) {
      cloudModels[ModelProvider.GOOGLE] = getCloudProviderModels(ModelProvider.GOOGLE);
    }
    if (import.meta.env.VITE_AZURE_API_KEY) {
      cloudModels[ModelProvider.AZURE_OPENAI] = getCloudProviderModels(ModelProvider.AZURE_OPENAI);
    }
  }

  return {
    ollama: ollamaModels,
    cloud: cloudModels,
    recommended,
  };
}

/**
 * Check if a specific model is available
 */
export async function isModelAvailable(provider: ModelProvider, modelId: string): Promise<boolean> {
  if (provider === 'ollama') {
    const models = await detectOllamaModels();
    return models.some((m) => m.modelId === modelId);
  }

  // For cloud providers, assume available if API key is configured
  return false;
}

/**
 * Get recommended model based on task type
 */
export function getRecommendedModelForTask(
  task: 'chat' | 'search' | 'reasoning' | 'coding',
  availableModels: DetectedModel[]
): DetectedModel | null {
  if (availableModels.length === 0) return null;

  // Task-specific priorities
  const taskPriorities: Record<string, string[]> = {
    chat: ['Qwen3:4b', 'llama3', 'mistral', 'gpt-4o-mini', 'claude-3-5-haiku'],
    search: ['Qwen3:4b', 'gpt-4o', 'claude-3-5-sonnet', 'gemini-1.5-pro'],
    reasoning: ['claude-3-opus', 'gpt-4', 'claude-3-5-sonnet', 'llama3'],
    coding: ['gpt-4', 'claude-3-5-sonnet', 'llama3', 'gpt-4o'],
  };

  const priorities = taskPriorities[task] || taskPriorities.chat;

  for (const priority of priorities) {
    const match = availableModels.find((m) => m.modelId.includes(priority));
    if (match) return match;
  }

  return availableModels[0];
}
