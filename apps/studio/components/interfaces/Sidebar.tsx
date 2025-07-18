import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import { isUndefined } from 'lodash'
import { Blocks, Boxes, ChartArea, PanelLeftDashed, Receipt, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps, ComponentPropsWithoutRef, FC, ReactNode, useEffect } from 'react'

import { LOCAL_STORAGE_KEYS, useIsMFAEnabled, useParams } from 'common'
import { Plus, MessageSquare, Zap, BarChart3 } from 'lucide-react'
import {
  generateDashboardRoutes,
  generateDatabaseRoutes,
  generateAIAutomationRoutes,
  generateIntegrationsRoutes,
  generateApplicationsRoutes,
  generateCMSRoutes,
  generateInfrastructureRoutes,
  generateAnalyticsRoutes,
  generateSecurityRoutes,
  generateQuickActionsRoutes,
  generateSettingsRoutes,
} from 'components/layouts/ProjectLayout/NavigationBar/NavigationBar.utils'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { ProjectIndexPageLink } from 'data/prefetchers/project.$ref'
import { useHideSidebar } from 'hooks/misc/useHideSidebar'
import { useIsFeatureEnabled } from 'hooks/misc/useIsFeatureEnabled'
import { useLints } from 'hooks/misc/useLints'
import { useLocalStorageQuery } from 'hooks/misc/useLocalStorage'
import { useSelectedOrganization } from 'hooks/misc/useSelectedOrganization'
import { useFlag } from 'hooks/ui/useFlag'
import { Home } from 'icons'
import { useAppStateSnapshot } from 'state/app-state'
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  SidebarContent as SidebarContentPrimitive,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
  useSidebar,
} from 'ui'
import { useIsAPIDocsSidePanelEnabled } from './App/FeaturePreview/FeaturePreviewContext'

export const ICON_SIZE = 32
export const ICON_STROKE_WIDTH = 1.5
export type SidebarBehaviourType = 'expandable' | 'open' | 'closed'
export const DEFAULT_SIDEBAR_BEHAVIOR = 'expandable'

const SidebarMotion = motion(SidebarPrimitive) as FC<
  ComponentProps<typeof SidebarPrimitive> & {
    transition?: MotionProps['transition']
  }
>

export interface SidebarProps extends ComponentPropsWithoutRef<typeof SidebarPrimitive> {}

