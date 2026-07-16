import { createContext, useMemo } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, toArray } from '../utils'
import type { GridProps } from './types'

const bem = createNamespace('grid')

const GridContext = createContext<GridProps>({
  center: true,
  border: true,
  columnNum: 4,
})
export { GridContext }

const GridIndexContext = createContext<number>(0)
export { GridIndexContext }

export function Grid(props: GridProps) {
  const {
    square = false,
    center = true,
    border = true,
    gutter = 0,
    reverse = false,
    iconSize,
    direction,
    clickable = false,
    columnNum = 4,
    children,
    className,
    style,
  } = props

  const contextValue = useMemo(
    () => ({
      square,
      center,
      border,
      gutter,
      reverse,
      iconSize,
      direction,
      clickable,
      columnNum,
    }),
    [square, center, border, gutter, reverse, iconSize, direction, clickable, columnNum],
  )

  const rootStyle: CSSProperties = {
    paddingLeft: addUnit(gutter),
    ...style,
  }

  const childArray = toArray(children)

  return (
    <GridContext.Provider value={contextValue}>
      <view
        className={cn(
          bem({
            border: border && !gutter,
          }),
          className,
        )}
        style={rootStyle}
      >
        {childArray.map((child, index) => (
          <GridIndexContext.Provider key={index} value={index}>
            {child}
          </GridIndexContext.Provider>
        ))}
      </view>
    </GridContext.Provider>
  )
}

export type { GridProps, GridDirection } from './types'
