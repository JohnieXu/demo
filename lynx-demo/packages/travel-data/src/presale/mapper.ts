/**
 * Presale ("先囤后约") DTO → Domain entity mappers.
 *
 * Responsibilities:
 *  - Convert raw yuan amounts to `Money { amountInCents, currency }`.
 *  - Translate numeric status codes (PresaleOrderStatus / ReservationOrderStatus)
 *    into string enums the domain switches on. Unknown codes fall back to a
 *    safe default and log a warning.
 *  - Map raw category codes (`categoryType: 1|2`) to typed unions.
 *  - Forward `domain → DTO` for write operations (order creation, validation).
 *  - Provide a `toDomainError` helper used by every repository.
 */

import {
  type Money,
  type DomainError,
  type AppointmentStatus,
  type CalendarDayStatus,
  type PreOrderCancelReason,
  type PreOrderStatus,
  type PresaleOrderStatusCode,
  type PresaleRefundStatus,
  type ProductStatus,
  type ProductType,
  type ReservationOrderStatusCode,
  type StockMode,
  type ApplyPresaleRefundRequest,
  type CalendarDay,
  type CreatePresaleOrderRequest,
  type CreatePresaleOrderResponse,
  type CreateReservationOrderRequest,
  type CreateReservationOrderResponse,
  type PresaleAppointmentDetail,
  type PresaleBrandOption,
  type PresaleCategoryTab,
  type PresaleCityOption,
  type PresaleDetailCriteria,
  type PresaleHotelExchange,
  type PresaleExchangeHotelCriteria,
  type PresaleHotelExchangeDetail,
  type PresaleHotelExchangePage,
  type PresaleExchangeHotelRoomCriteria,
  type PresaleExchangeRoom,
  type PresaleHotelBrief,
  type PresaleInventoryCriteria,
  type PresaleInventoryDay,
  type PresaleListCriteria,
  type PresaleOrder,
  type PresaleOrderDetail,
  type PresaleOrderListCriteria,
  type PresalePackageCityCriteria,
  type PresalePassenger,
  type PresaleProduct,
  type PresaleProductCalendar,
  type PresaleProductCalendarCriteria,
  type PresaleProductDetail,
  type PresalePurchasedQuantity,
  type PresaleRefund,
  type PresaleReservationCalendar,
  type PresaleReservationCalendarCriteria,
  type PresaleRoomBrief,
  type PresaleTraveler,
  type ReservationCalendarDay,
  type ReservationSnapshot,
  type ReservationValidateRequest,
  type ReservationValidateResult,
  type SavePresalePassengerRequest,
} from 'travel-domain'
import type {
  ApplyPresaleRefundRequestDto,
  CalendarDayRawDto,
  CreatePresaleOrderRequestDto,
  CreatePresaleOrderResponseDto,
  CreateReservationOrderRequestDto,
  CreateReservationOrderResponseDto,
  PresaleAppointmentBriefRawDto,
  PresaleBrandOptionRawDto,
  PresaleCategoryTabRawDto,
  PresaleCityOptionRawDto,
  PresaleExchangeHotelDetailDto,
  PresaleExchangeHotelDto,
  PresaleExchangeHotelPageDto,
  PresaleExchangeHotelRoomDto,
  PresaleInventoryDayDto,
  PresaleOrderDetailRawDto,
  PresaleOrderListItemDto,
  PresaleOrderListResponseDto,
  PresalePassengerDto,
  PresaleRefundBriefRawDto,
  PresaleProductCalendarResponseDto,
  PresaleProductDetailResponseDto,
  PresaleProductListItemDto,
  PresaleProductListResponseDto,
  PresalePurchasedQuantityDto,
  PresaleRefundDto,
  ReservationCalendarDayRawDto,
  ReservationCalendarResponseDto,
  ReservationOrderDetailDto,
  ReservationSnapshotDto,
  ReservationValidateRequestDto,
  ReservationValidateResponseDto,
  SavePresalePassengerRequestDto,
} from './dto.js'

/* ─── money ──────────────────────────────────────────────────────────── */

const DEFAULT_CURRENCY = 'CNY'

export function yuanToMoney(
  yuan: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
): Money {
  if (yuan === null || yuan === undefined || !Number.isFinite(yuan)) {
    return { amountInCents: 0, currency }
  }
  return {
    amountInCents: Math.round(yuan * 100),
    currency,
  }
}

/* ─── product type / status / sale channel ────────────────────────────── */

function toProductType(value: string | undefined): ProductType | '' {
  switch (value) {
    case 'hotel_package':
      return 'hotel_package'
    case 'hotel_exchange':
      return 'hotel_exchange'
    case 'ticket':
      return 'ticket'
    case 'flight':
      return 'flight'
    case 'year_card':
      return 'year_card'
    default:
      return ''
  }
}

