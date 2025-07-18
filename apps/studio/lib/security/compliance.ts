import { ComplianceFramework, SecurityPolicy, AuditLog } from './types'

export class ComplianceManager {
  private readonly FRAMEWORKS = {
    'SOC2': {
      name: 'SOC 2 Type II',
      version: '2017',
      categories: ['Security', 'Availability', 'Processing Integrity', 'Confidentiality', 'Privacy'],
      requirements: [
        'Access controls and user authentication',
        'System monitoring and incident response',
        'Data encryption at rest and in transit',
        'Vendor management and due diligence',
        'Business continuity and disaster recovery',
        'Change management procedures',
        'Risk assessment and management',
        'Security awareness training'
      ]
    },
    'GDPR': {
      name: 'General Data Protection Regulation',
      version: '2018',
      categories: ['Data Protection', 'Privacy Rights', 'Consent Management', 'Data Processing'],
      requirements: [
        'Lawful basis for data processing',
        'Data subject consent mechanisms',
        'Right to access personal data',
        'Right to rectification and erasure',
        'Data portability capabilities',
        'Privacy by design implementation',
        'Data protection impact assessments',
        'Breach notification procedures'
      ]
    },
    'HIPAA': {
      name: 'Health Insurance Portability and Accountability Act',
      version: '2013',
      categories: ['Administrative', 'Physical', 'Technical'],
      requirements: [
        'Administrative safeguards',
        'Physical safeguards',
        'Technical safeguards',
        'Access control procedures',
        'Audit controls and logging',
        'Integrity controls',
        'Person or entity authentication',
        'Transmission security'
      ]
    },
    'PCI-DSS': {
      name: 'Payment Card Industry Data Security Standard',
      version: '4.0',
      categories: ['Network Security', 'Data Protection', 'Vulnerability Management', 'Access Control'],
      requirements: [
        'Install and maintain network security controls',
        'Apply secure configurations to all system components',
        'Protect stored cardholder data',
        'Protect cardholder data with strong cryptography during transmission',
        'Protect all systems and networks from malicious software',
        'Develop and maintain secure systems and software',
        'Restrict access to cardholder data by business need to know',
        'Identify users and authenticate access to system components'
      ]
    },
    'ISO27001': {
      name: 'ISO/IEC 27001:2022',
      version: '2022',
      categories: ['Information Security Management', 'Risk Management', 'Controls'],
      requirements: [
        'Information security management system',
        'Leadership and commitment',
        'Risk assessment and treatment',
        'Security controls implementation',
        'Monitoring and measurement',
        'Internal audit program',
        'Management review process',
        'Continual improvement'
      ]
    }
  }

  async assessCompliance(framework: string, projectId: string): Promise<ComplianceFramework> {
    const frameworkInfo = this.FRAMEWORKS[framework as keyof typeof this.FRAMEWORKS]
    
    if (!frameworkInfo) {
      throw new Error(`Unsupported compliance framework: ${framework}`)
    }

    const requirements = frameworkInfo.requirements
    const assessmentResults = await this.performComplianceAssessment(framework, requirements, projectId)
    
    const compliantCount = assessmentResults.filter(r => r.compliant).length
    const totalCount = requirements.length
    const compliancePercentage = (compliantCount / totalCount) * 100

    let status: 'compliant' | 'partial' | 'non-compliant'
    if (compliancePercentage >= 95) status = 'compliant'
    else if (compliancePercentage >= 70) status = 'partial'
    else status = 'non-compliant'

    return {
      name: framework as any,
      version: frameworkInfo.version,
      requirements,
      status,
      lastAudit: new Date().toISOString()
    }
  }

  private async performComplianceAssessment(
    framework: string, 
    requirements: string[], 
    projectId: string
  ): Promise<Array<{ requirement: string; compliant: boolean; evidence: string[] }>> {
    return requirements.map(requirement => ({
      requirement,
      compliant: Math.random() > 0.3, // 70% compliance rate
      evidence: [
        `Policy document: ${requirement.toLowerCase().replace(/\s+/g, '-')}-policy.pdf`,
        `Implementation evidence: ${requirement.toLowerCase().replace(/\s+/g, '-')}-implementation.log`,
        `Audit trail: ${requirement.toLowerCase().replace(/\s+/g, '-')}-audit.json`
      ]
    }))
  }

