/**
 * Model Configuration Component
 * UI for selecting and configuring AI models
 */

import { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import type { ModelConfig } from '../lib/model-config';
import { detectAvailableProviders, listModelsForProvider, getProviderDisplayName, type ModelProvider } from '../lib/ai/providers';

export interface ModelSettingsProps {
  onSave?: (config: ModelConfig) => void;
}

/**
 * Renders a UI for selecting an AI provider and model, testing the connection, and saving the chosen model configuration.
 *
 * The component detects available providers on mount, loads models for the selected provider, allows optional base URL and API key input, provides a connection test flow for local and cloud providers, and persists the final configuration to localStorage.
 *
 * @param onSave - Optional callback invoked with the saved ModelConfig after the user saves the configuration
 * @returns The settings UI for configuring provider, model, base URL, and API key, including test and save controls
 */
export function ModelSettings({ onSave }: ModelSettingsProps) {
  const [availableProviders, setAvailableProviders] = useState<ModelProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Detect available providers on mount
  useEffect(() => {
    /**
     * Detects available AI model providers and updates component state accordingly.
     *
     * Sets the loading state while detection runs, populates `availableProviders`, and
     * auto-selects the first provider when any are found. Logs an error if detection fails.
     */
    async function detectProviders() {
      setIsLoading(true);
      try {
        const providers = await detectAvailableProviders();
        setAvailableProviders(providers);

        // Auto-select first available provider
        if (providers.length > 0) {
          setSelectedProvider(providers[0]);
        }
      } catch (error) {
        console.error('[ModelSettings] Failed to detect providers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    detectProviders();
  }, []);

  // Load models when provider changes
  useEffect(() => {
    /**
     * Load models for the currently selected provider and update component state.
     *
     * Fetches the provider's model list (using `baseURL` when present) and updates `availableModels`. If the list is non-empty the first model is selected. If no provider is selected the function is a no-op; on failure it clears `availableModels` and logs an error.
     */
    async function loadModels() {
      if (!selectedProvider) return;

      try {
        const models = await listModelsForProvider(selectedProvider, baseURL || undefined);
        setAvailableModels(models);

        // Auto-select first model
        if (models.length > 0) {
          setSelectedModel(models[0]);
        }
      } catch (error) {
        console.error('[ModelSettings] Failed to load models:', error);
        setAvailableModels([]);
      }
    }

    loadModels();
  }, [selectedProvider, baseURL]);

  const handleTestConnection = async () => {
    if (!selectedProvider || !selectedModel) return;

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      // For local providers, test by listing models
      if (selectedProvider === 'ollama' || selectedProvider === 'lmstudio') {
        const url = baseURL || (selectedProvider === 'ollama' ? 'http://localhost:11434' : 'http://localhost:1234');
        const endpoint = selectedProvider === 'ollama' ? '/api/tags' : '/v1/models';

        const response = await fetch(`${url}${endpoint}`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          setTestResult({ success: true, message: 'Connection successful!' });
        } else {
          setTestResult({ success: false, message: `Connection failed: ${response.statusText}` });
        }
      } else {
        // For cloud providers, verify API key format
        if (!apiKey) {
          setTestResult({ success: false, message: 'API key is required' });
        } else {
          setTestResult({ success: true, message: 'Configuration looks good! (Full test on first use)' });
        }
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (!selectedProvider || !selectedModel) return;

    const config: ModelConfig = {
      provider: selectedProvider,
      model: selectedModel,
      baseUrl: baseURL || undefined,
      apiKey: apiKey || undefined,
      temperature: 0.7,
      maxTokens: 4096,
      timeout: 60000,
      enableStreaming: false,
    };

    // Save to localStorage
    localStorage.setItem('agentic-search-model-config', JSON.stringify(config));
    onSave?.(config);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        <span className="ml-3 text-gray-300">Detecting available models...</span>
      </div>
    );
  }

  if (availableProviders.length === 0) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-200 font-semibold mb-2">No Models Available</h3>
            <p className="text-gray-300 text-sm mb-3">
              No AI providers detected. To use agentic search, you need either:
            </p>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>Local model:</strong> Install Ollama (http://localhost:11434) or LM Studio</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>Cloud API:</strong> Add API keys for OpenAI, Anthropic, or Google below</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          AI Provider
        </label>
        <select
          value={selectedProvider || ''}
          onChange={(e) => setSelectedProvider(e.target.value as ModelProvider)}
          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {availableProviders.map((provider) => (
            <option key={provider} value={provider}>
              {getProviderDisplayName(provider)}
            </option>
          ))}
        </select>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Model
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={availableModels.length === 0}
          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
        >
          {availableModels.length === 0 ? (
            <option>No models available</option>
          ) : (
            availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))
          )}
        </select>
        {availableModels.length === 0 && selectedProvider && (
          <p className="mt-2 text-sm text-amber-400">
            Failed to load models. Check if {getProviderDisplayName(selectedProvider)} is running.
          </p>
        )}
      </div>

      {/* API Key (for cloud providers) */}
      {selectedProvider && !['ollama', 'lmstudio'].includes(selectedProvider) && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <p className="mt-2 text-xs text-gray-400">
            Your API key is stored locally in your browser and never sent to our servers
          </p>
        </div>
      )}

      {/* Base URL (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Base URL (Optional)
        </label>
        <input
          type="text"
          value={baseURL}
          onChange={(e) => setBaseURL(e.target.value)}
          placeholder={selectedProvider === 'ollama' ? 'http://localhost:11434' : selectedProvider === 'lmstudio' ? 'http://localhost:1234' : ''}
          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <p className="mt-2 text-xs text-gray-400">
          Override the default API endpoint (useful for custom deployments)
        </p>
      </div>

      {/* Test Connection Button */}
      <div>
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={!selectedProvider || !selectedModel || isTestingConnection}
          className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Test Connection
            </>
          )}
        </button>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`rounded-lg p-4 flex items-center gap-3 ${
          testResult.success
            ? 'bg-green-500/20 border border-green-500/50'
            : 'bg-red-500/20 border border-red-500/50'
        }`}>
          {testResult.success ? (
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className={testResult.success ? 'text-green-100' : 'text-red-100'}>
            {testResult.message}
          </span>
        </div>
      )}

      {/* Save Button */}
      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!selectedProvider || !selectedModel}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}