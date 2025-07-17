export interface MediaPlayerCore {
  id: string
  name: string
  description: string
  supportedFormats: string[]
  backends: GraphicsBackend[]
  capabilities: MediaCapability[]
  performance: PerformanceMetrics
}

export interface GraphicsBackend {
  name: 'WebGPU' | 'Metal' | 'Vulkan' | 'WebGL2'
  platforms: string[]
  priority: number
  features: string[]
}

export interface Platform {
  name: 'Apple Vision Pro' | 'Windows/NVIDIA' | 'macOS' | 'Linux' | 'Browsers'
  primary: GraphicsBackend['name']
  fallback: GraphicsBackend['name']
}

export interface MediaCapability {
  type: 'image' | 'video' | '3d' | 'xr' | 'audio' | 'streaming'
  formats: string[]
  quality: 'low' | 'medium' | 'high' | 'premium'
  realtime: boolean
}

export interface PerformanceMetrics {
  maxResolution: string
  frameRate: number
  memoryUsage: string
  gpuAcceleration: boolean
  hardwareDecoding: boolean
}

export interface MediaPlayerConfig {
  coreId: string
  autoSelect: boolean
  fallbackChain: string[]
  optimization: 'quality' | 'performance' | 'balanced'
  caching: boolean
  preload: boolean
}

export interface MediaAsset {
  id: string
  type: MediaCapability['type']
  url: string
  format: string
  metadata: MediaMetadata
  processing?: ProcessingStatus
}

export interface MediaMetadata {
  title: string
  description?: string
  duration?: number
  dimensions?: { width: number; height: number; depth?: number }
  fileSize: number
  encoding?: string
  bitrate?: number
  fps?: number
  colorSpace?: string
  spatialAudio?: boolean
}

export interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  operations: ProcessingOperation[]
  error?: string
}

export interface ProcessingOperation {
  type: 'transcode' | 'compress' | 'optimize' | 'convert'
  input: string
  output: string
  settings: Record<string, any>
}

export interface UnifiedMediaPlayer {
  cores: MediaPlayerCore[]
  activeCore?: string
  config: MediaPlayerConfig
  asset?: MediaAsset
  state: PlayerState
}

export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  fullscreen: boolean
  loading: boolean
  error?: string
}
