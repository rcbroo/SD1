import { useState } from 'react'
import { Button, Input } from 'ui'
import { Upload, Search, Grid, List, Trash2, Download } from 'lucide-react'
import { CMSMedia } from './types'

interface MediaLibraryProps {
  media: CMSMedia[]
  onUpload: (files: FileList) => void
  onDelete: (id: string) => void
  onSelect?: (media: CMSMedia) => void
  selectable?: boolean
}

const MediaLibrary = ({ media, onUpload, onDelete, onSelect, selectable = false }: MediaLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onUpload(files)
    }
  }

  const handleMediaSelect = (mediaItem: CMSMedia) => {
    if (selectable && onSelect) {
      onSelect(mediaItem)
    } else {
      setSelectedMedia(prev => 
        prev.includes(mediaItem.id) 
          ? prev.filter(id => id !== mediaItem.id)
          : [...prev, mediaItem.id]
      )
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImage = (mimeType: string) => mimeType.startsWith('image/')

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
        <div className="flex gap-2">
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button as="span">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </label>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            type={viewMode === 'grid' ? 'default' : 'outline'}
            size="small"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            type={viewMode === 'list' ? 'default' : 'outline'}
            size="small"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className={`border border-border-overlay rounded-lg p-3 cursor-pointer hover:bg-surface-100 ${
                selectedMedia.includes(item.id) ? 'ring-2 ring-brand-600' : ''
              }`}
              onClick={() => handleMediaSelect(item)}
            >
              <div className="aspect-square mb-2 bg-surface-200 rounded flex items-center justify-center overflow-hidden">
                {isImage(item.mime_type) ? (
                  <img
                    src={item.url}
                    alt={item.alt_text || item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-foreground-muted text-xs text-center">
                    {item.mime_type.split('/')[1]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-xs text-foreground truncate" title={item.filename}>
                {item.filename}
              </div>
              <div className="text-xs text-foreground-muted">
                {formatFileSize(item.size)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-100 rounded-lg border border-border-overlay overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-overlay">
                {filteredMedia.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-surface-200 cursor-pointer ${
                      selectedMedia.includes(item.id) ? 'bg-brand-50' : ''
                    }`}
                    onClick={() => handleMediaSelect(item)}
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-surface-200 rounded flex items-center justify-center overflow-hidden">
                        {isImage(item.mime_type) ? (
                          <img
                            src={item.url}
                            alt={item.alt_text || item.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-foreground-muted text-xs">
                            {item.mime_type.split('/')[1]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">
                        {item.filename}
                      </div>
                      {item.alt_text && (
                        <div className="text-sm text-foreground-muted">
                          {item.alt_text}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {item.mime_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {formatFileSize(item.size)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          type="outline"
                          size="tiny"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(item.url, '_blank')
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          type="outline"
                          size="tiny"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <div className="text-foreground-muted mb-4">
            {searchTerm ? 'No media matches your search' : 'No media uploaded yet'}
          </div>
          {!searchTerm && (
            <label htmlFor="file-upload">
              <Button as="span">
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Files
              </Button>
            </label>
          )}
        </div>
      )}
    </div>
  )
}

export default MediaLibrary
