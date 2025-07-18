import { useState, useEffect } from 'react'
import { Button, Input, Textarea } from 'ui'
import { Save, Eye, Settings, Sparkles, ArrowLeft, MoreHorizontal, Calendar, User } from 'lucide-react'
import { CMSContent, CMSAIAssistant } from './types'

interface ContentEditorProps {
  content?: CMSContent
  onSave?: (content: Partial<CMSContent>) => void
  onPreview?: () => void
  onContentChange?: () => void
  onBack?: () => void
  aiAssistant?: CMSAIAssistant
}

export const ContentEditor = ({ content, onSave, onPreview, onContentChange, onBack, aiAssistant }: ContentEditorProps) => {
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
    onContentChange?.()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border-overlay bg-surface-100">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onBack && (
                  <Button type="text" size="small" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {content ? 'Edit Content' : 'Create New Content'}
                  </h1>
                  <div className="flex items-center gap-4 mt-1 text-sm text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Admin User
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {content?.updated_at ? new Date(content.updated_at).toLocaleDateString() : 'New'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(formData.status || 'draft')}`}
                >
                  {formData.status || 'draft'}
                </span>
                {onPreview && (
                  <Button type="outline" size="small" onClick={onPreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                )}
                <Button size="small" onClick={() => onSave?.(formData)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button type="text" size="small">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter content title"
                  className="text-lg font-medium"
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
                <div className="border border-border-overlay rounded-md">
                  <div className="border-b border-border-overlay p-2 bg-surface-100">
                    <div className="flex items-center gap-1">
                      <Button type="text" size="tiny">B</Button>
                      <Button type="text" size="tiny">I</Button>
                      <Button type="text" size="tiny">U</Button>
                      <div className="w-px h-4 bg-border-overlay mx-1" />
                      <Button type="text" size="tiny">H1</Button>
                      <Button type="text" size="tiny">H2</Button>
                      <div className="w-px h-4 bg-border-overlay mx-1" />
                      <Button type="text" size="tiny">Link</Button>
                      <Button type="text" size="tiny">Image</Button>
                    </div>
                  </div>
                  <Textarea
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your content here..."
                    rows={16}
                    className="border-0 resize-none focus:ring-0"
                  />
                </div>
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
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 border-l border-border-overlay bg-surface-100">
        <div className="p-4">
          <h3 className="text-sm font-medium text-foreground mb-4">Document Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-border-overlay rounded-md bg-background text-foreground"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Type</label>
              <select
                value={formData.type || 'post'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-border-overlay rounded-md bg-background text-foreground"
              >
                <option value="post">Post</option>
                <option value="page">Page</option>
                <option value="article">Article</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Categories</label>
              <Input
                value={formData.categories?.join(', ') || ''}
                onChange={(e) => handleInputChange('categories', e.target.value.split(', ').filter(Boolean))}
                placeholder="Enter categories"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
              <Input
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => handleInputChange('tags', e.target.value.split(', ').filter(Boolean))}
                placeholder="Enter tags"
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-foreground">SEO Settings</h3>
              {aiAssistant?.enabled && aiAssistant.features.seoOptimization && (
                <Button
                  type="outline"
                  size="tiny"
                  onClick={() => handleOWLAssist('optimizeSEO')}
                  loading={isAIGenerating}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Optimize
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
                <label className="block text-sm font-medium text-foreground mb-2">SEO Description</label>
                <Textarea
                  value={formData.seo_description || ''}
                  onChange={(e) => handleInputChange('seo_description', e.target.value)}
                  placeholder="SEO meta description"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentEditor
