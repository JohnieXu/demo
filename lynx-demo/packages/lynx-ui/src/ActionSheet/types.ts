import type { CSSProperties } from '@lynx-js/types'

export interface ActionSheetAction {
  name: string
  subname?: string
  color?: string
  disabled?: boolean
  loading?: boolean
}

export interface ActionSheetProps {
  show?: boolean
  actions?: ActionSheetAction[]
  title?: string
  description?: string
  cancelText?: string
  closeOnClickAction?: boolean
  closeOnClickOverlay?: boolean
  overlay?: boolean
  onSelect?: (action: ActionSheetAction, index: number) => void
  onCancel?: () => void
  onClose?: () => void
  onOpened?: () => void
  onClosed?: () => void
  onClickOverlay?: () => void
  onShowChange?: (show: boolean) => void
  className?: string
  style?: CSSProperties
}
