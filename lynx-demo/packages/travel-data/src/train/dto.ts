/**
 * Train data-transfer objects
 */

export interface TrainSearchRequestDto {
  departure: string
  arrival: string
  date: string
  seatType?: 'all' | 'business' | 'first' | 'second'
}

export interface TrainSearchResponseDto {
  list: TrainDto[]
  total: number
  page: number
  pageSize: number
}

export interface TrainDto {
  trainNo: string
  trainType: string
  departureStation: string
  arrivalStation: string
  departureTime: string
  arrivalTime: string
  duration: string
  intervalDay: number
  prices: SeatPriceDto[]
}

export interface SeatPriceDto {
  seatType: string
  priceAmount: number
  priceCurrency: string
  remaining: number
}

export interface TrainPriceCalendarRequestDto {
  departure: string
  arrival: string
  month: string
}

export interface TrainPriceCalendarDto {
  date: string
  lowestPriceAmount: number
  lowestPriceCurrency: string
}
