import { useState } from '@lynx-js/react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router'
import { TabBar } from '../../components/TabBar'
import { RecentSearches } from './components/RecentSearches'
import "./index.scss"
import { Segments } from '../../components/Segments'

type TabType = 'flight' | 'train'

type CabinClass = 'nolimit' | 'business';

export function Query() {
  const [activeTab, setActiveTab] = useState<TabType>('flight');
  const [selectedCabin, setSelectedCabin] = useState<CabinClass>('nolimit');
  const navigate = useNavigate();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCabinChange = (cabin: CabinClass) => {
    setSelectedCabin(cabin);
  };

  const handleSearch = () => {
    console.log('Search flights', {
      cabin: selectedCabin,
    });
    navigate('/booking');
  };

  const handleBottomTabChange = (tab: 'booking' | 'order') => {
    if (tab === 'order') {
      navigate('/orderList');
    }
  };

  return (
    <view className="page-query">
      {/* Background */}
      <view className="background-layer" />

      {/* Tabs */}
      <view className="tabs">
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
          <Segments
            segments={[
              { id: 'nolimit', label: '不限舱位' },
              { id: 'business', label: '公务/头等舱' },
            ]}
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
      </view>

      {/* Bottom tabbar */}
      <TabBar onTabChange={handleBottomTabChange}></TabBar>
    </view>
  );
}
