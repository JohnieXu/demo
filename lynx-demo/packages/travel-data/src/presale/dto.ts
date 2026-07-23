/**
 * Presale ("先囤后约") raw data-transfer objects.
 *
 * These mirror the backend JSON payloads 1:1 (snake_case or camelCase as
 * returned by the upstream service). The HTTP client auto-unwraps the
 * `{ success, errorCode, message, logId, data }` envelope, so DTOs describe
 * only the `data` shape.
 *
 * Money is represented as raw yuan amounts (`price: 599`); the mapper is
 * responsible for converting to `Money { amountInCents, currency }`.
 */

// ---------------------------------------------------------------------------
// Product list / detail
// ---------------------------------------------------------------------------

export interface PresaleProductListItemDto {
  productId: string
  skuId: string
  productName: string
  productType?: string
  categoryType: number
  mainImage?: string
  salePrice?: number
  originalPrice?: number
  discount?: number
  validStartDate?: string
  validEndDate?: string
  saleChannels?: string[]
  status?: string
}

export interface PresaleProductListResponseDto {
  list: PresaleProductListItemDto[]
  total: number
  page?: number
  pageSize?: number
}

export interface PresaleProductDetailResponseDto {
  productId: string
  skuId: string
  productName: string
  productType?: string
  categoryType: number
  mainImage?: string
  coverImage?: string
  salePrice?: number
  originalPrice?: number
  discount?: number
  lowestPrice?: number
  validStartDate?: string
  validEndDate?: string
  nights?: number
  splittable?: boolean
  maxStock?: number
  unbookableDates?: string[]
  limitPerUser?: number
  sameDayBookable?: boolean
  bookAheadDays?: number
  reservationRuleText?: string
  validityText?: string
  mainImages?: string[]
  detailImages?: string[]
  saleChannels?: string[]
  status?: string
  hotel?: PresaleDetailHotelBriefDto
  room?: PresaleDetailRoomDto
  packageDetail?: PresaleDetailPackageDto
  hotelExchangeDetail?: PresaleDetailHotelExchangeDto
}

export interface PresaleDetailHotelBriefDto {
  hotelId: string
  hotelName: string
  cityName?: string
  districtName?: string
  address?: string
  mainImage?: string
}

export interface PresaleDetailRoomDto {
  roomTypeId: string
  roomTypeName: string
  bedType?: string
  bedWidth?: string
  bedCount?: number
  floor?: string
  area?: string
  windowType?: string
  mainImage?: string
}

export interface PresaleDetailPackageDto {
  nights?: number
  splittable?: boolean
  reservationRuleText?: string
  validityText?: string
}

export interface PresaleDetailHotelExchangeDto {
  splittable?: boolean
}

export interface PresaleCategoryTabRawDto {
  categoryType: number
  categoryName: string
  productCount: number
}

export interface PresaleCityOptionRawDto {
  cityId: string
  cityName: string
  productCount?: number
  hotelCount?: number | null
}

export interface PresaleBrandOptionRawDto {
  brandId: string
  brandName: string
  hotelCount?: number | null
}

export interface PresalePurchasedQuantityDto {
  productId: string
  purchasedQuantity: number
}

// ---------------------------------------------------------------------------
// Hotel exchange
// ---------------------------------------------------------------------------

export interface PresaleExchangeHotelRoomDto {
  roomTypeId: string
  roomTypeName: string
  bedType?: string
  bedWidth?: string
  bedCount?: number
  floor?: string
  area?: string
  windowType?: string
  maxOccupancy?: number
  breakfastType?: string
  markPrice?: number
  roomImage?: string
}

export interface PresaleExchangeHotelDto {
  resourceId: string
  hotelId: string
  hotelName: string
  hotelImage?: string
  cityId?: string
  cityName?: string
  districtName?: string
  brandId?: string
  brandName?: string
  breakfastType?: string
  starRate: number
  category?: number
  summaryScore?: string
  address?: string
  rooms: PresaleExchangeHotelRoomDto[]
}

export interface PresaleExchangeHotelPageDto {
  productId: string
  skuId: string
  cityId?: string
  brandId?: string
  hotelName?: string
  pageNum: number
  pageSize: number
  total: number
  hotels: PresaleExchangeHotelDto[]
}

