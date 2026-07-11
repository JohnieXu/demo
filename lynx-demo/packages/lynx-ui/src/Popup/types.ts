import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type PopupPosition = 'center' | 'top' | 'bottom' | 'left' | 'right'

export interface PopupProps {
  /** Whether to show the popup. */
  show?: boolean
  /** Position of the popup content. Default: 'center'. */
  position?: PopupPosition
  /** Whether to show the overlay mask. Default: true. */
  overlay?: boolean
  /** Whether to close the popup when the overlay is tapped. Default: true. */
  closeOnClickOverlay?: boolean
  /** Whether to show rounded corners. Default: false. */
  round?: boolean
  /** Add top safe-area padding. Default: false. */
  safeAreaInsetTop?: boolean
  /** Add bottom safe-area padding. Default: false. */
  safeAreaInsetBottom?: boolean
  /** z-index of the popup wrapper. Default: 300. */
  zIndex?: number
  /** Transition duration in seconds. Default: 0.3. */
  duration?: number
  /** Whether to remove content from the tree after closing. Default: false. */
  destroyOnClose?: boolean
  /** Whether to defer rendering until first open. Default: true. */
  lazyRender?: boolean
  /** Popup content. */
  children?: ReactNode
  /** Additional class name for the popup wrapper. */
  className?: string
  /** Additional inline style for the popup wrapper. */
  style?: CSSProperties
  /** Additional class name for the overlay. */
  overlayClassName?: string
  /** Additional inline style for the overlay. */
  overlayStyle?: CSSProperties
  /** Callback when the popup starts to open. */
  onOpen?: () => void
  /** Callback when the popup finishes the open transition. */
  onOpened?: () => void
  /** Callback when the popup starts to close. */
  onClose?: () => void
  /** Callback when the popup finishes the close transition. */
  onClosed?: () => void
  /** Callback when the overlay is tapped. */
  onClickOverlay?: () => void
  /** Controlled show change callback. */
  onShowChange?: (show: boolean) => void
}
