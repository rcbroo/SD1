import { Brain, Zap, Globe, Cpu, Server, Shield } from 'lucide-react'
import { AIProvider } from './types'

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, DALL-E, Whisper, and advanced AI models',
    icon: Brain,
    status: 'active',
    capabilities: [
      { type: 'text-generation', supported: true, quality: 'premium' },
      { type: 'image-generation', supported: true, quality: 'high' },
      { type: 'audio-transcription', supported: true, quality: 'high' },
      { type: 'embeddings', supported: true, quality: 'high' },
      { type: 'vision', supported: true, quality: 'premium' },
      { type: 'function-calling', supported: true, quality: 'premium' },
    ],
    pricing: {
      tier: 'pay-per-use',
      costPerToken: 0.00003,
      rateLimit: 10000,
    },
    performance: {
      averageLatency: 1200,
      uptime: 99.9,
      throughput: 1000,
      errorRate: 0.1,
      lastUpdated: new Date().toISOString(),
    },
    regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
    models: [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Most capable GPT-4 model with 128k context',
        type: 'text',
        contextLength: 128000,
        inputCost: 0.01,
        outputCost: 0.03,
        latency: 1200,
        quality: 95,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient model for most tasks',
        type: 'text',
        contextLength: 16000,
        inputCost: 0.001,
        outputCost: 0.002,
        latency: 800,
        quality: 85,
      },
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        description: 'Advanced image generation model',
        type: 'image',
        contextLength: 4000,
        inputCost: 0.04,
        outputCost: 0.08,
        latency: 15000,
        quality: 95,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models with advanced reasoning capabilities',
    icon: Zap,
    status: 'active',
    capabilities: [
      { type: 'text-generation', supported: true, quality: 'premium' },
      { type: 'vision', supported: true, quality: 'high' },
      { type: 'function-calling', supported: true, quality: 'high' },
      { type: 'image-generation', supported: false, quality: 'low' },
      { type: 'audio-transcription', supported: false, quality: 'low' },
      { type: 'embeddings', supported: false, quality: 'low' },
    ],
    pricing: {
      tier: 'pay-per-use',
      costPerToken: 0.000025,
      rateLimit: 5000,
    },
    performance: {
      averageLatency: 1500,
      uptime: 99.8,
      throughput: 800,
      errorRate: 0.2,
      lastUpdated: new Date().toISOString(),
    },
    regions: ['us-east-1', 'us-west-2'],
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most powerful Claude model for complex tasks',
        type: 'text',
        contextLength: 200000,
        inputCost: 0.015,
        outputCost: 0.075,
        latency: 1800,
        quality: 98,
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance and speed',
        type: 'text',
        contextLength: 200000,
        inputCost: 0.003,
        outputCost: 0.015,
        latency: 1200,
        quality: 92,
      },
    ],
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini models with multimodal capabilities',
    icon: Globe,
    status: 'active',
    capabilities: [
      { type: 'text-generation', supported: true, quality: 'high' },
      { type: 'vision', supported: true, quality: 'premium' },
      { type: 'function-calling', supported: true, quality: 'high' },
      { type: 'embeddings', supported: true, quality: 'high' },
      { type: 'image-generation', supported: false, quality: 'low' },
      { type: 'audio-transcription', supported: false, quality: 'medium' },
    ],
    pricing: {
      tier: 'pay-per-use',
      costPerToken: 0.000015,
      rateLimit: 15000,
    },
    performance: {
      averageLatency: 900,
      uptime: 99.7,
      throughput: 1200,
      errorRate: 0.3,
      lastUpdated: new Date().toISOString(),
    },
    regions: ['us-central1', 'europe-west1', 'asia-southeast1'],
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: 'Advanced multimodal model',
        type: 'multimodal',
        contextLength: 32000,
        inputCost: 0.0005,
        outputCost: 0.0015,
        latency: 900,
        quality: 90,
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        description: 'Specialized for vision tasks',
        type: 'multimodal',
        contextLength: 16000,
        inputCost: 0.00025,
        outputCost: 0.0005,
        latency: 1100,
        quality: 93,
      },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'European AI with compliance focus',
    icon: Shield,
    status: 'active',
    capabilities: [
      { type: 'text-generation', supported: true, quality: 'high' },
      { type: 'function-calling', supported: true, quality: 'medium' },
      { type: 'embeddings', supported: true, quality: 'medium' },
      { type: 'vision', supported: false, quality: 'low' },
      { type: 'image-generation', supported: false, quality: 'low' },
      { type: 'audio-transcription', supported: false, quality: 'low' },
    ],
    pricing: {
      tier: 'pay-per-use',
      costPerToken: 0.00002,
      rateLimit: 8000,
    },
    performance: {
      averageLatency: 1000,
      uptime: 99.5,
      throughput: 900,
      errorRate: 0.4,
      lastUpdated: new Date().toISOString(),
    },
    regions: ['eu-west-1', 'eu-central-1'],
    models: [
      {
        id: 'mistral-large',
        name: 'Mistral Large',
        description: 'Most capable Mistral model',
        type: 'text',
        contextLength: 32000,
        inputCost: 0.008,
        outputCost: 0.024,
        latency: 1200,
        quality: 88,
      },
      {
        id: 'mistral-medium',
        name: 'Mistral Medium',
        description: 'Balanced performance model',
        type: 'text',
        contextLength: 32000,
        inputCost: 0.0027,
        outputCost: 0.0081,
        latency: 900,
        quality: 82,
      },
    ],
  },
  {
    id: 'local-ollama',
    name: 'Local Models (Ollama)',
    description: 'Privacy-focused local inference',
    icon: Server,
    status: 'inactive',
    capabilities: [
      { type: 'text-generation', supported: true, quality: 'medium' },
      { type: 'embeddings', supported: true, quality: 'medium' },
      { type: 'vision', supported: false, quality: 'low' },
      { type: 'function-calling', supported: false, quality: 'low' },
      { type: 'image-generation', supported: false, quality: 'low' },
      { type: 'audio-transcription', supported: false, quality: 'low' },
    ],
    pricing: {
      tier: 'free',
      costPerToken: 0,
      rateLimit: 1000,
    },
    performance: {
      averageLatency: 3000,
      uptime: 95.0,
      throughput: 200,
      errorRate: 1.0,
      lastUpdated: new Date().toISOString(),
    },
    regions: ['local'],
    models: [
      {
        id: 'llama2-7b',
        name: 'Llama 2 7B',
        description: 'Open source model for local inference',
        type: 'text',
        contextLength: 4096,
        inputCost: 0,
        outputCost: 0,
        latency: 3000,
        quality: 75,
      },
    ],
  },
  {
    id: 'valdi-gpu',
    name: 'Valdi.ai GPU Compute',
    description: 'High-performance GPU inference',
    icon: Cpu,
    status: 'active',
    capabilities: [
      { type: 'text-generation', supported: true, quality: 'high' },
      { type: 'image-generation', supported: true, quality: 'high' },
      { type: 'embeddings', supported: true, quality: 'high' },
      { type: 'vision', supported: true, quality: 'high' },
      { type: 'function-calling', supported: true, quality: 'medium' },
      { type: 'audio-transcription', supported: true, quality: 'medium' },
    ],
    pricing: {
      tier: 'pay-per-use',
      costPerToken: 0.00001,
      rateLimit: 20000,
    },
    performance: {
      averageLatency: 600,
      uptime: 99.2,
      throughput: 2000,
      errorRate: 0.5,
      lastUpdated: new Date().toISOString(),
    },
    regions: ['us-west-2', 'eu-west-1'],
    models: [
      {
        id: 'valdi-llama2-70b',
        name: 'Llama 2 70B (Valdi)',
        description: 'High-performance Llama 2 on Valdi GPUs',
        type: 'text',
        contextLength: 4096,
        inputCost: 0.0008,
        outputCost: 0.0016,
        latency: 600,
        quality: 87,
      },
    ],
  },
]

