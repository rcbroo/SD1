import { useState } from 'react'
import { Button, Input } from 'ui'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { CMSContent } from './types'

interface ContentListProps {
  contents: CMSContent[]
  onEdit: (content: CMSContent) => void
  onCreate: () => void
  onDelete: (id: string) => void
  onPreview?: (content: CMSContent) => void
}

const ContentList = ({ contents, onEdit, onCreate, onDelete, onPreview }: ContentListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter
    const matchesType = typeFilter === 'all' || content.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100'
      case 'draft':
        return 'text-yellow-600 bg-yellow-100'
      case 'archived':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border-overlay rounded-md bg-surface-100 text-foreground"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-border-overlay rounded-md bg-surface-100 text-foreground"
        >
          <option value="all">All Types</option>
          <option value="post">Post</option>
          <option value="page">Page</option>
          <option value="article">Article</option>
        </select>
      </div>

      <div className="bg-surface-100 rounded-lg border border-border-overlay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-overlay">
              {filteredContents.map((content) => (
                <tr key={content.id} className="hover:bg-surface-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">{content.title}</div>
                      {content.excerpt && (
                        <div className="text-sm text-foreground-muted truncate max-w-xs">
                          {content.excerpt}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-muted capitalize">
                    {content.type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(content.status)}`}
                    >
                      {content.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-muted">
                    {new Date(content.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {onPreview && (
                        <Button type="outline" size="tiny" onClick={() => onPreview(content)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                      )}
                      <Button type="outline" size="tiny" onClick={() => onEdit(content)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button type="outline" size="tiny" onClick={() => onDelete(content.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-foreground-muted">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No content matches your filters'
                : 'No content created yet'}
            </div>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <Button className="mt-4" onClick={onCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Content
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentList
