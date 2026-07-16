import { useContext, useEffect, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { CheckboxGroupContext } from './context'
import type { CheckboxProps } from './types'

const bem = createNamespace('checkbox')

export function Checkbox(props: CheckboxProps) {
  const {
    shape = 'round',
    checked,
    defaultChecked,
    disabled = false,
    name,
    labelPosition = 'right',
    labelDisabled = false,
    checkedColor = 'var(--lu-color-primary)',
    indeterminate = false,
    children,
    className,
    style,
    onChange,
  } = props

  const group = useContext(CheckboxGroupContext)

  const inGroup = !!(group && name !== undefined && name !== null)

  const [inner, setInner] = useState(!!defaultChecked)

  useEffect(() => {
    if (group && name !== undefined && name !== null) {
      // sync nothing — group is the source of truth
    }
  }, [group, name])

  let actualChecked = false
  if (inGroup) {
    actualChecked = group!.value.includes(name!)
  } else {
    actualChecked = checked !== undefined ? !!checked : inner
  }

  const finalDisabled =
    disabled || (group?.disabled ?? false)

  const finalShape = group?.shape ?? shape

  const toggle = () => {
    if (finalDisabled) return
    const next = !actualChecked
    if (inGroup) {
      group!.toggle(name!)
    } else if (checked === undefined) {
      setInner(next)
    }
    onChange?.(next)
  }

  return (
    <view
      className={cn(
        bem({
          [finalShape]: true,
          'label-left': labelPosition === 'left',
          disabled: finalDisabled,
          checked: actualChecked,
          indeterminate,
        }),
        className,
      )}
      style={style}
      bindtap={toggle}
    >
      <view
        className={bem('icon')}
        style={actualChecked ? { borderColor: checkedColor, backgroundColor: checkedColor } : undefined}
      >
        {actualChecked && !indeterminate && (
          <view className={bem('check')} />
        )}
        {indeterminate && (
          <view className={bem('indeterminate')} />
        )}
      </view>
      {children != null && (
        <view
          className={cn(bem('label'))}
          catchtap={labelDisabled ? toggle : undefined}
        >
          {typeof children === 'string' || typeof children === 'number' ? (
            <text>{children}</text>
          ) : (
            children
          )}
        </view>
      )}
    </view>
  )
}

export type { CheckboxProps } from './types'
