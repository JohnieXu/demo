/**
 * Train repository interface
 */

import type { Result } from '../common/result.js'
import type { PageResult } from '../common/pagination.js'
import type {
  Train,
  TrainSearchCriteria,
  TrainPriceCalendar,
} from './entity.js'

export interface ITrainRepository {
  search(
    criteria: TrainSearchCriteria
  ): Promise<Result<PageResult<Train>>>

  getPriceCalendar(params: {
    departure: string
    arrival: string
    month: string
  }): Promise<Result<readonly TrainPriceCalendar[]>>
}
