/**
 * Flight repository implementations
 *
 * Bridges domain interfaces with remote data source.
 */

'background only'

import {
  ok,
  err,
  createPageResult,
  type Result,
  type PageResult,
  type IFlightSearchRepository,
  type IFlightOrderRepository,
  type IRefundRepository,
  type IPassengerRepository,
  type IUploadRepository,
  type Flight,
  type Cabin,
  type FlightOrder,
  type Passenger,
  type CityListResult,
  type AirportInfo,
  type PriceCalendar,
  type OrderCreateResult,
  type PriceVerifyResult,
  type RuleValidResult,
  type PaycheckResult,
  type RefundRecord,
  type RefundDetail,
  type RefundFlow,
  type UploadResult,
  type FlightSearchCriteria,
  type CabinSearchCriteria,
  type OrderSearchCriteria,
  type PassengerSearchCriteria,
  type CitySearchCriteria,
  type AirportSearchCriteria,
  type PriceCalendarSearchCriteria,
  type OrderCreateRequest,
  type PriceVerifyRequest,
  type RefundConfirmRequest,
  type RefundDetailRequest,
  type RefundListRequest,
  type RefundFlowListRequest,
  type UploadRequest,
} from 'travel-domain'
import { FlightRemoteDataSource } from './datasource.js'
import {
  toFlight,
  toCabin,
  toFlightOrder,
  toPassenger,
  toCityListResult,
  toAirportInfo,
  toPriceCalendar,
  toOrderCreateResult,
  toPriceVerifyResult,
  toRuleValidResult,
  toPaycheckResult,
  toRefundRecord,
  toRefundConfirmResult,
  toRefundDetail,
  toRefundFlow,
  toUploadResult,
  toSearchRequestDto,
  toV2SearchRequestDto,
  toCabinSearchRequestDto,
  toPriceCalendarRequestDto,
  toAirportSearchRequestDto,
  toCityListRequestDto,
  toOrderListRequestDto,
  toOrderCreateRequestDto,
  toPriceVerifyRequestDto,
  toRuleValidRequestDto,
  toPaycheckRequestDto,
  toRefundConfirmRequestDto,
  toRefundListRequestDto,
  toRefundDetailRequestDto,
  toRefundFlowListRequestDto,
  toUploadRequestDto,
  toPassengerListRequestDto,
  toPassengerSaveRequestDto,
  toPassengerDeleteRequestDto,
  toDomainError,
} from './mapper.js'

/* ─── FlightSearchRepository ────────────────────────────── */

export class FlightSearchRepository implements IFlightSearchRepository {
  private ds = new FlightRemoteDataSource()

