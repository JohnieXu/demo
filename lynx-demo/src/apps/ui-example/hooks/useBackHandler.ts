import { useEffect } from '@lynx-js/react'
import { useLocation, useNavigate } from 'react-router'

/**
 * Intercept the hardware/system back gesture: navigate back within the
 * in-app MemoryRouter stack unless we're already on the home ('/') route,
 * in which case the event is left to the platform. Mirrors the pattern in
 * src/apps/flight/hooks/useBackHandler.ts.
 */
export function useBackHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onBack = (...args: unknown[]) => {
      const isRoot = location.pathname === '/'
      if (!isRoot) {
        navigate(-1)
        const event = args[0] as
          | { stopImmediatePropagation?: () => void }
          | undefined
        event?.stopImmediatePropagation?.()
      }
    }

    const emitter = lynx?.getJSModule?.('GlobalEventEmitter')
    emitter?.addListener?.('backpressed', onBack)
    return () => emitter?.removeListener?.('backpressed', onBack)
  }, [navigate, location.pathname])
}
