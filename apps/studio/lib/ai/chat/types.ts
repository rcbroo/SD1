export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    toolCalls?: ToolCall[]
    context?: Record<string, any>
    sessionId?: string
  }
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
  status: 'pending' | 'completed' | 'failed'
}

export interface ChatSession {
  id: string
  projectId: string
  userId: string
  title: string
  messages: ChatMessage[]
  context: ChatContext
  createdAt: string
  updatedAt: string
  status: 'active' | 'archived'
}

export interface ChatContext {
  projectState: {
    databases?: any[]
    mcpServers?: any[]
    aiProviders?: any[]
    mediaAssets?: any[]
    infrastructure?: any[]
    security?: any[]
  }
  userPreferences: {
    language: string
    expertise: 'beginner' | 'intermediate' | 'expert'
    preferredProviders: string[]
  }
  capabilities: string[]
}

export interface ServiceAutomationTask {
  id: string
  type: 'setup' | 'optimization' | 'troubleshooting' | 'migration'
  title: string
  description: string
  steps: AutomationStep[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  estimatedDuration: number
  createdAt: string
  completedAt?: string
  error?: string
}

export interface AutomationStep {
  id: string
  title: string
  description: string
  action: string
  parameters: Record<string, any>
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: any
  error?: string
}

export interface ChatCapability {
  id: string
  name: string
  description: string
  category: 'platform' | 'content' | 'infrastructure' | 'security' | 'analytics'
  examples: string[]
  requiredPermissions: string[]
}
