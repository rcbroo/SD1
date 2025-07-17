import { OwlSocietyConfig, OwlSocietyResponse, OwlIntegrationConfig } from './types'

export class OwlClient {
  private config: OwlIntegrationConfig

  constructor(config: OwlIntegrationConfig) {
    this.config = config
  }

  async runSociety(societyConfig: OwlSocietyConfig): Promise<OwlSocietyResponse> {
    if (!this.config.enabled) {
      throw new Error('OWL integration is not enabled')
    }

    const response = await fetch(`${this.config.apiEndpoint}/api/owl/run-society`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.modelConfig.apiKey}`,
      },
      body: JSON.stringify({
        ...societyConfig,
        modelConfig: this.config.modelConfig,
        agentConfig: this.config.agentConfig,
      }),
    })

    if (!response.ok) {
      throw new Error(`OWL API error: ${response.statusText}`)
    }

    return response.json()
  }

  async streamSociety(
    societyConfig: OwlSocietyConfig,
    onMessage: (message: any) => void
  ): Promise<void> {
    if (!this.config.enabled) {
      throw new Error('OWL integration is not enabled')
    }

    const response = await fetch(`${this.config.apiEndpoint}/api/owl/stream-society`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.modelConfig.apiKey}`,
      },
      body: JSON.stringify({
        ...societyConfig,
        modelConfig: this.config.modelConfig,
        agentConfig: this.config.agentConfig,
      }),
    })

    if (!response.ok) {
      throw new Error(`OWL API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body reader available')
    }

    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              onMessage(data)
            } catch (e) {
              console.warn('Failed to parse SSE data:', line)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}

export function createOwlClient(config: OwlIntegrationConfig): OwlClient {
  return new OwlClient(config)
}
