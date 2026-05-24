/**
 * Flight DTO → Domain entity mappers
 */

'background only'

import {
  type DomainError,
} from 'travel-domain'
import type {
  Flight,
  Cabin,
  FlightCabinDetail,
  CabinInfo,
  FlightOrder,
  Passenger,
  CityListResult,
  HotCity,
  CityGroup,
  City,
  AirportInfo,
  AirPort,
  PriceCalendar,
  DailyPrice,
  OrderCreateResult,
  PriceVerifyResult,
  RuleValidResult,
  PaycheckResult,
  RefundRecord,
  RefundDetail,
  FlightRefundItemInfo,
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
} from 'travel-domain'
import type {
  FlightDetailDto,
  CabinListResponseDto,
  CabinInfoDetailDto,
  CabinInfoDto,
  OrderListResponseDto,
  PassengerListResponseDto,
  HotCityDto,
  CityGroupDto,
  CityDto,
  AirportSearchResponseDto,
  AirPortDto,
  PriceCalendarResponseDto,
  DailyPriceDto,
  OrderCreateResponseDto,
  PriceVerifyResponseDto,
  RuleValidResponseDto,
  PaycheckResponseDto,
  RefundConfirmResponseDto,
  RefundListResponseDto,
  RefundDetailResponseDto,
  FlightRefundItemInfoDto,
  RefundFlowListResponseDto,
  UploadResponseDto,
  FlightSearchRequestDto,
  FlightV2SearchRequestDto,
  CabinListRequestDto,
  PriceCalendarRequestDto,
  AirportSearchRequestDto,
  CityListRequestDto,
  OrderListRequestDto,
  OrderCreateRequestDto,
  PriceVerifyRequestDto,
  RuleValidRequestDto,
  PaycheckRequestDto,
  RefundConfirmRequestDto,
  RefundListRequestDto,
  RefundDetailRequestDto,
  RefundFlowListRequestDto,
  UploadRequestDto,
  PassengerListRequestDto,
  PassengerSaveRequestDto,
  PassengerDeleteRequestDto,
  ServiceFeeItemDto,
  ContactDto,
  OrderItemDto,
  InsuranceBuyItemDto,
  OrderPassengerDto,
  RefundItemDto,
  AttachmentFileDto,
} from './dto.js'

/* ─── entity mappers ────────────────────────────────────── */

export function toFlight(dto: FlightDetailDto): Flight {
  return {
    flightNumber: dto.flightNumber ?? '',
    airline: { code: dto.acCode ?? '', name: dto.airline ?? '', logo: dto.logo },
    acCode: dto.acCode ?? '',
    logo: dto.logo ?? '',
    model: dto.model ?? '',
    depDate: dto.depDate ?? '',
    arrDate: dto.arrDate ?? '',
    depCityCode: dto.depCityCode ?? '',
    arrCityCode: dto.arrCityCode ?? '',
    depCityName: dto.depCityName ?? '',
    arrCityName: dto.arrCityName ?? '',
    depCode: dto.depCode ?? '',
    depAirport: dto.depAirport ?? '',
    arrCode: dto.arrCode ?? '',
    arrAirport: dto.arrAirport ?? '',
    depTerminal: dto.depTerminal ?? '',
    arrTerminal: dto.arrTerminal ?? '',
    depTime: dto.depTime ?? '',
    arrTime: dto.arrTime ?? '',
    duration: dto.duration ?? '',
    stops: dto.stops ?? [],
    isShare: dto.isShare ?? 0,
    isStop: dto.isStop ?? 0,
    shareAcCode: dto.shareAcCode ?? '',
    shareLogo: dto.shareLogo ?? '',
    shareFlight: dto.shareFlight ?? '',
    shareFlyNo: dto.shareFlyNo ?? '',
    price: dto.price ?? 0,
    intervalDay: dto.intervalDay ?? 0,
    depWeek: dto.depWeek ?? '',
    meal: (dto.meal ?? 0) as import('travel-domain').MealType,
    mealDesc: dto.mealDesc ?? '',
    extData: dto.extData ?? '',
    discount: dto.discount ?? 0,
    cabinName: dto.cabinName ?? '',
    handBaggageRule: dto.handBaggageRule ?? '',
    consignBaggageRule: dto.consignBaggageRule ?? '',
    baggageRule: dto.baggageRule ?? '',
    adultTicketPrice: dto.adultTicketPrice,
    adultAirportFee: dto.adultAirportFee,
    adultOilFee: dto.adultOilFee,
    childTicketPrice: dto.childTicketPrice,
    childAirportFee: dto.childAirportFee,
    childOilFee: dto.childOilFee,
    adultSalePrice: dto.adultSalePrice,
    adultChannelPrice: dto.adultChannelPrice,
    adultServiceFee: dto.adultServiceFee,
    childSalePrice: dto.childSalePrice,
    childChannelPrice: dto.childChannelPrice,
    childServiceFee: dto.childServiceFee,
  }
}

