/**
 * Flight data-transfer objects (backend JSON shapes)
 *
 * Grouped by feature / endpoint.
 */

/* ─── TimeRange ─────────────────────────────────────────── */

export interface TimeRangeDto {
  startTime: string
  endTime: string
}

/* ─── SearchRule ────────────────────────────────────────── */

export interface SearchRuleDto {
  productType?: string
  generalRule?: RuleBlockDto
  whiteRule?: RuleBlockDto
  blackRule?: RuleBlockDto
  contractExpirationStartDate?: string
  contractExpirationEndDate?: string
  travelExpirationStartDate?: string
  travelExpirationEndDate?: string
}

export interface RuleBlockDto {
  ruleId?: number
  ruleName?: string
  config?: Record<string, unknown>
}

/* ─── Flight list (V1) ─────────────────────────────────── */

export interface FlightSearchRequestDto {
  cabinGrade: number
  adultNum: number
  childNum: number
  fromCity: string
  fromCityType: number
  fromDate: string
  retDate?: string
  toCity: string
  toCityType: number
  tripType: number
  sortType?: number
  sortOrder?: number
  isConvalesce?: boolean
  entranceSource?: number
  searchRule?: SearchRuleDto
  memberId?: string
}

export interface FlightSearchResponseDto {
  goFlights: FlightDetailDto[]
  backFlights: FlightDetailDto[]
  emptyMessage?: string
}

/* ─── Flight list (V2) ─────────────────────────────────── */

export interface FlightV2SearchRequestDto {
  cabinGrade: number
  adultNum: number
  childNum: number
  fromCity: string
  fromCityType: number
  fromDate: string
  retDate?: string
  toCity: string
  toCityType: number
  tripType: number
  sortType?: number
  sortOrder?: number
  fromTimeRanges?: TimeRangeDto[]
  toTimeRanges?: TimeRangeDto[]
  directFlight?: number
  bigModel?: number
  mediumModel?: number
  hiddeShareFlight?: number
  depAirports?: string[]
  arrAirports?: string[]
  airlines?: string[]
  entranceSource?: number
}

export interface FlightV2SearchResponseDto {
  goFlight?: FlightInfoDetailDto
  backFlight?: FlightInfoDetailDto
  emptyMessage?: string
}

export interface FlightInfoDetailDto {
  flights: FlightDetailDto[]
  depAirportStatistics?: AirportStatisticDto[]
  arrAirportStatistics?: AirportStatisticDto[]
  airlineStatistics?: AirlineStatisticDto[]
  bigModelPrice?: number
  mediumModelPrice?: number
  labels?: FilterLabelDto[]
}

export interface FilterLabelDto {
  label?: string
  value?: string
  type?: string
}

export interface AirportStatisticDto {
  airportCode?: string
  airportName?: string
  count?: number
}

export interface AirlineStatisticDto {
  airlineCode?: string
  airlineName?: string
  count?: number
}

/* ─── Flight detail (shared) ───────────────────────────── */

export interface FlightDetailDto {
  logo?: string
  acCode?: string
  airline?: string
  flightNumber?: string
  model?: string
  depDate?: string
  arrDate?: string
  depCityCode?: string
  arrCityCode?: string
  depCityName?: string
  arrCityName?: string
  depCode?: string
  depAirport?: string
  arrCode?: string
  arrAirport?: string
  depTerminal?: string
  arrTerminal?: string
  depTime?: string
  arrTime?: string
  duration?: string
  stops?: unknown[]
  isShare?: number
  isStop?: number
  shareAcCode?: string
  shareLogo?: string
  shareFlight?: string
  shareFlyNo?: string
  price?: number
  intervalDay?: number
  depWeek?: string
  meal?: number
  mealDesc?: string
  extData?: string
  discount?: number
  cabinName?: string
  handBaggageRule?: string
  consignBaggageRule?: string
  baggageRule?: string
  adultTicketPrice?: number
  adultAirportFee?: number
  adultOilFee?: number
  childTicketPrice?: number
  childAirportFee?: number
  childOilFee?: number
  adultSalePrice?: number
  adultChannelPrice?: number
  adultServiceFee?: number
  childSalePrice?: number
  childChannelPrice?: number
  childServiceFee?: number
  cabinInfo?: unknown
}

/* ─── Cabin list ────────────────────────────────────────── */

