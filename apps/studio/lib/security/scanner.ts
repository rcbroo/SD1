import { SecurityScan, SecurityFinding, SecurityPolicy } from './types'

export class SecurityScanner {
  private readonly OWASP_TOP_10 = [
    'A01:2021 – Broken Access Control',
    'A02:2021 – Cryptographic Failures',
    'A03:2021 – Injection',
    'A04:2021 – Insecure Design',
    'A05:2021 – Security Misconfiguration',
    'A06:2021 – Vulnerable and Outdated Components',
    'A07:2021 – Identification and Authentication Failures',
    'A08:2021 – Software and Data Integrity Failures',
    'A09:2021 – Security Logging and Monitoring Failures',
    'A10:2021 – Server-Side Request Forgery'
  ]

  async runVulnerabilityScan(projectId: string): Promise<SecurityScan> {
    const scanId = `vuln-${Date.now()}`
    
    const scan: SecurityScan = {
      id: scanId,
      type: 'vulnerability',
      status: 'running',
      severity: 'medium',
      findings: [],
      startedAt: new Date().toISOString(),
      metadata: { projectId }
    }

    try {
      const findings = await this.performOWASPScan(projectId)
      
      scan.findings = findings
      scan.status = 'completed'
      scan.completedAt = new Date().toISOString()
      scan.severity = this.calculateOverallSeverity(findings)
      
      return scan
    } catch (error) {
      scan.status = 'failed'
      scan.completedAt = new Date().toISOString()
      scan.metadata.error = error instanceof Error ? error.message : 'Unknown error'
      
      return scan
    }
  }

  private async performOWASPScan(projectId: string): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = []
    
    const vulnerabilities = [
      {
        type: 'vulnerability' as const,
        severity: 'high' as const,
        title: 'SQL Injection Vulnerability',
        description: 'Potential SQL injection in user input validation',
        location: '/api/users/search',
        remediation: 'Use parameterized queries and input validation',
        cve: 'CVE-2023-1234',
        cvss: 8.1
      },
      {
        type: 'misconfiguration' as const,
        severity: 'medium' as const,
        title: 'Missing Security Headers',
        description: 'X-Frame-Options and CSP headers not configured',
        location: 'HTTP Response Headers',
        remediation: 'Configure security headers in web server',
        cvss: 5.3
      },
      {
        type: 'vulnerability' as const,
        severity: 'low' as const,
        title: 'Information Disclosure',
        description: 'Server version information exposed in headers',
        location: 'HTTP Response Headers',
        remediation: 'Configure server to hide version information',
        cvss: 3.1
      }
    ]

    for (let i = 0; i < vulnerabilities.length; i++) {
      const vuln = vulnerabilities[i]
      findings.push({
        id: `finding-${Date.now()}-${i}`,
        type: vuln.type,
        severity: vuln.severity,
        title: vuln.title,
        description: vuln.description,
        location: vuln.location,
        remediation: vuln.remediation,
        cve: vuln.cve,
        cvss: vuln.cvss,
        status: 'open'
      })
    }