export function toCabin(dto: CabinListResponseDto): Cabin {
  return {
    sessionId: dto.sessionId ?? '',
    goFlightCabin: dto.goFlightCabin ? toFlightCabinDetail(dto.goFlightCabin) : undefined,
    backFlightCabin: dto.backFlightCabin ? toFlightCabinDetail(dto.backFlightCabin) : undefined,
    emptyMessage: dto.emptyMessage,
  }
}

function toFlightCabinDetail(dto: CabinInfoDetailDto): FlightCabinDetail {
  return {
    flight: toFlight(dto.flight),
    cabinList: dto.cabinList.map(toCabinInfo),
  }
}

function toCabinInfo(dto: CabinInfoDto): CabinInfo {
  return {
    cabinCode: dto.cabinCode ?? '',
    cabinName: dto.cabinName ?? '',
    cabinGrade: (dto.cabinGrade ?? 0) as import('travel-domain').CabinGrade,
    price: dto.price ?? 0,
    adultPrice: dto.adultPrice ?? 0,
    childPrice: dto.childPrice ?? 0,
    adultAirportFee: dto.adultAirportFee ?? 0,
    adultOilFee: dto.adultOilFee ?? 0,
    childAirportFee: dto.childAirportFee ?? 0,
    childOilFee: dto.childOilFee ?? 0,
    discount: dto.discount ?? 0,
    meal: (dto.meal ?? 0) as import('travel-domain').MealType,
    mealDesc: dto.mealDesc ?? '',
    handBaggageRule: dto.handBaggageRule ?? '',
    consignBaggageRule: dto.consignBaggageRule ?? '',
    baggageRule: dto.baggageRule ?? '',
    remainingSeats: dto.remainingSeats ?? 0,
    extData: dto.extData ?? '',
  }
}

export function toFlightOrder(dto: OrderListResponseDto): FlightOrder {
  return {
    orderSource: dto.orderSource,
    orderBaseId: dto.orderBaseId,
    flightOrderNo: dto.flightOrderNo,
    flightOrderType: dto.flightOrderType,
    flightOrderStatus: dto.flightOrderStatus,
    refundStatus: dto.refundStatus,
    refundAmount: dto.refundAmount,
    payExpireTime: dto.payExpireTime,
    fromCityCode: dto.fromCityCode,
    fromCityName: dto.fromCityName,
    toCityCode: dto.toCityCode,
    toCityName: dto.toCityName,
    tripType: dto.tripType,
    fromDate: dto.fromDate,
    returnDate: dto.returnDate,
    totalAmount: dto.totalAmount,
    payAmount: dto.payAmount,
    departTime: dto.departTime,
    arriveTime: dto.arriveTime,
    durationTime: dto.durationTime,
    departAirportName: dto.departAirportName,
    departTerminal: dto.departTerminal,
    arriveAirportName: dto.arriveAirportName,
    arriveTerminal: dto.arriveTerminal,
    flightNo: dto.flightNo,
    stops: dto.stops,
    createTime: dto.createTime,
    contactName: dto.contactName,
  }
}

export function toPassenger(dto: PassengerListResponseDto): Passenger {
  return {
    id: dto.id,
    memberId: dto.memberId,
    passengerName: dto.passengerName,
    englishName: dto.englishName,
    pinyinName: dto.pinyinName,
    passengerType: dto.passengerType as import('travel-domain').PassengerType,
    subPassengerType: dto.subPassengerType,
    gender: dto.gender as import('travel-domain').Gender,
    birthday: dto.birthday,
    identityType: dto.identityType as import('travel-domain').IdentityType,
    identityNo: dto.identityNo,
    identityExpireDate: dto.identityExpireDate,
    nationality: dto.nationality,
    phoneCountryCode: dto.phoneCountryCode,
    phoneNumber: dto.phoneNumber,
    email: dto.email,
    status: dto.status,
    extraInfo: dto.extraInfo,
    createTime: dto.createTime,
    updateTime: dto.updateTime,
  }
}

