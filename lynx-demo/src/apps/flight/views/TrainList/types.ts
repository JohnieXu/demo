export interface SeatDetail {
  seatName: string
  price: number
  seatCnt: number
  downPrice: number
  midPrice: number
  upPrice: number
  discount: string
  downDiscount: string
  midDiscount: string
  upDiscount: string
  childPrice: number
  serviceFee: number
}

export interface TrainInfo {
  trainNo: string
  fromDate: string
  toDate: string
  fromTime: string
  toTime: string
  fromStation: string
  toStation: string
  duration: string
  seatDetails: SeatDetail[]
  isQuietCoach: string
  isFxh: string
  isZndcz: string
  isHigh: string
  minPrice: number
  discount: string
  intervalDay: number
}

export interface TrainListResponse {
  success: boolean
  errorCode: string
  message: string
  data: {
    trainInfos: TrainInfo[]
    labels: Array<{ label: string; show: boolean }>
  }
}

export type SortType = 'depart' | 'duration' | 'price'

export interface DateItem {
  label: string
  date: string
  weekday: string
  isActive: boolean
}
