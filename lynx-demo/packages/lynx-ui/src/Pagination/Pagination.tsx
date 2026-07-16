import { useEffect, useMemo, useState } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { clamp, createNamespace, isDef } from '../utils'
import type { Numeric } from '../utils'
import type { PaginationProps } from './types'

const bem = createNamespace('pagination')

function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

interface PageItem {
  text: string | number
  number: number
  active?: boolean
}

function makePage(number: number, text: string | number, active?: boolean): PageItem {
  return { number, text, active }
}

export function Pagination(props: PaginationProps) {
  const {
    mode = 'multi',
    prevText,
    nextText,
    pageCount,
    modelValue,
    totalItems,
    showPageSize = 5,
    itemsPerPage = 10,
    forceEllipses = false,
    showPrevButton = true,
    showNextButton = true,
    className,
    style,
    onChange,
    onUpdateModelValue,
  } = props

  const isControlled = modelValue !== undefined
  const [inner, setInner] = useState(1)
  const actualPage = isControlled ? modelValue! : inner

  const count = useMemo(() => {
    const pc = toNumber(pageCount)
    const ti = toNumber(totalItems)
    const ipp = toNumber(itemsPerPage)
    const result = pc || Math.ceil(ti / ipp)
    return Math.max(1, result)
  }, [pageCount, totalItems, itemsPerPage])

  const pages = useMemo(() => {
    const items: PageItem[] = []
    const pageSize = toNumber(showPageSize)
    const isMaxSized = pageSize < count

    let startPage = 1
    let endPage = count

    if (isMaxSized) {
      startPage = Math.max(actualPage - Math.floor(pageSize / 2), 1)
      endPage = startPage + pageSize - 1
      if (endPage > count) {
        endPage = count
        startPage = endPage - pageSize + 1
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(makePage(number, number, number === actualPage))
    }

    if (isMaxSized && pageSize > 0 && forceEllipses) {
      if (startPage > 1) {
        items.unshift(makePage(startPage - 1, '...'))
      }
      if (endPage < count) {
        items.push(makePage(endPage + 1, '...'))
      }
    }

    return items
  }, [actualPage, count, showPageSize, forceEllipses])

  const updateModelValue = (value: number, emitChange?: boolean) => {
    const clamped = clamp(value, 1, count)
    if (actualPage !== clamped) {
      if (!isControlled) {
        setInner(clamped)
      }
      onUpdateModelValue?.(clamped)
      if (emitChange) {
        onChange?.(clamped)
      }
    }
  }

  useEffect(() => {
    if (isControlled) {
      const clamped = clamp(modelValue!, 1, count)
      if (clamped !== modelValue) {
        onUpdateModelValue?.(clamped)
      }
    }
  }, [modelValue, count, isControlled, onUpdateModelValue])

  const renderDesc = () => (
    <view className={bem('page-desc')}>
      {`${actualPage}/${count}`}
    </view>
  )

  const renderPrevButton = () => {
    if (!showPrevButton) return null
    const disabled = actualPage === 1
    return (
      <view
        className={bem('item', {
          disabled,
          border: mode === 'simple',
          prev: true,
        })}
        bindtap={() => !disabled && updateModelValue(actualPage - 1, true)}
      >
        <text className={bem('item-text')}>{prevText || 'Prev'}</text>
      </view>
    )
  }

  const renderNextButton = () => {
    if (!showNextButton) return null
    const disabled = actualPage === count
    return (
      <view
        className={bem('item', {
          disabled,
          border: mode === 'simple',
          next: true,
        })}
        bindtap={() => !disabled && updateModelValue(actualPage + 1, true)}
      >
        <text className={bem('item-text')}>{nextText || 'Next'}</text>
      </view>
    )
  }

  const renderPages = () =>
    pages.map((page) => (
      <view
        key={page.number}
        className={bem('item', {
          active: !!page.active,
          page: true,
        })}
        bindtap={() => updateModelValue(page.number, true)}
      >
        <text className={bem('item-text')}>{page.text}</text>
      </view>
    ))

  return (
    <view
      className={cn(bem(), className)}
      style={style}
    >
      <view className={bem('items')}>
        {renderPrevButton()}
        {mode === 'simple' ? renderDesc() : renderPages()}
        {renderNextButton()}
      </view>
    </view>
  )
}

export type { PaginationProps, PaginationMode } from './types'
