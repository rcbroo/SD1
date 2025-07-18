import { useState } from 'react'
import { Button, cn } from 'ui'
import { FileText, Image, Settings, FolderOpen, Plus, ChevronDown, ChevronRight, Menu, X } from 'lucide-react'

interface CMSLayoutProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export const CMSLayout = ({ children, activeTab = 'collections', onTabChange }: CMSLayoutProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab)
  const [expandedSections, setExpandedSections] = useState<string[]>(['collections'])
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const collections = [
    { id: 'posts', label: 'Posts', count: 12, icon: FileText },
    { id: 'pages', label: 'Pages', count: 8, icon: FileText },
    { id: 'media', label: 'Media', count: 156, icon: Image },
    { id: 'users', label: 'Users', count: 24, icon: Settings },
  ]

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="flex h-full bg-background">
      <div className={cn(
        "bg-surface-100 border-r border-border-overlay flex flex-col transition-all duration-200",
        isExpanded ? "w-64" : "w-16"
      )}>
        <div className="p-3 border-b border-border-overlay">
          <div className="flex items-center justify-between">
            <Button 
              type="text" 
              size="tiny" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-surface-200"
            >
              {isExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            {isExpanded && (
              <Button type="text" size="tiny" className="p-1">
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
          {isExpanded && (
            <h2 className="text-sm font-medium text-foreground-light uppercase tracking-wide mt-3">Collections</h2>
          )}
        </div>
        
        <div className="flex-1 overflow-auto">
          <nav className="p-2">
            {isExpanded ? (
              <>
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
              </>
            ) : (
              <div className="space-y-2">
                {collections.map((collection) => {
                  const Icon = collection.icon
                  return (
                    <button
                      key={collection.id}
                      onClick={() => handleTabChange(collection.id)}
                      className={cn(
                        'flex items-center justify-center w-full p-2 rounded-md transition-colors relative group',
                        currentTab === collection.id
                          ? 'bg-brand-400 text-brand-600'
                          : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                      )}
                      title={collection.label}
                    >
                      <Icon className="w-4 h-4" />
                      {collection.count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {collection.count > 99 ? '99+' : collection.count}
                        </span>
                      )}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handleTabChange('media-library')}
                  className={cn(
                    'flex items-center justify-center w-full p-2 rounded-md transition-colors',
                    currentTab === 'media-library'
                      ? 'bg-brand-400 text-brand-600'
                      : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                  )}
                  title="Media Library"
                >
                  <Image className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleTabChange('settings')}
                  className={cn(
                    'flex items-center justify-center w-full p-2 rounded-md transition-colors',
                    currentTab === 'settings'
                      ? 'bg-brand-400 text-brand-600'
                      : 'text-foreground-muted hover:bg-surface-200 hover:text-foreground'
                  )}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-background">{children}</div>
    </div>
  )
}
