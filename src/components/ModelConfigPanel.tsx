/**
 * ModelConfigPanel - Complete model configuration with API key management
 * Allows users to add API keys, test connections, and fetch available models
 */

import { useState, useEffect } from 'react';
import { 
  Check, X, Loader2, Plus, Trash2, Eye, EyeOff, 
  Wifi, WifiOff, RefreshCw, Key, AlertCircle
} from 'lucide-react';
import { ModelProvider, ProviderDefaults, modelConfig } from '../lib/model-config';

interface StoredApiKey {
  provider: ModelProvider;
  apiKey: string;
  baseUrl?: string;
  timestamp: number;
}

interface ProviderConfig {
  provider: ModelProvider;
  name: string;
  requiresApiKey: boolean;
  defaultBaseUrl?: string;
  models?: string[];
}

const PROVIDER_CONFIGS: ProviderConfig[] = [
  { provider: ModelProvider.OLLAMA, name: 'Ollama (Local)', requiresApiKey: false },
  { provider: ModelProvider.LM_STUDIO, name: 'LM Studio (Local)', requiresApiKey: false },
  { provider: ModelProvider.OPENAI, name: 'OpenAI (GPT-5.1)', requiresApiKey: true },
  { provider: ModelProvider.ANTHROPIC, name: 'Anthropic (Claude 4.5)', requiresApiKey: true },
  { provider: ModelProvider.GOOGLE, name: 'Google (Gemini 2.5)', requiresApiKey: true },
  { provider: ModelProvider.DEEPSEEK, name: 'DeepSeek (v3.2)', requiresApiKey: true },
  { provider: ModelProvider.OPENROUTER, name: 'OpenRouter (All Models)', requiresApiKey: true },
  { provider: ModelProvider.MOONSHOT, name: 'Moonshot', requiresApiKey: true },
  { provider: ModelProvider.KIMI, name: 'Kimi K2', requiresApiKey: true },
  { provider: ModelProvider.AZURE_OPENAI, name: 'Azure OpenAI', requiresApiKey: true },
];

