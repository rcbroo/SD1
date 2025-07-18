import { AgentSynergyMetrics, AgentPerformance, AnalyticsQuery, AnalyticsResult } from './types'

export class AgentSynergyAnalyzer {
  private readonly SYNERGY_WEIGHTS = {
    taskCompletion: 0.3,
    responseTime: 0.2,
    collaboration: 0.25,
    conflictResolution: 0.15,
    learning: 0.1
  }

  async analyzeAgentSynergy(agentId: string): Promise<AgentSynergyMetrics> {
    const performance = await this.getAgentPerformance(agentId)
    const collaborationData = await this.getCollaborationData(agentId)
    const synergyScore = this.calculateSynergyScore(performance, collaborationData)

    return {
      agentId,
      agentType: await this.getAgentType(agentId),
      collaborationScore: synergyScore,
      taskCompletionRate: performance.successRate,
      synergyPartners: collaborationData.partners,
      conflictRate: collaborationData.conflictRate,
      performanceMetrics: performance
    }
  }

  private calculateSynergyScore(performance: AgentPerformance, collaboration: any): number {
    const scores = {
      taskCompletion: performance.successRate,
      responseTime: Math.max(0, 1 - (performance.averageResponseTime / 10000)), // normalize to 0-1
      collaboration: collaboration.score,
      conflictResolution: Math.max(0, 1 - collaboration.conflictRate),
      learning: performance.learningRate
    }

    return Object.entries(this.SYNERGY_WEIGHTS).reduce((total, [key, weight]) => {
      return total + (scores[key as keyof typeof scores] * weight)
    }, 0)
  }

  async analyzeTeamSynergy(agentIds: string[]): Promise<{
    overallSynergy: number
    pairwiseSynergies: Array<{ agent1: string; agent2: string; synergy: number }>
    bottlenecks: string[]
    recommendations: string[]
  }> {
    const agentMetrics = await Promise.all(
      agentIds.map(id => this.analyzeAgentSynergy(id))
    )

    const pairwiseSynergies = this.calculatePairwiseSynergies(agentMetrics)
    const overallSynergy = this.calculateOverallSynergy(pairwiseSynergies)
    const bottlenecks = this.identifyBottlenecks(agentMetrics)
    const recommendations = this.generateSynergyRecommendations(agentMetrics, bottlenecks)

    return {
      overallSynergy,
      pairwiseSynergies,
      bottlenecks,
      recommendations
    }
  }

