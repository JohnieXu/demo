import { useMemo, useState } from '@lynx-js/react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router'
import { Calendar } from 'lynx-ui'
import { useFlightStore } from '../../store/flightStore'
import { TabBar } from '../../components/TabBar'
import { RecentSearches } from './components/RecentSearches'
import './index.scss'
import { Segments } from '../../components/Segments'
import { TAB_TYPE, QUERY_CABIN_CLASS } from '../../constants'
import { formatDateDisplay, formatYyyyMmDd, parseYyyyMmDd } from '../../utils/date'
import type { TabType, QueryCabinClass } from '../../constants'

export function Query() {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useFlightStore();
  const [activeTab, setActiveTab] = useState<TabType>(searchParams.tab);
  // const [selectedCabin, setSelectedCabin] = useState<QueryCabinClass>(searchParams.cabin);
  const [showCalendar, setShowCalendar] = useState(false);

  const departureDisplay = useMemo(
    () => formatDateDisplay(searchParams.departureDate),
    [searchParams.departureDate],
  );

  const arrivalDisplay = useMemo(
    () => formatDateDisplay(searchParams.arrivalDate),
    [searchParams.arrivalDate],
  );

  const selectedDate = useMemo(
    () => parseYyyyMmDd(searchParams.departureDate).toDate(),
    [searchParams.departureDate],
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleCabinChange = (cabin: QueryCabinClass) => {
    // setSelectedCabin(cabin);
    setSearchParams({ cabin });
  };

  const handleSearch = () => {
    if (activeTab === TAB_TYPE.Train) {
      navigate('/trainList');
    } else {
      navigate('/flightList');
    }
  };

  const handleDateConfirm = (date: Date | Date[]) => {
    const selected = Array.isArray(date) ? date[0] : date;
    setSearchParams({ departureDate: formatYyyyMmDd(selected) });
    setShowCalendar(false);
  };

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
          <view
            className="tab-item"
            bindtap={() => handleTabChange(TAB_TYPE.Flight)}
          >
            <text
              className={clsx(
                'tab-text',
                activeTab === TAB_TYPE.Flight && 'tab-text-active',
              )}
            >
              机票
            </text>
            <view
              className={clsx(
                'tab-indicator',
                activeTab === TAB_TYPE.Flight && 'tab-indicator-active',
              )}
            />
          </view>
          <view
            className="tab-item"
            bindtap={() => handleTabChange(TAB_TYPE.Train)}
          >
            <text
              className={clsx(
                'tab-text',
                activeTab === TAB_TYPE.Train && 'tab-text-active',
              )}
            >
              火车票
            </text>
            <view
              className={clsx(
                'tab-indicator',
                activeTab === TAB_TYPE.Train && 'tab-indicator-active',
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
                  console.log('点击出发出发日期');
                  setShowCalendar(true);
                }}
              >
                <text className="date-text">{departureDisplay.dateText}</text>
                <text className="weekday-text">{departureDisplay.weekday}</text>
              </view>
              <view className="date-selection date-selection--end">
                <text className="date-text">{arrivalDisplay.dateText}</text>
                <text className="weekday-text">{arrivalDisplay.weekday}</text>
              </view>
            </view>

            {/* Cabin Class Selection */}
            <Segments
              segments={[
                { id: QUERY_CABIN_CLASS.NoLimit, label: '不限舱位' },
                { id: QUERY_CABIN_CLASS.Business, label: '公务/头等舱' },
              ]}
              activeId={searchParams.cabin}
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
