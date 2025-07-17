export interface MCPServerTemplate {
  id: string
  name: string
  description: string
  category: 'database' | '3d' | 'xr' | 'content' | 'security' | 'automation' | 'communication'
  icon: React.ComponentType<{ className?: string }>
  version: string
  author: string
  repository?: string
  documentation?: string
  config: MCPServerConfig
  permissions: string[]
  rating: number
  downloads: number
  verified: boolean
  tags: string[]
}

export interface MCPServerConfig {
  command: string
  args: string[]
  env?: Record<string, string>
  dependencies?: string[]
  requirements?: {
    node?: string
    python?: string
    system?: string[]
  }
}

export interface MCPServerInstallation {
  id: string
  templateId: string
  projectId: string
  status: 'installing' | 'installed' | 'failed' | 'disabled'
  config: MCPServerConfig
  installedAt: string
  lastUsed?: string
  errorMessage?: string
}

export interface MCPServerReview {
  id: string
  templateId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
}
