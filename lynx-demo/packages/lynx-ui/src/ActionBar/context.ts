import { createContext } from '@lynx-js/react'
import type { ActionBarContextValue } from './types'

export const ActionBarContext = createContext<ActionBarContextValue>({
  index: 0,
  itemsRef: { current: [] },
  register: () => 0,
})