  async search(criteria: FlightSearchCriteria): Promise<Result<PageResult<Flight>>> {
    try {
      const dtoReq = toSearchRequestDto(criteria)
      const res = await this.ds.search(dtoReq)
      const body = res.data
      const allFlights = [...(body.goFlights ?? [])]
      return ok(
        createPageResult(
          allFlights.map(toFlight),
          allFlights.length,
          1,
          allFlights.length
        )
      )
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async searchV2(criteria: FlightSearchCriteria): Promise<Result<PageResult<Flight>>> {
    try {
      const dtoReq = toV2SearchRequestDto(criteria)
      const res = await this.ds.searchV2(dtoReq)
      const body = res.data
      const goFlights = body.goFlight?.flights ?? []
      // const backFlights = body.backFlight?.flights ?? []
      const allFlights = [...goFlights]
      return ok(
        createPageResult(
          allFlights.map(toFlight),
          allFlights.length,
          1,
          allFlights.length
        )
      )
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getCabinList(criteria: CabinSearchCriteria): Promise<Result<Cabin>> {
    try {
      const dtoReq = toCabinSearchRequestDto(criteria)
      const res = await this.ds.getCabinList(dtoReq)
      return ok(toCabin(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getPriceCalendar(criteria: PriceCalendarSearchCriteria): Promise<Result<PriceCalendar>> {
    try {
      const dtoReq = toPriceCalendarRequestDto(criteria)
      const res = await this.ds.getPriceCalendar(dtoReq)
      return ok(toPriceCalendar(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async searchAirport(criteria: AirportSearchCriteria): Promise<Result<readonly AirportInfo[]>> {
    try {
      const dtoReq = toAirportSearchRequestDto(criteria)
      const res = await this.ds.searchAirport(dtoReq)
      return ok(res.data.map(toAirportInfo))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getCityList(criteria: CitySearchCriteria): Promise<Result<CityListResult>> {
    try {
      const dtoReq = toCityListRequestDto(criteria)
      const res = await this.ds.getCityList(dtoReq)
      return ok(toCityListResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── FlightOrderRepository ─────────────────────────────── */

export class FlightOrderRepository implements IFlightOrderRepository {
  private ds = new FlightRemoteDataSource()

  async createOrder(request: OrderCreateRequest): Promise<Result<OrderCreateResult>> {
    try {
      const dtoReq = toOrderCreateRequestDto(request)
      const res = await this.ds.createOrder(dtoReq)
      return ok(toOrderCreateResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async priceVerify(request: PriceVerifyRequest): Promise<Result<PriceVerifyResult>> {
    try {
      const dtoReq = toPriceVerifyRequestDto(request)
      const res = await this.ds.priceVerify(dtoReq)
      return ok(toPriceVerifyResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async ruleValid(request: OrderCreateRequest): Promise<Result<RuleValidResult>> {
    try {
      const dtoReq = toRuleValidRequestDto(request)
      const res = await this.ds.ruleValid(dtoReq)
      return ok(toRuleValidResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async paycheck(orderNo: string): Promise<Result<PaycheckResult>> {
    try {
      const dtoReq = toPaycheckRequestDto(orderNo)
      const res = await this.ds.paycheck(dtoReq)
      return ok(toPaycheckResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getOrderList(criteria: OrderSearchCriteria): Promise<Result<readonly FlightOrder[]>> {
    try {
      const dtoReq = toOrderListRequestDto(criteria)
      const res = await this.ds.getOrderList(dtoReq)
      return ok(res.data.map(toFlightOrder))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── RefundRepository ──────────────────────────────────── */

export class RefundRepository implements IRefundRepository {
  private ds = new FlightRemoteDataSource()

  async refundConfirm(request: RefundConfirmRequest): Promise<Result<RefundRecord>> {
    try {
      const dtoReq = toRefundConfirmRequestDto(request)
      const res = await this.ds.refundConfirm(dtoReq)
      return ok(toRefundConfirmResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async refundList(request: RefundListRequest): Promise<Result<readonly RefundRecord[]>> {
    try {
      const dtoReq = toRefundListRequestDto(request)
      const res = await this.ds.refundList(dtoReq)
      return ok(res.data.map(toRefundRecord))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async refundDetail(request: RefundDetailRequest): Promise<Result<RefundDetail>> {
    try {
      const dtoReq = toRefundDetailRequestDto(request)
      const res = await this.ds.refundDetail(dtoReq)
      return ok(toRefundDetail(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async refundFlowList(request: RefundFlowListRequest): Promise<Result<readonly RefundFlow[]>> {
    try {
      const dtoReq = toRefundFlowListRequestDto(request)
      const res = await this.ds.refundFlowList(dtoReq)
      return ok(res.data.map(toRefundFlow))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── PassengerRepository ───────────────────────────────── */

export class PassengerRepository implements IPassengerRepository {
  private ds = new FlightRemoteDataSource()

  async listPassengers(criteria: PassengerSearchCriteria): Promise<Result<readonly Passenger[]>> {
    try {
      const dtoReq = toPassengerListRequestDto(criteria)
      const res = await this.ds.listPassengers(dtoReq)
      return ok(res.data.map(toPassenger))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async savePassenger(passenger: Passenger): Promise<Result<Passenger>> {
    try {
      const dtoReq = toPassengerSaveRequestDto(passenger)
      const res = await this.ds.savePassenger(dtoReq)
      return ok(toPassenger(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async deletePassenger(id: number): Promise<Result<boolean>> {
    try {
      const dtoReq = toPassengerDeleteRequestDto(id)
      const res = await this.ds.deletePassenger(dtoReq)
      return ok(res.data.success)
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}

/* ─── UploadRepository ──────────────────────────────────── */

export class UploadRepository implements IUploadRepository {
  private ds = new FlightRemoteDataSource()

  async uploadFile(request: UploadRequest): Promise<Result<UploadResult>> {
    try {
      const dtoReq = toUploadRequestDto(request)
      const res = await this.ds.upload(dtoReq)
      return ok(toUploadResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}