function toProductStatus(value: string | undefined): ProductStatus {
  switch (value) {
    case 'off_shelf':
      return 'off_shelf'
    case 'out_of_stock':
      return 'out_of_stock'
    case 'on_shelf':
    default:
      return 'on_shelf'
  }
}

function toSaleChannel(value: string | undefined): 'app' | 'mini_program' {
  return value === 'mini_program' ? 'mini_program' : 'app'
}

/* ─── category & numeric status ──────────────────────────────────────── */

function toCategoryType(value: number | undefined): 1 | 2 | undefined {
  if (value === 1 || value === 2) return value
  return undefined
}

function toPresaleOrderStatus(
  code: number | undefined,
): { status: PreOrderStatus; cancelReason: PreOrderCancelReason; code: PresaleOrderStatusCode | undefined } {
  switch (code) {
    case 0:
      return { status: 'pending_pay', cancelReason: 'unpaid', code }
    case 10:
      return { status: 'pending_book', cancelReason: 'unpaid', code }
    case 20:
      return { status: 'partial_book', cancelReason: 'unpaid', code }
    case 30:
      return { status: 'booked', cancelReason: 'unpaid', code }
    case 40:
      return { status: 'cancelled', cancelReason: 'unpaid', code }
    case 41:
      return { status: 'cancelled', cancelReason: 'timeout_refund', code }
    case 50:
      return { status: 'refunding', cancelReason: 'unpaid', code }
    case 60:
      return { status: 'refunded', cancelReason: 'unpaid', code }
    case 70:
      return { status: 'refund_failed', cancelReason: 'unpaid', code }
    default:
      console.warn('unknown presale order status', code)
      return { status: 'pending_pay', cancelReason: 'unpaid', code: undefined }
  }
}

function toReservationStatus(
  code: number | undefined,
): { status: AppointmentStatus; code: ReservationOrderStatusCode | undefined } {
  switch (code) {
    case 10:
      return { status: 'pending_pay', code }
    case 15:
      return { status: 'confirming', code }
    case 20:
      return { status: 'success', code }
    case 30:
    case 31:
    case 32:
      return { status: 'failed', code }
    case 40:
      return { status: 'cancelled', code }
    default:
      console.warn('unknown reservation status', code)
      return { status: 'pending_pay', code: undefined }
  }
}

function toRefundStatus(value: string | undefined): PresaleRefundStatus {
  switch (value) {
    case 'pending_audit':
      return 'pending_audit'
    case 'audit_pass':
      return 'audit_pass'
    case 'refunding':
      return 'refunding'
    case 'success':
      return 'success'
    case 'failed':
      return 'failed'
    case 'rejected':
      return 'rejected'
    default:
      console.warn('unknown refund status', value)
      return 'pending_audit'
  }
}

function toRefundWay(value: string | undefined): 'system' | 'manual' {
  return value === 'manual' ? 'manual' : 'system'
}

/* ─── calendar helpers ───────────────────────────────────────────────── */

function toStockMode(value: number | undefined): StockMode {
  return value === 1 ? 1 : 0
}

function toCalendarDayStatus(
  available: boolean,
  stockMode: StockMode,
  remaining?: number,
): CalendarDayStatus {
  if (!available) return 'unbookable'
  if (stockMode === 1 && remaining !== undefined && remaining <= 0) return 'full'
  return 'bookable'
}

function toCalendarDay(dto: CalendarDayRawDto): CalendarDay {
  const stockMode = toStockMode(dto.stockMode)
  const status = toCalendarDayStatus(!!dto.available, stockMode, dto.remainingInventory)
  return {
    date: dto.date,
    weekText: dto.weekText ?? '',
    available: !!dto.available,
    statusText: dto.statusText ?? '',
    stockMode,
    remainingInventory: dto.remainingInventory,
    surchargeAmount: yuanToMoney(dto.surchargeAmount ?? 0),
    salePrice: dto.salePrice !== undefined ? yuanToMoney(dto.salePrice) : undefined,
    displayText: dto.displayText ?? '',
    status,
  }
}

function toReservationCalendarDay(dto: ReservationCalendarDayRawDto): ReservationCalendarDay {
  const stockMode = toStockMode(dto.stockMode)
  const status = toCalendarDayStatus(!!dto.available, stockMode, dto.remainingInventory)
  return {
    date: dto.date,
    weekText: dto.weekText ?? '',
    available: !!dto.available,
    statusText: dto.statusText ?? '',
    stockMode,
    remainingInventory: dto.remainingInventory,
    surchargeAmount: yuanToMoney(dto.surchargeAmount ?? 0),
    displayText: dto.displayText ?? '',
    status,
  }
}

/* ─── product entity mapping ─────────────────────────────────────────── */

