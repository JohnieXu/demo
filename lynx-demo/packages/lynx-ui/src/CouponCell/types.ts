import type { Numeric } from '../utils'

export interface CouponInfo {
  name?: string
  value?: number
  denominations?: number
  [key: string]: unknown
}

export interface CouponCellProps {
  title?: string
  border?: boolean
  editable?: boolean
  coupons?: CouponInfo[]
  currency?: string
  chosenCoupon?: number | number[]
  onClick?: () => void
}

export type { Numeric }
