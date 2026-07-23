/**
 * Presale ("先囤后约") remote data source.
 *
 * Single source that owns every HTTP call against the presale endpoints.
 * All methods return `LynxResponse<T>` so the Repository layer can reach
 * `res.data` and hand it straight to the mapper.
 *
 * Endpoints follow the upstream `/openapi/presale/...` shape used by the
 * unified travel-client baseURL. Raw numeric status codes and Chinese labels
 * stay in DTOs — translation happens in mapper.ts.
 */

'background only'

import { travelClient } from '../network/client.js'
import type {
  ApplyPresaleRefundRequestDto,
  CreatePresaleOrderRequestDto,
  CreatePresaleOrderResponseDto,
  CreateReservationOrderRequestDto,
  CreateReservationOrderResponseDto,
  PresaleBrandOptionRawDto,
  PresaleCategoryTabRawDto,
  PresaleCityOptionRawDto,
  PresaleExchangeHotelDetailDto,
  PresaleExchangeHotelPageDto,
  PresaleInventoryDayDto,
  PresaleOrderDetailRawDto,
  PresaleOrderListResponseDto,
  PresalePassengerDto,
  PresaleProductCalendarResponseDto,
  PresaleProductDetailResponseDto,
  PresaleProductListResponseDto,
  PresalePurchasedQuantityDto,
  PresaleRefundDto,
  ReservationCalendarResponseDto,
  ReservationOrderDetailDto,
  ReservationValidateRequestDto,
  ReservationValidateResponseDto,
  SavePresalePassengerRequestDto,
} from './dto.js'

function toQuery(record: object) {
  return record as Record<string, string | number | boolean | undefined>
}

export class PresaleRemoteDataSource {
  /* ─── product (list / detail / category / city / brand) ──────────────── */

  getProductList(params: {
    pageNum?: number
    pageSize?: number
    name?: string
    productId?: string
    type?: string
    city?: string
    brand?: string
    status?: string
  }) {
    return travelClient.post<PresaleProductListResponseDto>(
      '/openapi/presale/product/list',
      params as unknown as Record<string, unknown>,
    )
  }

  getProductDetail(params: {
    productId: string
    skuId?: string
    channel?: string
    cityId?: string
    brandId?: string
    hotelId?: string
  }) {
    return travelClient.post<PresaleProductDetailResponseDto>(
      '/openapi/presale/product/detail',
      params as unknown as Record<string, unknown>,
    )
  }

  getCategoryTabs() {
    return travelClient.post<PresaleCategoryTabRawDto[]>(
      '/openapi/presale/product/category-tabs',
      {},
    )
  }

  getPackageCities(params: { channel?: string }) {
    return travelClient.post<PresaleCityOptionRawDto[]>(
      '/openapi/presale/product/package/cities',
      params as unknown as Record<string, unknown>,
    )
  }

  getExchangeCities(params: {
    productId?: string
    brandId?: string
    cityId?: string
    channel?: string
  }) {
    return travelClient.post<PresaleCityOptionRawDto[]>(
      '/openapi/presale/product/exchange/cities',
      params as unknown as Record<string, unknown>,
    )
  }

  getExchangeBrands(params: {
    productId?: string
    brandId?: string
    cityId?: string
    channel?: string
  }) {
    return travelClient.post<PresaleBrandOptionRawDto[]>(
      '/openapi/presale/product/exchange/brands',
      params as unknown as Record<string, unknown>,
    )
  }

  getPurchasedQuantity(productId: string) {
    return travelClient.get<PresalePurchasedQuantityDto>(
      '/openapi/api/presale/order/purchased-quantity',
      { params: toQuery({ productId }) },
    )
  }

  getProductCalendar(params: {
    productId: string
    skuId?: string
    channel?: string
    resourceId?: string
    calendarStartDate?: string
    calendarDays?: number
  }) {
    return travelClient.post<PresaleProductCalendarResponseDto>(
      '/openapi/presale/product/calendar',
      params as unknown as Record<string, unknown>,
    )
  }

  /* ─── hotel exchange (hotel list / rooms) ────────────────────────────── */

  searchExchangeHotels(params: {
    productId: string
    skuId?: string
    channel?: string
    cityId?: string
    brandId?: string
    hotelName?: string
    pageNum: number
    pageSize: number
  }) {
    return travelClient.post<PresaleExchangeHotelPageDto>(
      '/openapi/presale/product/exchange/hotels',
      params as unknown as Record<string, unknown>,
    )
  }

