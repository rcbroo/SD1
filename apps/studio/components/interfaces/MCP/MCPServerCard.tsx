import { useState } from 'react'
import { Star, Download, Shield, ExternalLink, Github } from 'lucide-react'
import { Button, Badge, cn } from 'ui'
import { MCPServerTemplate } from 'lib/mcp/types'
import { useMCPServerInstallMutation } from 'data/mcp/mcp-server-install-mutation'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'

interface MCPServerCardProps {
  template: MCPServerTemplate
  isInstalled?: boolean
  onInstall?: (templateId: string) => void
}

const MCPServerCard = ({ template, isInstalled = false, onInstall }: MCPServerCardProps) => {
  const { project } = useProjectContext()
  const [isInstalling, setIsInstalling] = useState(false)

  const { mutate: installServer } = useMCPServerInstallMutation({
    onSuccess: () => {
      setIsInstalling(false)
      onInstall?.(template.id)
    },
    onError: () => {
      setIsInstalling(false)
    },
  })

  const handleInstall = () => {
    if (!project?.ref) return
    setIsInstalling(true)
    installServer({
      projectRef: project.ref,
      templateId: template.id,
      config: template.config,
    })
  }

  const Icon = template.icon

  return (
    <div className="bg-surface-100 border border-overlay flex flex-col overflow-hidden rounded shadow-sm">
      <div className="border-b border-overlay flex justify-between w-full py-3 px-5">
        <div className="max-w-[85%] flex items-center space-x-3 truncate">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-brand-200">
            <Icon className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-foreground truncate">{template.name}</h3>
              {template.verified && <Shield className="w-3 h-3 text-brand-600" />}
            </div>
            <p className="text-xs text-foreground-light">v{template.version}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isInstalled ? (
            <Badge variant="success">Installed</Badge>
          ) : (
            <Button type="primary" size="tiny" loading={isInstalling} onClick={handleInstall}>
              Install
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col p-5 space-y-4">
        <p className="text-sm text-foreground-light">{template.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-foreground-light">{template.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3 text-foreground-light" />
              <span className="text-xs text-foreground-light">
                {template.downloads.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="outline">{template.category}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-overlay">
          <span className="text-xs text-foreground-light">by {template.author}</span>
          <div className="flex items-center space-x-2">
            {template.repository && (
              <Button
                type="text"
                size="tiny"
                icon={<Github className="w-3 h-3" />}
                onClick={() => window.open(template.repository, '_blank')}
              />
            )}
            {template.documentation && (
              <Button
                type="text"
                size="tiny"
                icon={<ExternalLink className="w-3 h-3" />}
                onClick={() => window.open(template.documentation, '_blank')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MCPServerCard
