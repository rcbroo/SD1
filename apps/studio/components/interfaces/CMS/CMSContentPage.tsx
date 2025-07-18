import { useState } from 'react'
import { Button } from 'ui'
import ContentEditor from './ContentEditor'
import MediaLibrary from './MediaLibrary'
import { Save, Image, FileText, Settings } from 'lucide-react'

interface CMSContentPageProps {
  onContentChange?: () => void
}

export const CMSContentPage = ({ onContentChange }: CMSContentPageProps = {}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'settings'>('content')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSave = () => {
    setHasUnsavedChanges(false)
  }

  const handleContentChange = () => {
    setHasUnsavedChanges(true)
    onContentChange?.()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Content Management</h1>
          <div className="flex space-x-2">
            <Button
              type={activeTab === 'content' ? 'primary' : 'default'}
              size="small"
              icon={<FileText size={16} />}
              onClick={() => setActiveTab('content')}
            >
              Content
            </Button>
            <Button
              type={activeTab === 'media' ? 'primary' : 'default'}
              size="small"
              icon={<Image size={16} />}
              onClick={() => setActiveTab('media')}
            >
              Media
            </Button>
            <Button
              type={activeTab === 'settings' ? 'primary' : 'default'}
              size="small"
              icon={<Settings size={16} />}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Button>
          </div>
        </div>
        <Button
          type="primary"
          icon={<Save size={16} />}
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
        >
          Save Changes
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'content' && (
          <ContentEditor onContentChange={handleContentChange} />
        )}
        {activeTab === 'media' && (
          <MediaLibrary 
            media={[]}
            onUpload={() => {}}
            onDelete={() => {}}
          />
        )}
        {activeTab === 'settings' && (
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">CMS Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content Types</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Articles</h3>
                    <p className="text-sm text-foreground-light">Blog posts and articles</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Pages</h3>
                    <p className="text-sm text-foreground-light">Static pages</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Media</h3>
                    <p className="text-sm text-foreground-light">Images, videos, 3D assets</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h3 className="font-medium">Collections</h3>
                    <p className="text-sm text-foreground-light">Custom content collections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
