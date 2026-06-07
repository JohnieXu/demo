import { useEffect } from '@lynx-js/react'
import { useNavigate, useLocation } from 'react-router'

/**
 * Hook to intercept system back gesture (Android/iOS) and use react-router to navigate.
 */
export function useBackHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onBack = (event: any) => {
      /* background-only */
      // Logic to determine if we should intercept:
      // In this flight app, if we are not on the main query pages, we should try to go back in router history.
      const isRootPage = location.pathname === '/' || location.pathname === '/query'
      
      if (!isRootPage) {
        // Programmatically go back in react-router
        navigate(-1)
        
        // Intercept the native back event to prevent exiting the Lynx app/view
        if (event && typeof event.stopImmediatePropagation === 'function') {
          event.stopImmediatePropagation()
        }
      }
    }

    // Register the backpressed event listener on the global lynx object
    const EventEmitter = lynx.getJSModule("GlobalEventEmitter")
    EventEmitter.addListener('backpressed', onBack)

    return () => {
      // Clean up the listener when the component unmounts
      EventEmitter.removeListener('backpressed', onBack)
    }
  }, [navigate, location.pathname])
}
