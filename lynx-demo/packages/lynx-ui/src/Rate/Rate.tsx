import { useState } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { Icon } from '../Icon'
import { icons } from '../Icon/icons'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, isDef } from '../utils'
import type { RateProps } from './types'

const bem = createNamespace('rate')

const DEFAULT_ICON = icons.star
const DEFAULT_VOID_ICON = icons['star-o']

export function Rate(props: RateProps) {
  const {
    value: valueProp,
    defaultValue = 0,
    count = 5,
    size = '20px',
    gutter = '4px',
    color,
    voidColor,
    icon = DEFAULT_ICON,
    voidIcon = DEFAULT_VOID_ICON,
    allowHalf = false,
    readonly = false,
    disabled = false,
    onChange,
    className,
    style,
  } = props

  const isControlled = isDef(valueProp)
  const [innerValue, setInnerValue] = useState(defaultValue)
  const value = isControlled ? valueProp! : innerValue

  const handleSelect = (next: number) => {
    if (readonly || disabled) return
    if (!isControlled) {
      setInnerValue(next)
    }
    onChange?.(next)
  }

  const renderStar = (index: number) => {
    const i = index + 1
    const full = value >= i
    const half = allowHalf && value >= i - 0.5 && value < i
    const activeWidth = full ? '100%' : half ? '50%' : '0%'
    const itemStyle: CSSProperties = {
      width: addUnit(size),
      height: addUnit(size),
      marginRight: index < count - 1 ? addUnit(gutter) : undefined,
    }

    return (
      <view key={i} className={bem('item')} style={itemStyle}>
        <Icon
          svg={voidIcon}
          className={bem('icon', { void: true })}
          style={voidColor ? { color: voidColor } : undefined}
        />
        <view className={bem('active')} style={{ width: activeWidth }}>
          <Icon
            svg={icon}
            className={bem('icon', { active: true })}
            style={{
              color,
              width: addUnit(size),
              height: addUnit(size),
            }}
          />
        </view>
        {!readonly && !disabled && (
          allowHalf ? (
            <>
              <view
                className={bem('half', { left: true })}
                bindtap={() => handleSelect(i - 0.5)}
              />
              <view
                className={bem('half', { right: true })}
                bindtap={() => handleSelect(i)}
              />
            </>
          ) : (
            <view
              className={bem('touch')}
              bindtap={() => handleSelect(i)}
            />
          )
        )}
      </view>
    )
  }

  return (
    <view
      className={cn(
        bem({
          readonly,
          disabled,
          'allow-half': allowHalf,
        }),
        className,
      )}
      style={style}
    >
      {Array.from({ length: count }, (_, index) => renderStar(index))}
    </view>
  )
}

export type { RateProps } from './types'