  async generateComplianceReport(framework: string, projectId: string): Promise<{
    framework: ComplianceFramework
    summary: {
      totalRequirements: number
      compliantRequirements: number
      partialRequirements: number
      nonCompliantRequirements: number
      overallScore: number
    }
    recommendations: Array<{
      requirement: string
      priority: 'high' | 'medium' | 'low'
      action: string
      timeline: string
    }>
    evidence: Array<{
      requirement: string
      documents: string[]
      lastVerified: string
    }>
  }> {
    const complianceFramework = await this.assessCompliance(framework, projectId)
    const assessmentResults = await this.performComplianceAssessment(
      framework, 
      complianceFramework.requirements, 
      projectId
    )

    const compliantCount = assessmentResults.filter(r => r.compliant).length
    const nonCompliantCount = assessmentResults.filter(r => !r.compliant).length
    const overallScore = (compliantCount / assessmentResults.length) * 100

    const recommendations = assessmentResults
      .filter(r => !r.compliant)
      .map(r => ({
        requirement: r.requirement,
        priority: this.getPriority(r.requirement, framework),
        action: this.getRecommendedAction(r.requirement, framework),
        timeline: this.getTimeline(r.requirement, framework)
      }))

    const evidence = assessmentResults.map(r => ({
      requirement: r.requirement,
      documents: r.evidence,
      lastVerified: new Date().toISOString()
    }))

    return {
      framework: complianceFramework,
      summary: {
        totalRequirements: assessmentResults.length,
        compliantRequirements: compliantCount,
        partialRequirements: 0, // Simplified for mock
        nonCompliantRequirements: nonCompliantCount,
        overallScore
      },
      recommendations,
      evidence
    }
  }

  private getPriority(requirement: string, framework: string): 'high' | 'medium' | 'low' {
    const highPriorityKeywords = ['encryption', 'access control', 'authentication', 'breach', 'security']
    const mediumPriorityKeywords = ['monitoring', 'audit', 'training', 'procedures']
    
    const reqLower = requirement.toLowerCase()
    
    if (highPriorityKeywords.some(keyword => reqLower.includes(keyword))) return 'high'
    if (mediumPriorityKeywords.some(keyword => reqLower.includes(keyword))) return 'medium'
    return 'low'
  }

  private getRecommendedAction(requirement: string, framework: string): string {
    const actions = {
      'access control': 'Implement role-based access control (RBAC) with principle of least privilege',
      'encryption': 'Deploy AES-256 encryption for data at rest and TLS 1.3 for data in transit',
      'authentication': 'Enable multi-factor authentication (MFA) for all user accounts',
      'monitoring': 'Set up comprehensive logging and real-time security monitoring',
      'audit': 'Establish regular audit procedures and maintain audit trails',
      'training': 'Conduct security awareness training for all personnel',
      'breach': 'Develop incident response plan and breach notification procedures',
      'backup': 'Implement automated backup and disaster recovery procedures'
    }

    const reqLower = requirement.toLowerCase()
    for (const [keyword, action] of Object.entries(actions)) {
      if (reqLower.includes(keyword)) return action
    }

    return `Implement controls to address: ${requirement}`
  }

  private getTimeline(requirement: string, framework: string): string {
    const reqLower = requirement.toLowerCase()
    
    if (reqLower.includes('encryption') || reqLower.includes('access control')) return '2-4 weeks'
    if (reqLower.includes('monitoring') || reqLower.includes('audit')) return '4-6 weeks'
    if (reqLower.includes('training') || reqLower.includes('procedures')) return '6-8 weeks'
    
    return '4-6 weeks'
  }

  async createAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const auditLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry
    }

    console.log('Audit log created:', auditLog)
    
    return auditLog
  }

  async getAuditLogs(
    projectId: string, 
    filters?: {
      userId?: string
      action?: string
      resource?: string
      outcome?: 'success' | 'failure'
      startDate?: string
      endDate?: string
    }
  ): Promise<AuditLog[]> {
    const mockLogs: AuditLog[] = [
      {
        id: 'audit-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 'user-123',
        action: 'login',
        resource: 'authentication',
        outcome: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { mfaUsed: true }
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        userId: 'user-456',
        action: 'data_access',
        resource: 'customer_data',
        outcome: 'success',
        ipAddress: '10.0.1.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        metadata: { recordsAccessed: 25 }
      },
      {
        id: 'audit-3',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        userId: 'user-789',
        action: 'login',
        resource: 'authentication',
        outcome: 'failure',
        ipAddress: '203.0.113.1',
        userAgent: 'curl/7.68.0',
        metadata: { reason: 'invalid_credentials', attempts: 3 }
      }
    ]

    let filteredLogs = mockLogs

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
    }
    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action)
    }
    if (filters?.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filters.resource)
    }
    if (filters?.outcome) {
      filteredLogs = filteredLogs.filter(log => log.outcome === filters.outcome)
    }

    return filteredLogs
  }

  getAvailableFrameworks(): Array<{ id: string; name: string; version: string; description: string }> {
    return Object.entries(this.FRAMEWORKS).map(([id, info]) => ({
      id,
      name: info.name,
      version: info.version,
      description: `${info.name} compliance framework with ${info.requirements.length} requirements`
    }))
  }
}

export const complianceManager = new ComplianceManager()
