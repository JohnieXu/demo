import { useNavigate } from 'react-router'
import { useFlightStore } from '../../store'
import { NavBar } from '../../components/NavBar'

import './index.scss'

export interface Order {
  id: string
  airline: string
  date: string
  status: string
  price: number
}

export function OrderList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedFlight } = useFlightStore()
  const navigate = useNavigate()

  function handleOrderTap(order: Order) {
    navigate(`/orderDetail/${order.id}`)
  }

  // Mock orders
  const orders = [
    {
      id: 'ORDER_001',
      airline: '国航 CA1234',
      date: '8月31日 周五',
      status: '已完成',
      price: 680,
    },
    {
      id: 'ORDER_002',
      airline: '东航 MU5678',
      date: '9月5日 周三',
      status: '待出行',
      price: 720,
    },
  ]

  return (
    <view className="page-order-list">
      <NavBar title="我的订单"></NavBar>

      {/* Orders List */}
      <view className="orders-list">
        {orders.map((order) => (
          <view key={order.id} bindtap={() => handleOrderTap(order)}>
            <view className="order-item">
              <view className="order-info">
                <text className="order-airline">{order.airline}</text>
                <text className="order-date">{order.date}</text>
              </view>
              <view className="order-status-row">
                <text className={`order-status order-status--${order.status}`}>{order.status}</text>
                <text className="order-price">¥{order.price}</text>
              </view>
            </view>
          </view>
        ))}
      </view>

      {/* Empty State */}
      {orders.length === 0 && (
        <view className="orders-empty">
          <text className="orders-empty-text">暂无订单</text>
        </view>
      )}
    </view>
  )
}