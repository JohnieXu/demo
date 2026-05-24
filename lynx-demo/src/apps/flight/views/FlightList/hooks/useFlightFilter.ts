import { useCallback, useMemo, useRef, useState } from '@lynx-js/react'
import { debounce } from 'lynx-shared'
import type { FlightSearchCriteria } from 'travel-domain'

export interface FilterState {
  featured: string[]
  depTimeRanges: string[]
  arrTimeRanges: string[]
  depAirports: string[]
  arrAirports: string[]
  airlines: string[]
  models: string[]
}

export interface FilterOption {
  label: string
  value: string
}

export interface TimeRangeOption {
  key: string
  label: string
  startTime: string
  endTime: string
}

const TIME_RANGES: TimeRangeOption[] = [
  { key: '00:00-06:00', label: '00:00 - 06:00', startTime: '00:00', endTime: '06:00' },
  { key: '06:00-12:00', label: '06:00 - 12:00', startTime: '06:00', endTime: '12:00' },
  { key: '12:00-18:00', label: '12:00 - 18:00', startTime: '12:00', endTime: '18:00' },
  { key: '18:00-24:00', label: '18:00 - 24:00', startTime: '18:00', endTime: '24:00' },
]

const FIXED_MODEL_OPTIONS: FilterOption[] = [
  { label: '大机型', value: 'big' },
  { label: '中机型', value: 'medium' },
]

export const FEATURED_OPTIONS: FilterOption[] = [
  { label: '仅看直飞', value: 'direct' },
  { label: '隐藏共享航班', value: 'hideShare' },
]

export const FILTER_TABS = [
  { key: 'featured', label: '精选' },
  { key: 'time', label: '起抵时间' },
  { key: 'airport', label: '机场' },
  { key: 'airline', label: '航空公司' },
  { key: 'model', label: '机型' },
]

export function createDefaultFilters(): FilterState {
  return {
    featured: [],
    depTimeRanges: [],
    arrTimeRanges: [],
    depAirports: [],
    arrAirports: [],
    airlines: [],
    models: [],
  }
}

function cloneFilters(filters: FilterState): FilterState {
  return {
    featured: [...filters.featured],
    depTimeRanges: [...filters.depTimeRanges],
    arrTimeRanges: [...filters.arrTimeRanges],
    depAirports: [...filters.depAirports],
    arrAirports: [...filters.arrAirports],
    airlines: [...filters.airlines],
    models: [...filters.models],
  }
}

export function countFilterSelections(filters: FilterState): number {
  return (
    filters.featured.length +
    filters.depTimeRanges.length +
    filters.arrTimeRanges.length +
    filters.depAirports.length +
    filters.arrAirports.length +
    filters.airlines.length +
    filters.models.length
  )
}

function uniqueList(list: string[] = []): string[] {
  return Array.from(new Set((Array.isArray(list) ? list : []).filter(Boolean)))
}

function createRequestKey(params: object): string {
  try {
    return JSON.stringify(params || {})
  } catch {
    return ''
  }
}

function buildFilterQuery(filters: FilterState): Partial<FlightSearchCriteria> {
  const fromTimeRanges = (filters.depTimeRanges || [])
    .map((key) => TIME_RANGES.find((item) => item.key === key))
    .filter((item): item is TimeRangeOption => Boolean(item))
    .map(({ startTime, endTime }) => ({ startTime, endTime }))
  const toTimeRanges = (filters.arrTimeRanges || [])
    .map((key) => TIME_RANGES.find((item) => item.key === key))
    .filter((item): item is TimeRangeOption => Boolean(item))
    .map(({ startTime, endTime }) => ({ startTime, endTime }))
  const isDirect = (filters.featured || []).includes('direct')
  const hideShare = (filters.featured || []).includes('hideShare')
  const hasBig = (filters.models || []).includes('big')
  const hasMedium = (filters.models || []).includes('medium')

  return {
    directFlight: isDirect ? 1 : 0,
    hiddeShareFlight: hideShare ? 1 : 0,
    depAirports: [...(filters.depAirports || [])],
    arrAirports: [...(filters.arrAirports || [])],
    airlines: [...(filters.airlines || [])],
    bigModel: hasBig ? 1 : 0,
    mediumModel: hasMedium ? 1 : 0,
    fromTimeRanges,
    toTimeRanges,
  }
}

