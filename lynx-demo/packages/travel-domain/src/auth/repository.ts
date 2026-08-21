/**
 * Auth repository interface (dependency inversion)
 *
 * The domain layer defines WHAT operations are needed.
 * The data layer (travel-data) provides HOW they are implemented.
 */

import type { Result } from '../common/result.js'
import type { GetBasicRequest, GetBasicResult, LoginRequest, LoginResult, Loginv1Request, Loginv1Result, LogoutRequest, LogoutResult } from './entity.js'

export interface IAuthRepository {
  login(request: LoginRequest): Promise<Result<LoginResult>>
  loginv1(request: Loginv1Request): Promise<Result<Loginv1Result>>
  getBasic(request: GetBasicRequest): Promise<Result<GetBasicResult>>
  logout(request: LogoutRequest): Promise<Result<LogoutResult>>
}
