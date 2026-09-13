import { AuthRepository } from 'travel-data'
import { useCallback } from '@lynx-js/react'
import { useLocation, useNavigate } from 'react-router'
import { Button, Field, Form, showToast } from 'lynx-ui'
import { useState } from '@lynx-js/react/hooks'
import { useAuthStore } from '../store/authStore'
import { LOGIN_AGREEMENTS, AGREEMENT_TITLES } from './agreements'
import './PasswordLogin.scss'

/**
 * 账号密码登录 (PRD): 手机号 + 密码 + 忘记密码; B/C/D 协议勾选.
 * Replaces the original placeholder Login page.
 */
export function PasswordLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [defaultUsername] = useState('15272031107')
  const [defaultPassword] = useState('Abcde1234567')

  const onLoginClick = useCallback(async () => {
    'background only'
    const authRepo = new AuthRepository()
    const res = await authRepo.loginv1({
      userSource: 0,
      userName: defaultUsername,
      password: defaultPassword,
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
  }, [navigate, location.state, defaultUsername, defaultPassword])

  const onForgotPassword = useCallback(() => {
    'background only'
    navigate('/login/forgot-password', { state: location.state })
  }, [navigate, location.state])

  const onSmsLogin = useCallback(() => {
    'background only'
    navigate('/login/code', { state: location.state })
  }, [navigate, location.state])

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
    <view className="page-password-login p-4">
      <text className="title text-2xl font-bold text-center mb-8">账号密码登录</text>
      <Form onFinish={onLoginClick}>
        <view className="phone-row" bindtap={onCountryCode}>
          <text className="country-code">+86</text>
          <Field placeholder="请输入手机号" defaultValue={defaultUsername} clearable></Field>
        </view>
        <Field placeholder="请输入密码" type="password" defaultValue={defaultPassword} className="mt-4" clearable></Field>
        <text className="forgot-link mt-4" bindtap={onForgotPassword}>忘记密码</text>
        <Button onClick={onLoginClick} type="primary" text="登录"></Button>
      </Form>
      <view className="other-logins mt-8">
        <text className="link" bindtap={onSmsLogin}>验证码登录</text>
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
