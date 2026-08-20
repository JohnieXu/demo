import { useNavigate } from 'react-router'
import { useFlightStore } from '../../store'
import { useRequireAuth } from '../../../travel-auth/public'
import { FocusableInput } from '../../components/input/FocusableInput'
import { QUERY_CABIN_CLASS } from '../../constants'
import { formatDateDisplay } from '../../utils/date'
import "./index.scss"

export function Booking() {
  const { selectedFlight, searchParams } = useFlightStore()
  const navigate = useNavigate()
  const { requireAuth } = useRequireAuth()

  const departureDisplay = formatDateDisplay(searchParams.departureDate)
  const cabinLabel = searchParams.cabin === QUERY_CABIN_CLASS.NoLimit ? '无舱位' : '公务/头等舱'

  const handleConfirm = () => {
    // Booking requires a session; redirects to /login (and back) otherwise.
    if (!requireAuth()) return
    const id = 'NEW_ORDER_123'
    navigate(`/order/${id}`)
  }

  if (!selectedFlight) {
    return (
      <view className="booking-section">
        <view>
          <FocusableInput
            placeholder="请输入日期"
            value={departureDisplay.dateText}
            autofocus
          />
        </view>
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

      <view>
        <FocusableInput
          placeholder="请输入日期"
          value={departureDisplay.dateText}
          autofocus
        />
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
              {departureDisplay.dateText} {departureDisplay.weekday}
            </text>
          </view>
          <view className="flight-detail-row">
            <text className="flight-detail-label">舱位</text>
            <text className="flight-detail-value">{cabinLabel}</text>
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