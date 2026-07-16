import { Button } from '../Button'
import { Icon } from '../Icon'
import { cn } from '../theme/cn'
import { createNamespace, toNumber } from '../utils'
import type { SubmitBarProps } from './types'

const bem = createNamespace('submit-bar')

const DEFAULT_WARNING_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 22h22L12 2zm0 3.5L19.5 20h-15L12 5.5zM11 10v6h2v-6h-2zm0 8v2h2v-2h-2z"/></svg>`

export function SubmitBar(props: SubmitBarProps) {
  const {
    tip,
    label = '合计：',
    price,
    tipIcon,
    loading = false,
    currency = '¥',
    disabled = false,
    textAlign = 'right',
    buttonText = '提交订单',
    buttonType = 'danger',
    buttonColor,
    suffixLabel,
    placeholder = false,
    decimalLength = 2,
    safeAreaInsetBottom = true,
    onSubmit,
    className,
    style,
    children,
  } = props

  const renderText = () => {
    if (typeof price !== 'number') {
      return null
    }

    const len = toNumber(decimalLength)
    const pricePair = (price / 100).toFixed(len).split('.')
    const decimal = len > 0 ? `.${pricePair[1]}` : ''

    return (
      <view
        className={bem('text')}
        style={{ textAlign }}
      >
        <text className={bem('label')}>{label}</text>
        <view className={bem('price')}>
          <text>{currency}</text>
          <text className={bem('price-integer')}>{pricePair[0]}</text>
          <text>{decimal}</text>
        </view>
        {suffixLabel && (
          <text className={bem('suffix-label')}>{suffixLabel}</text>
        )}
      </view>
    )
  }

  const renderTip = () => {
    if (!tip) {
      return null
    }

    return (
      <view className={bem('tip')}>
        <Icon
          className={bem('tip-icon')}
          svg={tipIcon || DEFAULT_WARNING_ICON}
          size={12}
        />
        <text className={bem('tip-text')}>{tip}</text>
      </view>
    )
  }

  const handleSubmit = () => {
    onSubmit?.()
  }

  const renderButton = () => (
    <Button
      round
      type={buttonType}
      color={buttonColor}
      loading={loading}
      disabled={disabled}
      text={buttonText}
      className={cn(bem('button'), bem('button', { [buttonType]: true }))}
      onClick={handleSubmit}
    />
  )

  const rootStyle = {
    paddingBottom: safeAreaInsetBottom ? 'env(safe-area-inset-bottom, 0px)' : undefined,
    ...style,
  }

  const renderSubmitBar = () => (
    <view
      className={cn(bem(), className)}
      style={rootStyle}
    >
      {renderTip()}
      <view className={bem('bar')}>
        {children}
        {renderText()}
        {renderButton()}
      </view>
    </view>
  )

  if (!placeholder) {
    return renderSubmitBar()
  }

  return (
    <>
      <view
        className={bem('placeholder')}
        style={{ height: 'var(--lu-submit-bar-height, 50px)' }}
      />
      {renderSubmitBar()}
    </>
  )
}

export type { SubmitBarProps } from './types'
