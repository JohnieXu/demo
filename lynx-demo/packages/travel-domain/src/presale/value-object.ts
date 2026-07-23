/**
 * Presale ("先囤后约") domain value objects and enums.
 *
 * Two-track status exposure:
 *  - Numeric codes (PresaleOrderStatus / ReservationOrderStatus / OrderType)
 *    mirror the backend payload and are required for support diagnostics.
 *  - String enums (PreOrderStatus / AppointmentStatus / RefundStatus)
 *    are what business logic switches on.
 *
 * Mappers in travel-data/presale/mapper.ts own the numeric ↔ string translation.
 */

export type ProductType =
  | 'hotel_package'
  | 'hotel_exchange'
  | 'ticket'
  | 'flight'
  | 'year_card'

export type ProductStatus = 'on_shelf' | 'off_shelf' | 'out_of_stock'

export type SaleChannel = 'app' | 'mini_program'

/** Backend numeric category code (see PreOrderCategoryType in external repo). */
export type PreOrderCategoryType = 1 | 2

/** Backend numeric status codes for pre-sale orders (mirrors PresaleOrderStatus). */
export type PresaleOrderStatusCode =
  | 0   // WAIT_PAY
  | 10  // WAIT_RESERVE
  | 20  // PARTIAL_RESERVE
  | 30  // RESERVED
  | 40  // CANCELLED_UNPAID
  | 41  // CANCELLED_PAY_TIMEOUT
  | 50  // REFUNDING
  | 60  // REFUNDED
  | 70  // REFUND_FAILED

/** Domain-level string status for pre-sale orders (business decisions). */
export type PreOrderStatus =
  | 'pending_pay'
  | 'callback_delay'
  | 'cancelled'
  | 'pending_book'
  | 'partial_book'
  | 'booked'
  | 'refunding'
  | 'refund_failed'
  | 'refunded'

/** Distinguishes unpaid cancel vs timeout-refund cancel. */
export type PreOrderCancelReason = 'unpaid' | 'timeout_refund'

/** Backend numeric status codes for reservation / appointment orders. */
export type ReservationOrderStatusCode =
  | 10  // WAIT_PAY
  | 15  // CONFIRMING
  | 20  // SUCCESS
  | 30  // FAILED
  | 31  // FAILED_PAY_TIMEOUT
  | 32  // FAILED_REJECTED
  | 40  // CANCELLED

/** Domain-level string status for reservation orders. */
export type AppointmentStatus =
  | 'pending_pay'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'callback_delay'

export type AppointmentFailReason = 'normal' | 'timeout_refund'

/** Source order type — distinguishes a pre-sale order from its child reservation. */
export type OrderType = 6 | 7

export type AppointmentType = '0' | '1' // 0=hotel uni exchange, 1=hotel package

export type PresaleRefundStatus =
  | 'pending_audit'
  | 'audit_pass'
  | 'refunding'
  | 'success'
  | 'failed'
  | 'rejected'

export type PresaleRefundWay = 'system' | 'manual'

/** Per-day calendar inventory status. */
export type CalendarDayStatus = 'bookable' | 'unbookable' | 'full'

/** Stock mode on a single calendar day. */
export type StockMode = 0 | 1

export type PresaleIdentityType = 'ID' | 'PP' | 'GA' | 'TW' | 'TB' | 'HX' | 'HY'

export type PresalePassengerType = 0 | 1 | 2 | -1