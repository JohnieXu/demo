import { useEffect, useState } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
import { Loading } from '../Loading'
import { cn } from '../theme/cn'
import { addUnit, createNamespace, isDef } from '../utils'
import type { Numeric } from '../utils'
import type { ImageFit, ImageProps } from './types'

const bem = createNamespace('image')

function mapFitToMode(fit: ImageFit): 'center' | 'scaleToFill' | 'aspectFit' | 'aspectFill' {
  switch (fit) {
    case 'contain':
    case 'scale-down':
      return 'aspectFit'
    case 'cover':
      return 'aspectFill'
    case 'fill':
      return 'scaleToFill'
    case 'none':
    default:
      return 'center'
  }
}

function FallbackIcon({ type }: { type: 'loading' | 'error' }) {
  return (
    <view className={bem(type === 'error' ? 'error' : 'loading')}>
      <view className={bem(type === 'error' ? 'error-icon' : 'loading-icon')}>
        <Loading type={type === 'loading' ? 'spinner' : undefined} size={32} />
      </view>
    </view>
  )
}

export function Image(props: ImageProps) {
  const {
    src,
    alt,
    fit = 'cover',
    position = 'center',
    round = false,
    block = false,
    width,
    height,
    radius,
    showError = true,
    showLoading = true,
    errorContent,
    loadingContent,
    className,
    style,
    children,
    onLoad,
    onError,
  } = props

  const [loading, setLoading] = useState(!!src)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) {
      setLoading(true)
      setError(false)
      return
    }
    setLoading(true)
    setError(false)
  }, [src])

  const wrapperStyle: CSSProperties = {
    ...addSizeStyle(width, height),
    ...(isDef(radius) ? { borderRadius: addUnit(radius) } : {}),
    ...style,
  }

  return (
    <view
      className={cn(
        bem({ round, block }),
        className,
      )}
      style={wrapperStyle}
    >
      {src != null && !error && (
        <image
          className={bem('img')}
          src={src}
          mode={mapFitToMode(fit)}
          style={{ objectPosition: position } as CSSProperties}
          bindload={() => {
            setLoading(false)
            onLoad?.()
          }}
          binderror={() => {
            setError(true)
            setLoading(false)
            onError?.()
          }}
        >
          {alt ? null : null}
        </image>
      )}

      {error && showError && (
        errorContent ?? <FallbackIcon type="error" />
      )}

      {!error && loading && showLoading && (
        loadingContent ?? <FallbackIcon type="loading" />
      )}

      {children != null && <view className={bem('slot')}>{children}</view>}
    </view>
  )
}

function addSizeStyle(width?: Numeric, height?: Numeric): CSSProperties {
  if (isDef(width) || isDef(height)) {
    return {
      width: addUnit(width),
      height: addUnit(height),
    }
  }
  return {}
}

export type { ImageProps, ImageFit, ImagePosition } from './types'
