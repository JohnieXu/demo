/**
 * Presale ("先囤后约") repository implementations.
 *
 * Seven focused classes share a single `PresaleRemoteDataSource`. Each
 * repository is the only thing the app layer depends on for its bounded
 * context; cross-repository coordination (e.g. "load order then its refunds")
 * stays in the app.
 *
 * Constructor injection of the data source keeps the implementation testable
 * without touching the network — tests pass a fake that exposes the same
 * methods (see __tests__/repository.test.ts).
 */

'background only'

import {
  createPageResult,
  err,
  ok,
  type IPresaleAppointmentRepository,
  type IPresaleHotelRepository,
  type IPresaleInventoryRepository,
  type IPresaleOrderRepository,
  type IPresalePassengerRepository,
  type IPresaleProductRepository,
  type IPresaleRefundRepository,
  type PageResult,
  type Result,
  type ApplyPresaleOrderRefundRequest,
  type ApplyPresaleRefundRequest,
  type CreatePresaleOrderRequest,
  type CreatePresaleOrderResponse,
  type CreateReservationOrderRequest,
  type CreateReservationOrderResponse,
  type PresaleBrandOption,
  type PresaleCategoryTab,
  type PresaleCityOption,
  type PresaleDetailCriteria,
  type PresaleExchangeBrandCriteria,
  type PresaleExchangeHotelCriteria,
  type PresaleExchangeHotelRoomCriteria,
  type PresaleHotelExchangeDetail,
  type PresaleHotelExchangePage,
  type PresaleInventoryCriteria,
  type PresaleInventoryDay,
  type PresaleListCriteria,
  type PresaleOrder,
  type PresaleOrderDetail,
  type PresaleOrderListCriteria,
  type PresaleOrderRefundItem,
  type PresaleOrderRefundListCriteria,
  type PresalePackageCityCriteria,
  type PresalePassenger,
  type PresaleProduct,
  type PresaleProductCalendar,
  type PresaleProductCalendarCriteria,
  type PresaleProductDetail,
  type PresaleProductNotice,
  type PresaleProductNoticeCriteria,
  type PresalePurchasedQuantity,
  type PresaleRefund,
  type PresaleReservationCalendar,
  type PresaleReservationCalendarCriteria,
  type ReservationValidateRequest,
  type ReservationValidateResult,
  type SavePresalePassengerRequest,
  type PresaleAppointmentDetail,
} from 'travel-domain'
import { PresaleRemoteDataSource } from './datasource.js'
import {
  toApplyPresaleOrderRefundRequestEntity,
  toApplyRefundRequestEntity,
  toCreatePresaleOrderRequestEntity,
  toCreatePresaleOrderResponseEntity,
  toCreateReservationOrderRequestEntity,
  toCreateReservationOrderResponseEntity,
  toDomainError,
  toInventoryDayList,
  toOrderRefundListEntity,
  toPassengerEntity,
  toPassengerList,
  toPresaleCategoryTabs,
  toPresaleExchangeBrands,
  toPresaleExchangeCities,
  toPresaleExchangeHotelDetailEntity,
  toPresaleExchangeHotelPageEntity,
  toPresaleExchangeHotelRequest,
  toPresaleExchangeHotelRoomRequest,
  toPresaleInventoryRequest,
  toPresaleOrderDetail,
  toPresaleOrderList,
  toPresaleOrderListRequest,
  toPresalePackageCities,
  toPresalePackageCityRequest,
  toPresaleProductCalendarEntity,
  toPresaleProductCalendarRequest,
  toPresaleProductDetailEntity,
  toPresaleProductDetailRequest,
  toPresaleProductList,
  toPresaleProductListRequest,
  toPresaleProductNoticeListEntity,
  toPresalePurchasedQuantityEntity,
  toPresaleAppointmentDetailEntity,
  toPresaleReservationCalendarEntity,
  toPresaleReservationCalendarRequest,
  toRefundEntity,
  toRefundList,
  toReservationValidateRequestEntity,
  toReservationValidateResultEntity,
  toSavePassengerRequestEntity,
} from './mapper.js'

/* ─── Product ────────────────────────────────────────────────────────── */

export class PresaleProductRepository implements IPresaleProductRepository {
  constructor(private readonly ds: PresaleRemoteDataSource = new PresaleRemoteDataSource()) {}

