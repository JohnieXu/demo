import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { addUnit, clamp, createNamespace } from '../utils'
import type { Numeric } from '../utils'
import type { ProgressProps } from './types'

const bem = createNamespace('progress')

function formatRate(rate?: Numeric): number {
  if (rate === undefined || rate === null) return 0
  const num = Number(rate)
  if (Number.isNaN(num)) return 0
  return clamp(num, 0, 100)
}

export function Progress(props: ProgressProps) {
  const {
    color,
    inactive = false,
    pivotText,
    textColor,
    showPivot = true,
    pivotColor,
    trackColor,
    strokeWidth,
    percentage = 0,
    className,
    style,
  } = props

  const safePercentage = formatRate(percentage)

  const rootStyle: CSSProperties = {
    backgroundColor: trackColor,
    height: addUnit(strokeWidth),
    ...style,
  }

  const portionStyle: CSSProperties = {
    width: `${safePercentage}%`,
    backgroundColor: inactive ? undefined : color,
  }

  const pivotTextValue = pivotText ?? `${safePercentage}%`

  const renderPivot = () => {
    if (!showPivot || !pivotTextValue) return null
    const pivotStyle: CSSProperties = {
      color: textColor,
      left: `${safePercentage}%`,
      transform: `translate(-${safePercentage}%, -50%)`,
      backgroundColor: pivotColor || color,
    }
    return (
      <text
        className={bem('pivot', { inactive })}
        style={pivotStyle}
      >
        {pivotTextValue}
      </text>
    )
  }

  return (
    <view
      className={cn(bem(), className)}
      style={rootStyle}
    >
      <view
        className={bem('portion', { inactive })}
        style={portionStyle}
      />
      {renderPivot()}
    </view>
  )
}

export type { ProgressProps } from './types'
