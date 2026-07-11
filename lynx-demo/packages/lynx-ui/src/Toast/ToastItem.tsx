import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { closeToast } from './controller'
import { FailIcon, LoadingIcon, SuccessIcon } from './icons'
import type { ToastProps } from './types'

const TRANSITION_DURATION = 0.2

export function ToastItem(props: ToastProps) {
  const {
    id,
    type = 'text',
    message = '',
    position = 'middle',
    duration = 2000,
    overlay = false,
    closeOnClickOverlay = false,
    closeOnClick = false,
    forbidClick = false,
    zIndex = 400,
    className = '',
    icon: customIcon,
    closing = false,
    onClose,
    onOpened,
    onExited,
  } = props

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCloseRef = useRef(onClose)
  const onOpenedRef = useRef(onOpened)
  const onExitedRef = useRef(onExited)

  onCloseRef.current = onClose
  onOpenedRef.current = onOpened
  onExitedRef.current = onExited

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Start the enter transition on mount.
  useEffect(() => {
    const timer = setTimeout(() => {
      onOpenedRef.current?.()
    }, TRANSITION_DURATION * 1000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-close after duration.
  useEffect(() => {
    if (closing) return
    if (duration <= 0) return

    timerRef.current = setTimeout(() => {
      closeToast()
    }, duration)

    return clearTimer
  }, [closing, duration, clearTimer])

  // React to the controller asking us to close.
  useEffect(() => {
    if (!closing) return
    clearTimer()
    onCloseRef.current?.()
    timerRef.current = setTimeout(() => {
      onExitedRef.current?.(id)
    }, TRANSITION_DURATION * 1000)
    return clearTimer
  }, [closing, id, clearTimer])

  const handleOverlayTap = useCallback(() => {
    if (closeOnClickOverlay) {
      closeToast()
    }
  }, [closeOnClickOverlay])

  const handleContentTap = useCallback(() => {
    if (closeOnClick) {
      closeToast()
    }
  }, [closeOnClick])

  const handleForbidTap = useCallback(() => {
    // Swallow the event so touches do not reach content behind the toast.
  }, [])

  const wrapperStyle: CSSProperties = useMemo(
    () => ({
      zIndex,
      '--lu-toast-duration': `${TRANSITION_DURATION}s`,
    } as CSSProperties),
    [zIndex],
  )

  const renderIcon = () => {
    if (customIcon) return customIcon
    if (type === 'success') return <SuccessIcon />
    if (type === 'fail') return <FailIcon />
    if (type === 'loading') return <LoadingIcon />
    return null
  }

  const hasIcon = type !== 'text' || customIcon != null
  const isTextOnly = type === 'text' && customIcon == null

  return (
    <view
      className={cn(
        'lu-toast',
        `lu-toast--${position}`,
        isTextOnly && 'lu-toast--text',
        !closing && 'lu-toast--show',
        className,
      )}
      style={wrapperStyle}
    >
      {overlay && (
        <view
          className="lu-toast__overlay"
          bindtap={handleOverlayTap}
        />
      )}
      {forbidClick && !overlay && (
        <view
          className="lu-toast__overlay lu-toast__overlay--transparent"
          catchtap={handleForbidTap}
        />
      )}
      <view
        className={cn(
          'lu-toast__content',
          `lu-toast__content--${position}`,
          hasIcon && 'lu-toast__content--with-icon',
        )}
        bindtap={handleContentTap}
      >
        {renderIcon()}
        {message ? <text className="lu-toast__text">{message}</text> : null}
      </view>
    </view>
  )
}
