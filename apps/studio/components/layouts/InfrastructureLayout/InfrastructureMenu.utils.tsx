import React from 'react'
import type { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import type { Project } from 'data/projects/project-detail-query'
import { Server, Database, Globe, DollarSign, Settings, BarChart3 } from 'lucide-react'

export const generateInfrastructureMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  return [
    {
      title: 'Resource Management',
      items: [
        {
          name: 'Overview',
          key: 'overview',
          url: `/project/${ref}/infrastructure/overview`,
          icon: <BarChart3 className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Compute Providers',
          key: 'compute',
          url: `/project/${ref}/infrastructure/compute`,
          icon: <Server className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Storage & CDN',
          key: 'storage',
          url: `/project/${ref}/infrastructure/storage`,
          icon: <Database className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Global Network',
          key: 'network',
          url: `/project/${ref}/infrastructure/network`,
          icon: <Globe className="w-4 h-4" />,
          items: [],
        },
      ],
    },
    {
      title: 'Optimization',
      items: [
        {
          name: 'Cost Management',
          key: 'costs',
          url: `/project/${ref}/infrastructure/costs`,
          icon: <DollarSign className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Auto-scaling',
          key: 'scaling',
          url: `/project/${ref}/infrastructure/scaling`,
          icon: <Settings className="w-4 h-4" />,
          items: [],
        },
      ],
    },
  ]
}
