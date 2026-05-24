import { create } from 'zustand'

export type TabType = 'flight' | 'train'
export type CabinClass = 'nolimit' | 'business'

export type CityInfo = {
  departure: string
  arrival: string
}

export type DateInfo = {
  date: string
  weekday: string
}

export type FlightSearchParams = {
  tab: TabType
  departure: string
  arrival: string
  departureCode: string
  arrivalCode: string
  departureType: number
  arrivalType: number
  date: string
  weekday: string
  returnDate?: string
  returnWeekday?: string
  cabin: CabinClass
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

const initialSearchParams: FlightSearchParams = {
  tab: 'flight',
  departure: '北京',
  arrival: '上海',
  departureCode: 'BJS',
  arrivalCode: 'SHA',
  departureType: 2,
  arrivalType: 2,
  date: '8月31日',
  weekday: '周五',
  cabin: 'nolimit',
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