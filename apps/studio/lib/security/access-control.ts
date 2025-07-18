import { AccessControl, Permission, AccessCondition, SecurityAlert } from './types'

export class AccessControlManager {
  private readonly DEFAULT_PERMISSIONS = {
    'admin': ['*'],
    'editor': ['read', 'write', 'update'],
    'viewer': ['read'],
    'analyst': ['read', 'analyze'],
    'security': ['read', 'audit', 'monitor']
  }

  async createAccessControl(accessControl: Omit<AccessControl, 'id'>): Promise<AccessControl> {
    const control: AccessControl = {
      id: `ac-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...accessControl
    }

    const validation = this.validatePermissions(control.permissions)
    if (!validation.valid) {
      throw new Error(`Invalid permissions: ${validation.errors.join(', ')}`)
    }

    console.log('Access control created:', control)
    
    return control
  }

  async evaluateAccess(
    principalId: string,
    resource: string,
    action: string,
    context?: Record<string, any>
  ): Promise<{
    allowed: boolean
    reason: string
    appliedPolicies: string[]
    conditions: AccessCondition[]
  }> {
    const mockPolicies = await this.getPoliciesForPrincipal(principalId)
    
    let allowed = false
    const appliedPolicies: string[] = []
    const conditions: AccessCondition[] = []
    let reason = 'Access denied by default'

    for (const policy of mockPolicies) {
      if (this.resourceMatches(policy.resource, resource)) {
        const permission = policy.permissions.find(p => 
          p.action === action || p.action === '*'
        )

        if (permission) {
          appliedPolicies.push(policy.id)

          if (permission.effect === 'allow') {
            const conditionsMet = await this.evaluateConditions(
              policy.conditions || [], 
              context || {}
            )

            if (conditionsMet.allMet) {
              allowed = true
              reason = 'Access granted by policy'
              conditions.push(...(policy.conditions || []))
            } else {
              reason = `Conditions not met: ${conditionsMet.failedConditions.join(', ')}`
            }
          } else {
            allowed = false
            reason = 'Access explicitly denied by policy'
            break
          }
        }
      }
    }

    return {
      allowed,
      reason,
      appliedPolicies,
      conditions
    }
  }

  private async getPoliciesForPrincipal(principalId: string): Promise<AccessControl[]> {
    return [
      {
        id: 'policy-1',
        principalType: 'user',
        principalId,
        resource: 'projects/*',
        permissions: [
          { action: 'read', effect: 'allow' },
          { action: 'write', effect: 'allow' }
        ],
        conditions: [
          {
            type: 'time',
            operator: 'between',
            value: ['09:00', '17:00']
          }
        ]
      },
      {
        id: 'policy-2',
        principalType: 'user',
        principalId,
        resource: 'admin/*',
        permissions: [
          { action: '*', effect: 'deny' }
        ]
      }
    ]
  }

  private resourceMatches(policyResource: string, requestedResource: string): boolean {
    if (policyResource === '*') return true
    if (policyResource === requestedResource) return true
    if (policyResource.endsWith('/*')) {
      const prefix = policyResource.slice(0, -2)
      return requestedResource.startsWith(prefix)
    }
    return false
  }

  private async evaluateConditions(
    conditions: AccessCondition[],
    context: Record<string, any>
  ): Promise<{ allMet: boolean; failedConditions: string[] }> {
    const failedConditions: string[] = []

    for (const condition of conditions) {
      const met = await this.evaluateCondition(condition, context)
      if (!met) {
        failedConditions.push(`${condition.type} ${condition.operator} ${condition.value}`)
      }
    }

    return {
      allMet: failedConditions.length === 0,
      failedConditions
    }
  }

  private async evaluateCondition(condition: AccessCondition, context: Record<string, any>): Promise<boolean> {
    const contextValue = context[condition.type]

    switch (condition.operator) {
      case 'equals':
        return contextValue === condition.value

      case 'contains':
        return Array.isArray(contextValue) 
          ? contextValue.includes(condition.value)
          : String(contextValue).includes(String(condition.value))

      case 'in':
        return Array.isArray(condition.value) 
          ? condition.value.includes(contextValue)
          : false

      case 'between':
        if (condition.type === 'time' && Array.isArray(condition.value)) {
          const currentTime = new Date().toTimeString().slice(0, 5)
          const [start, end] = condition.value
          return currentTime >= start && currentTime <= end
        }
        return false

      default:
        return false
    }
  }

  async createRole(
    roleName: string,
    permissions: string[],
    description?: string
  ): Promise<{
    id: string
    name: string
    permissions: string[]
    description?: string
    createdAt: string
  }> {
    const role = {
      id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: roleName,
      permissions,
      description,
      createdAt: new Date().toISOString()
    }

    console.log('Role created:', role)
    
    return role
  }

  async assignRole(principalId: string, roleId: string): Promise<void> {
    console.log(`Assigned role ${roleId} to principal ${principalId}`)
  }

  async detectAnomalousAccess(
    principalId: string,
    resource: string,
    action: string,
    context: Record<string, any>
  ): Promise<SecurityAlert | null> {
    const riskFactors: string[] = []

    const currentHour = new Date().getHours()
    if (currentHour < 6 || currentHour > 22) {
      riskFactors.push('Access outside normal business hours')
    }

    const ipAddress = context.ipAddress
    if (ipAddress && !this.isKnownIP(ipAddress)) {
      riskFactors.push('Access from unknown IP address')
    }

    if (action === 'admin' && !this.hasAdminHistory(principalId)) {
      riskFactors.push('Potential privilege escalation attempt')
    }

    if (context.requestCount && context.requestCount > 100) {
      riskFactors.push('Unusually high request volume')
    }

    if (riskFactors.length > 0) {
      return {
        id: `alert-${Date.now()}`,
        type: 'anomaly',
        severity: riskFactors.length > 2 ? 'high' : 'medium',
        title: 'Anomalous Access Pattern Detected',
        description: `Unusual access pattern detected for user ${principalId}: ${riskFactors.join(', ')}`,
        source: 'access-control-manager',
        timestamp: new Date().toISOString(),
        status: 'open',
        metadata: {
          principalId,
          resource,
          action,
          riskFactors,
          context
        }
      }
    }

    return null
  }

  private isKnownIP(ipAddress: string): boolean {
    const knownRanges = ['192.168.', '10.0.', '172.16.']
    return knownRanges.some(range => ipAddress.startsWith(range))
  }

  private hasAdminHistory(principalId: string): boolean {
    return Math.random() > 0.8 // 20% chance of having admin history
  }

  private validatePermissions(permissions: Permission[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    for (const permission of permissions) {
      if (!permission.action || permission.action.trim().length === 0) {
        errors.push('Permission action cannot be empty')
      }

      if (!['allow', 'deny'].includes(permission.effect)) {
        errors.push(`Invalid permission effect: ${permission.effect}`)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  getDefaultRoles(): Array<{ name: string; permissions: string[]; description: string }> {
    return Object.entries(this.DEFAULT_PERMISSIONS).map(([name, permissions]) => ({
      name,
      permissions,
      description: this.getRoleDescription(name)
    }))
  }

  private getRoleDescription(roleName: string): string {
    const descriptions = {
      'admin': 'Full system access with all administrative privileges',
      'editor': 'Can read, write, and update content and configurations',
      'viewer': 'Read-only access to view content and dashboards',
      'analyst': 'Read access plus analytics and reporting capabilities',
      'security': 'Security monitoring, auditing, and compliance access'
    }

    return descriptions[roleName as keyof typeof descriptions] || 'Custom role with specific permissions'
  }
}

export const accessControlManager = new AccessControlManager()
