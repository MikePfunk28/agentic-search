/**
 * AI Model Provider Adapter
 * Supports multiple providers: Ollama, LM Studio, OpenAI, Anthropic, Google, Azure
 */

export type ModelProvider =
  | 'ollama'
  | 'lmstudio'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure'

export interface ModelConfig {
  provider: ModelProvider
  modelId: string
  baseURL?: string // For local models
  apiKey?: string // For cloud models
  temperature?: number
  maxTokens?: number
}

/**
 * Detect which providers are available
 * Checks local servers and environment variables
 */
export async function detectAvailableProviders(): Promise<ModelProvider[]> {
  const providers: ModelProvider[] = []

  // Check for local Ollama
  try {
    const res = await fetch('http://localhost:11434/api/tags', {
      signal: AbortSignal.timeout(1000)
    })
    if (res.ok) {
      providers.push('ollama')
      console.log('[Providers] Ollama detected at localhost:11434')
    }
  } catch (error) {
    console.log('[Providers] Ollama not available')
  }

  // Check for LM Studio
  try {
    const res = await fetch('http://localhost:1234/v1/models', {
      signal: AbortSignal.timeout(1000)
    })
    if (res.ok) {
      providers.push('lmstudio')
      console.log('[Providers] LM Studio detected at localhost:1234')
    }
  } catch (error) {
    console.log('[Providers] LM Studio not available')
  }

  // Cloud providers (check if API keys configured)
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    providers.push('openai')
    console.log('[Providers] OpenAI configured')
  }
  if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
    providers.push('anthropic')
    console.log('[Providers] Anthropic configured')
  }
  if (import.meta.env.VITE_GOOGLE_API_KEY) {
    providers.push('google')
    console.log('[Providers] Google configured')
  }
  if (import.meta.env.VITE_AZURE_API_KEY) {
    providers.push('azure')
    console.log('[Providers] Azure configured')
  }

  console.log('[Providers] Available providers:', providers)
  return providers
}

/**
 * List available models for a provider
 */
export async function listModelsForProvider(
  provider: ModelProvider,
  baseURL?: string
): Promise<string[]> {
  switch (provider) {
    case 'ollama': {
      try {
        const url = baseURL || 'http://localhost:11434'
        const res = await fetch(`${url}/api/tags`)
        if (!res.ok) throw new Error('Ollama not available')
        const data = await res.json()
        return data.models.map((m: any) => m.name)
      } catch (error) {
        console.error('[Providers] Failed to list Ollama models:', error)
        return []
      }
    }

    case 'lmstudio': {
      try {
        const url = baseURL || 'http://localhost:1234'
        const res = await fetch(`${url}/v1/models`)
        if (!res.ok) throw new Error('LM Studio not available')
        const data = await res.json()
        return data.data.map((m: any) => m.id)
      } catch (error) {
        console.error('[Providers] Failed to list LM Studio models:', error)
        return []
      }
    }

    case 'openai':
      return [
        'gpt-4-turbo',
        'gpt-4',
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-3.5-turbo'
      ]

    case 'anthropic':
      return [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
      ]

    case 'google':
      return [
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro'
      ]

    case 'azure':
      // Azure models depend on deployment names
      return [
        'gpt-4',
        'gpt-4-turbo',
        'gpt-35-turbo'
      ]

    default:
      return []
  }
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: ModelProvider): string {
  const names: Record<ModelProvider, string> = {
    ollama: 'Ollama (Local)',
    lmstudio: 'LM Studio (Local)',
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    google: 'Google AI',
    azure: 'Azure OpenAI'
  }
  return names[provider]
}

/**
 * Check if provider requires API key
 */
export function requiresApiKey(provider: ModelProvider): boolean {
  return !['ollama', 'lmstudio'].includes(provider)
}

/**
 * Get default base URL for provider
 */
export function getDefaultBaseURL(provider: ModelProvider): string | undefined {
  const defaults: Partial<Record<ModelProvider, string>> = {
    ollama: 'http://localhost:11434/v1',
    lmstudio: 'http://localhost:1234/v1'
  }
  return defaults[provider]
}
