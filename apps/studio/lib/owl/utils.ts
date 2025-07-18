import { OwlMessage, OwlAgent } from './types'

export function formatOwlMessage(message: OwlMessage): string {
  const agentPrefix = message.agent ? `[${message.agent.name}] ` : ''
  return `${agentPrefix}${message.content}`
}

export function createUserAgent(): OwlAgent {
  return {
    role: 'user',
    name: 'User',
    capabilities: ['task_planning', 'instruction_giving', 'verification'],
  }
}

export function createAssistantAgent(): OwlAgent {
  return {
    role: 'assistant',
    name: 'Assistant',
    capabilities: ['sql_generation', 'schema_analysis', 'tool_usage', 'problem_solving'],
  }
}

export function createCoordinatorAgent(): OwlAgent {
  return {
    role: 'coordinator',
    name: 'Coordinator',
    capabilities: ['task_coordination', 'agent_management', 'workflow_orchestration'],
  }
}

export function isOwlEnabled(): boolean {
  if (typeof window !== 'undefined') {
    return false
  }
  return false
}

export function getOwlConfig() {
  if (typeof window !== 'undefined') {
    return {
      enabled: false,
      apiEndpoint: 'http://localhost:8000',
      modelConfig: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: undefined,
      },
      agentConfig: {
        maxRounds: 15,
        enableToolCalls: true,
        enableMultiAgent: true,
      },
    }
  }

  return {
    enabled: isOwlEnabled(),
    apiEndpoint: 'http://localhost:8000',
    modelConfig: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: undefined,
    },
    agentConfig: {
      maxRounds: 15,
      enableToolCalls: true,
      enableMultiAgent: true,
    },
  }
}
