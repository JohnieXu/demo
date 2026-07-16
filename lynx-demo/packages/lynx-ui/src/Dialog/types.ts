import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type DialogTheme = 'default' | 'round-button'

export interface DialogProps {
  /** Whether to show the dialog. */
  show?: boolean
  /** Dialog title. */
  title?: string
  /** Dialog message. */
  message?: string
  /** Dialog theme. Default: 'default'. */
  theme?: DialogTheme
  /** Dialog width. Default: 320px. */
  width?: string | number
  /** Additional class name for the popup wrapper. */
  className?: string
  /** Additional inline style for the dialog box. */
  style?: CSSProperties
  /** Whether to show the overlay mask. Default: true. */
  overlay?: boolean
  /** Whether to close the dialog when the overlay is tapped. Default: true. */
  closeOnClickOverlay?: boolean
  /** Text of the confirm button. Default: '确认'. */
  confirmButtonText?: string
  /** Text of the cancel button. Default: '取消'. */
  cancelButtonText?: string
  /** Color of the confirm button. */
  confirmButtonColor?: string
  /** Color of the cancel button text. */
  cancelButtonColor?: string
  /** Whether the confirm button is disabled. */
  confirmButtonDisabled?: boolean
  /** Whether the cancel button is disabled. */
  cancelButtonDisabled?: boolean
  /** Whether to show the confirm button. Default: true. */
  showConfirmButton?: boolean
  /** Whether to show the cancel button. Default: false. */
  showCancelButton?: boolean
  /** Callback when the confirm button is tapped. */
  onConfirm?: () => void
  /** Callback when the cancel button is tapped. */
  onCancel?: () => void
  /** Callback when the dialog starts to close. */
  onClose?: () => void
  /** Callback when the dialog finishes the open transition. */
  onOpened?: () => void
  /** Callback when the dialog finishes the close transition. */
  onClosed?: () => void
  /** Callback when the overlay is tapped. */
  onClickOverlay?: () => void
  /** Controlled show change callback. */
  onShowChange?: (show: boolean) => void
  /** Custom dialog content; takes precedence over `message`. */
  children?: ReactNode
}
