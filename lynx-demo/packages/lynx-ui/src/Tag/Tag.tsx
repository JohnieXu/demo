import type { CSSProperties } from '@lynx-js/types'
import { Icon } from '../Icon'
import { cn } from '../theme/cn'
import { createNamespace } from '../utils'
import type { TagProps } from './types'

const bem = createNamespace('tag')

const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
  <path d="M5.354 3.146a.5.5 0 010 .708L9.793 8l-4.44 4.146a.5.5 0 00.686.73l.024-.024 4.793-4.5a.5.5 0 000-.73l-4.793-4.5a.5.5 0 00-.686.73l-.024.024z" />
</svg>
`

export function Tag(props: TagProps) {
  const {
    size = 'medium',
    mark = false,
    show = true,
    type = 'default',
    color,
    plain = false,
    round = false,
    textColor,
    closeable = false,
    children,
    className,
    style,
    onClose,
  } = props

  if (!show) return null

  const getStyle = (): CSSProperties => {
    if (plain) {
      return {
        color: textColor || color,
        borderColor: color,
      }
    }
    return {
      color: textColor,
      backgroundColor: color,
    }
  }

  const handleClose = () => {
    onClose?.()
  }

  return (
    <view
      className={cn(
        bem({
          [type]: true,
          [size]: true,
          mark,
          plain,
          round,
          closeable,
        }),
        className,
      )}
      style={{ ...getStyle(), ...style }}
    >
      <text className={bem('text')}>{children}</text>
      {closeable && (
        <view className={bem('close')} bindtap={handleClose}>
          <Icon svg={CLOSE_SVG} className={bem('close-icon')} />
        </view>
      )}
    </view>
  )
}

export type { TagProps, TagType, TagSize } from './types'
