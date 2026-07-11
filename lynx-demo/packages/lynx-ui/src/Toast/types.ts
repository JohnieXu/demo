import type { ReactNode } from '@lynx-js/react'

export type ToastType = 'text' | 'loading' | 'success' | 'fail'
export type ToastPosition = 'top' | 'middle' | 'bottom'

export interface ToastOptions {
  /** Toast type. Default: 'text'. */
  type?: ToastType
  /** Message text. */
  message?: string
  /** Vertical position. Default: 'middle'. */
  position?: ToastPosition
  /** Auto-close duration in ms. 0 keeps it open. Default: 2000. */
  duration?: number
  /** Whether to show a mask overlay. Default: false. */
  overlay?: boolean
  /** Whether tapping the overlay closes the toast. Default: false. */
  closeOnClickOverlay?: boolean
  /** Whether tapping the toast content closes it. Default: false. */
  closeOnClick?: boolean
  /** Whether to block touches behind the toast. Default: false. */
  forbidClick?: boolean
  /** z-index of the toast wrapper. Default: 400. */
  zIndex?: number
  /** Additional class name for the toast wrapper. */
  className?: string
  /** Custom icon override. */
  icon?: ReactNode
  /** Callback when the toast starts closing. */
  onClose?: () => void
  /** Callback when the toast finishes opening. */
  onOpened?: () => void
}

export interface ToastProps extends ToastOptions {
  /** Stable toast id. */
  id: string
  /** Set by the provider when the toast should start its exit animation. */
  closing?: boolean
  /** Called after the exit animation finishes so the controller can remove the item. */
  onExited?: (id: string) => void
}

export interface ToastQueueItem extends ToastOptions {
  id: string
  closing: boolean
}

export interface ToastProviderProps {
  children?: ReactNode
}
