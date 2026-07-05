/**
 * Flight domain entities
 *
 * Entities have identity and mutable lifecycle.
 */

import type {
  Airline,
  MealType,
  TimeRange,
  TripType,
  SortType,
  SortOrder,
  PassengerType,
  Gender,
  IdentityType,
  RefundStatus,
  CashRefundStatus,
  RefundRuleType,
  ApplyType,
  RefundChannel,
  CabinGrade,
  EntranceSource,
} from './value-object.js'

// ---------------------------------------------------------------------------
// Flight
// ---------------------------------------------------------------------------

export interface Flight {
  readonly key: string
  readonly flightNumber: string
  readonly airline: Airline
  readonly acCode: string
  readonly logo: string
  readonly model: string
  readonly depDate: string
  readonly arrDate: string
  readonly depCityCode: string
  readonly arrCityCode: string
  readonly depCityName: string
  readonly arrCityName: string
  readonly depCode: string
  readonly depAirport: string
  readonly arrCode: string
  readonly arrAirport: string
  readonly depTerminal: string
  readonly arrTerminal: string
  readonly depTime: string
  readonly arrTime: string
  readonly duration: string
  readonly stops: readonly unknown[]
  readonly isShare: number
  readonly isStop: number
  readonly shareAcCode: string
  readonly shareLogo: string
  readonly shareFlight: string
  readonly shareFlyNo: string
  readonly price: number
  readonly intervalDay: number
  readonly depWeek: string
  readonly meal: MealType
  readonly mealDesc: string
  readonly extData: string
  readonly discount: number
  readonly cabinName: string
  readonly handBaggageRule: string
  readonly consignBaggageRule: string
  readonly baggageRule: string
  readonly adultTicketPrice?: number
  readonly adultAirportFee?: number
  readonly adultOilFee?: number
  readonly childTicketPrice?: number
  readonly childAirportFee?: number
  readonly childOilFee?: number
  readonly adultSalePrice?: number
  readonly adultChannelPrice?: number
  readonly adultServiceFee?: number
  readonly childSalePrice?: number
  readonly childChannelPrice?: number
  readonly childServiceFee?: number
}

// ---------------------------------------------------------------------------
// Cabin
// ---------------------------------------------------------------------------

export interface Cabin {
  readonly sessionId: string
  readonly goFlightCabin?: FlightCabinDetail
  readonly backFlightCabin?: FlightCabinDetail
  readonly emptyMessage?: string
}

export interface FlightCabinDetail {
  readonly flight: Flight
  readonly cabinList: readonly CabinInfo[]
}

export interface CabinInfo {
  readonly cabinCode: string
  readonly cabinName: string
  readonly cabinGrade: CabinGrade
  readonly price: number
  readonly adultPrice: number
  readonly childPrice: number
  readonly adultAirportFee: number
  readonly adultOilFee: number
  readonly childAirportFee: number
  readonly childOilFee: number
  readonly discount: number
  readonly meal: MealType
  readonly mealDesc: string
  readonly handBaggageRule: string
  readonly consignBaggageRule: string
  readonly baggageRule: string
  readonly remainingSeats: number
  readonly extData: string
}

// ---------------------------------------------------------------------------
// FlightOrder
// ---------------------------------------------------------------------------

export interface FlightOrder {
  readonly orderSource: number
  readonly orderBaseId: string
  readonly flightOrderNo: string
  readonly flightOrderType: string
  readonly flightOrderStatus: string
  readonly refundStatus: string
  readonly refundAmount: number
  readonly payExpireTime: string
  readonly fromCityCode: string
  readonly fromCityName: string
  readonly toCityCode: string
  readonly toCityName: string
  readonly tripType: string
  readonly fromDate: string
  readonly returnDate: string
  readonly totalAmount: number
  readonly payAmount: string
  readonly departTime: string
  readonly arriveTime: string
  readonly durationTime: string
  readonly departAirportName: string
  readonly departTerminal: string
  readonly arriveAirportName: string
  readonly arriveTerminal: string
  readonly flightNo: string
  readonly stops: string
  readonly createTime: string
  readonly contactName: string
}

// ---------------------------------------------------------------------------
// Passenger
// ---------------------------------------------------------------------------

export interface Passenger {
  readonly id?: number
  readonly memberId: string
  readonly passengerName: string
  readonly englishName: string
  readonly pinyinName: string
  readonly passengerType: PassengerType
  readonly subPassengerType: number
  readonly gender: Gender
  readonly birthday: string
  readonly identityType: IdentityType
  readonly identityNo: string
  readonly identityExpireDate: string
  readonly nationality: string
  readonly phoneCountryCode: string
  readonly phoneNumber: string
  readonly email: string
  readonly status: number
  readonly extraInfo: string
  readonly createTime: string
  readonly updateTime: string
}

