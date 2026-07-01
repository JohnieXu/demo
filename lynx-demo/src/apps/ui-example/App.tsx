import { useState } from '@lynx-js/react'
import { Outlet } from 'react-router'
import { ConfigProvider } from 'lynx-ui'
import type { ThemeMode } from 'lynx-ui'
import { useBackHandler } from './hooks/useBackHandler'
import './App.css'

/** Shape of the value shared to child routes via the Outlet context. */
export interface UiExampleContext {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

export function App() {
  // Intercept the system back gesture for in-stack navigation.
  useBackHandler()

  const [theme, setTheme] = useState<ThemeMode>('light')
  const context: UiExampleContext = { theme, setTheme }

  return (
    <ConfigProvider theme={theme} className="ui-example-root">
      <view className="ui-example">
        <Outlet context={context} />
      </view>
    </ConfigProvider>
  )
}