  private calculatePairwiseSynergies(agents: AgentSynergyMetrics[]): Array<{ agent1: string; agent2: string; synergy: number }> {
    const synergies: Array<{ agent1: string; agent2: string; synergy: number }> = []
    
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const agent1 = agents[i]
        const agent2 = agents[j]
        
        const typeSynergy = this.getTypeSynergy(agent1.agentType, agent2.agentType)
        const collaborationSynergy = this.getCollaborationSynergy(agent1, agent2)
        const performanceSynergy = this.getPerformanceSynergy(agent1.performanceMetrics, agent2.performanceMetrics)
        
        const overallSynergy = (typeSynergy + collaborationSynergy + performanceSynergy) / 3
        
        synergies.push({
          agent1: agent1.agentId,
          agent2: agent2.agentId,
          synergy: overallSynergy
        })
      }
    }
    
    return synergies
  }

  private getTypeSynergy(type1: string, type2: string): number {
    const synergyMatrix = {
      'content-security': 0.8,
      'content-optimization': 0.9,
      'content-analysis': 0.7,
      'security-optimization': 0.6,
      'security-analysis': 0.8,
      'optimization-analysis': 0.9
    }
    
    const key = [type1, type2].sort().join('-')
    return synergyMatrix[key as keyof typeof synergyMatrix] || 0.5
  }

  private getCollaborationSynergy(agent1: AgentSynergyMetrics, agent2: AgentSynergyMetrics): number {
    const sharedPartners = agent1.synergyPartners.filter(p => agent2.synergyPartners.includes(p))
    const collaborationHistory = sharedPartners.length / Math.max(agent1.synergyPartners.length, agent2.synergyPartners.length)
    
    const avgCollaboration = (agent1.collaborationScore + agent2.collaborationScore) / 2
    const conflictPenalty = Math.max(agent1.conflictRate, agent2.conflictRate)
    
    return (collaborationHistory * 0.4 + avgCollaboration * 0.6) * (1 - conflictPenalty)
  }

  private getPerformanceSynergy(perf1: AgentPerformance, perf2: AgentPerformance): number {
    const avgSuccess = (perf1.successRate + perf2.successRate) / 2
    const responseTimeBalance = 1 - Math.abs(perf1.averageResponseTime - perf2.averageResponseTime) / Math.max(perf1.averageResponseTime, perf2.averageResponseTime)
    const qualityBalance = 1 - Math.abs(perf1.qualityScore - perf2.qualityScore) / Math.max(perf1.qualityScore, perf2.qualityScore)
    
    return (avgSuccess * 0.5 + responseTimeBalance * 0.25 + qualityBalance * 0.25)
  }

  private calculateOverallSynergy(pairwiseSynergies: Array<{ agent1: string; agent2: string; synergy: number }>): number {
    if (pairwiseSynergies.length === 0) return 0
    return pairwiseSynergies.reduce((sum, pair) => sum + pair.synergy, 0) / pairwiseSynergies.length
  }

  private identifyBottlenecks(agents: AgentSynergyMetrics[]): string[] {
    return agents
      .filter(agent => 
        agent.collaborationScore < 0.6 || 
        agent.taskCompletionRate < 0.7 || 
        agent.conflictRate > 0.3
      )
      .map(agent => agent.agentId)
  }

  private generateSynergyRecommendations(agents: AgentSynergyMetrics[], bottlenecks: string[]): string[] {
    const recommendations: string[] = []
    
    if (bottlenecks.length > 0) {
      recommendations.push(`Address performance issues in ${bottlenecks.length} agents: ${bottlenecks.join(', ')}`)
    }
    
    const lowCollaboration = agents.filter(a => a.collaborationScore < 0.5)
    if (lowCollaboration.length > 0) {
      recommendations.push(`Improve collaboration protocols for agents with low synergy scores`)
    }
    
    const highConflict = agents.filter(a => a.conflictRate > 0.4)
    if (highConflict.length > 0) {
      recommendations.push(`Implement conflict resolution mechanisms for high-conflict agents`)
    }
    
    return recommendations
  }

  private async getAgentPerformance(agentId: string): Promise<AgentPerformance> {
    return {
      averageResponseTime: Math.random() * 5000 + 1000,
      successRate: Math.random() * 0.3 + 0.7,
      resourceUtilization: Math.random() * 0.4 + 0.6,
      qualityScore: Math.random() * 0.3 + 0.7,
      learningRate: Math.random() * 0.2 + 0.8
    }
  }

  private async getCollaborationData(agentId: string): Promise<any> {
    return {
      partners: ['agent-1', 'agent-2', 'agent-3'],
      score: Math.random() * 0.4 + 0.6,
      conflictRate: Math.random() * 0.2
    }
  }

  private async getAgentType(agentId: string): Promise<'content' | 'security' | 'optimization' | 'analysis'> {
    const types = ['content', 'security', 'optimization', 'analysis'] as const
    return types[Math.floor(Math.random() * types.length)]
  }

  async runSynergyAnalysis(query: AnalyticsQuery): Promise<AnalyticsResult> {
    const mockData = [
      { agentId: 'agent-1', synergyScore: 0.85, type: 'content' },
      { agentId: 'agent-2', synergyScore: 0.72, type: 'security' },
      { agentId: 'agent-3', synergyScore: 0.91, type: 'optimization' }
    ]

    return {
      query,
      data: mockData,
      insights: [
        {
          type: 'opportunity',
          severity: 'medium',
          description: 'High synergy potential between content and optimization agents',
          evidence: mockData,
          confidence: 0.78
        }
      ],
      recommendations: [
        {
          type: 'optimization',
          priority: 'medium',
          action: 'Increase collaboration frequency between high-synergy agent pairs',
          expectedImpact: 0.25,
          effort: 'low',
          timeline: '1-2 weeks'
        }
      ],
      confidence: 0.78,
      generatedAt: new Date().toISOString()
    }
  }
}

export const agentSynergyAnalyzer = new AgentSynergyAnalyzer()
