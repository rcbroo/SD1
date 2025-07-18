import { useState } from 'react'
import { Button } from 'ui'
import { ContentEditor } from './ContentEditor'
import { MediaLibrary } from './MediaLibrary'
import { CollectionsView } from './CollectionsView'
import { CMSContent } from './types'

interface CMSContentPageProps {
  onContentChange?: () => void
}

export const CMSContentPage = ({ onContentChange }: CMSContentPageProps = {}) => {
  const [currentView, setCurrentView] = useState<'collections' | 'editor' | 'media'>('collections')
  const [currentCollection, setCurrentCollection] = useState<string>('posts')
  const [editingContent, setEditingContent] = useState<CMSContent | undefined>()

  const handleCreateNew = () => {
    setEditingContent(undefined)
    setCurrentView('editor')
  }

  const handleEditContent = (content: CMSContent) => {
    setEditingContent(content)
    setCurrentView('editor')
  }

  const handleBackToCollections = () => {
    setCurrentView('collections')
    setEditingContent(undefined)
  }

  const handleSaveContent = (content: Partial<CMSContent>) => {
    console.log('Saving content:', content)
    setCurrentView('collections')
    onContentChange?.()
  }

  if (currentView === 'editor') {
    return (
      <ContentEditor
        content={editingContent}
        onSave={handleSaveContent}
        onBack={handleBackToCollections}
        onContentChange={onContentChange}
      />
    )
  }

  if (currentView === 'media') {
    return (
      <MediaLibrary 
        media={[]}
        onUpload={() => {}}
        onDelete={() => {}}
      />
    )
  }

  return (
    <CollectionsView
      collectionType={currentCollection}
      onCreateNew={handleCreateNew}
      onEdit={handleEditContent}
    />
  )
}
