import { useState, useEffect, useCallback, useRef } from '@lynx-js/react'
import type { NodesRef } from '@lynx-js/types'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router'
import { NavBar } from '../../components/NavBar'
import { useFlightStore } from '../../store/flightStore'
import { useFlightList } from './hooks/useFlightList'
import { useFlightFilter } from './hooks/useFlightFilter'
import { useSortBarScroll } from './hooks/useSortBarScroll'
import { DateSelector } from './components/DateSelector'
import { FilterTags } from './components/FilterTags'
import { FlightCard } from './components/FlightCard'
import { FlightSkeleton } from './components/FlightSkeleton'
import { EmptyState } from './components/EmptyState'
import { SortBar } from './components/SortBar'
import { FilterPopup } from './components/FilterPopup'
import { PassengerPopup } from './components/PassengerPopup'
import type { Flight, SortType } from 'travel-domain'
import type { FilterLabelItem } from './components/FilterTags'
import { mockFlightList } from './mockData'
import './index.scss'

function mapMockToFlights(list: typeof mockFlightList): Flight[] {
  return list.map((item) => ({
    flightNumber: item.flightNo,
    airline: { code: '', name: item.airline },
    acCode: '',
    logo: item.airlineIcon || '',
    model: item.aircraftType,
    depDate: '',
    arrDate: '',
    depCityCode: '',
    arrCityCode: '',
    depCityName: '',
    arrCityName: '',
    depCode: '',
    depAirport: item.departureAirport,
    arrCode: '',
    arrAirport: item.arrivalAirport,
    depTerminal: '',
    arrTerminal: '',
    depTime: item.departureTime,
    arrTime: item.arrivalTime,
    duration: item.duration,
    stops: [],
    isShare: 0,
    isStop: 0,
    shareAcCode: '',
    shareLogo: '',
    shareFlight: '',
    shareFlyNo: '',
    price: item.price,
    intervalDay: item.intervalDay,
    depWeek: '',
    meal: item.mealService ? 1 : 0,
    mealDesc: '',
    extData: '',
    discount: parseFloat(item.discount) || 0,
    cabinName: item.cabinClass,
    handBaggageRule: '',
    consignBaggageRule: '',
    baggageRule: '',
  }))
}

const mockFilterLabels: FilterLabelItem[] = [
  { label: '上午出发', value: '上午出发' },
  { label: '下午出发', value: '下午出发' },
  { label: '仅看直飞', value: '仅看直飞' },
  { label: '隐藏共享航班', value: '隐藏共享航班' },
  { label: '大机型', value: '大机型' },
]

