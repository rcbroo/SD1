import { useState } from 'react'
import { Button, Input } from 'ui'
import { Upload, Search, Filter, Grid, List, Image, Video, FileText, Cube } from 'lucide-react'

interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | '3d' | 'document'
  url: string
  size: number
  createdAt: string
  tags: string[]
}

export const CMSDigitalAssetManager = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'hero-image.jpg',
      type: 'image',
      url: '/placeholder-image.jpg',
      size: 2048000,
      createdAt: '2024-01-15',
      tags: ['hero', 'banner']
    },
    {
      id: '2',
      name: 'product-demo.mp4',
      type: 'video',
      url: '/placeholder-video.mp4',
      size: 15728640,
      createdAt: '2024-01-14',
      tags: ['demo', 'product']
    },
    {
      id: '3',
      name: 'model.glb',
      type: '3d',
      url: '/placeholder-model.glb',
      size: 5242880,
      createdAt: '2024-01-13',
      tags: ['3d', 'model']
    }
  ])
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || asset.type === selectedType
    return matchesSearch && matchesType
  })

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={20} />
      case 'video': return <Video size={20} />
      case '3d': return <Cube size={20} />
      default: return <FileText size={20} />
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Digital Asset Manager</h2>
        <Button type="primary" icon={<Upload size={16} />}>
          Upload Assets
        </Button>
      </div>

      <div className="flex items-center space-x-4 p-4 border-b">
        <div className="flex-1">
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="3d">3D Models</option>
          <option value="document">Documents</option>
        </select>

        <div className="flex space-x-2">
          <Button
            type={viewMode === 'grid' ? 'primary' : 'default'}
            size="small"
            icon={<Grid size={16} />}
            onClick={() => setViewMode('grid')}
          />
          <Button
            type={viewMode === 'list' ? 'primary' : 'default'}
            size="small"
            icon={<List size={16} />}
            onClick={() => setViewMode('list')}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                  {getAssetIcon(asset.type)}
                </div>
                <div className="text-sm font-medium truncate">{asset.name}</div>
                <div className="text-xs text-foreground-light">{formatFileSize(asset.size)}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center space-x-4 p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  {getAssetIcon(asset.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-foreground-light">
                    {formatFileSize(asset.size)} • {asset.createdAt}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
