import React, { useState, useMemo } from 'react'
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle, Target } from 'lucide-react'
import { Button, Badge } from 'ui'
import { COMPUTE_PROVIDERS, STORAGE_PROVIDERS } from '../../../lib/infrastructure/providers'

const CostManagement = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const mockCostData = useMemo(
    () => ({
      current: {
        compute: 1247.5,
        storage: 89.3,
        bandwidth: 156.2,
        total: 1493.0,
      },
      projected: {
        compute: 1580.0,
        storage: 120.0,
        bandwidth: 200.0,
        total: 1900.0,
      },
      savings: {
        potential: 312.5,
        recommendations: [
          {
            type: 'downsize',
            resource: 'Hetzner CX51 Instance #3',
            currentCost: 39.69,
            projectedCost: 19.84,
            savings: 19.85,
            confidence: 0.85,
            reason: 'Low CPU utilization (avg 15%)',
          },
          {
            type: 'migrate',
            resource: 'GPU Trader RTX 4090',
            currentCost: 640.32,
            projectedCost: 447.3,
            savings: 193.02,
            confidence: 0.92,
            reason: 'Valdi.ai A100 offers better price/performance',
          },
          {
            type: 'terminate',
            resource: 'DigitalOcean Spaces #2',
            currentCost: 60.0,
            projectedCost: 0,
            savings: 60.0,
            confidence: 0.95,
            reason: 'No access in 45 days',
          },
        ],
      },
      breakdown: [
        { provider: 'Hetzner', cost: 318.52, percentage: 21.3, trend: 'down' },
        { provider: 'Valdi.ai', cost: 447.3, percentage: 30.0, trend: 'up' },
        { provider: 'GPU Trader', cost: 320.16, percentage: 21.4, trend: 'stable' },
        { provider: 'Storj', cost: 89.3, percentage: 6.0, trend: 'up' },
        { provider: 'bunny.net', cost: 156.2, percentage: 10.5, trend: 'down' },
        { provider: 'Others', cost: 161.52, percentage: 10.8, trend: 'stable' },
      ],
    }),
    []
  )

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />
      default:
        return <Target className="w-4 h-4 text-gray-500" />
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'downsize':
        return <TrendingDown className="w-4 h-4 text-blue-500" />
      case 'migrate':
        return <Target className="w-4 h-4 text-purple-500" />
      case 'terminate':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Cost Management</h1>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1 border border-overlay rounded text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-100 border border-overlay rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground-light">Current Spend</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${mockCostData.current.total.toFixed(2)}
          </p>
          <p className="text-xs text-foreground-light">This month</p>
        </div>

        <div className="bg-surface-100 border border-overlay rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground-light">Projected</p>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${mockCostData.projected.total.toFixed(2)}
          </p>
          <p className="text-xs text-foreground-light">End of month</p>
        </div>

        <div className="bg-surface-100 border border-overlay rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground-light">Potential Savings</p>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            ${mockCostData.savings.potential.toFixed(2)}
          </p>
          <p className="text-xs text-foreground-light">Per month</p>
        </div>

        <div className="bg-surface-100 border border-overlay rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground-light">Efficiency Score</p>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">78%</p>
          <p className="text-xs text-foreground-light">Cost optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-100 border border-overlay rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cost Breakdown by Provider</h3>
          <div className="space-y-3">
            {mockCostData.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTrendIcon(item.trend)}
                  <span className="text-sm font-medium">{item.provider}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground-light">{item.percentage}%</span>
                  <span className="text-sm font-medium">${item.cost.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-100 border border-overlay rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Cost Optimization Recommendations
          </h3>
          <div className="space-y-4">
            {mockCostData.savings.recommendations.map((rec, index) => (
              <div key={index} className="border border-overlay rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getRecommendationIcon(rec.type)}
                    <Badge variant="outline" className="text-xs">
                      {rec.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">${rec.savings.toFixed(2)}/mo</p>
                    <p className="text-xs text-foreground-light">
                      {Math.round(rec.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{rec.resource}</p>
                <p className="text-xs text-foreground-light mb-3">{rec.reason}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-foreground-light">Current: </span>
                    <span className="font-medium">${rec.currentCost.toFixed(2)}</span>
                    <span className="text-foreground-light"> → </span>
                    <span className="font-medium">${rec.projectedCost.toFixed(2)}</span>
                  </div>
                  <Button type="outline" size="tiny">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface-100 border border-overlay rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Resource Utilization</h3>
          <Button type="outline" size="small">
            View Details
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground-light mb-1">Compute Utilization</p>
            <p className="text-2xl font-bold text-foreground">67%</p>
            <p className="text-xs text-foreground-light">Average across all instances</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground-light mb-1">Storage Efficiency</p>
            <p className="text-2xl font-bold text-foreground">84%</p>
            <p className="text-xs text-foreground-light">Used vs allocated</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground-light mb-1">Network Optimization</p>
            <p className="text-2xl font-bold text-foreground">92%</p>
            <p className="text-xs text-foreground-light">CDN hit ratio</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostManagement
