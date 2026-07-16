import { Cell } from '../Cell'
import { createNamespace, isDef } from '../utils'
import type { CouponCellProps, CouponInfo } from './types'

const bem = createNamespace('coupon-cell')

const getValue = (coupon: CouponInfo) => {
  const { value, denominations } = coupon
  if (isDef(value)) {
    return value
  }
  if (isDef(denominations)) {
    return denominations
  }
  return 0
}

function formatValue({
  coupons = [],
  chosenCoupon = -1,
  currency = '¥',
}: Required<Pick<CouponCellProps, 'coupons' | 'currency'>> &
  Pick<CouponCellProps, 'chosenCoupon'>) {
  let value = 0
  let isExist = false

  ;(Array.isArray(chosenCoupon) ? chosenCoupon : [chosenCoupon]).forEach((i) => {
    const coupon = coupons[+i]
    if (coupon) {
      isExist = true
      value += getValue(coupon)
    }
  })

  if (isExist) {
    return `-${currency} ${(value / 100).toFixed(2)}`
  }
  return coupons.length === 0 ? '暂无可用优惠券' : `${coupons.length}张可用`
}

export function CouponCell(props: CouponCellProps) {
  const {
    title = '优惠券',
    border = true,
    editable = true,
    coupons = [],
    currency = '¥',
    chosenCoupon = -1,
    onClick,
  } = props

  const selected = Array.isArray(chosenCoupon)
    ? chosenCoupon.length > 0
    : !!coupons[+chosenCoupon]

  return (
    <Cell
      className={bem()}
      title={title}
      value={formatValue({ coupons, chosenCoupon, currency })}
      border={border}
      isLink={editable}
      valueClass={bem('value', { selected })}
      onClick={onClick}
    />
  )
}

export type { CouponCellProps, CouponInfo }