function toHotelBrief(dto: PresaleProductDetailResponseDto): PresaleHotelBrief {
  return {
    hotelId: dto.hotel?.hotelId ?? '',
    hotelName: dto.hotel?.hotelName ?? '',
    cityName: dto.hotel?.cityName ?? '',
    districtName: dto.hotel?.districtName ?? '',
    address: dto.hotel?.address ?? '',
    mainImage: dto.hotel?.mainImage ?? '',
  }
}

function toRoomBrief(dto: PresaleProductDetailResponseDto): PresaleRoomBrief {
  return {
    roomTypeId: dto.room?.roomTypeId ?? '',
    roomTypeName: dto.room?.roomTypeName ?? '',
    bedType: dto.room?.bedType ?? '',
    bedWidth: dto.room?.bedWidth ?? '',
    bedCount: dto.room?.bedCount ?? 0,
    floor: dto.room?.floor ?? '',
    area: dto.room?.area ?? '',
    windowType: dto.room?.windowType ?? '',
    mainImage: dto.room?.mainImage ?? '',
  }
}

function toPresaleProduct(dto: PresaleProductListItemDto): PresaleProduct {
  const categoryType = toCategoryType(dto.categoryType) ?? 1
  return {
    id: dto.productId ?? '',
    skuId: dto.skuId ?? '',
    name: dto.productName ?? '',
    productType: toProductType(dto.productType),
    categoryType,
    mainImage: dto.mainImage ?? '',
    salePrice: yuanToMoney(dto.salePrice),
    originalPrice: yuanToMoney(dto.originalPrice),
    discount: yuanToMoney(dto.discount),
    validStartDate: dto.validStartDate ?? '',
    validEndDate: dto.validEndDate ?? '',
    saleChannels: (dto.saleChannels ?? []).map(toSaleChannel),
    status: toProductStatus(dto.status),
  }
}

function toPresaleProductDetail(dto: PresaleProductDetailResponseDto): PresaleProductDetail {
  const categoryType = toCategoryType(dto.categoryType) ?? 1
  const productType = toProductType(dto.productType)
  return {
    id: dto.productId ?? '',
    skuId: dto.skuId ?? '',
    productId: dto.productId ?? '',
    name: dto.productName ?? '',
    productType,
    categoryType,
    mainImage: dto.mainImage ?? dto.coverImage ?? '',
    salePrice: yuanToMoney(dto.salePrice),
    originalPrice: yuanToMoney(dto.originalPrice),
    discount: yuanToMoney(dto.discount),
    validStartDate: dto.validStartDate ?? '',
    validEndDate: dto.validEndDate ?? '',
    saleChannels: (dto.saleChannels ?? []).map(toSaleChannel),
    status: toProductStatus(dto.status),
    nights: dto.nights ?? 1,
    splittable: dto.splittable ?? dto.hotelExchangeDetail?.splittable ?? false,
    maxStock: dto.maxStock ?? 0,
    unbookableDates: dto.unbookableDates ?? [],
    limitPerUser: dto.limitPerUser ?? 0,
    sameDayBookable: dto.sameDayBookable ?? false,
    bookAheadDays: dto.bookAheadDays ?? 1,
    reservationRuleText: dto.reservationRuleText ?? dto.packageDetail?.reservationRuleText ?? '',
    validityText: dto.validityText ?? dto.packageDetail?.validityText ?? '',
    detailImages: dto.detailImages ?? [],
    hotel: toHotelBrief(dto),
    room: toRoomBrief(dto),
    lowestPrice: yuanToMoney(dto.lowestPrice ?? dto.salePrice),
  }
}

function toPresaleCategoryTab(dto: PresaleCategoryTabRawDto): PresaleCategoryTab | null {
  const value = toProductType(
    dto.categoryType === 1 ? 'hotel_package' : dto.categoryType === 2 ? 'hotel_exchange' : undefined,
  )
  if (!value) return null
  return {
    value,
    label: dto.categoryName,
    productCount: dto.productCount,
  }
}

function toPresaleCityOption(dto: PresaleCityOptionRawDto): PresaleCityOption {
  return {
    cityId: dto.cityId,
    cityName: dto.cityName,
    productCount: dto.productCount,
    hotelCount: dto.hotelCount ?? undefined,
  }
}

function toPresaleBrandOption(dto: PresaleBrandOptionRawDto): PresaleBrandOption {
  return {
    brandId: dto.brandId,
    brandName: dto.brandName,
    hotelCount: dto.hotelCount ?? undefined,
  }
}

function toPresalePurchasedQuantity(dto: PresalePurchasedQuantityDto): PresalePurchasedQuantity {
  return {
    productId: dto.productId,
    purchasedQuantity: dto.purchasedQuantity,
  }
}

/* ─── product calendar ──────────────────────────────────────────────── */

