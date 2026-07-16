import { useMemo, useState } from '@lynx-js/react'
import { RadioGroupContext } from '../Radio/context'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { RadioGroupProps } from './types'

const bem = createNamespace('radio-group')

export function RadioGroup(props: RadioGroupProps) {
  const {
    value,
    defaultValue,
    disabled = false,
    checkedColor,
    direction = 'vertical',
    children,
    className,
    style,
    onChange,
  } = props

  const isControlled = value !== undefined
  const [inner, setInner] = useState<string | number | undefined>(defaultValue)
  const actualValue = isControlled ? value : inner

  const contextValue = useMemo(
    () => ({
      value: actualValue,
      disabled,
      checkedColor,
      setValue: (v: string | number) => {
        if (disabled) return
        if (!isControlled) setInner(v)
        onChange?.(v)
      },
    }),
    [actualValue, disabled, checkedColor, isControlled, onChange],
  )

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <view
        className={cn(bem({ vertical: direction === 'vertical' }), className)}
        style={style}
      >
        {children}
      </view>
    </RadioGroupContext.Provider>
  )
}

export type { RadioGroupProps } from './types'
