import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, getSizeStyle } from '../utils'
import type { LoadingProps } from './types'

const bem = createNamespace('loading')

function SpinnerIcon() {
  return (
    <view className={bem('spinner-lines')}>
      {Array.from({ length: 12 }).map((_, index) => (
        <view
          key={index}
          className={bem('line')}
          style={{ transform: `rotate(${index * 30}deg)` }}
        />
      ))}
    </view>
  )
}

const CIRCULAR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="25 25 50 50">
  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="80, 200" />
</svg>
`

export function Loading(props: LoadingProps) {
  const {
    type = 'circular',
    size,
    color,
    vertical = false,
    textSize,
    textColor,
    children,
    className,
    style,
  } = props

  const iconStyle: CSSProperties = {
    color,
    ...getSizeStyle(size),
  }

  const textStyle: CSSProperties = {
    fontSize: addUnit(textSize),
    color: textColor ?? color,
  }

  return (
    <view
      className={cn(bem({ [type]: true, vertical }), className)}
      style={style}
    >
      <view className={bem('spinner', { [type]: true })} style={iconStyle}>
        {type === 'spinner' ? <SpinnerIcon /> : <svg src={CIRCULAR_SVG} className={bem('circular')} />}
      </view>
      {children != null && (
        <text className={bem('text')} style={textStyle}>{children}</text>
      )}
    </view>
  )
}

export type { LoadingProps, LoadingType } from './types'
