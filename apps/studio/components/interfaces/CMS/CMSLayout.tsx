import { useState } from 'react'
import { Button, cn } from 'ui'
import { FileText, Image, Settings, Tag, Users, Workflow } from 'lucide-react'

interface CMSLayoutProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const CMSLayout = ({ children, activeTab = 'content', onTabChange }: CMSLayoutProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className="flex h-full">
      <div className="w-64 bg-surface-100 border-r border-border-overlay">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Content Management</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  type={currentTab === tab.id ? 'default' : 'text'}
                  size="small"
                  className={cn(
                    'w-full justify-start',
                    currentTab === tab.id && 'bg-brand-400 text-brand-600'
                  )}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default CMSLayout
