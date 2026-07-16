import type { CSSProperties } from '@lynx-js/types'
import type { Numeric } from '../utils'

export type PaginationMode = 'simple' | 'multi'

export interface PaginationProps {
  mode?: PaginationMode
  prevText?: string
  nextText?: string
  pageCount?: Numeric
  modelValue?: number
  totalItems?: Numeric
  showPageSize?: Numeric
  itemsPerPage?: Numeric
  forceEllipses?: boolean
  showPrevButton?: boolean
  showNextButton?: boolean
  className?: string
  style?: CSSProperties
  onChange?: (page: number) => void
  onUpdateModelValue?: (page: number) => void
}
