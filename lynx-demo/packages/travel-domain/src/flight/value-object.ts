/**
 * Flight domain value objects
 *
 * Value objects are immutable, identified by their properties (no identity).
 */

export type AirportCode = string

export interface Airport {
  readonly code: AirportCode
  readonly name: string
  readonly city: string
}

/**
 * Money amount in cents (分) as returned by the API.
 * Use formatMoneyCents to display as human-readable currency.
 */
export interface Money {
  readonly amountInCents: number
  readonly currency: string
}

export function formatMoneyCents(money: Money): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: money.currency,
  }).format(money.amountInCents / 100)
}

export type CabinClass = 'economy' | 'business' | 'first'

export type CabinGrade = 0 | 1 | 2

export interface Duration {
  readonly minutes: number
}

export function formatDuration(duration: Duration): string {
  const hours = Math.floor(duration.minutes / 60)
  const mins = duration.minutes % 60
  return `${hours}h ${mins}m`
}

export interface Airline {
  readonly code: string
  readonly name: string
  readonly logo?: string
}

export interface Route {
  readonly departure: Airport
  readonly arrival: Airport
}

export type MealType =
  | 0   // 无餐食
  | 1   // 有餐食
  | 2   // 有饮料
  | 3   // 有零食
  | 4   // 正餐
  | 5   // 早餐
  | 6   // 午餐
  | 7   // 晚餐
  | 8   // 点心餐
  | 9   // 简餐
  | 999 // 餐食以实际为准

export interface TimeRange {
  readonly startTime: string
  readonly endTime: string
}

export type TripType = 1 | 2 | 3

export type SortType = 1 | 2 | 3

export type SortOrder = 1 | 2

export type PassengerType = 0 | 1 | 2 | -1

export type Gender = 0 | 1 | 2

export type IdentityType = 'ID' | 'PP' | 'GA' | 'TW' | 'TB' | 'HX' | 'HY'

export type RefundStatus =
  | 0 // 待退款
  | 1 // 退成功
  | 2 // 退失败
  | 3 // 取消退款

export type CashRefundStatus =
  | 0 // 待退款
  | 1 // 退款中
  | 2 // 退款成功
  | 3 // 退款失败
  | 4 // 取消退款

export type RefundRuleType = 0 | 1

export type ApplyType = 1 | 2

export type RefundChannel = 1 | 2
