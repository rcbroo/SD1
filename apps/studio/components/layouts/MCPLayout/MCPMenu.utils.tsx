import type { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import type { Project } from 'data/projects/project-detail-query'
import { Server, Package, Settings, BarChart3, Shield } from 'lucide-react'

export const generateMCPMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  return [
    {
      title: 'Server Management',
      items: [
        {
          name: 'Marketplace',
          key: 'marketplace',
          url: `/project/${ref}/mcp/marketplace`,
          icon: <Package className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Installed Servers',
          key: 'installed',
          url: `/project/${ref}/mcp/installed`,
          icon: <Server className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Configuration',
          key: 'configuration',
          url: `/project/${ref}/mcp/configuration`,
          icon: <Settings className="w-4 h-4" />,
          items: [],
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          name: 'Usage Analytics',
          key: 'analytics',
          url: `/project/${ref}/mcp/analytics`,
          icon: <BarChart3 className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Security & Permissions',
          key: 'security',
          url: `/project/${ref}/mcp/security`,
          icon: <Shield className="w-4 h-4" />,
          items: [],
        },
      ],
    },
  ]
}
