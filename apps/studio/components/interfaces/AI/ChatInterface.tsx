import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Input, Badge } from 'ui'
import { Send, Bot, User, Loader, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { ChatMessage, ChatSession, ServiceAutomationTask } from 'lib/ai/chat/types'
import { serviceAutomationEngine } from 'lib/ai/chat/service-automation'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'

const ChatInterface = () => {
  const project = useSelectedProject()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentTask, setCurrentTask] = useState<ServiceAutomationTask | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI assistant for ${project?.name || 'your project'}. I can help you with:

• **Service Setup**: "Set up 3D processing pipeline for gaming project"
• **Optimization**: "Optimize database performance for high traffic"
• **Troubleshooting**: "Debug connection issues with MCP servers"
• **Migration**: "Migrate data from PostgreSQL to Supabase"

What would you like me to help you with today?`,
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }, [project])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const task = await serviceAutomationEngine.processNaturalLanguageRequest(
        inputValue,
        {
          projectState: {
            databases: [],
            mcpServers: [],
            aiProviders: [],
            mediaAssets: [],
            infrastructure: [],
            security: []
          },
          userPreferences: {
            language: 'en',
            expertise: 'intermediate',
            preferredProviders: ['openai', 'anthropic']
          },
          capabilities: ['setup', 'optimization', 'troubleshooting', 'migration']
        }
      )

      if (task) {
        setCurrentTask(task)
        
        const taskMessage: ChatMessage = {
          id: `task-${Date.now()}`,
          role: 'assistant',
          content: `I can automate this request for you! I've created a task: **${task.title}**

${task.description}

**Estimated Duration**: ${Math.round(task.estimatedDuration / 60)} minutes
**Steps**: ${task.steps.length}

Would you like me to proceed with the automation?`,
          timestamp: new Date().toISOString(),
          metadata: {
            toolCalls: [{
              id: task.id,
              name: 'service_automation',
              arguments: { taskId: task.id },
              status: 'pending'
            }]
          }
        }

        setMessages(prev => [...prev, taskMessage])
      } else {
        const assistantMessage: ChatMessage = {
          id: `response-${Date.now()}`,
          role: 'assistant',
          content: `I understand you're asking about: "${inputValue}"

While I can't automate this specific request, I can provide guidance:

• Check the relevant documentation in your project
• Review the configuration settings
• Consider using the appropriate dashboard section
• If this is a recurring task, let me know and I can help create an automation workflow

Is there a specific aspect you'd like me to help you with?`,
          timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}

Please try rephrasing your request or contact support if the issue persists.`,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecuteTask = async () => {
    if (!currentTask) return

    setIsLoading(true)
    
    const executionMessage: ChatMessage = {
      id: `execution-${Date.now()}`,
      role: 'assistant',
      content: `🚀 Starting automation: **${currentTask.title}**

I'll keep you updated on the progress...`,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, executionMessage])

    try {
      await serviceAutomationEngine.executeTask(currentTask)
      
      const completionMessage: ChatMessage = {
        id: `completion-${Date.now()}`,
        role: 'assistant',
        content: `✅ **Task Completed Successfully!**

**${currentTask.title}** has been completed. Here's what was accomplished:

${currentTask.steps.map((step, index) => 
  `${index + 1}. ✅ ${step.title}`
).join('\n')}

Your services are now configured and ready to use. You can verify the setup in the relevant dashboard sections.`,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, completionMessage])
      setCurrentTask(null)
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `task-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Task Failed**

The automation encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}

You can try running the task again or perform the setup manually using the dashboard.`,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'running': return <Loader className="w-4 h-4 text-blue-600 animate-spin" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-100 border border-overlay'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 mt-1 text-brand-600" />
                )}
                {message.role === 'user' && (
                  <User className="w-4 h-4 mt-1" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  {message.metadata?.toolCalls && (
                    <div className="mt-2 space-y-2">
                      {message.metadata.toolCalls.map((toolCall) => (
                        <div key={toolCall.id} className="flex items-center space-x-2">
                          {getTaskStatusIcon(toolCall.status)}
                          <span className="text-xs text-foreground-light">
                            {toolCall.name}
                          </span>
                          {toolCall.status === 'pending' && currentTask && (
                            <Button
                              size="tiny"
                              onClick={handleExecuteTask}
                              disabled={isLoading}
                            >
                              Execute
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-100 border border-overlay rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-brand-600" />
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm text-foreground-light">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-overlay p-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me to set up services, optimize performance, or troubleshoot issues..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            icon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
        
        {currentTask && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              Task ready for execution: {currentTask.title}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInterface
