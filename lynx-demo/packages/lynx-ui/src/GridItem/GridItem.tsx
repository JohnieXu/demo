import { useContext, useMemo } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { Badge } from '../Badge'
import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, isDef } from '../utils'
import type { Numeric } from '../utils'
import { GridContext, GridIndexContext } from '../Grid/Grid'
import type { GridItemProps } from './types'

const bem = createNamespace('grid-item')

function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

function resolveIconSvg(name?: string): string {
  if (!name) return ''
  if (name.startsWith('<')) return name
  return icons[name] || ''
}

export function GridItem(props: GridItemProps) {
  const {
    dot,
    text,
    icon,
    badge,
    iconColor,
    iconSize,
    badgeProps,
    children,
    className,
    style,
    onClick,
  } = props

  const grid = useContext(GridContext)
  const index = useContext(GridIndexContext)

  const {
    square,
    gutter,
    columnNum = 4,
    center,
    border,
    reverse,
    direction,
    clickable,
  } = grid

  const colNum = toNumber(columnNum)
  const gutterValue = toNumber(gutter)

  const rootStyle = useMemo<CSSProperties>(() => {
    const percent = `${100 / colNum}%`
    const result: CSSProperties = {
      flexBasis: percent,
    }
    if (square) {
      result.paddingTop = percent
    } else if (gutterValue) {
      result.paddingRight = addUnit(gutterValue)
      if (index >= colNum) {
        result.marginTop = addUnit(gutterValue)
      }
    }
    return { ...result, ...style }
  }, [square, gutterValue, colNum, index, style])

  const contentStyle = useMemo<CSSProperties | undefined>(() => {
    if (square && gutterValue) {
      return {
        right: addUnit(gutterValue),
        bottom: addUnit(gutterValue),
        height: 'auto',
      }
    }
    return undefined
  }, [square, gutterValue])

  const renderIcon = () => {
    if (icon) {
      return (
        <Icon
          svg={resolveIconSvg(icon)}
          size={iconSize ?? grid.iconSize}
          className={bem('icon')}
          style={{ color: iconColor }}
        />
      )
    }
    return null
  }

  const renderBadgeContent = () => {
    if (children) {
      return children
    }
    return (
      <>
        {renderIcon()}
        {text != null && <text className={bem('text')}>{text}</text>}
      </>
    )
  }

  const contentModifiers: Record<string, boolean> = {
    center: !!center,
    square: !!square,
    reverse: !!reverse,
    clickable: !!clickable,
    surround: !!(border && gutterValue),
    border: !!border,
  }
  if (direction) {
    contentModifiers[direction] = true
  }

  return (
    <view
      className={cn(bem({ square: !!square }), className)}
      style={rootStyle}
    >
      <view
        className={cn(bem('content', contentModifiers))}
        style={contentStyle}
        bindtap={onClick}
      >
        {dot || isDef(badge) ? (
          <Badge
            dot={dot}
            content={badge}
            {...badgeProps}
          >
            {renderBadgeContent()}
          </Badge>
        ) : (
          renderBadgeContent()
        )}
      </view>
    </view>
  )
}

export type { GridItemProps } from './types'
