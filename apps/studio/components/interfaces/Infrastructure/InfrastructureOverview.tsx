import React, { useState, useMemo } from 'react'
import { Server, Database, Globe, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'
import { Button, Badge } from 'ui'
import { COMPUTE_PROVIDERS, STORAGE_PROVIDERS } from '../../../lib/infrastructure/providers'
import { ResourceAllocation } from '../../../lib/infrastructure/types'

interface InfrastructureOverviewProps {
  projectId: string
}

const InfrastructureOverview = ({ projectId }: InfrastructureOverviewProps) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'compute' | 'storage' | 'costs'>('overview')

  const mockAllocations: ResourceAllocation[] = [
    {
      id: 'alloc-1',
      projectId,
      type: 'compute',
      provider: 'hetzner',
      region: 'eu-central',
      specs: { cores: 8, memory: '32 GB' },
      status: 'active',
      cost: { current: 39.69, projected: 1190.70, currency: 'EUR' },
      metrics: { cpu: 45, memory: 67, requests: 1250 },
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-17T09:00:00Z'
    },
    {
      id: 'alloc-2',
      projectId,
      type: 'storage',
      provider: 'storj',
      region: 'global',
      specs: { capacity: '500 GB' },
      status: 'active',
      cost: { current: 2.00, projected: 60.00, currency: 'USD' },
      metrics: { storage: 78, bandwidth: 125 },
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-17T09:00:00Z'
    }
  ]

  const totalMonthlyCost = useMemo(() => {
    return mockAllocations.reduce((sum, allocation) => sum + allocation.cost.projected, 0)
  }, [mockAllocations])

  const activeResources = useMemo(() => {
    return mockAllocations.filter(allocation => allocation.status === 'active').length
  }, [mockAllocations])

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-100 border border-overlay rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-200 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-light">Active Resources</p>
              <p className="text-2xl font-bold text-foreground">{activeResources}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-100 border border-overlay rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-light">Monthly Cost</p>
              <p className="text-2xl font-bold text-foreground">${totalMonthlyCost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-100 border border-overlay rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-light">Regions</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-100 border border-overlay rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-foreground-light">Efficiency</p>
              <p className="text-2xl font-bold text-foreground">87%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-100 border border-overlay rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Resource Allocations</h3>
        <div className="space-y-4">
          {mockAllocations.map((allocation) => (
            <div key={allocation.id} className="flex items-center justify-between p-4 bg-surface-200 rounded border border-overlay">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-brand-200 rounded flex items-center justify-center">
                  {allocation.type === 'compute' ? (
                    <Server className="w-4 h-4 text-brand-600" />
                  ) : (
                    <Database className="w-4 h-4 text-brand-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{allocation.provider.toUpperCase()} - {allocation.region}</p>
                  <p className="text-sm text-foreground-light">
                    {allocation.type === 'compute' 
                      ? `${allocation.specs.cores} cores, ${allocation.specs.memory}`
                      : `${allocation.specs.capacity} storage`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={allocation.status === 'active' ? 'success' : 'secondary'}>
                  {allocation.status}
                </Badge>
                <div className="text-right">
                  <p className="font-medium text-foreground">${allocation.cost.projected.toFixed(2)}/mo</p>
                  <p className="text-sm text-foreground-light">Current: ${allocation.cost.current.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderComputeTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Compute Providers</h3>
        <Button type="primary" size="small">
          Add Compute Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {COMPUTE_PROVIDERS.map((provider) => (
          <div key={provider.id} className="bg-surface-100 border border-overlay rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-foreground">{provider.name}</h4>
                <p className="text-sm text-foreground-light">{provider.provider.toUpperCase()}</p>
              </div>
              <Badge variant={provider.type === 'gpu' ? 'brand' : 'secondary'}>
                {provider.type.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-foreground-light">CPU</p>
                <p className="text-sm font-medium">{provider.specs.cpu?.cores} cores</p>
              </div>
              <div>
                <p className="text-xs text-foreground-light">Memory</p>
                <p className="text-sm font-medium">{provider.specs.memory}</p>
              </div>
              {provider.specs.gpu && (
                <>
                  <div>
                    <p className="text-xs text-foreground-light">GPU</p>
                    <p className="text-sm font-medium">{provider.specs.gpu.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-light">GPU Memory</p>
                    <p className="text-sm font-medium">{provider.specs.gpu.memory}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">
                  ${provider.pricing.hourly}/hr
                </p>
                {provider.pricing.monthly && (
                  <p className="text-sm text-foreground-light">
                    ${provider.pricing.monthly}/mo
                  </p>
                )}
              </div>
              <Badge variant={
                provider.availability.status === 'available' ? 'success' : 
                provider.availability.status === 'limited' ? 'warning' : 'destructive'
              }>
                {provider.availability.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStorageTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Storage Providers</h3>
        <Button type="primary" size="small">
          Configure Storage
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {STORAGE_PROVIDERS.map((provider) => (
          <div key={provider.id} className="bg-surface-100 border border-overlay rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-foreground">{provider.name}</h4>
                <p className="text-sm text-foreground-light">{provider.provider.toUpperCase()}</p>
              </div>
              <Badge variant="outline">
                {provider.type.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-foreground-light">Durability</p>
                <p className="text-sm font-medium">{provider.specs.durability}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-light">Availability</p>
                <p className="text-sm font-medium">{provider.specs.availability}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-light">Latency</p>
                <p className="text-sm font-medium">{provider.specs.latency}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-light">Encryption</p>
                <p className="text-sm font-medium">{provider.specs.encryption ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground-light">Storage:</span>
                <span className="text-sm font-medium">${provider.pricing.storage}/GB/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground-light">Bandwidth:</span>
                <span className="text-sm font-medium">${provider.pricing.bandwidth}/GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground-light">Requests:</span>
                <span className="text-sm font-medium">${provider.pricing.requests}/1K</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCostsTab = () => (
    <div className="space-y-6">
      <div className="bg-surface-100 border border-overlay rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cost Optimization Recommendations</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Consider GPU Provider Migration</p>
              <p className="text-sm text-yellow-700">
                Migrating from GPU Trader to Valdi.ai could save $156/month with better performance.
              </p>
              <p className="text-xs text-yellow-600 mt-1">Confidence: 85%</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Enable Auto-scaling</p>
              <p className="text-sm text-blue-700">
                Auto-scaling could reduce compute costs by 30% during low-usage periods.
              </p>
              <p className="text-xs text-blue-600 mt-1">Potential savings: $89/month</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded">
            <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Storage Lifecycle Optimization</p>
              <p className="text-sm text-green-700">
                Moving old assets to cold storage could save $23/month.
              </p>
              <p className="text-xs text-green-600 mt-1">Applies to 45% of current storage</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-100 border border-overlay rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cost Breakdown</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground-light">Compute (Hetzner)</span>
            <span className="font-medium">$1,190.70/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground-light">Storage (Storj)</span>
            <span className="font-medium">$60.00/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground-light">CDN (bunny.net)</span>
            <span className="font-medium">$15.50/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground-light">Backup (Backblaze)</span>
            <span className="font-medium">$8.25/mo</span>
          </div>
          <hr className="border-overlay" />
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span>${totalMonthlyCost.toFixed(2)}/mo</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Infrastructure Overview</h1>
          <Button type="primary" size="small">
            Optimize Resources
          </Button>
        </div>

        <div className="flex space-x-1 bg-surface-200 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'compute', label: 'Compute' },
            { key: 'storage', label: 'Storage' },
            { key: 'costs', label: 'Costs' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.key
                  ? 'bg-surface-100 text-foreground shadow-sm'
                  : 'text-foreground-light hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === 'overview' && renderOverviewTab()}
      {selectedTab === 'compute' && renderComputeTab()}
      {selectedTab === 'storage' && renderStorageTab()}
      {selectedTab === 'costs' && renderCostsTab()}
    </div>
  )
}

export default InfrastructureOverview
