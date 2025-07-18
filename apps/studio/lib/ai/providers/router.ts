import { AIProvider, AIRequest, AIResponse, ProviderSelection, SelectionCriteria } from './types'
import { getProviderById, getBestProviderForTask, getActiveProviders } from './registry'

export class AIProviderRouter {
  private providers: Map<string, AIProvider> = new Map()
  private configs: Map<string, any> = new Map()
  private fallbackChain: string[] = []

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    getActiveProviders().forEach((provider) => {
      this.providers.set(provider.id, provider)
    })
  }

  async routeRequest(request: AIRequest, selection?: ProviderSelection): Promise<AIResponse> {
    const provider = this.selectProvider(request, selection)

    if (!provider) {
      throw new Error('No suitable provider available for this request')
    }

    try {
      return await this.executeRequest(provider, request)
    } catch (error) {
      console.error(`Provider ${provider.id} failed:`, error)

      if (selection?.fallbacks && selection.fallbacks.length > 0) {
        for (const fallbackId of selection.fallbacks) {
          const fallbackProvider = getProviderById(fallbackId)
          if (fallbackProvider && fallbackProvider.status === 'active') {
            try {
              console.log(`Falling back to provider: ${fallbackId}`)
              return await this.executeRequest(fallbackProvider, request)
            } catch (fallbackError) {
              console.error(`Fallback provider ${fallbackId} also failed:`, fallbackError)
              continue
            }
          }
        }
      }

      throw new Error(`All providers failed for request: ${error}`)
    }
  }

  private selectProvider(request: AIRequest, selection?: ProviderSelection): AIProvider | null {
    if (selection?.primary) {
      const provider = getProviderById(selection.primary)
      if (provider && provider.status === 'active') {
        return provider
      }
    }

    const capability = this.getCapabilityFromRequestType(request.type)
    const criteria = selection?.criteria?.prioritize || 'quality'

    return getBestProviderForTask(capability, criteria)
  }

  private getCapabilityFromRequestType(type: string): string {
    const typeMap: Record<string, string> = {
      text: 'text-generation',
      image: 'image-generation',
      audio: 'audio-transcription',
      multimodal: 'vision',
    }
    return typeMap[type] || 'text-generation'
  }

  private async executeRequest(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now()

    switch (provider.id) {
      case 'openai':
        return await this.executeOpenAIRequest(provider, request, startTime)
      case 'anthropic':
        return await this.executeAnthropicRequest(provider, request, startTime)
      case 'google':
        return await this.executeGoogleRequest(provider, request, startTime)
      case 'mistral':
        return await this.executeMistralRequest(provider, request, startTime)
      case 'local-ollama':
        return await this.executeOllamaRequest(provider, request, startTime)
      case 'valdi-gpu':
        return await this.executeValdiRequest(provider, request, startTime)
      default:
        throw new Error(`Provider ${provider.id} not implemented`)
    }
  }

  private async executeOpenAIRequest(
    provider: AIProvider,
    request: AIRequest,
    startTime: number
  ): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getApiKey('openai')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: request.prompt }],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
        stream: request.stream || false,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const latency = Date.now() - startTime

    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'openai',
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost: this.calculateCost(provider, data.usage.total_tokens),
      },
      latency,
      timestamp: new Date().toISOString(),
    }
  }

  private async executeAnthropicRequest(
    provider: AIProvider,
    request: AIRequest,
    startTime: number
  ): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.getApiKey('anthropic'),
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: request.model || 'claude-3-sonnet-20240229',
        max_tokens: request.maxTokens || 1000,
        messages: [{ role: 'user', content: request.prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    const latency = Date.now() - startTime

    return {
      content: data.content[0].text,
      model: data.model,
      provider: 'anthropic',
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        cost: this.calculateCost(provider, data.usage.input_tokens + data.usage.output_tokens),
      },
      latency,
      timestamp: new Date().toISOString(),
    }
  }

  private async executeGoogleRequest(
    provider: AIProvider,
    request: AIRequest,
    startTime: number
  ): Promise<AIResponse> {
    throw new Error('Google AI provider not yet implemented')
  }

  private async executeMistralRequest(
    provider: AIProvider,
    request: AIRequest,
    startTime: number
  ): Promise<AIResponse> {
    throw new Error('Mistral AI provider not yet implemented')
  }

  private async executeOllamaRequest(
    provider: AIProvider,
    request: AIRequest,
    startTime: number
  ): Promise<AIResponse> {
    throw new Error('Ollama provider not yet implemented')
  }

  private async executeValdiRequest(
    provider: AIProvider,
    request: AIRequest,
    startTime: number
  ): Promise<AIResponse> {
    throw new Error('Valdi.ai provider not yet implemented')
  }

  private getApiKey(providerId: string): string {
    const key = process.env[`${providerId.toUpperCase()}_API_KEY`]
    if (!key) {
      throw new Error(`API key not found for provider: ${providerId}`)
    }
    return key
  }

  private calculateCost(provider: AIProvider, tokens: number): number {
    return tokens * provider.pricing.costPerToken
  }

  async getProviderHealth(): Promise<Record<string, any>> {
    const health: Record<string, any> = {}

    for (const [id, provider] of this.providers) {
      try {
        const testRequest: AIRequest = {
          prompt: 'Hello',
          type: 'text',
          maxTokens: 10,
        }

        const startTime = Date.now()
        await this.executeRequest(provider, testRequest)
        const latency = Date.now() - startTime

        health[id] = {
          status: 'healthy',
          latency,
          lastChecked: new Date().toISOString(),
        }
      } catch (error) {
        health[id] = {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          lastChecked: new Date().toISOString(),
        }
      }
    }

    return health
  }
}

export const aiRouter = new AIProviderRouter()
