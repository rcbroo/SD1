'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CMSContent } from '../../components/interfaces/CMS/types'

export const useCMSLivePreview = <T extends CMSContent>(props: {
  initialData: T
  onUpdate?: (data: T) => void
}) => {
  const [data, setData] = useState<T>(props.initialData)
  const [isLoading, setIsLoading] = useState(false)
  const hasSentReadyMessage = useRef(false)

  const onChange = useCallback(
    (mergedData: T) => {
      setData(mergedData)
      setIsLoading(false)
      props.onUpdate?.(mergedData)
    },
    [props.onUpdate]
  )

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'cms-content-update') {
        onChange(event.data.content)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onChange])

  return { data, isLoading, setData }
}

export const CMSRefreshOnSave: React.FC<{
  onRefresh: () => void
}> = ({ onRefresh }) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'cms-content-save') {
        onRefresh()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onRefresh])

  return null
}
