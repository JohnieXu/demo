/**
 * Auth domain entities
 *
 * Entities and value objects for authentication-related operations.
 * Domain is pure: no HTTP, no encryption, no transport details.
 */

export interface LoginRequest {
  readonly account: string
  readonly password: string
}

export interface LoginResult {
  readonly token: string
  readonly memberId: string
  readonly account?: string
  readonly nickname?: string
  readonly phone?: string
  readonly avatar?: string
  readonly extraInfo?: string
}

/**
 * Per-product feature switches embedded in the member profile.
 *
 * Example:
 * { "hotel": true, "flight": true, "train": true, "ticket": true, "presale": true }
 */
export interface MemberSwitchConfig {
  hotel?: boolean
  flight?: boolean
  train?: boolean
  ticket?: boolean
  presale?: boolean
}

/**
 * Member profile embedded in the v1 login response and returned
 * by the get-basic endpoint.
 *
 * Note: some fields differ in type between the two responses
 * (e.g. `experienceOfficerFlag` may be `string | null` or `boolean`).
 * The union types below cover both variants.
 */
export interface MemberBasicInfo {
  memberId?: string
  companyFlag?: number
  pictureUrl?: string | null
  linkType?: string | null
  linkContext?: string | null
  loginId?: string
  userName?: string | null
  headerPic?: string | null
  memberLevel?: string
  trueName?: string
  surname?: string
  name?: string
  firstName?: string | null
  lastName?: string | null
  mobile?: string
  /** International dialing code, e.g. "+86". */
  internationalCode?: string
  email?: string | null
  birthDate?: string
  /** Marriage status code. */
  marriage?: string
  tel?: string
  homeAddr?: string
  homePcode?: string
  occupation?: string
  /** Education level code. */
  education?: string
  officeadress?: string
  /** Sex code (nullable). */
  sex?: string | null
  provinceId?: number
  provinceName?: string
  cityId?: number
  cityName?: string
  districtId?: number
  districtName?: string
  /** Whether the user is an experience officer (boolean | string | null). */
  experienceOfficerFlag?: boolean | string | null
  /** Whether the user is marked as a creative expert (boolean | string | null). */
  creativeExpert?: boolean | string | null
  /** Enterprise authentication status (boolean | string | null). */
  enterpriseAuthStatus?: boolean | string | null
  enterpriseCompany?: string | null
  /** Verification level (number | string | null). */
  verified?: number | string | null
  avatarFrame?: string | null
  videoAvatarFrame?: string | null
  /** Per-product switch flags (returned by get-basic). */
  switchConfig?: MemberSwitchConfig | string | null
  memberRuleId?: string | null
  memberLevelName?: string | null
  /** Invitation-user flag (number | string | null). */
  invitationUserFlag?: number | string | null
  /** Recuperate-employee flag (number | string | null). */
  recuperateEmployeeFlag?: number | string | null
  intro?: string | null
  showPageLabel?: boolean
  integral?: number | null
}

export interface Loginv1Request {
  /** Distribution / channel code (e.g. "153"). */
  channel: string
  /** Source identifier of the user (numeric). */
  userSource: number
  /** Account / login name (mobile number, email, etc.). */
  userName: string
  /** Plain-text password submitted by the user. */
  password: string
  /** Account type, e.g. "mobile" | "email". */
  userType: string
}

export interface Loginv1Result {
  /** Session token issued by the server. */
  loginToken?: string
  /** Mobile phone number of the logged-in user. */
  mobile?: string
  /** Member ID (UUID). */
  memberId?: string
  /** Login ID (e.g. "U2001632557"). */
  loginId?: string
  /** Display name (may be empty). */
  name?: string
  /** Promotion channel code (nullable). */
  promotionChannelCode?: string | null
  /** Detailed member profile. */
  memberBasicInfo?: MemberBasicInfo
  /** ISO-8601 timestamp of the login. */
  loginTime?: string
  /** WeChat OpenID (nullable). */
  openId?: string | null
  /** WeChat UnionID (nullable). */
  unionId?: string | null
  /** Temporary JS code from third-party login (nullable). */
  jsCode?: string | null
  /** Source identifier of the member. */
  memberSource?: number
  /** CTG member flag (nullable). */
  ctgMemberFlag?: string | null
  /** One-pass ID (nullable). */
  oneId?: string | null
}

export interface GetBasicRequest {
  /** Member ID whose basic profile should be fetched. */
  memberId: string
}

export type GetBasicResult = MemberBasicInfo

/**
 * Logout request. The session is identified by the token the HTTP layer
 * injects (Authorization / Logintoken headers), so the body is empty.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogoutRequest {}

/**
 * Logout result. The server responds with the shared envelope
 * {success, errorCode, message, logId, data}; `data` carries no fields
 * of interest for the client.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogoutResult {}