function getTodayKey(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export function FlightList() {
  const navigate = useNavigate()
  const {
    searchParams,
    adultNum,
    childNum,
    selectedDate,
    setSelectedDate,
    entranceSource,
    setAdultNum,
    setChildNum,
  } = useFlightStore()

  const [showPassengerPopup, setShowPassengerPopup] = useState(false)
  const [filterLabels, setFilterLabels] = useState<FilterLabelItem[]>(mockFilterLabels)
  const [topSelectedLabels, setTopSelectedLabels] = useState<string[]>([])

  // Sort bar scroll
  const { isSortBarHidden, handleScroll } = useSortBarScroll()

  // Date selector state
  const [activeDateKey, setActiveDateKey] = useState(() => {
    if (selectedDate) {
      const d = new Date(selectedDate)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}${month}${day}`
    }
    return getTodayKey()
  })

  // Sync selectedDate from store on mount
  useEffect(() => {
    if (selectedDate) {
      const d = new Date(selectedDate)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      setActiveDateKey(`${year}${month}${day}`)
    }
  }, [selectedDate])

  // Build search criteria
  const getSearchCriteria = useCallback(() => {
    'background only';
    const fromDate = selectedDate || new Date().toISOString().slice(0, 10)
    return {
      cabinGrade: 0 as const,
      adultNum,
      childNum,
      fromCity: searchParams.departureCode,
      fromCityType: searchParams.departureType,
      fromDate,
      toCity: searchParams.arrivalCode,
      toCityType: searchParams.arrivalType,
      tripType: 1 as const,
      entranceSource,
    }
  }, [searchParams, adultNum, childNum, selectedDate, entranceSource])

  // Flight filter
  const filter = useFlightFilter({
    getBaseParams: getSearchCriteria,
    requestPreview: async () => ({ flights: [] }),
  })

  // Keep appliedQueryParams in ref for latest access in effects
  const appliedQueryParamsRef = useRef(filter.appliedQueryParams)
  appliedQueryParamsRef.current = filter.appliedQueryParams

  // Flight list
  const flightListHook = useFlightList({
    getSearchCriteria,
    onResult: (result) => {
      if (result.labels?.length) {
        setFilterLabels(result.labels.map((l) => ({ label: l.label, value: l.value })))
      }
      filter.syncFilterPopupOptionsByFlightData({
        depAirportStatistics: [...result.depAirportStatistics] as any,
        arrAirportStatistics: [...result.arrAirportStatistics] as any,
        airlineStatistics: [...result.airlineStatistics] as any,
      })
    },
  })

  // Refresh ref for finishRefresh
  const refreshRef = useRef<NodesRef>(null)

  // Finish refresh animation when refreshing state becomes false
  const prevRefreshingRef = useRef(flightListHook.refreshing)
  useEffect(() => {
    if (prevRefreshingRef.current && !flightListHook.refreshing) {
      refreshRef.current?.invoke({
        method: 'finishRefresh',
      }).exec()
    }
    prevRefreshingRef.current = flightListHook.refreshing
  }, [flightListHook.refreshing])

  // Auto fetch when sort changes
  useEffect(() => {
    flightListHook.fetchFlights(appliedQueryParamsRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightListHook.sortType, flightListHook.sortOrder])

  // Initial fetch on mount
  useEffect(() => {
    flightListHook.fetchFlights(appliedQueryParamsRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Date change handler
  const handleDateChange = (dateKey: string) => {
    'background only';
    setActiveDateKey(dateKey)
    const year = dateKey.slice(0, 4)
    const month = dateKey.slice(4, 6)
    const day = dateKey.slice(6, 8)
    const dateStr = `${year}-${month}-${day}`
    setSelectedDate(dateStr)
    flightListHook.fetchFlights(filter.appliedQueryParams)
  }

  // Sort change handler
  const handleSortChange = (nextSortType: SortType) => {
    'background only';
    flightListHook.handleSortChange(nextSortType)
  }

  // Filter confirm handler
  const handleFilterConfirm = () => {
    'background only';
    filter.applyDraftFilters()
    // Defer fetch to next tick so appliedQueryParams is updated
    setTimeout(() => {
      flightListHook.fetchFlights(appliedQueryParamsRef.current)
    }, 0)
  }

  // Filter tags change handler
  const handleFilterTagsChange = (selectedLabels: string[]) => {
    'background only';
    setTopSelectedLabels(selectedLabels)
    filter.syncFiltersFromTopLabels(selectedLabels)
    setTimeout(() => {
      flightListHook.fetchFlights(appliedQueryParamsRef.current)
    }, 0)
  }

  // Flight card click
  const handleFlightClick = (flight: Flight) => {
    'background only';
    navigate(`/cabinList?flightNo=${flight.flightNumber}`)
  }

  // Passenger confirm
  const handlePassengerConfirm = (adult: number, child: number) => {
    'background only';
    setAdultNum(adult)
    setChildNum(child)
    setShowPassengerPopup(false)
    flightListHook.fetchFlights(filter.appliedQueryParams)
  }

  // Determine display data: prefer API result, fallback to mock
  const displayFlights = flightListHook.flightList.length > 0
    ? flightListHook.flightList
    : (!flightListHook.loading && !flightListHook.refreshing)
      ? mapMockToFlights(mockFlightList)
      : []

  return (
    <view className="page-flight-list">
      <NavBar title={`${searchParams.departure}-${searchParams.arrival}`} />

      <DateSelector selectedDate={activeDateKey} onChange={handleDateChange} />

      <view
        className="flight-passenger-bar"
        bindtap={() => setShowPassengerPopup(true)}
      >
        <text className="flight-passenger-bar__text">
          {adultNum}成人
          {childNum > 0 ? ` ${childNum}儿童` : ''}
        </text>
        <text className="flight-passenger-bar__arrow">▼</text>
      </view>

      <FilterTags
        labels={filterLabels}
        selectedLabels={topSelectedLabels}
        onChange={handleFilterTagsChange}
        loading={flightListHook.loading}
        nodata={!displayFlights.length}
      />

      <refresh
        ref={refreshRef}
        className="flight-list-refresh"
        bindstartrefresh={flightListHook.onRefresh}
      >
        <refresh-header className="flight-list-refresh__header">
          <text className="flight-list-refresh__text">正在刷新...</text>
        </refresh-header>
        <scroll-view
          className="flight-list-scroll"
          scroll-orientation="vertical"
          show-scroll-bar={false}
          bindscroll={handleScroll}
        >
          {flightListHook.loading && !flightListHook.refreshing && (
            <FlightSkeleton />
          )}

          {!flightListHook.loading && displayFlights.length === 0 && (
            <EmptyState text={flightListHook.noDataText} />
          )}

          <view className="flight-list-content">
            {displayFlights.map((flight) => (
              <FlightCard
                key={`${flight.flightNumber}_${flight.depTime}`}
                flight={flight}
                selectedDate={activeDateKey}
                isMultiPeople={adultNum + childNum > 1}
                isB2C={entranceSource > 0}
                onClick={handleFlightClick}
              />
            ))}
          </view>
        </scroll-view>
      </refresh>

      <view
        className={clsx(
          'sort-bar-container',
          isSortBarHidden && 'sort-bar-container--hidden'
        )}
      >
        <SortBar
          sortType={flightListHook.sortType}
          sortOrder={flightListHook.sortOrder}
          filterCount={filter.appliedFilterBadgeCount}
          onSortChange={handleSortChange}
          onFilterClick={filter.openFilterPopup}
        />
      </view>

      <FilterPopup
        show={filter.showFilterPopup}
        tabs={filter.tabs}
        featuredOptions={filter.featuredOptions}
        timeRangeOptions={filter.timeRangeOptions}
        depAirportOptions={filter.depAirportOptions}
        arrAirportOptions={filter.arrAirportOptions}
        airlineOptions={filter.airlineOptions}
        modelOptions={filter.modelOptions}
        filters={filter.draftFilters}
        previewCount={filter.previewCount}
        previewLoading={filter.previewLoading}
        onClose={filter.closeFilterPopup}
        onReset={filter.resetDraftFilters}
        onConfirm={handleFilterConfirm}
        onChange={filter.setDraftFilters}
      />

      <PassengerPopup
        show={showPassengerPopup}
        adultNum={adultNum}
        childNum={childNum}
        onClose={() => setShowPassengerPopup(false)}
        onConfirm={handlePassengerConfirm}
      />
    </view>
  )
}
