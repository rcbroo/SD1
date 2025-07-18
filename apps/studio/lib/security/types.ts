export interface SecurityPolicy {
  id: string
  name: string
  description: string
  category: 'authentication' | 'authorization' | 'encryption' | 'audit' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  rules: SecurityRule[]
  compliance: ComplianceFramework[]
  lastUpdated: string
}

export interface SecurityRule {
  id: string
  type: 'firewall' | 'access-control' | 'data-protection' | 'monitoring'
  condition: string
  action: 'allow' | 'deny' | 'log' | 'alert'
  priority: number
  metadata: Record<string, any>
}

export interface ComplianceFramework {
  name: 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI-DSS' | 'ISO27001'
  version: string
  requirements: string[]
  status: 'compliant' | 'partial' | 'non-compliant'
  lastAudit: string
}

export interface SecurityScan {
  id: string
  type: 'vulnerability' | 'penetration' | 'compliance' | 'code-analysis'
  status: 'running' | 'completed' | 'failed'
  severity: 'low' | 'medium' | 'high' | 'critical'
  findings: SecurityFinding[]
  startedAt: string
  completedAt?: string
  metadata: Record<string, any>
}

export interface SecurityFinding {
  id: string
  type: 'vulnerability' | 'misconfiguration' | 'policy-violation' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  location: string
  remediation: string
  cve?: string
  cvss?: number
  status: 'open' | 'acknowledged' | 'resolved' | 'false-positive'
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
  resource: string
  outcome: 'success' | 'failure'
  ipAddress: string
  userAgent: string
  metadata: Record<string, any>
}

export interface AccessControl {
  id: string
  principalType: 'user' | 'role' | 'service'
  principalId: string
  resource: string
  permissions: Permission[]
  conditions?: AccessCondition[]
  expiresAt?: string
}

export interface Permission {
  action: string
  effect: 'allow' | 'deny'
  conditions?: string[]
}

export interface AccessCondition {
  type: 'time' | 'location' | 'device' | 'mfa'
  operator: 'equals' | 'contains' | 'in' | 'between'
  value: any
}

export interface EncryptionConfig {
  id: string
  name: string
  algorithm: 'AES-256' | 'RSA-2048' | 'RSA-4096' | 'ChaCha20-Poly1305'
  keySize: number
  mode: 'GCM' | 'CBC' | 'CTR'
  keyRotationInterval: number
  status: 'active' | 'deprecated' | 'revoked'
  createdAt: string
}

export interface SecurityMetrics {
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  compliance: {
    score: number
    frameworks: Record<string, number>
  }
  incidents: {
    total: number
    resolved: number
    averageResolutionTime: number
  }
  accessAttempts: {
    successful: number
    failed: number
    blocked: number
  }
}

export interface SecurityAlert {
  id: string
  type: 'intrusion' | 'anomaly' | 'policy-violation' | 'system-failure'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  source: string
  timestamp: string
  status: 'open' | 'investigating' | 'resolved'
  assignee?: string
  metadata: Record<string, any>
}
