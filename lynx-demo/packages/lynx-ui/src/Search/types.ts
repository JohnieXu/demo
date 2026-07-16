import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type SearchShape = 'square' | 'round'
export type SearchInputAlign = 'left' | 'center' | 'right'

export interface SearchProps {
  /** Current value (controlled). */
  value?: string
  /** Initial value (uncontrolled). */
  defaultValue?: string
  /** Input placeholder. */
  placeholder?: string
  /** Input text alignment. */
  inputAlign?: SearchInputAlign
  /** Disable the input. */
  disabled?: boolean
  /** Make the input read-only. */
  readonly?: boolean
  /** Show the clear icon when the input has value. */
  clearable?: boolean
  /** Background color of the search bar. */
  background?: string
  /** Shape of the search content area. */
  shape?: SearchShape
  /** Custom icon rendered on the left side. */
  leftIcon?: ReactNode
  /** Custom icon rendered on the right side of the input. */
  rightIcon?: ReactNode
  /** Text of the action button (shown when `showAction` is true). */
  actionText?: string
  /** Whether to show the action button on the right. */
  showAction?: boolean
  className?: string
  style?: CSSProperties
  /** Called when the confirm/search button is pressed. */
  onSearch?: (value: string) => void
  /** Called when the input value changes. */
  onChange?: (value: string) => void
  /** Called when the input is focused. */
  onFocus?: () => void
  /** Called when the input is blurred. */
  onBlur?: () => void
  /** Called when the clear icon is tapped. */
  onClear?: () => void
  /** Called when the action button is tapped. */
  onCancel?: () => void
  /** Called when the input area is tapped. */
  onClickInput?: () => void
}
