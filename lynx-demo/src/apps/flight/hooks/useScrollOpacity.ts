import { useCallback, useState } from '@lynx-js/react'
import type { ScrollEvent } from '@lynx-js/types'

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
}

export interface UseScrollOpacityReturn {
  /** Current opacity in the [startOpacity, endOpacity] range. */
  opacity: number
  /** Bind this to a scrollable view's `onScroll` prop. */
  handleScroll: (e: ScrollEvent) => void
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
 *   const { opacity, handleScroll } = useScrollOpacity({ threshold: 80 })
 *   <NavBar backgroundOpacity={opacity} />
 *   <List onScroll={handleScroll} />
 */
export function useScrollOpacity(
  options: UseScrollOpacityOptions,
): UseScrollOpacityReturn {
  const { threshold, startOpacity = 1, endOpacity = 0 } = options
  const [opacity, setOpacity] = useState(startOpacity)

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
      console.log('nextOpacity', nextOpacity)
      setOpacity(nextOpacity)
    },
    [threshold, startOpacity, endOpacity],
  )

  return { opacity, handleScroll }
}
