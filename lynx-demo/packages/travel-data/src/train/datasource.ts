/**
 * Train remote data source
 */

'background only'

import { travelClient } from '../network/client.js'
import type {
  TrainSearchRequestDto,
  TrainSearchResponseDto,
  TrainPriceCalendarRequestDto,
  TrainPriceCalendarDto,
} from './dto.js'

function toQuery(record: Record<string, any>) {
  return record as Record<string, string | number | boolean | undefined>
}

export class TrainRemoteDataSource {
  async search(params: TrainSearchRequestDto) {
    return travelClient.get<TrainSearchResponseDto>('/train/search', {
      params: toQuery(params),
    })
  }

  async getPriceCalendar(params: TrainPriceCalendarRequestDto) {
    return travelClient.get<TrainPriceCalendarDto[]>('/train/price-calendar', {
      params: toQuery(params),
    })
  }
}
