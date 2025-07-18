export interface CMSContent {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  status: 'draft' | 'published' | 'archived'
  type: 'post' | 'page' | 'article'
  author_id: string
  created_at: string
  updated_at: string
  published_at?: string
  featured_image?: string
  tags: string[]
  categories: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
}

export interface CMSMedia {
  id: string
  filename: string
  original_filename: string
  mime_type: string
  size: number
  url: string
  alt_text?: string
  caption?: string
  created_at: string
  updated_at: string
}

export interface CMSCategory {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  created_at: string
  updated_at: string
}

export interface CMSTag {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export interface CMSWorkflow {
  id: string
  name: string
  description?: string
  steps: CMSWorkflowStep[]
  created_at: string
  updated_at: string
}

export interface CMSWorkflowStep {
  id: string
  name: string
  description?: string
  order: number
  required_role?: string
  auto_transition?: boolean
  conditions?: Record<string, any>
}

export interface CMSAIAssistant {
  enabled: boolean
  features: {
    contentGeneration: boolean
    seoOptimization: boolean
    grammarCheck: boolean
    toneAnalysis: boolean
    contentSuggestions: boolean
  }
  settings: {
    tone: 'professional' | 'casual' | 'friendly' | 'formal'
    targetAudience: string
    contentLength: 'short' | 'medium' | 'long'
    seoKeywords: string[]
  }
}

export interface CMSCollaboration {
  enabled: boolean
  sessionId: string
  participants: CMSParticipant[]
  cursors: CMSCursor[]
  changes: CMSChange[]
}

export interface CMSParticipant {
  id: string
  name: string
  avatar?: string
  color: string
  lastSeen: string
}

export interface CMSCursor {
  userId: string
  position: number
  selection?: { start: number; end: number }
}

export interface CMSChange {
  id: string
  userId: string
  type: 'insert' | 'delete' | 'format'
  position: number
  content?: string
  timestamp: string
}
