import { 
  Blocks, 
  FileText, 
  Lightbulb, 
  List, 
  Logs, 
  Settings,
  Bot,
  Puzzle,
  FileImage,
  Server,
  BarChart3,
  Shield,
  Home,
  Zap
} from 'lucide-react'

import { ICON_SIZE, ICON_STROKE_WIDTH } from 'components/interfaces/Sidebar'
import { generateAuthMenu } from 'components/layouts/AuthLayout/AuthLayout.utils'
import { generateDatabaseMenu } from 'components/layouts/DatabaseLayout/DatabaseMenu.utils'
import { generateSettingsMenu } from 'components/layouts/ProjectSettingsLayout/SettingsMenu.utils'
import type { Route } from 'components/ui/ui.types'
import { EditorIndexPageLink } from 'data/prefetchers/project.$ref.editor'
import type { Project } from 'data/projects/project-detail-query'
import {
  Auth,
  Database,
  EdgeFunctions,
  Realtime,
  Reports,
  SqlEditor,
  Storage,
  TableEditor,
} from 'icons'
import { IS_PLATFORM, PROJECT_STATUS } from 'lib/constants'

export const generateDashboardRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return [
    {
      key: 'home',
      label: 'Project Overview',
      icon: <Home size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}`),
    },
  ]
}
export const generateDatabaseRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectActive = project?.status === PROJECT_STATUS.ACTIVE_HEALTHY
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  const databaseMenu = generateDatabaseMenu(project)

  return [
    {
      key: 'database',
      label: 'Database',
      icon: <Database size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link:
        ref &&
        (isProjectBuilding
          ? buildingUrl
          : isProjectActive
            ? `/project/${ref}/database/schemas`
            : `/project/${ref}/database/backups/scheduled`),
      items: databaseMenu,
    },
    {
      key: 'editor',
      label: 'Table Editor',
      icon: <TableEditor size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/editor`),
      linkElement: <EditorIndexPageLink projectRef={ref} />,
    },
    {
      key: 'sql',
      label: 'SQL Editor',
      icon: <SqlEditor size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: !IS_PLATFORM
        ? `/project/${ref}/sql/1`
        : ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/sql`),
    },
    {
      key: 'api',
      label: 'API Documentation',
      icon: <FileText size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/api`),
    },
  ]
}

export const generateAIAutomationRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return [
    {
      key: 'ai-marketplace',
      label: 'AI Provider Marketplace',
      icon: <Bot size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/ai/marketplace`),
    },
    {
      key: 'ai-chat',
      label: 'AI Chat Interface',
      icon: <Bot size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/ai/chat`),
    },
    {
      key: 'service-automation',
      label: 'Service Automation',
      icon: <Zap size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/ai/automation`),
    },
  ]
}

export const generateIntegrationsRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return [
    {
      key: 'mcp-marketplace',
      label: 'MCP Marketplace',
      icon: <Puzzle size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/mcp/marketplace`),
    },
    {
      key: 'mcp-installed',
      label: 'Installed MCP Servers',
      icon: <Puzzle size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/mcp/installed`),
    },
    {
      key: 'mcp-configuration',
      label: 'MCP Configuration',
      icon: <Settings size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/mcp/configuration`),
    },
    {
      key: 'integrations',
      label: 'Custom Connectors',
      icon: <Blocks size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/integrations`),
    },
  ]
}

export const generateApplicationsRoutes = (
  ref?: string,
  project?: Project,
  features?: { auth?: boolean; edgeFunctions?: boolean; storage?: boolean; realtime?: boolean }
): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  const authEnabled = features?.auth ?? true
  const edgeFunctionsEnabled = features?.edgeFunctions ?? true
  const storageEnabled = features?.storage ?? true
  const realtimeEnabled = features?.realtime ?? true

  const authMenu = generateAuthMenu(ref as string)

  return [
    ...(edgeFunctionsEnabled
      ? [
          {
            key: 'functions',
            label: 'Edge Functions',
            icon: <EdgeFunctions size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/functions`),
          },
        ]
      : []),
    ...(authEnabled
      ? [
          {
            key: 'auth',
            label: 'Authentication',
            icon: <Auth size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/auth/users`),
            items: authMenu,
          },
        ]
      : []),
    ...(realtimeEnabled
      ? [
          {
            key: 'realtime',
            label: 'Realtime Settings',
            icon: <Realtime size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/realtime/inspector`),
          },
        ]
      : []),
    ...(storageEnabled
      ? [
          {
            key: 'storage',
            label: 'Storage',
            icon: <Storage size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/storage/buckets`),
          },
        ]
      : []),
  ]
}

export const generateCMSRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return [
    {
      key: 'cms-content',
      label: 'Content Management',
      icon: <FileImage size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/cms/content`),
    },
    {
      key: 'media-library',
      label: 'Digital Asset Management',
      icon: <FileImage size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/media/library`),
    },
    {
      key: 'player-cores',
      label: 'Player Cores',
      icon: <FileImage size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/media/cores`),
    },
  ]
}

export const generateInfrastructureRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return [
    {
      key: 'infrastructure-overview',
      label: 'Infrastructure Overview',
      icon: <Server size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/infrastructure/overview`),
    },
    {
      key: 'compute-providers',
      label: 'Compute Providers',
      icon: <Server size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/infrastructure/compute`),
    },
    {
      key: 'storage-management',
      label: 'Storage Management',
      icon: <Server size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/infrastructure/storage`),
    },
    {
      key: 'cost-analytics',
      label: 'Cost Analytics',
      icon: <BarChart3 size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/infrastructure/costs`),
    },
  ]
}

export const generateAnalyticsRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return [
    {
      key: 'analytics-dashboard',
      label: 'Analytics Dashboard',
      icon: <BarChart3 size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/analytics/overview`),
    },
    {
      key: 'logs',
      label: 'Logs & Monitoring',
      icon: <List size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/logs`),
    },
    ...(IS_PLATFORM
      ? [
          {
            key: 'reports',
            label: 'Usage Reports',
            icon: <Reports size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/reports`),
          },
        ]
      : []),
  ]
}

export const generateSecurityRoutes = (ref?: string, project?: Project): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return [
    {
      key: 'security-dashboard',
      label: 'Security Dashboard',
      icon: <Shield size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/security/dashboard`),
    },
    {
      key: 'advisors',
      label: 'Security Advisors',
      icon: <Lightbulb size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/advisors/security`),
    },
  ]
}

export const generateQuickActionsRoutes = (
  ref?: string,
  project?: Project,
  features?: { unifiedLogs?: boolean }
): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  const showUnifiedLogs = features?.unifiedLogs ?? false

  return [
    ...(showUnifiedLogs
      ? [
          {
            key: 'unified-logs',
            label: 'Unified Logs',
            icon: <Logs size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/unified-logs`),
          },
        ]
      : []),
  ]
}

export const generateSettingsRoutes = (ref?: string, project?: Project): Route[] => {
  const settingsMenu = generateSettingsMenu(ref as string)
  return [
    ...(IS_PLATFORM
      ? [
          {
            key: 'settings',
            label: 'Project Settings',
            icon: <Settings size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: ref && `/project/${ref}/settings/general`,
            items: settingsMenu,
          },
        ]
      : []),
  ]
}
