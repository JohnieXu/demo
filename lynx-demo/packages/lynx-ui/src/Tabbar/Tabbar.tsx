import { createContext, useCallback, useMemo } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace, toArray, toNumber } from '../utils'
import type { Numeric } from '../utils'
import type { TabbarProps } from './types'

const bem = createNamespace('tabbar')

export interface TabbarContextValue {
  active: number | string
  setActive: (value: Numeric) => void
  activeColor?: string
  inactiveColor?: string
}

const TabbarContext = createContext<TabbarContextValue>({
  active: 0,
  setActive: () => {},
})
export { TabbarContext }

const TabbarIndexContext = createContext<number>(0)
export { TabbarIndexContext }

export function Tabbar(props: TabbarProps) {
  const {
    active = 0,
    activeColor = 'var(--lu-color-primary)',
    inactiveColor = 'var(--lu-color-text-tertiary)',
    border = true,
    safeAreaInsetBottom = false,
    children,
    className,
    style,
    onChange,
    onUpdateActive,
  } = props

  const isControlled = active !== undefined
  const actualActive = isControlled ? active : 0

  const setActive = useCallback(
    (value: Numeric) => {
      const next = toNumber(value)
      if (next !== actualActive) {
        onUpdateActive?.(next)
        onChange?.(next)
      }
    },
    [actualActive, onChange, onUpdateActive],
  )

  const contextValue = useMemo(
    () => ({
      active: actualActive,
      setActive,
      activeColor,
      inactiveColor,
    }),
    [actualActive, setActive, activeColor, inactiveColor],
  )

  const childArray = toArray(children)

  return (
    <TabbarContext.Provider value={contextValue}>
      <view
        className={cn(
          bem({
            border,
            'safe-area-bottom': safeAreaInsetBottom,
          }),
          className,
        )}
        style={style}
      >
        {childArray.map((child, index) => (
          <TabbarIndexContext.Provider key={index} value={index}>
            {child}
          </TabbarIndexContext.Provider>
        ))}
      </view>
    </TabbarContext.Provider>
  )
}

export type { TabbarProps } from './types'
