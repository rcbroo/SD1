import { ComputeProvider, StorageProvider } from './types'

export const COMPUTE_PROVIDERS: ComputeProvider[] = [
  {
    id: 'hetzner-cx51',
    name: 'Hetzner CX51',
    type: 'cpu',
    region: 'eu-central',
    pricing: {
      hourly: 0.0595,
      monthly: 39.69,
      currency: 'EUR'
    },
    specs: {
      cpu: {
        cores: 8,
        architecture: 'x86_64',
        frequency: '3.4 GHz'
      },
      memory: '32 GB',
      storage: '240 GB SSD',
      network: '20 TB'
    },
    availability: {
      status: 'available',
      regions: ['eu-central', 'eu-west', 'us-east', 'us-west'],
      autoScaling: true
    },
    features: ['IPv6', 'Private Networks', 'Snapshots', 'Backups'],
    provider: 'hetzner'
  },
  {
    id: 'valdi-a100-80gb',
    name: 'Valdi A100 80GB',
    type: 'gpu',
    region: 'us-east',
    pricing: {
      hourly: 2.49,
      currency: 'USD'
    },
    specs: {
      cpu: {
        cores: 16,
        architecture: 'x86_64'
      },
      gpu: {
        model: 'NVIDIA A100 80GB',
        memory: '80 GB HBM2e',
        cuda: true,
        tensorCores: true
      },
      memory: '128 GB',
      storage: '1 TB NVMe',
      network: '100 Gbps'
    },
    availability: {
      status: 'available',
      regions: ['us-east', 'us-west', 'eu-west'],
      autoScaling: false
    },
    features: ['CUDA', 'TensorRT', 'Multi-GPU', 'InfiniBand'],
    provider: 'valdi'
  },
  {
    id: 'gpu-trader-rtx4090',
    name: 'GPU Trader RTX 4090',
    type: 'gpu',
    region: 'us-west',
    pricing: {
      hourly: 0.89,
      currency: 'USD'
    },
    specs: {
      cpu: {
        cores: 12,
        architecture: 'x86_64'
      },
      gpu: {
        model: 'NVIDIA RTX 4090',
        memory: '24 GB GDDR6X',
        cuda: true,
        tensorCores: true
      },
      memory: '64 GB',
      storage: '500 GB NVMe',
      network: '10 Gbps'
    },
    availability: {
      status: 'limited',
      regions: ['us-west', 'us-east'],
      autoScaling: false
    },
    features: ['CUDA', 'RT Cores', 'DLSS 3', 'AV1 Encoding'],
    provider: 'gpu-trader'
  },
  {
    id: 'twcc-v100',
    name: 'TWCC Tesla V100',
    type: 'gpu',
    region: 'asia-pacific',
    pricing: {
      hourly: 1.25,
      currency: 'USD'
    },
    specs: {
      cpu: {
        cores: 8,
        architecture: 'x86_64'
      },
      gpu: {
        model: 'NVIDIA Tesla V100',
        memory: '32 GB HBM2',
        cuda: true,
        tensorCores: true
      },
      memory: '64 GB',
      storage: '200 GB SSD',
      network: '25 Gbps'
    },
    availability: {
      status: 'available',
      regions: ['asia-pacific'],
      autoScaling: true
    },
    features: ['CUDA', 'TensorRT', 'NVLink', 'Academic Pricing'],
    provider: 'twcc'
  },
  {
    id: 'do-c-32',
    name: 'DigitalOcean CPU-Optimized',
    type: 'cpu',
    region: 'global',
    pricing: {
      hourly: 0.476,
      monthly: 320.00,
      currency: 'USD'
    },
    specs: {
      cpu: {
        cores: 32,
        architecture: 'x86_64',
        frequency: '2.4 GHz'
      },
      memory: '64 GB',
      storage: '200 GB SSD',
      network: '9 TB'
    },
    availability: {
      status: 'available',
      regions: ['us-east', 'us-west', 'eu-west', 'asia-pacific'],
      autoScaling: true
    },
    features: ['Load Balancers', 'VPC', 'Monitoring', 'Managed Databases'],
    provider: 'digital-ocean'
  }
]