export interface CabinListRequestDto {
  sessionId?: string
  goExtData: string
  backExtData?: string
  adultNum: number
  childNum: number
  cabinGrade?: number
  adultSalePrice?: number
  childSalePrice?: number
  adultAirportFee?: number
  adultOilFee?: number
  childAirportFee?: number
  childOilFee?: number
  entranceSource?: number
  searchRule?: SearchRuleDto
  memberId?: string
  adultCostPrice?: number
  childCostPrice?: number
  adultChannelPrice?: number
  childChannelPrice?: number
  adultServiceFee?: number
  childServiceFee?: number
  saleRuleMock?: number
}

export interface CabinListResponseDto {
  sessionId?: string
  goFlightCabin?: CabinInfoDetailDto
  backFlightCabin?: CabinInfoDetailDto
  emptyMessage?: string
}

export interface CabinInfoDetailDto {
  flight: FlightDetailDto
  cabinList: CabinInfoDto[]
}

export interface CabinInfoDto {
  cabinCode?: string
  cabinName?: string
  cabinGrade?: number
  price?: number
  adultPrice?: number
  childPrice?: number
  adultAirportFee?: number
  adultOilFee?: number
  childAirportFee?: number
  childOilFee?: number
  discount?: number
  meal?: number
  mealDesc?: string
  handBaggageRule?: string
  consignBaggageRule?: string
  baggageRule?: string
  remainingSeats?: number
  extData?: string
}

/* ─── Airport search ────────────────────────────────────── */

export interface AirportSearchRequestDto {
  keyword?: string
}

export interface AirportSearchResponseDto {
  hitCityOrAirport: boolean
  cityId: number
  cityCode: string
  cityNameCn: string
  cityNamePy: string
  cityNameEn: string
  areaName: string
  airPorts: AirPortDto[]
}

export interface AirPortDto {
  airportCode: string
  airportNameCn: string
  airportNamePy: string
  airportNameEn: string
}

/* ─── Order list ────────────────────────────────────────── */

export interface OrderListRequestDto {
  memberId?: string
}

export interface OrderListResponseDto {
  orderSource: number
  orderBaseId: string
  flightOrderNo: string
  flightOrderType: string
  flightOrderStatus: string
  refundStatus: string
  refundAmount: number
  payExpireTime: string
  fromCityCode: string
  fromCityName: string
  toCityCode: string
  toCityName: string
  tripType: string
  fromDate: string
  returnDate: string
  totalAmount: number
  payAmount: string
  departTime: string
  arriveTime: string
  durationTime: string
  departAirportName: string
  departTerminal: string
  arriveAirportName: string
  arriveTerminal: string
  flightNo: string
  stops: string
  createTime: string
  contactName: string
}

/* ─── Price calendar ────────────────────────────────────── */

export interface PriceCalendarRequestDto {
  resourceType: number
  resourceId?: string
  startDate?: string
  endDate?: string
}

export interface PriceCalendarResponseDto {
  resourceType: number
  resourceTypeDesc: string
  startDate: string
  endDate: string
  dailyPrices: DailyPriceDto[]
}

export interface DailyPriceDto {
  date: string
  available: boolean
  unavailableReason: string
  adultPrice: number
  childPrice: number
}

/* ─── City list ─────────────────────────────────────────── */

export interface CityListRequestDto {
  domesticType?: number
  resourceType?: number
}

export interface CityListResponseDto {
  hotCityList: HotCityDto[]
  cityList: CityGroupDto[]
}

export interface HotCityDto {
  cityId: number
  cityName: string
  level: number
  cityShortName: string
  nbsCityId: number
  hotCityType: number
  flightCode: string
  parentId: number
}

export interface CityGroupDto {
  pyInitial: string
  cityList: CityDto[]
}

export interface CityDto {
  cityId: number
  cityName: string
  level: number
  cityShortName: string
  nbsCityId: number
  hotCityType: number
  flightCode: string
  parentId: number
}

/* ─── Order create ──────────────────────────────────────── */

export interface OrderCreateRequestDto {
  memberId: string
  userName?: string
  phoneNumber: string
  distributor?: number
  orderSource: number
  email?: string
  orderType?: number
  subOrderType?: string
  serviceFee?: number
  serviceFeeList?: ServiceFeeItemDto[]
  clientType?: string
  clientVersion?: string
  channelSourceType?: number
  businessModule?: number
  internalFlag?: number
  businessType?: number
  contact?: ContactDto
  tripType?: number
  fromDate?: string
  returnDate?: string
  totalAmount?: number
  payAmount?: number
  items?: OrderItemDto[]
  departureCityId?: number
  destinationCityId?: number
}

export interface ServiceFeeItemDto {
  serviceFeeType: number
  serviceFee: number
}

export interface ContactDto {
  address?: string
  email?: string
  name?: string
  phone?: string
  postcode?: string
}

export interface OrderItemDto {
  resourceItemId: string
  sessionId?: string
  goExtData?: string
  rangeType?: number
  cabinGrade?: number
  adultNum?: number
  childNum?: number
  adultSalePrice?: number
  adultAirportFee?: number
  adultOilFee?: number
  adultServiceFee?: number
  adultChannelPrice?: number
  childSalePrice?: number
  childAirportFee?: number
  childOilFee?: number
  childChannelPrice?: number
  childServiceFee?: number
  insuranceBuyItems?: InsuranceBuyItemDto[]
  passengers?: OrderPassengerDto[]
}

export interface InsuranceBuyItemDto {
  buyNum: number
  cardNum: string
  insuranceProductId: string
}

export interface OrderPassengerDto {
  passengerId?: number
  name?: string
  idNumber?: string
  idType?: string
  phoneNumber?: string
  customerType?: number
  birthday?: string
  gender?: number
  nationality?: string
  pinyinname?: string
}

export interface OrderCreateResponseDto {
  canBooking: boolean
  payNode: number
  cancelRule: number
  breakFastRule: number
  remainingRoomCount: number
  availableRoomCount: number
  salePrice: number
  channelPrice: number
  dailyPrices: unknown[]
  needIdentityCard: boolean
  needEnglishName: boolean
  earliestArrivalTime: string
  latestArrivalTime: string
  cannotBookingReason: string
  holdingDetailList: unknown[]
  orderBaseId: string
  payOrderNo: string
  productName: string
  payAmount: number
  isContainMyself: boolean
  isB2CChangPrice: boolean
  isTicketLimit: boolean
}

/* ─── Price verify ──────────────────────────────────────── */

export interface PriceVerifyRequestDto {
  goExtData: string
  backExtData?: string
  sessionId: string
  adultSalePrice?: number
  childSalePrice?: number
  adultNum: number
  childNum: number
  adultAirportFee?: number
  adultOilFee?: number
  childAirportFee?: number
  childOilFee?: number
  memberId?: string
  entranceSource?: number
  adultServiceFee?: number
  childServiceFee?: number
}

export interface PriceVerifyResponseDto {
  sessionId: string
  code: number
}

/* ─── Rule valid ────────────────────────────────────────── */

export interface RuleValidRequestDto {
  memberId: string
  userName?: string
  phoneNumber: string
  distributor?: number
  orderSource: number
  email?: string
  orderType?: number
  subOrderType?: string
  serviceFee?: number
  serviceFeeList?: ServiceFeeItemDto[]
  clientType?: string
  clientVersion?: string
  channelSourceType?: number
  businessModule?: number
  internalFlag?: number
  businessType?: number
  contact?: ContactDto
  tripType?: number
  fromDate?: string
  returnDate?: string
  totalAmount?: number
  payAmount?: number
  items?: OrderItemDto[]
  departureCityId?: number
  destinationCityId?: number
}

export interface RuleValidResponseDto {
  canBooking: boolean
  payNode: number
  cancelRule: number
  breakFastRule: number
  remainingRoomCount: number
  availableRoomCount: number
  salePrice: number
  channelPrice: number
  dailyPrices: unknown[]
  needIdentityCard: boolean
  needEnglishName: boolean
  earliestArrivalTime: string
  latestArrivalTime: string
  cannotBookingReason: string
  holdingDetailList: unknown[]
  orderBaseId: string
  payOrderNo: string
  productName: string
  payAmount: number
  isContainMyself: boolean
  isB2CChangPrice: boolean
  isTicketLimit: boolean
}

/* ─── Paycheck ──────────────────────────────────────────── */

export interface PaycheckRequestDto {
  orderNo: string
}

export interface PaycheckResponseDto {
  errorCode: number
  errorMessage: string
  needRetry: boolean
}

/* ─── Refund confirm ────────────────────────────────────── */

