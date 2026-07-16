import type { CSSProperties } from '@lynx-js/types'
import { Loading } from '../Loading'
import { cn } from '../theme/cn'
import type { ButtonProps, ButtonType } from './types'

const FILLED_TYPES: ButtonType[] = ['primary', 'success', 'danger', 'warning']

export function Button(props: ButtonProps) {
  const {
    type,
    color,
    plain,
    round,
    square,
    block,
    loading,
    loadingText,
    icon,
    text,
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

  const isDisabled = disabled || loading
  const buttonType = type ?? variant ?? 'default'
  const displayText = text ?? label
  const isFilled = FILLED_TYPES.includes(buttonType as ButtonType) && !plain

  const handleTap = () => {
    if (!isDisabled) {
      onClick?.()
    }
  }

  const isGradient = color?.includes('gradient')
  const customStyle: CSSProperties = {}
  if (color && !disabled) {
    if (plain) {
      customStyle.backgroundColor = 'transparent'
      customStyle.color = color
      if (isGradient) {
        customStyle.borderWidth = 0
      } else {
        customStyle.borderColor = color
      }
    } else {
      customStyle.color = '#fff'
      if (isGradient) {
        customStyle.backgroundImage = color
      } else {
        customStyle.backgroundColor = color
      }
      customStyle.borderWidth = 0
    }
  }

  const loadingColor = disabled
    ? 'var(--lu-button-disabled-color)'
    : color
      ? plain && !isGradient
        ? color
        : '#fff'
      : isFilled
        ? '#fff'
        : 'var(--lu-color-text-primary)'

  const showIcon = loading || icon != null
  const iconNode = loading ? (
    <Loading className="lu-btn__loading" size="18px" color={loadingColor} />
  ) : (
    icon
  )

  const content = children ? (
    children
  ) : (
    <view className="lu-btn__content">
      {showIcon && <view className="lu-btn__icon">{iconNode}</view>}
      <text className="lu-btn__text" style={textStyle}>
        {loading ? loadingText ?? displayText : displayText}
      </text>
    </view>
  )

  return (
    <view
      className={cn(
        'lu-btn',
        `lu-btn--${buttonType}`,
        `lu-btn--${size}`,
        plain && 'lu-btn--plain',
        round && 'lu-btn--round',
        square && 'lu-btn--square',
        block && 'lu-btn--block',
        loading && 'lu-btn--loading',
        isDisabled && 'lu-btn--disabled ui-disabled',
        className,
      )}
      style={{ ...customStyle, ...style }}
      bindtap={handleTap}
    >
      {content}
    </view>
  )
}

export type { ButtonProps, ButtonVariant, ButtonSize, ButtonType } from './types'
