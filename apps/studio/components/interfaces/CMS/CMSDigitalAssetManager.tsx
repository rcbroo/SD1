import { useState } from 'react'
import { Button, Input, cn } from 'ui'
import { Upload, Search, Filter, Grid, List, Image, Video, FileText, Download, Trash2, FolderOpen, Plus, MoreHorizontal } from 'lucide-react'

interface DigitalAsset {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | '3d' | 'audio'
  url: string
  size: number
  created_at: string
  tags: string[]
  folder: string
  dimensions?: { width: number; height: number }
  duration?: number
}

interface AssetFolder {
  id: string
  name: string
  parent?: string
  children: string[]
  assetCount: number
}

export const CMSDigitalAssetManager = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>('root')

  const mockFolders: AssetFolder[] = [
    { id: 'root', name: 'Root', children: ['images', 'videos', 'documents'], assetCount: 156 },
    { id: 'images', name: 'Images', parent: 'root', children: ['hero', 'products'], assetCount: 89 },
    { id: 'videos', name: 'Videos', parent: 'root', children: ['demos', 'tutorials'], assetCount: 23 },
    { id: 'documents', name: 'Documents', parent: 'root', children: [], assetCount: 44 },
    { id: 'hero', name: 'Hero Images', parent: 'images', children: [], assetCount: 12 },
    { id: 'products', name: 'Product Images', parent: 'images', children: [], assetCount: 67 },
  ]

  const mockAssets: DigitalAsset[] = [
    {
      id: '1',
      name: 'hero-banner-2024.jpg',
      type: 'image',
      url: '/placeholder-image.jpg',
      size: 2048000,
      created_at: '2024-01-15T10:00:00Z',
      tags: ['hero', 'banner', '2024'],
      folder: 'hero',
      dimensions: { width: 1920, height: 1080 }
    },
    {
      id: '2',
      name: 'product-showcase.mp4',
      type: 'video',
      url: '/placeholder-video.mp4',
      size: 15728640,
      created_at: '2024-01-14T14:30:00Z',
      tags: ['product', 'showcase', 'demo'],
      folder: 'demos',
      duration: 120
    },
    {
      id: '3',
      name: 'user-manual-v3.pdf',
      type: 'document',
      url: '/placeholder-doc.pdf',
      size: 1024000,
      created_at: '2024-01-13T09:15:00Z',
      tags: ['manual', 'documentation', 'v3'],
      folder: 'documents'
    }
  ]

  const currentFolderData = mockFolders.find(f => f.id === currentFolder)
  const childFolders = mockFolders.filter(f => f.parent === currentFolder)
  const folderAssets = mockAssets.filter(asset => asset.folder === currentFolder)

  const filteredAssets = folderAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || asset.type === selectedType
    return matchesSearch && matchesType
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
      case 'document':
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const handleAssetSelect = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) 
        ? prev.filter(assetId => assetId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([])
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      console.log('Uploading files:', files)
    }
  }

  return (
    <div className="flex h-full">
      <div className="w-64 bg-surface-100 border-r border-border-overlay">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground-light uppercase tracking-wide">Folders</h3>
            <Button type="text" size="tiny">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            {childFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.id)}
                className="flex items-center justify-between w-full text-left p-2 text-sm text-foreground-muted hover:bg-surface-200 hover:text-foreground rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  {folder.name}
                </div>
                <span className="text-xs text-foreground-muted">{folder.assetCount}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border-overlay">
          <h4 className="text-sm font-medium text-foreground mb-3">Filter by Type</h4>
          <div className="space-y-1">
            {[
              { id: 'all', label: 'All Assets' },
              { id: 'image', label: 'Images' },
              { id: 'video', label: 'Videos' },
              { id: 'document', label: 'Documents' },
              { id: '3d', label: '3D Models' },
              { id: 'audio', label: 'Audio' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center w-full text-left p-2 text-sm rounded-md transition-colors ${
                  selectedType === type.id
                    ? 'bg-brand-400 text-brand-600'
                    : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                }`}
              >
                {getAssetIcon(type.id)}
                <span className="ml-2">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border-overlay">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Digital Asset Manager</h1>
              <p className="text-sm text-foreground-muted mt-2">
                {currentFolderData?.name} • {filteredAssets.length} assets
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-surface-200 rounded-lg p-1">
                <Button
                  type={viewMode === 'grid' ? 'default' : 'text'}
                  size="tiny"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "px-3 py-2 rounded-md transition-all",
                    viewMode === 'grid' 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-foreground-muted hover:text-foreground'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  type={viewMode === 'list' ? 'default' : 'text'}
                  size="tiny"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "px-3 py-2 rounded-md transition-all",
                    viewMode === 'list' 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-foreground-muted hover:text-foreground'
                  )}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.obj,.fbx,.gltf"
                />
                <Button className="bg-brand-600 hover:bg-brand-700 px-4 py-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="outline" size="small">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {selectedAssets.length > 0 && (
          <div className="bg-brand-100 border-b border-border-overlay p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {selectedAssets.length} asset{selectedAssets.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button type="outline" size="tiny">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button type="outline" size="tiny">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={cn(
                    "group relative bg-surface-100 border border-border-overlay rounded-xl overflow-hidden hover:border-brand-400 hover:shadow-lg transition-all duration-200 cursor-pointer",
                    selectedAssets.includes(asset.id) ? 'ring-2 ring-brand-400 border-brand-400' : ''
                  )}
                  onClick={() => handleAssetSelect(asset.id)}
                >
                  <div className="aspect-square bg-surface-200 flex items-center justify-center relative">
                    {asset.type === 'image' ? (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <Image className="w-8 h-8 text-slate-400" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-surface-200 flex items-center justify-center">
                        {getAssetIcon(asset.type)}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => handleAssetSelect(asset.id)}
                        className="rounded border-border-overlay bg-background/80 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium text-foreground truncate">{asset.name}</div>
                    <div className="text-xs text-foreground-muted mt-1">{formatFileSize(asset.size)}</div>
                    {asset.dimensions && (
                      <div className="text-xs text-foreground-muted">
                        {asset.dimensions.width}×{asset.dimensions.height}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center p-3 border-b border-border-overlay bg-surface-200">
                <div className="w-8">
                  <input
                    type="checkbox"
                    checked={selectedAssets.length === filteredAssets.length}
                    onChange={handleSelectAll}
                    className="rounded border-border-overlay"
                  />
                </div>
                <div className="flex-1 text-xs font-medium text-foreground-muted uppercase tracking-wider">Name</div>
                <div className="w-20 text-xs font-medium text-foreground-muted uppercase tracking-wider">Type</div>
                <div className="w-20 text-xs font-medium text-foreground-muted uppercase tracking-wider">Size</div>
                <div className="w-32 text-xs font-medium text-foreground-muted uppercase tracking-wider">Modified</div>
              </div>
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={`flex items-center p-3 hover:bg-surface-100 transition-colors cursor-pointer ${
                    selectedAssets.includes(asset.id) ? 'bg-brand-50' : ''
                  }`}
                  onClick={() => handleAssetSelect(asset.id)}
                >
                  <div className="w-8">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => handleAssetSelect(asset.id)}
                      className="rounded border-border-overlay"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="w-8 h-8 bg-surface-200 rounded flex items-center justify-center mr-3">
                      {getAssetIcon(asset.type)}
                    </div>
                    <span className="text-sm text-foreground">{asset.name}</span>
                  </div>
                  <div className="w-20 text-sm text-foreground-muted capitalize">{asset.type}</div>
                  <div className="w-20 text-sm text-foreground-muted">{formatFileSize(asset.size)}</div>
                  <div className="w-32 text-sm text-foreground-muted">
                    {new Date(asset.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Upload className="w-12 h-12 text-foreground-muted mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No assets found</h3>
              <p className="text-foreground-muted mb-4">
                Upload your first digital asset to get started
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.obj,.fbx,.gltf"
                />
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Assets
                </Button>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