export function toCityListResult(dto: {
  hotCityList: HotCityDto[]
  cityList: CityGroupDto[]
}): CityListResult {
  return {
    hotCityList: dto.hotCityList.map(toHotCity),
    cityList: dto.cityList.map(toCityGroup),
  }
}

function toHotCity(dto: HotCityDto): HotCity {
  return { ...dto }
}

function toCityGroup(dto: CityGroupDto): CityGroup {
  return {
    pyInitial: dto.pyInitial,
    cityList: dto.cityList.map(toCity),
  }
}

function toCity(dto: CityDto): City {
  return { ...dto }
}

export function toAirportInfo(dto: AirportSearchResponseDto): AirportInfo {
  return {
    hitCityOrAirport: dto.hitCityOrAirport,
    cityId: dto.cityId,
    cityCode: dto.cityCode,
    cityNameCn: dto.cityNameCn,
    cityNamePy: dto.cityNamePy,
    cityNameEn: dto.cityNameEn,
    areaName: dto.areaName,
    airPorts: dto.airPorts.map(toAirPort),
  }
}

function toAirPort(dto: AirPortDto): AirPort {
  return { ...dto }
}

export function toPriceCalendar(dto: PriceCalendarResponseDto): PriceCalendar {
  return {
    resourceType: dto.resourceType,
    resourceTypeDesc: dto.resourceTypeDesc,
    startDate: dto.startDate,
    endDate: dto.endDate,
    dailyPrices: dto.dailyPrices.map(toDailyPrice),
  }
}

function toDailyPrice(dto: DailyPriceDto): DailyPrice {
  return { ...dto }
}

export function toOrderCreateResult(dto: OrderCreateResponseDto): OrderCreateResult {
  return { ...dto }
}

export function toPriceVerifyResult(dto: PriceVerifyResponseDto): PriceVerifyResult {
  return { ...dto }
}

export function toRuleValidResult(dto: RuleValidResponseDto): RuleValidResult {
  return { ...dto }
}

export function toPaycheckResult(dto: PaycheckResponseDto): PaycheckResult {
  return { ...dto }
}

export function toRefundRecord(dto: RefundListResponseDto): RefundRecord {
  return {
    orderBaseId: dto.orderBaseId,
    refundRecordId: dto.refundRecordId,
    redundAmount: dto.redundAmount,
    orderType: dto.orderType,
    refundStatus: dto.refundStatus as import('travel-domain').RefundStatus,
    refundType: dto.refundType,
    reason: dto.reason,
  }
}

export function toRefundConfirmResult(dto: RefundConfirmResponseDto): RefundRecord {
  return {
    orderBaseId: '',
    refundRecordId: dto.refundRecordId,
    redundAmount: dto.redundAmount,
    orderType: dto.orderType,
    refundStatus: 0 as import('travel-domain').RefundStatus,
    refundType: 0,
    reason: '',
  }
}

export function toRefundDetail(dto: RefundDetailResponseDto): RefundDetail {
  return {
    orderBaseId: dto.orderBaseId,
    refundRecordId: dto.refundRecordId,
    refundAmount: dto.refundAmount,
    originAmount: dto.originAmount,
    orderType: dto.orderType,
    refundStatus: dto.refundStatus as import('travel-domain').RefundStatus,
    refundType: dto.refundType,
    reason: dto.reason,
    discountAmount: dto.discountAmount,
    actualRefundAmount: dto.actualRefundAmount,
    applyType: dto.applyType,
    applyTime: dto.applyTime,
    ticketRefundTime: dto.ticketRefundTime,
    refundTime: dto.refundTime,
    refuseReason: dto.refuseReason,
    adminNotes: dto.adminNotes,
    cashAmount: dto.cashAmount,
    quotaAmount: dto.quotaAmount,
    refundRuleType: dto.refundRuleType as import('travel-domain').RefundRuleType,
    quotaRefundStatus: dto.quotaRefundStatus as import('travel-domain').RefundStatus,
    cashRefundStatus: dto.cashRefundStatus as import('travel-domain').CashRefundStatus,
    flightItemInfos: dto.flightItemInfos.map(toFlightRefundItemInfo),
  }
}

function toFlightRefundItemInfo(dto: FlightRefundItemInfoDto): FlightRefundItemInfo {
  return {
    flightNo: dto.flightNo,
    fromCityName: dto.fromCityName,
    toCityName: dto.toCityName,
    acName: dto.acName,
    departTime: dto.departTime,
    passengerName: dto.passengerName,
    issueOrderId: dto.issueOrderId,
  }
}

export function toRefundFlow(dto: RefundFlowListResponseDto): RefundFlow {
  return {
    orderBaseId: dto.orderBaseId,
    refundRecordId: dto.refundRecordId,
    redundAmount: dto.redundAmount,
    orderType: dto.orderType,
    refundStatus: dto.refundStatus as import('travel-domain').RefundStatus,
    operateTime: dto.operateTime,
    discountAmount: dto.discountAmount,
    actualRefundAmount: dto.actualRefundAmount,
  }
}

export function toUploadResult(dto: UploadResponseDto): UploadResult {
  return { ...dto }
}

/* ─── reverse: domain → DTO ─────────────────────────────── */

export function toSearchRequestDto(criteria: FlightSearchCriteria): FlightSearchRequestDto {
  return {
    cabinGrade: criteria.cabinGrade,
    adultNum: criteria.adultNum,
    childNum: criteria.childNum,
    fromCity: criteria.fromCity,
    fromCityType: criteria.fromCityType,
    fromDate: criteria.fromDate,
    retDate: criteria.retDate,
    toCity: criteria.toCity,
    toCityType: criteria.toCityType,
    tripType: criteria.tripType,
    sortType: criteria.sortType,
    sortOrder: criteria.sortOrder,
    entranceSource: criteria.entranceSource,
  }
}

export function toV2SearchRequestDto(criteria: FlightSearchCriteria): FlightV2SearchRequestDto {
  return {
    cabinGrade: criteria.cabinGrade,
    adultNum: criteria.adultNum,
    childNum: criteria.childNum,
    fromCity: criteria.fromCity,
    fromCityType: criteria.fromCityType,
    fromDate: criteria.fromDate,
    retDate: criteria.retDate,
    toCity: criteria.toCity,
    toCityType: criteria.toCityType,
    tripType: criteria.tripType,
    sortType: criteria.sortType,
    sortOrder: criteria.sortOrder,
    fromTimeRanges: criteria.fromTimeRanges as unknown as import('./dto.js').TimeRangeDto[],
    toTimeRanges: criteria.toTimeRanges as unknown as import('./dto.js').TimeRangeDto[],
    directFlight: criteria.directFlight,
    bigModel: criteria.bigModel,
    mediumModel: criteria.mediumModel,
    hiddeShareFlight: criteria.hiddeShareFlight,
    depAirports: criteria.depAirports as string[] | undefined,
    arrAirports: criteria.arrAirports as string[] | undefined,
    airlines: criteria.airlines as string[] | undefined,
    entranceSource: criteria.entranceSource,
  }
}

export function toCabinSearchRequestDto(criteria: CabinSearchCriteria): CabinListRequestDto {
  return {
    sessionId: criteria.sessionId,
    goExtData: criteria.goExtData,
    backExtData: criteria.backExtData,
    adultNum: criteria.adultNum,
    childNum: criteria.childNum,
    cabinGrade: criteria.cabinGrade,
    adultSalePrice: criteria.adultSalePrice,
    childSalePrice: criteria.childSalePrice,
    adultAirportFee: criteria.adultAirportFee,
    adultOilFee: criteria.adultOilFee,
    childAirportFee: criteria.childAirportFee,
    childOilFee: criteria.childOilFee,
    entranceSource: criteria.entranceSource,
    memberId: criteria.memberId,
    adultCostPrice: criteria.adultCostPrice,
    childCostPrice: criteria.childCostPrice,
    adultChannelPrice: criteria.adultChannelPrice,
    childChannelPrice: criteria.childChannelPrice,
    adultServiceFee: criteria.adultServiceFee,
    childServiceFee: criteria.childServiceFee,
    saleRuleMock: criteria.saleRuleMock,
  }
}

