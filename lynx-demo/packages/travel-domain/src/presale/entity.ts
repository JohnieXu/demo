/**
 * Presale ("先囤后约") domain entities.
 *
 * Pure domain shapes — no DTO leakage, no UI hints, no client-only helpers.
 * Money fields reuse `Money` from `flight/value-object.ts` so the domain layer
 * stays free of network concerns.
 */

import type { Money } from '../flight/value-object.js'
import type {
  AppointmentStatus,
  CalendarDayStatus,
  OrderType,
  PreOrderCancelReason,
  PreOrderCategoryType,
  PreOrderStatus,
  PresaleIdentityType,
  PresaleOrderStatusCode,
  PresalePassengerType,
  PresaleRefundStatus,
  PresaleRefundWay,
  ProductStatus,
  ProductType,
  ReservationOrderStatusCode,
  SaleChannel,
  StockMode,
} from './value-object.js'

// ---------------------------------------------------------------------------
// Product (list & detail)
// ---------------------------------------------------------------------------

export interface PresaleProduct {
  readonly id: string
  readonly skuId: string
  readonly name: string
  readonly productType: ProductType | ''
  readonly categoryType: PreOrderCategoryType
  readonly mainImage: string
  readonly salePrice: Money
  readonly originalPrice: Money
  readonly discount: Money
  readonly validStartDate: string
  readonly validEndDate: string
  readonly saleChannels: readonly SaleChannel[]
  readonly status: ProductStatus
}

export interface PresaleHotelBrief {
  readonly hotelId: string
  readonly hotelName: string
  readonly cityName: string
  readonly districtName: string
  readonly address: string
  readonly mainImage: string
}

export interface PresaleRoomBrief {
  readonly roomTypeId: string
  readonly roomTypeName: string
  readonly bedType: string
  readonly bedWidth: string
  readonly bedCount: number
  readonly floor: string
  readonly area: string
  readonly windowType: string
  readonly mainImage: string
}

export interface PresaleProductDetail extends PresaleProduct {
  readonly productId: string
  readonly nights: number
  readonly splittable: boolean
  readonly maxStock: number
  readonly unbookableDates: readonly string[]
  readonly limitPerUser: number
  readonly sameDayBookable: boolean
  readonly bookAheadDays: number
  readonly reservationRuleText: string
  readonly validityText: string
  readonly detailImages: readonly string[]
  readonly hotel: PresaleHotelBrief
  readonly room: PresaleRoomBrief
  readonly lowestPrice: Money
}

export interface PresaleCategoryTab {
  readonly value: ProductType
  readonly label: string
  readonly productCount: number
}

export interface PresaleCityOption {
  readonly cityId: string
  readonly cityName: string
  readonly productCount?: number
  readonly hotelCount?: number
}

export interface PresaleBrandOption {
  readonly brandId: string
  readonly brandName: string
  readonly hotelCount?: number
}

export interface PresalePurchasedQuantity {
  readonly productId: string
  readonly purchasedQuantity: number
}

// ---------------------------------------------------------------------------
// Exchange hotel / room (hotel-exchange only)
// ---------------------------------------------------------------------------

export interface PresaleHotelExchange {
  readonly resourceId: string
  readonly hotelId: string
  readonly hotelName: string
  readonly hotelImage: string
  readonly cityId: string
  readonly cityName: string
  readonly districtName: string
  readonly brandId: string
  readonly brandName: string
  readonly starRate: number
  readonly category: number
  readonly summaryScore: string
  readonly address: string
  readonly rooms: readonly PresaleExchangeRoom[]
}

export interface PresaleExchangeRoom {
  readonly roomTypeId: string
  readonly roomTypeName: string
  readonly bedType: string
  readonly bedWidth: string
  readonly bedCount: number
  readonly floor: string
  readonly area: string
  readonly windowType: string
  readonly maxOccupancy: number
  readonly breakfastType: string
  readonly markPrice: Money
  readonly roomImage: string
}

