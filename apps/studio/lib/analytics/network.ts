import { NetworkNode, NetworkEdge, NetworkAnalysis, NetworkMetrics, Community, CriticalPath, AnalyticsQuery, AnalyticsResult } from './types'

export class NetworkAnalyzer {
  async analyzeContentEcosystem(projectId: string): Promise<NetworkAnalysis> {
    const nodes = await this.getNetworkNodes(projectId)
    const edges = await this.getNetworkEdges(nodes)
    const metrics = this.calculateNetworkMetrics(nodes, edges)
    const communities = this.detectCommunities(nodes, edges)
    const criticalPaths = this.identifyCriticalPaths(nodes, edges)

    return {
      nodes,
      edges,
      metrics,
      communities,
      criticalPaths
    }
  }

  private async getNetworkNodes(projectId: string): Promise<NetworkNode[]> {
    return [
      {
        id: 'content-1',
        type: 'content',
        weight: 0.8,
        connections: ['user-1', 'user-2', 'agent-1'],
        centrality: 0.75,
        influence: 0.6,
        metadata: { category: 'documentation', views: 1500 }
      },
      {
        id: 'user-1',
        type: 'user',
        weight: 0.6,
        connections: ['content-1', 'content-2', 'agent-2'],
        centrality: 0.45,
        influence: 0.3,
        metadata: { role: 'editor', activity: 'high' }
      },
      {
        id: 'agent-1',
        type: 'agent',
        weight: 0.9,
        connections: ['content-1', 'content-3', 'agent-2'],
        centrality: 0.85,
        influence: 0.8,
        metadata: { type: 'content-optimizer', efficiency: 0.92 }
      }
    ]
  }

  private async getNetworkEdges(nodes: NetworkNode[]): Promise<NetworkEdge[]> {
    const edges: NetworkEdge[] = []
    
    for (const node of nodes) {
      for (const connectionId of node.connections) {
        const target = nodes.find(n => n.id === connectionId)
        if (target) {
          edges.push({
            source: node.id,
            target: connectionId,
            weight: this.calculateEdgeWeight(node, target),
            type: this.determineEdgeType(node, target),
            strength: Math.random() * 0.5 + 0.5
          })
        }
      }
    }
    
    return edges
  }

  private calculateEdgeWeight(source: NetworkNode, target: NetworkNode): number {
    const baseWeight = (source.weight + target.weight) / 2
    const interactionBonus = this.getInteractionFrequency(source.id, target.id)
    return Math.min(1, baseWeight * (1 + interactionBonus))
  }

  private determineEdgeType(source: NetworkNode, target: NetworkNode): 'collaboration' | 'dependency' | 'influence' | 'conflict' {
    if (source.type === 'agent' && target.type === 'agent') return 'collaboration'
    if (source.type === 'content' && target.type === 'user') return 'influence'
    if (source.type === 'agent' && target.type === 'content') return 'dependency'
    return 'collaboration'
  }

  private getInteractionFrequency(sourceId: string, targetId: string): number {
    return Math.random() * 0.3
  }

  private calculateNetworkMetrics(nodes: NetworkNode[], edges: NetworkEdge[]): NetworkMetrics {
    const density = this.calculateDensity(nodes, edges)
    const clustering = this.calculateClustering(nodes, edges)
    const averagePathLength = this.calculateAveragePathLength(nodes, edges)
    const modularity = this.calculateModularity(nodes, edges)
    const resilience = this.calculateResilience(nodes, edges)

    return {
      density,
      clustering,
      averagePathLength,
      modularity,
      resilience
    }
  }

  private calculateDensity(nodes: NetworkNode[], edges: NetworkEdge[]): number {
    const maxPossibleEdges = nodes.length * (nodes.length - 1) / 2
    return edges.length / maxPossibleEdges
  }

  private calculateClustering(nodes: NetworkNode[], edges: NetworkEdge[]): number {
    let totalClustering = 0
    
    for (const node of nodes) {
      const neighbors = this.getNeighbors(node.id, edges)
      if (neighbors.length < 2) continue
      
      const possibleTriangles = neighbors.length * (neighbors.length - 1) / 2
      const actualTriangles = this.countTriangles(neighbors, edges)
      
      totalClustering += actualTriangles / possibleTriangles
    }
    
    return totalClustering / nodes.length
  }

