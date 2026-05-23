import { useState, useMemo } from '@lynx-js/react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router'
import { NavBar } from '../../components/NavBar'
import { mockTrainList } from './mockData'
import type { TrainInfo, SortType } from './types'
import './index.scss'

const dateList = [
  { label: '今天', date: '05-23', isActive: true },
  { label: '明天', date: '24', isActive: false },
  { label: '后天', date: '25', isActive: false },
  { label: '周二', date: '26', isActive: false },
  { label: '周三', date: '27', isActive: false },
  { label: '周四', date: '28', isActive: false },
  { label: '周五', date: '29', isActive: false },
  { label: '周六', date: '30', isActive: false },
  { label: '周日', date: '31', isActive: false },
  { label: '周一', date: '06-01', isActive: false },
  { label: '周二', date: '02', isActive: false },
  { label: '周三', date: '03', isActive: false },
]

const filterTags = [
  { label: '北京南出发', key: 'depStation' },
  { label: '上海虹桥到达', key: 'arrStation' },
  { label: '仅看有票', key: 'onlyTicket' },
  { label: '高铁动车', key: 'highSpeed' },
  { label: '复兴号', key: 'fxh' },
  { label: '有静音车厢', key: 'quiet' },
]

function formatSeatStatus(seat: { seatName: string; seatCnt: number }) {
  if (seat.seatName === '无座') {
    return seat.seatCnt > 0 ? '有票' : '无票'
  }
  if (seat.seatCnt === 0) {
    return '无票'
  }
  if (seat.seatCnt <= 20) {
    return `${seat.seatCnt}张`
  }
  return '有票'
}

function getSeatClass(status: string) {
  if (status === '无票') return 'seat-no-ticket'
  return 'seat-has-ticket'
}

function getDisplaySeats(train: TrainInfo) {
  const priorityOrder = ['二等座', '二等', '一等座', '一等', '优选一等座', '优选一等', '商务座', '商务', '硬座', '硬卧', '软卧', '二等卧', '一等卧', '无座']
  const sorted = [...train.seatDetails].sort((a, b) => {
    const idxA = priorityOrder.findIndex(p => a.seatName.includes(p))
    const idxB = priorityOrder.findIndex(p => b.seatName.includes(p))
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB)
  })
  return sorted.slice(0, 4)
}

