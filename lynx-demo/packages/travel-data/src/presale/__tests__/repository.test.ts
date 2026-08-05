/**
 * Repository integration tests.
 *
 * Each repository takes a `PresaleRemoteDataSource` via constructor injection.
 * We override individual methods on a subclass to swap the network for an
 * in-memory fake, so the test exercises the DTO → mapper → entity pipeline
 * without ever hitting the network.
 */

import { describe, expect, it, vi } from 'vitest'

import { PresaleRemoteDataSource } from '../datasource.js'
import {
  PresaleAppointmentRepository,
  PresaleHotelRepository,
  PresaleInventoryRepository,
  PresaleOrderRepository,
  PresalePassengerRepository,
  PresaleProductRepository,
  PresaleRefundRepository,
} from '../repository.js'

/**
 * Base subclass that lets each test override only the methods it cares about.
 * Un-overridden methods will throw, surfacing accidental calls.
 */
class FakeDataSource extends PresaleRemoteDataSource {
  declare getProductList: ReturnType<typeof vi.fn>
  declare getProductDetail: ReturnType<typeof vi.fn>
  declare getCategoryTabs: ReturnType<typeof vi.fn>
  declare getPackageCities: ReturnType<typeof vi.fn>
  declare getExchangeCities: ReturnType<typeof vi.fn>
  declare getExchangeBrands: ReturnType<typeof vi.fn>
  declare getPurchasedQuantity: ReturnType<typeof vi.fn>
  declare getProductCalendar: ReturnType<typeof vi.fn>
  declare getProductNotice: ReturnType<typeof vi.fn>
  declare searchExchangeHotels: ReturnType<typeof vi.fn>
  declare getExchangeHotelRooms: ReturnType<typeof vi.fn>
  declare createOrder: ReturnType<typeof vi.fn>
  declare getOrderList: ReturnType<typeof vi.fn>
  declare getOrderDetail: ReturnType<typeof vi.fn>
  declare cancelOrder: ReturnType<typeof vi.fn>
  declare applyOrderRefund: ReturnType<typeof vi.fn>
  declare getReservationProductCalendar: ReturnType<typeof vi.fn>
  declare validateReservationOrder: ReturnType<typeof vi.fn>
  declare createReservationOrder: ReturnType<typeof vi.fn>
  declare getReservationOrderDetail: ReturnType<typeof vi.fn>
  declare cancelReservationOrder: ReturnType<typeof vi.fn>
  declare getInventoryCalendar: ReturnType<typeof vi.fn>
  declare getPassengerList: ReturnType<typeof vi.fn>
  declare savePassenger: ReturnType<typeof vi.fn>
  declare deletePassenger: ReturnType<typeof vi.fn>
  declare applyRefund: ReturnType<typeof vi.fn>
  declare getRefundDetail: ReturnType<typeof vi.fn>
  declare getRefundListByOrder: ReturnType<typeof vi.fn>
  declare getOrderRefundList: ReturnType<typeof vi.fn>
}

function makeFake(): FakeDataSource {
  const fake = new FakeDataSource() as FakeDataSource & {
    [key: string]: unknown
  }
  // Initialize all method slots with vi.fn() that throw if called without setup.
  for (const key of [
    'getProductList',
    'getProductDetail',
    'getCategoryTabs',
    'getPackageCities',
    'getExchangeCities',
    'getExchangeBrands',
    'getPurchasedQuantity',
    'getProductCalendar',
    'getProductNotice',
    'searchExchangeHotels',
    'getExchangeHotelRooms',
    'createOrder',
    'getOrderList',
    'getOrderDetail',
    'cancelOrder',
    'applyOrderRefund',
    'getReservationProductCalendar',
    'validateReservationOrder',
    'createReservationOrder',
    'getReservationOrderDetail',
    'cancelReservationOrder',
    'getInventoryCalendar',
    'getPassengerList',
    'savePassenger',
    'deletePassenger',
    'applyRefund',
    'getRefundDetail',
    'getRefundListByOrder',
    'getOrderRefundList',
  ]) {
    fake[key] = vi.fn(async () => {
      throw new Error(`FakeDataSource.${key} not stubbed`)
    })
  }
  return fake
}

