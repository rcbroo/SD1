export interface OwlAgent {
  role: 'user' | 'assistant' | 'coordinator'
  name: string
  capabilities: string[]
}

export interface OwlMessage {
  role: 'user' | 'assistant'
  content: string
  agent?: OwlAgent
  toolCalls?: OwlToolCall[]
  timestamp: string
}

export interface OwlToolCall {
  id: string
  name: string
  args: Record<string, any>
  result?: any
}

export interface OwlSocietyConfig {
  task: string
  userRoleName?: string
  assistantRoleName?: string
  outputLanguage?: string
  roundLimit?: number
}

export interface OwlSocietyResponse {
  answer: string
  chatHistory: Array<{
    user: string
    assistant: string
    toolCalls: OwlToolCall[]
  }>
  tokenInfo: {
    completionTokenCount: number
    promptTokenCount: number
  }
}

export interface OwlIntegrationConfig {
  enabled: boolean
  apiEndpoint: string
  modelConfig: {
    provider: string
    model: string
    apiKey?: string
  }
  agentConfig: {
    maxRounds: number
    enableToolCalls: boolean
    enableMultiAgent: boolean
  }
}
