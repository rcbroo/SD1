import { useQuery } from '@tanstack/react-query'
import { AIProviderConfig } from 'lib/ai/providers/types'

export interface AIProviderConfigsVariables {
  projectRef?: string
}

export async function getAIProviderConfigs({ projectRef }: AIProviderConfigsVariables) {
  if (!projectRef) throw new Error('Project ref is required')

  const response = await fetch(`/api/ai/providers/configs?projectRef=${projectRef}`)

  if (!response.ok) {
    throw new Error('Failed to fetch AI provider configs')
  }

  return response.json()
}

export const useAIProviderConfigsQuery = ({ projectRef }: AIProviderConfigsVariables) =>
  useQuery({
    queryKey: ['ai-provider-configs', projectRef],
    queryFn: () => getAIProviderConfigs({ projectRef }),
    enabled: !!projectRef,
  })
