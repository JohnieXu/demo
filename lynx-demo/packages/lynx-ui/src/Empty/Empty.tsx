import type { ReactNode } from '@lynx-js/react'
import { cn } from '../theme/cn'
import { createNamespace, getSizeStyle } from '../utils'
import type { EmptyProps } from './types'

const bem = createNamespace('empty')

function DefaultIcon() {
  return (
    <view className={bem('icon', { default: true })}>
      <view className={bem('icon-line')} />
      <view className={bem('icon-line')} />
      <view className={bem('icon-line', { short: true })} />
    </view>
  )
}

function ErrorIcon() {
  return (
    <view className={bem('icon', { error: true })}>
      <view className={bem('icon-cross', { first: true })} />
      <view className={bem('icon-cross', { second: true })} />
    </view>
  )
}

function NetworkIcon() {
  return (
    <view className={bem('icon', { network: true })}>
      <view className={bem('icon-screen')} />
      <view className={bem('icon-signal')}>
        <view className={bem('icon-signal-dot')} />
        <view className={bem('icon-signal-arc')} />
      </view>
    </view>
  )
}

function SearchIcon() {
  return (
    <view className={bem('icon', { search: true })}>
      <view className={bem('icon-magnifier')} />
      <view className={bem('icon-handle')} />
    </view>
  )
}

const PRESET_IMAGES: Record<string, () => ReactNode> = {
  default: DefaultIcon,
  error: ErrorIcon,
  network: NetworkIcon,
  search: SearchIcon,
}

function renderNode(node: ReactNode): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    return <text>{node}</text>
  }
  return node
}

export function Empty(props: EmptyProps) {
  const {
    image = 'default',
    imageSize,
    description,
    children,
    className,
    style,
  } = props

  const renderImage = () => {
    if (typeof image === 'string' && PRESET_IMAGES[image]) {
      const IconComponent = PRESET_IMAGES[image]
      return <IconComponent />
    }
    if (typeof image === 'string') {
      return <image src={image} className={bem('image-img')} />
    }
    return image
  }

  return (
    <view className={cn(bem(), className)} style={style}>
      <view className={bem('image')} style={getSizeStyle(imageSize)}>
        {renderImage()}
      </view>
      {description != null && (
        <view className={bem('description')}>{renderNode(description)}</view>
      )}
      {children != null && <view className={bem('bottom')}>{children}</view>}
    </view>
  )
}

export type { EmptyProps } from './types'
