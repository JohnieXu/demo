import { useNavigate } from 'react-router'
import { useFlightStore } from '../../store'

export function Booking() {
  const { selectedFlight, searchParams } = useFlightStore()
  const navigate = useNavigate()

  const handleConfirm = () => {
    const id = 'NEW_ORDER_123'
    navigate(`/order/${id}`)
  }

  if (!selectedFlight) {
    return (
      <view className="booking-section">
        <text className="booking-empty">请先选择航班</text>
        <text>返回首页</text>
      </view>
    )
  }

  return (
    <>
      <view className="background-layer" />

      {/* Header */}
      <view className="booking-header">
        <text className="booking-title">确认订单</text>
      </view>

      {/* Flight Info */}
      <view className="booking-section">
        <view className="booking-card">
          <view className="flight-detail-row">
            <text className="flight-detail-label">航班</text>
            <text className="flight-detail-value">{selectedFlight.airline}</text>
          </view>
          <view className="flight-detail-row">
            <text className="flight-detail-label">时间</text>
            <text className="flight-detail-value">
              {selectedFlight.departureTime} - {selectedFlight.arrivalTime}
            </text>
          </view>
          <view className="flight-detail-row">
            <text className="flight-detail-label">日期</text>
            <text className="flight-detail-value">
              {searchParams.date} {searchParams.weekday}
            </text>
          </view>
          <view className="flight-detail-row">
            <text className="flight-detail-label">舱位</text>
            <text className="flight-detail-value">
              {searchParams.cabin === 'nolimit' ? '无舱位' : '公务/头等舱'}
            </text>
          </view>
          <view className="flight-detail-row">
            <text className="flight-detail-label">价格</text>
            <text className="flight-detail-price">¥{selectedFlight.price}</text>
          </view>
        </view>
      </view>

      {/* Confirm Button */}
      <view className="booking-section">
        <view className="confirm-btn" bindtap={handleConfirm}>
          <text className="confirm-btn-text">确认预订</text>
        </view>
      </view>
    </>
  )
}