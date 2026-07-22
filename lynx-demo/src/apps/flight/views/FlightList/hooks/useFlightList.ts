import { useCallback, useRef, useState } from '@lynx-js/react'
import { FlightSearchRepository } from 'travel-data'
import type { FlightSearchCriteria, FlightSearchResult, Flight, SortType, SortOrder } from 'travel-domain'

const DEFAULT_NO_DATA_TEXT = '暂无航班信息'

interface UseFlightListOptions {
  getSearchCriteria: () => FlightSearchCriteria
  onResult?: (result: FlightSearchResult) => void
  // trigger when load done(success or error)
  onLoadDone?: () => void
}

export function useFlightList(options: UseFlightListOptions) {
  'background only';
  const { getSearchCriteria, onResult, onLoadDone } = options;

  const [flightList, setFlightList] = useState<readonly Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [noDataText, setNoDataText] = useState(DEFAULT_NO_DATA_TEXT)

  const [sortType, setSortType] = useState<SortType>(1)
  const [sortOrder, setSortOrder] = useState<SortOrder>(1)

  const flightListReqId = useRef(0)
  const repoRef = useRef(new FlightSearchRepository())

  const fetchFlights = useCallback(
    async (
      extraParams: Partial<FlightSearchCriteria> = {},
      opts: { preserveOnError?: boolean } = {},
    ) => {
      'background only';
      const currentReqId = flightListReqId.current + 1;
      flightListReqId.current = currentReqId;

      if (!refreshing) {
        setLoading(true);
      }
      setError(null);

      try {
        const criteria = getSearchCriteria();
        const params: FlightSearchCriteria = {
          ...criteria,
          sortType,
          sortOrder,
          ...extraParams,
        };

        console.log('search with params', params);
        const result = await repoRef.current.searchV2(params);
        console.log('flight search result', result);

        // Race condition protection: discard stale responses
        if (currentReqId !== flightListReqId.current) return;

        if (result.isSuccess) {
          const data = result.data;
          setFlightList(data.flights);
          setNoDataText(data.emptyMessage || DEFAULT_NO_DATA_TEXT);
          onResult?.(data);
        } else {
          setFlightList([]);
          setNoDataText(result.error.message || DEFAULT_NO_DATA_TEXT);
        }
      } catch (e) {
        if (currentReqId !== flightListReqId.current) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        if (!opts.preserveOnError) {
          setFlightList([]);
        }
      } finally {
        console.log('fetch finally', currentReqId, flightListReqId.current);
        if (currentReqId === flightListReqId.current) {
          setLoading(false);
          setRefreshing(false);
          onLoadDone?.();
        }
      }
    },
    [getSearchCriteria, onResult, onLoadDone, sortType, sortOrder, refreshing],
  );

  const onRefresh = useCallback(() => {
    'background only';
    setRefreshing(true)
    fetchFlights({}, { preserveOnError: true })
  }, [fetchFlights])

  const handleSortChange = useCallback(
    (nextSortType: SortType) => {
      'background only';
      if (nextSortType === 1) {
        // Direct: fixed order
        setSortType(1)
        setSortOrder(1)
      } else if (nextSortType === sortType) {
        // Toggle order for same type
        setSortOrder((prev) => (prev === 1 ? 2 : 1))
      } else {
        // New type: default asc
        setSortType(nextSortType)
        setSortOrder(1)
      }
      // Fetch will be triggered by effect watching sortType/sortOrder
    },
    [sortType]
  )

  return {
    flightList,
    loading,
    refreshing,
    error,
    noDataText,
    sortType,
    sortOrder,
    fetchFlights,
    onRefresh,
    handleSortChange,
    setRefreshing,
  }
}
