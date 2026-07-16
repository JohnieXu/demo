import { useCallback, useMemo, useRef, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { ActionBarContext } from './context'
import type { ActionBarChild, ActionBarProps } from './types'

const bem = createNamespace('action-bar')

export function ActionBar(props: ActionBarProps) {
  const {
    placeholder,
    safeAreaInsetBottom = true,
    children,
    className,
    style,
  } = props

  const itemsRef = useRef<ActionBarChild[]>([])
  const [index, setIndex] = useState(0)

  const register = useCallback((isButton: boolean) => {
    const currentIndex = itemsRef.current.length
    itemsRef.current.push({ isButton })
    setIndex(currentIndex + 1)
    return currentIndex
  }, [])

  const contextValue = useMemo(
    () => ({ index, itemsRef, register }),
    [index, register],
  )

  const actionBar = (
    <view
      className={cn(bem({ 'safe-area-bottom': safeAreaInsetBottom }), className)}
      style={style}
    >
      {children}
    </view>
  )

  return (
    <ActionBarContext.Provider value={contextValue}>
      {placeholder ? (
        <>
          {actionBar}
          <view className={bem('placeholder')} style={{ height: 'var(--lu-action-bar-height, 50px)' }} />
        </>
      ) : (
        actionBar
      )}
    </ActionBarContext.Provider>
  )
}
