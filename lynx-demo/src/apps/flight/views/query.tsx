import { useState } from '@lynx-js/react'
import { useFlightStore } from '../store'
import { TabBar } from '../components/TabBar'
import './query.scss'

type TabType = 'flight' | 'train'

type CabinClass = 'economy' | 'business'

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('flight')
  const [selectedCabin, setSelectedCabin] = useState<CabinClass>('economy')

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  const handleCabinChange = (cabin: CabinClass) => {
    setSelectedCabin(cabin)
  }

  const handleSearch = () => {
    console.log('Search flights', {
      cabin: selectedCabin
    })
  }

  return (
    <view className="flight-container">
      {/* Background */}
      <view className="background-layer" />

      {/* Tabs */}
      <view className="tabs">
        <view className="tab-item" bindtap={() => handleTabChange('flight')}>
          <text className={`tab-text ${activeTab === 'flight' ? 'tab-text-active' : ''}`}>机票</text>
          {activeTab === 'flight' && <view className="tab-indicator" />}
        </view>
        <view className="tab-item" bindtap={() => handleTabChange('train')}>
          <text className={`tab-text ${activeTab === 'train' ? 'tab-text-active' : ''}`}>火车票</text>
          {activeTab === 'train' && <view className="tab-indicator" />}
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
            <view className="date-selection date-selection--start">
              <text className="date-text">8月31日</text>
              <text className="weekday-text">周五</text>
            </view>
            <view className="date-selection date-selection--end">
              <text className="date-text">9月1日</text>
              <text className="weekday-text">周六</text>
            </view>
          </view>

          {/* Cabin Class Selection */}
          <view className="cabin-row">
            <view className="cabin-selector">
              <view
                className={`cabin-btn ${selectedCabin === 'economy' ? 'cabin-btn-active' : ''}`}
                bindtap={() => handleCabinChange('economy')}
              >
                <text className="cabin-text">经济舱</text>
              </view>
              <view
                className={`cabin-btn ${selectedCabin === 'business' ? 'cabin-btn-active' : ''}`}
                bindtap={() => handleCabinChange('business')}
              >
                <text className="cabin-text">公务/头等舱</text>
              </view>
            </view>
          </view>

          {/* Search Button */}
          <view className="search-btn" bindtap={handleSearch}>
            <text className="search-btn-text">查  询</text>
          </view>
        </view>

        {/* Recent Searches */}
        <view className="recent-searches">
          <text className="recent-label recent-label-line1">最近</text>
          <view className="tags-scroll">
            <view className="tag">
              <text className="tag-text tag-text-dark">北京-上海 11月6日</text>
            </view>
            <view className="tag">
              <text className="tag-text tag-text-dark">昆明-杭州 11月6日</text>
            </view>
            <view className="tag">
              <text className="tag-text tag-text-dark">昆明-福州 11月6日</text>
            </view>
          </view>
        </view>
      </view>
      
      {/* Bottom tabbar */}
      <TabBar></TabBar>
    </view>
  )
}

export function Query() {
  const {
    searchParams,
    setSearchParams,
    recentSearches,
    addRecentSearch,
    flightList,
    setFlightList,
    setSelectedFlight,
  } = useFlightStore()

  const handleTabChange = (tab: 'flight' | 'train') => {
    setSearchParams({ tab })
  }

  const handleCabinChange = (cabin: 'economy' | 'business') => {
    setSearchParams({ cabin })
  }

  const handleSearch = () => {
    addRecentSearch({
      departure: searchParams.departure,
      arrival: searchParams.arrival,
      date: searchParams.date,
    })
    setFlightList([
      {
        id: '1',
        airline: '国航 CA1234',
        departureTime: '08:00',
        arrivalTime: '10:30',
        duration: '2h30m',
        price: searchParams.cabin === 'economy' ? 680 : 1280,
      },
      {
        id: '2',
        airline: '东航 MU5678',
        departureTime: '10:30',
        arrivalTime: '13:00',
        duration: '2h30m',
        price: searchParams.cabin === 'economy' ? 720 : 1380,
      },
    ])
  }

  const handleFlightSelect = (flight: (typeof flightList)[0]) => {
    setSelectedFlight(flight)
  }

  return (
    <>
      {/* Background */}
      <view className="background-layer" />

      {/* Tabs */}
      <view className="tabs">
        <view className="tab-item" bindtap={() => handleTabChange('flight')}>
          <text className={`tab-text ${searchParams.tab === 'flight' ? 'tab-text-active' : ''}`}>机票</text>
          {searchParams.tab === 'flight' && <view className="tab-indicator" />}
        </view>
        <view className="tab-item" bindtap={() => handleTabChange('train')}>
          <text className={`tab-text ${searchParams.tab === 'train' ? 'tab-text-active' : ''}`}>火车票</text>
          {searchParams.tab === 'train' && <view className="tab-indicator" />}
        </view>
      </view>

      {/* Booking Card */}
      <view className="booking-section">
        <view className="booking-card">
          {/* City Selection */}
          <view className="city-row">
            <text className="city-text">{searchParams.departure}</text>
            <view className="swap-icon" />
            <text className="city-text">{searchParams.arrival}</text>
          </view>

          {/* Date Selection */}
          <view className="date-row">
            <view className="date-selection date-selection--start">
              <text className="date-text">{searchParams.date}</text>
              <text className="weekday-text">{searchParams.weekday}</text>
            </view>
            <view className="date-selection date-selection--end">
              <text className="date-text">9月1日</text>
              <text className="weekday-text">周六</text>
            </view>
          </view>

          {/* Cabin Class Selection */}
          <view className="cabin-row">
            <view className="cabin-selector">
              <view
                className={`cabin-btn ${searchParams.cabin === 'economy' ? 'cabin-btn-active' : ''}`}
                bindtap={() => handleCabinChange('economy')}
              >
                <text className="cabin-text">经济舱</text>
              </view>
              <view
                className={`cabin-btn ${searchParams.cabin === 'business' ? 'cabin-btn-active' : ''}`}
                bindtap={() => handleCabinChange('business')}
              >
                <text className="cabin-text">公务/头等舱</text>
              </view>
            </view>
          </view>

          {/* Search Button */}
          <view className="search-btn" bindtap={handleSearch}>
            <text className="search-btn-text">查  询</text>
          </view>
        </view>

        {/* Recent Searches */}
        <view className="recent-searches">
          <text className="recent-label recent-label-line1">最近</text>
          <view className="tags-scroll">
            {recentSearches.map((search, index) => (
              <view className="tag" key={index}>
                <text className="tag-text tag-text-dark">
                  {search.departure}-{search.arrival} {search.date}
                </text>
              </view>
            ))}
          </view>
        </view>
      </view>

      {/* Flight List */}
      {flightList.length > 0 && (
        <view className="flight-list">
          {flightList.map((flight) => (
            <view key={flight.id} bindtap={() => handleFlightSelect(flight)}>
              <view className="flight-item">
                <text className="flight-airline">{flight.airline}</text>
                <text className="flight-time">
                  {flight.departureTime} - {flight.arrivalTime}
                </text>
                <text className="flight-price">¥{flight.price}</text>
              </view>
            </view>
          ))}
        </view>
      )}
    </>
  )
}