export interface PresaleHotelExchangePage {
  readonly productId: string
  readonly skuId: string
  readonly pageNum: number
  readonly pageSize: number
  readonly total: number
  readonly hotels: readonly PresaleHotelExchange[]
}

export interface PresaleHotelExchangeDetail {
  readonly productId: string
  readonly skuId: string
  readonly hotelId: string
  readonly hotelName: string
  readonly cityName: string
  readonly brandName: string
  readonly nights: number
  readonly roomCount: number
  readonly splittable: boolean
  readonly rooms: readonly PresaleExchangeRoom[]
}

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------

export interface PresaleTraveler {
  readonly name: string
  readonly phone?: string
  readonly adultCount: number
  readonly childCount: number
  readonly idCard?: string
  readonly passport?: string
}

export interface PresaleReservationTraveler {
  readonly travelerName: string
  readonly identityNo?: string
}

export interface PresaleOrder {
  readonly id: string
  readonly productId: string
  readonly productName: string
  readonly productImage: string
  readonly productType: string
  readonly categoryType: PreOrderCategoryType
  readonly quantity: number
  readonly travelers: readonly PresaleTraveler[]
  readonly contactPhone: string
  readonly originalUnitPrice?: Money
  readonly sellUnitPrice?: Money
  readonly discountUnitPrice?: Money
  readonly originalAmount: Money
  readonly payableAmount: Money
  readonly paidAmount: Money
  readonly discountAmount: Money
  readonly status: PreOrderStatus
  readonly cancelReason?: PreOrderCancelReason
  readonly presaleStatus?: PresaleOrderStatusCode
  readonly reservedCount: number
  readonly totalReservableCount: number
  readonly validEndDate: string
  readonly createdAt: string
  readonly paidAt?: string
  readonly payExpireTime?: string
  readonly subtitle?: string
  readonly product: PresaleProductDetail
}

export interface PresaleAppointmentBrief {
  readonly id: string
  readonly status: string
  readonly checkInDate: string
  readonly checkOutDate: string
  readonly nights: number
  readonly quantity: number
  readonly markupAmount?: Money
}

export interface PresaleRefundBrief {
  readonly id: string
  readonly status: string
  readonly quantity: number
  readonly amount: Money
}

export interface PresaleOperationLog {
  readonly id: string
  readonly createdAt: string
  readonly operatorType: 'system' | 'user' | 'operator'
  readonly operatorName: string
  readonly action: string
  readonly remark?: string
}

export interface PresaleOrderDetail extends PresaleOrder {
  readonly appointments: readonly PresaleAppointmentBrief[]
  readonly refunds: readonly PresaleRefundBrief[]
  readonly operationLogs: readonly PresaleOperationLog[]
}

export interface PresaleRelatedReservation {
  readonly orderBaseId?: string
}

export interface CreatePresaleOrderRequest {
  readonly userName?: string
  readonly phoneCountryCode?: string
  readonly phoneNumber: string
  readonly distributor?: number
  readonly orderSource: number
  readonly email?: string
  readonly clientType?: string
  readonly clientVersion?: string
  readonly channelId?: string
  readonly currency?: string
  readonly skuId: string
  readonly quantity: number
  readonly price: Money
  readonly totalAmount: Money
  readonly contactName: string
  readonly contactPhone: string
  readonly subOrderType: string
  readonly entranceSource?: number
}

export interface CreatePresaleOrderResponse {
  readonly orderBaseId: string
  readonly payExpireTime: string
  readonly totalAmount: Money
  readonly originalAmount: Money
  readonly productName: string
  readonly presaleOrderStatus: PresaleOrderStatusCode
}

// ---------------------------------------------------------------------------
// Appointment / reservation order
// ---------------------------------------------------------------------------

export interface PresaleAppointmentMeal {
  readonly date: string
  readonly dateDesc: string
  readonly mealDesc: string
}