  getExchangeHotelRooms(params: {
    productId: string
    skuId?: string
    channel?: string
    resourceId: string
  }) {
    return travelClient.post<PresaleExchangeHotelDetailDto>(
      '/openapi/presale/product/exchange/hotel/rooms',
      params as unknown as Record<string, unknown>,
    )
  }

  /* ─── order (create / list / detail / cancel) ───────────────────────── */

  createOrder(params: CreatePresaleOrderRequestDto) {
    return travelClient.post<CreatePresaleOrderResponseDto>(
      '/openapi/api/presale/order/create',
      params as unknown as Record<string, unknown>,
    )
  }

  getOrderList(params: { pageNum?: number; pageSize?: number }) {
    return travelClient.post<PresaleOrderListResponseDto>(
      '/openapi/presale/order/list',
      params as unknown as Record<string, unknown>,
    )
  }

  getOrderDetail(orderBaseId: string) {
    return travelClient.post<PresaleOrderDetailRawDto>(
      '/openapi/presale-order/detail',
      { orderBaseId } as unknown as Record<string, unknown>,
    )
  }

  cancelOrder(orderId: string) {
    return travelClient.post<void>(
      '/openapi/presale/order/cancel',
      { orderId } as unknown as Record<string, unknown>,
    )
  }

  /* ─── appointment / reservation order ───────────────────────────────── */

  getReservationProductCalendar(params: {
    preSaleOrderBaseId: string
    skuId?: string
    channel?: string
    resourceId?: string
    calendarStartDate?: string
    calendarDays?: number
  }) {
    return travelClient.post<ReservationCalendarResponseDto>(
      '/openapi/reservation-order/product-calendar',
      params as unknown as Record<string, unknown>,
    )
  }

  validateReservationOrder(params: ReservationValidateRequestDto) {
    return travelClient.post<ReservationValidateResponseDto>(
      '/openapi/reservation-order/validate',
      params as unknown as Record<string, unknown>,
    )
  }

  createReservationOrder(params: CreateReservationOrderRequestDto) {
    return travelClient.post<CreateReservationOrderResponseDto>(
      '/openapi/reservation-order/create',
      params as unknown as Record<string, unknown>,
    )
  }

  getReservationOrderDetail(orderBaseId: string) {
    return travelClient.post<ReservationOrderDetailDto>(
      '/openapi/reservation-order/detail',
      { orderBaseId } as unknown as Record<string, unknown>,
    )
  }

  /* ─── inventory ─────────────────────────────────────────────────────── */

  getInventoryCalendar(params: {
    productId: string
    hotelId?: string
    startDate: string
    endDate: string
  }) {
    return travelClient.get<PresaleInventoryDayDto[]>(
      '/openapi/presale/inventory/calendar',
      { params: toQuery(params) },
    )
  }

  /* ─── passenger ─────────────────────────────────────────────────────── */

  getPassengerList(params: Record<string, unknown> = {}) {
    return travelClient.get<PresalePassengerDto[]>('/openapi/passenger/list', {
      params: toQuery(params),
    })
  }

  savePassenger(params: SavePresalePassengerRequestDto) {
    return travelClient.post<PresalePassengerDto>(
      '/openapi/passenger/save',
      params as unknown as Record<string, unknown>,
    )
  }

  deletePassenger(id: string) {
    return travelClient.post<unknown>(
      '/openapi/passenger/delete',
      { id } as unknown as Record<string, unknown>,
    )
  }

  /* ─── refund ────────────────────────────────────────────────────────── */

  applyRefund(params: ApplyPresaleRefundRequestDto) {
    return travelClient.post<{ id: string }>(
      '/openapi/presale/refund/apply',
      params as unknown as Record<string, unknown>,
    )
  }

  getRefundDetail(refundId: string) {
    return travelClient.get<PresaleRefundDto>(
      '/openapi/presale/refund/detail',
      { params: toQuery({ refundId }) },
    )
  }

  getRefundListByOrder(preOrderId: string) {
    return travelClient.get<PresaleRefundDto[]>(
      '/openapi/presale/refund/list',
      { params: toQuery({ preOrderId }) },
    )
  }
}