  private calculateAveragePathLength(nodes: NetworkNode[], edges: NetworkEdge[]): number {
    const distances = this.calculateAllPairsShortestPaths(nodes, edges)
    let totalDistance = 0
    let pathCount = 0
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (distances[i][j] !== Infinity) {
          totalDistance += distances[i][j]
          pathCount++
        }
      }
    }
    
    return pathCount > 0 ? totalDistance / pathCount : 0
  }

  private calculateModularity(nodes: NetworkNode[], edges: NetworkEdge[]): number {
    const communities = this.detectCommunities(nodes, edges)
    let modularity = 0
    const totalEdges = edges.length
    
    for (const community of communities) {
      const internalEdges = this.countInternalEdges(community.nodes, edges)
      const expectedEdges = this.calculateExpectedEdges(community.nodes, edges, totalEdges)
      modularity += (internalEdges - expectedEdges) / totalEdges
    }
    
    return modularity
  }

  private calculateResilience(nodes: NetworkNode[], edges: NetworkEdge[]): number {
    const criticalNodes = nodes
      .sort((a, b) => b.centrality - a.centrality)
      .slice(0, Math.ceil(nodes.length * 0.1))
    
    const originalConnectivity = this.calculateConnectivity(nodes, edges)
    const remainingNodes = nodes.filter(n => !criticalNodes.includes(n))
    const remainingEdges = edges.filter(e => 
      remainingNodes.some(n => n.id === e.source) && 
      remainingNodes.some(n => n.id === e.target)
    )
    const degradedConnectivity = this.calculateConnectivity(remainingNodes, remainingEdges)
    
    return degradedConnectivity / originalConnectivity
  }

  private detectCommunities(nodes: NetworkNode[], edges: NetworkEdge[]): Community[] {
    const communities: Community[] = []
    const visited = new Set<string>()
    
    for (const node of nodes) {
      if (visited.has(node.id)) continue
      
      const community = this.expandCommunity(node, nodes, edges, visited)
      if (community.length > 1) {
        communities.push({
          id: `community-${communities.length}`,
          nodes: community,
          cohesion: this.calculateCohesion(community, edges),
          influence: this.calculateCommunityInfluence(community, nodes),
          stability: this.calculateStability(community, edges)
        })
      }
    }
    
    return communities
  }

  private expandCommunity(startNode: NetworkNode, allNodes: NetworkNode[], edges: NetworkEdge[], visited: Set<string>): string[] {
    const community = [startNode.id]
    const queue = [startNode.id]
    visited.add(startNode.id)
    
    while (queue.length > 0) {
      const currentId = queue.shift()!
      const neighbors = this.getNeighbors(currentId, edges)
      
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          const neighbor = allNodes.find(n => n.id === neighborId)
          if (neighbor && this.shouldJoinCommunity(neighbor, community, edges)) {
            community.push(neighborId)
            queue.push(neighborId)
            visited.add(neighborId)
          }
        }
      }
    }
    
    return community
  }

  private shouldJoinCommunity(node: NetworkNode, community: string[], edges: NetworkEdge[]): boolean {
    const connectionsToComm = community.filter(memberId => 
      edges.some(e => 
        (e.source === node.id && e.target === memberId) ||
        (e.target === node.id && e.source === memberId)
      )
    ).length
    
    return connectionsToComm / community.length > 0.3
  }

  private identifyCriticalPaths(nodes: NetworkNode[], edges: NetworkEdge[]): CriticalPath[] {
    const criticalPaths: CriticalPath[] = []
    const highInfluenceNodes = nodes
      .filter(n => n.influence > 0.7)
      .sort((a, b) => b.influence - a.influence)
    
    for (let i = 0; i < highInfluenceNodes.length - 1; i++) {
      const path = this.findShortestPath(
        highInfluenceNodes[i].id,
        highInfluenceNodes[i + 1].id,
        nodes,
        edges
      )
      
      if (path.length > 0) {
        criticalPaths.push({
          nodes: path,
          importance: this.calculatePathImportance(path, nodes),
          vulnerability: this.calculatePathVulnerability(path, edges),
          alternatives: this.findAlternativePaths(path[0], path[path.length - 1], nodes, edges)
        })
      }
    }
    
    return criticalPaths.sort((a, b) => b.importance - a.importance).slice(0, 5)
  }

  private getNeighbors(nodeId: string, edges: NetworkEdge[]): string[] {
    return edges
      .filter(e => e.source === nodeId || e.target === nodeId)
      .map(e => e.source === nodeId ? e.target : e.source)
  }

  private countTriangles(neighbors: string[], edges: NetworkEdge[]): number {
    let triangles = 0
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (edges.some(e => 
          (e.source === neighbors[i] && e.target === neighbors[j]) ||
          (e.target === neighbors[i] && e.source === neighbors[j])
        )) {
          triangles++
        }
      }
    }
    return triangles
  }

  private calculateAllPairsShortestPaths(nodes: NetworkNode[], edges: NetworkEdge[]): number[][] {
    const n = nodes.length
    const distances: number[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity))
    
    for (let i = 0; i < n; i++) {
      distances[i][i] = 0
    }
    
    for (const edge of edges) {
      const sourceIdx = nodes.findIndex(n => n.id === edge.source)
      const targetIdx = nodes.findIndex(n => n.id === edge.target)
      if (sourceIdx !== -1 && targetIdx !== -1) {
        distances[sourceIdx][targetIdx] = 1
        distances[targetIdx][sourceIdx] = 1
      }
    }
    
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          distances[i][j] = Math.min(distances[i][j], distances[i][k] + distances[k][j])
        }
      }
    }
    
    return distances
  }

  private countInternalEdges(communityNodes: string[], edges: NetworkEdge[]): number {
    return edges.filter(e => 
      communityNodes.includes(e.source) && communityNodes.includes(e.target)
    ).length
  }

  private calculateExpectedEdges(communityNodes: string[], edges: NetworkEdge[], totalEdges: number): number {
    const communityDegree = communityNodes.reduce((sum, nodeId) => {
      const degree = edges.filter(e => e.source === nodeId || e.target === nodeId).length
      return sum + degree
    }, 0)
    
    return (communityDegree * communityDegree) / (4 * totalEdges)
  }

  private calculateConnectivity(nodes: NetworkNode[], edges: NetworkEdge[]): number {
    if (nodes.length === 0) return 0
    const components = this.findConnectedComponents(nodes, edges)
    return 1 - (components.length - 1) / nodes.length
  }

  private findConnectedComponents(nodes: NetworkNode[], edges: NetworkEdge[]): string[][] {
    const visited = new Set<string>()
    const components: string[][] = []
    
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        const component = this.dfsComponent(node.id, nodes, edges, visited)
        components.push(component)
      }
    }
    
    return components
  }

  private dfsComponent(startId: string, nodes: NetworkNode[], edges: NetworkEdge[], visited: Set<string>): string[] {
    const component: string[] = []
    const stack = [startId]
    
    while (stack.length > 0) {
      const currentId = stack.pop()!
      if (!visited.has(currentId)) {
        visited.add(currentId)
        component.push(currentId)
        
        const neighbors = this.getNeighbors(currentId, edges)
        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            stack.push(neighborId)
          }
        }
      }
    }
    
    return component
  }

  private calculateCohesion(communityNodes: string[], edges: NetworkEdge[]): number {
    const internalEdges = this.countInternalEdges(communityNodes, edges)
    const maxPossibleEdges = communityNodes.length * (communityNodes.length - 1) / 2
    return maxPossibleEdges > 0 ? internalEdges / maxPossibleEdges : 0
  }

  private calculateCommunityInfluence(communityNodes: string[], allNodes: NetworkNode[]): number {
    const communityInfluence = communityNodes.reduce((sum, nodeId) => {
      const node = allNodes.find(n => n.id === nodeId)
      return sum + (node?.influence || 0)
    }, 0)
    
    return communityInfluence / communityNodes.length
  }

  private calculateStability(communityNodes: string[], edges: NetworkEdge[]): number {
    const internalEdges = this.countInternalEdges(communityNodes, edges)
    const externalEdges = edges.filter(e => 
      (communityNodes.includes(e.source) && !communityNodes.includes(e.target)) ||
      (!communityNodes.includes(e.source) && communityNodes.includes(e.target))
    ).length
    
    const totalEdges = internalEdges + externalEdges
    return totalEdges > 0 ? internalEdges / totalEdges : 0
  }

  private findShortestPath(startId: string, endId: string, nodes: NetworkNode[], edges: NetworkEdge[]): string[] {
    const distances = new Map<string, number>()
    const previous = new Map<string, string>()
    const unvisited = new Set(nodes.map(n => n.id))
    
    distances.set(startId, 0)
    
    while (unvisited.size > 0) {
      const current = Array.from(unvisited).reduce((min, nodeId) => 
        (distances.get(nodeId) || Infinity) < (distances.get(min) || Infinity) ? nodeId : min
      )
      
      if (current === endId) break
      
      unvisited.delete(current)
      const neighbors = this.getNeighbors(current, edges).filter(n => unvisited.has(n))
      
      for (const neighbor of neighbors) {
        const alt = (distances.get(current) || Infinity) + 1
        if (alt < (distances.get(neighbor) || Infinity)) {
          distances.set(neighbor, alt)
          previous.set(neighbor, current)
        }
      }
    }
    
    const path: string[] = []
    let current = endId
    while (current) {
      path.unshift(current)
      current = previous.get(current)!
      if (current === startId) {
        path.unshift(startId)
        break
      }
    }
    
    return path
  }

  private calculatePathImportance(path: string[], nodes: NetworkNode[]): number {
    return path.reduce((sum, nodeId) => {
      const node = nodes.find(n => n.id === nodeId)
      return sum + (node?.influence || 0)
    }, 0) / path.length
  }

  private calculatePathVulnerability(path: string[], edges: NetworkEdge[]): number {
    let bottlenecks = 0
    for (let i = 0; i < path.length - 1; i++) {
      const alternatives = edges.filter(e => 
        e.source === path[i] && e.target !== path[i + 1]
      ).length
      if (alternatives === 0) bottlenecks++
    }
    
    return bottlenecks / Math.max(1, path.length - 1)
  }

  private findAlternativePaths(startId: string, endId: string, nodes: NetworkNode[], edges: NetworkEdge[]): string[][] {
    const alternatives: string[][] = []
    const originalPath = this.findShortestPath(startId, endId, nodes, edges)
    
    for (let i = 0; i < originalPath.length - 1; i++) {
      const filteredEdges = edges.filter(e => 
        !(e.source === originalPath[i] && e.target === originalPath[i + 1]) &&
        !(e.target === originalPath[i] && e.source === originalPath[i + 1])
      )
      
      const altPath = this.findShortestPath(startId, endId, nodes, filteredEdges)
      if (altPath.length > 0 && !this.pathsEqual(altPath, originalPath)) {
        alternatives.push(altPath)
      }
    }
    
    return alternatives.slice(0, 3) // Return top 3 alternatives
  }

  private pathsEqual(path1: string[], path2: string[]): boolean {
    return path1.length === path2.length && path1.every((node, i) => node === path2[i])
  }

  async runNetworkAnalysis(query: AnalyticsQuery): Promise<AnalyticsResult> {
    const mockData = [
      { nodeId: 'content-1', centrality: 0.75, influence: 0.6, type: 'content' },
      { nodeId: 'agent-1', centrality: 0.85, influence: 0.8, type: 'agent' },
      { nodeId: 'user-1', centrality: 0.45, influence: 0.3, type: 'user' }
    ]

    return {
      query,
      data: mockData,
      insights: [
        {
          type: 'risk',
          severity: 'medium',
          description: 'High dependency on central content nodes creates vulnerability',
          evidence: mockData,
          confidence: 0.82
        }
      ],
      recommendations: [
        {
          type: 'mitigation',
          priority: 'high',
          action: 'Distribute content dependencies to reduce single points of failure',
          expectedImpact: 0.35,
          effort: 'medium',
          timeline: '3-4 weeks'
        }
      ],
      confidence: 0.82,
      generatedAt: new Date().toISOString()
    }
  }
}

export const networkAnalyzer = new NetworkAnalyzer()
