import {
  createContext,
  useMemo,
} from '@lynx-js/react'
import type { ReactElement } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace, isDef, toArray } from '../utils'
import type { Numeric } from '../utils'
import type { RowProps } from './types'

const bem = createNamespace('row')

export type RowSpaces = { left?: number; right: number }[]
export type VerticalSpaces = { bottom?: number }[]

interface RowContextValue {
  spaces: RowSpaces
  verticalSpaces: VerticalSpaces
}

const RowContext = createContext<RowContextValue>({
  spaces: [],
  verticalSpaces: [],
})
export { RowContext }

const RowIndexContext = createContext<number>(0)
export { RowIndexContext }

function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

function isReactElement(child: unknown): child is ReactElement<{ span?: Numeric }> {
  return typeof child === 'object' && child !== null && 'props' in child
}

export function Row(props: RowProps) {
  const {
    wrap = true,
    align,
    gutter = 0,
    justify,
    children,
    className,
    style,
  } = props

  const childArray = toArray(children)

  const groups = useMemo(() => {
    const result: number[][] = [[]]
    let totalSpan = 0
    childArray.forEach((child) => {
      if (!isReactElement(child)) return
      const span = toNumber(child.props.span)
      totalSpan += span
      if (totalSpan > 24) {
        result.push([span])
        totalSpan = span
      } else {
        result[result.length - 1].push(span)
      }
    })
    return result
  }, [childArray])

  const spaces = useMemo(() => {
    const result: RowSpaces = []
    let gutterValue = 0
    if (Array.isArray(gutter)) {
      gutterValue = toNumber(gutter[0])
    } else {
      gutterValue = toNumber(gutter)
    }
    if (gutterValue <= 0) return result

    groups.forEach((group) => {
      const averagePadding = (gutterValue * (group.length - 1)) / group.length
      group.forEach((_, index) => {
        if (index === 0) {
          result.push({ right: averagePadding })
        } else {
          const left = gutterValue - result[result.length - 1].right
          const right = averagePadding - left
          result.push({ left, right })
        }
      })
    })
    return result
  }, [gutter, groups])

  const verticalSpaces = useMemo(() => {
    const result: VerticalSpaces = []
    if (Array.isArray(gutter) && gutter.length > 1) {
      const bottom = toNumber(gutter[1])
      if (bottom <= 0) return result
      groups.forEach((group, index) => {
        if (index === groups.length - 1) return
        group.forEach(() => {
          result.push({ bottom })
        })
      })
    }
    return result
  }, [gutter, groups])

  const contextValue = useMemo(
    () => ({ spaces, verticalSpaces }),
    [spaces, verticalSpaces],
  )

  return (
    <RowContext.Provider value={contextValue}>
      <view
        className={cn(
          bem({
            [`align-${align}`]: !!align,
            [`justify-${justify}`]: !!justify,
            nowrap: !wrap,
          }),
          className,
        )}
        style={style}
      >
        {childArray.map((child, index) => (
          <RowIndexContext.Provider key={index} value={index}>
            {child}
          </RowIndexContext.Provider>
        ))}
      </view>
    </RowContext.Provider>
  )
}

export type { RowProps, RowAlign, RowJustify } from './types'