export interface PresaleExchangeHotelDetailDto {
  productId: string
  skuId: string
  hotelId: string
  hotelName: string
  cityId?: string
  cityName?: string
  brandId?: string
  brandName?: string
  nights: number
  roomCount: number
  splittable: boolean
  rooms: PresaleExchangeHotelRoomDto[]
}

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------

export interface CreatePresaleOrderRequestDto {
  userName?: string
  phoneCountryCode?: string
  phoneNumber: string
  distributor?: number
  orderSource: number
  email?: string
  clientType?: string
  clientVersion?: string
  channelId?: string
  currency?: string
  skuId: string
  quantity: number
  price: number
  totalAmount: number
  contactName: string
  contactPhone: string
  subOrderType: string
  entranceSource?: number
}

export interface CreatePresaleOrderResponseDto {
  orderBaseId: string
  payExpireTime: string
  totalAmount: number
  originalAmount: number
  productName: string
  presaleOrderStatus: number
}

export interface PresaleOrderListItemDto {
  orderBaseId: string
  productId?: string
  productName?: string
  productImage?: string
  productType?: string
  categoryType?: number
  quantity?: number
  travelers?: Array<{
    name?: string
    phone?: string
    adultCount?: number
    childCount?: number
    idCard?: string
    passport?: string
  }>
  contactPhone?: string
  originalUnitPrice?: number
  sellUnitPrice?: number
  discountUnitPrice?: number
  originalAmount?: number
  payableAmount?: number
  paidAmount?: number
  discountAmount?: number
  status?: string
  presaleStatus?: number
  cancelReason?: string
  reservedCount?: number
  totalReservableCount?: number
  validEndDate?: string
  createTime?: string
  paidAt?: string
  payExpireTime?: string
  subtitle?: string
}

export interface PresaleOrderListResponseDto {
  list: PresaleOrderListItemDto[]
  total: number
  page?: number
  pageSize?: number
}

export interface PresaleOrderDetailRawDto {
  orderBaseId: string
  productId?: string
  productName?: string
  productImage?: string
  productType?: string
  categoryType?: number
  quantity?: number
  travelers?: Array<{
    name?: string
    phone?: string
    adultCount?: number
    childCount?: number
    idCard?: string
    passport?: string
  }>
  contactPhone?: string
  originalUnitPrice?: number
  sellUnitPrice?: number
  discountUnitPrice?: number
  originalAmount?: number
  payableAmount?: number
  paidAmount?: number
  discountAmount?: number
  status?: string
  presaleStatus?: number
  cancelReason?: string
  reservedCount?: number
  totalReservableCount?: number
  validEndDate?: string
  createTime?: string
  paidAt?: string
  payExpireTime?: string
  subtitle?: string
  product?: PresaleProductDetailResponseDto
  appointments?: PresaleAppointmentBriefRawDto[]
  refunds?: PresaleRefundBriefRawDto[]
  operationLogs?: PresaleOperationLogRawDto[]
}

export interface PresaleAppointmentBriefRawDto {
  id?: string
  status?: string
  checkInDate?: string
  checkOutDate?: string
  nights?: number
  quantity?: number
  markupAmount?: number
}

export interface PresaleRefundBriefRawDto {
  id?: string
  status?: string
  quantity?: number
  amount?: number
}

export interface PresaleRefundBriefDto {
  id?: string
  status?: string
  quantity?: number
  amount?: number
}

export interface PresaleOperationLogRawDto {
  id?: string
  createdAt?: string
  operatorType?: string
  operatorName?: string
  action?: string
  remark?: string
}

// ---------------------------------------------------------------------------
// Appointment / reservation order
// ---------------------------------------------------------------------------

export interface CalendarDayRawDto {
  date: string
  weekText?: string
  available: boolean
  statusText?: string
  stockMode?: number
  remainingInventory?: number
  surchargeAmount?: number
  salePrice?: number
  displayText?: string
}

export interface PresaleProductCalendarResponseDto {
  productId: string
  skuId: string
  resourceId?: string
  nights: number
  roomCount: number
  splittable: boolean
  sellPrice?: number
  calendarDays: CalendarDayRawDto[]
}

