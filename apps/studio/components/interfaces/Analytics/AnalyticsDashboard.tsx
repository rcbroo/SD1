import { useState, useEffect } from 'react'
import { Card, Button, Badge, Tabs_Shadcn_, TabsList_Shadcn_, TabsTrigger_Shadcn_, TabsContent_Shadcn_ } from 'ui'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Network, Users } from 'lucide-react'
import { contentDecayAnalyzer } from 'lib/analytics/decay'
import { agentSynergyAnalyzer } from 'lib/analytics/synergy'
import { networkAnalyzer } from 'lib/analytics/network'
import { AnalyticsResult, ContentDecayMetrics, AgentSynergyMetrics, NetworkAnalysis } from 'lib/analytics/types'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'

const AnalyticsDashboard = () => {
  const { project } = useProjectContext()
  const [activeTab, setActiveTab] = useState('overview')
  const [decayMetrics, setDecayMetrics] = useState<ContentDecayMetrics[]>([])
  const [synergyMetrics, setSynergyMetrics] = useState<AgentSynergyMetrics[]>([])
  const [networkAnalysis, setNetworkAnalysis] = useState<NetworkAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (project?.ref) {
      loadAnalytics()
    }
  }, [project?.ref])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const mockDecayMetrics = await Promise.all([
        contentDecayAnalyzer.analyzeContentDecay('content-1'),
        contentDecayAnalyzer.analyzeContentDecay('content-2'),
        contentDecayAnalyzer.analyzeContentDecay('content-3')
      ])
      
      const mockSynergyMetrics = await Promise.all([
        agentSynergyAnalyzer.analyzeAgentSynergy('agent-1'),
        agentSynergyAnalyzer.analyzeAgentSynergy('agent-2'),
        agentSynergyAnalyzer.analyzeAgentSynergy('agent-3')
      ])

      const mockNetworkAnalysis = await networkAnalyzer.analyzeContentEcosystem(project!.ref)

      setDecayMetrics(mockDecayMetrics)
      setSynergyMetrics(mockSynergyMetrics)
      setNetworkAnalysis(mockNetworkAnalysis)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDecayStatusColor = (recommendation: string) => {
    switch (recommendation) {
      case 'critical': return 'destructive'
      case 'high': return 'warning'
      case 'medium': return 'secondary'
      default: return 'success'
    }
  }

  const getSynergyStatusColor = (score: number) => {
    if (score >= 0.8) return 'success'
    if (score >= 0.6) return 'secondary'
    if (score >= 0.4) return 'warning'
    return 'destructive'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-foreground-light">
            Predictive insights for content, agents, and ecosystem health
          </p>
        </div>
        <Button onClick={loadAnalytics} loading={loading}>
          Refresh Analytics
        </Button>
      </div>

      <Tabs_Shadcn_ value={activeTab} onValueChange={setActiveTab}>
        <TabsList_Shadcn_ className="grid w-full grid-cols-4">
          <TabsTrigger_Shadcn_ value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger_Shadcn_>
          <TabsTrigger_Shadcn_ value="decay" className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Content Decay
          </TabsTrigger_Shadcn_>
          <TabsTrigger_Shadcn_ value="synergy" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Agent Synergy
          </TabsTrigger_Shadcn_>
          <TabsTrigger_Shadcn_ value="network" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Network Analysis
          </TabsTrigger_Shadcn_>
        </TabsList_Shadcn_>

        <TabsContent_Shadcn_ value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-light">Critical Content</p>
                  <p className="text-2xl font-bold text-destructive">
                    {decayMetrics.filter(m => m.refreshRecommendation === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-light">Avg Agent Synergy</p>
                  <p className="text-2xl font-bold text-brand-600">
                    {(synergyMetrics.reduce((sum, m) => sum + m.collaborationScore, 0) / synergyMetrics.length * 100).toFixed(0)}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-brand-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-light">Network Density</p>
                  <p className="text-2xl font-bold text-foreground">
                    {networkAnalysis ? (networkAnalysis.metrics.density * 100).toFixed(1) : '0'}%
                  </p>
                </div>
                <Network className="w-8 h-8 text-foreground" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-light">System Health</p>
                  <p className="text-2xl font-bold text-success">
                    {networkAnalysis ? (networkAnalysis.metrics.resilience * 100).toFixed(0) : '0'}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Content Health Overview</h3>
              <div className="space-y-3">
                {decayMetrics.slice(0, 5).map((metric) => (
                  <div key={metric.contentId} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{metric.contentId}</p>
                      <p className="text-sm text-foreground-light">
                        Decay Rate: {(metric.decayRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <Badge variant={getDecayStatusColor(metric.refreshRecommendation)}>
                      {metric.refreshRecommendation}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
              <div className="space-y-3">
                {synergyMetrics.map((metric) => (
                  <div key={metric.agentId} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{metric.agentId}</p>
                      <p className="text-sm text-foreground-light">
                        Type: {metric.agentType} • Success: {(metric.taskCompletionRate * 100).toFixed(0)}%
                      </p>
                    </div>
                    <Badge variant={getSynergyStatusColor(metric.collaborationScore)}>
                      {(metric.collaborationScore * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent_Shadcn_>

        <TabsContent_Shadcn_ value="decay">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content Decay Analysis</h3>
            <div className="space-y-4">
              {decayMetrics.map((metric) => (
                <div key={metric.contentId} className="border border-overlay rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{metric.contentId}</h4>
                    <Badge variant={getDecayStatusColor(metric.refreshRecommendation)}>
                      {metric.refreshRecommendation}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-foreground-light">Decay Rate</p>
                      <p className="font-medium">{(metric.decayRate * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Predicted Lifespan</p>
                      <p className="font-medium">{metric.predictedLifespan} days</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Engagement</p>
                      <p className="font-medium">{(metric.engagementScore * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Views</p>
                      <p className="font-medium">{metric.viewCount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-foreground-light mb-2">Decay Factors:</p>
                    <div className="flex flex-wrap gap-2">
                      {metric.factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor.type}: {(factor.impact * 100).toFixed(0)}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent_Shadcn_>

        <TabsContent_Shadcn_ value="synergy">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agent Synergy Analysis</h3>
            <div className="space-y-4">
              {synergyMetrics.map((metric) => (
                <div key={metric.agentId} className="border border-overlay rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{metric.agentId}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{metric.agentType}</Badge>
                      <Badge variant={getSynergyStatusColor(metric.collaborationScore)}>
                        {(metric.collaborationScore * 100).toFixed(0)}% synergy
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-foreground-light">Task Completion</p>
                      <p className="font-medium">{(metric.taskCompletionRate * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Response Time</p>
                      <p className="font-medium">{metric.performanceMetrics.averageResponseTime.toFixed(0)}ms</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Quality Score</p>
                      <p className="font-medium">{(metric.performanceMetrics.qualityScore * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Conflict Rate</p>
                      <p className="font-medium">{(metric.conflictRate * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-foreground-light mb-2">Synergy Partners:</p>
                    <div className="flex flex-wrap gap-2">
                      {metric.synergyPartners.map((partner) => (
                        <Badge key={partner} variant="secondary" className="text-xs">
                          {partner}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent_Shadcn_>

        <TabsContent_Shadcn_ value="network">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Network Analysis</h3>
            {networkAnalysis && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {(networkAnalysis.metrics.density * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-foreground-light">Network Density</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {networkAnalysis.metrics.clustering.toFixed(2)}
                    </p>
                    <p className="text-sm text-foreground-light">Clustering</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {networkAnalysis.metrics.averagePathLength.toFixed(1)}
                    </p>
                    <p className="text-sm text-foreground-light">Avg Path Length</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {(networkAnalysis.metrics.resilience * 100).toFixed(0)}%
                    </p>
                    <p className="text-sm text-foreground-light">Resilience</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Communities Detected</h4>
                  <div className="space-y-2">
                    {networkAnalysis.communities.map((community) => (
                      <div key={community.id} className="flex items-center justify-between p-3 border border-overlay rounded">
                        <div>
                          <p className="font-medium">{community.id}</p>
                          <p className="text-sm text-foreground-light">
                            {community.nodes.length} nodes • Cohesion: {(community.cohesion * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Badge variant="outline">
                          Influence: {(community.influence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Critical Paths</h4>
                  <div className="space-y-2">
                    {networkAnalysis.criticalPaths.map((path, index) => (
                      <div key={index} className="p-3 border border-overlay rounded">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Path {index + 1}</p>
                          <div className="flex space-x-2">
                            <Badge variant="outline">
                              Importance: {(path.importance * 100).toFixed(0)}%
                            </Badge>
                            <Badge variant={path.vulnerability > 0.5 ? 'destructive' : 'secondary'}>
                              Vulnerability: {(path.vulnerability * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-foreground-light">
                          {path.nodes.join(' → ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent_Shadcn_>
      </Tabs_Shadcn_>
    </div>
  )
}

export default AnalyticsDashboard
