import { create } from 'zustand'
import { TAB_TYPE, QUERY_CABIN_CLASS, LOCATION_TYPE } from '../constants'
import { getDefaultDates } from '../utils/date'
import type { TabType, QueryCabinClass, LocationType } from '../constants'

export type CityInfo = {
  departure: string
  arrival: string
}

export type DateInfo = {
  departureDate: string
  arrivalDate: string
}

export type FlightSearchParams = {
  tab: TabType
  departure: string
  arrival: string
  departureCode: string
  arrivalCode: string
  departureType: LocationType
  arrivalType: LocationType
  departureDate: string
  arrivalDate: string
  cabin: QueryCabinClass
}

export type FlightItem = {
  id: string
  airline: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
}

export type FlightState = {
  // Search params
  searchParams: FlightSearchParams
  setSearchParams: (params: Partial<FlightSearchParams>) => void

  // Passenger count
  adultNum: number
  childNum: number
  setAdultNum: (num: number) => void
  setChildNum: (num: number) => void

  // Selected date for keep-alive
  selectedDate: string
  setSelectedDate: (date: string) => void

  // B2C mode
  entranceSource: number
  setEntranceSource: (source: number) => void

  // Search results
  flightList: FlightItem[]
  setFlightList: (list: FlightItem[]) => void

  // Recent searches
  recentSearches: Array<{
    departure: string
    arrival: string
    date: string
  }>
  addRecentSearch: (search: { departure: string; arrival: string; date: string }) => void

  // Selected flight for booking
  selectedFlight: FlightItem | null
  setSelectedFlight: (flight: FlightItem | null) => void

  // Reset
  resetSearch: () => void
}

const { departureDate, arrivalDate } = getDefaultDates()

const initialSearchParams: FlightSearchParams = {
  tab: TAB_TYPE.Flight,
  departure: '北京',
  arrival: '上海',
  departureCode: 'BJS',
  arrivalCode: 'SHA',
  departureType: LOCATION_TYPE.City,
  arrivalType: LOCATION_TYPE.City,
  departureDate,
  arrivalDate,
  cabin: QUERY_CABIN_CLASS.NoLimit,
}

export const useFlightStore = create<FlightState>((set) => ({
  searchParams: initialSearchParams,
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  adultNum: 1,
  childNum: 0,
  setAdultNum: (num) => set({ adultNum: num }),
  setChildNum: (num) => set({ childNum: num }),

  selectedDate: '',
  setSelectedDate: (date) => set({ selectedDate: date }),

  entranceSource: 0,
  setEntranceSource: (source) => set({ entranceSource: source }),

  flightList: [],
  setFlightList: (list) => set({ flightList: list }),

  recentSearches: [
    { departure: '北京', arrival: '上海', date: '11月6日' },
    { departure: '昆明', arrival: '杭州', date: '11月6日' },
    { departure: '昆明', arrival: '福州', date: '11月6日' },
  ],
  addRecentSearch: (search) =>
    set((state) => ({
      recentSearches: [search, ...state.recentSearches.filter(
        (s) => !(s.departure === search.departure && s.arrival === search.arrival && s.date === search.date)
      )].slice(0, 10),
    })),

  selectedFlight: null,
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),

  resetSearch: () => set({
    searchParams: initialSearchParams,
    adultNum: 1,
    childNum: 0,
    selectedDate: '',
    entranceSource: 0,
    flightList: [],
    selectedFlight: null,
  }),
}))