import type { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import type { Project } from 'data/projects/project-detail-query'
import { BarChart3, TrendingDown, Users, Network, AlertTriangle, Settings } from 'lucide-react'

export const generateAnalyticsMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  return [
    {
      title: 'Analytics Dashboard',
      items: [
        {
          name: 'Overview',
          key: 'overview',
          url: `/project/${ref}/analytics/overview`,
          icon: <BarChart3 className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Content Decay',
          key: 'decay',
          url: `/project/${ref}/analytics/decay`,
          icon: <TrendingDown className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Agent Synergy',
          key: 'synergy',
          url: `/project/${ref}/analytics/synergy`,
          icon: <Users className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Network Analysis',
          key: 'network',
          url: `/project/${ref}/analytics/network`,
          icon: <Network className="w-4 h-4" />,
          items: [],
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          name: 'Alerts & Insights',
          key: 'alerts',
          url: `/project/${ref}/analytics/alerts`,
          icon: <AlertTriangle className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Configuration',
          key: 'configuration',
          url: `/project/${ref}/analytics/configuration`,
          icon: <Settings className="w-4 h-4" />,
          items: [],
        },
      ],
    },
  ]
}
