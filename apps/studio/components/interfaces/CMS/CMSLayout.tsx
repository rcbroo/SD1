import { useState } from 'react'
import { Button, cn } from 'ui'
import { FileText, Image, Settings, FolderOpen, Plus, ChevronDown, ChevronRight } from 'lucide-react'

interface CMSLayoutProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export const CMSLayout = ({ children, activeTab = 'collections', onTabChange }: CMSLayoutProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab)
  const [expandedSections, setExpandedSections] = useState<string[]>(['collections'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const collections = [
    { id: 'posts', label: 'Posts', count: 12 },
    { id: 'pages', label: 'Pages', count: 8 },
    { id: 'media', label: 'Media', count: 156 },
    { id: 'users', label: 'Users', count: 24 },
  ]

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="flex h-full bg-background">
      <div className="w-64 bg-surface-100 border-r border-border-overlay flex flex-col">
        <div className="p-4 border-b border-border-overlay">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground-light uppercase tracking-wide">Collections</h2>
            <Button type="text" size="tiny" className="p-1">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <nav className="p-2">
            <div className="mb-4">
              <button
                onClick={() => toggleSection('collections')}
                className="flex items-center w-full text-left p-2 text-sm font-medium text-foreground hover:bg-surface-200 rounded-md"
              >
                {expandedSections.includes('collections') ? (
                  <ChevronDown className="w-4 h-4 mr-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2" />
                )}
                <FolderOpen className="w-4 h-4 mr-2" />
                Collections
              </button>
              
              {expandedSections.includes('collections') && (
                <div className="ml-6 mt-1 space-y-1">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => handleTabChange(collection.id)}
                      className={cn(
                        'flex items-center justify-between w-full text-left p-2 text-sm rounded-md transition-colors',
                        currentTab === collection.id
                          ? 'bg-brand-400 text-brand-600'
                          : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                      )}
                    >
                      <span>{collection.label}</span>
                      <span className="text-xs text-foreground-muted">{collection.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleTabChange('media-library')}
                className={cn(
                  'flex items-center w-full text-left p-2 text-sm rounded-md transition-colors',
                  currentTab === 'media-library'
                    ? 'bg-brand-400 text-brand-600'
                    : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                )}
              >
                <Image className="w-4 h-4 mr-2" />
                Media Library
              </button>
              
              <button
                onClick={() => handleTabChange('settings')}
                className={cn(
                  'flex items-center w-full text-left p-2 text-sm rounded-md transition-colors',
                  currentTab === 'settings'
                    ? 'bg-brand-400 text-brand-600'
                    : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                )}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-background">{children}</div>
    </div>
  )
}
