import { useMemo, useState } from '@lynx-js/react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router'
import { Calendar } from 'lynx-ui'
import { useFlightStore } from '../../store/flightStore'
import { TabBar } from '../../components/TabBar'
import { RecentSearches } from './components/RecentSearches'
import "./index.scss"
import { Segments } from '../../components/Segments'

type TabType = 'flight' | 'train'

type CabinClass = 'nolimit' | 'business';

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function parseDisplayDate(dateText: string): Date {
  const match = dateText.match(/(\d{1,2})月(\d{1,2})日/)
  if (!match) return new Date()

  const month = parseInt(match[1], 10) - 1
  const day = parseInt(match[2], 10)
  const now = new Date()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = now.getFullYear()
  let date = new Date(year, month, day)
  if (date < today) {
    date = new Date(year + 1, month, day)
  }
  return date
}

function formatDisplayDate(date: Date): { dateText: string; weekday: string } {
  return {
    dateText: `${date.getMonth() + 1}月${date.getDate()}日`,
    weekday: WEEKDAYS[date.getDay()],
  }
}

export function Query() {
  const [activeTab, setActiveTab] = useState<TabType>('flight');
  const [selectedCabin, setSelectedCabin] = useState<CabinClass>('nolimit');
  const [showCalendar, setShowCalendar] = useState(false)
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useFlightStore()

  const selectedDate = useMemo(
    () => parseDisplayDate(searchParams.date),
    [searchParams.date],
  )

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCabinChange = (cabin: CabinClass) => {
    setSelectedCabin(cabin);
  };

  const handleSearch = () => {
    if (activeTab === 'train') {
      navigate('/trainList');
    } else {
      navigate('/flightList');
    }
  };

  const handleDateConfirm = (date: Date | Date[]) => {
    const selected = Array.isArray(date) ? date[0] : date
    const { dateText, weekday } = formatDisplayDate(selected)
    setSearchParams({ date: dateText, weekday })
    setShowCalendar(false)
  }

  const handleBottomTabChange = (tab: 'booking' | 'order') => {
    if (tab === 'order') {
      navigate('/orderList');
    }
  };

  return (
    <view className="page-query">
      <scroll-view scroll-orientation="vertical" style={{ height: '100vh' }}>
        {/* Background */}
        <view className="background-layer" />

        {/* Tabs */}
        <view className="tabs">
          <view className="tabs-bg"></view>
          <view className="tab-item" bindtap={() => handleTabChange('flight')}>
            <text
              className={clsx(
                'tab-text',
                activeTab === 'flight' && 'tab-text-active',
              )}
            >
              机票
            </text>
            <view
              className={clsx(
                'tab-indicator',
                activeTab === 'flight' && 'tab-indicator-active',
              )}
            />
          </view>
          <view className="tab-item" bindtap={() => handleTabChange('train')}>
            <text
              className={clsx(
                'tab-text',
                activeTab === 'train' && 'tab-text-active',
              )}
            >
              火车票
            </text>
            <view
              className={clsx(
                'tab-indicator',
                activeTab === 'train' && 'tab-indicator-active',
              )}
            />
          </view>
        </view>

        {/* Booking Card */}
        <view className="booking-section">
          <view className="booking-card">
            {/* City Selection */}
            <view className="city-row">
              <text className="city-text">北京</text>
              <view className="swap-icon" />
              <text className="city-text">上海</text>
            </view>

            {/* Date Selection */}
            <view className="date-row">
              <view
                className="date-selection date-selection--start"
                bindtap={() => {
                  console.log('点击出发出发日期')
                  setShowCalendar(true)
                }}
              >
                <text className="date-text">{searchParams.date}</text>
                <text className="weekday-text">{searchParams.weekday}</text>
              </view>
              <view className="date-selection date-selection--end">
                <text className="date-text">9月1日</text>
                <text className="weekday-text">周六</text>
              </view>
            </view>

            {/* Cabin Class Selection */}
            <Segments
              segments={[
                { id: 'nolimit', label: '不限舱位' },
                { id: 'business', label: '公务/头等舱' },
              ]}
              activeId={selectedCabin}
              onSegmentChange={handleCabinChange}
            ></Segments>

            {/* Search Button */}
            <view className="search-btn" bindtap={handleSearch}>
              <text className="search-btn-text">查 询</text>
            </view>
          </view>

          {/* Recent Searches */}
          <RecentSearches
            items={[
              { text: '北京-上海 11月6日' },
              { text: '昆明-杭州 11月6日' },
              { text: '昆明-福州 11月6日' },
            ]}
          />

          <view className="red-box"></view>
          <view className="w-32 h-auto bg-purple-800">
            <text className="text-lg text-white">Test Tailwindcss</text>
          </view>
        </view>
        <view className="body-gap"></view>
      </scroll-view>

      {/* Bottom tabbar */}
      <TabBar onTabChange={handleBottomTabChange}></TabBar>

      <Calendar
        show={showCalendar}
        poppable
        type="single"
        showConfirm={false}
        defaultDate={selectedDate}
        title="选择出发日期"
        onShowChange={setShowCalendar}
        onConfirm={handleDateConfirm}
      />
    </view>
  );
}
