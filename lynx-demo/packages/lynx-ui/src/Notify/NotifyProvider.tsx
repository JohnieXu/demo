import { useEffect, useState } from '@lynx-js/react'
import { getNotifyState, subscribe } from './controller'
import { Notify } from './Notify'
import type { NotifyState, NotifyProviderProps } from './types'

export function NotifyProvider(props: NotifyProviderProps) {
  const { children } = props
  const [state, setState] = useState<NotifyState | undefined>(getNotifyState)

  useEffect(() => {
    setState(getNotifyState())
    return subscribe(() => {
      setState(getNotifyState())
    })
  }, [])

  return (
    <>
      {children}
      {state && (
        <Notify
          {...state}
          show={!state.closing}
        />
      )}
    </>
  )
}
