import React, { useState } from 'react'
import { Star, Zap, DollarSign, Clock, CheckCircle, XCircle, Settings } from 'lucide-react'
import { Button, Badge } from 'ui'
import { AIProvider } from 'lib/ai/providers/types'

interface AIProviderCardProps {
  provider: AIProvider
  isConfigured?: boolean
  onConfigure?: (providerId: string) => void
  onToggle?: (providerId: string, enabled: boolean) => void
}

const AIProviderCard = ({
  provider,
  isConfigured = false,
  onConfigure,
  onToggle,
}: AIProviderCardProps) => {
  const [isEnabled, setIsEnabled] = useState(provider.status === 'active')

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    onToggle?.(provider.id, newState)
  }

  const Icon = provider.icon
  const statusColor =
    provider.status === 'active'
      ? 'text-green-600'
      : provider.status === 'error'
        ? 'text-red-600'
        : 'text-gray-400'

  const getCapabilityBadges = () => {
    return provider.capabilities
      .filter((cap) => cap.supported)
      .slice(0, 3)
      .map((cap) => (
        <Badge key={cap.type} variant="secondary" className="text-xs">
          {cap.type.replace('-', ' ')}
        </Badge>
      ))
  }

  const getQualityScore = () => {
    const scores = provider.capabilities
      .filter((cap) => cap.supported)
      .map((cap) => {
        const qualityMap = { low: 1, medium: 2, high: 3, premium: 4 }
        return qualityMap[cap.quality]
      })
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  }

  return (
    <div className="bg-surface-100 border border-overlay flex flex-col overflow-hidden rounded shadow-sm">
      <div className="border-b border-overlay flex justify-between w-full py-3 px-5">
        <div className="max-w-[75%] flex items-center space-x-3 truncate">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-brand-200">
            <Icon className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-foreground truncate">{provider.name}</h3>
              {provider.status === 'active' ? (
                <CheckCircle className={`w-3 h-3 ${statusColor}`} />
              ) : (
                <XCircle className={`w-3 h-3 ${statusColor}`} />
              )}
            </div>
            <p className="text-xs text-foreground-light">{provider.regions.join(', ')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConfigured ? (
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={handleToggle}
                  className="w-3 h-3"
                />
                <span className="text-xs">Enabled</span>
              </label>
              <Button
                type="outline"
                size="tiny"
                icon={<Settings className="w-3 h-3" />}
                onClick={() => onConfigure?.(provider.id)}
              />
            </div>
          ) : (
            <Button type="primary" size="tiny" onClick={() => onConfigure?.(provider.id)}>
              Configure
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col p-5 space-y-4">
        <p className="text-sm text-foreground-light">{provider.description}</p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-foreground-light" />
              <span className="text-xs font-medium">Cost</span>
            </div>
            <span className="text-xs text-foreground-light">
              ${(provider.pricing.costPerToken * 1000).toFixed(4)}/1K
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-foreground-light" />
              <span className="text-xs font-medium">Latency</span>
            </div>
            <span className="text-xs text-foreground-light">
              {provider.performance.averageLatency}ms
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium">Quality</span>
            </div>
            <span className="text-xs text-foreground-light">{getQualityScore()}/4</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {getCapabilityBadges()}
          {provider.capabilities.filter((cap) => cap.supported).length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{provider.capabilities.filter((cap) => cap.supported).length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-overlay">
          <div className="flex items-center space-x-2">
            <Badge variant={provider.pricing.tier === 'free' ? 'success' : 'outline'}>
              {provider.pricing.tier}
            </Badge>
            <span className="text-xs text-foreground-light">
              {provider.performance.uptime}% uptime
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-foreground-light" />
            <span className="text-xs text-foreground-light">
              {provider.performance.throughput}/min
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIProviderCard
