/**
 * Presale ("先囤后约") repository interfaces.
 *
 * One repository per bounded context so app code only depends on what it
 * actually uses. All seven interfaces share a single remote data source at
 * the implementation layer — see travel-data/presale/repository.ts.
 */

import type { Result } from '../common/result.js'
import type { PageResult } from '../common/pagination.js'
import type {
  ApplyPresaleRefundRequest,
  CreatePresaleOrderRequest,
  CreatePresaleOrderResponse,
  CreateReservationOrderRequest,
  CreateReservationOrderResponse,
  PresaleAppointmentDetail,
  PresaleBrandOption,
  PresaleCategoryTab,
  PresaleCityOption,
  PresaleDetailCriteria,
  PresaleExchangeBrandCriteria,
  PresaleExchangeHotelCriteria,
  PresaleExchangeHotelRoomCriteria,
  PresaleHotelBrief,
  PresaleHotelExchangeDetail,
  PresaleHotelExchangePage,
  PresaleInventoryCriteria,
  PresaleInventoryDay,
  PresaleListCriteria,
  PresaleOrder,
  PresaleOrderDetail,
  PresaleOrderListCriteria,
  PresalePackageCityCriteria,
  PresalePassenger,
  PresaleProduct,
  PresaleProductCalendar,
  PresaleProductCalendarCriteria,
  PresaleProductDetail,
  PresalePurchasedQuantity,
  PresaleRefund,
  PresaleReservationCalendar,
  PresaleReservationCalendarCriteria,
  PresaleRoomBrief,
  ReservationValidateRequest,
  ReservationValidateResult,
  SavePresalePassengerRequest,
} from './entity.js'

/**
 * Pre-sale product catalogue: list, detail, category tabs, city & brand filters,
 * purchased-quantity lookup.
 *
 * Hotel-exchange hotel/room lookups live behind `IPresaleHotelRepository` so
 * the product surface stays focused on the product itself.
 */
export interface IPresaleProductRepository {
  getList(
    criteria: PresaleListCriteria,
  ): Promise<Result<PageResult<PresaleProduct>>>

  getDetail(
    criteria: PresaleDetailCriteria,
  ): Promise<Result<PresaleProductDetail>>

  getCategoryTabs(): Promise<Result<readonly PresaleCategoryTab[]>>

  getPackageCities(
    criteria: PresalePackageCityCriteria,
  ): Promise<Result<readonly PresaleCityOption[]>>

  getExchangeCities(
    criteria: PresaleExchangeBrandCriteria,
  ): Promise<Result<readonly PresaleCityOption[]>>

  getExchangeBrands(
    criteria: PresaleExchangeBrandCriteria,
  ): Promise<Result<readonly PresaleBrandOption[]>>

  getPurchasedQuantity(
    productId: string,
  ): Promise<Result<PresalePurchasedQuantity>>

  getProductCalendar(
    criteria: PresaleProductCalendarCriteria,
  ): Promise<Result<PresaleProductCalendar>>
}

/** Hotel-exchange only: page hotels, list rooms of one hotel. */
export interface IPresaleHotelRepository {
  searchExchangeHotels(
    criteria: PresaleExchangeHotelCriteria,
  ): Promise<Result<PresaleHotelExchangePage>>

  getExchangeHotelRooms(
    criteria: PresaleExchangeHotelRoomCriteria,
  ): Promise<Result<PresaleHotelExchangeDetail>>
}

/** Pre-sale order lifecycle: create, list, detail, cancel. */
export interface IPresaleOrderRepository {
  create(
    request: CreatePresaleOrderRequest,
  ): Promise<Result<CreatePresaleOrderResponse>>

  getList(
    criteria: PresaleOrderListCriteria,
  ): Promise<Result<PageResult<PresaleOrder>>>

  getDetail(orderId: string): Promise<Result<PresaleOrderDetail>>

  cancel(orderId: string): Promise<Result<void>>
}

/**
 * Reservation / appointment flow: snapshot calendar from a pre-sale order,
 * validate, create, fetch detail.
 */
export interface IPresaleAppointmentRepository {
  getReservationProductCalendar(
    criteria: PresaleReservationCalendarCriteria,
  ): Promise<Result<PresaleReservationCalendar>>

  validate(
    request: ReservationValidateRequest,
  ): Promise<Result<ReservationValidateResult>>

  createReservationOrder(
    request: CreateReservationOrderRequest,
  ): Promise<Result<CreateReservationOrderResponse>>

  getReservationOrderDetail(
    orderId: string,
  ): Promise<Result<PresaleAppointmentDetail>>
}

/** Inventory calendar for merchants / availability checks. */
export interface IPresaleInventoryRepository {
  getCalendar(
    criteria: PresaleInventoryCriteria,
  ): Promise<Result<readonly PresaleInventoryDay[]>>
}

/** Presale-bounded passenger CRUD (separate from flight's passenger repo). */
export interface IPresalePassengerRepository {
  getList(): Promise<Result<readonly PresalePassenger[]>>

  save(
    request: SavePresalePassengerRequest,
  ): Promise<Result<PresalePassenger>>

  delete(passengerId: string): Promise<Result<void>>
}

/** Refund flow: apply, detail, list-by-order. */
export interface IPresaleRefundRepository {
  apply(
    request: ApplyPresaleRefundRequest,
  ): Promise<Result<PresaleRefund>>

  getDetail(refundId: string): Promise<Result<PresaleRefund>>

  getListByOrder(preOrderId: string): Promise<Result<readonly PresaleRefund[]>>
}

// Re-export entity helpers used by some callers.
export type {
  PresaleHotelBrief,
  PresaleRoomBrief,
}