function toProductCalendar(dto: PresaleProductCalendarResponseDto): PresaleProductCalendar {
  return {
    productId: dto.productId,
    skuId: dto.skuId,
    resourceId: dto.resourceId,
    nights: dto.nights,
    roomCount: dto.roomCount,
    splittable: dto.splittable,
    sellPrice: dto.sellPrice !== undefined ? yuanToMoney(dto.sellPrice) : undefined,
    calendarDays: dto.calendarDays.map(toCalendarDay),
  }
}

function toReservationCalendar(dto: ReservationCalendarResponseDto): PresaleReservationCalendar {
  return {
    preSaleOrderBaseId: dto.preSaleOrderBaseId,
    productId: dto.productId,
    skuId: dto.skuId,
    resourceId: dto.resourceId,
    nights: dto.nights,
    roomCount: dto.roomCount,
    splittable: dto.splittable,
    remainingBookableNights: dto.remainingBookableNights,
    calendarDays: dto.calendarDays.map(toReservationCalendarDay),
  }
}

/* ─── hotel exchange ────────────────────────────────────────────────── */

function toExchangeRoom(dto: PresaleExchangeHotelRoomDto): PresaleExchangeRoom {
  return {
    roomTypeId: dto.roomTypeId ?? '',
    roomTypeName: dto.roomTypeName ?? '',
    bedType: dto.bedType ?? '',
    bedWidth: dto.bedWidth ?? '',
    bedCount: dto.bedCount ?? 0,
    floor: dto.floor ?? '',
    area: dto.area ?? '',
    windowType: dto.windowType ?? '',
    maxOccupancy: dto.maxOccupancy ?? 0,
    breakfastType: dto.breakfastType ?? '',
    markPrice: yuanToMoney(dto.markPrice),
    roomImage: dto.roomImage ?? '',
  }
}

function toExchangeHotel(dto: PresaleExchangeHotelDto): PresaleHotelExchange {
  return {
    resourceId: dto.resourceId,
    hotelId: dto.hotelId,
    hotelName: dto.hotelName,
    hotelImage: dto.hotelImage ?? '',
    cityId: dto.cityId ?? '',
    cityName: dto.cityName ?? '',
    districtName: dto.districtName ?? '',
    brandId: dto.brandId ?? '',
    brandName: dto.brandName ?? '',
    starRate: dto.starRate,
    category: dto.category ?? 0,
    summaryScore: dto.summaryScore ?? '',
    address: dto.address ?? '',
    rooms: (dto.rooms ?? []).map(toExchangeRoom),
  }
}

function toExchangeHotelPage(dto: PresaleExchangeHotelPageDto): PresaleHotelExchangePage {
  return {
    productId: dto.productId,
    skuId: dto.skuId,
    pageNum: dto.pageNum,
    pageSize: dto.pageSize,
    total: dto.total,
    hotels: dto.hotels.map(toExchangeHotel),
  }
}

function toExchangeHotelDetail(dto: PresaleExchangeHotelDetailDto): PresaleHotelExchangeDetail {
  return {
    productId: dto.productId,
    skuId: dto.skuId,
    hotelId: dto.hotelId,
    hotelName: dto.hotelName,
    cityName: dto.cityName ?? '',
    brandName: dto.brandName ?? '',
    nights: dto.nights,
    roomCount: dto.roomCount,
    splittable: dto.splittable,
    rooms: (dto.rooms ?? []).map(toExchangeRoom),
  }
}

/* ─── order mapping ─────────────────────────────────────────────────── */

function toTraveler(dto: {
  name?: string
  phone?: string
  adultCount?: number
  childCount?: number
  idCard?: string
  passport?: string
}): PresaleTraveler {
  return {
    name: dto.name ?? '',
    phone: dto.phone,
    adultCount: dto.adultCount ?? 0,
    childCount: dto.childCount ?? 0,
    idCard: dto.idCard,
    passport: dto.passport,
  }
}

