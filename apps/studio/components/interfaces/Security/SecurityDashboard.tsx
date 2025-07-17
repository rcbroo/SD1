import { useState, useEffect } from 'react'
import { Card, Button, Badge, Progress, Tabs_Shadcn_, TabsList_Shadcn_, TabsTrigger_Shadcn_, TabsContent_Shadcn_ } from 'ui'
import { Shield, AlertTriangle, CheckCircle, Clock, Users, Lock, Eye, FileText } from 'lucide-react'
import { securityScanner } from 'lib/security/scanner'
import { complianceManager } from 'lib/security/compliance'
import { accessControlManager } from 'lib/security/access-control'
import { SecurityScan, SecurityMetrics, ComplianceFramework, SecurityAlert } from 'lib/security/types'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'

const SecurityDashboard = () => {
  const { project } = useProjectContext()
  const [activeTab, setActiveTab] = useState('overview')
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [recentScans, setRecentScans] = useState<SecurityScan[]>([])
  const [complianceStatus, setComplianceStatus] = useState<ComplianceFramework[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (project?.ref) {
      loadSecurityData()
    }
  }, [project?.ref])

  const loadSecurityData = async () => {
    setLoading(true)
    try {
      const metrics: SecurityMetrics = {
        vulnerabilities: {
          critical: 2,
          high: 5,
          medium: 12,
          low: 8
        },
        compliance: {
          score: 78,
          frameworks: {
            'SOC2': 85,
            'GDPR': 72,
            'ISO27001': 76
          }
        },
        incidents: {
          total: 15,
          resolved: 12,
          averageResolutionTime: 4.2
        },
        accessAttempts: {
          successful: 1250,
          failed: 45,
          blocked: 12
        }
      }

      const scans = await Promise.all([
        securityScanner.runVulnerabilityScan(project!.ref),
        securityScanner.runComplianceScan(project!.ref, 'SOC2'),
        securityScanner.runCodeAnalysis(project!.ref)
      ])

      const frameworks = await Promise.all([
        complianceManager.assessCompliance('SOC2', project!.ref),
        complianceManager.assessCompliance('GDPR', project!.ref),
        complianceManager.assessCompliance('ISO27001', project!.ref)
      ])

      const alerts: SecurityAlert[] = [
        {
          id: 'alert-1',
          type: 'intrusion',
          severity: 'high',
          title: 'Suspicious Login Activity',
          description: 'Multiple failed login attempts from unknown IP address',
          source: 'authentication-system',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'open',
          metadata: { ipAddress: '203.0.113.1', attempts: 5 }
        },
        {
          id: 'alert-2',
          type: 'anomaly',
          severity: 'medium',
          title: 'Unusual Data Access Pattern',
          description: 'User accessed large volume of sensitive data outside normal hours',
          source: 'access-control',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'investigating',
          assignee: 'security-team',
          metadata: { userId: 'user-123', recordsAccessed: 500 }
        },
        {
          id: 'alert-3',
          type: 'policy-violation',
          severity: 'low',
          title: 'Password Policy Violation',
          description: 'User attempted to set weak password',
          source: 'password-policy',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          status: 'resolved',
          metadata: { userId: 'user-456', policyViolated: 'minimum-complexity' }
        }
      ]

      setSecurityMetrics(metrics)
      setRecentScans(scans)
      setComplianceStatus(frameworks)
      setSecurityAlerts(alerts)
    } catch (error) {
      console.error('Failed to load security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'warning'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'success'
    if (score >= 70) return 'warning'
    return 'destructive'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success'
      case 'partial': return 'warning'
      case 'non-compliant': return 'destructive'
      default: return 'outline'
    }
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
          <h1 className="text-2xl font-bold text-foreground">Security & Compliance</h1>
          <p className="text-foreground-light">
            Enterprise-grade security monitoring and compliance management
          </p>
        </div>
        <Button onClick={loadSecurityData} loading={loading}>
          Refresh Security Data
        </Button>
      </div>

      <Tabs_Shadcn_ value={activeTab} onValueChange={setActiveTab}>
        <TabsList_Shadcn_ className="grid w-full grid-cols-5">
          <TabsTrigger_Shadcn_ value="overview" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Overview
          </TabsTrigger_Shadcn_>
          <TabsTrigger_Shadcn_ value="vulnerabilities" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Vulnerabilities
          </TabsTrigger_Shadcn_>
          <TabsTrigger_Shadcn_ value="compliance" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Compliance
          </TabsTrigger_Shadcn_>
          <TabsTrigger_Shadcn_ value="access" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Access Control
          </TabsTrigger_Shadcn_>
          <TabsTrigger_Shadcn_ value="alerts" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Security Alerts
          </TabsTrigger_Shadcn_>
        </TabsList_Shadcn_>

        <TabsContent_Shadcn_ value="overview">
          {securityMetrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground-light">Critical Vulnerabilities</p>
                      <p className="text-2xl font-bold text-destructive">
                        {securityMetrics.vulnerabilities.critical}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground-light">Compliance Score</p>
                      <p className="text-2xl font-bold text-brand-600">
                        {securityMetrics.compliance.score}%
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-brand-600" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground-light">Open Incidents</p>
                      <p className="text-2xl font-bold text-warning">
                        {securityMetrics.incidents.total - securityMetrics.incidents.resolved}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-warning" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground-light">Failed Access Attempts</p>
                      <p className="text-2xl font-bold text-foreground">
                        {securityMetrics.accessAttempts.failed}
                      </p>
                    </div>
                    <Lock className="w-8 h-8 text-foreground" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Vulnerability Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-surface-200 rounded-full h-2">
                          <div 
                            className="bg-destructive h-2 rounded-full" 
                            style={{ width: `${(securityMetrics.vulnerabilities.critical / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{securityMetrics.vulnerabilities.critical}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-surface-200 rounded-full h-2">
                          <div 
                            className="bg-warning h-2 rounded-full" 
                            style={{ width: `${(securityMetrics.vulnerabilities.high / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{securityMetrics.vulnerabilities.high}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-surface-200 rounded-full h-2">
                          <div 
                            className="bg-secondary h-2 rounded-full" 
                            style={{ width: `${(securityMetrics.vulnerabilities.medium / 30) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{securityMetrics.vulnerabilities.medium}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-surface-200 rounded-full h-2">
                          <div 
                            className="bg-success h-2 rounded-full" 
                            style={{ width: `${(securityMetrics.vulnerabilities.low / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{securityMetrics.vulnerabilities.low}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                  <div className="space-y-3">
                    {Object.entries(securityMetrics.compliance.frameworks).map(([framework, score]) => (
                      <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{framework}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={score} className="w-24" />
                          <Badge variant={getComplianceColor(score)}>
                            {score}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </TabsContent_Shadcn_>

        <TabsContent_Shadcn_ value="vulnerabilities">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Security Scans</h3>
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div key={scan.id} className="border border-overlay rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getSeverityColor(scan.severity)}>
                        {scan.type}
                      </Badge>
                      <h4 className="font-medium">{scan.id}</h4>
                    </div>
                    <Badge variant={scan.status === 'completed' ? 'success' : scan.status === 'failed' ? 'destructive' : 'secondary'}>
                      {scan.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-foreground-light">Started</p>
                      <p className="font-medium">{new Date(scan.startedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Completed</p>
                      <p className="font-medium">
                        {scan.completedAt ? new Date(scan.completedAt).toLocaleString() : 'Running...'}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Findings</p>
                      <p className="font-medium">{scan.findings.length}</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Severity</p>
                      <Badge variant={getSeverityColor(scan.severity)} className="text-xs">
                        {scan.severity}
                      </Badge>
                    </div>
                  </div>

                  {scan.findings.length > 0 && (
                    <div>
                      <p className="text-sm text-foreground-light mb-2">Top Findings:</p>
                      <div className="space-y-2">
                        {scan.findings.slice(0, 3).map((finding) => (
                          <div key={finding.id} className="flex items-center justify-between text-sm">
                            <span className="flex-1">{finding.title}</span>
                            <Badge variant={getSeverityColor(finding.severity)} className="text-xs">
                              {finding.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent_Shadcn_>

        <TabsContent_Shadcn_ value="compliance">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Compliance Frameworks</h3>
            <div className="space-y-4">
              {complianceStatus.map((framework) => (
                <div key={framework.name} className="border border-overlay rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{framework.name} v{framework.version}</h4>
                    <Badge variant={getStatusColor(framework.status)}>
                      {framework.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-foreground-light">Requirements</p>
                      <p className="font-medium">{framework.requirements.length}</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Last Audit</p>
                      <p className="font-medium">{new Date(framework.lastAudit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Status</p>
                      <p className="font-medium capitalize">{framework.status.replace('-', ' ')}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-foreground-light mb-2">Key Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {framework.requirements.slice(0, 4).map((requirement, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {requirement}
                        </Badge>
                      ))}
                      {framework.requirements.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{framework.requirements.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent_Shadcn_>

        <TabsContent_Shadcn_ value="access">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Access Control Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 border border-overlay rounded">
                <p className="text-2xl font-bold text-foreground">1,250</p>
                <p className="text-sm text-foreground-light">Successful Logins</p>
              </div>
              <div className="text-center p-4 border border-overlay rounded">
                <p className="text-2xl font-bold text-warning">45</p>
                <p className="text-sm text-foreground-light">Failed Attempts</p>
              </div>
              <div className="text-center p-4 border border-overlay rounded">
                <p className="text-2xl font-bold text-destructive">12</p>
                <p className="text-sm text-foreground-light">Blocked IPs</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Default Roles</h4>
              {accessControlManager.getDefaultRoles().map((role) => (
                <div key={role.name} className="border border-overlay rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium capitalize">{role.name}</h5>
                    <Badge variant="outline">{role.permissions.length} permissions</Badge>
                  </div>
                  <p className="text-sm text-foreground-light mb-2">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 5).map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                    {role.permissions.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{role.permissions.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent_Shadcn_>

        <TabsContent_Shadcn_ value="alerts">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security Alerts</h3>
            <div className="space-y-4">
              {securityAlerts.map((alert) => (
                <div key={alert.id} className="border border-overlay rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <h4 className="font-medium">{alert.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.status === 'resolved' ? 'success' : alert.status === 'investigating' ? 'warning' : 'destructive'}>
                        {alert.status}
                      </Badge>
                      <Badge variant="outline">{alert.type}</Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground-light mb-3">{alert.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-foreground-light">Source</p>
                      <p className="font-medium">{alert.source}</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Timestamp</p>
                      <p className="font-medium">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Type</p>
                      <p className="font-medium capitalize">{alert.type.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-foreground-light">Assignee</p>
                      <p className="font-medium">{alert.assignee || 'Unassigned'}</p>
                    </div>
                  </div>

                  {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-foreground-light mb-2">Additional Details:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(alert.metadata).slice(0, 3).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent_Shadcn_>
      </Tabs_Shadcn_>
    </div>
  )
}

export default SecurityDashboard
