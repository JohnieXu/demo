import { useState } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { NoticeBarProps } from './types'

const bem = createNamespace('notice-bar')

export function NoticeBar(props: NoticeBarProps) {
  const {
    text,
    mode,
    color = '#f60',
    background = '#fff7cc',
    scrollable = false,
    wrapable = false,
    leftIcon,
    rightIcon,
    children,
    className,
    style,
    onClose,
    onClick,
  } = props

  const [show, setShow] = useState(true)

  if (!show) return null

  const handleRightTap = () => {
    if (mode === 'closeable') {
      setShow(false)
      onClose?.()
    }
  }

  const hasRight = !!rightIcon || mode === 'closeable' || mode === 'link'
  const isScroll = scrollable === undefined ? !wrapable : (scrollable || (!wrapable && text != null))

  return (
    <view
      className={cn(
        bem({
          with_icon: !!leftIcon || !!rightIcon,
          wrapable,
          scrollable: isScroll,
        }),
        className,
      )}
      style={{ color, background, ...style } as CSSProperties}
      bindtap={onClick}
    >
      {leftIcon != null && (
        <view className={bem('left-icon')}>{leftIcon}</view>
      )}
      <view className={bem('wrap')}>
        <view
          className={bem('content', { scrollable: isScroll })}
          style={{ animationDuration: '12s' } as CSSProperties}
        >
          {children != null ? (
            children
          ) : (
            <text>{text}</text>
          )}
        </view>
      </view>
      {hasRight && (
        <view
          className={bem('right-icon')}
          bindtap={handleRightTap}
        >
          {rightIcon ?? (
            mode === 'closeable' ? (
              <view className={bem('icon-close')}>
                <view className={bem('icon-close-line', { first: true })} />
                <view className={bem('icon-close-line', { second: true })} />
              </view>
            ) : (
              <view className={bem('icon-arrow')}>
                <view className={bem('icon-arrow-icon')} />
              </view>
            )
          )}
        </view>
      )}
    </view>
  )
}

export type { NoticeBarProps } from './types'
