import { useState, useCallback, useRef, useEffect } from 'react'
import { Button, Input, Textarea } from 'ui'
import { Bold, Italic, Link, List, Quote } from 'lucide-react'
import { CMSContent, CMSCollaboration } from './types'

interface PortableTextEditorProps {
  content: string
  onChange: (content: string) => void
  collaboration?: CMSCollaboration
  placeholder?: string
  readOnly?: boolean
}

export const PortableTextEditor = ({
  content,
  onChange,
  collaboration,
  placeholder = 'Start writing...',
  readOnly = false,
}: PortableTextEditorProps) => {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const handleSelectionChange = useCallback(() => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart
      const end = editorRef.current.selectionEnd
      setSelection({ start, end })

      if (collaboration?.enabled) {
        window.postMessage({
          type: 'cms-cursor-update',
          sessionId: collaboration.sessionId,
          position: start,
          selection: start !== end ? { start, end } : undefined,
        })
      }
    }
  }, [collaboration])

  const applyFormat = useCallback(
    (format: string) => {
      if (!editorRef.current || !selection) return

      const { start, end } = selection
      const text = content
      const selectedText = text.substring(start, end)

      let formattedText = selectedText
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`
          break
        case 'italic':
          formattedText = `*${selectedText}*`
          break
        case 'link':
          formattedText = `[${selectedText}](url)`
          break
      }

      const newContent = text.substring(0, start) + formattedText + text.substring(end)
      onChange(newContent)
    },
    [content, selection, onChange]
  )

  return (
    <div className="border border-border-overlay rounded-lg">
      <div className="flex gap-2 p-2 border-b border-border-overlay">
        <Button size="tiny" type="outline" onClick={() => applyFormat('bold')}>
          <Bold className="w-3 h-3" />
        </Button>
        <Button size="tiny" type="outline" onClick={() => applyFormat('italic')}>
          <Italic className="w-3 h-3" />
        </Button>
        <Button size="tiny" type="outline" onClick={() => applyFormat('link')}>
          <Link className="w-3 h-3" />
        </Button>
      </div>

      <div className="relative">
        <Textarea
          ref={editorRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleSelectionChange}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={12}
          className="border-0 resize-none focus:ring-0"
        />

        {collaboration?.enabled && (
          <div className="absolute top-2 right-2">
            <div className="flex -space-x-2">
              {collaboration.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  style={{ backgroundColor: participant.color }}
                  title={participant.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