function toOrderCore(
  dto: PresaleOrderListItemDto,
  detail: PresaleOrderDetailRawDto | null,
): PresaleOrder {
  const mapped = toPresaleOrderStatus(dto.presaleStatus ?? detail?.presaleStatus)
  const product = detail?.product
    ? toPresaleProductDetail(detail.product)
    : buildPlaceholderProduct(dto)
  return {
    id: dto.orderBaseId ?? '',
    productId: dto.productId ?? detail?.productId ?? '',
    productName: dto.productName ?? detail?.productName ?? '',
    productImage: dto.productImage ?? detail?.productImage ?? product.mainImage,
    productType: dto.productType ?? detail?.productType ?? '',
    categoryType: toCategoryType(dto.categoryType ?? detail?.categoryType) ?? 1,
    quantity: dto.quantity ?? detail?.quantity ?? 0,
    travelers: (dto.travelers ?? detail?.travelers ?? []).map(toTraveler),
    contactPhone: dto.contactPhone ?? detail?.contactPhone ?? '',
    originalUnitPrice:
      dto.originalUnitPrice !== undefined ? yuanToMoney(dto.originalUnitPrice) : undefined,
    sellUnitPrice: dto.sellUnitPrice !== undefined ? yuanToMoney(dto.sellUnitPrice) : undefined,
    discountUnitPrice:
      dto.discountUnitPrice !== undefined ? yuanToMoney(dto.discountUnitPrice) : undefined,
    originalAmount: yuanToMoney(dto.originalAmount ?? detail?.originalAmount),
    payableAmount: yuanToMoney(
      dto.payableAmount ?? detail?.payableAmount ?? dto.paidAmount ?? detail?.paidAmount,
    ),
    paidAmount: yuanToMoney(dto.paidAmount ?? detail?.paidAmount),
    discountAmount: yuanToMoney(dto.discountAmount ?? detail?.discountAmount),
    status: mapped.status,
    cancelReason: dto.cancelReason === 'timeout_refund' ? 'timeout_refund' : 'unpaid',
    presaleStatus: mapped.code,
    reservedCount: dto.reservedCount ?? detail?.reservedCount ?? 0,
    totalReservableCount: dto.totalReservableCount ?? detail?.totalReservableCount ?? 0,
    validEndDate: dto.validEndDate ?? detail?.validEndDate ?? '',
    createdAt: dto.createTime ?? detail?.createTime ?? '',
    paidAt: dto.paidAt ?? detail?.paidAt,
    payExpireTime: dto.payExpireTime ?? detail?.payExpireTime,
    subtitle: dto.subtitle ?? detail?.subtitle,
    product,
  }
}

function buildPlaceholderProduct(dto: PresaleOrderListItemDto): PresaleProductDetail {
  return toPresaleProductDetail({
    productId: dto.productId ?? '',
    skuId: '',
    productName: dto.productName ?? '',
    productType: dto.productType,
    categoryType: dto.categoryType ?? 1,
    salePrice: dto.sellUnitPrice,
    originalPrice: dto.originalUnitPrice,
    discount: dto.discountUnitPrice,
    validEndDate: dto.validEndDate,
  })
}

function toOrderListItem(dto: PresaleOrderListItemDto): PresaleOrder {
  return toOrderCore(dto, null)
}

function toOrderDetail(dto: PresaleOrderDetailRawDto): PresaleOrderDetail {
  const base = toOrderCore(dto, dto)
  return {
    ...base,
    appointments: (dto.appointments ?? []).map(toAppointmentBrief),
    refunds: (dto.refunds ?? []).map(toRefundBrief),
    operationLogs: (dto.operationLogs ?? []).map(toOperationLog),
  }
}

function toAppointmentBrief(dto: PresaleAppointmentBriefRawDto) {
  return {
    id: dto.id ?? '',
    status: dto.status ?? '',
    checkInDate: dto.checkInDate ?? '',
    checkOutDate: dto.checkOutDate ?? '',
    nights: dto.nights ?? 0,
    quantity: dto.quantity ?? 0,
    markupAmount: dto.markupAmount !== undefined ? yuanToMoney(dto.markupAmount) : undefined,
  }
}

function toRefundBrief(dto: PresaleRefundBriefRawDto) {
  return {
    id: dto.id ?? '',
    status: dto.status ?? '',
    quantity: dto.quantity ?? 0,
    amount: yuanToMoney(dto.amount),
  }
}

function toOperationLog(dto: {
  id?: string
  createdAt?: string
  operatorType?: string
  operatorName?: string
  action?: string
  remark?: string
}) {
  return {
    id: dto.id ?? '',
    createdAt: dto.createdAt ?? '',
    operatorType: (dto.operatorType as 'system' | 'user' | 'operator') ?? 'system',
    operatorName: dto.operatorName ?? '',
    action: dto.action ?? '',
    remark: dto.remark,
  }
}

/* ─── create order response ─────────────────────────────────────────── */

function toCreatePresaleOrderResponse(dto: CreatePresaleOrderResponseDto): CreatePresaleOrderResponse {
  return {
    orderBaseId: dto.orderBaseId,
    payExpireTime: dto.payExpireTime,
    totalAmount: yuanToMoney(dto.totalAmount),
    originalAmount: yuanToMoney(dto.originalAmount),
    productName: dto.productName,
    presaleOrderStatus: dto.presaleOrderStatus as PresaleOrderStatusCode,
  }
}

/* ─── create order request ──────────────────────────────────────────── */

function moneyToYuan(money: Money): number {
  return money.amountInCents / 100
}

function toCreatePresaleOrderRequestDto(req: CreatePresaleOrderRequest): CreatePresaleOrderRequestDto {
  return {
    userName: req.userName,
    phoneCountryCode: req.phoneCountryCode,
    phoneNumber: req.phoneNumber,
    distributor: req.distributor,
    orderSource: req.orderSource,
    email: req.email,
    clientType: req.clientType,
    clientVersion: req.clientVersion,
    channelId: req.channelId,
    currency: req.currency,
    skuId: req.skuId,
    quantity: req.quantity,
    price: moneyToYuan(req.price),
    totalAmount: moneyToYuan(req.totalAmount),
    contactName: req.contactName,
    contactPhone: req.contactPhone,
    subOrderType: req.subOrderType,
    entranceSource: req.entranceSource,
  }
}