export const getProviderById = (id: string) => {
  return AI_PROVIDERS.find((provider) => provider.id === id)
}

export const getProvidersByCapability = (capability: string) => {
  return AI_PROVIDERS.filter((provider) =>
    provider.capabilities.some((cap) => cap.type === capability && cap.supported)
  )
}

export const getActiveProviders = () => {
  return AI_PROVIDERS.filter((provider) => provider.status === 'active')
}

export const getBestProviderForTask = (
  capability: string,
  criteria: 'cost' | 'speed' | 'quality' = 'quality'
) => {
  const providers = getProvidersByCapability(capability).filter((p) => p.status === 'active')

  switch (criteria) {
    case 'cost':
      return providers.sort((a, b) => a.pricing.costPerToken - b.pricing.costPerToken)[0]
    case 'speed':
      return providers.sort(
        (a, b) => a.performance.averageLatency - b.performance.averageLatency
      )[0]
    case 'quality':
      const qualityScore = (p: any) => {
        const cap = p.capabilities.find((c: any) => c.type === capability)
        const qualityMap = { low: 1, medium: 2, high: 3, premium: 4 }
        return qualityMap[cap?.quality || 'low']
      }
      return providers.sort((a, b) => qualityScore(b) - qualityScore(a))[0]
    default:
      return providers[0]
  }
}