// ---------------------------------------------------------------------------
// City / HotCity
// ---------------------------------------------------------------------------

export interface CityGroup {
  readonly pyInitial: string
  readonly cityList: readonly City[]
}

export interface City {
  readonly cityId: number
  readonly cityName: string
  readonly level: number
  readonly cityShortName: string
  readonly nbsCityId: number
  readonly hotCityType: number
  readonly flightCode: string
  readonly parentId: number
}

export interface HotCity {
  readonly cityId: number
  readonly cityName: string
  readonly level: number
  readonly cityShortName: string
  readonly nbsCityId: number
  readonly hotCityType: number
  readonly flightCode: string
  readonly parentId: number
}

export interface CityListResult {
  readonly hotCityList: readonly HotCity[]
  readonly cityList: readonly CityGroup[]
}

// ---------------------------------------------------------------------------
// AirportInfo (airport search)
// ---------------------------------------------------------------------------

export interface AirportInfo {
  readonly hitCityOrAirport: boolean
  readonly cityId: number
  readonly cityCode: string
  readonly cityNameCn: string
  readonly cityNamePy: string
  readonly cityNameEn: string
  readonly areaName: string
  readonly airPorts: readonly AirPort[]
}

export interface AirPort {
  readonly airportCode: string
  readonly airportNameCn: string
  readonly airportNamePy: string
  readonly airportNameEn: string
}

// ---------------------------------------------------------------------------
// PriceCalendar / DailyPrice
// ---------------------------------------------------------------------------

export interface PriceCalendar {
  readonly resourceType: number
  readonly resourceTypeDesc: string
  readonly startDate: string
  readonly endDate: string
  readonly dailyPrices: readonly DailyPrice[]
}

export interface DailyPrice {
  readonly date: string
  readonly available: boolean
  readonly unavailableReason: string
  readonly adultPrice: number
  readonly childPrice: number
}

// ---------------------------------------------------------------------------
// OrderCreateResult
// ---------------------------------------------------------------------------

export interface OrderCreateResult {
  readonly canBooking: boolean
  readonly payNode: number
  readonly cancelRule: number
  readonly breakFastRule: number
  readonly remainingRoomCount: number
  readonly availableRoomCount: number
  readonly salePrice: number
  readonly channelPrice: number
  readonly dailyPrices: readonly unknown[]
  readonly needIdentityCard: boolean
  readonly needEnglishName: boolean
  readonly earliestArrivalTime: string
  readonly latestArrivalTime: string
  readonly cannotBookingReason: string
  readonly holdingDetailList: readonly unknown[]
  readonly orderBaseId: string
  readonly payOrderNo: string
  readonly productName: string
  readonly payAmount: number
  readonly isContainMyself: boolean
  readonly isB2CChangPrice: boolean
  readonly isTicketLimit: boolean
}

// ---------------------------------------------------------------------------
// PriceVerifyResult
// ---------------------------------------------------------------------------

export interface PriceVerifyResult {
  readonly sessionId: string
  readonly code: number
}

// ---------------------------------------------------------------------------
// RuleValidResult
// ---------------------------------------------------------------------------

export interface RuleValidResult {
  readonly canBooking: boolean
  readonly payNode: number
  readonly cancelRule: number
  readonly breakFastRule: number
  readonly remainingRoomCount: number
  readonly availableRoomCount: number
  readonly salePrice: number
  readonly channelPrice: number
  readonly dailyPrices: readonly unknown[]
  readonly needIdentityCard: boolean
  readonly needEnglishName: boolean
  readonly earliestArrivalTime: string
  readonly latestArrivalTime: string
  readonly cannotBookingReason: string
  readonly holdingDetailList: readonly unknown[]
  readonly orderBaseId: string
  readonly payOrderNo: string
  readonly productName: string
  readonly payAmount: number
  readonly isContainMyself: boolean
  readonly isB2CChangPrice: boolean
  readonly isTicketLimit: boolean
}

// ---------------------------------------------------------------------------
// PaycheckResult
// ---------------------------------------------------------------------------

export interface PaycheckResult {
  readonly errorCode: number
  readonly errorMessage: string
  readonly needRetry: boolean
}

// ---------------------------------------------------------------------------
// RefundRecord
// ---------------------------------------------------------------------------

