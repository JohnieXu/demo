import { useState } from '@lynx-js/react'
import './flight.scss'

type TabType = 'flight' | 'train'

type CityInfo = {
  departure: string
  arrival: string
}

type DateInfo = {
  date: string
  weekday: string
}

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

      {/* Bottom Tab Bar */}
      <view className="bottom-tab-bar">
        <view className="bottom-content">
          <view className="bottom-tab">
            <text className="bottom-tab-icon bottom-icon-booking" />
            <text className="bottom-tab-label booking-label">预订</text>
          </view>
          <view className="bottom-tab">
            <text className="bottom-tab-icon bottom-icon-order" />
            <text className="bottom-tab-label order-label">订单</text>
          </view>
        </view>
      </view>
    </view>
  )
}
