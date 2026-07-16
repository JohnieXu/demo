import { useMemo } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { Popup } from '../Popup'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { NotifyProps } from './types'

const bem = createNamespace('notify')

export function Notify(props: NotifyProps) {
  const {
    show = false,
    type = 'danger',
    message = '',
    color,
    background,
    position = 'top',
    safeAreaInsetTop,
    safeAreaInsetBottom,
    className = '',
    onClose,
    onOpened,
  } = props

  const safeAreaInsetTopValue = safeAreaInsetTop ?? position === 'top'
  const safeAreaInsetBottomValue = safeAreaInsetBottom ?? position === 'bottom'

  const wrapperStyle: CSSProperties = useMemo(() => {
    if (!background) return {}
    return { '--lu-notify-background': background } as CSSProperties
  }, [background])

  return (
    <Popup
      show={show}
      position={position}
      overlay={false}
      closeOnClickOverlay={false}
      duration={0}
      safeAreaInsetTop={safeAreaInsetTopValue}
      safeAreaInsetBottom={safeAreaInsetBottomValue}
      className={cn(bem({ [type]: true, [position]: true }), className)}
      style={wrapperStyle}
      onOpened={onOpened}
      onClose={onClose}
    >
      <view className={bem('content')}>
        <text className={bem('text')} style={{ color }}>
          {message}
        </text>
      </view>
    </Popup>
  )
}
