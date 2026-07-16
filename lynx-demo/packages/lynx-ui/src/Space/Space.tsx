import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { SpaceProps, SpaceSize } from './types'

const bem = createNamespace('space')

function toArray(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = []
  const collect = (node: ReactNode) => {
    if (node == null || typeof node === 'boolean') return
    if (Array.isArray(node)) {
      node.forEach(collect)
    } else {
      result.push(node)
    }
  }
  collect(children)
  return result
}

function getMargin(size: SpaceSize): string {
  return typeof size === 'number' ? `${size}px` : size
}

export function Space(props: SpaceProps) {
  const {
    align,
    direction = 'horizontal',
    size = 8,
    wrap = false,
    fill = false,
    children,
    className,
    style,
  } = props

  const mergedAlign = align ?? (direction === 'horizontal' ? 'center' : undefined)
  const horizontalSize = Array.isArray(size) ? size[0] : size
  const verticalSize = Array.isArray(size) ? size[1] : size

  const getMarginStyle = (isLast: boolean): CSSProperties => {
    const marginRight = getMargin(horizontalSize)
    const marginBottom = getMargin(verticalSize)

    if (isLast) {
      return wrap ? { marginBottom } : {}
    }

    const result: CSSProperties = {}
    if (direction === 'horizontal') {
      result.marginRight = marginRight
    }
    if (direction === 'vertical' || wrap) {
      result.marginBottom = marginBottom
    }
    return result
  }

  const validChildren = toArray(children)

  return (
    <view
      className={cn(
        bem({
          [direction]: true,
          [`align-${mergedAlign}`]: true,
          wrap,
          fill,
        }),
        className,
      )}
      style={style}
    >
      {validChildren.map((child, index) => {
        const isLast = index === validChildren.length - 1
        return (
          <view
            key={`space-item-${index}`}
            className="lu-space-item"
            style={getMarginStyle(isLast)}
          >
            {child}
          </view>
        )
      })}
    </view>
  )
}

export type { SpaceProps, SpaceSize, SpaceAlign, SpaceDirection } from './types'