export interface RefundConfirmRequestDto {
  orderBaseId: string
  amount: number
  originAmount?: number
  refundType?: number
  refundItemList?: RefundItemDto[]
  orderType: number
  reason?: string
  reasonType?: number
  memberId?: string
  files?: AttachmentFileDto[]
  applyType?: number
  sessionId?: string
  refundQuota?: number
  refundCash?: number
  refundChannel?: number
  supplierRefundNo?: string
}

export interface RefundItemDto {
  orderItemNo: string
  orderPassengerIds?: number[]
  refundQuantity?: number
  refundAmount?: number
}

export interface AttachmentFileDto {
  fileName: string
  filePath: string
  originalFilename: string
}

export interface RefundConfirmResponseDto {
  refundRecordId: string
  redundAmount: number
  orderType: number
}

/* ─── Refund list ───────────────────────────────────────── */

export interface RefundListRequestDto {
  orderBaseId: string
  orderType: number
}

export interface RefundListResponseDto {
  orderBaseId: string
  refundRecordId: string
  redundAmount: number
  orderType: number
  refundStatus: number
  refundType: number
  reason: string
}

/* ─── Refund detail ─────────────────────────────────────── */

export interface RefundDetailRequestDto {
  orderBaseId: string
  orderType: number
  refundRecordId?: string
}

export interface RefundDetailResponseDto {
  orderBaseId: string
  refundRecordId: string
  refundAmount: number
  originAmount: number
  orderType: number
  refundStatus: number
  refundType: number
  reason: string
  discountAmount: number
  actualRefundAmount: number
  applyType: string
  applyTime: string
  ticketRefundTime: string
  refundTime: string
  refuseReason: string
  adminNotes: string
  cashAmount: number
  quotaAmount: number
  refundRuleType: number
  quotaRefundStatus: number
  cashRefundStatus: number
  flightItemInfos: FlightRefundItemInfoDto[]
}

export interface FlightRefundItemInfoDto {
  flightNo: string
  fromCityName: string
  toCityName: string
  acName: string
  departTime: string
  passengerName: string[]
  issueOrderId: string
}

/* ─── Refund flow list ──────────────────────────────────── */

export interface RefundFlowListRequestDto {
  orderBaseId: string
  orderType: number
  refundRecordId: string
}

export interface RefundFlowListResponseDto {
  orderBaseId: string
  refundRecordId: string
  redundAmount: number
  orderType: number
  refundStatus: number
  operateTime: string
  discountAmount: number
  actualRefundAmount: number
}

/* ─── Upload ────────────────────────────────────────────── */

export interface UploadRequestDto {
  file: File | Blob | string
}

export interface UploadResponseDto {
  originalFilename: string
  objectKey: string
  objectUrl: string
  success: boolean
  errorMessage: string
  obsFileUrl: string
}

/* ─── Passenger list ────────────────────────────────────── */

export interface PassengerListRequestDto {
  orderType?: number
}

export interface PassengerListResponseDto {
  id: number
  memberId: string
  passengerName: string
  englishName: string
  pinyinName: string
  passengerType: number
  subPassengerType: number
  gender: number
  birthday: string
  identityType: string
  identityNo: string
  identityExpireDate: string
  nationality: string
  phoneCountryCode: string
  phoneNumber: string
  email: string
  status: number
  extraInfo: string
  createTime: string
  updateTime: string
}

/* ─── Passenger save ────────────────────────────────────── */

export interface PassengerSaveRequestDto {
  id?: number
  memberId?: string
  passengerName: string
  englishName?: string
  pinyinName?: string
  passengerType?: number
  subPassengerType?: number
  gender?: number
  birthday?: string
  identityType?: string
  identityNo?: string
  identityExpireDate?: string
  nationality?: string
  phoneCountryCode?: string
  phoneNumber?: string
  email?: string
  status?: number
  extraInfo?: string
  createTime?: string
  updateTime?: string
}

export interface PassengerSaveResponseDto {
  id: number
  memberId: string
  passengerName: string
  englishName: string
  pinyinName: string
  passengerType: number
  subPassengerType: number
  gender: number
  birthday: string
  identityType: string
  identityNo: string
  identityExpireDate: string
  nationality: string
  phoneCountryCode: string
  phoneNumber: string
  email: string
  status: number
  extraInfo: string
  createTime: string
  updateTime: string
}

/* ─── Passenger delete ──────────────────────────────────── */

export interface PassengerDeleteRequestDto {
  id: number
}

export interface PassengerDeleteResponseDto {
  success: boolean
}