export function toPriceCalendarRequestDto(
  criteria: PriceCalendarSearchCriteria
): PriceCalendarRequestDto {
  return {
    resourceType: criteria.resourceType,
    resourceId: criteria.resourceId,
    startDate: criteria.startDate,
    endDate: criteria.endDate,
  }
}

export function toAirportSearchRequestDto(
  criteria: AirportSearchCriteria
): AirportSearchRequestDto {
  return {
    keyword: criteria.keyword,
  }
}

export function toCityListRequestDto(criteria: CitySearchCriteria): CityListRequestDto {
  return {
    domesticType: criteria.domesticType,
    resourceType: criteria.resourceType,
  }
}

export function toOrderListRequestDto(criteria: OrderSearchCriteria): OrderListRequestDto {
  return {
    memberId: criteria.memberId,
  }
}

export function toOrderCreateRequestDto(request: OrderCreateRequest): OrderCreateRequestDto {
  return {
    memberId: request.memberId,
    userName: request.userName,
    phoneNumber: request.phoneNumber,
    distributor: request.distributor,
    orderSource: request.orderSource,
    email: request.email,
    orderType: request.orderType,
    subOrderType: request.subOrderType,
    serviceFee: request.serviceFee,
    serviceFeeList: request.serviceFeeList?.map(toServiceFeeItemDto),
    clientType: request.clientType,
    clientVersion: request.clientVersion,
    channelSourceType: request.channelSourceType,
    businessModule: request.businessModule,
    internalFlag: request.internalFlag,
    businessType: request.businessType,
    contact: request.contact ? toContactDto(request.contact) : undefined,
    tripType: request.tripType,
    fromDate: request.fromDate,
    returnDate: request.returnDate,
    totalAmount: request.totalAmount,
    payAmount: request.payAmount,
    items: request.items?.map(toOrderItemDto),
    departureCityId: request.departureCityId,
    destinationCityId: request.destinationCityId,
  }
}

function toServiceFeeItemDto(item: import('travel-domain').ServiceFeeItem): ServiceFeeItemDto {
  return {
    serviceFeeType: item.serviceFeeType,
    serviceFee: item.serviceFee,
  }
}

function toContactDto(contact: import('travel-domain').Contact): ContactDto {
  return {
    address: contact.address,
    email: contact.email,
    name: contact.name,
    phone: contact.phone,
    postcode: contact.postcode,
  }
}

function toOrderItemDto(item: import('travel-domain').OrderItem): OrderItemDto {
  return {
    resourceItemId: item.resourceItemId,
    sessionId: item.sessionId,
    goExtData: item.goExtData,
    rangeType: item.rangeType,
    cabinGrade: item.cabinGrade,
    adultNum: item.adultNum,
    childNum: item.childNum,
    adultSalePrice: item.adultSalePrice,
    adultAirportFee: item.adultAirportFee,
    adultOilFee: item.adultOilFee,
    adultServiceFee: item.adultServiceFee,
    adultChannelPrice: item.adultChannelPrice,
    childSalePrice: item.childSalePrice,
    childAirportFee: item.childAirportFee,
    childOilFee: item.childOilFee,
    childChannelPrice: item.childChannelPrice,
    childServiceFee: item.childServiceFee,
    insuranceBuyItems: item.insuranceBuyItems?.map(toInsuranceBuyItemDto),
    passengers: item.passengers?.map(toOrderPassengerDto),
  }
}

function toInsuranceBuyItemDto(item: import('travel-domain').InsuranceBuyItem): InsuranceBuyItemDto {
  return {
    buyNum: item.buyNum,
    cardNum: item.cardNum,
    insuranceProductId: item.insuranceProductId,
  }
}

function toOrderPassengerDto(p: import('travel-domain').OrderPassenger): OrderPassengerDto {
  return {
    passengerId: p.passengerId,
    name: p.name,
    idNumber: p.idNumber,
    idType: p.idType,
    phoneNumber: p.phoneNumber,
    customerType: p.customerType,
    birthday: p.birthday,
    gender: p.gender,
    nationality: p.nationality,
    pinyinname: p.pinyinname,
  }
}

