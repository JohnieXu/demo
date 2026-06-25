import { type ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export type ButtonProps = {
  label?: string
  onClick?: () => void
  children?: ReactNode
  style?: CSSProperties
  textStyle?: CSSProperties
  disabled?: boolean
}

export function Button(props: ButtonProps) {
  const { label, onClick, children, style, textStyle, disabled } = props
  const handleTap = () => {
    if (!disabled) {
      onClick?.()
    }
  }

  return (
    <view
      style={{
        padding: '16px 32px',
        borderRadius: '12px',
        backgroundColor: disabled ? '#999' : '#333',
        alignItems: 'center',
        justifyContent: 'center',
        ...(style ?? {}),
      }}
      bindtap={handleTap}
    >
      {children ? (
        children
      ) : (
        <text
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            ...(textStyle ?? {}),
          }}
        >
          {label}
        </text>
      )}
    </view>
  )
}

export { Icon } from './Icon'
export type { IconProps } from './Icon'
export { Calendar } from './Calendar'
export type {
  CalendarProps,
  CalendarRef,
  CalendarDayItem,
  CalendarType,
  CalendarDayType,
} from './Calendar'
