import React, { useState, useMemo } from 'react'
import { Search, Server, Cpu, Zap, Plus } from 'lucide-react'
import { Input, Button, Badge } from 'ui'
import {
  COMPUTE_PROVIDERS,
  getProvidersByType,
  getOptimalProvider,
} from '../../../lib/infrastructure/providers'
import { ComputeProvider } from '../../../lib/infrastructure/types'

const ComputeProviders = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'cpu' | 'gpu' | 'hybrid'>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'cost' | 'performance' | 'availability'>('cost')

  const filteredProviders = useMemo(() => {
    let providers = selectedType === 'all' ? COMPUTE_PROVIDERS : getProvidersByType(selectedType)

    if (searchQuery) {
      providers = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.features.some((feature) =>
            feature.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    }

    if (selectedRegion !== 'all') {
      providers = providers.filter((provider) =>
        provider.availability.regions.includes(selectedRegion)
      )
    }

    return providers.sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return a.pricing.hourly - b.pricing.hourly
        case 'performance':
          return (b.specs.cpu?.cores || 0) - (a.specs.cpu?.cores || 0)
        case 'availability':
          return a.availability.status === 'available' ? -1 : 1
        default:
          return 0
      }
    })
  }, [searchQuery, selectedType, selectedRegion, sortBy])

  const regions = useMemo(() => {
    const allRegions = new Set<string>()
    COMPUTE_PROVIDERS.forEach((provider) => {
      provider.availability.regions.forEach((region) => allRegions.add(region))
    })
    return Array.from(allRegions).sort()
  }, [])

  const renderProviderCard = (provider: ComputeProvider) => (
    <div key={provider.id} className="bg-surface-100 border border-overlay rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-200 rounded-lg flex items-center justify-center">
            {provider.type === 'gpu' ? (
              <Zap className="w-5 h-5 text-brand-600" />
            ) : (
              <Cpu className="w-5 h-5 text-brand-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{provider.name}</h3>
            <p className="text-sm text-foreground-light">{provider.provider.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={provider.type === 'gpu' ? 'brand' : 'secondary'}>
            {provider.type.toUpperCase()}
          </Badge>
          <Badge
            variant={
              provider.availability.status === 'available'
                ? 'success'
                : provider.availability.status === 'limited'
                  ? 'warning'
                  : 'destructive'
            }
          >
            {provider.availability.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-foreground-light mb-1">CPU Cores</p>
          <p className="text-sm font-medium">{provider.specs.cpu?.cores || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">Memory</p>
          <p className="text-sm font-medium">{provider.specs.memory}</p>
        </div>
        {provider.specs.gpu && (
          <>
            <div>
              <p className="text-xs text-foreground-light mb-1">GPU</p>
              <p className="text-sm font-medium">{provider.specs.gpu.model}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-light mb-1">GPU Memory</p>
              <p className="text-sm font-medium">{provider.specs.gpu.memory}</p>
            </div>
          </>
        )}
        <div>
          <p className="text-xs text-foreground-light mb-1">Storage</p>
          <p className="text-sm font-medium">{provider.specs.storage}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">Network</p>
          <p className="text-sm font-medium">{provider.specs.network}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-foreground-light mb-2">Features</p>
        <div className="flex flex-wrap gap-1">
          {provider.features.slice(0, 4).map((feature) => (
            <Badge key={feature} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {provider.features.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{provider.features.length - 4}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-foreground-light mb-2">Available Regions</p>
        <div className="flex flex-wrap gap-1">
          {provider.availability.regions.slice(0, 3).map((region) => (
            <Badge key={region} variant="secondary" className="text-xs">
              {region}
            </Badge>
          ))}
          {provider.availability.regions.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{provider.availability.regions.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-overlay">
        <div>
          <p className="text-lg font-bold text-foreground">${provider.pricing.hourly}/hr</p>
          {provider.pricing.monthly && (
            <p className="text-sm text-foreground-light">${provider.pricing.monthly}/mo</p>
          )}
        </div>
        <Button type="primary" size="small">
          Deploy
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Compute Providers</h1>
          <Button type="primary" size="small" icon={<Plus className="w-4 h-4" />}>
            Add Custom Provider
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search providers, features, or regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-1 border border-overlay rounded text-sm"
          >
            <option value="all">All Types</option>
            <option value="cpu">CPU Only</option>
            <option value="gpu">GPU Accelerated</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1 border border-overlay rounded text-sm"
          >
            <option value="all">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-overlay rounded text-sm"
          >
            <option value="cost">Sort by Cost</option>
            <option value="performance">Sort by Performance</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-100 rounded border border-overlay">
          <div className="text-center">
            <p className="text-sm font-medium">Available Providers</p>
            <p className="text-2xl font-bold text-brand-600">{filteredProviders.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">GPU Providers</p>
            <p className="text-2xl font-bold text-purple-600">
              {filteredProviders.filter((p) => p.type === 'gpu').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Avg. Cost/Hour</p>
            <p className="text-2xl font-bold text-green-600">
              $
              {(
                filteredProviders.reduce((sum, p) => sum + p.pricing.hourly, 0) /
                  filteredProviders.length || 0
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProviders.map(renderProviderCard)}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Server className="w-12 h-12 text-foreground-light mx-auto mb-4" />
          <p className="text-foreground-light">
            No compute providers found matching your criteria.
          </p>
          <Button type="outline" size="small" className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default ComputeProviders
