import React from 'react'
import type { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import type { Project } from 'data/projects/project-detail-query'
import { MessageSquare, Bot, Settings, BarChart3, Zap } from 'lucide-react'

export const generateAIChatMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  return [
    {
      title: 'AI Assistant',
      items: [
        {
          name: 'Chat Interface',
          key: 'chat',
          url: `/project/${ref}/ai/chat`,
          icon: <MessageSquare className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Service Automation',
          key: 'automation',
          url: `/project/${ref}/ai/automation`,
          icon: <Zap className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Chat History',
          key: 'history',
          url: `/project/${ref}/ai/history`,
          icon: <BarChart3 className="w-4 h-4" />,
          items: [],
        },
      ],
    },
    {
      title: 'Configuration',
      items: [
        {
          name: 'AI Settings',
          key: 'settings',
          url: `/project/${ref}/ai/settings`,
          icon: <Settings className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Capabilities',
          key: 'capabilities',
          url: `/project/${ref}/ai/capabilities`,
          icon: <Bot className="w-4 h-4" />,
          items: [],
        },
      ],
    },
  ]
}
