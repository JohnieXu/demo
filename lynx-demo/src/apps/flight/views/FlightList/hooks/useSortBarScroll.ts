import { useRef, useState, useCallback } from '@lynx-js/react'

/**
 * Detect scroll direction on a scroll-view and toggle sort bar visibility.
 * @param threshold Minimum scroll delta (px) to trigger hide/show
 */
export function useSortBarScroll(threshold = 20) {
  const lastScrollTop = useRef(0)
  const [isSortBarHidden, setIsSortBarHidden] = useState(false)

  const handleScroll = useCallback(
    (e: { detail: { scrollTop: number } }) => {
      const currentScrollTop = e.detail.scrollTop || 0
      const delta = currentScrollTop - lastScrollTop.current

      if (delta > threshold) {
        setIsSortBarHidden(true)
        lastScrollTop.current = currentScrollTop
        return
      }

      if (delta < -threshold) {
        setIsSortBarHidden(false)
        lastScrollTop.current = currentScrollTop
        return
      }

      if (currentScrollTop <= 0) {
        setIsSortBarHidden(false)
        lastScrollTop.current = 0
      }
    },
    [threshold]
  )

  return {
    isSortBarHidden,
    handleScroll,
  }
}
