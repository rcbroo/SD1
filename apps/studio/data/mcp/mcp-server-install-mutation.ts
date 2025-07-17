import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MCPServerConfig } from 'lib/mcp/types'

export interface MCPServerInstallVariables {
  projectRef: string
  templateId: string
  config: MCPServerConfig
}

export async function installMCPServer({
  projectRef,
  templateId,
  config,
}: MCPServerInstallVariables) {
  const response = await fetch('/api/mcp/servers/install', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      projectRef,
      templateId,
      config,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to install MCP server')
  }

  return response.json()
}

export const useMCPServerInstallMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (error: Error) => void
} = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: installMCPServer,
    onSuccess: (data) => {
      toast.success(`MCP server installed successfully`)
      queryClient.invalidateQueries({ queryKey: ['mcp-server-installations'] })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(`Failed to install MCP server: ${error.message}`)
      onError?.(error)
    },
  })
}
