import { useNavigate } from "react-router"

export function TabBar() {
  const navigate = useNavigate()
  return (
    <view className="bottom-tab-bar">
      <view className="bottom-content">
        <view className="bottom-tab" bindtap={() => navigate('/')}>
          <text className="bottom-tab-icon bottom-icon-booking" />
          <text className="bottom-tab-label booking-label">首页</text>
        </view>
        <view className="bottom-tab" bindtap={() => navigate('/order')}>
          <text className="bottom-tab-icon bottom-icon-order" />
          <text className="bottom-tab-label order-label">订单</text>
        </view>
      </view>
    </view>
  )
}