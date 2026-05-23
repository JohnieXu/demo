import { useState, useMemo } from '@lynx-js/react'
import { clsx } from 'clsx'
import { NavBar } from '../../components/NavBar'
import { useFlightStore } from '../../store/flightStore'
import { mockFlightList, dateList } from './mockData'
import type { FlightInfo, SortType, FilterKey } from './types'
import './index.scss'

const filterTags = [
  { label: '大兴出发', key: 'depDaxing' as FilterKey },
  { label: '首都出发', key: 'depCapital' as FilterKey },
  { label: '虹桥到达', key: 'arrHongqiao' as FilterKey },
  { label: '浦东到达', key: 'arrPudong' as FilterKey },
  { label: '仅看直飞', key: 'onlyDirect' as FilterKey },
  { label: '大机型', key: 'largeAircraft' as FilterKey },
  { label: '隐藏共享航班', key: 'hideShared' as FilterKey },
  { label: '单成人价格', key: 'singleAdult' as FilterKey },
]

const sortBarItems: { key: SortType; label: string; icon: string }[] = [
  { key: 'direct', label: '优先直飞', icon: '✈' },
  { key: 'time', label: '时间排序', icon: '⏱' },
  { key: 'price', label: '价格排序', icon: '¥' },
]

export function FlightList() {
  const { searchParams } = useFlightStore()

  const [activeDateIndex, setActiveDateIndex] = useState(0)
  const [activeSort, setActiveSort] = useState<SortType>('direct')
  const [filters, setFilters] = useState<Record<FilterKey, boolean>>({
    depDaxing: false,
    depCapital: false,
    arrHongqiao: false,
    arrPudong: false,
    onlyDirect: false,
    largeAircraft: false,
    hideShared: false,
    singleAdult: false,
  })

  const sortedFlights = useMemo(() => {
    let list = [...mockFlightList]

    // Apply filters
    if (filters.depDaxing) {
      list = list.filter((f) => f.departureAirport.includes('大兴'))
    }
    if (filters.depCapital) {
      list = list.filter((f) => f.departureAirport.includes('首都'))
    }
    if (filters.arrHongqiao) {
      list = list.filter((f) => f.arrivalAirport.includes('虹桥'))
    }
    if (filters.arrPudong) {
      list = list.filter((f) => f.arrivalAirport.includes('浦东'))
    }
    if (filters.largeAircraft) {
      list = list.filter((f) => f.aircraftSize === '大')
    }

    // Apply sort
    switch (activeSort) {
      case 'time':
        list.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
        break
      case 'price':
        list.sort((a, b) => a.price - b.price)
        break
      case 'direct':
      default:
        // Keep default order (could be based on recommendation score)
        break
    }

    return list
  }, [activeSort, filters])

  const toggleFilter = (key: FilterKey) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <view className="page-flight-list">
      {/* NavBar */}
      <NavBar title={`${searchParams.departure}-${searchParams.arrival}`} />

      {/* Date Selector */}
      <scroll-view
        className="date-selector"
        scroll-orientation="horizontal"
        show-scroll-bar={false}
      >
        {dateList.map((item, index) => (
          <view
            key={index}
            className={clsx(
              'date-item',
              index === activeDateIndex && 'date-item-active',
            )}
            bindtap={() => setActiveDateIndex(index)}
          >
            <text className="date-item__label">{item.label}</text>
            <text
              className={clsx(
                'date-item__date',
                index === activeDateIndex && 'date-item__date-active',
              )}
            >
              {item.date}
            </text>
          </view>
        ))}
      </scroll-view>

      {/* Filter Tags */}
      <scroll-view
        className="filter-bar"
        scroll-orientation="horizontal"
        show-scroll-bar={false}
      >
        {filterTags.map((tag) => (
          <view
            key={tag.key}
            className={clsx(
              'filter-tag',
              filters[tag.key] && 'filter-tag-active',
            )}
            bindtap={() => toggleFilter(tag.key)}
          >
            <text className="filter-tag__text">{tag.label}</text>
          </view>
        ))}
      </scroll-view>

      {/* Flight List */}
      <scroll-view
        className="flight-list"
        scroll-orientation="vertical"
        show-scroll-bar={false}
      >
        {sortedFlights.map((flight) => (
          <FlightCard key={flight.flightNo} flight={flight} />
        ))}
      </scroll-view>

      {/* Bottom Sort Bar */}
      <view className="sort-bar">
        <view className="sort-bar__item" bindtap={() => { /* open filter modal */ }}>
          <text className="sort-bar__icon">☰</text>
          <text className="sort-bar__label">筛选</text>
        </view>
        {sortBarItems.map((item) => (
          <view
            key={item.key}
            className={clsx(
              'sort-bar__item',
              activeSort === item.key && 'sort-bar__item-active',
            )}
            bindtap={() => setActiveSort(item.key)}
          >
            <text className="sort-bar__icon">{item.icon}</text>
            <text className="sort-bar__label">{item.label}</text>
          </view>
        ))}
      </view>
    </view>
  )
}

function getAirlineColorClass(airline: string): string {
  const map: Record<string, string> = {
    '国航': 'airline-ca',
    '南航': 'airline-cz',
    '东航': 'airline-mu',
    '海航': 'airline-hu',
    '吉祥': 'airline-ho',
    '厦航': 'airline-mf',
  }
  return map[airline] || 'airline-default'
}

function FlightCard({ flight }: { flight: FlightInfo }) {
  const airlineColorClass = getAirlineColorClass(flight.airline)

  return (
    <view className="flight-card">
      <view className="flight-card__main">
        {/* Left: Departure info */}
        <view className="flight-card__departure">
          <text className="flight-card__time">{flight.departureTime}</text>
          <text className="flight-card__airport">{flight.departureAirport}</text>
        </view>

        {/* Center: Duration & arrow */}
        <view className="flight-card__middle">
          <text className="flight-card__duration">{flight.duration}</text>
          <view className="flight-card__arrow" />
        </view>

        {/* Right: Arrival info + Price */}
        <view className="flight-card__right">
          <view className="flight-card__arrival">
            <view className="flight-card__arrival-row">
              <text className="flight-card__time">{flight.arrivalTime}</text>
              {flight.intervalDay > 0 && (
                <text className="flight-card__next-day">+{flight.intervalDay}</text>
              )}
            </view>
            <text className="flight-card__airport">{flight.arrivalAirport}</text>
          </view>

          {/* Price block */}
          <view className="flight-card__price-block">
            <view className="flight-card__price-row">
              <text className="flight-card__price-symbol">¥</text>
              <text className="flight-card__price">{flight.price}</text>
            </view>
            <text className="flight-card__cabin-info">
              {flight.cabinClass}{flight.discount}
            </text>
          </view>
        </view>
      </view>

      {/* Airline info row */}
      <view className="flight-card__airline">
        <view className={`flight-card__airline-dot ${airlineColorClass}`} />
        <text className="flight-card__airline-text">
          {flight.airline}
        </text>
        <text className="flight-card__airline-divider">|</text>
        <text className="flight-card__airline-text">{flight.flightNo}</text>
        <text className="flight-card__airline-divider">|</text>
        <text className="flight-card__airline-text">
          {flight.aircraftType}({flight.aircraftSize})
        </text>
        {flight.mealService && (
          <>
            <text className="flight-card__airline-divider">|</text>
            <text className="flight-card__meal-icon">🍽</text>
          </>
        )}
      </view>
    </view>
  )
}
