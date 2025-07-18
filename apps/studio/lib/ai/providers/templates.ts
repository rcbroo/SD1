import { Brain, Bot, Sparkles, Zap, HardDrive, Cpu } from 'lucide-react'
import { AIProviderTemplate } from './types'

export const AI_PROVIDER_TEMPLATES: AIProviderTemplate[] = [
  {
    id: 'openai-gpt4',
    name: 'OpenAI GPT-4',
    provider: 'OpenAI',
    category: 'language',
    icon: Brain,
    version: '2024-02-01',
    description: 'Advanced language model with superior reasoning and multimodal capabilities',
    capabilities: ['text-generation', 'code-generation', 'analysis', 'vision', 'function-calling'],
    pricing: {
      input: 0.01,
      output: 0.03,
      unit: '1K tokens',
    },
    performance: {
      latency: 850,
      throughput: 120,
      reliability: 99.9,
    },
    limits: {
      contextWindow: 128000,
      maxTokens: 4096,
      rateLimit: '10000/min',
    },
    config: {
      apiKey: '{{OPENAI_API_KEY}}',
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4-turbo-preview',
    },
    verified: true,
    rating: 4.8,
    usage: 45230,
    tags: ['reasoning', 'multimodal', 'function-calling', 'enterprise'],
  },
  {
    id: 'anthropic-claude3',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    category: 'language',
    icon: Bot,
    version: '2024-02-29',
    description: 'Most capable model with exceptional reasoning and analysis capabilities',
    capabilities: ['text-generation', 'analysis', 'reasoning', 'vision', 'code-generation'],
    pricing: {
      input: 0.015,
      output: 0.075,
      unit: '1K tokens',
    },
    performance: {
      latency: 920,
      throughput: 95,
      reliability: 99.8,
    },
    limits: {
      contextWindow: 200000,
      maxTokens: 4096,
      rateLimit: '5000/min',
    },
    config: {
      apiKey: '{{ANTHROPIC_API_KEY}}',
      baseURL: 'https://api.anthropic.com',
      model: 'claude-3-opus-20240229',
    },
    verified: true,
    rating: 4.9,
    usage: 28450,
    tags: ['reasoning', 'analysis', 'safety', 'long-context'],
  },
  {
    id: 'google-gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    category: 'multimodal',
    icon: Sparkles,
    version: '1.0',
    description: 'Multimodal AI with advanced vision and reasoning capabilities',
    capabilities: [
      'text-generation',
      'vision',
      'code-generation',
      'multimodal',
      'function-calling',
    ],
    pricing: {
      input: 0.0005,
      output: 0.0015,
      unit: '1K tokens',
    },
    performance: {
      latency: 650,
      throughput: 150,
      reliability: 99.7,
    },
    limits: {
      contextWindow: 32768,
      maxTokens: 8192,
      rateLimit: '60/min',
    },
    config: {
      apiKey: '{{GOOGLE_AI_API_KEY}}',
      baseURL: 'https://generativelanguage.googleapis.com/v1',
      model: 'gemini-pro',
    },
    verified: true,
    rating: 4.6,
    usage: 18920,
    tags: ['multimodal', 'vision', 'cost-effective', 'fast'],
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    category: 'language',
    icon: Zap,
    version: '2024-02-26',
    description: 'European AI with strong multilingual and reasoning capabilities',
    capabilities: ['text-generation', 'multilingual', 'code-generation', 'function-calling'],
    pricing: {
      input: 0.008,
      output: 0.024,
      unit: '1K tokens',
    },
    performance: {
      latency: 780,
      throughput: 110,
      reliability: 99.6,
    },
    limits: {
      contextWindow: 32768,
      maxTokens: 8192,
      rateLimit: '5000/min',
    },
    config: {
      apiKey: '{{MISTRAL_API_KEY}}',
      baseURL: 'https://api.mistral.ai/v1',
      model: 'mistral-large-latest',
    },
    verified: true,
    rating: 4.5,
    usage: 12340,
    tags: ['european', 'multilingual', 'compliance', 'privacy'],
  },
  {
    id: 'ollama-llama2',
    name: 'Llama 2 70B (Local)',
    provider: 'Ollama',
    category: 'local',
    icon: HardDrive,
    version: '70b-chat',
    description: 'Self-hosted open-source model for privacy-sensitive workloads',
    capabilities: ['text-generation', 'code-generation', 'chat', 'offline'],
    pricing: {
      input: 0,
      output: 0,
      unit: 'self-hosted',
    },
    performance: {
      latency: 2500,
      throughput: 45,
      reliability: 95.0,
    },
    limits: {
      contextWindow: 4096,
      maxTokens: 2048,
      rateLimit: 'unlimited',
    },
    config: {
      baseURL: 'http://localhost:11434',
      model: 'llama2:70b-chat',
    },
    verified: false,
    rating: 4.2,
    usage: 5670,
    tags: ['open-source', 'privacy', 'self-hosted', 'offline'],
  },
  {
    id: 'valdi-a100',
    name: 'Valdi A100 Cluster',
    provider: 'Valdi.ai',
    category: 'gpu-compute',
    icon: Cpu,
    version: '1.0',
    description: 'High-performance GPU cluster for custom model inference',
    capabilities: ['custom-models', 'high-throughput', 'batch-processing', 'fine-tuning'],
    pricing: {
      input: 0.002,
      output: 0.002,
      unit: 'compute hour',
    },
    performance: {
      latency: 450,
      throughput: 300,
      reliability: 99.5,
    },
    limits: {
      contextWindow: 'variable',
      maxTokens: 'variable',
      rateLimit: 'custom',
    },
    config: {
      apiKey: '{{VALDI_API_KEY}}',
      baseURL: 'https://api.valdi.ai/v1',
      cluster: 'a100-80gb',
    },
    verified: true,
    rating: 4.7,
    usage: 3420,
    tags: ['gpu', 'high-performance', 'custom', 'enterprise'],
  },
  {
    id: 'gpu-trader-rtx4090',
    name: 'GPU Trader RTX 4090',
    provider: 'GPU Trader',
    category: 'gpu-compute',
    icon: Cpu,
    version: '1.0',
    description: 'Cost-effective GPU compute for development and testing',
    capabilities: ['custom-models', 'development', 'testing', 'cost-effective'],
    pricing: {
      input: 0.001,
      output: 0.001,
      unit: 'compute hour',
    },
    performance: {
      latency: 680,
      throughput: 180,
      reliability: 98.5,
    },
    limits: {
      contextWindow: 'variable',
      maxTokens: 'variable',
      rateLimit: 'custom',
    },
    config: {
      apiKey: '{{GPU_TRADER_API_KEY}}',
      baseURL: 'https://api.gputrader.com/v1',
      instance: 'rtx4090-24gb',
    },
    verified: false,
    rating: 4.3,
    usage: 1890,
    tags: ['cost-effective', 'development', 'testing', 'flexible'],
  },
]

