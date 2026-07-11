// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License, Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMainThreadRef,
  runOnBackground,
  runOnMainThread,
} from '@lynx-js/react'
import type { BaseTouchEvent, CSSProperties } from '@lynx-js/types'
import type { Element } from '@lynx-js/types/main-thread'
import { cn } from '../theme/cn'
import type { RefreshProps, RefreshRef } from './types'

const DEFAULT_HEADER_HEIGHT = 50
const DEFAULT_THRESHOLD = 1
const RESISTANCE = 2.5
const BOUNCE_TRANSITION = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'

/**
 * Read the scroll position of the first scrollable descendant.
 *
 * The native `<refresh>` element expects its second child to be a view that
 * contains a vertically scrollable element (usually `<list>` or
 * `<scroll-view>`). The simulated implementation mirrors that contract:
 * it queries the content view for a scrollable descendant and only starts a
 * pull gesture when that descendant is scrolled to the top.
 */
function getScrollTop(element: Element | null): number {
  'main thread'
  if (!element) return 0

  const el = element as unknown as Record<string, unknown>
  if (typeof el.scrollTop === 'number') {
    return el.scrollTop
  }

  const scrollable =
    (element.querySelector('list') as unknown as Record<string, unknown> | null) ??
    (element.querySelector('scroll-view') as unknown as Record<
      string,
      unknown
    > | null)

  return typeof scrollable?.scrollTop === 'number' ? scrollable.scrollTop : 0
}

/**
 * Set the vertical transform of the content view, optionally animating it.
 *
 * All style updates happen on the main thread so the gesture tracks the finger
 * with no cross-thread latency.
 */
function setContentTransform(
  contentRef: { current: Element | null | undefined },
  offset: number,
  animated: boolean,
) {
  'main thread'
  if (!contentRef.current) return

  contentRef.current.setStyleProperty(
    'transition',
    animated ? BOUNCE_TRANSITION : 'none',
  )
  contentRef.current.setStyleProperty('transform', `translateY(${offset}px)`)
}

export const SimulatedRefresh = forwardRef<RefreshRef, RefreshProps>(
  function SimulatedRefresh(props, ref) {
    const {
      children,
      header,
      headerHeight = DEFAULT_HEADER_HEIGHT,
      threshold = DEFAULT_THRESHOLD,
      onRefresh,
      refreshing,
      enabled = true,
      className,
      style,
    } = props

    const contentRef = useMainThreadRef<Element>()
    const startYRef = useMainThreadRef(0)
    const isDraggingRef = useMainThreadRef(false)
    const pullStartedRef = useMainThreadRef(false)
    const pullOffsetRef = useMainThreadRef(0)
    const isRefreshingRef = useMainThreadRef(false)

    const thresholdPx = headerHeight * threshold

    // Keep the content locked or released in sync with the controlled prop.
    // refs are stable and do not need to be listed as dependencies.
    useEffect(() => {
      if (refreshing) {
        runOnMainThread(() => {
          'main thread'
          isRefreshingRef.current = true
          setContentTransform(contentRef, headerHeight, true)
        })()
      } else {
        runOnMainThread(() => {
          'main thread'
          isRefreshingRef.current = false
          pullStartedRef.current = false
          setContentTransform(contentRef, 0, true)
        })()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing, headerHeight])

    useImperativeHandle(ref, () => ({
      finishRefresh() {
        runOnMainThread(() => {
          'main thread'
          isRefreshingRef.current = false
          pullStartedRef.current = false
          setContentTransform(contentRef, 0, true)
        })()
      },
      startRefresh() {
        runOnMainThread(() => {
          'main thread'
          isRefreshingRef.current = true
          setContentTransform(contentRef, headerHeight, true)
        })()
        onRefresh?.()
      },
    }))

    function handleTouchStart(e: BaseTouchEvent<unknown>) {
      'main thread'
      if (!enabled || isRefreshingRef.current || !contentRef.current) return

      const touch = e.touches[0]
      if (!touch) return

      startYRef.current = touch.clientY
      isDraggingRef.current = true
      pullStartedRef.current = false
      pullOffsetRef.current = 0
      setContentTransform(contentRef, 0, false)
    }

    function handleTouchMove(e: BaseTouchEvent<unknown>) {
      'main thread'
      if (!isDraggingRef.current || isRefreshingRef.current || !contentRef.current)
        return

      const touch = e.touches[0]
      if (!touch) return

      const scrollTop = getScrollTop(contentRef.current)
      const deltaY = touch.clientY - startYRef.current

      if (!pullStartedRef.current) {
        // Only enter pull mode when the inner scrollable is at the top and
        // the finger is moving downward.
        if (scrollTop <= 0 && deltaY > 0) {
          pullStartedRef.current = true
          startYRef.current = touch.clientY
          pullOffsetRef.current = 0
        } else {
          return
        }
      }

      const pullDelta = touch.clientY - startYRef.current
      const maxOffset = headerHeight * threshold
      const offset = Math.max(0, Math.min(pullDelta / RESISTANCE, maxOffset))
      pullOffsetRef.current = offset
      setContentTransform(contentRef, offset, false)
    }

    function handleTouchEnd() {
      'main thread'
      if (!isDraggingRef.current) return
      isDraggingRef.current = false

      if (!pullStartedRef.current) return

      if (pullOffsetRef.current >= thresholdPx) {
        isRefreshingRef.current = true
        pullOffsetRef.current = headerHeight
        setContentTransform(contentRef, headerHeight, true)
        runOnBackground(onRefresh ?? (() => {}))()
      } else {
        pullStartedRef.current = false
        setContentTransform(contentRef, 0, true)
      }
    }

    const defaultHeader = (
      <text className="lu-refresh__header-text">正在刷新...</text>
    )

    const rootStyle: CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }

    const headerStyle: CSSProperties = {
      position: 'absolute',
      top: `${-headerHeight}px`,
      left: 0,
      right: 0,
      height: `${headerHeight}px`,
    }

    return (
      <view
        className={cn('lu-refresh', 'lu-refresh--simulated', className)}
        style={rootStyle}
        main-thread:bindtouchstart={handleTouchStart}
        main-thread:bindtouchmove={handleTouchMove}
        main-thread:bindtouchend={handleTouchEnd}
      >
        <view className="lu-refresh__header" style={headerStyle}>
          {header ?? defaultHeader}
        </view>
        <view
          className="lu-refresh__content"
          style={{ flex: 1, width: '100%' }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          main-thread:ref={contentRef as any}
        >
          {children}
        </view>
      </view>
    )
  },
)
