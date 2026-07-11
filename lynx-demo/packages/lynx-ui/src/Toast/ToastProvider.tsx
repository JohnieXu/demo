import { useEffect, useState } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'
import { getQueue, removeToast, subscribe } from './controller'
import { ToastItem } from './ToastItem'
import type { ToastQueueItem } from './types'

export interface ToastProviderProps {
  children?: ReactNode
}

export function ToastProvider(props: ToastProviderProps) {
  const { children } = props
  const [queue, setQueue] = useState<ToastQueueItem[]>([])

  useEffect(() => {
    setQueue([...getQueue()])
    return subscribe(() => {
      setQueue([...getQueue()])
    })
  }, [])

  return (
    <>
      {children}
      {queue.map((item) => (
        <ToastItem
          key={item.id}
          {...item}
          onExited={(id) => removeToast(id)}
        />
      ))}
    </>
  )
}
