/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from '@lynx-js/react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router';
import { Refresh } from 'lynx-ui';
import dayjs from '../../utils/dayjs';
import { NavBar } from '../../components/NavBar';
import { useFlightStore } from '../../store';
import { useFlightList, useFlightFilter, useSortBarScroll } from './hooks';
import {
  DateSelector,
  EmptyState,
  FilterPopup,
  FilterTags,
  FlightCard,
  FlightSkeleton,
  PassengerPopup,
  SortBar,
} from './components';
import type { FilterLabelItem } from './components';
import type { EntranceSource, Flight, SortType } from 'travel-domain';
import { mockFlightList } from './mockData';
import './index.scss';
import { PageContainer } from '../../components/PageContainer';
import { parseYyyyMmDd } from '../../utils/date';

function mapMockToFlights(list: typeof mockFlightList): Flight[] {
  return list.map((item) => ({
    key: `${item.flightNo}_${item.airline}_${item.departureTime}_${item.arrivalTime}`,
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
  }));
}

const mockFilterLabels: FilterLabelItem[] = [
  { label: '上午出发', value: '上午出发' },
  { label: '下午出发', value: '下午出发' },
  { label: '仅看直飞', value: '仅看直飞' },
  { label: '隐藏共享航班', value: '隐藏共享航班' },
  { label: '大机型', value: '大机型' },
];

function getTodayKey(): string {
  return dayjs().format('YYYYMMDD');
}

function formatYyyyMmDdToKey(dateStr: string): string {
  return parseYyyyMmDd(dateStr).format('YYYYMMDD');
}

