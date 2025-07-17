import { Database, Cpu, Cube, FileText, Shield, Bot, MessageSquare, Globe } from 'lucide-react'
import { MCPServerTemplate } from './types'

export const MCP_SERVER_TEMPLATES: MCPServerTemplate[] = [
  {
    id: 'supabase-db-proxy',
    name: 'Database Proxy',
    description: 'Read-only SQL access over MCP protocol for secure database queries',
    category: 'database',
    icon: Database,
    version: '1.0.0',
    author: 'Supabase',
    repository: 'https://github.com/supabase/mcp-server-supabase',
    documentation: 'https://supabase.com/docs/guides/ai/mcp',
    config: {
      command: 'npx',
      args: ['-y', '@supabase/mcp-server-supabase'],
      env: {
        SUPABASE_URL: '{{SUPABASE_URL}}',
        SUPABASE_ANON_KEY: '{{SUPABASE_ANON_KEY}}'
      }
    },
    permissions: ['database.read'],
    rating: 4.8,
    downloads: 15420,
    verified: true,
    tags: ['database', 'sql', 'supabase', 'read-only']
  },
  {
    id: '3d-processor',
    name: '3D Model Processor',
    description: 'Process and optimize 3D models with format conversion and compression',
    category: '3d',
    icon: Cube,
    version: '1.2.1',
    author: 'Supadirect',
    config: {
      command: 'python',
      args: ['-m', 'supadirect.processors.3d'],
      requirements: {
        python: '>=3.8',
        system: ['blender', 'meshlab']
      }
    },
    permissions: ['storage.read', 'storage.write'],
    rating: 4.5,
    downloads: 3240,
    verified: true,
    tags: ['3d', 'models', 'optimization', 'conversion']
  },
  {
    id: 'xr-converter',
    name: 'XR Content Converter',
    description: 'Convert and optimize content for AR/VR experiences',
    category: 'xr',
    icon: Globe,
    version: '0.9.2',
    author: 'Supadirect',
    config: {
      command: 'npx',
      args: ['-y', '@supadirect/xr-converter'],
      requirements: {
        node: '>=18.0.0'
      }
    },
    permissions: ['storage.read', 'storage.write'],
    rating: 4.2,
    downloads: 1850,
    verified: true,
    tags: ['xr', 'ar', 'vr', 'conversion', 'immersive']
  },
  {
    id: 'content-analyzer',
    name: 'Content Analyzer',
    description: 'SEO and performance optimization for content management',
    category: 'content',
    icon: FileText,
    version: '2.1.0',
    author: 'Supadirect',
    config: {
      command: 'npx',
      args: ['-y', '@supadirect/content-analyzer']
    },
    permissions: ['content.read', 'content.write'],
    rating: 4.7,
    downloads: 8920,
    verified: true,
    tags: ['seo', 'content', 'optimization', 'analytics']
  },
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'OWASP/ZAP integration for automated security scanning',
    category: 'security',
    icon: Shield,
    version: '1.5.3',
    author: 'Supadirect',
    config: {
      command: 'docker',
      args: ['run', '--rm', '-v', '{{PROJECT_PATH}}:/zap/wrk/:rw', 'owasp/zap2docker-stable'],
      requirements: {
        system: ['docker']
      }
    },
    permissions: ['security.scan'],
    rating: 4.6,
    downloads: 5670,
    verified: true,
    tags: ['security', 'owasp', 'scanning', 'vulnerability']
  },
  {
    id: 'playwright-automation',
    name: 'Playwright Automation',
    description: 'Web automation and testing with Playwright browser control',
    category: 'automation',
    icon: Bot,
    version: '1.8.0',
    author: 'Microsoft',
    repository: 'https://github.com/microsoft/playwright',
    config: {
      command: 'npx',
      args: ['-y', '@executeautomation/playwright-mcp-server'],
      requirements: {
        node: '>=16.0.0'
      }
    },
    permissions: ['automation.browser'],
    rating: 4.9,
    downloads: 25340,
    verified: true,
    tags: ['automation', 'testing', 'browser', 'playwright']
  },
  {
    id: 'whatsapp-connector',
    name: 'WhatsApp Connector',
    description: 'Connect to WhatsApp for automated messaging and communication',
    category: 'communication',
    icon: MessageSquare,
    version: '0.8.1',
    author: 'Community',
    repository: 'https://github.com/lharries/whatsapp-mcp',
    config: {
      command: 'uv',
      args: ['--directory', '{{WHATSAPP_MCP_PATH}}', 'run', 'main.py'],
      requirements: {
        python: '>=3.6'
      }
    },
    permissions: ['communication.whatsapp'],
    rating: 4.1,
    downloads: 2180,
    verified: false,
    tags: ['whatsapp', 'messaging', 'communication', 'automation']
  }
]

export const getMCPTemplatesByCategory = (category?: string) => {
  if (!category) return MCP_SERVER_TEMPLATES
  return MCP_SERVER_TEMPLATES.filter(template => template.category === category)
}

export const getMCPTemplateById = (id: string) => {
  return MCP_SERVER_TEMPLATES.find(template => template.id === id)
}

export const searchMCPTemplates = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return MCP_SERVER_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}
