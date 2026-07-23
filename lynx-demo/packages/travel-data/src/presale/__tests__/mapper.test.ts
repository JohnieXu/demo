/**
 * Mapper unit tests.
 *
 * The mapper is the only place that knows how raw yuan amounts / numeric status
 * codes translate into the domain's Money + string enums, so these tests guard
 * that contract.
 */

import { describe, expect, it } from 'vitest'

import {
  toPresaleAppointmentDetailEntity,
  toPresaleOrderDetail,
  toPresaleOrderList,
  toPresaleProductCalendarEntity,
  toPresaleProductDetailEntity,
  toPresaleReservationCalendarEntity,
  toDomainError,
  yuanToMoney,
} from '../mapper.js'
import type {
  PresaleOrderDetailRawDto,
  PresaleOrderListResponseDto,
  PresaleProductCalendarResponseDto,
  PresaleProductDetailResponseDto,
  ReservationCalendarResponseDto,
  ReservationOrderDetailDto,
} from '../dto.js'

describe('presale mapper', () => {
  describe('yuanToMoney', () => {
    it('multiplies yuan by 100 and rounds to whole cents', () => {
      expect(yuanToMoney(599)).toEqual({ amountInCents: 59900, currency: 'CNY' })
      expect(yuanToMoney(0)).toEqual({ amountInCents: 0, currency: 'CNY' })
    })

    it('rounds fractional cents to nearest integer', () => {
      // 0.005 → 0.5 → 1 cent (banker's rounding is not what we want here)
      expect(yuanToMoney(0.005).amountInCents).toBe(1)
      expect(yuanToMoney(0.029).amountInCents).toBe(3)
      expect(yuanToMoney(0.01).amountInCents).toBe(1)
    })

    it('returns zero Money for null / undefined / non-finite', () => {
      expect(yuanToMoney(null)).toEqual({ amountInCents: 0, currency: 'CNY' })
      expect(yuanToMoney(undefined)).toEqual({ amountInCents: 0, currency: 'CNY' })
      expect(yuanToMoney(NaN)).toEqual({ amountInCents: 0, currency: 'CNY' })
      expect(yuanToMoney(Infinity)).toEqual({ amountInCents: 0, currency: 'CNY' })
    })

    it('honours a custom currency', () => {
      expect(yuanToMoney(10, 'USD')).toEqual({ amountInCents: 1000, currency: 'USD' })
    })
  })

  describe('presale order status codes', () => {
    it.each<[number, string]>([
      [0, 'pending_pay'],
      [10, 'pending_book'],
      [20, 'partial_book'],
      [30, 'booked'],
      [40, 'cancelled'],
      [41, 'cancelled'],
      [50, 'refunding'],
      [60, 'refunded'],
      [70, 'refund_failed'],
    ])('maps presale status code %i to %s', (code, expected) => {
      const dto: PresaleOrderListResponseDto = {
        list: [
          {
            orderBaseId: 'o1',
            presaleStatus: code,
          },
        ],
        total: 1,
      }
      const { list } = toPresaleOrderList(dto)
      expect(list[0]?.status).toBe(expected)
      expect(list[0]?.presaleStatus).toBe(code)
    })

    it('falls back to pending_pay for unknown codes', () => {
      const dto: PresaleOrderListResponseDto = {
        list: [
          {
            orderBaseId: 'o1',
            presaleStatus: 999,
          },
        ],
        total: 1,
      }
      const { list } = toPresaleOrderList(dto)
      expect(list[0]?.status).toBe('pending_pay')
      expect(list[0]?.presaleStatus).toBeUndefined()
    })

    it('flags timeout_refund cancelReason when DTO carries the marker', () => {
      const dto: PresaleOrderListResponseDto = {
        list: [
          {
            orderBaseId: 'o1',
            presaleStatus: 41,
            cancelReason: 'timeout_refund',
          },
        ],
        total: 1,
      }
      const { list } = toPresaleOrderList(dto)
      expect(list[0]?.cancelReason).toBe('timeout_refund')
    })

    it('defaults cancelReason to unpaid when DTO omits it', () => {
      const dto: PresaleOrderListResponseDto = {
        list: [
          {
            orderBaseId: 'o1',
            presaleStatus: 41,
            // cancelReason omitted
          },
        ],
        total: 1,
      }
      const { list } = toPresaleOrderList(dto)
      expect(list[0]?.cancelReason).toBe('unpaid')
    })
  })

  describe('reservation status codes', () => {
    it.each<[number, string]>([
      [10, 'pending_pay'],
      [15, 'confirming'],
      [20, 'success'],
      [30, 'failed'],
      [31, 'failed'],
      [32, 'failed'],
      [40, 'cancelled'],
    ])('maps reservation code %i to %s', (code, expected) => {
      const dto: ReservationOrderDetailDto = {
        reservationStatus: code,
        orderBaseId: 'r1',
        hotelName: 'H',
        hotelAddress: '',
        checkInDate: '',
        checkOutDate: '',
        nightQuantity: 1,
        roomName: '',
        contactPhone: '',
      }
      const result = toPresaleAppointmentDetailEntity(dto)
      expect(result.status).toBe(expected)
      expect(result.reservationStatus).toBe(code)
    })
  })

  describe('product detail mapping', () => {
    it('converts nested price fields from yuan to cents', () => {
      const dto: PresaleProductDetailResponseDto = {
        productId: 'p1',
        skuId: 's1',
        productName: '套餐',
        productType: 'hotel_package',
        categoryType: 1,
        salePrice: 399,
        originalPrice: 599,
        discount: 200,
        lowestPrice: 299,
      }
      const result = toPresaleProductDetailEntity(dto)
      expect(result.salePrice.amountInCents).toBe(39900)
      expect(result.originalPrice.amountInCents).toBe(59900)
      expect(result.discount.amountInCents).toBe(20000)
      expect(result.lowestPrice.amountInCents).toBe(29900)
    })

    it('falls back to coverImage when mainImage is missing', () => {
      const dto: PresaleProductDetailResponseDto = {
        productId: 'p1',
        skuId: 's1',
        productName: '套餐',
        categoryType: 1,
        mainImage: undefined,
        coverImage: 'cover.jpg',
      }
      const result = toPresaleProductDetailEntity(dto)
      expect(result.mainImage).toBe('cover.jpg')
    })

    it('defaults categoryType to 1 when missing', () => {
      const dto: PresaleProductDetailResponseDto = {
        productId: 'p1',
        skuId: 's1',
        productName: '套餐',
        categoryType: 0,
      }
      const result = toPresaleProductDetailEntity(dto)
      expect(result.categoryType).toBe(1)
    })
  })

  describe('order detail mapping', () => {
    it('returns appointments, refunds, and operationLogs as part of the detail', () => {
      const dto: PresaleOrderDetailRawDto = {
        orderBaseId: 'o1',
        productId: 'p1',
        quantity: 2,
        presaleStatus: 30,
        appointments: [
          {
            id: 'a1',
            status: 'success',
            checkInDate: '2026-08-01',
            checkOutDate: '2026-08-02',
            nights: 1,
            quantity: 1,
            markupAmount: 50,
          },
        ],
        refunds: [
          { id: 'rf1', status: 'success', quantity: 1, amount: 199 },
        ],
        operationLogs: [
          {
            id: 'op1',
            createdAt: '2026-07-23T10:00:00Z',
            operatorType: 'system',
            operatorName: 'sys',
            action: 'paid',
            remark: 'ok',
          },
        ],
      }
      const result = toPresaleOrderDetail(dto)
      expect(result.appointments).toHaveLength(1)
      expect(result.appointments[0]?.markupAmount?.amountInCents).toBe(5000)
      expect(result.refunds).toHaveLength(1)
      expect(result.refunds[0]?.amount.amountInCents).toBe(19900)
      expect(result.operationLogs).toHaveLength(1)
      expect(result.operationLogs[0]?.operatorType).toBe('system')
    })
  })

  describe('product calendar (with salePrice)', () => {
    it('maps calendarDays and converts surcharge / salePrice from yuan', () => {
      const dto: PresaleProductCalendarResponseDto = {
        productId: 'p1',
        skuId: 's1',
        nights: 1,
        roomCount: 1,
        splittable: false,
        sellPrice: 399,
        calendarDays: [
          {
            date: '2026-08-01',
            weekText: '六',
            available: true,
            statusText: '可订',
            stockMode: 1,
            remainingInventory: 5,
            surchargeAmount: 30,
            salePrice: 359,
            displayText: '¥359',
          },
        ],
      }
      const result = toPresaleProductCalendarEntity(dto)
      expect(result.calendarDays).toHaveLength(1)
      const day = result.calendarDays[0]
      expect(day?.surchargeAmount.amountInCents).toBe(3000)
      expect(day?.salePrice?.amountInCents).toBe(35900)
      expect(day?.status).toBe('bookable')
    })

    it('marks stockMode=1 with zero remaining as "full"', () => {
      const dto: PresaleProductCalendarResponseDto = {
        productId: 'p1',
        skuId: 's1',
        nights: 1,
        roomCount: 1,
        splittable: false,
        calendarDays: [
          {
            date: '2026-08-01',
            available: true,
            stockMode: 1,
            remainingInventory: 0,
          },
        ],
      }
      const result = toPresaleProductCalendarEntity(dto)
      expect(result.calendarDays[0]?.status).toBe('full')
    })

    it('marks unavailable days as "unbookable" regardless of stockMode', () => {
      const dto: PresaleProductCalendarResponseDto = {
        productId: 'p1',
        skuId: 's1',
        nights: 1,
        roomCount: 1,
        splittable: false,
        calendarDays: [
          { date: '2026-08-01', available: false, stockMode: 0 },
        ],
      }
      const result = toPresaleProductCalendarEntity(dto)
      expect(result.calendarDays[0]?.status).toBe('unbookable')
    })
  })

  describe('reservation calendar (Omit salePrice)', () => {
    it('parses days without salePrice and never exposes it', () => {
      const dto: ReservationCalendarResponseDto = {
        preSaleOrderBaseId: 'p1',
        productId: 'p1',
        skuId: 's1',
        resourceId: 'r1',
        nights: 1,
        roomCount: 1,
        splittable: false,
        remainingBookableNights: 1,
        calendarDays: [
          {
            date: '2026-08-01',
            weekText: '六',
            available: true,
            statusText: '可订',
            stockMode: 0,
            remainingInventory: 3,
            surchargeAmount: 20,
            displayText: '',
          },
        ],
      }
      const result = toPresaleReservationCalendarEntity(dto)
      expect(result.calendarDays).toHaveLength(1)
      const day = result.calendarDays[0]
      // ReservationCalendarDay has no salePrice at the type level — guard at runtime:
      expect('salePrice' in (day as object)).toBe(false)
      expect(day?.surchargeAmount.amountInCents).toBe(2000)
    })
  })

  describe('toDomainError', () => {
    it('preserves the original Error as cause', () => {
      const err = new Error('boom')
      const result = toDomainError(err)
      expect(result.code).toBe('NETWORK_ERROR')
      expect(result.message).toBe('boom')
      expect(result.cause).toBe(err)
    })

    it('falls back to UNKNOWN_ERROR for non-Error throws', () => {
      const result = toDomainError('string-throw')
      expect(result.code).toBe('UNKNOWN_ERROR')
      expect(result.message).toBe('string-throw')
    })

    it('respects a custom code field on the Error', () => {
      const err = Object.assign(new Error('forbidden'), { code: 'HTTP_403' })
      const result = toDomainError(err)
      expect(result.code).toBe('HTTP_403')
    })
  })
})