export function FlightList() {
  const navigate = useNavigate();
  const {
    searchParams,
    adultNum,
    childNum,
    selectedDate,
    setSelectedDate,
    entranceSource,
    setAdultNum,
    setChildNum,
  } = useFlightStore();

  const [showPassengerPopup, setShowPassengerPopup] = useState(false);
  const [filterLabels, setFilterLabels] =
    useState<FilterLabelItem[]>(mockFilterLabels);
  const [topSelectedLabels, setTopSelectedLabels] = useState<string[]>([]);

  // Sort bar scroll
  const { isSortBarHidden, handleScroll } = useSortBarScroll();

  // Date selector state
  const [activeDateKey, setActiveDateKey] = useState(() => {
    const dateSource = selectedDate || searchParams.departureDate;
    if (dateSource) {
      return formatYyyyMmDdToKey(dateSource);
    }
    return getTodayKey();
  });

  // Sync selectedDate from store on mount
  useEffect(() => {
    const dateSource = selectedDate || searchParams.departureDate;
    if (dateSource) {
      setActiveDateKey(formatYyyyMmDdToKey(dateSource));
    }
  }, [selectedDate, searchParams.departureDate]);

  // Build search criteria
  const getSearchCriteria = useCallback(() => {
    'background only';
    let fromDate = selectedDate;
    if (fromDate) {
      fromDate = fromDate.replace(/-/g, '');
    } else {
      fromDate = dayjs().format('YYYYMMDD');
    }
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
      entranceSource: (entranceSource ?? 0) as EntranceSource,
      // retDate: fromDate,
    };
  }, [searchParams, adultNum, childNum, selectedDate, entranceSource]);

  // Flight filter
  const filter = useFlightFilter({
    getBaseParams: getSearchCriteria,
    requestPreview: async () => ({ flights: [] }),
  });

  // Keep appliedQueryParams in ref for latest access in effects
  const appliedQueryParamsRef = useRef(filter.appliedQueryParams);
  appliedQueryParamsRef.current = filter.appliedQueryParams;

  // Flight list
  const flightListHook = useFlightList({
    getSearchCriteria,
    onResult: (result) => {
      'background only';
      if (result.labels?.length) {
        setFilterLabels(
          result.labels.map((l) => ({ label: l.label, value: l.value })),
        );
      }
      filter.syncFilterPopupOptionsByFlightData({
        depAirportStatistics: [...result.depAirportStatistics],
        arrAirportStatistics: [...result.arrAirportStatistics],
        airlineStatistics: [...result.airlineStatistics],
      });
    },
  });

  // Auto fetch when sort changes
  useEffect(() => {
    flightListHook.fetchFlights(appliedQueryParamsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightListHook.sortType, flightListHook.sortOrder]);

  // Initial fetch on mount
  useEffect(() => {
    console.log('fight mounted', lynx.__globalProps, SystemInfo);
    flightListHook.fetchFlights(appliedQueryParamsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Date change handler
  const handleDateChange = (dateKey: string) => {
    'background only';
    setActiveDateKey(dateKey);
    const year = dateKey.slice(0, 4);
    const month = dateKey.slice(4, 6);
    const day = dateKey.slice(6, 8);
    const dateStr = `${year}-${month}-${day}`;
    setSelectedDate(dateStr);
    flightListHook.fetchFlights(filter.appliedQueryParams);
  };

  // Sort change handler
  const handleSortChange = (nextSortType: SortType) => {
    'background only';
    flightListHook.handleSortChange(nextSortType);
  };

  // Filter confirm handler
  const handleFilterConfirm = () => {
    'background only';
    filter.applyDraftFilters();
    // Defer fetch to next tick so appliedQueryParams is updated
    setTimeout(() => {
      flightListHook.fetchFlights(appliedQueryParamsRef.current);
    }, 0);
  };

  // Filter tags change handler
  const handleFilterTagsChange = (selectedLabels: string[]) => {
    'background only';
    setTopSelectedLabels(selectedLabels);
    filter.syncFiltersFromTopLabels(selectedLabels);
    setTimeout(() => {
      flightListHook.fetchFlights(appliedQueryParamsRef.current);
    }, 0);
  };

  // Flight card click
  const handleFlightClick = (flight: Flight) => {
    'background only';
    navigate(`/cabinList?flightNo=${flight.flightNumber}`);
  };

  // Passenger confirm
  const handlePassengerConfirm = (adult: number, child: number) => {
    'background only';
    setAdultNum(adult);
    setChildNum(child);
    setShowPassengerPopup(false);
    flightListHook.fetchFlights(filter.appliedQueryParams);
  };

  const useMock = false;
  useEffect(() => {
    if (useMock) {
      console.warn('The flight data is mocked.');
    }
  }, [useMock]);

  // Determine display data: prefer API result, fallback to mock
  const displayFlights = useMemo(() => {
    return flightListHook.flightList.length > 0
      ? flightListHook.flightList
      : !flightListHook.loading && !flightListHook.refreshing
        ? useMock
          ? mapMockToFlights(mockFlightList)
          : []
        : [];
  }, [
    flightListHook.flightList,
    flightListHook.loading,
    flightListHook.refreshing,
    useMock,
  ]);

  return (
    <PageContainer
      className="page-flight-list"
      showNavBar={true}
      navBarProps={{
        title: `${searchParams.departure}-${searchParams.arrival}`,
      }}
    >
      <Refresh
        className="flight-list-refresh"
        refreshing={flightListHook.refreshing}
        onRefresh={flightListHook.onRefresh}
      >
        <view
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '100px',
          }}
        >
          <DateSelector
            selectedDate={activeDateKey}
            onChange={handleDateChange}
          />

          <view
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: '36px',
            }}
          >
            <FilterTags
              labels={filterLabels}
              selectedLabels={topSelectedLabels}
              onChange={handleFilterTagsChange}
              loading={flightListHook.loading}
              nodata={!displayFlights.length}
              style={{ flex: '1' }}
            />
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
          </view>

          {/*{flightListHook.loading && !flightListHook.refreshing && (*/}
          {/*  <FlightSkeleton />*/}
          {/*)}*/}

          {/*{!flightListHook.loading && displayFlights.length === 0 && (*/}
          {/*  <EmptyState text={flightListHook.noDataText} />*/}
          {/*)}*/}
          <list
            className="flight-list-scroll"
            scroll-orientation="vertical"
            list-type="single"
            span-count={1}
            show-scroll-bar={false}
            bindscroll={handleScroll}
            style={{ listMainAxisGap: '8px', flex: '1' }}
          >
            {displayFlights.map((flight) => (
              <list-item
                key={flight.key}
                item-key={flight.key}
                recyclable={false}
              >
                <FlightCard
                  key={flight.key}
                  flight={flight}
                  selectedDate={activeDateKey}
                  isMultiPeople={adultNum + childNum > 1}
                  isB2C={entranceSource > 0}
                  onClick={handleFlightClick}
                />
              </list-item>
            ))}
          </list>
          <view
            className={clsx(
              'sort-bar-container',
              isSortBarHidden && 'sort-bar-container--hidden',
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
        </view>
      </Refresh>

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
    </PageContainer>
  );
}
