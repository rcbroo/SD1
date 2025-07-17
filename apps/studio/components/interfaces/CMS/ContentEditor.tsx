import { useState, useEffect } from 'react'
import { Button, Input, Textarea } from 'ui'
import { Save, Eye, Settings, Sparkles } from 'lucide-react'
import { CMSContent, CMSAIAssistant } from './types'

interface ContentEditorProps {
  content?: CMSContent
  onSave: (content: Partial<CMSContent>) => void
  onPreview?: () => void
  aiAssistant?: CMSAIAssistant
}

const ContentEditor = ({ content, onSave, onPreview, aiAssistant }: ContentEditorProps) => {
  const [formData, setFormData] = useState<Partial<CMSContent>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    type: 'post',
    tags: [],
    categories: [],
    seo_title: '',
    seo_description: '',
    seo_keywords: [],
    ...content,
  })

  const [isAIGenerating, setIsAIGenerating] = useState(false)

  useEffect(() => {
    if (content) {
      setFormData(content)
    }
  }, [content])

  const handleInputChange = (field: keyof CMSContent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title)
    if (!content?.slug) {
      handleInputChange('slug', generateSlug(title))
    }
  }

  const handleOWLAssist = async (feature: string) => {
    if (!aiAssistant?.enabled) return

    setIsAIGenerating(true)
    try {
      const response = await fetch('/api/ai/owl/run-society', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: `${feature} for content: ${formData.title}`,
          userRoleName: 'Content Creator',
          assistantRoleName: 'Content Assistant',
          context: {
            contentType: formData.type,
            currentContent: formData.content,
            seoKeywords: aiAssistant.settings.seoKeywords,
            tone: aiAssistant.settings.tone,
            targetAudience: aiAssistant.settings.targetAudience,
          },
        }),
      })

      const result = await response.json()

      switch (feature) {
        case 'generateContent':
          handleInputChange('content', result.answer)
          break
        case 'optimizeSEO':
          try {
            const seoData = JSON.parse(result.answer)
            handleInputChange('seo_title', seoData.title)
            handleInputChange('seo_description', seoData.description)
            handleInputChange('seo_keywords', seoData.keywords)
          } catch {
            handleInputChange('seo_title', result.answer)
          }
          break
        case 'generateExcerpt':
          handleInputChange('excerpt', result.answer)
          break
      }
    } catch (error) {
      console.error('OWL assist error:', error)
    } finally {
      setIsAIGenerating(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {content ? 'Edit Content' : 'Create New Content'}
        </h1>
        <div className="flex gap-2">
          {onPreview && (
            <Button type="outline" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <Input
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter content title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Slug</label>
            <Input
              value={formData.slug || ''}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="url-friendly-slug"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-foreground">Content</label>
            {aiAssistant?.enabled && aiAssistant.features.contentGeneration && (
              <Button
                type="outline"
                size="tiny"
                onClick={() => handleOWLAssist('generateContent')}
                loading={isAIGenerating}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generate
              </Button>
            )}
          </div>
          <Textarea
            value={formData.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Write your content here..."
            rows={12}
            className="font-mono"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-foreground">Excerpt</label>
            {aiAssistant?.enabled && aiAssistant.features.contentGeneration && (
              <Button
                type="outline"
                size="tiny"
                onClick={() => handleOWLAssist('generateExcerpt')}
                loading={isAIGenerating}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Generate
              </Button>
            )}
          </div>
          <Textarea
            value={formData.excerpt || ''}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            placeholder="Brief description of the content"
            rows={3}
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-foreground">SEO Settings</h3>
            {aiAssistant?.enabled && aiAssistant.features.seoOptimization && (
              <Button
                type="outline"
                size="small"
                onClick={() => handleOWLAssist('optimizeSEO')}
                loading={isAIGenerating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Optimize SEO
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SEO Title</label>
              <Input
                value={formData.seo_title || ''}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="SEO optimized title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                SEO Description
              </label>
              <Textarea
                value={formData.seo_description || ''}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="SEO meta description"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentEditor
