import { useState } from 'react'
import { Settings, Save, FileText } from 'lucide-react'
import { Button, Input, Textarea } from 'ui'
import MCPLayout from 'components/layouts/MCPLayout/MCPLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import type { NextPageWithLayout } from 'types'

const MCPConfigurationPage: NextPageWithLayout = () => {
  const { project } = useProjectContext()
  const [config, setConfig] = useState({
    globalTimeout: '30000',
    maxConcurrentServers: '10',
    logLevel: 'info',
    customConfig: JSON.stringify({
      mcpServers: {
        'supabase-db-proxy': {
          command: 'npx',
          args: ['-y', '@supabase/mcp-server-supabase'],
          env: {
            SUPABASE_URL: '{{SUPABASE_URL}}',
            SUPABASE_ANON_KEY: '{{SUPABASE_ANON_KEY}}'
          }
        }
      }
    }, null, 2)
  })

  const handleSave = () => {
    console.log('Saving MCP configuration:', config)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">MCP Configuration</h1>
        <Button type="primary" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-surface-100 border border-overlay rounded p-6">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Global Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Global Timeout (ms)
                </label>
                <Input
                  value={config.globalTimeout}
                  onChange={(e) => setConfig(prev => ({ ...prev, globalTimeout: e.target.value }))}
                  placeholder="30000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Concurrent Servers
                </label>
                <Input
                  value={config.maxConcurrentServers}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxConcurrentServers: e.target.value }))}
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Log Level
                </label>
                <select
                  value={config.logLevel}
                  onChange={(e) => setConfig(prev => ({ ...prev, logLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-overlay rounded text-sm"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-100 border border-overlay rounded p-6">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Custom Configuration
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                mcp_servers_config.json
              </label>
              <Textarea
                value={config.customConfig}
                onChange={(e) => setConfig(prev => ({ ...prev, customConfig: e.target.value }))}
                rows={20}
                className="font-mono text-xs"
                placeholder="Enter custom MCP server configuration..."
              />
              <p className="text-xs text-foreground-light mt-2">
                This configuration will be merged with installed server configurations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

MCPConfigurationPage.getLayout = (page) => (
  <DefaultLayout>
    <MCPLayout title="MCP Configuration">
      <ScaffoldContainer>
        <ScaffoldSection>{page}</ScaffoldSection>
      </ScaffoldContainer>
    </MCPLayout>
  </DefaultLayout>
)

export default MCPConfigurationPage
