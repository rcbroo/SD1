import type { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import type { Project } from 'data/projects/project-detail-query'
import { Shield, AlertTriangle, Users, FileText, Settings, Eye, Lock } from 'lucide-react'

export const generateSecurityMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  return [
    {
      title: 'Security Overview',
      items: [
        {
          name: 'Dashboard',
          key: 'dashboard',
          url: `/project/${ref}/security/dashboard`,
          icon: <Shield className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Vulnerabilities',
          key: 'vulnerabilities',
          url: `/project/${ref}/security/vulnerabilities`,
          icon: <AlertTriangle className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Security Scans',
          key: 'scans',
          url: `/project/${ref}/security/scans`,
          icon: <Eye className="w-4 h-4" />,
          items: [],
        },
      ],
    },
    {
      title: 'Access & Compliance',
      items: [
        {
          name: 'Access Control',
          key: 'access-control',
          url: `/project/${ref}/security/access-control`,
          icon: <Users className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Compliance',
          key: 'compliance',
          url: `/project/${ref}/security/compliance`,
          icon: <FileText className="w-4 h-4" />,
          items: [],
        },
        {
          name: 'Audit Logs',
          key: 'audit-logs',
          url: `/project/${ref}/security/audit-logs`,
          icon: <Lock className="w-4 h-4" />,
          items: [],
        },
      ],
    },
    {
      title: 'Configuration',
      items: [
        {
          name: 'Security Policies',
          key: 'policies',
          url: `/project/${ref}/security/policies`,
          icon: <Settings className="w-4 h-4" />,
          items: [],
        },
      ],
    },
  ]
}
