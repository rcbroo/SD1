import React, { useState, useMemo } from 'react'
import { Search, Filter, Upload, Grid, List, Play, Image, Box, Globe } from 'lucide-react'
import { Input, Button, Badge } from 'ui'
import { MediaAsset } from '../../../lib/media/types'
import UnifiedMediaPlayer from './UnifiedMediaPlayer'

const MediaLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)

  const mockAssets: MediaAsset[] = [
    {
      id: '1',
      type: 'image',
      url: 'https://picsum.photos/800/600?random=1',
      format: 'jpg',
      metadata: {
        title: 'Sample Image 1',
        description: 'High-resolution sample image',
        dimensions: { width: 800, height: 600 },
        fileSize: 245760,
        encoding: 'jpeg'
      }
    },
    {
      id: '2',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      format: 'mp4',
      metadata: {
        title: 'Big Buck Bunny',
        description: 'Sample video content',
        duration: 596,
        dimensions: { width: 1920, height: 1080 },
        fileSize: 158000000,
        encoding: 'h264',
        fps: 24
      }
    },
    {
      id: '3',
      type: '3d',
      url: '/models/sample.gltf',
      format: 'gltf',
      metadata: {
        title: 'Sample 3D Model',
        description: 'Interactive 3D model',
        fileSize: 2048000,
        encoding: 'gltf'
      }
    },
    {
      id: '4',
      type: 'xr',
      url: '/xr/sample.usdz',
      format: 'usdz',
      metadata: {
        title: 'AR Experience',
        description: 'Augmented reality content',
        fileSize: 5120000,
        encoding: 'usdz'
      }
    }
  ]

  const filteredAssets = useMemo(() => {
    let assets = mockAssets

    if (searchQuery) {
      assets = assets.filter(asset =>
        asset.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.metadata.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedType !== 'all') {
      assets = assets.filter(asset => asset.type === selectedType)
    }

    return assets
  }, [searchQuery, selectedType])

  const mediaTypes = [
    { value: 'all', label: 'All Media', icon: Grid },
    { value: 'image', label: 'Images', icon: Image },
    { value: 'video', label: 'Videos', icon: Play },
    { value: '3d', label: '3D Models', icon: Box },
    { value: 'xr', label: 'XR Content', icon: Globe },
  ]

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Play className="w-4 h-4" />
      case '3d': return <Box className="w-4 h-4" />
      case 'xr': return <Globe className="w-4 h-4" />
      default: return <Grid className="w-4 h-4" />
    }
  }

  const renderAssetCard = (asset: MediaAsset) => (
    <div
      key={asset.id}
      className="bg-surface-100 border border-overlay rounded-lg overflow-hidden cursor-pointer hover:border-brand-500 transition-colors"
      onClick={() => setSelectedAsset(asset)}
    >
      <div className="aspect-video bg-surface-200 flex items-center justify-center">
        {asset.type === 'image' ? (
          <img
            src={asset.url}
            alt={asset.metadata.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center text-foreground-light">
            {getTypeIcon(asset.type)}
            <span className="text-xs mt-2">{asset.type.toUpperCase()}</span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground truncate">
            {asset.metadata.title}
          </h3>
          <Badge variant="secondary" className="text-xs ml-2">
            {asset.format.toUpperCase()}
          </Badge>
        </div>
        
        <p className="text-xs text-foreground-light mb-2 line-clamp-2">
          {asset.metadata.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-foreground-light">
          <span>{formatFileSize(asset.metadata.fileSize)}</span>
          {asset.metadata.dimensions && (
            <span>
              {asset.metadata.dimensions.width}×{asset.metadata.dimensions.height}
            </span>
          )}
          {asset.metadata.duration && (
            <span>{Math.floor(asset.metadata.duration / 60)}:{(asset.metadata.duration % 60).toString().padStart(2, '0')}</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderAssetList = (asset: MediaAsset) => (
    <div
      key={asset.id}
      className="bg-surface-100 border border-overlay rounded-lg p-4 cursor-pointer hover:border-brand-500 transition-colors"
      onClick={() => setSelectedAsset(asset)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-surface-200 rounded flex items-center justify-center flex-shrink-0">
          {asset.type === 'image' ? (
            <img
              src={asset.url}
              alt={asset.metadata.title}
              className="w-full h-full object-cover rounded"
              loading="lazy"
            />
          ) : (
            getTypeIcon(asset.type)
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-foreground truncate">
              {asset.metadata.title}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {asset.format.toUpperCase()}
            </Badge>
          </div>
          
          <p className="text-xs text-foreground-light mb-2">
            {asset.metadata.description}
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-foreground-light">
            <span>{formatFileSize(asset.metadata.fileSize)}</span>
            {asset.metadata.dimensions && (
              <span>
                {asset.metadata.dimensions.width}×{asset.metadata.dimensions.height}
              </span>
            )}
            {asset.metadata.duration && (
              <span>{Math.floor(asset.metadata.duration / 60)}:{(asset.metadata.duration % 60).toString().padStart(2, '0')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <div className="flex items-center space-x-2">
            <Button
              type="outline"
              size="small"
              icon={<Upload className="w-4 h-4" />}
            >
              Upload
            </Button>
            <div className="flex items-center border border-overlay rounded">
              <Button
                type={viewMode === 'grid' ? 'primary' : 'text'}
                size="tiny"
                icon={<Grid className="w-4 h-4" />}
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              />
              <Button
                type={viewMode === 'list' ? 'primary' : 'text'}
                size="tiny"
                icon={<List className="w-4 h-4" />}
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search media assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {mediaTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  type={selectedType === type.value ? 'primary' : 'outline'}
                  size="small"
                  icon={<Icon className="w-4 h-4" />}
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map(renderAssetCard)}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssets.map(renderAssetList)}
        </div>
      )}

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground-light">No media assets found matching your criteria.</p>
        </div>
      )}

      {selectedAsset && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedAsset.metadata.title}
                </h2>
                <Button
                  type="text"
                  size="small"
                  onClick={() => setSelectedAsset(null)}
                >
                  ✕
                </Button>
              </div>
              
              <UnifiedMediaPlayer
                asset={selectedAsset}
                controls={true}
                className="mb-4"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-foreground-light">Type</p>
                  <p className="text-foreground">{selectedAsset.type}</p>
                </div>
                <div>
                  <p className="text-foreground-light">Format</p>
                  <p className="text-foreground">{selectedAsset.format}</p>
                </div>
                <div>
                  <p className="text-foreground-light">File Size</p>
                  <p className="text-foreground">{formatFileSize(selectedAsset.metadata.fileSize)}</p>
                </div>
                {selectedAsset.metadata.dimensions && (
                  <div>
                    <p className="text-foreground-light">Dimensions</p>
                    <p className="text-foreground">
                      {selectedAsset.metadata.dimensions.width}×{selectedAsset.metadata.dimensions.height}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaLibrary
