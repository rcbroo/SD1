export interface ComputeProvider {
  id: string
  name: string
  type: 'cpu' | 'gpu' | 'hybrid'
  region: string
  pricing: {
    hourly: number
    monthly?: number
    currency: 'USD' | 'EUR'
  }
  specs: {
    cpu?: {
      cores: number
      architecture: 'x86_64' | 'arm64'
      frequency?: string
    }
    gpu?: {
      model: string
      memory: string
      cuda?: boolean
      tensorCores?: boolean
    }
    memory: string
    storage: string
    network: string
  }
  availability: {
    status: 'available' | 'limited' | 'unavailable'
    regions: string[]
    autoScaling: boolean
  }
  features: string[]
  provider: 'hetzner' | 'valdi' | 'gpu-trader' | 'twcc' | 'digital-ocean'
}

export interface StorageProvider {
  id: string
  name: string
  type: 'primary' | 'cdn' | 'backup' | 'cache'
  pricing: {
    storage: number // per GB/month
    bandwidth: number // per GB
    requests: number // per 1000 requests
    currency: 'USD' | 'EUR'
  }
  specs: {
    durability: string
    availability: string
    latency: string
    throughput: string
    encryption: boolean
    versioning: boolean
  }
  regions: string[]
  features: string[]
  provider: 'storj' | 'bunny' | 'backblaze' | 'digital-ocean'
}

export interface InfrastructureConfig {
  compute: {
    primary: ComputeProvider
    fallback: ComputeProvider[]
    autoScaling: {
      enabled: boolean
      minInstances: number
      maxInstances: number
      targetCPU: number
      targetMemory: number
    }
    loadBalancing: {
      algorithm: 'round-robin' | 'least-connections' | 'weighted'
      healthCheck: boolean
      failoverTime: number
    }
  }
  storage: {
    primary: StorageProvider
    cdn: StorageProvider
    backup: StorageProvider[]
    lifecycle: {
      hotTier: number // days
      coldTier: number // days
      archiveTier: number // days
    }
  }
  networking: {
    regions: string[]
    edgeLocations: string[]
    bandwidth: string
    latency: string
  }
}

export interface ResourceAllocation {
  id: string
  projectId: string
  type: 'compute' | 'storage' | 'bandwidth'
  provider: string
  region: string
  specs: Record<string, any>
  status: 'provisioning' | 'active' | 'scaling' | 'terminating' | 'failed'
  cost: {
    current: number
    projected: number
    currency: string
  }
  metrics: {
    cpu?: number
    memory?: number
    storage?: number
    bandwidth?: number
    requests?: number
  }
  createdAt: string
  updatedAt: string
}

export interface CostOptimization {
  recommendations: {
    type: 'downsize' | 'upsize' | 'migrate' | 'terminate'
    provider: string
    resource: string
    currentCost: number
    projectedCost: number
    savings: number
    confidence: number
    reason: string
  }[]
  totalSavings: number
  optimizationScore: number
}