export const getProvidersByCategory = (category?: string) => {
  if (!category || category === 'all') return AI_PROVIDER_TEMPLATES
  return AI_PROVIDER_TEMPLATES.filter((provider) => provider.category === category)
}

export const getProviderById = (id: string) => {
  return AI_PROVIDER_TEMPLATES.find((provider) => provider.id === id)
}

export const searchProviders = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return AI_PROVIDER_TEMPLATES.filter(
    (provider) =>
      provider.name.toLowerCase().includes(lowercaseQuery) ||
      provider.provider.toLowerCase().includes(lowercaseQuery) ||
      provider.description.toLowerCase().includes(lowercaseQuery) ||
      provider.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export const getOptimalProvider = (requirements: {
  capability?: string
  maxLatency?: number
  maxCost?: number
  minReliability?: number
}) => {
  let candidates = AI_PROVIDER_TEMPLATES

  if (requirements.capability) {
    candidates = candidates.filter((p) => p.capabilities.includes(requirements.capability as any))
  }

  if (requirements.maxLatency) {
    candidates = candidates.filter((p) => p.performance.latency <= requirements.maxLatency!)
  }

  if (requirements.maxCost) {
    candidates = candidates.filter((p) => p.pricing.output <= requirements.maxCost!)
  }

  if (requirements.minReliability) {
    candidates = candidates.filter((p) => p.performance.reliability >= requirements.minReliability!)
  }

  return candidates.sort((a, b) => {
    const scoreA =
      a.rating * 0.3 +
      a.performance.reliability * 0.3 +
      (100 - a.performance.latency / 10) * 0.2 +
      (1 / a.pricing.output) * 0.2
    const scoreB =
      b.rating * 0.3 +
      b.performance.reliability * 0.3 +
      (100 - b.performance.latency / 10) * 0.2 +
      (1 / b.pricing.output) * 0.2
    return scoreB - scoreA
  })[0]
}