export interface UseFlightFilterOptions {
  getBaseParams: () => FlightSearchCriteria
  requestPreview: (params: FlightSearchCriteria) => Promise<{ flights?: unknown[] } | null>
}

export function useFlightFilter(options: UseFlightFilterOptions) {
  const { getBaseParams, requestPreview } = options

  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [previewCount, setPreviewCount] = useState(0)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(createDefaultFilters())
  const [draftFilters, setDraftFilters] = useState<FilterState>(createDefaultFilters())
  const previewReqId = useRef(0)
  const previewParamsKey = useRef('')
  const previewDataRef = useRef<{ flights?: unknown[] } | null>(null)

  const [depAirportOptions, setDepAirportOptions] = useState<FilterOption[]>([])
  const [arrAirportOptions, setArrAirportOptions] = useState<FilterOption[]>([])
  const [airlineOptions, setAirlineOptions] = useState<FilterOption[]>([])
  const modelOptions = useMemo(() => [...FIXED_MODEL_OPTIONS], [])

  const appliedQueryParams = useMemo(() => buildFilterQuery(appliedFilters), [appliedFilters])
  const appliedFilterBadgeCount = useMemo(() => countFilterSelections(appliedFilters), [appliedFilters])

  const syncDraftFromApplied = useCallback(() => {
    setDraftFilters(cloneFilters(appliedFilters))
  }, [appliedFilters])

  const openFilterPopup = useCallback(() => {
    syncDraftFromApplied()
    setShowFilterPopup(true)
    schedulePreview()
  }, [syncDraftFromApplied])

  const closeFilterPopup = useCallback(() => {
    setShowFilterPopup(false)
    syncDraftFromApplied()
  }, [syncDraftFromApplied])

  const resetDraftFilters = useCallback(() => {
    setDraftFilters(createDefaultFilters())
    schedulePreview()
  }, [])

  const resetAllFilters = useCallback(() => {
    const defaults = createDefaultFilters()
    setAppliedFilters(defaults)
    setDraftFilters(cloneFilters(defaults))
    schedulePreview()
  }, [])

  const applyDraftFilters = useCallback(() => {
    setAppliedFilters(cloneFilters(draftFilters))
    setShowFilterPopup(false)
    return cloneFilters(draftFilters)
  }, [draftFilters])

  const applyDraftFiltersWithPreview = useCallback(async () => {
    const params = buildPreviewParams()
    const paramsKey = createRequestKey(params)
    const data =
      previewDataRef.current && previewParamsKey.current === paramsKey
        ? previewDataRef.current
        : await runPreview(params, paramsKey)
    setAppliedFilters(cloneFilters(draftFilters))
    setShowFilterPopup(false)
    return {
      filters: cloneFilters(draftFilters),
      data,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftFilters])

  const setDraftFiltersWrapped = useCallback((next: Partial<FilterState>) => {
    setDraftFilters((prev) => ({ ...prev, ...next }))
    schedulePreview()
  }, [])

  function buildPreviewParams(): FlightSearchCriteria {
    return {
      ...getBaseParams(),
      ...buildFilterQuery(draftFilters),
    } as FlightSearchCriteria
  }

  async function runPreview(
    previewParams = buildPreviewParams(),
    paramsKey = createRequestKey(previewParams)
  ) {
    const currentReqId = previewReqId.current + 1
    previewReqId.current = currentReqId
    setPreviewLoading(true)

    try {
      const res = await requestPreview(previewParams)
      if (currentReqId !== previewReqId.current) return null
      const count = res?.flights?.length || 0
      setPreviewCount(count)
      previewDataRef.current = res
      previewParamsKey.current = paramsKey
      return res
    } catch {
      if (currentReqId !== previewReqId.current) return null
      setPreviewCount(0)
      previewDataRef.current = null
      previewParamsKey.current = ''
      return null
    } finally {
      if (currentReqId === previewReqId.current) {
        setPreviewLoading(false)
      }
    }
  }

  const debouncedPreview = useRef(
    debounce(() => {
      runPreview()
    }, 200)
  )

  function schedulePreview() {
    setPreviewLoading(true)
    previewParamsKey.current = ''
    debouncedPreview.current()
  }

  const requestPreviewDebounced = useCallback(() => {
    schedulePreview()
  }, [])

  const syncFiltersFromTopLabels = useCallback(
    (topLabels: string[] = []) => {
      const labels = uniqueList(topLabels)
      const depAirportValues = depAirportOptions.map((item) => item.value)
      const arrAirportValues = arrAirportOptions.map((item) => item.value)

      const next = createDefaultFilters()
      labels.forEach((label) => {
        if (label === '上午出发') {
          next.depTimeRanges.push('06:00-12:00')
          return
        }
        if (label === '下午出发') {
          next.depTimeRanges.push('12:00-18:00')
          return
        }
        if (label === '仅看直飞') {
          next.featured.push('direct')
          return
        }
        if (label === '隐藏共享航班') {
          next.featured.push('hideShare')
          return
        }
        if (label === '大机型') {
          next.models.push('big')
          return
        }
        if (label.endsWith('出发')) {
          const airport = label.replace(/出发$/, '').trim()
          if (depAirportValues.includes(airport)) {
            next.depAirports.push(airport)
          }
          return
        }
        if (label.endsWith('到达')) {
          const airport = label.replace(/到达$/, '').trim()
          if (arrAirportValues.includes(airport)) {
            next.arrAirports.push(airport)
          }
        }
      })

      next.featured = uniqueList(next.featured)
      next.depTimeRanges = uniqueList(next.depTimeRanges)
      next.arrTimeRanges = uniqueList(next.arrTimeRanges)
      next.depAirports = uniqueList(next.depAirports)
      next.arrAirports = uniqueList(next.arrAirports)
      next.airlines = uniqueList(next.airlines)
      next.models = uniqueList(next.models)

      const committed = cloneFilters(next)
      setAppliedFilters(committed)
      setDraftFilters(cloneFilters(committed))
    },
    [depAirportOptions, arrAirportOptions]
  )

  const syncFilterPopupOptionsByFlightData = useCallback((data: {
    depAirportStatistics?: Array<{ airportName?: string }>
    arrAirportStatistics?: Array<{ airportName?: string }>
    airlineStatistics?: Array<{ airlineName?: string }>
  }) => {
    const mapToOptions = (list: Array<{ name?: string }> = []) => {
      return (Array.isArray(list) ? list : [])
        .map((item) => item?.name)
        .filter(Boolean)
        .map((name) => ({ label: name as string, value: name as string }))
    }

    setDepAirportOptions(
      mapToOptions(data.depAirportStatistics as Array<{ name?: string }>)
    )
    setArrAirportOptions(
      mapToOptions(data.arrAirportStatistics as Array<{ name?: string }>)
    )
    setAirlineOptions(
      mapToOptions(data.airlineStatistics as Array<{ name?: string }>)
    )
  }, [])

  return {
    showFilterPopup,
    previewCount,
    previewLoading,
    tabs: FILTER_TABS,
    featuredOptions: FEATURED_OPTIONS,
    timeRangeOptions: TIME_RANGES,
    depAirportOptions,
    arrAirportOptions,
    airlineOptions,
    modelOptions,
    draftFilters,
    appliedQueryParams,
    appliedFilterBadgeCount,
    openFilterPopup,
    closeFilterPopup,
    resetDraftFilters,
    resetAllFilters,
    setDraftFilters: setDraftFiltersWrapped,
    applyDraftFilters,
    applyDraftFiltersWithPreview,
    syncFiltersFromTopLabels,
    syncFilterPopupOptionsByFlightData,
    requestPreviewDebounced,
  }
}
