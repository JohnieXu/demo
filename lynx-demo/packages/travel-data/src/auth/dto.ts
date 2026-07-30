/**
 * Auth data-transfer objects (backend JSON shapes)
 */

/* ─── Plain (domain-side) login payload ─────────────────── */

/** Inner login payload that will be encrypted into the `body` field. */
export interface LoginPayloadDto {
  account: string
  password: string
}

/* ─── Encrypted request envelope ────────────────────────── */

export interface OpenApiEncryptedRequestDto {
  systemId: string
  sign: string
  version: string
  timestamp: number
  uuid: string
  body: string
}

/* ─── Login response ────────────────────────────────────── */

export interface LoginResponseDto {
  token?: string
  memberId?: string
  account?: string
  nickname?: string
  phone?: string
  avatar?: string
  extData?: string
  extraInfo?: string
}

/**
 * v1 login request (plain JSON body, no encryption envelope).
 *
 * Example:
 * {
 *   "channel": "153",
 *   "userSource": 5,
 *   "userName": "13141270227",
 *   "password": "31532232",
 *   "userType": "mobile"
 * }
 */
export interface OpenApiLoginv1RequestDto {
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

/**
 * v1 login response (plain JSON, no encrypted envelope).
 *
 * Example:
 * {
 *   "loginToken": "71155ef96baa4d9a99b9ba5f1770dc991785404912287",
 *   "mobile": "13141270227",
 *   "memberId": "bfd0e4a3428f4663a2dd83aace1f24e8",
 *   ...
 * }
 */
export interface Loginv1ResponseDto {
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
  memberBasicInfo?: MemberBasicInfoDto
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

/**
 * Member profile embedded in the v1 login response and returned
 * by the get-basic endpoint.
 *
 * Note: some fields differ in type between the two responses
 * (e.g. `experienceOfficerFlag` may be `string | null` or `boolean`).
 * The union types below cover both variants.
 */
export interface MemberBasicInfoDto {
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
  switchConfig?: MemberSwitchConfigDto | string | null
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

/**
 * Per-product feature switches embedded in the member profile.
 *
 * Example:
 * { "hotel": true, "flight": true, "train": true, "ticket": true, "presale": true }
 */
export interface MemberSwitchConfigDto {
  hotel?: boolean
  flight?: boolean
  train?: boolean
  ticket?: boolean
  presale?: boolean
}

/**
 * get-basic request.
 *
 * Example:
 * { "memberId": "bfd0e4a3428f4663a2dd83aace1f24e8" }
 */
export interface OpenApiGetBasicRequestDto {
  /** Member ID whose basic profile should be fetched. */
  memberId: string
}

/**
 * get-basic response. Returns the full member profile
 * (same shape as the `memberBasicInfo` field of v1 login).
 */
export type GetBasicResponseDto = MemberBasicInfoDto