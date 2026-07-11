import { useEffect, useMemo, useRef } from '@lynx-js/react'
import { closeToast, showToast } from './controller'
import type { ToastOptions } from './types'

export interface ToastProps extends ToastOptions {
  /** Whether the toast is visible. */
  show?: boolean
}

export function Toast(props: ToastProps) {
  const { show = false, ...rest } = props

  const options = useMemo(
    () => ({
      type: rest.type,
      message: rest.message,
      position: rest.position,
      duration: rest.duration,
      overlay: rest.overlay,
      closeOnClickOverlay: rest.closeOnClickOverlay,
      closeOnClick: rest.closeOnClick,
      forbidClick: rest.forbidClick,
      zIndex: rest.zIndex,
      className: rest.className,
      icon: rest.icon,
      onClose: rest.onClose,
      onOpened: rest.onOpened,
    }),
    [
      rest.type,
      rest.message,
      rest.position,
      rest.duration,
      rest.overlay,
      rest.closeOnClickOverlay,
      rest.closeOnClick,
      rest.forbidClick,
      rest.zIndex,
      rest.className,
      rest.icon,
      rest.onClose,
      rest.onOpened,
    ],
  )

  const prevShowRef = useRef(show)

  useEffect(() => {
    if (show) {
      showToast(options)
    } else if (prevShowRef.current) {
      closeToast()
    }
    prevShowRef.current = show

    return () => {
      if (prevShowRef.current) {
        closeToast()
        prevShowRef.current = false
      }
    }
  }, [show, options])

  return null
}
