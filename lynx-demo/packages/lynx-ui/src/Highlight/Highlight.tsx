import { useMemo } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { HighlightProps } from './types'

const bem = createNamespace('highlight')

function toArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item]
}

export function Highlight(props: HighlightProps) {
  const {
    autoEscape = true,
    caseSensitive = false,
    highlightClass,
    keywords,
    sourceString,
    tag = 'view',
    unhighlightClass,
    children,
    className,
    style,
  } = props

  const chunks = useMemo(() => {
    const flags = caseSensitive ? 'g' : 'gi'
    const keywordList = toArray(keywords).filter(Boolean)

    let rawChunks: { start: number; end: number; highlight: boolean }[] = []

    keywordList.forEach((keyword) => {
      let escaped = keyword
      if (autoEscape) {
        escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      }
      const regex = new RegExp(escaped, flags)
      let match: RegExpExecArray | null
      while ((match = regex.exec(sourceString))) {
        const start = match.index
        const end = regex.lastIndex
        if (start >= end) {
          regex.lastIndex++
          continue
        }
        rawChunks.push({ start, end, highlight: true })
      }
    })

    rawChunks = rawChunks
      .sort((a, b) => a.start - b.start)
      .reduce<typeof rawChunks>((merged, current) => {
        const prev = merged[merged.length - 1]
        if (!prev || current.start > prev.end) {
          const unhighlightStart = prev ? prev.end : 0
          const unhighlightEnd = current.start
          if (unhighlightStart !== unhighlightEnd) {
            merged.push({
              start: unhighlightStart,
              end: unhighlightEnd,
              highlight: false,
            })
          }
          merged.push(current)
        } else {
          prev.end = Math.max(prev.end, current.end)
        }
        return merged
      }, [])

    const lastChunk = rawChunks[rawChunks.length - 1]
    if (!lastChunk) {
      rawChunks.push({ start: 0, end: sourceString.length, highlight: false })
    } else if (lastChunk.end < sourceString.length) {
      rawChunks.push({
        start: lastChunk.end,
        end: sourceString.length,
        highlight: false,
      })
    }

    return rawChunks.map((chunk) => ({
      ...chunk,
      text: sourceString.slice(chunk.start, chunk.end),
    }))
  }, [autoEscape, caseSensitive, keywords, sourceString])

  if (children) {
    return children(chunks)
  }

  const content = chunks.map((chunk, index) => {
    if (chunk.highlight) {
      return (
        <text
          key={index}
          className={cn(bem('tag'), highlightClass)}
        >
          {chunk.text}
        </text>
      )
    }
    return (
      <text
        key={index}
        className={unhighlightClass}
      >
        {chunk.text}
      </text>
    )
  })

  if (tag === 'text') {
    return (
      <text className={cn(bem(), className)} style={style}>
        {content}
      </text>
    )
  }

  return (
    <view className={cn(bem(), className)} style={style}>
      {content}
    </view>
  )
}

export type { HighlightProps, HighlightChunk } from './types'
