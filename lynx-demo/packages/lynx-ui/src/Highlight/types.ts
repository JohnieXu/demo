import type { ReactNode } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'

export interface HighlightProps {
  autoEscape?: boolean
  caseSensitive?: boolean
  highlightClass?: string
  highlightTag?: keyof JSX.IntrinsicElements
  keywords: string | string[]
  sourceString: string
  tag?: keyof JSX.IntrinsicElements
  unhighlightClass?: string
  unhighlightTag?: keyof JSX.IntrinsicElements
  children?: (chunks: HighlightChunk[]) => ReactNode
  className?: string
  style?: CSSProperties
}

export interface HighlightChunk {
  start: number
  end: number
  highlight: boolean
  text: string
}
