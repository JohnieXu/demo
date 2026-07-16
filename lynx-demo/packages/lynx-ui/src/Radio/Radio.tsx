import { useContext, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { RadioGroupContext } from './context'
import type { RadioProps } from './types'

const bem = createNamespace('radio')

export function Radio(props: RadioProps) {
  const {
    checked,
    defaultChecked = false,
    disabled = false,
    name,
    labelPosition = 'right',
    labelDisabled = false,
    checkedColor = 'var(--lu-color-primary)',
    children,
    className,
    style,
    onChange,
  } = props

  const group = useContext(RadioGroupContext)
  const inGroup = !!(group && name !== undefined && name !== null)

  const [inner, setInner] = useState(defaultChecked)

  let actualChecked = false
  if (inGroup) {
    actualChecked = group!.value === name
  } else {
    actualChecked = checked !== undefined ? !!checked : inner
  }

  const finalDisabled = disabled || (group?.disabled ?? false)
  const finalColor = group?.checkedColor ?? checkedColor

  const toggle = () => {
    if (finalDisabled) return
    if (inGroup) {
      if (actualChecked) return
      group!.setValue(name!)
      onChange?.(true)
    } else if (checked === undefined) {
      setInner(true)
      onChange?.(true)
    }
  }

  return (
    <view
      className={cn(
        bem({
          'label-left': labelPosition === 'left',
          disabled: finalDisabled,
          checked: actualChecked,
        }),
        className,
      )}
      style={style}
      bindtap={toggle}
    >
      <view
        className={bem('icon')}
        style={
          actualChecked
            ? { borderColor: finalColor }
            : undefined
        }
      >
        <view
          className={bem('dot')}
          style={actualChecked ? { backgroundColor: finalColor } : undefined}
        />
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

export type { RadioProps } from './types'
