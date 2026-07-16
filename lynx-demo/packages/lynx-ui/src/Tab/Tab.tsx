import { useContext, useEffect, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import { TabsContext } from '../Tabs/context'
import type { TabProps } from './types'

const bem = createNamespace('tabs')

export function Tab(props: TabProps) {
  const {
    title,
    name,
    disabled = false,
    children,
    className,
    style,
  } = props

  const context = useContext(TabsContext)
  const [resolvedName, setResolvedName] = useState<string | number | undefined>(
    undefined,
  )
  const register = context?.register
  const unregister = context?.unregister

  useEffect(() => {
    if (!register || !unregister) return
    const registered = register({ title, name, disabled })
    setResolvedName(registered.name)
    return () => {
      unregister(registered.id)
    }
  }, [title, name, disabled, register, unregister])

  if (!context) return null
  if (resolvedName !== context.active) return null

  return (
    <view className={cn(bem('panel'), className)} style={style}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <text>{children}</text>
      ) : (
        children
      )}
    </view>
  )
}

export type { TabProps } from './types'
