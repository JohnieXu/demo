import { Icon } from '../Icon'
import { cn } from '../theme/cn'
import { createNamespace, isDef } from '../utils'
import type { CellProps } from './types'

const bem = createNamespace('cell')

function ArrowIcon({ direction }: { direction?: CellProps['arrowDirection'] }) {
  let rotate = 0
  if (direction === 'up') rotate = -90
  if (direction === 'down') rotate = 90
  if (direction === 'left') rotate = 180

  const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" style="transform: rotate(${rotate}deg)">
      <path d="M5.354 3.146a.5.5 0 010 .708L9.793 8l-4.44 4.146a.5.5 0 00.686.73l.024-.024 4.793-4.5a.5.5 0 000-.73l-4.793-4.5a.5.5 0 00-.686.73l-.024.024z" />
    </svg>
  `

  return <Icon svg={arrowSvg} className={bem('arrow')} />
}

export function Cell(props: CellProps) {
  const {
    icon,
    size = 'normal',
    title,
    value,
    label,
    center = false,
    isLink = false,
    border = true,
    titleClass,
    valueClass,
    labelClass,
    titleStyle,
    arrowDirection = 'right',
    required = false,
    clickable: clickableProp = null,
    children,
    className,
    style,
    onClick,
  } = props

  const clickable = clickableProp ?? isLink

  const renderLabel = () => {
    if (!isDef(label)) return null
    return (
      <view className={cn(bem('label'), labelClass)}>
        <text>{label}</text>
      </view>
    )
  }

  const renderTitle = () => {
    if (!isDef(title)) return null
    return (
      <view className={cn(bem('title'), titleClass)} style={titleStyle}>
        <text>{title}</text>
        {renderLabel()}
      </view>
    )
  }

  const renderValue = () => {
    const hasValue = children != null || isDef(value)
    if (!hasValue) return null
    return (
      <view className={cn(bem('value'), valueClass)}>
        {children ?? <text>{value}</text>}
      </view>
    )
  }

  const renderRightIcon = () => {
    if (isLink) {
      return (
        <view className={bem('right-icon')}>
          <ArrowIcon direction={arrowDirection} />
        </view>
      )
    }
    return null
  }

  return (
    <view
      className={cn(
        bem({
          center,
          required: required === true || required === 'auto',
          clickable,
          borderless: !border,
          [size]: true,
        }),
        className,
      )}
      style={style}
      bindtap={clickable ? onClick : undefined}
    >
      {(required === true || required === 'auto') && (
        <text className={bem('required')}>*</text>
      )}
      {icon && <view className={bem('left-icon')}>{icon}</view>}
      {renderTitle()}
      {renderValue()}
      {renderRightIcon()}
    </view>
  )
}

export type { CellProps, CellSize, CellArrowDirection } from './types'
