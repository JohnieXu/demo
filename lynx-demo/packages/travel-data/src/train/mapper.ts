/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Train DTO → Domain entity mappers
 */

import {
  ok,
  err,
  createPageResult,
  type Result,
  type DomainError,
  type PageResult,
  type Train,
  type TrainPriceCalendar,
  type TrainSearchCriteria,
} from 'travel-domain'
import type {
  TrainDto,
  SeatPriceDto,
  TrainSearchRequestDto,
  TrainPriceCalendarDto,
} from './dto.js'

/* ─── helpers ───────────────────────────────────────────── */

function toMoney(amount: number, currency: string) {
  return { amountInCents: amount, currency }
}

/* ─── entity mappers ────────────────────────────────────── */

export function toTrain(dto: TrainDto): Train {
  return {
    trainNo: dto.trainNo,
    trainType: dto.trainType,
    departureStation: dto.departureStation,
    arrivalStation: dto.arrivalStation,
    departureTime: dto.departureTime,
    arrivalTime: dto.arrivalTime,
    duration: dto.duration,
    intervalDay: dto.intervalDay,
    prices: dto.prices.map(toSeatPrice),
  }
}

function toSeatPrice(dto: SeatPriceDto) {
  return {
    seatType: dto.seatType,
    price: toMoney(dto.priceAmount, dto.priceCurrency),
    remaining: dto.remaining,
  }
}

export function toPriceCalendar(dto: TrainPriceCalendarDto): TrainPriceCalendar {
  return {
    date: dto.date,
    lowestPrice: toMoney(dto.lowestPriceAmount, dto.lowestPriceCurrency),
  }
}

/* ─── reverse: domain → DTO ─────────────────────────────── */

export function toSearchRequestDto(criteria: TrainSearchCriteria): TrainSearchRequestDto {
  return {
    departure: criteria.departure,
    arrival: criteria.arrival,
    date: criteria.date,
    seatType: criteria.seatType,
  }
}

/* ─── error helper ──────────────────────────────────────── */

/**
 * Verify whether the response is business error
 * @deprecated No need this to verify business error which is handled by client.ts
 * @param e 
 * @returns 
 */
function isBussinessError(e: unknown): e is { errorCode: string, success: false, message: string } {
  return (
      typeof e === 'object' &&                                                                                              
      e !== null &&                                               
      'errorCode' in e &&                                                                                                   
      typeof e.errorCode === 'string' &&                                                                                    
      (e as Record<string, boolean>).success === false                                                                                                   
    )
}

export function toDomainError(e: unknown): DomainError {
  if (e instanceof Error) {
    return {
      code: (e as { code?: string }).code || 'NETWORK_ERROR',
      message: e.message,
      cause: e,
    }
  }
  // No need this to verify business error which is handled by client.ts
  // if (isBussinessError(e)) {
  //   return {
  //     code: e.errorCode,
  //     message: e.message || 'BUSINESS ERROR',
  //     cause: e,
  //   }
  // }
  return {
    code: 'UNKNOWN_ERROR',
    message: String(e),
    cause: e,
  }
}
