import { useState, useRef, useCallback } from 'react'
import { Button } from 'ui'
import { Edit, Save, X } from 'lucide-react'
import { CMSContent } from './types'
import { PortableTextEditor } from './PortableTextEditor'

interface VisualEditorProps {
  content: CMSContent
  onSave: (content: CMSContent) => void
  isPreviewMode?: boolean
}

export const VisualEditor = ({ content, onSave, isPreviewMode = false }: VisualEditorProps) => {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [hoveredField, setHoveredField] = useState<string | null>(null)

  const handleFieldClick = useCallback(
    (field: string, value: string) => {
      if (isPreviewMode) return
      setEditingField(field)
      setEditingValue(value)
    },
    [isPreviewMode]
  )

  const handleSave = useCallback(() => {
    if (!editingField) return

    const updatedContent = {
      ...content,
      [editingField]: editingValue,
    }

    onSave(updatedContent)
    setEditingField(null)
    setEditingValue('')
  }, [content, editingField, editingValue, onSave])

  const handleCancel = useCallback(() => {
    setEditingField(null)
    setEditingValue('')
  }, [])

  const EditableField = ({
    field,
    value,
    className = '',
  }: {
    field: string
    value: string
    className?: string
  }) => {
    const isEditing = editingField === field
    const isHovered = hoveredField === field

    if (isEditing) {
      return (
        <div className="relative">
          {field === 'content' ? (
            <PortableTextEditor
              content={editingValue}
              onChange={setEditingValue}
              placeholder={`Edit ${field}...`}
            />
          ) : (
            <input
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              className="w-full p-2 border border-brand-400 rounded focus:outline-none focus:ring-2 focus:ring-brand-400"
              autoFocus
            />
          )}
          <div className="flex gap-2 mt-2">
            <Button size="tiny" onClick={handleSave}>
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button size="tiny" type="outline" onClick={handleCancel}>
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`relative group cursor-pointer ${className} ${
          isHovered && !isPreviewMode ? 'ring-2 ring-brand-400 ring-opacity-50' : ''
        }`}
        onClick={() => handleFieldClick(field, value)}
        onMouseEnter={() => setHoveredField(field)}
        onMouseLeave={() => setHoveredField(null)}
      >
        {field === 'content' ? (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          <span>{value}</span>
        )}

        {isHovered && !isPreviewMode && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2">
            <Button size="tiny" type="outline">
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EditableField field="title" value={content.title} className="text-3xl font-bold" />

      <EditableField
        field="excerpt"
        value={content.excerpt || ''}
        className="text-lg text-foreground-muted"
      />

      <EditableField field="content" value={content.content} className="prose max-w-none" />
    </div>
  )
}
