import { useCallback, useRef, useState } from '@lynx-js/react'
import { Outlet } from 'react-router'
import { ConfigProvider, NotifyProvider, ToastProvider } from 'lynx-ui'
import type { ThemeMode } from 'lynx-ui'
import { useBackHandler } from './hooks/useBackHandler'
import './App.css'

/** Shape of the value shared to child routes via the Outlet context. */
export interface UiExampleContext {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  /** Read the cached scroll offset of the Home list. */
  getHomeScrollTop: () => number
  /** Update the cached scroll offset of the Home list. */
  setHomeScrollTop: (scrollTop: number) => void
}

export function App() {
  // Intercept the system back gesture for in-stack navigation.
  useBackHandler()

  const [theme, setTheme] = useState<ThemeMode>('light')

  // Cache the Home list scroll offset so we can restore it when the user
  // navigates back from a component demo. A ref is used to avoid re-renders.
  const homeScrollTopRef = useRef(0)
  const getHomeScrollTop = useCallback(() => homeScrollTopRef.current, [])
  const setHomeScrollTop = useCallback((scrollTop: number) => {
    homeScrollTopRef.current = scrollTop
  }, [])

  const context: UiExampleContext = { theme, setTheme, getHomeScrollTop, setHomeScrollTop }

  return (
    <ConfigProvider theme={theme} className="ui-example-root">
      <ToastProvider>
        <NotifyProvider>
          <view className="ui-example">
            <Outlet context={context} />
          </view>
        </NotifyProvider>
      </ToastProvider>
    </ConfigProvider>
  )
}
