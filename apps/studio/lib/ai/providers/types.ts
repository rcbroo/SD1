export interface AIProvider {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'active' | 'inactive' | 'error'
  capabilities: AICapability[]
  pricing: PricingTier
  performance: PerformanceMetrics
  regions: string[]
  models: AIModel[]
}

export interface AIModel {
  id: string
  name: string
  description: string
  type: 'text' | 'image' | 'audio' | 'video' | 'multimodal'
  contextLength: number
  inputCost: number
  outputCost: number
  latency: number
  quality: number
}

export interface AICapability {
  type:
    | 'text-generation'
    | 'image-generation'
    | 'audio-transcription'
    | 'embeddings'
    | 'vision'
    | 'function-calling'
  supported: boolean
  quality: 'low' | 'medium' | 'high' | 'premium'
}

export interface PricingTier {
  tier: 'free' | 'pay-per-use' | 'subscription' | 'enterprise'
  costPerToken: number
  monthlyLimit?: number
  rateLimit: number
}

export interface PerformanceMetrics {
  averageLatency: number
  uptime: number
  throughput: number
  errorRate: number
  lastUpdated: string
}

export interface AIProviderConfig {
  providerId: string
  apiKey: string
  endpoint?: string
  region?: string
  model?: string
  maxTokens?: number
  temperature?: number
  enabled: boolean
}

export interface AIRequest {
  prompt: string
  type: 'text' | 'image' | 'audio' | 'multimodal'
  model?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean
  context?: any
}

export interface AIResponse {
  content: string
  model: string
  provider: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cost: number
  }
  latency: number
  timestamp: string
}

export interface ProviderSelection {
  primary: string
  fallbacks: string[]
  criteria: SelectionCriteria
}

export interface SelectionCriteria {
  prioritize: 'cost' | 'speed' | 'quality' | 'availability'
  maxCost?: number
  maxLatency?: number
  minQuality?: number
  requireCapabilities?: string[]
}

export interface AIProviderTemplate {
  id: string
  name: string
  provider: string
  category: 'language' | 'multimodal' | 'local' | 'gpu-compute' | 'embedding' | 'image' | 'audio'
  icon: React.ComponentType<{ className?: string }>
  version: string
  description: string
  capabilities: string[]
  pricing: {
    input: number
    output: number
    unit: string
  }
  performance: {
    latency: number
    throughput: number
    reliability: number
  }
  limits: {
    contextWindow: number | string
    maxTokens: number | string
    rateLimit: string
  }
  config: Record<string, any>
  verified: boolean
  rating: number
  usage: number
  tags: string[]
}
