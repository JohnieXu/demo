import { AuthRepository } from 'travel-data'
import { useCallback } from '@lynx-js/react'
import { useLocation, useNavigate } from 'react-router'
import { Button, Field, Form, showToast } from 'lynx-ui'
import { useAuthStore } from '../store/authStore'
import { LOGIN_AGREEMENTS, AGREEMENT_TITLES } from './agreements'
import './SmsLogin.scss'

/**
 * 登录/注册 (PRD): 手机号 + 验证码; B/C/D 协议勾选;
 * entries to 微信登录 (out of scope) and 账号密码登录.
 */
export function SmsLogin() {
  const navigate = useNavigate()
  const location = useLocation()

  const onLoginClick = useCallback(async () => {
    'background only'
    // TODO(sms-login): wire the real 验证码登录 API; using loginv1 as a
    // placeholder so the auth flow contract can be exercised end-to-end.
    const authRepo = new AuthRepository()
    const res = await authRepo.loginv1({
      userSource: 0,
      userName: '15272031107',
      password: 'Abcde1234567',
      userType: 'Mobile',
      channel: '14|75|76',
    })
    if (res.isSuccess) {
      useAuthStore.getState().setAuth(res.data)
      showToast('登录成功')
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/', { replace: true })
    } else {
      showToast(res.error?.message || '登录失败')
    }
  }, [navigate, location.state])

  const onSendCode = useCallback(() => {
    'background only'
    // TODO(sms-code): call the send-code API.
    showToast('验证码已发送')
  }, [])

  const onPasswordLogin = useCallback(() => {
    'background only'
    navigate('/login/password', { state: location.state })
  }, [navigate, location.state])

  const onWechatLogin = useCallback(() => {
    'background only'
    // TODO(wechat): integrate 微信登录 SDK (lowered priority per PRD).
    showToast('微信登录接入中')
  }, [])

  const onCountryCode = useCallback(() => {
    'background only'
    navigate('/login/country-code', { state: location.state })
  }, [navigate, location.state])

  const onAgreementClick = useCallback(
    (type: string) => {
      'background only'
      navigate(`/agreement/${type}`)
    },
    [navigate],
  )

  return (
    <view className="page-sms-login p-4">
      <text className="title text-2xl font-bold text-center mb-8">登录/注册</text>
      <Form onFinish={onLoginClick}>
        <view className="phone-row" bindtap={onCountryCode}>
          <text className="country-code">+86</text>
          <Field placeholder="请输入手机号" clearable></Field>
        </view>
        <view className="code-row mt-4">
          <Field placeholder="请输入验证码" clearable></Field>
          <text className="send-code" bindtap={onSendCode}>获取验证码</text>
        </view>
        <Button onClick={onLoginClick} type="primary" text="登录/注册"></Button>
      </Form>
      <view className="other-logins mt-8">
        <text className="link" bindtap={onPasswordLogin}>账号密码登录</text>
        <text className="link" bindtap={onWechatLogin}>微信登录</text>
      </view>
      <view className="agreements mt-4">
        {LOGIN_AGREEMENTS.map((type) => (
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
