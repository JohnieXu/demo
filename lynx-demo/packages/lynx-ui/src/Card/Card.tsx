import { Tag } from '../Tag'
import { Image } from '../Image'
import { cn } from '../theme/cn'
import { createNamespace, isDef } from '../utils'
import type { Numeric } from '../utils'
import type { CardProps } from './types'

const bem = createNamespace('card')

function toNumber(val?: Numeric): number {
  if (!isDef(val)) return 0
  const num = Number(val)
  return Number.isNaN(num) ? 0 : num
}

export function Card(props: CardProps) {
  const {
    tag,
    num,
    desc,
    thumb,
    title,
    price,
    centered = false,
    currency = '¥',
    originPrice,
    titleSlot,
    thumbSlot,
    tagSlot,
    descSlot,
    tags,
    priceSlot,
    originPriceSlot,
    numSlot,
    bottomSlot,
    priceTopSlot,
    footer,
    children,
    className,
    style,
    onClickThumb,
  } = props

  const renderTitle = () => {
    if (titleSlot) return titleSlot
    if (title) {
      return (
        <text className={cn(bem('title'), 'lu-multi-ellipsis--l2')}>
          {title}
        </text>
      )
    }
    return null
  }

  const renderThumbTag = () => {
    if (tagSlot || tag) {
      return (
        <view className={bem('tag')}>
          {tagSlot || (
            <Tag mark type="primary">{tag}</Tag>
          )}
        </view>
      )
    }
    return null
  }

  const renderThumbImage = () => {
    if (thumbSlot) return thumbSlot
    return (
      <Image
        src={thumb}
        fit="cover"
        width="100%"
        height="100%"
      />
    )
  }

  const renderThumb = () => {
    if (thumbSlot || thumb) {
      return (
        <view
          className={bem('thumb')}
          bindtap={onClickThumb}
        >
          {renderThumbImage()}
          {renderThumbTag()}
        </view>
      )
    }
    return null
  }

  const renderDesc = () => {
    if (descSlot) return descSlot
    if (desc) {
      return <text className={cn(bem('desc'), 'lu-ellipsis')}>{desc}</text>
    }
    return null
  }

  const renderPriceText = () => {
    const priceValue = toNumber(price)
    const priceArr = priceValue.toString().split('.')
    return (
      <view>
        <text className={bem('price-currency')}>{currency}</text>
        <text className={bem('price-integer')}>{priceArr[0]}</text>
        {priceArr.length > 1 && (
          <>
            <text className={bem('price-decimal')}>.{priceArr[1]}</text>
          </>
        )}
      </view>
    )
  }

  const showNum = numSlot || isDef(num)
  const showPrice = priceSlot || isDef(price)
  const showOriginPrice = originPriceSlot || isDef(originPrice)
  const showBottom = showNum || showPrice || showOriginPrice || bottomSlot

  const Price = showPrice && (
    <view className={bem('price')}>
      {priceSlot || renderPriceText()}
    </view>
  )

  const OriginPrice = showOriginPrice && (
    <view className={bem('origin-price')}>
      {originPriceSlot || `${currency} ${toNumber(originPrice)}`}
    </view>
  )

  const Num = showNum && (
    <view className={bem('num')}>
      {numSlot || `x${toNumber(num)}`}
    </view>
  )

  const Footer = footer && <view className={bem('footer')}>{footer}</view>

  const Bottom = showBottom && (
    <view className={bem('bottom')}>
      {priceTopSlot}
      {Price}
      {OriginPrice}
      {Num}
      {bottomSlot}
    </view>
  )

  if (children) {
    return (
      <view className={cn(bem(), className)} style={style}>
        {children}
      </view>
    )
  }

  return (
    <view className={cn(bem(), className)} style={style}>
      <view className={bem('header')}>
        {renderThumb()}
        <view className={bem('content', { centered })}>
          <view>
            {renderTitle()}
            {renderDesc()}
            {tags}
          </view>
          {Bottom}
        </view>
      </view>
      {Footer}
    </view>
  )
}

export type { CardProps } from './types'
