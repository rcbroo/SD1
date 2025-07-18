import React from 'react'
import type { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import type { Project } from 'data/projects/project-detail-query'
import { Brain, Settings, BarChart3, Zap } from 'lucide-react'

export const generateAIMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  return [
    {
      title: 'Provider Management',
      items: [
        {
          name: 'Marketplace',
          key: 'marketplace',
          url: `/project/${ref}/ai/marketplace`,
          icon: <Brain className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Configuration',
          key: 'configuration',
          url: `/project/${ref}/ai/configuration`,
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
          url: `/project/${ref}/ai/analytics`,
          icon: <BarChart3 className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Performance',
          key: 'performance',
          url: `/project/${ref}/ai/performance`,
          icon: <Zap className="w-4 h-4" />,
          items: [],
        },
      ],
    },
  ]
}
