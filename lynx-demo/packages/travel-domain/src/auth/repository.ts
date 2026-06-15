/**
 * Auth repository interface (dependency inversion)
 *
 * The domain layer defines WHAT operations are needed.
 * The data layer (travel-data) provides HOW they are implemented.
 */

import type { Result } from '../common/result.js'
import type { LoginRequest, LoginResult } from './entity.js'

export interface IAuthRepository {
  login(request: LoginRequest): Promise<Result<LoginResult>>
}
