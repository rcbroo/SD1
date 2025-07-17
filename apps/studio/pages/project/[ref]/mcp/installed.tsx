import { useState } from 'react'
import { Server, Trash2, Settings, Play, Pause } from 'lucide-react'
import { Button, Badge } from 'ui'
import MCPLayout from 'components/layouts/MCPLayout/MCPLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import { useMCPServerInstallationsQuery } from 'data/mcp/mcp-server-installations-query'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { getMCPTemplateById } from 'lib/mcp/templates'
import type { NextPageWithLayout } from 'types'

const MCPInstalledServersPage: NextPageWithLayout = () => {
  const { project } = useProjectContext()
  const { data: installations, isLoading } = useMCPServerInstallationsQuery({
    projectRef: project?.ref
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-surface-100 rounded animate-pulse" />
        <div className="h-32 bg-surface-100 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Installed MCP Servers</h1>
        <Button type="primary" href={`/project/${project?.ref}/mcp/marketplace`}>
          Browse Marketplace
        </Button>
      </div>

      {installations?.length === 0 ? (
        <div className="text-center py-12">
          <Server className="w-12 h-12 text-foreground-light mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No MCP servers installed</h3>
          <p className="text-foreground-light mb-4">
            Install MCP servers from the marketplace to extend your project capabilities.
          </p>
          <Button type="primary" href={`/project/${project?.ref}/mcp/marketplace`}>
            Browse Marketplace
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {installations?.map((installation) => {
            const template = getMCPTemplateById(installation.templateId)
            if (!template) return null

            const Icon = template.icon

            return (
              <div
                key={installation.id}
                className="bg-surface-100 border border-overlay rounded p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded bg-brand-200">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{template.name}</h3>
                    <p className="text-sm text-foreground-light">{template.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant={
                          installation.status === 'installed'
                            ? 'success'
                            : installation.status === 'failed'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {installation.status}
                      </Badge>
                      <span className="text-xs text-foreground-light">
                        Installed {new Date(installation.installedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button type="outline" size="tiny" icon={<Settings className="w-3 h-3" />}>
                    Configure
                  </Button>
                  <Button
                    type="outline"
                    size="tiny"
                    icon={
                      installation.status === 'installed' ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )
                    }
                  >
                    {installation.status === 'installed' ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    type="outline"
                    size="tiny"
                    icon={<Trash2 className="w-3 h-3" />}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

MCPInstalledServersPage.getLayout = (page) => (
  <DefaultLayout>
    <MCPLayout title="Installed MCP Servers">
      <ScaffoldContainer>
        <ScaffoldSection>{page}</ScaffoldSection>
      </ScaffoldContainer>
    </MCPLayout>
  </DefaultLayout>
)

export default MCPInstalledServersPage
