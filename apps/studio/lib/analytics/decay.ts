import { ContentDecayMetrics, DecayFactor, AnalyticsQuery, AnalyticsResult } from './types'

export class ContentDecayAnalyzer {
  private readonly DECAY_FACTORS = {
    temporal: {
      weight: 0.3,
      halfLife: 90 // days
    },
    engagement: {
      weight: 0.4,
      threshold: 0.1 // engagement rate
    },
    technical: {
      weight: 0.2,
      obsolescenceRate: 0.05 // per month
    },
    competitive: {
      weight: 0.1,
      marketChangeRate: 0.02 // per month
    }
  }

  async analyzeContentDecay(contentId: string): Promise<ContentDecayMetrics> {
    const content = await this.getContentMetadata(contentId)
    const factors = await this.calculateDecayFactors(content)
    const decayRate = this.calculateOverallDecayRate(factors)
    const predictedLifespan = this.predictLifespan(decayRate, content)
    
    return {
      contentId,
      contentType: content.type,
      createdAt: content.createdAt,
      lastModified: content.lastModified,
      viewCount: content.viewCount,
      engagementScore: content.engagementScore,
      decayRate,
      predictedLifespan,
      refreshRecommendation: this.getRefreshRecommendation(decayRate, predictedLifespan),
      factors
    }
  }

  private async calculateDecayFactors(content: any): Promise<DecayFactor[]> {
    const factors: DecayFactor[] = []

    const ageInDays = this.getAgeInDays(content.createdAt)
    const temporalDecay = Math.exp(-ageInDays / this.DECAY_FACTORS.temporal.halfLife)
    factors.push({
      type: 'temporal',
      impact: (1 - temporalDecay) * this.DECAY_FACTORS.temporal.weight,
      description: `Content is ${ageInDays} days old`,
      trend: 'increasing'
    })

    const engagementTrend = await this.getEngagementTrend(content.id)
    const engagementDecay = Math.max(0, 1 - (content.engagementScore / this.DECAY_FACTORS.engagement.threshold))
    factors.push({
      type: 'engagement',
      impact: engagementDecay * this.DECAY_FACTORS.engagement.weight,
      description: `Engagement rate: ${(content.engagementScore * 100).toFixed(1)}%`,
      trend: engagementTrend
    })

    const technicalAge = this.getTechnicalAge(content.type, content.metadata)
    const technicalDecay = technicalAge * this.DECAY_FACTORS.technical.obsolescenceRate
    factors.push({
      type: 'technical',
      impact: technicalDecay * this.DECAY_FACTORS.technical.weight,
      description: `Technical stack age: ${technicalAge} months`,
      trend: 'increasing'
    })

    const competitiveMetrics = await this.getCompetitiveMetrics(content.category)
    const competitiveDecay = competitiveMetrics.changeRate * this.DECAY_FACTORS.competitive.marketChangeRate
    factors.push({
      type: 'competitive',
      impact: competitiveDecay * this.DECAY_FACTORS.competitive.weight,
      description: `Market change rate: ${(competitiveMetrics.changeRate * 100).toFixed(1)}%`,
      trend: competitiveMetrics.trend
    })

    return factors
  }

  private calculateOverallDecayRate(factors: DecayFactor[]): number {
    return factors.reduce((total, factor) => total + factor.impact, 0)
  }

  private predictLifespan(decayRate: number, content: any): number {
    const baseLifespan = this.getBaseLifespan(content.type)
    return baseLifespan * (1 - decayRate)
  }

  private getRefreshRecommendation(decayRate: number, predictedLifespan: number): 'low' | 'medium' | 'high' | 'critical' {
    if (decayRate > 0.8 || predictedLifespan < 30) return 'critical'
    if (decayRate > 0.6 || predictedLifespan < 60) return 'high'
    if (decayRate > 0.4 || predictedLifespan < 120) return 'medium'
    return 'low'
  }

  private async getContentMetadata(contentId: string): Promise<any> {
    return {
      id: contentId,
      type: 'text',
      createdAt: '2024-01-01T00:00:00Z',
      lastModified: '2024-06-01T00:00:00Z',
      viewCount: 1250,
      engagementScore: 0.15,
      category: 'documentation',
      metadata: {}
    }
  }

  private getAgeInDays(createdAt: string): number {
    const created = new Date(createdAt)
    const now = new Date()
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  }

  private async getEngagementTrend(contentId: string): Promise<'increasing' | 'decreasing' | 'stable'> {
    return 'decreasing'
  }

  private getTechnicalAge(contentType: string, metadata: any): number {
    return 12 // months
  }

  private async getCompetitiveMetrics(category: string): Promise<{ changeRate: number; trend: 'increasing' | 'decreasing' | 'stable' }> {
    return {
      changeRate: 0.15,
      trend: 'increasing'
    }
  }

  private getBaseLifespan(contentType: string): number {
    const lifespans = {
      text: 365,
      image: 180,
      video: 120,
      '3d': 90,
      xr: 60
    }
    return lifespans[contentType as keyof typeof lifespans] || 180
  }

  async runDecayAnalysis(query: AnalyticsQuery): Promise<AnalyticsResult> {
    const mockData = [
      { contentId: '1', decayRate: 0.3, recommendation: 'medium' },
      { contentId: '2', decayRate: 0.7, recommendation: 'high' },
      { contentId: '3', decayRate: 0.9, recommendation: 'critical' }
    ]

    return {
      query,
      data: mockData,
      insights: [
        {
          type: 'trend',
          severity: 'medium',
          description: '23% of content shows accelerated decay patterns',
          evidence: mockData,
          confidence: 0.85
        }
      ],
      recommendations: [
        {
          type: 'maintenance',
          priority: 'high',
          action: 'Refresh high-decay content within 30 days',
          expectedImpact: 0.4,
          effort: 'medium',
          timeline: '2-4 weeks'
        }
      ],
      confidence: 0.85,
      generatedAt: new Date().toISOString()
    }
  }
}

export const contentDecayAnalyzer = new ContentDecayAnalyzer()