export function TrainList() {
  const navigate = useNavigate()
  const [activeDateIndex, setActiveDateIndex] = useState(0)
  const [sortType, setSortType] = useState<SortType>('depart')
  const [filters, setFilters] = useState<Record<string, boolean>>({
    depStation: false,
    arrStation: false,
    onlyTicket: false,
    highSpeed: false,
    fxh: false,
    quiet: false,
  })

  const sortedTrains = useMemo(() => {
    let list = [...mockTrainList]

    if (filters.onlyTicket) {
      list = list.filter(t => t.seatDetails.some(s => s.seatCnt > 0))
    }
    if (filters.highSpeed) {
      list = list.filter(t => t.isHigh === '1')
    }
    if (filters.fxh) {
      list = list.filter(t => t.isFxh === '1')
    }
    if (filters.quiet) {
      list = list.filter(t => t.isQuietCoach === '1')
    }

    switch (sortType) {
      case 'depart':
        list.sort((a, b) => a.fromTime.localeCompare(b.fromTime))
        break
      case 'duration':
        list.sort((a, b) => {
          const parseDur = (d: string) => {
            const match = d.match(/(\d+)时(\d+)分/)
            return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0
          }
          return parseDur(a.duration) - parseDur(b.duration)
        })
        break
      case 'price':
        list.sort((a, b) => a.minPrice - b.minPrice)
        break
    }
    return list
  }, [sortType, filters])

  const toggleFilter = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <view className="page-train-list">
      <NavBar title="北京 ⇄ 上海" />

      {/* Date Selector */}
      <scroll-view className="date-selector" scroll-orientation="horizontal" show-scroll-bar={false}>
        {dateList.map((item, index) => (
          <view
            key={index}
            className={clsx('date-item', index === activeDateIndex && 'date-item-active')}
            bindtap={() => setActiveDateIndex(index)}
          >
            <text className="date-label">{item.label}</text>
            <text className={clsx('date-date', index === activeDateIndex && 'date-date-active')}>
              {item.date}
            </text>
          </view>
        ))}
        <view className="date-item date-picker">
          <text className="date-label">选择</text>
          <text className="date-date">日期</text>
        </view>
      </scroll-view>

      {/* Filter Tags */}
      <scroll-view className="filter-bar" scroll-orientation="horizontal" show-scroll-bar={false}>
        {filterTags.map((tag) => (
          <view
            key={tag.key}
            className={clsx('filter-tag', filters[tag.key] && 'filter-tag-active')}
            bindtap={() => toggleFilter(tag.key)}
          >
            <text className="filter-tag-text">{tag.label}</text>
          </view>
        ))}
      </scroll-view>

      {/* Train List */}
      <scroll-view className="train-list" scroll-orientation="vertical" show-scroll-bar={false}>
        {sortedTrains.map((train) => (
          <view key={train.trainNo} className="train-card">
            {/* Main Info Row */}
            <view className="train-main">
              <view className="train-time-col">
                <text className="train-time">{train.fromTime}</text>
                <text className="train-station">{train.fromStation}</text>
              </view>
              <view className="train-middle">
                <text className="train-duration">{train.duration}</text>
                <view className="train-arrow" />
                <view className="train-tags">
                  {train.isQuietCoach === '1' && <text className="train-tag train-tag-quiet">静</text>}
                  {train.isFxh === '1' && <text className="train-tag">复兴号</text>}
                  {train.isZndcz === '1' && <text className="train-tag">智能动车</text>}
                </view>
                <text className="train-no">{train.trainNo}</text>
              </view>
              <view className="train-time-col train-time-right">
                <view className="train-arrival-row">
                  <text className="train-time">{train.toTime}</text>
                  {train.intervalDay > 0 && <text className="train-next-day">+{train.intervalDay}</text>}
                </view>
                <text className="train-station">{train.toStation}</text>
              </view>
              <view className="train-price-col">
                <text className="train-price">
                  <text className="train-price-symbol">¥</text>
                  {train.minPrice}
                </text>
                {train.discount && <text className="train-discount">{train.discount}折</text>}
              </view>
            </view>

            {/* Seat Info Row */}
            <view className="train-seats">
              {getDisplaySeats(train).map((seat) => {
                const status = formatSeatStatus(seat)
                return (
                  <view key={seat.seatName} className="seat-item">
                    <text className="seat-name">{seat.seatName.replace('座', '').replace('卧', '')}</text>
                    <text className={clsx('seat-status', getSeatClass(status))}>{status}</text>
                  </view>
                )
              })}
            </view>
          </view>
        ))}
      </scroll-view>

      {/* Bottom Sort Bar */}
      <view className="sort-bar">
        <view className="sort-item" bindtap={() => { /* filter modal */ }}>
          <text className="sort-icon">筛选</text>
          <text className="sort-label">筛选</text>
        </view>
        <view
          className={clsx('sort-item', sortType === 'depart' && 'sort-item-active')}
          bindtap={() => setSortType('depart')}
        >
          <text className="sort-icon">出发</text>
          <text className="sort-label">出发最早</text>
        </view>
        <view
          className={clsx('sort-item', sortType === 'duration' && 'sort-item-active')}
          bindtap={() => setSortType('duration')}
        >
          <text className="sort-icon">耗时</text>
          <text className="sort-label">耗时最短</text>
        </view>
        <view
          className={clsx('sort-item', sortType === 'price' && 'sort-item-active')}
          bindtap={() => setSortType('price')}
        >
          <text className="sort-icon">价格</text>
          <text className="sort-label">价格最低</text>
        </view>
      </view>
    </view>
  )
}
