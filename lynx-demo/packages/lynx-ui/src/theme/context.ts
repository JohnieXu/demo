import { createContext, useContext } from '@lynx-js/react'
import type { ConfigContextValue } from './types'

export const ConfigContext = createContext<ConfigContextValue>({
  theme: 'light',
  themeClass: 'lynx-theme-light',
})

export function useConfig() {
  return useContext(ConfigContext)
}