export const STORAGE_PROVIDERS: StorageProvider[] = [
  {
    id: 'storj-distributed',
    name: 'Storj Distributed Storage',
    type: 'primary',
    pricing: {
      storage: 0.004, // $4/TB/month
      bandwidth: 0.007, // $7/TB
      requests: 0.0000007, // $0.0007/1000 requests
      currency: 'USD'
    },
    specs: {
      durability: '99.95%',
      availability: '99.95%',
      latency: '< 100ms',
      throughput: '10 Gbps',
      encryption: true,
      versioning: true
    },
    regions: ['global'],
    features: ['S3 Compatible', 'Zero-Knowledge', 'Decentralized', 'Edge Caching'],
    provider: 'storj'
  },
  {
    id: 'bunny-cdn',
    name: 'bunny.net CDN',
    type: 'cdn',
    pricing: {
      storage: 0.01, // $10/TB/month
      bandwidth: 0.01, // $10/TB (varies by region)
      requests: 0.0005, // $0.5/1M requests
      currency: 'USD'
    },
    specs: {
      durability: '99.9%',
      availability: '99.9%',
      latency: '< 50ms',
      throughput: '100 Gbps',
      encryption: true,
      versioning: false
    },
    regions: ['global'],
    features: ['Global CDN', 'Image Optimization', 'Video Streaming', 'DDoS Protection'],
    provider: 'bunny'
  },
  {
    id: 'backblaze-b2',
    name: 'Backblaze B2',
    type: 'backup',
    pricing: {
      storage: 0.005, // $5/TB/month
      bandwidth: 0.01, // $10/TB (first 3x storage free)
      requests: 0.0004, // $0.4/10K requests
      currency: 'USD'
    },
    specs: {
      durability: '99.999999999%',
      availability: '99.9%',
      latency: '< 200ms',
      throughput: '1 Gbps',
      encryption: true,
      versioning: true
    },
    regions: ['us-west', 'eu-central'],
    features: ['Lifecycle Rules', 'Cross-Region Replication', 'Immutable Backups'],
    provider: 'backblaze'
  },
  {
    id: 'do-spaces',
    name: 'DigitalOcean Spaces',
    type: 'cache',
    pricing: {
      storage: 0.02, // $20/TB/month
      bandwidth: 0.01, // $10/TB
      requests: 0.0005, // $0.5/1K requests
      currency: 'USD'
    },
    specs: {
      durability: '99.999999999%',
      availability: '99.9%',
      latency: '< 100ms',
      throughput: '5 Gbps',
      encryption: true,
      versioning: true
    },
    regions: ['us-east', 'us-west', 'eu-west', 'asia-pacific'],
    features: ['S3 Compatible', 'CDN Integration', 'CORS Support', 'Access Control'],
    provider: 'digital-ocean'
  }
]

export const getComputeProviderById = (id: string): ComputeProvider | undefined => {
  return COMPUTE_PROVIDERS.find(provider => provider.id === id)
}

export const getStorageProviderById = (id: string): StorageProvider | undefined => {
  return STORAGE_PROVIDERS.find(provider => provider.id === id)
}

export const getProvidersByType = (type: 'cpu' | 'gpu' | 'hybrid') => {
  return COMPUTE_PROVIDERS.filter(provider => provider.type === type)
}

export const getProvidersByRegion = (region: string) => {
  return COMPUTE_PROVIDERS.filter(provider => 
    provider.availability.regions.includes(region)
  )
}

export const getOptimalProvider = (requirements: {
  type: 'cpu' | 'gpu' | 'hybrid'
  region?: string
  maxCost?: number
  minCores?: number
  minMemory?: number
}) => {
  let candidates = COMPUTE_PROVIDERS.filter(provider => provider.type === requirements.type)
  
  if (requirements.region) {
    candidates = candidates.filter(provider => 
      provider.availability.regions.includes(requirements.region!)
    )
  }
  
  if (requirements.maxCost) {
    candidates = candidates.filter(provider => 
      provider.pricing.hourly <= requirements.maxCost!
    )
  }
  
  if (requirements.minCores && requirements.minMemory) {
    candidates = candidates.filter(provider => {
      const cores = provider.specs.cpu?.cores || 0
      const memory = parseInt(provider.specs.memory.split(' ')[0])
      return cores >= requirements.minCores! && memory >= requirements.minMemory!
    })
  }
  
  return candidates.sort((a, b) => {
    const aScore = (a.specs.cpu?.cores || 1) / a.pricing.hourly
    const bScore = (b.specs.cpu?.cores || 1) / b.pricing.hourly
    return bScore - aScore
  })[0]
}
