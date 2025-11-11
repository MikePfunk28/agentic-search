/**
 * Model Configuration Storage with Convex (SECURE)
 *
 * Replaces the insecure localStorage implementation.
 * API keys are stored server-side in Convex with proper authentication.
 *
 * SECURITY:
 * - API keys stored in Convex backend, NOT in browser
 * - Authentication required for all operations
 * - Users can only access their own keys
 * - Convex encrypts data at rest
 */

import type { ModelConfig } from "./model-config";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "@convex-dev/react-query";

/**
 * Hook to save model configuration to Convex
 */
export function useSaveModelConfig() {
  const createConfig = useMutation(api.modelConfiguration.createConfig);
  const saveApiKey = useMutation(api.secureApiKeys.saveApiKey);

  return async (configName: string, config: ModelConfig) => {
    try {
      // Save model configuration (without API key)
      const configId = await createConfig({
        configName,
        provider: config.provider,
        modelName: config.model,
        baseUrl: config.baseUrl,
        hasApiKey: !!config.apiKey,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });

      // Save API key separately if present
      if (config.apiKey) {
        await saveApiKey({
          configId: configId as Id<"modelConfigurations">,
          apiKey: config.apiKey,
        });
      }

      return configId;
    } catch (error) {
      console.error("[ModelStorage] Failed to save config:", error);
      throw error;
    }
  };
}

/**
 * Hook to load model configuration from Convex
 */
export function useLoadModelConfig(configId: Id<"modelConfigurations">) {
  const config = useQuery(api.modelConfiguration.getActiveConfig, {});
  const apiKey = useQuery(api.secureApiKeys.getApiKey, { configId });

  if (!config) return null;

  // Reconstruct full ModelConfig with API key
  return {
    provider: config.provider,
    model: config.modelName,
    baseUrl: config.baseUrl,
    apiKey: apiKey || undefined,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
  } as ModelConfig;
}

/**
 * Hook to list all model configurations
 */
export function useListModelConfigs() {
  return useQuery(api.modelConfiguration.listMyConfigs, {});
}

/**
 * Hook to get active model configuration
 */
export function useActiveModelConfig() {
  const activeConfig = useQuery(api.modelConfiguration.getActiveConfig, {});
  const apiKey = activeConfig
    ? useQuery(api.secureApiKeys.getApiKey, { configId: activeConfig._id })
    : null;

  if (!activeConfig) return null;

  return {
    id: activeConfig._id,
    config: {
      provider: activeConfig.provider,
      model: activeConfig.modelName,
      baseUrl: activeConfig.baseUrl,
      apiKey: apiKey || undefined,
      temperature: activeConfig.temperature,
      maxTokens: activeConfig.maxTokens,
    } as ModelConfig,
  };
}

/**
 * Hook to set active model configuration
 */
export function useSetActiveConfig() {
  return useMutation(api.modelConfiguration.setActiveConfig);
}

/**
 * Hook to delete model configuration
 */
export function useDeleteModelConfig() {
  const deleteConfig = useMutation(api.modelConfiguration.deleteConfig);
  const deleteApiKey = useMutation(api.secureApiKeys.deleteApiKey);

  return async (configId: Id<"modelConfigurations">) => {
    try {
      // Delete API key first
      await deleteApiKey({ configId });

      // Delete configuration
      await deleteConfig({ configId });
    } catch (error) {
      console.error("[ModelStorage] Failed to delete config:", error);
      throw error;
    }
  };
}

/**
 * Migration utility: Move localStorage configs to Convex
 * Run this once to migrate existing users
 */
export async function migrateLocalStorageToConvex() {
  console.warn(
    "[Migration] This will migrate API keys from insecure localStorage to secure Convex storage"
  );

  // Check if old localStorage data exists
  const oldData = localStorage.getItem("agentic-search-model-config");
  if (!oldData) {
    console.log("[Migration] No localStorage data found, nothing to migrate");
    return;
  }

  console.warn("[Migration] Found localStorage data - migration is needed");
  console.warn(
    "[Migration] Please implement migration in UI with user authentication"
  );

  // NOTE: Migration requires authentication, should be done in UI component
  // This is a placeholder to show the pattern
}
