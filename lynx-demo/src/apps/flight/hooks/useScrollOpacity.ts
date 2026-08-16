/* eslint-disable @typescript-eslint/no-explicit-any */
import { runOnBackground, runOnMainThread, useCallback, useEffect, useMemo, useState } from '@lynx-js/react'
import type { ScrollEvent } from '@lynx-js/types'
import type { MainThread } from '@lynx-js/types'

export interface UseScrollOpacityOptions {
  /**
   * Scroll distance (in px) at which the opacity reaches `endOpacity`.
   * - scrollTop <= 0         → startOpacity
   * - scrollTop >= threshold → endOpacity
   * - in-between             → linear interpolation by scrollTop / threshold
   */
  threshold: number
  /** Opacity when scrollTop is at the top. @default 1 */
  startOpacity?: number
  /** Opacity when scrollTop has reached (or passed) the threshold. @default 0 */
  endOpacity?: number
  /**
   * Optional main-thread style setter invoked synchronously on the main thread.
   * Must be a function marked with the `'main thread'` directive.
   *
   * Prefer `mainThreadRef` when you only need to set the element's opacity —
   * it is resolved through a hook-owned `MainThreadRef`, so the main-thread
   * scroll handler does not depend on a caller-supplied callback captured
   * from background-thread scope.
   *
   * @default undefined
   */
  setStyleMT?: (opacity: number) => void
  /**
   * Optional `MainThreadRef` of the element whose `opacity` style should be
   * driven directly on the main thread. When provided, the hook sets
   * `opacity` via `setStyleProperty` on the main thread without requiring a
   * caller-supplied `setStyleMT` closure.
   */
  mainThreadRef?: { current: MainThread.Element | null }
}

export interface UseScrollOpacityReturn {
  /** Current opacity in the [startOpacity, endOpacity] range. */
  opacity: number
  /** The inverse of `opacity`, i.e. `1 - opacity`. */
  inverseOpacity: number
  /** Bind this to a scrollable view's `onScroll` prop. */
  handleScroll: (e: ScrollEvent) => void
  /** Bind this to a scrollable view's `main-thread:onScroll` prop. */
  handleScrollMT: (e: any) => void
}

/**
 * Drive a NavBar-style opacity from a scroll event's `scrollTop`.
 *
 * Below `threshold`, opacity transitions linearly from `startOpacity` to
 * `endOpacity` based on the scroll distance; once `threshold` is exceeded,
 * opacity is clamped to `endOpacity`. The returned `handleScroll` is tagged
 * with the `'background only'` directive so it can be wired directly to a
 * Lynx scrollable view's `onScroll`.
 *
 * @example
 *   const { opacity, handleScroll, handleScrollMT } = useScrollOpacity({ threshold: 80 })
 *   <NavBar backgroundOpacity={opacity} />
 *   <List onScroll={handleScroll} main-thread:onScroll={handleScrollMT} />
 */
export function useScrollOpacity(
  options: UseScrollOpacityOptions,
): UseScrollOpacityReturn {
  const { threshold, startOpacity = 1, endOpacity = 0, setStyleMT, mainThreadRef } = options
  const [opacity, setOpacity] = useState(startOpacity)

  const inverseOpacity = useMemo(() => Math.max(0, 1 - opacity), [opacity])

  // Sync the initial opacity to the main-thread element on mount.
  useEffect(() => {
    if (setStyleMT) {
      runOnMainThread(setStyleMT)(startOpacity)
    }
  }, [setStyleMT, startOpacity])

  const handleScroll = useCallback(
    (e: ScrollEvent) => {
      'background only'
      console.log(e, 'scrollTop', e.detail.scrollTop)
      
      const scrollTop = e.detail.scrollTop || 0

      if (scrollTop <= 0) {
        setOpacity(startOpacity)
        return
      }
      if (scrollTop >= threshold) {
        setOpacity(endOpacity)
        return
      }
      const ratio = scrollTop / threshold
      const nextOpacity = startOpacity + (endOpacity - startOpacity) * ratio
      // console.log('nextOpacity', nextOpacity)
      setOpacity(nextOpacity)
      if (setStyleMT) {
        runOnMainThread(setStyleMT)(nextOpacity)
      }
    },
    [threshold, startOpacity, endOpacity, setStyleMT],
  )

  const handleScrollMT = useCallback(
    (e: any) => {
      'main thread'
      const scrollTop = e.detail?.scrollTop || 0

      let nextOpacity = startOpacity
      if (scrollTop <= 0) {
        nextOpacity = startOpacity
      } else if (scrollTop >= threshold) {
        nextOpacity = endOpacity
      } else {
        const ratio = scrollTop / threshold
        nextOpacity = startOpacity + (endOpacity - startOpacity) * ratio
      }

      runOnBackground(setOpacity)(nextOpacity)

      // Apply opacity directly on the main thread through the hook-owned
      // element ref — no caller-supplied callback closure needed.
      const element = mainThreadRef?.current
      if (element) {
        element.setStyleProperty('opacity', nextOpacity.toString())
      } else if (setStyleMT) {
        // Legacy path: caller-provided main-thread callback.
        setStyleMT(nextOpacity)
      }
    },
    [threshold, startOpacity, endOpacity, setStyleMT, mainThreadRef],
  )

  return { opacity, inverseOpacity, handleScroll, handleScrollMT }
}
