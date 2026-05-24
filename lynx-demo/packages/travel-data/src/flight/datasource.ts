/**
 * Flight remote data source — talks to HTTP backend, returns raw DTOs
 */

'background only'

import { travelClient } from '../network/client.js'
import type {
  FlightSearchRequestDto,
  FlightSearchResponseDto,
  FlightV2SearchRequestDto,
  FlightV2SearchResponseDto,
  CabinListRequestDto,
  CabinListResponseDto,
  AirportSearchRequestDto,
  AirportSearchResponseDto,
  OrderListRequestDto,
  OrderListResponseDto,
  PriceCalendarRequestDto,
  PriceCalendarResponseDto,
  CityListRequestDto,
  CityListResponseDto,
  OrderCreateRequestDto,
  OrderCreateResponseDto,
  PriceVerifyRequestDto,
  PriceVerifyResponseDto,
  RuleValidRequestDto,
  RuleValidResponseDto,
  PaycheckRequestDto,
  PaycheckResponseDto,
  RefundConfirmRequestDto,
  RefundConfirmResponseDto,
  RefundListRequestDto,
  RefundListResponseDto,
  RefundDetailRequestDto,
  RefundDetailResponseDto,
  RefundFlowListRequestDto,
  RefundFlowListResponseDto,
  UploadRequestDto,
  UploadResponseDto,
  PassengerListRequestDto,
  PassengerListResponseDto,
  PassengerSaveRequestDto,
  PassengerSaveResponseDto,
  PassengerDeleteRequestDto,
  PassengerDeleteResponseDto,
} from './dto.js'

function toQuery(record: object) {
  return record as Record<string, string | number | boolean | undefined>
}

export class FlightRemoteDataSource {
  /* ─── flight search ────────────────────────────────────── */

  async search(params: FlightSearchRequestDto) {
    return travelClient.post<FlightSearchResponseDto>('/openapi/resource/flight/flight-list', params as unknown as Record<string, unknown>)
  }

  async searchV2(params: FlightV2SearchRequestDto) {
    return travelClient.post<FlightV2SearchResponseDto>('/openapi/resource/flight/V2/flight-list', params as unknown as Record<string, unknown>)
  }

  async getCabinList(params: CabinListRequestDto) {
    return travelClient.post<CabinListResponseDto>('/openapi/resource/flight/cabin-list', params as unknown as Record<string, unknown>)
  }

  async searchAirport(params: AirportSearchRequestDto) {
    return travelClient.get<AirportSearchResponseDto[]>('/openapi/resource/flight/airport-search', {
      params: toQuery(params),
    })
  }

  async getOrderList(params: OrderListRequestDto) {
    return travelClient.get<OrderListResponseDto[]>('/openapi/resource/flight/order-list', {
      params: toQuery(params),
    })
  }

  async getPriceCalendar(params: PriceCalendarRequestDto) {
    return travelClient.get<PriceCalendarResponseDto>('/openapi/resource/price-calendar', {
      params: toQuery(params),
    })
  }

  async getCityList(params: CityListRequestDto) {
    return travelClient.post<CityListResponseDto>('/openapi/resource/city-list', params as unknown as Record<string, unknown>)
  }

  /* ─── order ────────────────────────────────────────────── */

  async createOrder(params: OrderCreateRequestDto) {
    return travelClient.post<OrderCreateResponseDto>('/openapi/single/flightOrder/createOrder', params as unknown as Record<string, unknown>)
  }

  async priceVerify(params: PriceVerifyRequestDto) {
    return travelClient.post<PriceVerifyResponseDto>('/openapi/single/flightOrder/priceVerify', params as unknown as Record<string, unknown>)
  }

  async ruleValid(params: RuleValidRequestDto) {
    return travelClient.post<RuleValidResponseDto>('/openapi/single/flightOrder/ruleValid', params as unknown as Record<string, unknown>)
  }

  async paycheck(params: PaycheckRequestDto) {
    return travelClient.post<PaycheckResponseDto>('/openapi/single/flightOrder/paycheck', params as unknown as Record<string, unknown>)
  }

  /* ─── refund ───────────────────────────────────────────── */

  async refundConfirm(params: RefundConfirmRequestDto) {
    return travelClient.post<RefundConfirmResponseDto>('/openapi/single/flightOrder/refund/confirm', params as unknown as Record<string, unknown>)
  }

  async refundList(params: RefundListRequestDto) {
    return travelClient.post<RefundListResponseDto[]>('/openapi/single/flightOrder/refund/list', params as unknown as Record<string, unknown>)
  }

  async refundDetail(params: RefundDetailRequestDto) {
    return travelClient.post<RefundDetailResponseDto>('/openapi/single/flightOrder/refund/detail', params as unknown as Record<string, unknown>)
  }

  async refundFlowList(params: RefundFlowListRequestDto) {
    return travelClient.post<RefundFlowListResponseDto[]>('/openapi/single/flightOrder/refund/flowList', params as unknown as Record<string, unknown>)
  }

  /* ─── upload ───────────────────────────────────────────── */

  async upload(params: UploadRequestDto) {
    const formData = new FormData()
    if (typeof params.file === 'string') {
      formData.append('file', params.file)
    } else {
      formData.append('file', params.file)
    }
    return travelClient.post<UploadResponseDto>('/openapi/single/flightOrder/upload', formData as unknown as unknown as Record<string, unknown>)
  }

  /* ─── passenger ────────────────────────────────────────── */

  async listPassengers(params: PassengerListRequestDto) {
    return travelClient.get<PassengerListResponseDto[]>('/openapi/passenger/list', {
      params: toQuery(params),
    })
  }

  async savePassenger(params: PassengerSaveRequestDto) {
    return travelClient.post<PassengerSaveResponseDto>('/openapi/passenger/save', params as unknown as Record<string, unknown>)
  }

  async deletePassenger(params: PassengerDeleteRequestDto) {
    return travelClient.post<PassengerDeleteResponseDto>('/openapi/passenger/delete', params as unknown as Record<string, unknown>)
  }
}
