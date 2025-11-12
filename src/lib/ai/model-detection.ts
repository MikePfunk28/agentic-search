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
 * Detect available Ollama models hosted at the given base URL.
 *
 * @param baseURL - The base URL of the Ollama API (defaults to 'http://localhost:11434')
 * @returns An array of detected models; returns an empty array if Ollama is unreachable, the API responds with a non-OK status, or an error occurs during detection
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
 * Detects LM Studio models available at the given base URL.
 *
 * @param baseURL - The LM Studio server base URL to query; defaults to `http://localhost:1234`
 * @returns An array of detected models. Returns an empty array if LM Studio is unreachable or no models are found
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
 * Selects the preferred Ollama model from a list using a fixed priority order.
 *
 * @param models - Available detected Ollama models to choose from.
 * @returns The chosen DetectedModel (its `recommended` flag is `true` when it matches a prioritized ID, `false` when returning the first available), or `null` if `models` is empty.
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
 * Selects the preferred LM Studio model from a list of detected models.
 *
 * @param models - The available LM Studio models to evaluate.
 * @returns The most-preferred `DetectedModel` according to the built-in priority list, with its `recommended` flag set to `true` if it matches a priority item; if no priority match exists, returns the first model with `recommended` set to `false`; returns `null` if `models` is empty.
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
 * Return a curated list of known cloud models for the specified provider.
 *
 * @param provider - The cloud model provider to retrieve models for (excludes Ollama and LM Studio)
 * @returns An array of `DetectedModel` entries for the provider, or an empty array if none are defined
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
 * Discover available models from local Ollama and LM Studio instances and from configured cloud providers.
 *
 * Detects models for Ollama and LM Studio, collects cloud provider model sets when API keys/config are present
 * (client-side), and determines a single recommended model preferring an Ollama recommendation when available.
 *
 * @returns An object containing:
 *  - `ollama`: Detected Ollama models.
 *  - `lmstudio`: Detected LM Studio models.
 *  - `cloud`: A mapping of cloud provider keys to their detected/provided models.
 *  - `recommended`: The chosen recommended model or `null` if none detected.
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
 * Determine whether a model provider is available, optionally verifying a specific model.
 *
 * For local providers ('ollama' and 'lm_studio') this checks whether the corresponding local service exposes the requested model (or any model if `modelId` is omitted). For cloud providers this checks for a configured API key either in a saved client-side config or in build-time environment variables.
 *
 * @param provider - The model provider to check.
 * @param modelId - Optional model identifier to verify exists for the provider.
 * @returns `true` if the provider is available (and the specified `modelId` exists when provided), `false` otherwise.
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
 * Selects a recommended model from the provided list tailored to the specified task.
 *
 * Uses task-specific priority lists to prefer models suitable for 'chat', 'search', 'reasoning', or 'coding'. If no prioritized model is present, the first model in `availableModels` is returned.
 *
 * @param task - The intended task: 'chat', 'search', 'reasoning', or 'coding'
 * @param availableModels - Candidate models to choose from
 * @returns The `DetectedModel` chosen as recommended for the task, or `null` if `availableModels` is empty
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