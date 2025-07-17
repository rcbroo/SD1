import { MediaPlayerCore, GraphicsBackend, Platform } from './types'

const GRAPHICS_BACKENDS: GraphicsBackend[] = [
  {
    name: 'WebGPU',
    platforms: ['Browsers', 'Windows/NVIDIA', 'macOS'],
    priority: 1,
    features: ['compute-shaders', 'ray-tracing', 'mesh-shaders', 'variable-rate-shading']
  },
  {
    name: 'Metal',
    platforms: ['Apple Vision Pro', 'macOS'],
    priority: 1,
    features: ['unified-memory', 'neural-engine', 'spatial-computing', 'metal-performance-shaders']
  },
  {
    name: 'Vulkan',
    platforms: ['Windows/NVIDIA', 'Linux'],
    priority: 1,
    features: ['multi-threading', 'low-overhead', 'cross-platform', 'ray-tracing']
  },
  {
    name: 'WebGL2',
    platforms: ['Browsers'],
    priority: 2,
    features: ['universal-support', 'shader-precision', 'instanced-rendering']
  }
]

export const MEDIA_PLAYER_CORES: MediaPlayerCore[] = [
  {
    id: 'photon-core',
    name: 'Photon Core',
    description: 'High-performance image processing with WebGPU/Metal/Vulkan support',
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'raw', 'tiff', 'bmp'],
    backends: GRAPHICS_BACKENDS,
    capabilities: [
      {
        type: 'image',
        formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic'],
        quality: 'premium',
        realtime: true
      }
    ],
    performance: {
      maxResolution: '8K (7680x4320)',
      frameRate: 60,
      memoryUsage: '2GB',
      gpuAcceleration: true,
      hardwareDecoding: true
    }
  },
  {
    id: 'stream-core',
    name: 'Stream Core',
    description: 'Advanced video streaming supporting 2D, 180°, 360°, and Apple Spatial Video',
    supportedFormats: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'hevc', 'av1', 'spatial-video'],
    backends: GRAPHICS_BACKENDS,
    capabilities: [
      {
        type: 'video',
        formats: ['mp4', 'webm', 'mov', 'hevc', 'av1'],
        quality: 'premium',
        realtime: true
      },
      {
        type: 'streaming',
        formats: ['hls', 'dash', 'webrtc'],
        quality: 'high',
        realtime: true
      }
    ],
    performance: {
      maxResolution: '8K HDR (7680x4320)',
      frameRate: 120,
      memoryUsage: '4GB',
      gpuAcceleration: true,
      hardwareDecoding: true
    }
  },
  {
    id: 'poly-core',
    name: 'Poly Core',
    description: '3D model rendering with WebXR capabilities and real-time optimization',
    supportedFormats: ['gltf', 'glb', 'obj', 'fbx', 'dae', 'ply', 'stl', 'usd', 'usdz'],
    backends: GRAPHICS_BACKENDS,
    capabilities: [
      {
        type: '3d',
        formats: ['gltf', 'glb', 'obj', 'fbx', 'usd', 'usdz'],
        quality: 'premium',
        realtime: true
      },
      {
        type: 'xr',
        formats: ['gltf', 'usdz', 'reality'],
        quality: 'high',
        realtime: true
      }
    ],
    performance: {
      maxResolution: '4K textures',
      frameRate: 90,
      memoryUsage: '6GB',
      gpuAcceleration: true,
      hardwareDecoding: false
    }
  },
  {
    id: 'splat-core',
    name: 'Splat Core',
    description: 'Gaussian splat point cloud rendering for photorealistic 3D scenes',
    supportedFormats: ['ply', 'splat', 'gaussian', 'pointcloud'],
    backends: GRAPHICS_BACKENDS.filter(b => b.name !== 'WebGL2'),
    capabilities: [
      {
        type: '3d',
        formats: ['ply', 'splat', 'gaussian'],
        quality: 'premium',
        realtime: true
      }
    ],
    performance: {
      maxResolution: 'Unlimited points',
      frameRate: 60,
      memoryUsage: '8GB',
      gpuAcceleration: true,
      hardwareDecoding: false
    }
  },
  {
    id: 'engine-core',
    name: 'Engine Core',
    description: 'Game engine integration for Unity, Unreal, Godot, and PlayCanvas',
    supportedFormats: ['unity', 'unreal', 'godot', 'playcanvas', 'wasm', 'js'],
    backends: GRAPHICS_BACKENDS,
    capabilities: [
      {
        type: '3d',
        formats: ['unity', 'unreal', 'godot', 'playcanvas'],
        quality: 'premium',
        realtime: true
      },
      {
        type: 'xr',
        formats: ['unity', 'unreal'],
        quality: 'premium',
        realtime: true
      }
    ],
    performance: {
      maxResolution: 'Engine dependent',
      frameRate: 120,
      memoryUsage: '16GB',
      gpuAcceleration: true,
      hardwareDecoding: true
    }
  }
]

export const PLATFORM_BACKEND_MATRIX: Platform[] = [
  {
    name: 'Apple Vision Pro',
    primary: 'Metal',
    fallback: 'WebGPU'
  },
  {
    name: 'Windows/NVIDIA',
    primary: 'Vulkan',
    fallback: 'WebGPU'
  },
  {
    name: 'macOS',
    primary: 'Metal',
    fallback: 'WebGPU'
  },
  {
    name: 'Linux',
    primary: 'Vulkan',
    fallback: 'WebGL2'
  },
  {
    name: 'Browsers',
    primary: 'WebGPU',
    fallback: 'WebGL2'
  }
]

export const getOptimalCore = (mediaType: string, format: string): MediaPlayerCore | null => {
  return MEDIA_PLAYER_CORES.find(core =>
    core.capabilities.some(cap =>
      cap.type === mediaType && cap.formats.includes(format)
    )
  ) || null
}

export const getBackendForPlatform = (platformName: string): GraphicsBackend | null => {
  const platform = PLATFORM_BACKEND_MATRIX.find(p => p.name === platformName)
  if (!platform) return null

  return GRAPHICS_BACKENDS.find(b => b.name === platform.primary) || null
}
