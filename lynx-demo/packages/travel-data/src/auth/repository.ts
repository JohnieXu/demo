/**
 * Auth repository implementation
 *
 * Bridges domain interfaces with remote data source.
 */

'background only'

import {
  ok,
  err,
  type Result,
  type IAuthRepository,
  type LoginRequest,
  type LoginResult,
} from 'travel-domain'
import { AuthRemoteDataSource } from './datasource.js'
import {
  toLoginEncryptedRequestDto,
  toLoginResult,
  toDomainError,
} from './mapper.js'

export class AuthRepository implements IAuthRepository {
  private ds = new AuthRemoteDataSource()

  async login(request: LoginRequest): Promise<Result<LoginResult>> {
    try {
      const dtoReq = toLoginEncryptedRequestDto(request)
      const res = await this.ds.login(dtoReq)
      return ok(toLoginResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}