export function toPriceVerifyRequestDto(request: PriceVerifyRequest): PriceVerifyRequestDto {
  return {
    goExtData: request.goExtData,
    backExtData: request.backExtData,
    sessionId: request.sessionId,
    adultSalePrice: request.adultSalePrice,
    childSalePrice: request.childSalePrice,
    adultNum: request.adultNum,
    childNum: request.childNum,
    adultAirportFee: request.adultAirportFee,
    adultOilFee: request.adultOilFee,
    childAirportFee: request.childAirportFee,
    childOilFee: request.childOilFee,
    memberId: request.memberId,
    entranceSource: request.entranceSource,
    adultServiceFee: request.adultServiceFee,
    childServiceFee: request.childServiceFee,
  }
}

export function toRuleValidRequestDto(request: OrderCreateRequest): RuleValidRequestDto {
  return toOrderCreateRequestDto(request)
}

export function toPaycheckRequestDto(orderNo: string): PaycheckRequestDto {
  return { orderNo }
}

export function toRefundConfirmRequestDto(
  request: RefundConfirmRequest
): RefundConfirmRequestDto {
  return {
    orderBaseId: request.orderBaseId,
    amount: request.amount,
    originAmount: request.originAmount,
    refundType: request.refundType,
    refundItemList: request.refundItemList?.map(toRefundItemDto),
    orderType: request.orderType,
    reason: request.reason,
    reasonType: request.reasonType,
    memberId: request.memberId,
    files: request.files?.map(toAttachmentFileDto),
    applyType: request.applyType,
    sessionId: request.sessionId,
    refundQuota: request.refundQuota,
    refundCash: request.refundCash,
    refundChannel: request.refundChannel,
    supplierRefundNo: request.supplierRefundNo,
  }
}

function toRefundItemDto(item: import('travel-domain').RefundItem): RefundItemDto {
  return {
    orderItemNo: item.orderItemNo,
    orderPassengerIds: item.orderPassengerIds as number[] | undefined,
    refundQuantity: item.refundQuantity,
    refundAmount: item.refundAmount,
  }
}

function toAttachmentFileDto(file: import('travel-domain').AttachmentFile): AttachmentFileDto {
  return {
    fileName: file.fileName,
    filePath: file.filePath,
    originalFilename: file.originalFilename,
  }
}

export function toRefundListRequestDto(request: RefundListRequest): RefundListRequestDto {
  return {
    orderBaseId: request.orderBaseId,
    orderType: request.orderType,
  }
}

export function toRefundDetailRequestDto(request: RefundDetailRequest): RefundDetailRequestDto {
  return {
    orderBaseId: request.orderBaseId,
    orderType: request.orderType,
    refundRecordId: request.refundRecordId,
  }
}

export function toRefundFlowListRequestDto(
  request: RefundFlowListRequest
): RefundFlowListRequestDto {
  return {
    orderBaseId: request.orderBaseId,
    orderType: request.orderType,
    refundRecordId: request.refundRecordId,
  }
}

export function toUploadRequestDto(request: UploadRequest): UploadRequestDto {
  return {
    file: request.file,
  }
}

export function toPassengerListRequestDto(
  criteria: PassengerSearchCriteria
): PassengerListRequestDto {
  return {
    orderType: criteria.orderType,
  }
}

export function toPassengerSaveRequestDto(
  passenger: Passenger
): PassengerSaveRequestDto {
  return {
    id: passenger.id,
    memberId: passenger.memberId,
    passengerName: passenger.passengerName,
    englishName: passenger.englishName,
    pinyinName: passenger.pinyinName,
    passengerType: passenger.passengerType,
    subPassengerType: passenger.subPassengerType,
    gender: passenger.gender,
    birthday: passenger.birthday,
    identityType: passenger.identityType,
    identityNo: passenger.identityNo,
    identityExpireDate: passenger.identityExpireDate,
    nationality: passenger.nationality,
    phoneCountryCode: passenger.phoneCountryCode,
    phoneNumber: passenger.phoneNumber,
    email: passenger.email,
    status: passenger.status,
    extraInfo: passenger.extraInfo,
    createTime: passenger.createTime,
    updateTime: passenger.updateTime,
  }
}

export function toPassengerDeleteRequestDto(id: number): PassengerDeleteRequestDto {
  return { id }
}

/* ─── error helper ──────────────────────────────────────── */

export function toDomainError(e: unknown): DomainError {
  if (e instanceof Error) {
    return {
      code: 'NETWORK_ERROR',
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
