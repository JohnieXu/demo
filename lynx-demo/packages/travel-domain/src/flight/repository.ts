/**
 * Flight repository interfaces (dependency inversion)
 *
 * The domain layer defines WHAT operations are needed.
 * The data layer (travel-data) provides HOW they are implemented.
 */

import type { Result } from '../common/result.js'
import type { PageResult } from '../common/pagination.js'
import type {
  Flight,
  Cabin,
  FlightOrder,
  Passenger,
  CityListResult,
  AirportInfo,
  PriceCalendar,
  OrderCreateResult,
  PriceVerifyResult,
  RuleValidResult,
  PaycheckResult,
  RefundRecord,
  RefundDetail,
  RefundFlow,
  UploadResult,
  FlightSearchCriteria,
  CabinSearchCriteria,
  OrderSearchCriteria,
  PassengerSearchCriteria,
  CitySearchCriteria,
  AirportSearchCriteria,
  PriceCalendarSearchCriteria,
  OrderCreateRequest,
  PriceVerifyRequest,
  RefundConfirmRequest,
  RefundDetailRequest,
  RefundListRequest,
  RefundFlowListRequest,
  UploadRequest,
  FlightSearchResult,
} from './entity.js'

export interface IFlightSearchRepository {
  search(
    criteria: FlightSearchCriteria
  ): Promise<Result<PageResult<Flight>>>

  searchV2(
    criteria: FlightSearchCriteria
  ): Promise<Result<FlightSearchResult>>

  getCabinList(
    criteria: CabinSearchCriteria
  ): Promise<Result<Cabin>>

  getPriceCalendar(
    criteria: PriceCalendarSearchCriteria
  ): Promise<Result<PriceCalendar>>

  searchAirport(
    criteria: AirportSearchCriteria
  ): Promise<Result<readonly AirportInfo[]>>

  getCityList(
    criteria: CitySearchCriteria
  ): Promise<Result<CityListResult>>
}

export interface IFlightOrderRepository {
  createOrder(
    request: OrderCreateRequest
  ): Promise<Result<OrderCreateResult>>

  priceVerify(
    request: PriceVerifyRequest
  ): Promise<Result<PriceVerifyResult>>

  ruleValid(
    request: OrderCreateRequest
  ): Promise<Result<RuleValidResult>>

  paycheck(
    orderNo: string
  ): Promise<Result<PaycheckResult>>

  getOrderList(
    criteria: OrderSearchCriteria
  ): Promise<Result<readonly FlightOrder[]>>
}

export interface IRefundRepository {
  refundConfirm(
    request: RefundConfirmRequest
  ): Promise<Result<RefundRecord>>

  refundList(
    request: RefundListRequest
  ): Promise<Result<readonly RefundRecord[]>>

  refundDetail(
    request: RefundDetailRequest
  ): Promise<Result<RefundDetail>>

  refundFlowList(
    request: RefundFlowListRequest
  ): Promise<Result<readonly RefundFlow[]>>
}

export interface IPassengerRepository {
  listPassengers(
    criteria: PassengerSearchCriteria
  ): Promise<Result<readonly Passenger[]>>

  savePassenger(
    passenger: Passenger
  ): Promise<Result<Passenger>>

  deletePassenger(
    id: number
  ): Promise<Result<boolean>>
}

export interface IUploadRepository {
  uploadFile(
    request: UploadRequest
  ): Promise<Result<UploadResult>>
}
