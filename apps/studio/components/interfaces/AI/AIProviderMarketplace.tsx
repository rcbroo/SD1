import React, { useState, useMemo } from 'react'
import { Search, Filter, TrendingUp, Zap, DollarSign } from 'lucide-react'
import { Input, Button } from 'ui'
import { AI_PROVIDERS } from 'lib/ai/providers/registry'
import { useAIProviderConfigsQuery } from 'data/ai/ai-provider-configs-query'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import AIProviderCard from './AIProviderCard'

const AIProviderMarketplace = () => {
  const { project } = useProjectContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCapability, setSelectedCapability] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'cost' | 'speed' | 'quality'>('quality')

  const { data: configs } = useAIProviderConfigsQuery({
    projectRef: project?.ref,
  })

  const configuredProviderIds = useMemo(() => {
    return new Set(configs?.map((config: any) => config.providerId) || [])
  }, [configs])

  const filteredProviders = useMemo(() => {
    let providers = AI_PROVIDERS

    if (searchQuery) {
      providers = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCapability !== 'all') {
      providers = providers.filter((provider) =>
        provider.capabilities.some((cap) => cap.type === selectedCapability && cap.supported)
      )
    }

    return providers.sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return a.pricing.costPerToken - b.pricing.costPerToken
        case 'speed':
          return a.performance.averageLatency - b.performance.averageLatency
        case 'quality':
          const getQualityScore = (provider: any) => {
            const scores = provider.capabilities
              .filter((cap: any) => cap.supported)
              .map((cap: any) => {
                const qualityMap = { low: 1, medium: 2, high: 3, premium: 4 }
                return qualityMap[cap.quality as keyof typeof qualityMap] || 1
              })
            return scores.length > 0
              ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
              : 0
          }
          return getQualityScore(b) - getQualityScore(a)
        default:
          return 0
      }
    })
  }, [searchQuery, selectedCapability, sortBy])

  const capabilities = [
    { value: 'all', label: 'All Capabilities' },
    { value: 'text-generation', label: 'Text Generation' },
    { value: 'image-generation', label: 'Image Generation' },
    { value: 'audio-transcription', label: 'Audio Transcription' },
    { value: 'embeddings', label: 'Embeddings' },
    { value: 'vision', label: 'Vision' },
    { value: 'function-calling', label: 'Function Calling' },
  ]

  const handleProviderConfigure = (providerId: string) => {
    console.log('Configure provider:', providerId)
  }

  const handleProviderToggle = (providerId: string, enabled: boolean) => {
    console.log('Toggle provider:', providerId, enabled)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">AI Provider Marketplace</h1>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-overlay rounded text-sm"
            >
              <option value="quality">Sort by Quality</option>
              <option value="cost">Sort by Cost</option>
              <option value="speed">Sort by Speed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search AI providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedCapability}
            onChange={(e) => setSelectedCapability(e.target.value)}
            className="px-3 py-1 border border-overlay rounded text-sm"
          >
            {capabilities.map((capability) => (
              <option key={capability.value} value={capability.value}>
                {capability.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-100 rounded border border-overlay">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <div>
              <p className="text-sm font-medium">Best Performance</p>
              <p className="text-xs text-foreground-light">OpenAI GPT-4 Turbo</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Most Cost-Effective</p>
              <p className="text-xs text-foreground-light">Valdi.ai GPU Compute</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">Fastest Response</p>
              <p className="text-xs text-foreground-light">Valdi.ai GPU Compute</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProviders.map((provider) => (
          <AIProviderCard
            key={provider.id}
            provider={provider}
            isConfigured={configuredProviderIds.has(provider.id)}
            onConfigure={handleProviderConfigure}
            onToggle={handleProviderToggle}
          />
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground-light">No AI providers found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default AIProviderMarketplace
