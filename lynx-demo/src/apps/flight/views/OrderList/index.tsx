/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router'
import { List } from '@lynx-js/lynx-ui'
import { useFlightStore } from '../../store'
import { NavBar } from '../../components/NavBar'
import { useScrollOpacity } from '../../hooks/useScrollOpacity'

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
    {
      id: 'ORDER_003',
      airline: '南航 CZ9012',
      date: '9月8日 周六',
      status: '待出行',
      price: 850,
    },
    {
      id: 'ORDER_004',
      airline: '海航 HU7890',
      date: '9月10日 周一',
      status: '已取消',
      price: 590,
    },
    {
      id: 'ORDER_005',
      airline: '厦航 MF3456',
      date: '9月12日 周三',
      status: '已完成',
      price: 980,
    },
    {
      id: 'ORDER_006',
      airline: '深航 ZH4567',
      date: '9月15日 周六',
      status: '待出行',
      price: 760,
    },
    {
      id: 'ORDER_007',
      airline: '川航 3U8901',
      date: '9月18日 周二',
      status: '已完成',
      price: 1120,
    },
    {
      id: 'ORDER_008',
      airline: '山航 SC2345',
      date: '9月20日 周四',
      status: '待出行',
      price: 650,
    },
    {
      id: 'ORDER_009',
      airline: '国航 CA6789',
      date: '9月22日 周六',
      status: '退款中',
      price: 1380,
    },
    {
      id: 'ORDER_010',
      airline: '东航 MU2345',
      date: '9月25日 周二',
      status: '已完成',
      price: 820,
    },
    {
      id: 'ORDER_011',
      airline: '南航 CZ3456',
      date: '9月28日 周五',
      status: '待出行',
      price: 940,
    },
    {
      id: 'ORDER_012',
      airline: '海航 HU5678',
      date: '10月1日 周一',
      status: '已完成',
      price: 1560,
    },
    {
      id: 'ORDER_013',
      airline: '厦航 MF6789',
      date: '10月3日 周三',
      status: '待出行',
      price: 720,
    },
    {
      id: 'ORDER_014',
      airline: '深航 ZH7890',
      date: '10月5日 周五',
      status: '已取消',
      price: 480,
    },
    {
      id: 'ORDER_015',
      airline: '川航 3U1234',
      date: '10月8日 周一',
      status: '待出行',
      price: 1080,
    },
    {
      id: 'ORDER_016',
      airline: '山航 SC3456',
      date: '10月10日 周三',
      status: '退款中',
      price: 690,
    },
    {
      id: 'ORDER_017',
      airline: '国航 CA8901',
      date: '10月12日 周五',
      status: '已完成',
      price: 1240,
    },
    {
      id: 'ORDER_018',
      airline: '东航 MU4567',
      date: '10月15日 周一',
      status: '待出行',
      price: 880,
    },
    {
      id: 'ORDER_019',
      airline: '南航 CZ5678',
      date: '10月18日 周四',
      status: '已完成',
      price: 1420,
    },
    {
      id: 'ORDER_020',
      airline: '海航 HU6789',
      date: '10月20日 周六',
      status: '待出行',
      price: 960,
    },
    {
      id: 'ORDER_021',
      airline: '厦航 MF8901',
      date: '10月22日 周一',
      status: '退款中',
      price: 530,
    },
    {
      id: 'ORDER_022',
      airline: '深航 ZH1234',
      date: '10月25日 周四',
      status: '已完成',
      price: 1180,
    },
    {
      id: 'ORDER_023',
      airline: '川航 3U2345',
      date: '10月28日 周日',
      status: '待出行',
      price: 990,
    },
    {
      id: 'ORDER_024',
      airline: '山航 SC4567',
      date: '10月30日 周二',
      status: '已取消',
      price: 420,
    },
    {
      id: 'ORDER_025',
      airline: '国航 CA3456',
      date: '11月2日 周五',
      status: '已完成',
      price: 1320,
    },
  ]

  // Fade the NavBar background from opaque to transparent as the list scrolls.
  // Below 80px the background is gradually mixed; beyond 80px it stays fully
  // transparent so the page content can show through.
  const { opacity, handleScroll } = useScrollOpacity({ threshold: 100, startOpacity: 0, endOpacity: 1 })

  return (
    <view className="page-order-list">
      {/* 这里可以替换为导航栏背景图 */}
      <view className="page-header-bg" style={{ opacity: Math.max(0, 1 - opacity) }}></view>
      <NavBar title="我的订单" backgroundOpacity={opacity}></NavBar>

      {/* Orders List */}
      <List className="orders-list" listId="order-list" listType="single" scrollOrientation="vertical" spanCount={1} mainAxisGap={12} scrollEventThrottle={0} onScroll={handleScroll}>
        {orders.map((order) => (
          <list-item key={order.id} item-key={order.id} bindtap={() => handleOrderTap(order)}>
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
          </list-item>
        ))}
      </List>

      {/* Empty State */}
      {orders.length === 0 && (
        <view className="orders-empty">
          <text className="orders-empty-text">暂无订单</text>
        </view>
      )}
    </view>
  )
}