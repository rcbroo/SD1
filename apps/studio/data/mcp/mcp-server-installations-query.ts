import { useQuery } from '@tanstack/react-query'
import { MCPServerInstallation } from 'lib/mcp/types'

export interface MCPServerInstallationsVariables {
  projectRef?: string
}

export async function getMCPServerInstallations({
  projectRef,
}: MCPServerInstallationsVariables): Promise<MCPServerInstallation[]> {
  if (!projectRef) return []

  const response = await fetch(`/api/mcp/servers/installations?projectRef=${projectRef}`)

  if (!response.ok) {
    throw new Error('Failed to fetch MCP server installations')
  }

  const data = await response.json()
  return data.installations || []
}

export const useMCPServerInstallationsQuery = ({ projectRef }: MCPServerInstallationsVariables) => {
  return useQuery({
    queryKey: ['mcp-server-installations', projectRef],
    queryFn: () => getMCPServerInstallations({ projectRef }),
    enabled: !!projectRef,
  })
}
