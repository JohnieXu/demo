/**
 * Train domain entities
 */

import type { Money } from '../flight/value-object.js'

export type SeatType = 'all' | 'business' | 'first' | 'second'

export interface Train {
  readonly trainNo: string
  readonly trainType: string
  readonly departureStation: string
  readonly arrivalStation: string
  readonly departureTime: string
  readonly arrivalTime: string
  readonly duration: string
  readonly intervalDay: number
  readonly prices: readonly SeatPrice[]
}

export interface SeatPrice {
  readonly seatType: string
  readonly price: Money
  readonly remaining: number
}

export interface TrainSearchCriteria {
  readonly departure: string
  readonly arrival: string
  readonly date: string
  readonly seatType?: SeatType
}

export interface TrainPriceCalendar {
  readonly date: string
  readonly lowestPrice: Money
}
