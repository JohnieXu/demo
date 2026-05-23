export interface FlightInfo {
  flightNo: string
  airline: string
  airlineIcon?: string
  airlineColor?: string
  departureTime: string
  arrivalTime: string
  departureAirport: string
  arrivalAirport: string
  duration: string
  aircraftType: string
  aircraftSize: '大' | '中' | '小'
  mealService: boolean
  price: number
  cabinClass: string
  discount: string
  intervalDay: number
}

export type SortType = 'direct' | 'time' | 'price'

export interface DateItem {
  label: string
  date: string
  fullDate: string
}

export interface FilterTag {
  label: string
  key: FilterKey
}

export type FilterKey =
  | 'depDaxing'
  | 'depCapital'
  | 'arrHongqiao'
  | 'arrPudong'
  | 'onlyDirect'
  | 'largeAircraft'
  | 'hideShared'
  | 'singleAdult'
