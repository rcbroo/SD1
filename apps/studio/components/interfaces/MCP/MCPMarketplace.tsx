import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input, Button } from 'ui'
import { MCP_SERVER_TEMPLATES, searchMCPTemplates, getMCPTemplatesByCategory } from 'lib/mcp/templates'
import { useMCPServerInstallationsQuery } from 'data/mcp/mcp-server-installations-query'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import MCPServerCard from './MCPServerCard'

const MCPMarketplace = () => {
  const { project } = useProjectContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'name'>('rating')

  const { data: installations } = useMCPServerInstallationsQuery({
    projectRef: project?.ref
  })

  const installedServerIds = useMemo(() => {
    return new Set(installations?.map(installation => installation.templateId) || [])
  }, [installations])

  const filteredTemplates = useMemo(() => {
    let templates = selectedCategory === 'all' 
      ? MCP_SERVER_TEMPLATES 
      : getMCPTemplatesByCategory(selectedCategory)

    if (searchQuery) {
      templates = searchMCPTemplates(searchQuery)
    }

    return templates.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [searchQuery, selectedCategory, sortBy])

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'database', label: 'Database' },
    { value: '3d', label: '3D Processing' },
    { value: 'xr', label: 'XR/AR/VR' },
    { value: 'content', label: 'Content' },
    { value: 'security', label: 'Security' },
    { value: 'automation', label: 'Automation' },
    { value: 'communication', label: 'Communication' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">MCP Server Marketplace</h1>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-overlay rounded text-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="downloads">Sort by Downloads</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search MCP servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-overlay rounded text-sm"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <MCPServerCard
            key={template.id}
            template={template}
            isInstalled={installedServerIds.has(template.id)}
            onInstall={() => {
              
            }}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground-light">No MCP servers found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default MCPMarketplace
