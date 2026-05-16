import { useParams } from 'react-router'
import { useFlightStore } from '../../store'
import { NavBar } from '../../components/NavBar'

import './index.scss'

export function OrderDetail() {
  const { id } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedFlight, searchParams } = useFlightStore()
  
  // Mock order detail - in real app would fetch by id
  const order = {
    id,
    airline: '国航 CA1234',
    departureTime: '08:00',
    arrivalTime: '10:30',
    date: '8月31日 周五',
    cabin: '经济舱',
    passenger: '张三',
    seat: '12A',
    price: 680,
    status: '已完成',
    bookingNo: 'CA123400123456',
  }

  return (
    <view className="page-order-detail">
      <NavBar title="订单详情"></NavBar>

      {/* Order Info */}
      <view className="detail-section">
        <view className="booking-card">
          <view className="detail-row">
            <text className="detail-label">订单号</text>
            <text className="detail-value">{order.bookingNo}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">航班</text>
            <text className="detail-value">{order.airline}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">时间</text>
            <text className="detail-value">
              {order.departureTime} - {order.arrivalTime}
            </text>
          </view>
          <view className="detail-row">
            <text className="detail-label">日期</text>
            <text className="detail-value">{order.date}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">舱位</text>
            <text className="detail-value">{order.cabin}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">乘客</text>
            <text className="detail-value">{order.passenger}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">座位</text>
            <text className="detail-value">{order.seat}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">状态</text>
            <text className="detail-status">{order.status}</text>
          </view>
          <view className="detail-row detail-row--price">
            <text className="detail-label">总价</text>
            <text className="detail-price">¥{order.price}</text>
          </view>
        </view>
      </view>
    </view>
  )
}