import { useState } from 'react'
import { Button, Input } from 'ui'
import { Upload, Search, Filter, Grid, List, Image, Video, FileText, Download, Trash2, FolderOpen, Plus, MoreHorizontal } from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | '3d'
  url: string
  size: number
  created_at: string
  tags: string[]
  folder?: string
}

interface MediaFolder {
  id: string
  name: string
  parent?: string
  itemCount: number
}

interface MediaLibraryProps {
  media: MediaItem[]
  onUpload: (files: FileList) => void
  onDelete: (id: string) => void
}

export const MediaLibrary = ({ media, onUpload, onDelete }: MediaLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>('root')

  const mockFolders: MediaFolder[] = [
    { id: 'images', name: 'Images', parent: 'root', itemCount: 45 },
    { id: 'videos', name: 'Videos', parent: 'root', itemCount: 12 },
    { id: 'documents', name: 'Documents', parent: 'root', itemCount: 8 },
    { id: 'hero-images', name: 'Hero Images', parent: 'images', itemCount: 6 },
    { id: 'product-shots', name: 'Product Shots', parent: 'images', itemCount: 23 },
  ]

  const mockMedia: MediaItem[] = [
    {
      id: '1',
      name: 'hero-banner-main.jpg',
      type: 'image',
      url: '/placeholder-image.jpg',
      size: 2048000,
      created_at: '2024-01-15T10:00:00Z',
      tags: ['hero', 'banner'],
      folder: 'images'
    },
    {
      id: '2',
      name: 'product-demo-v2.mp4',
      type: 'video',
      url: '/placeholder-video.mp4',
      size: 15728640,
      created_at: '2024-01-14T14:30:00Z',
      tags: ['demo', 'product'],
      folder: 'videos'
    },
    {
      id: '3',
      name: 'user-guide.pdf',
      type: 'document',
      url: '/placeholder-doc.pdf',
      size: 1024000,
      created_at: '2024-01-13T09:15:00Z',
      tags: ['docs', 'guide'],
      folder: 'documents'
    },
    {
      id: '4',
      name: 'dashboard-screenshot.png',
      type: 'image',
      url: '/placeholder-image.jpg',
      size: 856000,
      created_at: '2024-01-12T16:20:00Z',
      tags: ['screenshot', 'ui'],
      folder: 'images'
    }
  ]

  const filteredMedia = mockMedia.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'all' || item.type === selectedType
    const matchesFolder = currentFolder === 'root' || item.folder === currentFolder
    return matchesSearch && matchesType && matchesFolder
  })

  const currentFolders = mockFolders.filter(folder => folder.parent === currentFolder)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onUpload(files)
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredMedia.map(item => item.id))
    }
  }

  return (
    <div className="flex h-full bg-background">
      <div className="w-64 border-r border-border-overlay bg-surface-100">
        <div className="p-4 border-b border-border-overlay">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground-light uppercase tracking-wide">Folders</h3>
            <Button type="text" size="tiny">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <button
              onClick={() => setCurrentFolder('root')}
              className={`flex items-center w-full text-left p-2 text-sm rounded-md transition-colors ${
                currentFolder === 'root'
                  ? 'bg-brand-400 text-brand-600'
                  : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              All Media
            </button>
            
            {currentFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.id)}
                className={`flex items-center justify-between w-full text-left p-2 text-sm rounded-md transition-colors ${
                  currentFolder === folder.id
                    ? 'bg-brand-400 text-brand-600'
                    : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                }`}
              >
                <div className="flex items-center">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  {folder.name}
                </div>
                <span className="text-xs text-foreground-muted">{folder.itemCount}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Filter by Type</h4>
          <div className="space-y-1">
            {[
              { id: 'all', label: 'All Files', icon: FileText },
              { id: 'image', label: 'Images', icon: Image },
              { id: 'video', label: 'Videos', icon: Video },
              { id: 'document', label: 'Documents', icon: FileText },
            ].map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center w-full text-left p-2 text-sm rounded-md transition-colors ${
                    selectedType === type.id
                      ? 'bg-brand-400 text-brand-600'
                      : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border-overlay bg-surface-100">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Media Library</h1>
                <p className="text-sm text-foreground-muted mt-1">
                  Manage your digital assets and media files
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border-overlay rounded-md">
                  <Button
                    type={viewMode === 'grid' ? 'default' : 'text'}
                    size="tiny"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    type={viewMode === 'list' ? 'default' : 'text'}
                    size="tiny"
                    onClick={() => setViewMode('list')}
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
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  <Button className="bg-brand-600 hover:bg-brand-700">
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
                  placeholder="Search media files..."
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
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-brand-100 border-b border-border-overlay p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
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

        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className={`group relative border border-border-overlay rounded-lg overflow-hidden hover:border-brand-400 transition-colors cursor-pointer ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-brand-400' : ''
                  }`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <div className="aspect-square bg-surface-200 flex items-center justify-center">
                    {item.type === 'image' ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <Image className="w-8 h-8 text-foreground-muted" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-surface-200 flex items-center justify-center">
                        {getFileIcon(item.type)}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="text-xs font-medium text-foreground truncate">{item.name}</div>
                    <div className="text-xs text-foreground-muted">{formatFileSize(item.size)}</div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="text" size="tiny">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-border-overlay"
                      onClick={(e) => e.stopPropagation()}
                    />
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
                    checked={selectedItems.length === filteredMedia.length}
                    onChange={handleSelectAll}
                    className="rounded border-border-overlay"
                  />
                </div>
                <div className="flex-1 text-xs font-medium text-foreground-muted uppercase tracking-wider">Name</div>
                <div className="w-20 text-xs font-medium text-foreground-muted uppercase tracking-wider">Type</div>
                <div className="w-20 text-xs font-medium text-foreground-muted uppercase tracking-wider">Size</div>
                <div className="w-32 text-xs font-medium text-foreground-muted uppercase tracking-wider">Modified</div>
                <div className="w-16"></div>
              </div>
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center p-3 hover:bg-surface-100 transition-colors cursor-pointer ${
                    selectedItems.includes(item.id) ? 'bg-brand-50' : ''
                  }`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <div className="w-8">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-border-overlay"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="w-8 h-8 bg-surface-200 rounded flex items-center justify-center mr-3">
                      {getFileIcon(item.type)}
                    </div>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="w-20 text-sm text-foreground-muted capitalize">{item.type}</div>
                  <div className="w-20 text-sm text-foreground-muted">{formatFileSize(item.size)}</div>
                  <div className="w-32 text-sm text-foreground-muted">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <div className="w-16 flex justify-end">
                    <Button type="text" size="tiny">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredMedia.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Upload className="w-12 h-12 text-foreground-muted mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No media files found</h3>
              <p className="text-foreground-muted mb-4">
                Upload your first media file to get started
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
