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
 * Create and persist a model configuration in Convex and store its API key separately when present.
 *
 * @returns A function that accepts `(configName: string, config: ModelConfig)` and returns the created configuration's Id.
 * @throws Any error encountered while creating the configuration or saving the API key.
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
 * Load a model configuration and its API key from Convex.
 *
 * @param configId - The id of the model configuration to load
 * @returns The reconstructed `ModelConfig` (with `apiKey` when present) or `null` if no configuration exists
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
 * Lists the current user's model configurations.
 *
 * Each returned configuration record does not include any stored API key.
 *
 * @returns A query result containing an array of model configuration records for the current user
 */
export function useListModelConfigs() {
  return useQuery(api.modelConfiguration.listMyConfigs, {});
}

/**
 * Loads the currently active model configuration and its associated API key.
 *
 * @returns `{ id: Id<'modelConfigurations'>, config: ModelConfig }` containing the active configuration and its id, or `null` if no active configuration exists. The returned `config`'s `apiKey` property will be `undefined` when no API key is stored.
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
 * Provide a mutation hook that marks a model configuration as active.
 *
 * @returns A mutation function that sets the active model configuration by its `configId`
 */
export function useSetActiveConfig() {
  return useMutation(api.modelConfiguration.setActiveConfig);
}

/**
 * Produce a function that deletes a model configuration and its associated API key.
 *
 * The returned function removes the stored API key for the given configuration, then deletes the configuration record. Any error encountered during deletion is rethrown.
 *
 * @returns A function that accepts a `configId` and deletes its API key and configuration; throws the encountered error if deletion fails.
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
 * Detects legacy model configuration stored in localStorage and warns that it must be migrated to Convex.
 *
 * This function checks for the legacy "agentic-search-model-config" entry and logs guidance for performing
 * a migration from insecure localStorage to Convex-backed storage. It does not perform any migration or
 * authentication itself and serves as a placeholder to be invoked from an authenticated UI flow that can
 * securely transfer API keys and configuration data.
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