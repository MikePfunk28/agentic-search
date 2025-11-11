/**
 * React Hook for Model Detection
 * Provides reactive access to available models and auto-detection
 */

import { useState, useEffect } from 'react';
import type { DetectedModel } from '../lib/ai/model-detection';
import { detectAllAvailableModels } from '../lib/ai/model-detection';

export interface UseAvailableModelsResult {
  ollamaModels: DetectedModel[];
  lmstudioModels: DetectedModel[];
  cloudModels: Record<string, DetectedModel[]>;
  recommendedModel: DetectedModel | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to detect and track available AI models
 * Auto-detects on mount and provides refresh function
 */
export function useAvailableModels(): UseAvailableModelsResult {
  const [ollamaModels, setOllamaModels] = useState<DetectedModel[]>([]);
  const [lmstudioModels, setLmstudioModels] = useState<DetectedModel[]>([]);
  const [cloudModels, setCloudModels] = useState<Record<string, DetectedModel[]>>({});
  const [recommendedModel, setRecommendedModel] = useState<DetectedModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectModels = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const detected = await detectAllAvailableModels();

      setOllamaModels(detected.ollama);
      setLmstudioModels(detected.lmstudio);
      setCloudModels(detected.cloud);
      setRecommendedModel(detected.recommended);

      console.log('[useAvailableModels] Detection complete:', {
        ollama: detected.ollama.length,
        lmstudio: detected.lmstudio.length,
        cloud: Object.keys(detected.cloud).length,
        recommended: detected.recommended?.modelId,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect models';
      setError(errorMessage);
      console.error('[useAvailableModels] Detection failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-detect on mount
  useEffect(() => {
    detectModels();
  }, []);

  return {
    ollamaModels,
    lmstudioModels,
    cloudModels,
    recommendedModel,
    isLoading,
    error,
    refresh: detectModels,
  };
}

/**
 * Hook to get the currently selected model from localStorage
 */
export function useSelectedModel(): {
  selectedModel: DetectedModel | null;
  setSelectedModel: (model: DetectedModel) => void;
} {
  const [selectedModel, setSelectedModelState] = useState<DetectedModel | null>(null);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('agentic-search-model-config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setSelectedModelState({
          provider: config.provider,
          modelId: config.modelId,
          displayName: config.displayName || config.modelId,
        });
      } catch (error) {
        console.error('[useSelectedModel] Failed to load saved model:', error);
      }
    }
  }, []);

  const setSelectedModel = (model: DetectedModel) => {
    setSelectedModelState(model);

    // Save to localStorage
    const config = {
      provider: model.provider,
      modelId: model.modelId,
      displayName: model.displayName,
    };
    localStorage.setItem('agentic-search-model-config', JSON.stringify(config));
  };

  return {
    selectedModel,
    setSelectedModel,
  };
}
