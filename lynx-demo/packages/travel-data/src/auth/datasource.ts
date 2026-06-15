/**
 * Auth remote data source — talks to HTTP backend, returns raw DTOs
 */

'background only'

import { travelClient } from '../network/client.js'
import type {
  OpenApiEncryptedRequestDto,
  LoginResponseDto,
} from './dto.js'

/* Header required by the account openapi endpoints. */
const REQUEST_FROM =
  'client=android;domain=common;version=6.1.5;cuid=00000000-0000-0000-0000-000000000000'

export class AuthRemoteDataSource {
  async login(params: OpenApiEncryptedRequestDto) {
    return travelClient.post<LoginResponseDto>(
      '/openapi/account/v2/login',
      params as unknown as Record<string, unknown>,
      {
        headers: {
          'Request-From': REQUEST_FROM,
        },
      }
    )
  }
}