/* ─── reservation request / response ─────────────────────────────────── */

function toReservationSnapshot(snapshot: ReservationSnapshot): ReservationSnapshotDto {
  return {
    reserveCount: snapshot.reserveCount,
    travelers: snapshot.travelers.map((t) => ({
      travelerName: t.travelerName,
      identityNo: t.identityNo,
    })),
    contactPhone: snapshot.contactPhone,
    skuId: snapshot.skuId,
    checkInDate: snapshot.checkInDate,
    checkOutDate: snapshot.checkOutDate,
    roomType: snapshot.roomType,
    hotelName: snapshot.hotelName,
    productName: snapshot.productName,
  }
}

function toReservationValidateRequestDto(req: ReservationValidateRequest): ReservationValidateRequestDto {
  return {
    preSaleOrderBaseId: req.preSaleOrderBaseId,
    orderType: req.orderType,
    reserveSnapshot: toReservationSnapshot(req.reserveSnapshot),
  }
}

function toReservationValidateResult(dto: ReservationValidateResponseDto): ReservationValidateResult {
  return {
    canReserve: dto.canReserve,
    failReason: dto.failReason,
    needSurcharge: dto.needSurcharge,
    surchargeAmount: dto.surchargeAmount !== undefined ? yuanToMoney(dto.surchargeAmount) : undefined,
    surchargeDetail: dto.surchargeDetail,
  }
}

function toCreateReservationOrderRequestDto(
  req: CreateReservationOrderRequest,
): CreateReservationOrderRequestDto {
  return {
    preSaleOrderBaseId: req.preSaleOrderBaseId,
    orderType: req.orderType,
    reserveSnapshot: toReservationSnapshot(req.reserveSnapshot),
    surchargeAmount: req.surchargeAmount ? moneyToYuan(req.surchargeAmount) : undefined,
    surchargeDetail: req.surchargeDetail,
  }
}

function toCreateReservationOrderResponse(
  dto: CreateReservationOrderResponseDto,
): CreateReservationOrderResponse {
  return {
    orderBaseId: dto.orderBaseId,
    reservationStatus: dto.reservationStatus as ReservationOrderStatusCode,
    failReason: dto.failReason,
  }
}

/* ─── reservation order detail ──────────────────────────────────────── */

function toReservationAppointmentDetail(dto: ReservationOrderDetailDto): PresaleAppointmentDetail {
  const mapped = toReservationStatus(dto.reservationStatus)
  return {
    id: dto.orderBaseId,
    orderBaseId: dto.orderBaseId,
    preOrderId: dto.preSaleOrderBaseId ?? '',
    reservationStatus: mapped.code ?? 10,
    status: mapped.status,
    payExpireTime: dto.payExpireTime ?? undefined,
    hotelName: dto.hotelName,
    hotelAddress: dto.hotelAddress,
    hotelImage: dto.hotelPicUrl ?? '',
    hotelPhone: dto.hotelPhone ?? undefined,
    hotelLatitude:
      typeof dto.hotelLatitude === 'number'
        ? dto.hotelLatitude
        : dto.hotelLatitude !== null && dto.hotelLatitude !== undefined
          ? Number(dto.hotelLatitude) || undefined
          : undefined,
    hotelLongitude:
      typeof dto.hotelLongitude === 'number'
        ? dto.hotelLongitude
        : dto.hotelLongitude !== null && dto.hotelLongitude !== undefined
          ? Number(dto.hotelLongitude) || undefined
          : undefined,
    checkInDate: dto.checkInDate,
    checkOutDate: dto.checkOutDate,
    checkInDesc: dto.checkInDesc ?? '',
    checkOutDesc: dto.checkOutDesc ?? '',
    nights: dto.nightQuantity,
    roomTypeName: dto.roomName,
    roomImage: dto.roomImageUrl ?? '',
    specs: parseRoomSpecs(dto.roomAttrDesc),
    quantityDesc: dto.roomQuantityDesc ?? '',
    meals: (dto.meals ?? []).map((meal) => ({
      date: meal.date,
      dateDesc: meal.dateDesc ?? '',
      mealDesc: meal.mealDesc ?? '',
    })),
    surchargeAmount: yuanToMoney(dto.surchargeAmount),
    travelerNames: dto.travelerNames ?? '',
    contactPhone: dto.contactPhone,
    reserveTime: dto.reserveTime ?? '',
    supplierRemark: dto.supplierRemark ?? undefined,
    remark: dto.remark ?? undefined,
  }
}

