import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import type { PopupProps } from './types'

const DEFAULT_Z_INDEX = 300
const DEFAULT_DURATION = 0.3

/**
 * Keep a stable ref for callbacks that are consumed inside effects. This lets
 * callers pass inline handlers (e.g. setState setters) without restarting the
 * open/close transition timers on every render.
 */
function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function Popup(props: PopupProps) {
  const {
    show = false,
    position = 'center',
    overlay = true,
    closeOnClickOverlay = true,
    round = false,
    safeAreaInsetTop = false,
    safeAreaInsetBottom = false,
    zIndex = DEFAULT_Z_INDEX,
    duration = DEFAULT_DURATION,
    destroyOnClose = false,
    lazyRender = true,
    children,
    className,
    style,
    overlayClassName,
    overlayStyle,
    onOpen,
    onOpened,
    onClose,
    onClosed,
    onClickOverlay,
    onShowChange,
  } = props

  // `mounted` controls whether the popup is in the tree.
  // `active` controls whether the CSS show class is applied (drives transitions).
  const [mounted, setMounted] = useState(show || !lazyRender)
  const [active, setActive] = useState(show)

  const durationMs = useMemo(() => Math.max(0, duration * 1000), [duration])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevShowRef = useRef(show)

  const callbacksRef = useLatestRef({
    onOpen,
    onOpened,
    onClose,
    onClosed,
    onClickOverlay,
    onShowChange,
  })

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Drive mount/active state from the controlled `show` prop and run lifecycle
  // callbacks through refs so inline handlers don't reset this effect.
  useEffect(() => {
    clearTimer()

    const prevShow = prevShowRef.current
    prevShowRef.current = show

    if (show) {
      setMounted(true)
      if (!prevShow) {
        callbacksRef.current.onOpen?.()
      }
      // Defer applying the show class so the engine paints the initial hidden
      // state before the transition starts.
      timerRef.current = setTimeout(() => {
        setActive(true)
      }, 0)
    } else {
      setActive(false)
      if (prevShow) {
        callbacksRef.current.onClose?.()
      }
      timerRef.current = setTimeout(() =>
        {
          // Lazy-rendered popups are removed after closing so the fixed
          // full-screen wrapper does not keep intercepting touches/scrolling.
          if (destroyOnClose || lazyRender) {
            setMounted(false)
          }
          if (prevShow) {
            callbacksRef.current.onClosed?.()
          }
        }, durationMs)
    }

    return clearTimer
  }, [show, destroyOnClose, lazyRender, durationMs, clearTimer, callbacksRef])

  // Notify when the open transition finishes.
  useEffect(() => {
    if (!active) return

    const timer = setTimeout(() => {
      callbacksRef.current.onOpened?.()
    }, durationMs)

    return () => clearTimeout(timer)
  }, [active, durationMs, callbacksRef])

  const handleOverlayTap = useCallback(() => {
    callbacksRef.current.onClickOverlay?.()
    if (closeOnClickOverlay) {
      callbacksRef.current.onShowChange?.(false)
    }
  }, [closeOnClickOverlay, callbacksRef])

  const handleContentTap = useCallback(() => {
    // Swallow taps on the content so they don't bubble to the overlay.
  }, [])

  const wrapperStyle: CSSProperties = useMemo(
    () => ({
      zIndex,
      '--lu-popup-duration': `${duration}s`,
      ...style,
    }),
    [zIndex, duration, style],
  )

  if (!mounted) {
    return null
  }

  return (
    <view
      className={cn('lu-popup', active && 'lu-popup--show', className)}
      style={wrapperStyle}
    >
      {overlay && (
        <view
          className={cn('lu-popup__overlay', overlayClassName)}
          style={overlayStyle}
          bindtap={handleOverlayTap}
        />
      )}
      <view
        className={cn(
          'lu-popup__content',
          `lu-popup__content--${position}`,
          round && 'lu-popup__content--round',
          safeAreaInsetTop && 'lu-popup__content--safe-top',
          safeAreaInsetBottom && 'lu-popup__content--safe-bottom',
        )}
        catchtap={handleContentTap}
      >
        {children}
      </view>
    </view>
  )
}