export interface RefundRecord {
  readonly orderBaseId: string
  readonly refundRecordId: string
  readonly redundAmount: number
  readonly orderType: number
  readonly refundStatus: RefundStatus
  readonly refundType: number
  readonly reason: string
}

// ---------------------------------------------------------------------------
// RefundDetail
// ---------------------------------------------------------------------------

export interface RefundDetail {
  readonly orderBaseId: string
  readonly refundRecordId: string
  readonly refundAmount: number
  readonly originAmount: number
  readonly orderType: number
  readonly refundStatus: RefundStatus
  readonly refundType: number
  readonly reason: string
  readonly discountAmount: number
  readonly actualRefundAmount: number
  readonly applyType: string
  readonly applyTime: string
  readonly ticketRefundTime: string
  readonly refundTime: string
  readonly refuseReason: string
  readonly adminNotes: string
  readonly cashAmount: number
  readonly quotaAmount: number
  readonly refundRuleType: RefundRuleType
  readonly quotaRefundStatus: RefundStatus
  readonly cashRefundStatus: CashRefundStatus
  readonly flightItemInfos: readonly FlightRefundItemInfo[]
}

export interface FlightRefundItemInfo {
  readonly flightNo: string
  readonly fromCityName: string
  readonly toCityName: string
  readonly acName: string
  readonly departTime: string
  readonly passengerName: readonly string[]
  readonly issueOrderId: string
}

// ---------------------------------------------------------------------------
// RefundFlow
// ---------------------------------------------------------------------------

export interface RefundFlow {
  readonly orderBaseId: string
  readonly refundRecordId: string
  readonly redundAmount: number
  readonly orderType: number
  readonly refundStatus: RefundStatus
  readonly operateTime: string
  readonly discountAmount: number
  readonly actualRefundAmount: number
}

// ---------------------------------------------------------------------------
// UploadResult
// ---------------------------------------------------------------------------

export interface UploadResult {
  readonly originalFilename: string
  readonly objectKey: string
  readonly objectUrl: string
  readonly success: boolean
  readonly errorMessage: string
  readonly obsFileUrl: string
}

// ---------------------------------------------------------------------------
// Search / Request Criteria
// ---------------------------------------------------------------------------

export interface FlightSearchCriteria {
  readonly cabinGrade: CabinGrade
  readonly adultNum: number
  readonly childNum: number
  readonly fromCity: string
  readonly fromCityType: number
  readonly fromDate: string
  readonly retDate?: string
  readonly toCity: string
  readonly toCityType: number
  readonly tripType: TripType
  readonly sortType?: SortType
  readonly sortOrder?: SortOrder
  readonly fromTimeRanges?: readonly TimeRange[]
  readonly toTimeRanges?: readonly TimeRange[]
  readonly directFlight?: number
  readonly bigModel?: number
  readonly mediumModel?: number
  readonly hiddeShareFlight?: number
  readonly depAirports?: readonly string[]
  readonly arrAirports?: readonly string[]
  readonly airlines?: readonly string[]
  readonly entranceSource?: EntranceSource
}

// ---------------------------------------------------------------------------
// Filter / Statistics
// ---------------------------------------------------------------------------

export interface FilterLabel {
  readonly label: string
  readonly value: string
  readonly type: string
}

export interface AirportStatistic {
  readonly airportCode: string
  readonly airportName: string
  readonly count: number
}

export interface AirlineStatistic {
  readonly airlineCode: string
  readonly airlineName: string
  readonly count: number
}

export interface FlightSearchResult {
  readonly flights: readonly Flight[]
  readonly labels: readonly FilterLabel[]
  readonly depAirportStatistics: readonly AirportStatistic[]
  readonly arrAirportStatistics: readonly AirportStatistic[]
  readonly airlineStatistics: readonly AirlineStatistic[]
  readonly emptyMessage?: string
}

export interface CabinSearchCriteria {
  readonly sessionId?: string
  readonly goExtData: string
  readonly backExtData?: string
  readonly adultNum: number
  readonly childNum: number
  readonly cabinGrade?: CabinGrade
  readonly adultSalePrice?: number
  readonly childSalePrice?: number
  readonly adultAirportFee?: number
  readonly adultOilFee?: number
  readonly childAirportFee?: number
  readonly childOilFee?: number
  readonly entranceSource?: EntranceSource
  readonly memberId?: string
  readonly adultCostPrice?: number
  readonly childCostPrice?: number
  readonly adultChannelPrice?: number
  readonly childChannelPrice?: number
  readonly adultServiceFee?: number
  readonly childServiceFee?: number
  readonly saleRuleMock?: number
}

export interface OrderSearchCriteria {
  readonly memberId?: string
}