function parseRoomSpecs(value?: string | null): readonly string[] {
  if (!value) return []
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
}

/* ─── inventory ─────────────────────────────────────────────────────── */

function toInventoryDay(dto: PresaleInventoryDayDto): PresaleInventoryDay {
  const status = (dto.status as CalendarDayStatus) ?? 'bookable'
  return {
    date: dto.date,
    status,
    bookedCount: dto.bookedCount ?? 0,
    remainingStock: dto.remainingStock ?? null,
    markupAmount:
      dto.markupAmount !== undefined && dto.markupAmount !== null
        ? yuanToMoney(dto.markupAmount)
        : null,
  }
}

/* ─── passenger ─────────────────────────────────────────────────────── */

function toPassenger(dto: PresalePassengerDto): PresalePassenger {
  return {
    id: String(dto.id ?? ''),
    passengerName: dto.passengerName ?? '',
    identityType: dto.identityType as PresalePassenger['identityType'],
    identityNo: dto.identityNo,
    phoneNumber: dto.phoneNumber,
    phoneCountryCode: dto.phoneCountryCode,
    passengerType: dto.passengerType as PresalePassenger['passengerType'],
    pinyinName: dto.pinyinName,
    englishName: dto.englishName,
  }
}

function toSavePassengerRequestDto(req: SavePresalePassengerRequest): SavePresalePassengerRequestDto {
  return {
    id: req.id,
    passengerName: req.passengerName,
    identityType: req.identityType,
    identityNo: req.identityNo,
    phoneNumber: req.phoneNumber,
    phoneCountryCode: req.phoneCountryCode,
    passengerType: req.passengerType,
    pinyinName: req.pinyinName,
    englishName: req.englishName,
  }
}

/* ─── refund ─────────────────────────────────────────────────────────── */

function toRefund(dto: PresaleRefundDto): PresaleRefund {
  return {
    id: dto.id,
    preOrderId: dto.preOrderId ?? '',
    refundNo: dto.refundNo ?? '',
    quantity: dto.quantity ?? 0,
    paidAmount: yuanToMoney(dto.paidAmount),
    refundableAmount: yuanToMoney(dto.refundableAmount),
    actualRefundAmount: yuanToMoney(dto.actualRefundAmount),
    status: toRefundStatus(dto.status),
    reason: dto.reason ?? '',
    remark: dto.remark,
    attachments: dto.attachments,
    refundWay: toRefundWay(dto.refundWay),
    createdAt: dto.createdAt ?? '',
    refundedAt: dto.refundedAt,
    operationLogs: (dto.operationLogs ?? []).map((log) => ({
      createdAt: log.createdAt ?? '',
      operatorType: log.operatorType ?? '',
      operatorName: log.operatorName ?? '',
      action: log.action ?? '',
    })),
  }
}

function toApplyRefundRequestDto(req: ApplyPresaleRefundRequest): ApplyPresaleRefundRequestDto {
  return {
    preOrderId: req.preOrderId,
    quantity: req.quantity,
    reason: req.reason,
    remark: req.remark,
  }
}

/* ─── request DTO for product list ──────────────────────────────────── */

function toProductListRequestDto(criteria: PresaleListCriteria) {
  return {
    pageNum: criteria.page,
    pageSize: criteria.pageSize,
    name: criteria.name,
    productId: criteria.productId,
    type: criteria.type,
    city: criteria.city,
    brand: criteria.brand,
    status: criteria.status,
  }
}

function toProductDetailRequestDto(criteria: PresaleDetailCriteria) {
  return {
    productId: criteria.productId,
    skuId: criteria.skuId,
    channel: criteria.channel,
    cityId: criteria.cityId,
    brandId: criteria.brandId,
    hotelId: criteria.hotelId,
  }
}

function toPackageCityRequestDto(criteria: PresalePackageCityCriteria) {
  return {
    channel: criteria.channel,
  }
}

function toExchangeHotelRequestDto(criteria: PresaleExchangeHotelCriteria) {
  return {
    productId: criteria.productId,
    skuId: criteria.skuId,
    channel: criteria.channel,
    cityId: criteria.cityId,
    brandId: criteria.brandId,
    hotelName: criteria.hotelName,
    pageNum: criteria.page,
    pageSize: criteria.pageSize,
  }
}

function toExchangeHotelRoomRequestDto(criteria: PresaleExchangeHotelRoomCriteria) {
  return {
    productId: criteria.productId,
    skuId: criteria.skuId,
    channel: criteria.channel,
    resourceId: criteria.resourceId,
  }
}

function toProductCalendarRequestDto(criteria: PresaleProductCalendarCriteria) {
  return {
    productId: criteria.productId,
    skuId: criteria.skuId,
    channel: criteria.channel,
    resourceId: criteria.resourceId,
    calendarStartDate: criteria.calendarStartDate,
    calendarDays: criteria.calendarDays,
  }
}

