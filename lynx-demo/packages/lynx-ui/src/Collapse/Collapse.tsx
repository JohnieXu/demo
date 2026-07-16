import { useMemo, useState } from '@lynx-js/react'
import type { Numeric } from '../utils'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { CollapseContext } from './context'
import type { CollapseProps } from './types'

const bem = createNamespace('collapse')

export function Collapse(props: CollapseProps) {
  const {
    value,
    defaultValue,
    accordion = false,
    border = true,
    children,
    className,
    style,
    onChange,
  } = props

  const isControlled = value !== undefined
  const initial = useMemo(() => {
    if (defaultValue !== undefined) return defaultValue
    return accordion ? '' : []
  }, [defaultValue, accordion])

  const [inner, setInner] = useState<Numeric | Numeric[]>(initial)
  const actualValue = isControlled ? value! : inner

  const expandedNames = useMemo(() => {
    if (accordion) {
      const name = actualValue as Numeric
      return name === '' || name == null ? [] : [name]
    }
    return (actualValue as Numeric[]).slice()
  }, [actualValue, accordion])

  const contextValue = useMemo(
    () => ({
      accordion,
      expandedNames,
      toggle: (name: Numeric, expanded: boolean) => {
        if (accordion) {
          const next = expanded ? '' : name
          if (!isControlled) setInner(next)
          onChange?.(next)
        } else {
          const list = (actualValue as Numeric[]) ?? []
          const next = expanded
            ? list.concat(name)
            : list.filter((n) => n !== name)
          if (!isControlled) setInner(next)
          onChange?.(next)
        }
      },
    }),
    [accordion, expandedNames, actualValue, isControlled, onChange],
  )

  return (
    <CollapseContext.Provider value={contextValue}>
      <view className={cn(bem({ border }), className)} style={style}>
        {children}
      </view>
    </CollapseContext.Provider>
  )
}

export type { CollapseProps } from './types'
