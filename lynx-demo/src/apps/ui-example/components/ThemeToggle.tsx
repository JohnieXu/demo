import { useOutletContext } from 'react-router'
import type { UiExampleContext } from '../App'

/**
 * Toggles the app-wide light/dark theme via the ConfigProvider state held in
 * App and exposed through the router Outlet context.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useOutletContext<UiExampleContext>()
  const isDark = theme === 'dark'

  return (
    <view
      className="theme-toggle"
      bindtap={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <text className="theme-toggle__text">{isDark ? '深色' : '浅色'}</text>
    </view>
  )
}
