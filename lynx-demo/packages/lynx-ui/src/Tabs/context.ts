import { createContext } from '@lynx-js/react'

export interface TabMeta {
  id: number
  name: string | number
  title: string
  disabled: boolean
}

export interface TabsContextValue {
  active: string | number | undefined
  register: (tab: { title: string; name?: string | number; disabled?: boolean }) => { id: number; name: string | number }
  unregister: (id: number) => void
}

export const TabsContext = createContext<TabsContextValue | null>(null)
