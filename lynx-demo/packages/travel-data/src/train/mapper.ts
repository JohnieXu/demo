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