export const Sidebar = ({ className, ...props }: SidebarProps) => {
  const { setOpen } = useSidebar()
  const hideSideBar = useHideSidebar()

  const [sidebarBehaviour, setSidebarBehaviour] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.SIDEBAR_BEHAVIOR,
    DEFAULT_SIDEBAR_BEHAVIOR
  )

  useEffect(() => {
    // logic to toggle sidebar open based on sidebarBehaviour state
    if (sidebarBehaviour === 'open') setOpen(true)
    if (sidebarBehaviour === 'closed') setOpen(false)
  }, [sidebarBehaviour, setOpen])

  return (
    <AnimatePresence>
      {!hideSideBar && (
        <SidebarMotion
          {...props}
          transition={{ delay: 0.4, duration: 0.4 }}
          overflowing={sidebarBehaviour === 'expandable'}
          collapsible="icon"
          variant="sidebar"
          onMouseEnter={() => {
            if (sidebarBehaviour === 'expandable') setOpen(true)
          }}
          onMouseLeave={() => {
            if (sidebarBehaviour === 'expandable') setOpen(false)
          }}
        >
          <SidebarContent
            footer={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="text"
                    className={`w-min px-1.5 mx-0.5 ${sidebarBehaviour === 'open' ? '!px-2' : ''}`}
                    icon={<PanelLeftDashed size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-40">
                  <DropdownMenuRadioGroup
                    value={sidebarBehaviour}
                    onValueChange={(value) => setSidebarBehaviour(value as SidebarBehaviourType)}
                  >
                    <DropdownMenuLabel>Sidebar control</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioItem value="open">Expanded</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="closed">Collapsed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="expandable">
                      Expand on hover
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
        </SidebarMotion>
      )}
    </AnimatePresence>
  )
}

export const SidebarContent = ({ footer }: { footer?: ReactNode }) => {
  const { ref: projectRef } = useParams()

  return (
    <>
      <AnimatePresence mode="wait">
        <SidebarContentPrimitive>
          {projectRef ? (
            <motion.div key="project-links">
              <ProjectLinks />
            </motion.div>
          ) : (
            <motion.div
              key="org-links"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <OrganizationLinks />
            </motion.div>
          )}
        </SidebarContentPrimitive>
      </AnimatePresence>
      <SidebarFooter>
        <SidebarGroup className="p-0">{footer}</SidebarGroup>
      </SidebarFooter>
    </>
  )
}

export function SideBarNavLink({
  route,
  active,
  onClick,
  disabled,
  ...props
}: {
  route: any
  active?: boolean
  disabled?: boolean
  onClick?: () => void
} & ComponentPropsWithoutRef<typeof SidebarMenuButton>) {
  const [sidebarBehaviour] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.SIDEBAR_BEHAVIOR,
    DEFAULT_SIDEBAR_BEHAVIOR
  )

  const buttonProps = {
    disabled,
    tooltip: sidebarBehaviour === 'closed' ? route.label : '',
    isActive: active,
    className: cn('text-sm', sidebarBehaviour === 'open' ? '!px-2' : ''),
    size: 'default' as const,
    onClick: onClick,
  }

  const content = props.children ? (
    props.children
  ) : (
    <>
      {route.icon}
      <span>{route.label}</span>
    </>
  )

  return (
    <SidebarMenuItem>
      {route.link && !disabled ? (
        <SidebarMenuButton {...buttonProps} asChild>
          <Link href={route.link}>{content}</Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton {...buttonProps}>{content}</SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}

const ActiveDot = (errorArray: any[], warningArray: any[]) => {
  return (
    <div
      className={cn(
        'absolute pointer-events-none flex h-2 w-2 left-[18px] group-data-[state=expanded]:left-[20px] top-2 z-10 rounded-full',
        errorArray.length > 0
          ? 'bg-destructive-600'
          : warningArray.length > 0
            ? 'bg-warning-600'
            : 'bg-transparent'
      )}
    />
  )
}

const ProjectLinks = () => {
  const router = useRouter()
  const { ref } = useParams()
  const { project } = useProjectContext()
  const snap = useAppStateSnapshot()
  const isNewAPIDocsEnabled = useIsAPIDocsSidePanelEnabled()
  const { securityLints, errorLints } = useLints()

  const showWarehouse = useFlag('warehouse')
  const showUnifiedLogs = useFlag('unifiedLogs')

  const activeRoute = router.pathname.split('/')[3]

  const {
    projectAuthAll: authEnabled,
    projectEdgeFunctionAll: edgeFunctionsEnabled,
    projectStorageAll: storageEnabled,
    realtimeAll: realtimeEnabled,
  } = useIsFeatureEnabled([
    'project_auth:all',
    'project_edge_function:all',
    'project_storage:all',
    'realtime:all',
  ])

  const dashboardRoutes = generateDashboardRoutes(ref, project)
  const databaseRoutes = generateDatabaseRoutes(ref, project)
  const aiAutomationRoutes = generateAIAutomationRoutes(ref, project)
  const integrationsRoutes = generateIntegrationsRoutes(ref, project)
  const applicationsRoutes = generateApplicationsRoutes(ref, project, {
    auth: authEnabled,
    edgeFunctions: edgeFunctionsEnabled,
    storage: storageEnabled,
    realtime: realtimeEnabled,
  })
  const cmsRoutes = generateCMSRoutes(ref, project)
  const infrastructureRoutes = generateInfrastructureRoutes(ref, project)
  const analyticsRoutes = generateAnalyticsRoutes(ref, project)
  const securityRoutes = generateSecurityRoutes(ref, project)
  const quickActionsRoutes = generateQuickActionsRoutes(ref, project, { unifiedLogs: showUnifiedLogs })
  const settingsRoutes = generateSettingsRoutes(ref, project)

  return (
    <SidebarMenu>
      {/* Quick Actions Panel */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Quick Actions
      </div>
      <SidebarGroup className="gap-0.5 mb-4">
        <SideBarNavLink
          route={{
            key: 'quick-create-table',
            label: 'Create Table',
            icon: <Plus size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: `/project/${ref}/database/tables`,
          }}
        />
        <SideBarNavLink
          route={{
            key: 'quick-ai-chat',
            label: 'Launch AI Chat',
            icon: <MessageSquare size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: `/project/${ref}/ai/chat`,
          }}
        />
        <SideBarNavLink
          route={{
            key: 'quick-deploy-function',
            label: 'Deploy Function',
            icon: <Zap size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: `/project/${ref}/functions`,
          }}
        />
        <SideBarNavLink
          route={{
            key: 'quick-view-analytics',
            label: 'View Analytics',
            icon: <BarChart3 size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
            link: `/project/${ref}/analytics/overview`,
          }}
        />
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      {/* Dashboard Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Dashboard
      </div>
      <SidebarGroup className="gap-0.5">
        {dashboardRoutes.map((route, i) => (
          <SideBarNavLink
            key={`dashboard-routes-${i}`}
            route={route}
            active={isUndefined(activeRoute) && !isUndefined(router.query.ref)}
          />
        ))}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* Database Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Database
      </div>
      <SidebarGroup className="gap-0.5">
        {databaseRoutes.map((route, i) => {
          if (route.key === 'api' && isNewAPIDocsEnabled) {
            return (
              <SideBarNavLink
                key={`database-routes-${i}`}
                route={{
                  label: route.label,
                  icon: route.icon,
                  key: route.key,
                }}
                onClick={() => {
                  snap.setShowProjectApiDocs(true)
                }}
              />
            )
          }
          return (
            <SideBarNavLink
              key={`database-routes-${i}`}
              route={route}
              active={activeRoute === route.key}
            />
          )
        })}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* AI & Automation Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        AI &amp; Automation
      </div>
      <SidebarGroup className="gap-0.5">
        {aiAutomationRoutes.map((route, i) => (
          <SideBarNavLink
            key={`ai-automation-routes-${i}`}
            route={route}
            active={activeRoute === route.key}
          />
        ))}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* Integrations Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Integrations
      </div>
      <SidebarGroup className="gap-0.5">
        {integrationsRoutes.map((route, i) => (
          <SideBarNavLink
            key={`integrations-routes-${i}`}
            route={route}
            active={activeRoute === route.key}
          />
        ))}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* Applications Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Applications
      </div>
      <SidebarGroup className="gap-0.5">
        {applicationsRoutes.map((route, i) => (
          <SideBarNavLink
            key={`applications-routes-${i}`}
            route={route}
            active={activeRoute === route.key}
          />
        ))}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* CMS Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        CMS
      </div>
      <SidebarGroup className="gap-0.5">
        {cmsRoutes.map((route, i) => (
          <SideBarNavLink
            key={`cms-routes-${i}`}
            route={route}
            active={activeRoute === route.key}
          />
        ))}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* Infrastructure Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Infrastructure
      </div>
      <SidebarGroup className="gap-0.5">
        {infrastructureRoutes.map((route, i) => (
          <SideBarNavLink
            key={`infrastructure-routes-${i}`}
            route={route}
            active={activeRoute === route.key}
          />
        ))}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* Analytics & Insights Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Analytics &amp; Insights
      </div>
      <SidebarGroup className="gap-0.5">
        {analyticsRoutes.map((route, i) => {
          if (route.key === 'logs') {
            const label = showWarehouse ? 'Logs &amp; Analytics' : route.label
            const newRoute = { ...route, label }
            return (
              <SideBarNavLink
                key={`analytics-routes-${i}`}
                route={newRoute}
                active={activeRoute === newRoute.key}
              />
            )
          }
          return (
            <SideBarNavLink
              key={`analytics-routes-${i}`}
              route={route}
              active={activeRoute === route.key}
            />
          )
        })}
      </SidebarGroup>
      
      <Separator className="w-[calc(100%-1rem)] mx-auto" />
      
      {/* Security Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Security
      </div>
      <SidebarGroup className="gap-0.5">
        {securityRoutes.map((route, i) => {
          if (route.key === 'advisors') {
            return (
              <div className="relative" key={route.key}>
                {ActiveDot(errorLints, securityLints)}
                <SideBarNavLink
                  key={`security-routes-${i}`}
                  route={route}
                  active={activeRoute === route.key}
                />
              </div>
            )
          }
          return (
            <SideBarNavLink
              key={`security-routes-${i}`}
              route={route}
              active={activeRoute === route.key}
            />
          )
        })}
      </SidebarGroup>
      
      {/* Quick Actions (if any) */}
      {quickActionsRoutes && quickActionsRoutes.length > 0 && (
        <>
          <Separator className="w-[calc(100%-1rem)] mx-auto" />
          <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
            Quick Actions
          </div>
          <SidebarGroup className="gap-0.5">
            {quickActionsRoutes.map((route, i) => (
              <SideBarNavLink
                key={`quick-actions-routes-${i}`}
                route={route}
                active={activeRoute === route.key}
              />
            ))}
          </SidebarGroup>
        </>
      )}
      
      {/* Settings Section */}
      <div className="px-3 py-2 text-xs font-medium text-foreground-light uppercase tracking-wider">
        Settings
      </div>
      <SidebarGroup className="gap-0.5">
        {settingsRoutes.map((route, i) => (
          <SideBarNavLink
            key={`settings-routes-${i}`}
            route={route}
            active={activeRoute === route.key}
          />
        ))}
      </SidebarGroup>
    </SidebarMenu>
  )
}

const OrganizationLinks = () => {
  const router = useRouter()
  const { slug } = useParams()

  const org = useSelectedOrganization()
  const isUserMFAEnabled = useIsMFAEnabled()
  const disableAccessMfa = org?.organization_requires_mfa && !isUserMFAEnabled

  const activeRoute = router.pathname.split('/')[3]

  const navMenuItems = [
    {
      label: 'Projects',
      href: `/org/${slug}`,
      key: 'projects',
      icon: <Boxes size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    {
      label: 'Team',
      href: `/org/${slug}/team`,
      key: 'team',
      icon: <Users size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    {
      label: 'Integrations',
      href: `/org/${slug}/integrations`,
      key: 'integrations',
      icon: <Blocks size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    {
      label: 'Usage',
      href: `/org/${slug}/usage`,
      key: 'usage',
      icon: <ChartArea size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    {
      label: 'Billing',
      href: `/org/${slug}/billing`,
      key: 'billing',
      icon: <Receipt size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
    },
    {
      label: 'Organization settings',
      href: `/org/${slug}/general`,
      key: 'settings',
      icon: <Settings size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
    },
  ]

  return (
    <SidebarMenu className="flex flex-col gap-1 items-start">
      <SidebarGroup className="gap-0.5">
        {navMenuItems.map((item, i) => (
          <SideBarNavLink
            key={item.key}
            disabled={disableAccessMfa}
            active={
              i === 0
                ? activeRoute === undefined
                : item.key === 'settings'
                  ? router.pathname.includes('/general') ||
                    router.pathname.includes('/apps') ||
                    router.pathname.includes('/audit') ||
                    router.pathname.includes('/documents') ||
                    router.pathname.includes('/security')
                  : activeRoute === item.key
            }
            route={{
              label: item.label,
              link: item.href,
              key: item.label,
              icon: item.icon,
            }}
          />
        ))}
      </SidebarGroup>
    </SidebarMenu>
  )
}
