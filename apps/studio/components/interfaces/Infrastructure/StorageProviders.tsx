import React, { useState, useMemo } from 'react'
import { Search, Database, Globe, Shield, Plus } from 'lucide-react'
import { Input, Button, Badge } from 'ui'
import { STORAGE_PROVIDERS } from '../../../lib/infrastructure/providers'
import { StorageProvider } from '../../../lib/infrastructure/types'

const StorageProviders = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'primary' | 'cdn' | 'backup' | 'cache'>(
    'all'
  )
  const [sortBy, setSortBy] = useState<'cost' | 'performance' | 'durability'>('cost')

  const filteredProviders = useMemo(() => {
    let providers =
      selectedType === 'all'
        ? STORAGE_PROVIDERS
        : STORAGE_PROVIDERS.filter((p) => p.type === selectedType)

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

    return providers.sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return a.pricing.storage - b.pricing.storage
        case 'performance':
          return parseInt(a.specs.latency) - parseInt(b.specs.latency)
        case 'durability':
          return parseFloat(b.specs.durability) - parseFloat(a.specs.durability)
        default:
          return 0
      }
    })
  }, [searchQuery, selectedType, sortBy])

  const renderProviderCard = (provider: StorageProvider) => (
    <div key={provider.id} className="bg-surface-100 border border-overlay rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-200 rounded-lg flex items-center justify-center">
            {provider.type === 'cdn' ? (
              <Globe className="w-5 h-5 text-brand-600" />
            ) : provider.type === 'backup' ? (
              <Shield className="w-5 h-5 text-brand-600" />
            ) : (
              <Database className="w-5 h-5 text-brand-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{provider.name}</h3>
            <p className="text-sm text-foreground-light">{provider.provider.toUpperCase()}</p>
          </div>
        </div>
        <Badge variant="outline">{provider.type.toUpperCase()}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-foreground-light mb-1">Durability</p>
          <p className="text-sm font-medium">{provider.specs.durability}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">Availability</p>
          <p className="text-sm font-medium">{provider.specs.availability}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">Latency</p>
          <p className="text-sm font-medium">{provider.specs.latency}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">Encryption</p>
          <p className="text-sm font-medium">{provider.specs.encryption ? 'Yes' : 'No'}</p>
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
          {provider.regions.slice(0, 3).map((region) => (
            <Badge key={region} variant="secondary" className="text-xs">
              {region}
            </Badge>
          ))}
          {provider.regions.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{provider.regions.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground-light">Storage:</span>
          <span className="font-medium">${provider.pricing.storage}/GB/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-light">Bandwidth:</span>
          <span className="font-medium">${provider.pricing.bandwidth}/GB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-light">Requests:</span>
          <span className="font-medium">${provider.pricing.requests}/1K</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-overlay">
        <div>
          <p className="text-sm text-foreground-light">Starting at</p>
          <p className="text-lg font-bold text-foreground">${provider.pricing.storage}/GB</p>
        </div>
        <Button type="primary" size="small">
          Configure
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Storage & CDN Providers</h1>
          <Button type="primary" size="small">
            Add Custom Storage
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search storage providers, features, or regions..."
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
            <option value="primary">Primary Storage</option>
            <option value="cdn">CDN</option>
            <option value="backup">Backup</option>
            <option value="cache">Cache</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-overlay rounded text-sm"
          >
            <option value="cost">Sort by Cost</option>
            <option value="performance">Sort by Performance</option>
            <option value="durability">Sort by Durability</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-surface-100 rounded border border-overlay">
          <div className="text-center">
            <p className="text-sm font-medium">Available Providers</p>
            <p className="text-2xl font-bold text-brand-600">{filteredProviders.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">CDN Providers</p>
            <p className="text-2xl font-bold text-purple-600">
              {filteredProviders.filter((p) => p.type === 'cdn').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Backup Solutions</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredProviders.filter((p) => p.type === 'backup').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Avg. Storage Cost</p>
            <p className="text-2xl font-bold text-orange-600">
              $
              {(
                filteredProviders.reduce((sum, p) => sum + p.pricing.storage, 0) /
                  filteredProviders.length || 0
              ).toFixed(3)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProviders.map(renderProviderCard)}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-foreground-light mx-auto mb-4" />
          <p className="text-foreground-light">
            No storage providers found matching your criteria.
          </p>
          <Button type="outline" size="small" className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default StorageProviders
