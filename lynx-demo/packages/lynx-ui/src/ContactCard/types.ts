import type { CSSProperties } from '@lynx-js/types'

export type ContactCardType = 'add' | 'edit'

export interface ContactCardProps {
  tel?: string
  name?: string
  type?: ContactCardType
  addText?: string
  editable?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}