function toReservationCalendarRequestDto(criteria: PresaleReservationCalendarCriteria) {
  return {
    preSaleOrderBaseId: criteria.preSaleOrderBaseId,
    skuId: criteria.skuId,
    channel: criteria.channel,
    resourceId: criteria.resourceId,
    calendarStartDate: criteria.calendarStartDate,
    calendarDays: criteria.calendarDays,
  }
}

function toInventoryRequestDto(criteria: PresaleInventoryCriteria) {
  return {
    productId: criteria.productId,
    hotelId: criteria.hotelId,
    startDate: criteria.startDate,
    endDate: criteria.endDate,
  }
}

function toOrderListRequestDto(criteria: PresaleOrderListCriteria) {
  return {
    pageNum: criteria.page,
    pageSize: criteria.pageSize,
  }
}

/* ─── list response helpers ─────────────────────────────────────────── */

function toProductListResponse(dto: PresaleProductListResponseDto) {
  return {
    list: dto.list.map(toPresaleProduct),
    total: dto.total,
    page: dto.page ?? 1,
    pageSize: dto.pageSize ?? dto.list.length,
  }
}

function toOrderListResponse(dto: PresaleOrderListResponseDto) {
  return {
    list: dto.list.map(toOrderListItem),
    total: dto.total,
    page: dto.page ?? 1,
    pageSize: dto.pageSize ?? dto.list.length,
  }
}

/* ─── public mappers ────────────────────────────────────────────────── */

export const toPresaleProductList = toProductListResponse
export const toPresaleProductDetailEntity = toPresaleProductDetail
export const toPresaleCategoryTabs = (list: readonly PresaleCategoryTabRawDto[]) =>
  list
    .map(toPresaleCategoryTab)
    .filter((item): item is PresaleCategoryTab => item !== null)
export const toPresalePackageCities = (list: readonly PresaleCityOptionRawDto[]) =>
  list.map(toPresaleCityOption)
export const toPresaleExchangeCities = (list: readonly PresaleCityOptionRawDto[]) =>
  list.map(toPresaleCityOption)
export const toPresaleExchangeBrands = (list: readonly PresaleBrandOptionRawDto[]) =>
  list.map(toPresaleBrandOption)
export const toPresalePurchasedQuantityEntity = toPresalePurchasedQuantity

export const toPresaleProductCalendarEntity = toProductCalendar
export const toPresaleReservationCalendarEntity = toReservationCalendar

export const toPresaleExchangeHotelPageEntity = toExchangeHotelPage
export const toPresaleExchangeHotelDetailEntity = toExchangeHotelDetail

export const toPresaleOrderList = toOrderListResponse
export const toPresaleOrderDetail = toOrderDetail
export const toCreatePresaleOrderResponseEntity = toCreatePresaleOrderResponse
export const toCreatePresaleOrderRequestEntity = toCreatePresaleOrderRequestDto

export const toReservationValidateRequestEntity = toReservationValidateRequestDto
export const toReservationValidateResultEntity = toReservationValidateResult
export const toCreateReservationOrderRequestEntity = toCreateReservationOrderRequestDto
export const toCreateReservationOrderResponseEntity = toCreateReservationOrderResponse
export const toPresaleAppointmentDetailEntity = toReservationAppointmentDetail

export const toInventoryDayList = (list: readonly PresaleInventoryDayDto[]) =>
  list.map(toInventoryDay)

export const toPassengerList = (list: readonly PresalePassengerDto[]) => list.map(toPassenger)
export const toPassengerEntity = toPassenger
export const toSavePassengerRequestEntity = toSavePassengerRequestDto

export const toRefundList = (list: readonly PresaleRefundDto[]) => list.map(toRefund)
export const toRefundEntity = toRefund
export const toApplyRefundRequestEntity = toApplyRefundRequestDto

/* request DTO helpers */
export const toPresaleProductListRequest = toProductListRequestDto
export const toPresaleProductDetailRequest = toProductDetailRequestDto
export const toPresalePackageCityRequest = toPackageCityRequestDto
export const toPresaleExchangeHotelRequest = toExchangeHotelRequestDto
export const toPresaleExchangeHotelRoomRequest = toExchangeHotelRoomRequestDto
export const toPresaleProductCalendarRequest = toProductCalendarRequestDto
export const toPresaleReservationCalendarRequest = toReservationCalendarRequestDto
export const toPresaleInventoryRequest = toInventoryRequestDto
export const toPresaleOrderListRequest = toOrderListRequestDto

/* ─── error helper ──────────────────────────────────────────────────── */

export function toDomainError(e: unknown): DomainError {
  if (e instanceof Error) {
    return {
      code: (e as { code?: string }).code || 'NETWORK_ERROR',
      message: e.message,
      cause: e,
    }
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: String(e),
    cause: e,
  }
}