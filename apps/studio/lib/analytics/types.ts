export interface ContentDecayMetrics {
  contentId: string
  contentType: 'text' | 'image' | 'video' | '3d' | 'xr'
  createdAt: string
  lastModified: string
  viewCount: number
  engagementScore: number
  decayRate: number
  predictedLifespan: number
  refreshRecommendation: 'low' | 'medium' | 'high' | 'critical'
  factors: DecayFactor[]
}

export interface DecayFactor {
  type: 'temporal' | 'engagement' | 'technical' | 'competitive'
  impact: number
  description: string
  trend: 'increasing' | 'decreasing' | 'stable'
}

export interface AgentSynergyMetrics {
  agentId: string
  agentType: 'content' | 'security' | 'optimization' | 'analysis'
  collaborationScore: number
  taskCompletionRate: number
  synergyPartners: string[]
  conflictRate: number
  performanceMetrics: AgentPerformance
}

export interface AgentPerformance {
  averageResponseTime: number
  successRate: number
  resourceUtilization: number
  qualityScore: number
  learningRate: number
}

export interface NetworkNode {
  id: string
  type: 'content' | 'user' | 'agent' | 'resource'
  weight: number
  connections: string[]
  centrality: number
  influence: number
  metadata: Record<string, any>
}

export interface NetworkAnalysis {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  metrics: NetworkMetrics
  communities: Community[]
  criticalPaths: CriticalPath[]
}

export interface NetworkEdge {
  source: string
  target: string
  weight: number
  type: 'collaboration' | 'dependency' | 'influence' | 'conflict'
  strength: number
}

export interface NetworkMetrics {
  density: number
  clustering: number
  averagePathLength: number
  modularity: number
  resilience: number
}

export interface Community {
  id: string
  nodes: string[]
  cohesion: number
  influence: number
  stability: number
}

export interface CriticalPath {
  nodes: string[]
  importance: number
  vulnerability: number
  alternatives: string[][]
}

export interface AnalyticsQuery {
  type: 'decay' | 'synergy' | 'network'
  timeRange: {
    start: string
    end: string
  }
  filters: Record<string, any>
  aggregation: 'hour' | 'day' | 'week' | 'month'
}

export interface AnalyticsResult {
  query: AnalyticsQuery
  data: any[]
  insights: Insight[]
  recommendations: Recommendation[]
  confidence: number
  generatedAt: string
}

export interface Insight {
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: any[]
  confidence: number
}

export interface Recommendation {
  type: 'optimization' | 'maintenance' | 'expansion' | 'mitigation'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  action: string
  expectedImpact: number
  effort: 'low' | 'medium' | 'high'
  timeline: string
}