export interface PresaleAppointment {
  readonly id: string
  readonly preOrderId: string
  readonly productId: string
  readonly productName: string
  readonly hotelId?: string
  readonly hotelName?: string
  readonly roomTypeId?: string
  readonly roomTypeName?: string
  readonly checkInDate: string
  readonly checkOutDate: string
  readonly nights: number
  readonly quantity: number
  readonly travelers: readonly { readonly name: string; readonly phone: string }[]
  readonly contactPhone: string
  readonly markupAmount: Money
  readonly status: AppointmentStatus
  readonly failReason?: string
  readonly createdAt: string
  readonly operationLogs: readonly {
    readonly createdAt: string
    readonly operatorType: string
    readonly operatorName: string
    readonly action: string
  }[]
}

export interface PresaleAppointmentDetail {
  readonly id: string
  readonly orderBaseId: string
  readonly preOrderId: string
  readonly reservationStatus: ReservationOrderStatusCode
  readonly status: AppointmentStatus
  readonly payExpireTime?: string
  readonly hotelName: string
  readonly hotelAddress: string
  readonly hotelImage: string
  readonly hotelPhone?: string
  readonly hotelLatitude?: number
  readonly hotelLongitude?: number
  readonly checkInDate: string
  readonly checkOutDate: string
  readonly checkInDesc: string
  readonly checkOutDesc: string
  readonly nights: number
  readonly roomTypeName: string
  readonly roomImage: string
  readonly specs: readonly string[]
  readonly quantityDesc: string
  readonly meals: readonly PresaleAppointmentMeal[]
  readonly surchargeAmount: Money
  readonly travelerNames: string
  readonly contactPhone: string
  readonly reserveTime: string
  readonly supplierRemark?: string
  readonly remark?: string
}

// ---------------------------------------------------------------------------
// Calendar / inventory
// ---------------------------------------------------------------------------

export interface CalendarDay {
  readonly date: string
  readonly weekText: string
  readonly available: boolean
  readonly statusText: string
  readonly stockMode: StockMode
  readonly remainingInventory?: number
  readonly surchargeAmount: Money
  readonly salePrice?: Money
  readonly displayText: string
  /** Convenience derived from available + stockMode. */
  readonly status: CalendarDayStatus
}

/** Calendar response for the product catalogue. */
export interface PresaleProductCalendar {
  readonly productId: string
  readonly skuId: string
  readonly resourceId?: string
  readonly nights: number
  readonly roomCount: number
  readonly splittable: boolean
  readonly sellPrice?: Money
  readonly calendarDays: readonly CalendarDay[]
}

/** Calendar day used when looking up availability from a pre-sale order's snapshot. */
export interface ReservationCalendarDay {
  readonly date: string
  readonly weekText: string
  readonly available: boolean
  readonly statusText: string
  readonly stockMode: StockMode
  readonly remainingInventory?: number
  readonly surchargeAmount: Money
  readonly displayText: string
  readonly status: CalendarDayStatus
}

export interface PresaleReservationCalendar {
  readonly preSaleOrderBaseId: string
  readonly productId: string
  readonly skuId: string
  readonly resourceId: string
  readonly nights: number
  readonly roomCount: number
  readonly splittable: boolean
  readonly remainingBookableNights: number
  readonly calendarDays: readonly ReservationCalendarDay[]
}

// ---------------------------------------------------------------------------
// Reservation flow request/response
// ---------------------------------------------------------------------------

export interface ReservationSnapshot {
  readonly reserveCount: number
  readonly travelers: readonly PresaleReservationTraveler[]
  readonly contactPhone: string
  readonly skuId: string
  readonly checkInDate: string
  readonly checkOutDate: string
}

export interface ReservationValidateRequest {
  readonly preSaleOrderBaseId: string
  readonly orderType: OrderType
  readonly reserveSnapshot: ReservationSnapshot
}

export interface ReservationValidateResult {
  readonly canReserve: boolean
  readonly failReason?: string
  readonly needSurcharge: boolean
  readonly surchargeAmount?: Money
  readonly surchargeDetail?: string
}

export interface CreateReservationOrderRequest {
  readonly preSaleOrderBaseId: string
  readonly orderType: OrderType
  readonly reserveSnapshot: ReservationSnapshot
  readonly surchargeAmount?: Money
  readonly surchargeDetail?: string
}

