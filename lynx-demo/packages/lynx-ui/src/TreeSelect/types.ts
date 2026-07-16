import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type TreeSelectChild = {
  id: Numeric
  text: string
  disabled?: boolean
}

export type TreeSelectItem = {
  dot?: boolean
  text: string
  badge?: Numeric
  children?: TreeSelectChild[]
  disabled?: boolean
  className?: string
}

export interface TreeSelectProps {
  items?: TreeSelectItem[]
  height?: Numeric
  max?: Numeric
  selectedIcon?: string
  mainActiveIndex?: Numeric
  activeId?: Numeric | Numeric[]
  renderNavText?: (item: TreeSelectItem) => ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClickNav?: (index: number) => void
  onClickItem?: (item: TreeSelectChild) => void
  onUpdateMainActiveIndex?: (index: number) => void
  onUpdateActiveId?: (activeId: Numeric | Numeric[]) => void
}
