import React from 'react'
import type { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import type { Project } from 'data/projects/project-detail-query'
import { Play, Image, Box, Globe, Settings, BarChart3 } from 'lucide-react'

export const generateMediaMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  return [
    {
      title: 'Media Management',
      items: [
        {
          name: 'Media Library',
          key: 'library',
          url: `/project/${ref}/media/library`,
          icon: <Image className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Player Cores',
          key: 'cores',
          url: `/project/${ref}/media/cores`,
          icon: <Play className="w-4 h-4" />,
          items: [],
        },
        {
          name: '3D Assets',
          key: '3d-assets',
          url: `/project/${ref}/media/3d`,
          icon: <Box className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'XR Content',
          key: 'xr-content',
          url: `/project/${ref}/media/xr`,
          icon: <Globe className="w-4 h-4" />,
          items: [],
        },
      ],
    },
    {
      title: 'Configuration',
      items: [
        {
          name: 'Player Settings',
          key: 'settings',
          url: `/project/${ref}/media/settings`,
          icon: <Settings className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Performance',
          key: 'performance',
          url: `/project/${ref}/media/performance`,
          icon: <BarChart3 className="w-4 h-4" />,
          items: [],
        },
      ],
    },
  ]
}