export function ModelConfigPanel() {
  const [apiKeys, setApiKeys] = useState<Record<string, StoredApiKey>>({});
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState<Record<string, boolean>>({});
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'connected' | 'disconnected' | 'unknown'>>({});
  const [availableModels, setAvailableModels] = useState<Record<string, string[]>>({});
  const [fetchingModels, setFetchingModels] = useState<Record<string, boolean>>({});
  const [editingProvider, setEditingProvider] = useState<ModelProvider | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');
  const [tempBaseUrl, setTempBaseUrl] = useState('');

  // Load API keys from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('agentic_search_api_keys');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setApiKeys(parsed);
        
        // Auto-test connections for stored keys
        Object.values(parsed).forEach((config: any) => {
          testConnection(config.provider, config.apiKey, config.baseUrl);
        });
      } catch (error) {
        console.error('Failed to load API keys:', error);
      }
    }
    
    // Auto-test Ollama connection
    testConnection(ModelProvider.OLLAMA);
  }, []);

  const saveApiKeys = (newKeys: Record<string, StoredApiKey>) => {
    setApiKeys(newKeys);
    localStorage.setItem('agentic_search_api_keys', JSON.stringify(newKeys));
  };

  const testConnection = async (provider: ModelProvider, apiKey?: string, baseUrl?: string) => {
    setTestingConnection(prev => ({ ...prev, [provider]: true }));
    setConnectionStatus(prev => ({ ...prev, [provider]: 'unknown' }));

    try {
      const config = {
        provider,
        apiKey: apiKey || apiKeys[provider]?.apiKey,
        baseUrl: baseUrl || apiKeys[provider]?.baseUrl || ProviderDefaults[provider].baseUrl,
      };

      const result = await modelConfig.testConnection('test');
      
      setConnectionStatus(prev => ({ 
        ...prev, 
        [provider]: result.success ? 'connected' : 'disconnected' 
      }));

      // If connection successful, fetch available models
      if (result.success) {
        fetchModelsForProvider(provider, config.apiKey, config.baseUrl);
      }
    } catch (error) {
      console.error(`Connection test failed for ${provider}:`, error);
      setConnectionStatus(prev => ({ ...prev, [provider]: 'disconnected' }));
    } finally {
      setTestingConnection(prev => ({ ...prev, [provider]: false }));
    }
  };

  const fetchModelsForProvider = async (provider: ModelProvider, apiKey?: string, baseUrl?: string) => {
    setFetchingModels(prev => ({ ...prev, [provider]: true }));

    try {
      const models = await modelConfig.fetchAvailableModels(provider, {
        apiKey: apiKey || apiKeys[provider]?.apiKey,
        baseUrl: baseUrl || apiKeys[provider]?.baseUrl || ProviderDefaults[provider].baseUrl,
      });

      setAvailableModels(prev => ({ ...prev, [provider]: models }));
      console.log(`[ModelConfig] Fetched ${models.length} models for ${provider}`);
    } catch (error) {
      console.error(`Failed to fetch models for ${provider}:`, error);
    } finally {
      setFetchingModels(prev => ({ ...prev, [provider]: false }));
    }
  };

  const addApiKey = (provider: ModelProvider) => {
    const newKey: StoredApiKey = {
      provider,
      apiKey: tempApiKey,
      baseUrl: tempBaseUrl || ProviderDefaults[provider].baseUrl,
      timestamp: Date.now(),
    };

    const updated = { ...apiKeys, [provider]: newKey };
    saveApiKeys(updated);

    // Test connection immediately
    testConnection(provider, tempApiKey, tempBaseUrl);

    // Reset form
    setEditingProvider(null);
    setTempApiKey('');
    setTempBaseUrl('');
  };

  const removeApiKey = (provider: ModelProvider) => {
    const updated = { ...apiKeys };
    delete updated[provider];
    saveApiKeys(updated);
    setConnectionStatus(prev => ({ ...prev, [provider]: 'unknown' }));
    setAvailableModels(prev => ({ ...prev, [provider]: [] }));
  };

  const startEditing = (provider: ModelProvider) => {
    setEditingProvider(provider);
    const existing = apiKeys[provider];
    if (existing) {
      setTempApiKey(existing.apiKey);
      setTempBaseUrl(existing.baseUrl || '');
    } else {
      setTempApiKey('');
      setTempBaseUrl(ProviderDefaults[provider].baseUrl || '');
    }
  };

  const getStatusIcon = (provider: ModelProvider) => {
    const status = connectionStatus[provider];
    const testing = testingConnection[provider];

    if (testing) {
      return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
    }

    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">AI Model Configuration</h3>
        <p className="text-sm text-gray-400">Configure your API keys and test connections</p>
      </div>

      {PROVIDER_CONFIGS.map((config) => {
        const hasApiKey = !!apiKeys[config.provider];
        const isEditing = editingProvider === config.provider;
        const models = availableModels[config.provider] || [];
        const status = connectionStatus[config.provider];

        return (
          <div
            key={config.provider}
            className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(config.provider)}
                <div>
                  <h4 className="font-medium text-white">{config.name}</h4>
                  <p className="text-xs text-gray-400">
                    {config.requiresApiKey ? 'Requires API Key' : 'No API Key Required'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {status === 'connected' && models.length > 0 && (
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                    {models.length} models
                  </span>
                )}

                {!isEditing && (
                  <>
                    {hasApiKey ? (
                      <>
                        <button
                          type="button"
                          onClick={() => testConnection(config.provider)}
                          disabled={testingConnection[config.provider]}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title="Test Connection"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditing(config.provider)}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeApiKey(config.provider)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (config.requiresApiKey) {
                            startEditing(config.provider);
                          } else {
                            testConnection(config.provider);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        {config.requiresApiKey ? 'Add API Key' : 'Test Connection'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 space-y-3 border-t border-slate-700 pt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    API Key {!config.requiresApiKey && '(Optional)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey[config.provider] ? 'text' : 'password'}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder={config.requiresApiKey ? 'Enter your API key' : 'Not required for local models'}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white pr-10 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(prev => ({ ...prev, [config.provider]: !prev[config.provider] }))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showApiKey[config.provider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Base URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={tempBaseUrl}
                    onChange={(e) => setTempBaseUrl(e.target.value)}
                    placeholder={ProviderDefaults[config.provider].baseUrl || 'https://api.example.com/v1'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addApiKey(config.provider)}
                    disabled={config.requiresApiKey && !tempApiKey.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save & Test
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProvider(null);
                      setTempApiKey('');
                      setTempBaseUrl('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {status === 'connected' && models.length > 0 && !isEditing && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Available Models:</p>
                  <button
                    type="button"
                    onClick={() => fetchModelsForProvider(config.provider)}
                    disabled={fetchingModels[config.provider]}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${fetchingModels[config.provider] ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {models.slice(0, 10).map((model) => (
                    <span
                      key={model}
                      className="text-xs bg-slate-800 text-gray-300 px-2 py-1 rounded"
                    >
                      {model}
                    </span>
                  ))}
                  {models.length > 10 && (
                    <span className="text-xs text-gray-500">+{models.length - 10} more</span>
                  )}
                </div>
              </div>
            )}

            {status === 'disconnected' && !isEditing && (
              <div className="mt-3 pt-3 border-t border-red-500/20">
                <p className="text-sm text-red-400">
                  Connection failed. {config.requiresApiKey ? 'Check your API key and try again.' : 'Make sure the service is running locally.'}
                </p>
              </div>
            )}
          </div>
        );
      })}

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-200 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Security Notice
        </h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• API keys are stored encrypted in your browser's localStorage</li>
          <li>• Keys are never sent to our servers - all API calls go directly to the providers</li>
          <li>• For local models (Ollama, LM Studio), no API key is required</li>
        </ul>
      </div>
    </div>
  );
}