export interface CreateReservationOrderResponse {
  readonly orderBaseId: string
  readonly reservationStatus: ReservationOrderStatusCode
  readonly failReason?: string
}

// ---------------------------------------------------------------------------
// Passenger
// ---------------------------------------------------------------------------

export interface PresalePassenger {
  readonly id: string
  readonly passengerName: string
  readonly identityType?: PresaleIdentityType
  readonly identityNo?: string
  readonly phoneNumber?: string
  readonly phoneCountryCode?: string
  readonly passengerType?: PresalePassengerType
  readonly pinyinName?: string
  readonly englishName?: string
}

export interface SavePresalePassengerRequest {
  readonly id?: string
  readonly passengerName: string
  readonly identityType?: PresaleIdentityType
  readonly identityNo?: string
  readonly phoneNumber?: string
  readonly phoneCountryCode?: string
  readonly passengerType?: PresalePassengerType
  readonly pinyinName?: string
  readonly englishName?: string
}

// ---------------------------------------------------------------------------
// Refund
// ---------------------------------------------------------------------------

export interface ApplyPresaleRefundRequest {
  readonly preOrderId: string
  readonly quantity: number
  readonly reason: string
  readonly remark?: string
}

export interface PresaleRefund {
  readonly id: string
  readonly preOrderId: string
  readonly refundNo: string
  readonly quantity: number
  readonly paidAmount: Money
  readonly refundableAmount: Money
  readonly actualRefundAmount: Money
  readonly status: PresaleRefundStatus
  readonly reason: string
  readonly remark?: string
  readonly attachments?: readonly string[]
  readonly refundWay: PresaleRefundWay
  readonly createdAt: string
  readonly refundedAt?: string
  readonly operationLogs: readonly {
    readonly createdAt: string
    readonly operatorType: string
    readonly operatorName: string
    readonly action: string
  }[]
}

// ---------------------------------------------------------------------------
// Criteria
// ---------------------------------------------------------------------------

export interface PresaleListCriteria {
  readonly page: number
  readonly pageSize: number
  readonly name?: string
  readonly productId?: string
  readonly type?: ProductType
  readonly city?: string
  readonly brand?: string
  readonly status?: string
}

export interface PresaleOrderListCriteria {
  readonly page: number
  readonly pageSize: number
}

export interface PresaleDetailCriteria {
  readonly productId: string
  readonly skuId?: string
  readonly channel?: string
  readonly cityId?: string
  readonly brandId?: string
  readonly hotelId?: string
}

export interface PresaleExchangeBrandCriteria {
  readonly productId?: string
  readonly brandId?: string
  readonly cityId?: string
  readonly channel?: string
}

export interface PresalePackageCityCriteria {
  readonly channel?: string
}

export interface PresaleExchangeHotelCriteria {
  readonly productId: string
  readonly skuId?: string
  readonly channel?: string
  readonly cityId?: string
  readonly brandId?: string
  readonly hotelName?: string
  readonly page: number
  readonly pageSize: number
}

export interface PresaleExchangeHotelRoomCriteria {
  readonly productId: string
  readonly skuId?: string
  readonly channel?: string
  readonly resourceId: string
}

export interface PresaleProductCalendarCriteria {
  readonly productId: string
  readonly skuId?: string
  readonly channel?: string
  readonly resourceId?: string
  readonly calendarStartDate?: string
  readonly calendarDays?: number
}

export interface PresaleReservationCalendarCriteria {
  readonly preSaleOrderBaseId: string
  readonly skuId?: string
  readonly channel?: string
  readonly resourceId?: string
  readonly calendarStartDate?: string
  readonly calendarDays?: number
}

export interface PresaleInventoryCriteria {
  readonly productId: string
  readonly hotelId?: string
  readonly startDate: string
  readonly endDate: string
}

export interface PresaleInventoryDay {
  readonly date: string
  readonly status: CalendarDayStatus
  readonly bookedCount: number
  readonly remainingStock: number | null
  readonly markupAmount: Money | null
}

