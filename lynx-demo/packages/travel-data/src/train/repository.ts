/**
 * Train repository implementation
 */

'background only'

import {
  ok,
  err,
  createPageResult,
  type ITrainRepository,
  type Result,
  type PageResult,
  type Train,
  type TrainPriceCalendar,
  type TrainSearchCriteria,
} from 'travel-domain'
import { TrainRemoteDataSource } from './datasource.js'
import {
  toTrain,
  toPriceCalendar,
  toSearchRequestDto,
  toDomainError,
} from './mapper.js'

export class TrainRepository implements ITrainRepository {
  private ds = new TrainRemoteDataSource()

  async search(
    criteria: TrainSearchCriteria
  ): Promise<Result<PageResult<Train>>> {
    try {
      const dtoReq = toSearchRequestDto(criteria)
      const res = await this.ds.search(dtoReq)
      const body = res.data
      return ok(
        createPageResult(
          body.list.map(toTrain),
          body.total,
          body.page,
          body.pageSize
        )
      )
    } catch (e) {
      return err(toDomainError(e))
    }
  }

  async getPriceCalendar(params: {
    departure: string
    arrival: string
    month: string
  }): Promise<Result<readonly TrainPriceCalendar[]>> {
    try {
      const res = await this.ds.getPriceCalendar(params)
      return ok(res.data.map(toPriceCalendar))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}
