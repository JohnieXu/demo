import { cn } from '../theme/cn'
import type { ButtonProps } from './types'

export function Button(props: ButtonProps) {
  const {
    label,
    onClick,
    children,
    style,
    textStyle,
    disabled,
    variant = 'primary',
    size = 'md',
    className,
  } = props

  const handleTap = () => {
    if (!disabled) {
      onClick?.()
    }
  }

  return (
    <view
      className={cn(
        'lu-btn',
        `lu-btn--${variant}`,
        `lu-btn--${size}`,
        disabled && 'lu-btn--disabled ui-disabled',
        className,
      )}
      style={style}
      bindtap={handleTap}
    >
      {children ? (
        children
      ) : (
        <text className="lu-btn__text" style={textStyle}>
          {label}
        </text>
      )}
    </view>
  )
}

export type { ButtonProps, ButtonVariant, ButtonSize } from './types'
