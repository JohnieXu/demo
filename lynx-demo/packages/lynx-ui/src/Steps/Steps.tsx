import { useMemo, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace, toArray } from '../utils'
import { StepsContext, StepIndexContext } from './context'
import type { StepsProps } from './types'

const bem = createNamespace('steps')

export function Steps(props: StepsProps) {
  const {
    active,
    defaultActive = 0,
    direction = 'horizontal',
    activeColor = 'var(--lu-color-primary)',
    inactiveColor = 'var(--lu-color-text-tertiary)',
    clickable = false,
    children,
    className,
    style,
    onClickStep,
  } = props

  const isControlled = active !== undefined
  const [inner, setInner] = useState(defaultActive)
  const actualActive = isControlled ? active! : inner

  const contextValue = useMemo(
    () => ({
      active: actualActive,
      activeColor,
      inactiveColor,
      clickable,
      onClickStep: (index: number) => {
        if (!isControlled) setInner(index)
        onClickStep?.(index)
      },
    }),
    [actualActive, activeColor, inactiveColor, clickable, isControlled, onClickStep],
  )

  const childArray = toArray(children)

  return (
    <StepsContext.Provider value={contextValue}>
      <view className={cn(bem({ [direction]: true }), className)} style={style}>
        <view className={bem('items')}>
          {childArray.map((child, index) => (
            <StepIndexContext.Provider key={index} value={index}>{child}</StepIndexContext.Provider>
          ))}
        </view>
      </view>
    </StepsContext.Provider>
  )
}

export type { StepsProps, StepsDirection } from './types'
