import { useCallback } from '@lynx-js/react'
import { useNavigate } from 'react-router'
import { showToast } from 'lynx-ui'
import { QUICK_LOGIN_AGREEMENTS, AGREEMENT_TITLES } from './agreements'
import './QuickLogin.scss'

/**
 * 快速登录 (PRD): default auth landing page.
 * - 本机号码一键登录 (one-tap SDK wiring is out of scope this iteration)
 * - 其他手机号登录 -> /login/code
 * - 4 agreements (A/B/C/D)
 */
export function QuickLogin() {
  const navigate = useNavigate()

  const onOneTapLogin = useCallback(() => {
    'background only'
    // TODO(one-tap): integrate 中国移动一键登录 SDK (lowered priority per PRD).
    showToast('一键登录 SDK 接入中')
  }, [])

  const onOtherPhoneLogin = useCallback(() => {
    'background only'
    navigate('/login/code')
  }, [navigate])

  const onAgreementClick = useCallback(
    (type: string) => {
      'background only'
      navigate(`/agreement/${type}`)
    },
    [navigate],
  )

  return (
    <view className="page-quick-login p-4">
      <text className="title text-2xl font-bold text-center mb-8">快速登录</text>
      <view className="btn-primary" bindtap={onOneTapLogin}>
        <text className="btn-primary-text">本机号码一键登录</text>
      </view>
      <view className="btn-secondary mt-4" bindtap={onOtherPhoneLogin}>
        <text className="btn-secondary-text">其他手机号登录</text>
      </view>
      <view className="agreements mt-8">
        {QUICK_LOGIN_AGREEMENTS.map((type) => (
          <text
            key={type}
            className="agreement-link"
            bindtap={() => onAgreementClick(type)}
          >
            {AGREEMENT_TITLES[type]}
          </text>
        ))}
      </view>
    </view>
  )
}
