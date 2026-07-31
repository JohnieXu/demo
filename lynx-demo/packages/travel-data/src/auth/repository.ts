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
  Loginv1Request,
  Loginv1Result,
  GetBasicRequest,
  GetBasicResult,
} from 'travel-domain'
import { AuthRemoteDataSource } from './datasource.js'
import {
  toLoginEncryptedRequestDto,
  toLoginResult,
  toDomainError,
  toOpenApiLoginv1RequestDto,
  toLoginv1Result,
  toGetBasicResult,
  toOpenApiGetBasicRequestDto,
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
  async loginv1(request: Loginv1Request): Promise<Result<Loginv1Result>> {
    try {
      const dtoReq = toOpenApiLoginv1RequestDto(request)
      const res = await this.ds.loginv1(dtoReq)
      return ok(toLoginv1Result(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
  async getBasic(request: GetBasicRequest): Promise<Result<GetBasicResult>> {
    try {
      const dtoReq = toOpenApiGetBasicRequestDto(request)
      const res = await this.ds.getBasic(dtoReq)
      return ok(toGetBasicResult(res.data))
    } catch (e) {
      return err(toDomainError(e))
    }
  }
}