describe('presale repository', () => {
  describe('PresaleProductRepository', () => {
    it('maps list response into PageResult<PresaleProduct>', async () => {
      const fake = makeFake()
      fake.getProductList.mockResolvedValue({
        data: {
          list: [
            {
              productId: 'p1',
              skuId: 's1',
              productName: '套餐 A',
              categoryType: 1,
              productType: 'hotel_package',
              salePrice: 399,
              originalPrice: 599,
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        },
      })
      const repo = new PresaleProductRepository(fake)
      const result = await repo.getList({ page: 1, pageSize: 10 })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.list).toHaveLength(1)
      expect(result.data.list[0]?.salePrice.amountInCents).toBe(39900)
      expect(result.data.total).toBe(1)
    })

    it('maps category tabs and drops unknown category types', async () => {
      const fake = makeFake()
      fake.getCategoryTabs.mockResolvedValue({
        data: [
          { categoryType: 1, categoryName: '酒店套餐', productCount: 5 },
          { categoryType: 2, categoryName: '酒店兑换', productCount: 3 },
          { categoryType: 9, categoryName: '未知', productCount: 0 },
        ],
      })
      const repo = new PresaleProductRepository(fake)
      const result = await repo.getCategoryTabs()
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data).toHaveLength(2)
      expect(result.data[0]?.value).toBe('hotel_package')
      expect(result.data[1]?.value).toBe('hotel_exchange')
    })

    it('maps exchange cities / brands / package cities as plain options', async () => {
      const fake = makeFake()
      fake.getExchangeCities.mockResolvedValue({
        data: [{ cityId: 'c1', cityName: '上海', productCount: 10 }],
      })
      fake.getExchangeBrands.mockResolvedValue({
        data: [{ brandId: 'b1', brandName: '亚朵', hotelCount: 20 }],
      })
      fake.getPackageCities.mockResolvedValue({
        data: [{ cityId: 'c2', cityName: '北京', productCount: 4 }],
      })

      const repo = new PresaleProductRepository(fake)
      const [cities, brands, pkgCities] = await Promise.all([
        repo.getExchangeCities({ productId: 'p1' }),
        repo.getExchangeBrands({ productId: 'p1' }),
        repo.getPackageCities({}),
      ])

      expect(cities.isSuccess && cities.data[0]?.cityName).toBe('上海')
      expect(brands.isSuccess && brands.data[0]?.brandName).toBe('亚朵')
      expect(pkgCities.isSuccess && pkgCities.data[0]?.cityName).toBe('北京')
    })

    it('maps purchased quantity', async () => {
      const fake = makeFake()
      fake.getPurchasedQuantity.mockResolvedValue({
        data: { productId: 'p1', purchasedQuantity: 3 },
      })
      const repo = new PresaleProductRepository(fake)
      const result = await repo.getPurchasedQuantity('p1')
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.purchasedQuantity).toBe(3)
    })

    it('maps product detail with nested hotel/room brief', async () => {
      const fake = makeFake()
      fake.getProductDetail.mockResolvedValue({
        data: {
          productId: 'p1',
          skuId: 's1',
          productName: '套餐 A',
          categoryType: 1,
          hotel: {
            hotelId: 'h1',
            hotelName: '亚朵酒店',
            cityName: '上海',
            address: '人民广场',
          },
          room: { roomTypeId: 'r1', roomTypeName: '大床房' },
        },
      })
      const repo = new PresaleProductRepository(fake)
      const result = await repo.getDetail({ productId: 'p1' })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.hotel.hotelName).toBe('亚朵酒店')
      expect(result.data.room.roomTypeName).toBe('大床房')
    })

    it('maps product calendar with surcharge conversion', async () => {
      const fake = makeFake()
      fake.getProductCalendar.mockResolvedValue({
        data: {
          productId: 'p1',
          skuId: 's1',
          nights: 1,
          roomCount: 1,
          splittable: false,
          sellPrice: 399,
          calendarDays: [
            {
              date: '2026-08-01',
              available: true,
              surchargeAmount: 30,
              salePrice: 359,
              stockMode: 1,
              remainingInventory: 5,
            },
          ],
        },
      })
      const repo = new PresaleProductRepository(fake)
      const result = await repo.getProductCalendar({ productId: 'p1' })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      const day = result.data.calendarDays[0]
      expect(day?.salePrice?.amountInCents).toBe(35900)
      expect(day?.surchargeAmount.amountInCents).toBe(3000)
    })

    it('maps product notice list', async () => {
      const fake = makeFake()
      fake.getProductNotice.mockResolvedValue({
        data: [
          {
            code: 'RESERVATION_VALIDITY',
            codeDesc: '有效期',
            textList: ['入住有效期至 2026-12-31'],
          },
          {
            code: 'REFUND_RULE',
            codeDesc: '退改规则',
            textList: ['未预约可全额退款', '已预约不可退'],
          },
        ],
      })
      const repo = new PresaleProductRepository(fake)
      const result = await repo.getProductNotice({ skuId: 's1' })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data).toHaveLength(2)
      expect(result.data[0]?.code).toBe('RESERVATION_VALIDITY')
      expect(result.data[1]?.textList[1]).toBe('已预约不可退')
      expect(fake.getProductNotice).toHaveBeenCalledWith({ skuId: 's1', orderBaseId: undefined })
    })
  })

  describe('PresaleHotelRepository', () => {
    it('maps exchange hotel page and detail', async () => {
      const fake = makeFake()
      fake.searchExchangeHotels.mockResolvedValue({
        data: {
          productId: 'p1',
          skuId: 's1',
          pageNum: 1,
          pageSize: 10,
          total: 1,
          hotels: [
            {
              resourceId: 'r1',
              hotelId: 'h1',
              hotelName: '亚朵',
              starRate: 4,
              rooms: [],
            },
          ],
        },
      })
      fake.getExchangeHotelRooms.mockResolvedValue({
        data: {
          productId: 'p1',
          skuId: 's1',
          hotelId: 'h1',
          hotelName: '亚朵',
          nights: 1,
          roomCount: 1,
          splittable: false,
          rooms: [],
        },
      })

      const repo = new PresaleHotelRepository(fake)
      const [page, detail] = await Promise.all([
        repo.searchExchangeHotels({ productId: 'p1', page: 1, pageSize: 10 }),
        repo.getExchangeHotelRooms({ productId: 'p1', resourceId: 'r1' }),
      ])

      expect(page.isSuccess && page.data.hotels[0]?.hotelName).toBe('亚朵')
      expect(detail.isSuccess && detail.data.hotelId).toBe('h1')
    })
  })

  describe('PresaleOrderRepository', () => {
    it('maps order list into PageResult', async () => {
      const fake = makeFake()
      fake.getOrderList.mockResolvedValue({
        data: {
          list: [
            {
              orderBaseId: 'o1',
              productId: 'p1',
              productName: '套餐 A',
              presaleStatus: 30,
              quantity: 2,
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        },
      })
      const repo = new PresaleOrderRepository(fake)
      const result = await repo.getList({ page: 1, pageSize: 10 })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.list[0]?.status).toBe('booked')
    })

    it('creates order and maps response', async () => {
      const fake = makeFake()
      fake.createOrder.mockResolvedValue({
        data: {
          orderBaseId: 'o-new',
          payExpireTime: '2026-08-01T10:00:00Z',
          totalAmount: 399,
          originalAmount: 599,
          productName: '套餐 A',
          presaleOrderStatus: 0,
        },
      })
      const repo = new PresaleOrderRepository(fake)
      const result = await repo.create({
        phoneNumber: '13800000000',
        orderSource: 1,
        skuId: 's1',
        quantity: 1,
        price: { amountInCents: 39900, currency: 'CNY' },
        totalAmount: { amountInCents: 39900, currency: 'CNY' },
        contactName: '张三',
        contactPhone: '13800000000',
        subOrderType: '0',
      })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.totalAmount.amountInCents).toBe(39900)
    })

    it('cancels an order', async () => {
      const fake = makeFake()
      fake.cancelOrder.mockResolvedValue({ data: undefined })
      const repo = new PresaleOrderRepository(fake)
      const result = await repo.cancel('o1')
      expect(result.isSuccess).toBe(true)
    })

    it('applies a presale-order refund', async () => {
      const fake = makeFake()
      fake.applyOrderRefund.mockResolvedValue({ data: undefined })
      const repo = new PresaleOrderRepository(fake)
      const result = await repo.refundApply({
        orderBaseId: 'o1',
        reason: '不想要了',
        quantity: 1,
        remark: '测试',
      })
      expect(result.isSuccess).toBe(true)
      expect(fake.applyOrderRefund).toHaveBeenCalledWith({
        orderBaseId: 'o1',
        reason: '不想要了',
        quantity: 1,
        remark: '测试',
      })
    })

    it('wraps refundApply errors into DomainError', async () => {
      const fake = makeFake()
      fake.applyOrderRefund.mockRejectedValue(
        Object.assign(new Error('refund-failed'), { code: 'HTTP_500' }),
      )
      const repo = new PresaleOrderRepository(fake)
      const result = await repo.refundApply({
        orderBaseId: 'o1',
        reason: '不想要了',
        quantity: 1,
      })
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error.code).toBe('HTTP_500')
        expect(result.error.message).toBe('refund-failed')
      }
    })
  })

  describe('PresaleAppointmentRepository', () => {
    it('maps reservation calendar (no salePrice)', async () => {
      const fake = makeFake()
      fake.getReservationProductCalendar.mockResolvedValue({
        data: {
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
              available: true,
              stockMode: 0,
            },
          ],
        },
      })
      const repo = new PresaleAppointmentRepository(fake)
      const result = await repo.getReservationProductCalendar({
        preSaleOrderBaseId: 'p1',
      })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      const day = result.data.calendarDays[0]
      expect(day).toBeDefined()
      expect(day?.date).toBe('2026-08-01')
    })

    it('maps reservation order detail', async () => {
      const fake = makeFake()
      fake.getReservationOrderDetail.mockResolvedValue({
        data: {
          reservationStatus: 20,
          orderBaseId: 'r1',
          hotelName: '亚朵',
          hotelAddress: '人民广场',
          checkInDate: '2026-08-01',
          checkOutDate: '2026-08-02',
          nightQuantity: 1,
          roomName: '大床房',
          contactPhone: '13800000000',
        },
      })
      const repo = new PresaleAppointmentRepository(fake)
      const result = await repo.getReservationOrderDetail('r1')
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.status).toBe('success')
    })

    it('cancels a reservation order', async () => {
      const fake = makeFake()
      fake.cancelReservationOrder.mockResolvedValue({ data: undefined })
      const repo = new PresaleAppointmentRepository(fake)
      const result = await repo.cancel('r1')
      expect(result.isSuccess).toBe(true)
      expect(fake.cancelReservationOrder).toHaveBeenCalledWith('r1')
    })
  })

  describe('PresaleInventoryRepository', () => {
    it('maps inventory day list', async () => {
      const fake = makeFake()
      fake.getInventoryCalendar.mockResolvedValue({
        data: [
          { date: '2026-08-01', status: 'bookable', bookedCount: 2, remainingStock: 5 },
        ],
      })
      const repo = new PresaleInventoryRepository(fake)
      const result = await repo.getCalendar({
        productId: 'p1',
        startDate: '2026-08-01',
        endDate: '2026-08-31',
      })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data[0]?.remainingStock).toBe(5)
    })
  })

  describe('PresalePassengerRepository', () => {
    it('maps passenger list / save / delete', async () => {
      const fake = makeFake()
      fake.getPassengerList.mockResolvedValue({
        data: [
          { id: 1, passengerName: '张三', identityType: 'ID', identityNo: '110101' },
        ],
      })
      fake.savePassenger.mockResolvedValue({
        data: { id: 2, passengerName: '李四' },
      })
      fake.deletePassenger.mockResolvedValue({ data: undefined })

      const repo = new PresalePassengerRepository(fake)
      const [list, saved, deleted] = await Promise.all([
        repo.getList(),
        repo.save({ passengerName: '李四' }),
        repo.delete('1'),
      ])

      expect(list.isSuccess && list.data[0]?.passengerName).toBe('张三')
      expect(saved.isSuccess && saved.data.passengerName).toBe('李四')
      expect(deleted.isSuccess).toBe(true)
    })
  })

  describe('PresaleRefundRepository', () => {
    it('maps refund apply → detail by re-fetching', async () => {
      const fake = makeFake()
      fake.applyRefund.mockResolvedValue({ data: { id: 'rf1' } })
      fake.getRefundDetail.mockResolvedValue({
        data: {
          id: 'rf1',
          preOrderId: 'o1',
          refundNo: 'R001',
          quantity: 1,
          paidAmount: 399,
          refundableAmount: 399,
          actualRefundAmount: 399,
          status: 'pending_audit',
          reason: '不想要了',
          refundWay: 'system',
          createdAt: '2026-07-23T10:00:00Z',
          operationLogs: [],
        },
      })

      const repo = new PresaleRefundRepository(fake)
      const result = await repo.apply({
        preOrderId: 'o1',
        quantity: 1,
        reason: '不想要了',
      })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.id).toBe('rf1')
      expect(result.data.reason).toBe('不想要了')
      expect(fake.applyRefund).toHaveBeenCalledOnce()
      expect(fake.getRefundDetail).toHaveBeenCalledWith('rf1')
    })

    it('returns a placeholder refund when apply response has no id', async () => {
      const fake = makeFake()
      fake.applyRefund.mockResolvedValue({ data: { id: '' } })

      const repo = new PresaleRefundRepository(fake)
      const result = await repo.apply({
        preOrderId: 'o1',
        quantity: 1,
        reason: '不想要了',
      })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data.id).toBe('')
      expect(result.data.status).toBe('pending_audit')
      expect(fake.getRefundDetail).not.toHaveBeenCalled()
    })

    it('maps list-by-order', async () => {
      const fake = makeFake()
      fake.getRefundListByOrder.mockResolvedValue({
        data: [
          {
            id: 'rf1',
            status: 'success',
            quantity: 1,
            paidAmount: 399,
            createdAt: '2026-07-23T10:00:00Z',
            operationLogs: [],
          },
        ],
      })
      const repo = new PresaleRefundRepository(fake)
      const result = await repo.getListByOrder('o1')
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data[0]?.id).toBe('rf1')
    })

    it('maps unified order-refund list with amount conversion', async () => {
      const fake = makeFake()
      fake.getOrderRefundList.mockResolvedValue({
        data: [
          {
            orderBaseId: 'o1',
            refundRecordId: 'rf1',
            redundAmount: 399,
            orderType: 6,
            refundStatus: 40,
            reason: '不想要了',
          },
        ],
      })
      const repo = new PresaleRefundRepository(fake)
      const result = await repo.getOrderRefundList({ orderBaseId: 'o1', orderType: 6 })
      expect(result.isSuccess).toBe(true)
      if (!result.isSuccess) return
      expect(result.data[0]?.amount.amountInCents).toBe(39900)
      expect(result.data[0]?.status).toBe('success')
      expect(result.data[0]?.orderType).toBe(6)
      expect(result.data[0]?.reason).toBe('不想要了')
    })

    it('wraps getOrderRefundList errors into DomainError', async () => {
      const fake = makeFake()
      fake.getOrderRefundList.mockRejectedValue(
        Object.assign(new Error('boom'), { code: 'HTTP_500' }),
      )
      const repo = new PresaleRefundRepository(fake)
      const result = await repo.getOrderRefundList({ orderBaseId: 'o1', orderType: 6 })
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error.code).toBe('HTTP_500')
      }
    })
  })

  describe('error mapping', () => {
    it('wraps thrown errors into DomainError via the Err branch', async () => {
      const fake = makeFake()
      fake.getProductList.mockRejectedValue(
        Object.assign(new Error('boom'), { code: 'HTTP_500' }),
      )
      const repo = new PresaleProductRepository(fake)
      const result = await repo.getList({ page: 1, pageSize: 10 })
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error.code).toBe('HTTP_500')
        expect(result.error.message).toBe('boom')
      }
    })
  })
})