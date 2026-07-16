import { createContext, useCallback, useMemo } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace, toArray, toNumber } from '../utils'
import type { SidebarProps } from './types'

const bem = createNamespace('sidebar')

export interface SidebarContextValue {
  active: number
  setActive: (value: number) => void
}

const SidebarContext = createContext<SidebarContextValue>({
  active: 0,
  setActive: () => {},
})
export { SidebarContext }

const SidebarIndexContext = createContext<number>(0)
export { SidebarIndexContext }

export function Sidebar(props: SidebarProps) {
  const {
    active = 0,
    children,
    className,
    style,
    onChange,
    onUpdateActive,
  } = props

  const isControlled = active !== undefined
  const actualActive = isControlled ? active : 0

  const setActive = useCallback(
    (value: number) => {
      if (value !== actualActive) {
        onUpdateActive?.(value)
        onChange?.(value)
      }
    },
    [actualActive, onChange, onUpdateActive],
  )

  const contextValue = useMemo(
    () => ({ active: toNumber(actualActive), setActive }),
    [actualActive, setActive],
  )

  const childArray = toArray(children)

  return (
    <SidebarContext.Provider value={contextValue}>
      <view
        className={cn(bem(), className)}
        style={style}
      >
        {childArray.map((child, index) => (
          <SidebarIndexContext.Provider key={index} value={index}>
            {child}
          </SidebarIndexContext.Provider>
        ))}
      </view>
    </SidebarContext.Provider>
  )
}

export type { SidebarProps } from './types'
