import React, { useState } from 'react'
import { Search, Settings, Play, Pause, CheckCircle, XCircle } from 'lucide-react'
import { Input, Button, Badge } from 'ui'
import { MEDIA_PLAYER_CORES, PLATFORM_BACKEND_MATRIX } from '../../../lib/media/cores'
import { MediaPlayerCore } from '../../../lib/media/types'

const PlayerCores = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCore, setSelectedCore] = useState<MediaPlayerCore | null>(null)

  const filteredCores = MEDIA_PLAYER_CORES.filter(core =>
    core.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    core.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatFileSize = (sizeStr: string) => {
    return sizeStr
  }

  const getCapabilityColor = (quality: string) => {
    switch (quality) {
      case 'premium': return 'text-purple-600'
      case 'high': return 'text-blue-600'
      case 'medium': return 'text-green-600'
      case 'low': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const renderCoreCard = (core: MediaPlayerCore) => (
    <div
      key={core.id}
      className="bg-surface-100 border border-overlay rounded-lg p-6 cursor-pointer hover:border-brand-500 transition-colors"
      onClick={() => setSelectedCore(core)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{core.name}</h3>
          <p className="text-sm text-foreground-light">{core.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <Button
            type="outline"
            size="tiny"
            icon={<Settings className="w-3 h-3" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-foreground-light mb-1">Max Resolution</p>
          <p className="text-sm font-medium">{core.performance.maxResolution}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">Frame Rate</p>
          <p className="text-sm font-medium">{core.performance.frameRate} FPS</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">Memory Usage</p>
          <p className="text-sm font-medium">{core.performance.memoryUsage}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-light mb-1">GPU Acceleration</p>
          <div className="flex items-center space-x-1">
            {core.performance.gpuAcceleration ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <XCircle className="w-3 h-3 text-red-600" />
            )}
            <span className="text-sm">{core.performance.gpuAcceleration ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-foreground-light mb-2">Supported Formats</p>
        <div className="flex flex-wrap gap-1">
          {core.supportedFormats.slice(0, 6).map((format) => (
            <Badge key={format} variant="secondary" className="text-xs">
              {format.toUpperCase()}
            </Badge>
          ))}
          {core.supportedFormats.length > 6 && (
            <Badge variant="secondary" className="text-xs">
              +{core.supportedFormats.length - 6}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-foreground-light mb-2">Capabilities</p>
        <div className="space-y-1">
          {core.capabilities.map((capability, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{capability.type.replace('-', ' ')}</span>
              <Badge variant="outline" className={`text-xs ${getCapabilityColor(capability.quality)}`}>
                {capability.quality}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-foreground-light mb-2">Graphics Backends</p>
        <div className="flex flex-wrap gap-1">
          {core.backends.map((backend) => (
            <Badge key={backend.name} variant="outline" className="text-xs">
              {backend.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Media Player Cores</h1>
          <Button type="primary" size="small">
            Configure Cores
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search player cores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-100 rounded border border-overlay">
          <div className="text-center">
            <p className="text-sm font-medium">Active Cores</p>
            <p className="text-2xl font-bold text-brand-600">{MEDIA_PLAYER_CORES.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Supported Platforms</p>
            <p className="text-2xl font-bold text-green-600">{PLATFORM_BACKEND_MATRIX.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Graphics Backends</p>
            <p className="text-2xl font-bold text-purple-600">4</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCores.map(renderCoreCard)}
      </div>

      {filteredCores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground-light">No player cores found matching your criteria.</p>
        </div>
      )}

      {selectedCore && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedCore.name} Configuration
                </h2>
                <Button
                  type="text"
                  size="small"
                  onClick={() => setSelectedCore(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-foreground-light">Max Resolution:</span>
                      <span className="ml-2 text-foreground">{selectedCore.performance.maxResolution}</span>
                    </div>
                    <div>
                      <span className="text-foreground-light">Frame Rate:</span>
                      <span className="ml-2 text-foreground">{selectedCore.performance.frameRate} FPS</span>
                    </div>
                    <div>
                      <span className="text-foreground-light">Memory Usage:</span>
                      <span className="ml-2 text-foreground">{selectedCore.performance.memoryUsage}</span>
                    </div>
                    <div>
                      <span className="text-foreground-light">GPU Acceleration:</span>
                      <span className="ml-2 text-foreground">
                        {selectedCore.performance.gpuAcceleration ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Supported Formats</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedCore.supportedFormats.map((format) => (
                      <Badge key={format} variant="secondary" className="text-xs">
                        {format.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Graphics Backends</h3>
                  <div className="space-y-2">
                    {selectedCore.backends.map((backend) => (
                      <div key={backend.name} className="flex items-center justify-between p-2 bg-surface-200 rounded">
                        <span className="text-sm font-medium">{backend.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            Priority: {backend.priority}
                          </Badge>
                          <span className="text-xs text-foreground-light">
                            {backend.platforms.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerCores
