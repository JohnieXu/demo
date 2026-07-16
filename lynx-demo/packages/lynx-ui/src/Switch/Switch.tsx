import { useEffect, useState } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { Loading } from '../Loading'
import { cn } from '../theme/cn'
import { addUnit, createNamespace } from '../utils'
import type { SwitchProps } from './types'

const bem = createNamespace('switch')

export function Switch(props: SwitchProps) {
  const {
    size = '30px',
    loading = false,
    disabled = false,
    checked,
    defaultChecked = false,
    activeColor = 'var(--lu-color-primary)',
    inactiveColor = 'var(--lu-color-disabled-bg)',
    className,
    style,
    onChange,
  } = props

  const isControlled = checked !== undefined
  const [inner, setInner] = useState(defaultChecked)
  const actualChecked = isControlled ? !!checked : inner

  useEffect(() => {
    // keep controlled value in sync when nothing else does.
  }, [checked])

  const handleTap = () => {
    if (disabled || loading) return
    const next = !actualChecked
    if (!isControlled) {
      setInner(next)
    }
    onChange?.(next)
  }

  const wrapperStyle: CSSProperties = {
    width: `calc(${addUnit(size)} * 2)`,
    height: addUnit(size),
    backgroundColor: actualChecked ? activeColor : inactiveColor,
    ...style,
  }

  const nodeStyle: CSSProperties = {
    width: addUnit(size),
    height: addUnit(size),
  }

  return (
    <view
      className={cn(
        bem({ on: actualChecked, loading, disabled }),
        className,
      )}
      style={wrapperStyle}
      bindtap={handleTap}
    >
      <view className={bem('node')} style={nodeStyle}>
        {loading && (
          <Loading
            type="spinner"
            color={actualChecked ? activeColor : inactiveColor}
            className={bem('loading')}
          />
        )}
      </view>
    </view>
  )
}

export type { SwitchProps } from './types'
