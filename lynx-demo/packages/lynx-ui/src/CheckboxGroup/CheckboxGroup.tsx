import { useMemo, useState } from '@lynx-js/react'
import { CheckboxGroupContext } from '../Checkbox/context'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { CheckboxGroupProps } from './types'

const bem = createNamespace('checkbox-group')

export function CheckboxGroup(props: CheckboxGroupProps) {
  const {
    value,
    defaultValue = [],
    disabled = false,
    max,
    shape,
    checkedColor,
    children,
    className,
    style,
    onChange,
  } = props

  const isControlled = value !== undefined
  const [inner, setInner] = useState<Array<string | number>>(defaultValue)

  const actualValue = isControlled ? value! : inner

  const contextValue = useMemo(
    () => ({
      value: actualValue,
      disabled,
      max,
      shape,
      checkedColor,
      toggle: (name: string | number) => {
        if (disabled) return
        const next = actualValue.includes(name)
          ? actualValue.filter((v) => v !== name)
          : (() => {
              if (max && actualValue.length >= max) return actualValue
              return [...actualValue, name]
            })()
        if (next === actualValue) return
        if (!isControlled) setInner(next)
        onChange?.(next)
      },
    }),
    [actualValue, disabled, max, shape, checkedColor, isControlled, onChange],
  )

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <view className={cn(bem(), className)} style={style}>
        {children}
      </view>
    </CheckboxGroupContext.Provider>
  )
}

export type { CheckboxGroupProps } from './types'
