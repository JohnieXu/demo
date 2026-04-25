import { useState } from '@lynx-js/react'
import type { CSSProperties } from '@lynx-js/types'
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

  const tabsStyle: CSSProperties = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '44px',
  }

  const tabItemStyle: CSSProperties = {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  }

  const tabTextStyle = (isActive: boolean): CSSProperties => ({
    fontSize: '18px',
    color: isActive ? '#333' : '#666',
  })

  const indicatorStyle: CSSProperties = {
    height: '4px',
    width: '40px',
    backgroundColor: '#ff5712',
    marginTop: '4px',
  }

  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    paddingTop: '16px',
    paddingBottom: '24px',
    paddingLeft: '16px',
    paddingRight: '16px',
  }

  const rowStyle: CSSProperties = {
    borderBottomWidth: '0.5px',
    borderBottomColor: '#e7e7e7',
    borderStyle: 'solid',
    height: '64px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  }

  const cityTextStyle: CSSProperties = {
    fontSize: '24px',
    color: '#333',
  }

  const cabinSelectorStyle: CSSProperties = {
    backgroundColor: '#ececec',
    height: '34px',
    borderRadius: '4px',
    flexDirection: 'row',
    padding: '4px',
  }

  const cabinButtonStyle = (isSelected: boolean): CSSProperties => ({
    height: '26px',
    borderRadius: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isSelected ? 'white' : 'transparent',
    // shadowColor: isSelected ? 'rgba(0,0,0,0.05)' : 'transparent',
    // shadowOffsetY: isSelected ? '4px' : '0px',
    // shadowRadius: isSelected ? '4px' : '0px',
    flex: 1,
  })

  const cabinTextStyle: CSSProperties = {
    fontSize: '14px',
    color: '#333',
  }

  const searchButtonStyle: CSSProperties = {
    backgroundColor: '#ff5712',
    borderRadius: '6px',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '16px',
  }

  const recentSearchStyle: CSSProperties = {
    backgroundColor: 'white',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    height: '56px',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
  }

  const tagStyle: CSSProperties = {
    backgroundColor: '#f7f7f7',
    height: '32px',
    borderRadius: '4px',
    padding: '4px 8px',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const tagTextStyle: CSSProperties = {
    fontSize: '12px',
    color: '#666',
  }

  const dateRowStyle: CSSProperties = {
    borderBottomWidth: '0.5px',
    borderBottomColor: '#e7e7e7',
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '16px',
    paddingBottom: '16px',
    gap: '40px',
  }

  const cabinRowStyle: CSSProperties = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px',
  }

  const tagContainerStyle: CSSProperties = {
    flexDirection: 'row',
    gap: '8px',
    flex: 1,
  }

  return (
    <view className="flight-container">
      {/* Background */}
      <view className="background" />

      {/* Header Navigation */}
      <view className="nav-bar">
        <view className="nav-back" />
      </view>

      {/* Tabs */}
      <view style={tabsStyle}>
        <view style={tabItemStyle}>
          <text style={tabTextStyle(true)}>机票</text>
          <view style={indicatorStyle} />
        </view>
        <view style={tabItemStyle} bindtap={() => handleTabChange('train')}>
          <text style={tabTextStyle(false)}>火车票</text>
        </view>
      </view>

      {/* Booking Card */}
      <view className="booking-section">
        <view style={cardStyle}>
          {/* City Selection */}
          <view style={rowStyle}>
            <text style={cityTextStyle}>北京</text>
            <view className="swap-icon" />
            <text style={cityTextStyle}>上海</text>
          </view>

          {/* Date Selection */}
          <view style={dateRowStyle}>
            <view className="date-selection">
              <text className="date-text">8月31日</text>
              <text className="weekday-text">周五</text>
            </view>
          </view>

          {/* Cabin Class Selection */}
          <view style={cabinRowStyle}>
            <view style={cabinSelectorStyle}>
              <view
                style={cabinButtonStyle(selectedCabin === 'economy')}
                bindtap={() => handleCabinChange('economy')}
              >
                <text style={cabinTextStyle}>经济舱</text>
              </view>
              <view
                style={cabinButtonStyle(selectedCabin === 'business')}
                bindtap={() => handleCabinChange('business')}
              >
                <text style={cabinTextStyle}>公务/头等舱</text>
              </view>
            </view>
          </view>

          {/* Search Button */}
          <view style={searchButtonStyle} bindtap={handleSearch}>
            <text style={{color: 'white', fontSize: '16px'}}>查  询</text>
          </view>
        </view>

        {/* Recent Searches */}
        <view style={recentSearchStyle}>
          <text className="recent-label">最近</text>
          <view style={tagContainerStyle}>
            <view style={tagStyle}>
              <text style={tagTextStyle}>北京-上海 11月6日</text>
            </view>
            <view style={tagStyle}>
              <text style={tagTextStyle}>昆明-杭州 11月6日</text>
            </view>
            <view style={tagStyle}>
              <text style={tagTextStyle}>昆明-福州 11月6日</text>
            </view>
          </view>
        </view>
      </view>

      {/* Bottom Tab Bar */}
      <view className="bottom-tab-bar">
        <view style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: '12px'}}>
          <view style={{alignItems: 'center'}}>
            <text className="tab-icon booking-icon" />
            <text className="tab-label booking-label">预订</text>
          </view>
          <view style={{alignItems: 'center'}}>
            <text className="tab-icon order-icon" />
            <text className="tab-label order-label">订单</text>
          </view>
        </view>
        <view className="home-indicator" />
      </view>
    </view>
  )
}