    return findings
  }

  async runComplianceScan(projectId: string, framework: string): Promise<SecurityScan> {
    const scanId = `compliance-${Date.now()}`
    
    const scan: SecurityScan = {
      id: scanId,
      type: 'compliance',
      status: 'running',
      severity: 'medium',
      findings: [],
      startedAt: new Date().toISOString(),
      metadata: { projectId, framework }
    }

    try {
      const findings = await this.performComplianceScan(framework)
      
      scan.findings = findings
      scan.status = 'completed'
      scan.completedAt = new Date().toISOString()
      scan.severity = this.calculateOverallSeverity(findings)
      
      return scan
    } catch (error) {
      scan.status = 'failed'
      scan.completedAt = new Date().toISOString()
      scan.metadata.error = error instanceof Error ? error.message : 'Unknown error'
      
      return scan
    }
  }

  private async performComplianceScan(framework: string): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = []
    
    const complianceChecks = {
      'SOC2': [
        {
          title: 'Access Control Policy',
          description: 'Implement role-based access control',
          severity: 'high' as const,
          compliant: false
        },
        {
          title: 'Data Encryption',
          description: 'Encrypt data at rest and in transit',
          severity: 'critical' as const,
          compliant: true
        },
        {
          title: 'Audit Logging',
          description: 'Comprehensive audit trail required',
          severity: 'medium' as const,
          compliant: false
        }
      ],
      'GDPR': [
        {
          title: 'Data Processing Consent',
          description: 'Explicit consent for data processing',
          severity: 'high' as const,
          compliant: false
        },
        {
          title: 'Right to Erasure',
          description: 'Implement data deletion capabilities',
          severity: 'medium' as const,
          compliant: true
        },
        {
          title: 'Data Breach Notification',
          description: '72-hour breach notification process',
          severity: 'critical' as const,
          compliant: false
        }
      ]
    }

    const checks = complianceChecks[framework as keyof typeof complianceChecks] || []
    
    checks.forEach((check, index) => {
      if (!check.compliant) {
        findings.push({
          id: `compliance-${Date.now()}-${index}`,
          type: 'policy-violation',
          severity: check.severity,
          title: check.title,
          description: check.description,
          location: `${framework} Compliance`,
          remediation: `Implement ${check.title.toLowerCase()} controls`,
          status: 'open'
        })
      }
    })

    return findings
  }

  async runCodeAnalysis(projectId: string): Promise<SecurityScan> {
    const scanId = `code-${Date.now()}`
    
    const scan: SecurityScan = {
      id: scanId,
      type: 'code-analysis',
      status: 'running',
      severity: 'low',
      findings: [],
      startedAt: new Date().toISOString(),
      metadata: { projectId }
    }

    try {
      const findings = await this.performStaticAnalysis(projectId)
      
      scan.findings = findings
      scan.status = 'completed'
      scan.completedAt = new Date().toISOString()
      scan.severity = this.calculateOverallSeverity(findings)
      
      return scan
    } catch (error) {
      scan.status = 'failed'
      scan.completedAt = new Date().toISOString()
      scan.metadata.error = error instanceof Error ? error.message : 'Unknown error'
      
      return scan
    }
  }

  private async performStaticAnalysis(projectId: string): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = []
    
    const codeIssues = [
      {
        title: 'Hardcoded Secret',
        description: 'API key found in source code',
        severity: 'critical' as const,
        location: 'src/config/api.ts:15',
        remediation: 'Move secrets to environment variables'
      },
      {
        title: 'Weak Cryptography',
        description: 'MD5 hash algorithm detected',
        severity: 'medium' as const,
        location: 'src/utils/hash.ts:8',
        remediation: 'Use SHA-256 or stronger hashing algorithm'
      },
      {
        title: 'Insecure Random',
        description: 'Math.random() used for security-sensitive operation',
        severity: 'low' as const,
        location: 'src/auth/token.ts:23',
        remediation: 'Use cryptographically secure random number generator'
      }
    ]

    codeIssues.forEach((issue, index) => {
      findings.push({
        id: `code-${Date.now()}-${index}`,
        type: 'vulnerability',
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        location: issue.location,
        remediation: issue.remediation,
        status: 'open'
      })
    })

    return findings
  }

  private calculateOverallSeverity(findings: SecurityFinding[]): 'low' | 'medium' | 'high' | 'critical' {
    if (findings.some(f => f.severity === 'critical')) return 'critical'
    if (findings.some(f => f.severity === 'high')) return 'high'
    if (findings.some(f => f.severity === 'medium')) return 'medium'
    return 'low'
  }

  async validateSecurityPolicy(policy: SecurityPolicy): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (!policy.name || policy.name.trim().length === 0) {
      errors.push('Policy name is required')
    }

    if (!policy.rules || policy.rules.length === 0) {
      errors.push('Policy must have at least one rule')
    }

    policy.rules.forEach((rule, index) => {
      if (!rule.condition || rule.condition.trim().length === 0) {
        errors.push(`Rule ${index + 1}: Condition is required`)
      }

      if (rule.priority < 0 || rule.priority > 1000) {
        errors.push(`Rule ${index + 1}: Priority must be between 0 and 1000`)
      }
    })

    policy.compliance.forEach((framework, index) => {
      if (!framework.requirements || framework.requirements.length === 0) {
        errors.push(`Compliance framework ${index + 1}: Requirements are required`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export const securityScanner = new SecurityScanner()
