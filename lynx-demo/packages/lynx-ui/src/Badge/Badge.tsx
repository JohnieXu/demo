import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, isDef, isNumeric } from '../utils'
import type { BadgeProps } from './types'

const bem = createNamespace('badge')

export function Badge(props: BadgeProps) {
  const {
    dot = false,
    max,
    color,
    offset,
    content,
    showZero = false,
    position = 'top-right',
    children,
    className,
    style,
  } = props

  const hasContent = () => {
    if (isDef(content) && content !== '') {
      return showZero || (content !== 0 && content !== '0')
    }
    return false
  }

  const renderContent = () => {
    if (dot || !hasContent()) return null

    if (isDef(max) && isNumeric(content!) && +content > +max) {
      return `${max}+`
    }

    return content
  }

  const getOffsetWithMinusString = (val: string) => {
    return val.startsWith('-') ? val.replace('-', '') : `-${val}`
  }

  const getBadgeStyle = (): CSSProperties => {
    const result: CSSProperties = { backgroundColor: color }

    if (offset) {
      const [x, y] = offset
      const [offsetY, offsetX] = position.split('-') as ['top' | 'bottom', 'left' | 'right']

      if (children) {
        if (typeof y === 'number') {
          result[offsetY] = addUnit(offsetY === 'top' ? y : -y)
        } else {
          result[offsetY] = offsetY === 'top' ? addUnit(y) : getOffsetWithMinusString(y)
        }

        if (typeof x === 'number') {
          result[offsetX] = addUnit(offsetX === 'left' ? x : -x)
        } else {
          result[offsetX] = offsetX === 'left' ? addUnit(x) : getOffsetWithMinusString(x)
        }
      } else {
        result.marginTop = addUnit(y)
        result.marginLeft = addUnit(x)
      }
    }

    return result
  }

  const renderBadge = (modifier: 'fixed' | 'inline' = 'fixed') => {
    if (!hasContent() && !dot) return null

    return (
      <view
        className={cn(bem({ dot, [modifier]: true, [position]: true }))}
        style={getBadgeStyle()}
      >
        <text className={bem('text')}>{renderContent()}</text>
      </view>
    )
  }

  if (children) {
    return (
      <view className={cn(bem('wrapper'), className)} style={style}>
        {children}
        {renderBadge('fixed')}
      </view>
    )
  }

  return renderBadge('inline')
}

export type { BadgeProps, BadgePosition } from './types'
