import { useState } from 'react'
import { Button, Input, cn } from 'ui'
import { Search, Plus, Edit, Trash2, Eye, Filter, MoreHorizontal, ArrowUpDown, FileText, Grid, List } from 'lucide-react'
import { CMSContent } from './types'

interface CollectionsViewProps {
  collectionType: string
  onCreateNew: () => void
  onEdit: (content: CMSContent) => void
}

export const CollectionsView = ({ collectionType, onCreateNew, onEdit }: CollectionsViewProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>('updated_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const mockData: CMSContent[] = [
    {
      id: '1',
      title: 'Getting Started with Supabase',
      slug: 'getting-started-supabase',
      content: 'Learn how to build applications with Supabase...',
      excerpt: 'A comprehensive guide to getting started with Supabase',
      status: 'published',
      type: 'post',
      author_id: 'user-1',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      tags: ['tutorial', 'beginner'],
      categories: ['documentation'],
      seo_title: 'Getting Started with Supabase - Complete Guide',
      seo_description: 'Learn how to build modern applications with Supabase',
      seo_keywords: ['supabase', 'tutorial', 'database']
    },
    {
      id: '2',
      title: 'Advanced Database Queries',
      slug: 'advanced-database-queries',
      content: 'Master complex database operations...',
      excerpt: 'Deep dive into advanced PostgreSQL features',
      status: 'draft',
      type: 'post',
      author_id: 'user-1',
      created_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-22T16:45:00Z',
      tags: ['advanced', 'database'],
      categories: ['tutorials'],
      seo_title: 'Advanced Database Queries in Supabase',
      seo_description: 'Master complex PostgreSQL operations in Supabase',
      seo_keywords: ['postgresql', 'queries', 'advanced']
    }
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-900/20 text-green-400 border-green-800',
      draft: 'bg-yellow-900/20 text-yellow-400 border-yellow-800',
      archived: 'bg-gray-900/20 text-gray-400 border-gray-800'
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
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
    if (selectedItems.length === mockData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(mockData.map(item => item.id))
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border-overlay bg-surface-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground capitalize">{collectionType}</h1>
              <p className="text-sm text-foreground-muted mt-2">
                Manage your {collectionType} content
              </p>
            </div>
            <Button onClick={onCreateNew} className="bg-brand-600 hover:bg-brand-700 px-4 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
              <Input
                placeholder={`Search ${collectionType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border-overlay"
              />
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
              <Button type="outline" size="small" className="border-border-overlay">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {selectedItems.length > 0 && (
          <div className="bg-brand-100 border-b border-border-overlay p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button type="outline" size="tiny">
                  Publish
                </Button>
                <Button type="outline" size="tiny">
                  Archive
                </Button>
                <Button type="outline" size="tiny">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
            {mockData.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative bg-surface-100 border border-border-overlay rounded-xl overflow-hidden hover:border-brand-400 hover:shadow-lg transition-all duration-200 cursor-pointer",
                  selectedItems.includes(item.id) ? 'ring-2 ring-brand-400 border-brand-400' : ''
                )}
                onClick={() => onEdit(item)}
              >
                <div className="aspect-[4/3] bg-surface-200 flex items-center justify-center relative">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="text" size="tiny" className="bg-background/80 backdrop-blur-sm hover:bg-background">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-border-overlay bg-background/80 backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-foreground text-sm truncate mb-2">{item.title}</div>
                  <div className="text-xs text-foreground-muted mb-3">
                    {new Date(item.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-200 border-b border-border-overlay">
                <tr>
                  <th className="w-12 p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === mockData.length}
                      onChange={handleSelectAll}
                      className="rounded border-border-overlay"
                    />
                  </th>
                  <th className="p-3 text-left">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center text-xs font-medium text-foreground-muted uppercase tracking-wider hover:text-foreground"
                    >
                      Title
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="p-3 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center text-xs font-medium text-foreground-muted uppercase tracking-wider hover:text-foreground"
                    >
                      Status
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="p-3 text-left">
                    <button
                      onClick={() => handleSort('updated_at')}
                      className="flex items-center text-xs font-medium text-foreground-muted uppercase tracking-wider hover:text-foreground"
                    >
                      Last Modified
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="w-24 p-3 text-left">
                    <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-overlay">
                {mockData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-100 transition-colors cursor-pointer"
                    onClick={() => onEdit(item)}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-border-overlay"
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-foreground">{item.title}</div>
                        {item.excerpt && (
                          <div className="text-sm text-foreground-muted mt-1 truncate max-w-md">
                            {item.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-foreground-muted">
                      {new Date(item.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button
                          type="text"
                          size="tiny"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(item)
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button type="text" size="tiny">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button type="text" size="tiny">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mockData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="w-12 h-12 text-foreground-muted mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No {collectionType} found
            </h3>
            <p className="text-foreground-muted mb-4">
              Get started by creating your first {collectionType.slice(0, -1)}
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create {collectionType.slice(0, -1)}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
