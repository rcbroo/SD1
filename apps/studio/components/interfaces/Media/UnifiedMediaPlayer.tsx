import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Download } from 'lucide-react'
import { Button, Badge } from 'ui'
import { MediaAsset, UnifiedMediaPlayer as IUnifiedMediaPlayer, PlayerState } from '../../../lib/media/types'
import { MEDIA_PLAYER_CORES, getOptimalCore, getBackendForPlatform } from '../../../lib/media/cores'

interface UnifiedMediaPlayerProps {
  asset: MediaAsset
  autoPlay?: boolean
  controls?: boolean
  className?: string
  onStateChange?: (state: PlayerState) => void
}

const UnifiedMediaPlayer = ({
  asset,
  autoPlay = false,
  controls = true,
  className = '',
  onStateChange
}: UnifiedMediaPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<IUnifiedMediaPlayer | null>(null)
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    fullscreen: false,
    loading: true,
    error: undefined
  })

  useEffect(() => {
    initializePlayer()
  }, [asset])

  useEffect(() => {
    onStateChange?.(state)
  }, [state, onStateChange])

  const initializePlayer = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: undefined }))

      const optimalCore = getOptimalCore(asset.type, asset.metadata.encoding || '')
      if (!optimalCore) {
        throw new Error(`No suitable core found for ${asset.type} format`)
      }

      const platform = detectPlatform()
      const backend = getBackendForPlatform(platform)

      const newPlayer: IUnifiedMediaPlayer = {
        cores: MEDIA_PLAYER_CORES,
        activeCore: optimalCore.id,
        config: {
          coreId: optimalCore.id,
          autoSelect: true,
          fallbackChain: ['photon-core', 'stream-core'],
          optimization: 'balanced',
          caching: true,
          preload: true
        },
        asset,
        state
      }

      setPlayer(newPlayer)
      setState(prev => ({
        ...prev,
        loading: false,
        duration: asset.metadata.duration || 0
      }))

      if (autoPlay) {
        handlePlay()
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize player'
      }))
    }
  }

  const detectPlatform = (): string => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('mac')) return 'macOS'
    if (userAgent.includes('win')) return 'Windows/NVIDIA'
    if (userAgent.includes('linux')) return 'Linux'
    return 'Browsers'
  }

  const handlePlay = () => {
    setState(prev => ({ ...prev, isPlaying: true }))
  }

  const handlePause = () => {
    setState(prev => ({ ...prev, isPlaying: false }))
  }

  const handleTogglePlay = () => {
    if (state.isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }

  const handleVolumeToggle = () => {
    setState(prev => ({ ...prev, muted: !prev.muted }))
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen()
        setState(prev => ({ ...prev, fullscreen: true }))
      } else {
        document.exitFullscreen()
        setState(prev => ({ ...prev, fullscreen: false }))
      }
    }
  }

  const renderMediaContent = () => {
    if (state.loading) {
      return (
        <div className="flex items-center justify-center h-full bg-surface-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      )
    }

    if (state.error) {
      return (
        <div className="flex items-center justify-center h-full bg-surface-100 text-foreground-light">
          <div className="text-center">
            <p className="text-sm">Failed to load media</p>
            <p className="text-xs mt-1">{state.error}</p>
          </div>
        </div>
      )
    }

    switch (asset.type) {
      case 'image':
        return (
          <img
            src={asset.url}
            alt={asset.metadata.title}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        )
      case 'video':
        return (
          <video
            src={asset.url}
            className="w-full h-full object-contain"
            controls={false}
            autoPlay={autoPlay}
            muted={state.muted}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={(e) => {
              const video = e.target as HTMLVideoElement
              setState(prev => ({ ...prev, currentTime: video.currentTime }))
            }}
          />
        )
      case '3d':
        return (
          <div className="flex items-center justify-center h-full bg-surface-100">
            <div className="text-center text-foreground-light">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <p className="text-sm">3D Model Viewer</p>
              <p className="text-xs mt-1">{asset.metadata.title}</p>
            </div>
          </div>
        )
      case 'xr':
        return (
          <div className="flex items-center justify-center h-full bg-surface-100">
            <div className="text-center text-foreground-light">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🥽</span>
              </div>
              <p className="text-sm">XR Experience</p>
              <p className="text-xs mt-1">{asset.metadata.title}</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full bg-surface-100 text-foreground-light">
            <p className="text-sm">Unsupported media type: {asset.type}</p>
          </div>
        )
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const activeCore = player?.cores.find(core => core.id === player.activeCore)

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      style={{ aspectRatio: asset.metadata.dimensions ? 
        `${asset.metadata.dimensions.width}/${asset.metadata.dimensions.height}` : '16/9' }}
    >
      {renderMediaContent()}

      {controls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                type="text"
                size="small"
                icon={state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                onClick={handleTogglePlay}
                className="text-white hover:text-brand-300"
              />
              
              <Button
                type="text"
                size="small"
                icon={state.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                onClick={handleVolumeToggle}
                className="text-white hover:text-brand-300"
              />

              {asset.metadata.duration && (
                <span className="text-white text-xs">
                  {formatTime(state.currentTime)} / {formatTime(state.duration)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {activeCore && (
                <Badge variant="secondary" className="text-xs">
                  {activeCore.name}
                </Badge>
              )}
              
              <Button
                type="text"
                size="small"
                icon={<Download className="w-4 h-4" />}
                onClick={() => window.open(asset.url, '_blank')}
                className="text-white hover:text-brand-300"
              />

              <Button
                type="text"
                size="small"
                icon={<Settings className="w-4 h-4" />}
                className="text-white hover:text-brand-300"
              />

              <Button
                type="text"
                size="small"
                icon={<Maximize className="w-4 h-4" />}
                onClick={handleFullscreen}
                className="text-white hover:text-brand-300"
              />
            </div>
          </div>

          {asset.metadata.duration && (
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div
                  className="bg-brand-500 h-1 rounded-full transition-all duration-200"
                  style={{ width: `${(state.currentTime / state.duration) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {asset.type.toUpperCase()}
          </Badge>
          {asset.metadata.encoding && (
            <Badge variant="outline" className="text-xs">
              {asset.metadata.encoding.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export default UnifiedMediaPlayer
