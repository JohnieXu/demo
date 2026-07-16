import type { ReactNode } from '@lynx-js/react'

export type NotifyType = 'primary' | 'success' | 'warning' | 'danger'
export type NotifyPosition = 'top' | 'bottom'

export interface NotifyOptions {
  /** Notify type. Default: 'danger'. */
  type?: NotifyType
  /** Message text. */
  message?: string
  /** Text color override. */
  color?: string
  /** Background color override. */
  background?: string
  /** Auto-close duration in ms. 0 keeps it open. Default: 3000. */
  duration?: number
  /** Vertical position. Default: 'top'. */
  position?: NotifyPosition
  /** Add top safe-area padding when position is 'top'. Default: true. */
  safeAreaInsetTop?: boolean
  /** Add bottom safe-area padding when position is 'bottom'. Default: true. */
  safeAreaInsetBottom?: boolean
  /** Additional class name for the notify wrapper. */
  className?: string
  /** Callback when the notify starts closing. */
  onClose?: () => void
  /** Callback when the notify finishes opening. */
  onOpened?: () => void
}

export interface NotifyProps extends NotifyOptions {
  /** Whether the notify is visible. */
  show?: boolean
}

export interface NotifyState extends NotifyOptions {
  /** Stable notify id. */
  id: string
  /** Set by the controller when the notify should start its exit animation. */
  closing: boolean
}

export interface NotifyProviderProps {
  /** Child elements. */
  children?: ReactNode
}
