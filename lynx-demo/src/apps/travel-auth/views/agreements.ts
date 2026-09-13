/**
 * The 4 user agreements referenced by the login flows (PRD §用户协议).
 * Route `/agreement/:type` maps `type` to an entry here.
 */
export const AgreementType = {
  /** A. 中国移动认证服务条款 */
  Cmcc: 'cmcc',
  /** B. 中旅旅行旅游服务条款 */
  Service: 'service',
  /** C. 中旅旅行隐私政策 */
  Privacy: 'privacy',
  /** D. 中旅旅行会员协议 */
  Member: 'member',
} as const

export type AgreementTypeValue = (typeof AgreementType)[keyof typeof AgreementType]

export const AGREEMENT_TITLES: Record<AgreementTypeValue, string> = {
  [AgreementType.Cmcc]: '中国移动认证服务条款',
  [AgreementType.Service]: '中旅旅行旅游服务条款',
  [AgreementType.Privacy]: '中旅旅行隐私政策',
  [AgreementType.Member]: '中旅旅行会员协议',
}

/** Agreements required by the quick-login (一键登录) page: all four. */
export const QUICK_LOGIN_AGREEMENTS: AgreementTypeValue[] = [
  AgreementType.Cmcc,
  AgreementType.Service,
  AgreementType.Privacy,
  AgreementType.Member,
]

/** Agreements required by the SMS-code and account-password login pages: B/C/D. */
export const LOGIN_AGREEMENTS: AgreementTypeValue[] = [
  AgreementType.Service,
  AgreementType.Privacy,
  AgreementType.Member,
]