/** Variant: no salePrice field per `ReservationCalendarDayResp = Omit<CalendarDayVO, 'salePrice'>`. */
export interface ReservationCalendarDayRawDto {
  date: string
  weekText?: string
  available: boolean
  statusText?: string
  stockMode?: number
  remainingInventory?: number
  surchargeAmount?: number
  displayText?: string
}

export interface ReservationCalendarResponseDto {
  preSaleOrderBaseId: string
  productId: string
  skuId: string
  resourceId: string
  nights: number
  roomCount: number
  splittable: boolean
  remainingBookableNights: number
  calendarDays: ReservationCalendarDayRawDto[]
}

export interface ReservationSnapshotDto {
  reserveCount: number
  travelers: Array<{ travelerName: string; identityNo?: string }>
  contactPhone: string
  skuId: string
  checkInDate: string
  checkOutDate: string
}

export interface ReservationValidateRequestDto {
  preSaleOrderBaseId: string
  orderType: number
  reserveSnapshot: ReservationSnapshotDto
}

export interface ReservationValidateResponseDto {
  canReserve: boolean
  failReason?: string
  needSurcharge: boolean
  surchargeAmount?: number
  surchargeDetail?: string
}

export interface CreateReservationOrderRequestDto {
  preSaleOrderBaseId: string
  orderType: number
  reserveSnapshot: ReservationSnapshotDto
  surchargeAmount?: number
  surchargeDetail?: string
}

export interface CreateReservationOrderResponseDto {
  orderBaseId: string
  reservationStatus: number
  failReason?: string
}

export interface ReservationOrderMealDto {
  date: string
  dateDesc?: string
  mealDesc?: string
}

export interface ReservationOrderDetailDto {
  reservationStatus: number
  payExpireTime?: string | null
  hotelName: string
  hotelAddress: string
  hotelPicUrl?: string | null
  hotelPhone?: string | null
  hotelLatitude?: number | string | null
  hotelLongitude?: number | string | null
  checkInDate: string
  checkOutDate: string
  checkInDesc?: string
  checkOutDesc?: string
  nightQuantity: number
  roomName: string
  roomQuantityDesc?: string
  roomAttrDesc?: string
  roomImageUrl?: string
  meals?: ReservationOrderMealDto[]
  surchargeAmount?: number
  orderBaseId: string
  travelerNames?: string
  travelers?: Array<{ travelerName: string; identityNo?: string }>
  contactPhone: string
  reserveTime?: string
  preSaleOrderBaseId?: string
  supplierRemark?: string | null
  remark?: string | null
}

// ---------------------------------------------------------------------------
// Inventory (merchant-side)
// ---------------------------------------------------------------------------

export interface PresaleInventoryDayDto {
  date: string
  status: string
  bookedCount?: number
  remainingStock?: number | null
  markupAmount?: number | null
}

// ---------------------------------------------------------------------------
// Passenger
// ---------------------------------------------------------------------------

export interface PresalePassengerDto {
  id: string | number
  passengerName?: string
  identityType?: string
  identityNo?: string
  phoneNumber?: string
  phoneCountryCode?: string
  passengerType?: number
  pinyinName?: string
  englishName?: string
}

export interface SavePresalePassengerRequestDto {
  id?: string | number
  passengerName: string
  identityType?: string
  identityNo?: string
  phoneNumber?: string
  phoneCountryCode?: string
  passengerType?: number
  pinyinName?: string
  englishName?: string
}

// ---------------------------------------------------------------------------
// Refund
// ---------------------------------------------------------------------------

export interface ApplyPresaleRefundRequestDto {
  preOrderId: string
  quantity: number
  reason: string
  remark?: string
}

export interface PresaleRefundOperationLogDto {
  createdAt?: string
  operatorType?: string
  operatorName?: string
  action?: string
}

export interface PresaleRefundDto {
  id: string
  preOrderId?: string
  refundNo?: string
  quantity?: number
  paidAmount?: number
  refundableAmount?: number
  actualRefundAmount?: number
  status?: string
  reason?: string
  remark?: string
  attachments?: string[]
  refundWay?: string
  createdAt?: string
  refundedAt?: string
  operationLogs?: PresaleRefundOperationLogDto[]
}