export interface PassengerSearchCriteria {
  readonly orderType?: number
}

export interface CitySearchCriteria {
  readonly domesticType?: number
  readonly resourceType?: number
}

export interface AirportSearchCriteria {
  readonly keyword?: string
}

export interface PriceCalendarSearchCriteria {
  readonly resourceType: number
  readonly resourceId?: string
  readonly startDate?: string
  readonly endDate?: string
}

export interface OrderCreateRequest {
  readonly memberId: string
  readonly userName?: string
  readonly phoneNumber: string
  readonly distributor?: number
  readonly orderSource: number
  readonly email?: string
  readonly orderType?: number
  readonly subOrderType?: string
  readonly serviceFee?: number
  readonly serviceFeeList?: readonly ServiceFeeItem[]
  readonly clientType?: string
  readonly clientVersion?: string
  readonly channelSourceType?: number
  readonly businessModule?: number
  readonly internalFlag?: number
  readonly businessType?: number
  readonly contact?: Contact
  readonly tripType?: TripType
  readonly fromDate?: string
  readonly returnDate?: string
  readonly totalAmount?: number
  readonly payAmount?: number
  readonly items?: readonly OrderItem[]
  readonly departureCityId?: number
  readonly destinationCityId?: number
}

export interface ServiceFeeItem {
  readonly serviceFeeType: number
  readonly serviceFee: number
}

export interface Contact {
  readonly address?: string
  readonly email?: string
  readonly name?: string
  readonly phone?: string
  readonly postcode?: string
}

export interface OrderItem {
  readonly resourceItemId: string
  readonly sessionId?: string
  readonly goExtData?: string
  readonly rangeType?: number
  readonly cabinGrade?: CabinGrade
  readonly adultNum?: number
  readonly childNum?: number
  readonly adultSalePrice?: number
  readonly adultAirportFee?: number
  readonly adultOilFee?: number
  readonly adultServiceFee?: number
  readonly adultChannelPrice?: number
  readonly childSalePrice?: number
  readonly childAirportFee?: number
  readonly childOilFee?: number
  readonly childChannelPrice?: number
  readonly childServiceFee?: number
  readonly insuranceBuyItems?: readonly InsuranceBuyItem[]
  readonly passengers?: readonly OrderPassenger[]
}

export interface InsuranceBuyItem {
  readonly buyNum: number
  readonly cardNum: string
  readonly insuranceProductId: string
}

export interface OrderPassenger {
  readonly passengerId?: number
  readonly name?: string
  readonly idNumber?: string
  readonly idType?: string
  readonly phoneNumber?: string
  readonly customerType?: number
  readonly birthday?: string
  readonly gender?: number
  readonly nationality?: string
  readonly pinyinname?: string
}

export interface PriceVerifyRequest {
  readonly goExtData: string
  readonly backExtData?: string
  readonly sessionId: string
  readonly adultSalePrice?: number
  readonly childSalePrice?: number
  readonly adultNum: number
  readonly childNum: number
  readonly adultAirportFee?: number
  readonly adultOilFee?: number
  readonly childAirportFee?: number
  readonly childOilFee?: number
  readonly memberId?: string
  readonly entranceSource?: EntranceSource
  readonly adultServiceFee?: number
  readonly childServiceFee?: number
}

export interface RefundConfirmRequest {
  readonly orderBaseId: string
  readonly amount: number
  readonly originAmount?: number
  readonly refundType?: number
  readonly refundItemList?: readonly RefundItem[]
  readonly orderType: number
  readonly reason?: string
  readonly reasonType?: number
  readonly memberId?: string
  readonly files?: readonly AttachmentFile[]
  readonly applyType?: ApplyType
  readonly sessionId?: string
  readonly refundQuota?: number
  readonly refundCash?: number
  readonly refundChannel?: RefundChannel
  readonly supplierRefundNo?: string
}

export interface RefundItem {
  readonly orderItemNo: string
  readonly orderPassengerIds?: readonly number[]
  readonly refundQuantity?: number
  readonly refundAmount?: number
}

export interface AttachmentFile {
  readonly fileName: string
  readonly filePath: string
  readonly originalFilename: string
}

export interface RefundDetailRequest {
  readonly orderBaseId: string
  readonly orderType: number
  readonly refundRecordId?: string
}

export interface RefundListRequest {
  readonly orderBaseId: string
  readonly orderType: number
}

export interface RefundFlowListRequest {
  readonly orderBaseId: string
  readonly orderType: number
  readonly refundRecordId: string
}

export interface UploadRequest {
  readonly file: File | Blob | string
}
