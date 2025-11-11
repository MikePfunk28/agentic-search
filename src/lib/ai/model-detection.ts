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
 * Detect all available LM Studio models on localhost
 */
export async function detectLMStudioModels(baseURL = 'http://localhost:1234'): Promise<DetectedModel[]> {
  try {
    console.log('[ModelDetection] Checking LM Studio at', baseURL);

    const response = await fetch(`${baseURL}/v1/models`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      console.log('[ModelDetection] LM Studio not available:', response.status);
      return [];
    }

    const data = await response.json();

    const models: DetectedModel[] = data.data?.map((model: any) => ({
      provider: 'lm_studio' as ModelProvider,
      modelId: model.id,
      displayName: model.id,
      recommended: false,
    })) || [];

    console.log('[ModelDetection] Found', models.length, 'LM Studio models:', models.map(m => m.modelId));

    return models;
  } catch (error) {
    console.log('[ModelDetection] Failed to detect LM Studio models:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Get the best available Ollama model
 * Prioritizes recommended models: qwen3:4b, qwen3:1.7b, gemma3:270m, gemma3:1b, gemma3:4b
 */
export function getBestOllamaModel(models: DetectedModel[]): DetectedModel | null {
  if (models.length === 0) return null;

  // Priority order of recommended models
  const recommendedModels = [
    'qwen3:4b',
    'qwen3:1.7b',
    'gemma3:4b',
    'gemma3:1b',
    'gemma3:270m',
  ];

  // Find first recommended model that's installed
  for (const modelId of recommendedModels) {
    const model = models.find((m) => m.modelId === modelId);
    if (model) {
      console.log('[ModelDetection] Recommended Ollama model found:', model.modelId);
      return { ...model, recommended: true };
    }
  }

  // If no recommended models found, return first available
  console.log('[ModelDetection] No recommended models found. Available:', models.map(m => m.modelId).join(', '));
  return { ...models[0], recommended: false };
}

/**
 * Get the best available LM Studio model
 * Same priority as Ollama: qwen3:4b, qwen3:1.7b, gemma3:270m, gemma3:1b, gemma3:4b
 */
export function getBestLMStudioModel(models: DetectedModel[]): DetectedModel | null {
  if (models.length === 0) return null;

  // Priority order of recommended models
  const recommendedModels = [
    'qwen3:4b',
    'qwen3:1.7b',
    'gemma3:4b',
    'gemma3:1b',
    'gemma3:270m',
  ];

  // Find first recommended model that's installed
  for (const modelId of recommendedModels) {
    const model = models.find((m) => m.modelId.includes(modelId) || m.modelId === modelId);
    if (model) {
      console.log('[ModelDetection] Recommended LM Studio model found:', model.modelId);
      return { ...model, recommended: true };
    }
  }

  // If no recommended models found, return first available
  console.log('[ModelDetection] No recommended LM Studio models found. Available:', models.map(m => m.modelId).join(', '));
  return { ...models[0], recommended: false };
}

/**
 * Get cloud provider models (when API keys are configured)
 * Updated with real 2024/2025 model IDs
 */
export function getCloudProviderModels(provider: ModelProvider): DetectedModel[] {
  const cloudModels: Record<Exclude<ModelProvider, ModelProvider.OLLAMA | ModelProvider.LM_STUDIO>, DetectedModel[]> = {
    [ModelProvider.OPENAI]: [
      { provider: ModelProvider.OPENAI, modelId: 'gpt-4o', displayName: 'GPT-4o', recommended: true },
      { provider: ModelProvider.OPENAI, modelId: 'gpt-4o-mini', displayName: 'GPT-4o Mini' },
      { provider: ModelProvider.OPENAI, modelId: 'gpt-4-turbo', displayName: 'GPT-4 Turbo' },
      { provider: ModelProvider.OPENAI, modelId: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo' },
    ],
    [ModelProvider.ANTHROPIC]: [
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-5-sonnet-20241022', displayName: 'Claude 3.5 Sonnet', recommended: true },
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-5-haiku-20241022', displayName: 'Claude 3.5 Haiku' },
      { provider: ModelProvider.ANTHROPIC, modelId: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus' },
    ],
    [ModelProvider.GOOGLE]: [
      { provider: ModelProvider.GOOGLE, modelId: 'gemini-2.0-flash-exp', displayName: 'Gemini 2.0 Flash (Experimental)', recommended: true },
      { provider: ModelProvider.GOOGLE, modelId: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro' },
      { provider: ModelProvider.GOOGLE, modelId: 'gemini-1.5-flash', displayName: 'Gemini 1.5 Flash' },
    ],
    [ModelProvider.AZURE_OPENAI]: [
      { provider: ModelProvider.AZURE_OPENAI, modelId: 'gpt-4o', displayName: 'GPT-4o (Azure)', recommended: true },
      { provider: ModelProvider.AZURE_OPENAI, modelId: 'gpt-4o-mini', displayName: 'GPT-4o Mini (Azure)' },
      { provider: ModelProvider.AZURE_OPENAI, modelId: 'gpt-4-turbo', displayName: 'GPT-4 Turbo (Azure)' },
    ],
  };

  return cloudModels[provider as keyof typeof cloudModels] || [];
}

/**
 * Detect all available models across all providers
 */
export async function detectAllAvailableModels(): Promise<{
  ollama: DetectedModel[];
  lmstudio: DetectedModel[];
  cloud: Record<string, DetectedModel[]>;
  recommended: DetectedModel | null;
}> {
  // Detect Ollama models
  const ollamaModels = await detectOllamaModels();

  // Detect LM Studio models
  const lmstudioModels = await detectLMStudioModels();

  // Get best Ollama model
  const ollamaRecommended = getBestOllamaModel(ollamaModels);

  // Get best LM Studio model
  const lmstudioRecommended = getBestLMStudioModel(lmstudioModels);

  // Prefer Ollama recommendation, fallback to LM Studio
  const recommended = ollamaRecommended || lmstudioRecommended;

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
    lmstudio: lmstudioModels,
    cloud: cloudModels,
    recommended,
  };
}

/**
 * Check if a specific provider is available (either Ollama/LM Studio running or API key configured)
 */
export async function isProviderAvailable(provider: ModelProvider, modelId?: string): Promise<boolean> {
  if (provider === 'ollama') {
    const models = await detectOllamaModels();
    return models.some((m) => m.modelId === modelId);
  }

  if (provider === 'lm_studio') {
    const models = await detectLMStudioModels();
    return models.some((m) => m.modelId === modelId);
  }

  // For cloud providers, check if API key is configured
  if (typeof window !== 'undefined') {
    try {
      const savedConfig = localStorage.getItem('agentic-search-model-config');
      if (!savedConfig) return false;

      const config = JSON.parse(savedConfig);
      if (config.provider === provider && config.apiKey) {
        return true;
      }
    } catch (error) {
      console.error('[ModelDetection] Failed to parse saved config:', error);
      return false;
    }

    // Check environment variables as fallback
    const envVarMap: Record<string, string> = {
      [ModelProvider.OPENAI]: 'VITE_OPENAI_API_KEY',
      [ModelProvider.ANTHROPIC]: 'VITE_ANTHROPIC_API_KEY',
      [ModelProvider.GOOGLE]: 'VITE_GOOGLE_API_KEY',
      [ModelProvider.AZURE_OPENAI]: 'VITE_AZURE_API_KEY',
    };

    const envVar = envVarMap[provider];
    if (envVar && import.meta.env[envVar]) {
      return true;
    }
  }

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
