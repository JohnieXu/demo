import { createContext } from '@lynx-js/react'
import type { Numeric } from '../utils'

export interface CollapseContextValue {
  accordion: boolean
  expandedNames: Numeric[]
  toggle: (name: Numeric, expanded: boolean) => void
}

export const CollapseContext = createContext<CollapseContextValue | null>(null)
