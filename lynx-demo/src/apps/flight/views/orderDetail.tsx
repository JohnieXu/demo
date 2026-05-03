import { useNavigate, useParams } from 'react-router'
import { useFlightStore } from '../store'

import './orderDetail.scss'

export function OrderDetail() {
  const { id } = useParams()
  const { selectedFlight, searchParams } = useFlightStore()
  const navigate = useNavigate()

  function hanndleBackTap() {
    navigate('/order', { replace: true, })
  }
  
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
    <>
      <view className="background-layer" />

      {/* Header */}
      <view className="detail-header">
        <view className="detail-back-btn" bindtap={hanndleBackTap}>
          <text className="detail-back-text">← 返回</text>
        </view>
        <text className="detail-title">订单详情</text>
      </view>

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
    </>
  )
}