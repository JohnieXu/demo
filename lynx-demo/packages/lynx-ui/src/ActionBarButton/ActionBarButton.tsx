import { useCallback, useContext, useEffect, useRef, useState } from '@lynx-js/react'
import { Button } from '../Button'
import { ActionBarContext } from '../ActionBar/context'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { ActionBarButtonProps } from './types'

const bem = createNamespace('action-bar-button')

export function ActionBarButton(props: ActionBarButtonProps) {
  const {
    type = 'default',
    text,
    icon,
    color,
    loading,
    disabled,
    children,
    onClick,
    className,
    style,
  } = props

  const { register, itemsRef } = useContext(ActionBarContext)
  const [, setTick] = useState(0)
  const forceUpdate = useCallback(() => setTick((t) => t + 1), [])
  const indexRef = useRef<number | null>(null)

  useEffect(() => {
    const idx = register(true)
    const items = itemsRef.current
    indexRef.current = idx
    forceUpdate()
    return () => {
      if (idx !== null) {
        items[idx] = { isButton: false }
      }
    }
  }, [register, itemsRef, forceUpdate])

  const index = indexRef.current
  const prev = index !== null ? itemsRef.current[index - 1] : undefined
  const next = index !== null ? itemsRef.current[index + 1] : undefined
  const isFirst = index !== null && !(prev && prev.isButton)
  const isLast = index !== null && !(next && next.isButton)

  return (
    <Button
      className={cn(
        bem({ first: isFirst, last: isLast }),
        className,
      )}
      size="lg"
      type={type}
      icon={icon}
      color={color}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children === undefined ? text : children}
    </Button>
  )
}