  async getList(
    criteria: PresaleListCriteria,
  ): Promise<Result<PageResult<PresaleProduct>>> {
    try {
      const res = await this.ds.getProductList(toPresaleProductListRequest(criteria))
      const { list, total, page, pageSize } = toPresaleProductList(res.data)
      return ok(createPageResult(list, total, page, pageSize))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getDetail(
    criteria: PresaleDetailCriteria,
  ): Promise<Result<PresaleProductDetail>> {
    try {
      const res = await this.ds.getProductDetail(toPresaleProductDetailRequest(criteria))
      return ok(toPresaleProductDetailEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getCategoryTabs(): Promise<Result<readonly PresaleCategoryTab[]>> {
    try {
      const res = await this.ds.getCategoryTabs()
      return ok(toPresaleCategoryTabs(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getPackageCities(
    criteria: PresalePackageCityCriteria,
  ): Promise<Result<readonly PresaleCityOption[]>> {
    try {
      const res = await this.ds.getPackageCities(toPresalePackageCityRequest(criteria))
      return ok(toPresalePackageCities(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getExchangeCities(
    criteria: PresaleExchangeBrandCriteria,
  ): Promise<Result<readonly PresaleCityOption[]>> {
    try {
      const res = await this.ds.getExchangeCities({
        productId: criteria.productId,
        brandId: criteria.brandId,
        cityId: criteria.cityId,
        channel: criteria.channel,
      })
      return ok(toPresaleExchangeCities(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getExchangeBrands(
    criteria: PresaleExchangeBrandCriteria,
  ): Promise<Result<readonly PresaleBrandOption[]>> {
    try {
      const res = await this.ds.getExchangeBrands({
        productId: criteria.productId,
        brandId: criteria.brandId,
        cityId: criteria.cityId,
        channel: criteria.channel,
      })
      return ok(toPresaleExchangeBrands(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getPurchasedQuantity(
    productId: string,
  ): Promise<Result<PresalePurchasedQuantity>> {
    try {
      const res = await this.ds.getPurchasedQuantity(productId)
      return ok(toPresalePurchasedQuantityEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getProductCalendar(
    criteria: PresaleProductCalendarCriteria,
  ): Promise<Result<PresaleProductCalendar>> {
    try {
      const res = await this.ds.getProductCalendar(toPresaleProductCalendarRequest(criteria))
      return ok(toPresaleProductCalendarEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getProductNotice(
    criteria: PresaleProductNoticeCriteria,
  ): Promise<Result<readonly PresaleProductNotice[]>> {
    try {
      const res = await this.ds.getProductNotice({
        skuId: criteria.skuId,
        orderBaseId: criteria.orderBaseId,
      })
      return ok(toPresaleProductNoticeListEntity(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── Hotel exchange ─────────────────────────────────────────────────── */

export class PresaleHotelRepository implements IPresaleHotelRepository {
  constructor(private readonly ds: PresaleRemoteDataSource = new PresaleRemoteDataSource()) {}

  async searchExchangeHotels(
    criteria: PresaleExchangeHotelCriteria,
  ): Promise<Result<PresaleHotelExchangePage>> {
    try {
      const res = await this.ds.searchExchangeHotels(toPresaleExchangeHotelRequest(criteria))
      return ok(toPresaleExchangeHotelPageEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getExchangeHotelRooms(
    criteria: PresaleExchangeHotelRoomCriteria,
  ): Promise<Result<PresaleHotelExchangeDetail>> {
    try {
      const res = await this.ds.getExchangeHotelRooms(toPresaleExchangeHotelRoomRequest(criteria))
      return ok(toPresaleExchangeHotelDetailEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── Order ──────────────────────────────────────────────────────────── */

export class PresaleOrderRepository implements IPresaleOrderRepository {
  constructor(private readonly ds: PresaleRemoteDataSource = new PresaleRemoteDataSource()) {}

  async create(
    request: CreatePresaleOrderRequest,
  ): Promise<Result<CreatePresaleOrderResponse>> {
    try {
      const res = await this.ds.createOrder(toCreatePresaleOrderRequestEntity(request))
      return ok(toCreatePresaleOrderResponseEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getList(
    criteria: PresaleOrderListCriteria,
  ): Promise<Result<PageResult<PresaleOrder>>> {
    try {
      const res = await this.ds.getOrderList(toPresaleOrderListRequest(criteria))
      const { list, total, page, pageSize } = toPresaleOrderList(res.data)
      return ok(createPageResult(list, total, page, pageSize))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getDetail(orderId: string): Promise<Result<PresaleOrderDetail>> {
    try {
      const res = await this.ds.getOrderDetail(orderId)
      return ok(toPresaleOrderDetail(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async cancel(orderId: string): Promise<Result<void>> {
    try {
      await this.ds.cancelOrder(orderId)
      return ok(undefined)
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async refundApply(
    request: ApplyPresaleOrderRefundRequest,
  ): Promise<Result<void>> {
    try {
      await this.ds.applyOrderRefund(toApplyPresaleOrderRefundRequestEntity(request))
      return ok(undefined)
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── Appointment ────────────────────────────────────────────────────── */

export class PresaleAppointmentRepository implements IPresaleAppointmentRepository {
  constructor(private readonly ds: PresaleRemoteDataSource = new PresaleRemoteDataSource()) {}

  async getReservationProductCalendar(
    criteria: PresaleReservationCalendarCriteria,
  ): Promise<Result<PresaleReservationCalendar>> {
    try {
      const res = await this.ds.getReservationProductCalendar(
        toPresaleReservationCalendarRequest(criteria),
      )
      return ok(toPresaleReservationCalendarEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async validate(
    request: ReservationValidateRequest,
  ): Promise<Result<ReservationValidateResult>> {
    try {
      const res = await this.ds.validateReservationOrder(
        toReservationValidateRequestEntity(request),
      )
      return ok(toReservationValidateResultEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async createReservationOrder(
    request: CreateReservationOrderRequest,
  ): Promise<Result<CreateReservationOrderResponse>> {
    try {
      const res = await this.ds.createReservationOrder(
        toCreateReservationOrderRequestEntity(request),
      )
      return ok(toCreateReservationOrderResponseEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getReservationOrderDetail(
    orderId: string,
  ): Promise<Result<PresaleAppointmentDetail>> {
    try {
      const res = await this.ds.getReservationOrderDetail(orderId)
      return ok(toPresaleAppointmentDetailEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async cancel(orderBaseId: string): Promise<Result<void>> {
    try {
      await this.ds.cancelReservationOrder(orderBaseId)
      return ok(undefined)
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── Inventory ──────────────────────────────────────────────────────── */

export class PresaleInventoryRepository implements IPresaleInventoryRepository {
  constructor(private readonly ds: PresaleRemoteDataSource = new PresaleRemoteDataSource()) {}

  async getCalendar(
    criteria: PresaleInventoryCriteria,
  ): Promise<Result<readonly PresaleInventoryDay[]>> {
    try {
      const res = await this.ds.getInventoryCalendar(toPresaleInventoryRequest(criteria))
      return ok(toInventoryDayList(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── Passenger ──────────────────────────────────────────────────────── */

export class PresalePassengerRepository implements IPresalePassengerRepository {
  constructor(private readonly ds: PresaleRemoteDataSource = new PresaleRemoteDataSource()) {}

  async getList(): Promise<Result<readonly PresalePassenger[]>> {
    try {
      const res = await this.ds.getPassengerList()
      return ok(toPassengerList(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async save(
    request: SavePresalePassengerRequest,
  ): Promise<Result<PresalePassenger>> {
    try {
      const res = await this.ds.savePassenger(toSavePassengerRequestEntity(request))
      return ok(toPassengerEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async delete(passengerId: string): Promise<Result<void>> {
    try {
      await this.ds.deletePassenger(passengerId)
      return ok(undefined)
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── Refund ─────────────────────────────────────────────────────────── */

export class PresaleRefundRepository implements IPresaleRefundRepository {
  constructor(private readonly ds: PresaleRemoteDataSource = new PresaleRemoteDataSource()) {}

  async apply(
    request: ApplyPresaleRefundRequest,
  ): Promise<Result<PresaleRefund>> {
    try {
      const res = await this.ds.applyRefund(toApplyRefundRequestEntity(request))
      const refundId = res.data?.id
      if (!refundId) {
        return ok({
          id: '',
          preOrderId: request.preOrderId,
          refundNo: '',
          quantity: request.quantity,
          paidAmount: { amountInCents: 0, currency: 'CNY' },
          refundableAmount: { amountInCents: 0, currency: 'CNY' },
          actualRefundAmount: { amountInCents: 0, currency: 'CNY' },
          status: 'pending_audit',
          reason: request.reason,
          remark: request.remark,
          refundWay: 'system',
          createdAt: '',
          operationLogs: [],
        })
      }
      return await this.getDetail(refundId)
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getDetail(refundId: string): Promise<Result<PresaleRefund>> {
    try {
      const res = await this.ds.getRefundDetail(refundId)
      return ok(toRefundEntity(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getListByOrder(preOrderId: string): Promise<Result<readonly PresaleRefund[]>> {
    try {
      const res = await this.ds.getRefundListByOrder(preOrderId)
      return ok(toRefundList(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getOrderRefundList(
    criteria: PresaleOrderRefundListCriteria,
  ): Promise<Result<readonly PresaleOrderRefundItem[]>> {
    try {
      const res = await this.ds.getOrderRefundList({
        orderBaseId: criteria.orderBaseId,
        orderType: criteria.orderType,
      })
      return ok(toOrderRefundListEntity(res.data ?? []))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}