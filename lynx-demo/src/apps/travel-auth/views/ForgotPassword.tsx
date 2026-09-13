import { useCallback, useEffect, useState } from '@lynx-js/react'
import { useLocation, useNavigate } from 'react-router'
import { Button, Field, Form, showToast } from 'lynx-ui'
import './ForgotPassword.scss'

const RESEND_COUNTDOWN_SECONDS = 60

/**
 * 找回密码 (PRD): 手机号 + 验证码 + 重发倒计时 + 下一步.
 * After the code is verified, 下一步 navigates to /login/reset-password.
 */
export function ForgotPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const onSendCode = useCallback(() => {
    'background only'
    // TODO(send-code): call the send-code API.
    setCountdown(RESEND_COUNTDOWN_SECONDS)
    showToast('验证码已发送')
  }, [])

  const onNext = useCallback(() => {
    'background only'
    // TODO(verify-code): verify the code before proceeding.
    navigate('/login/reset-password', { state: location.state })
  }, [navigate, location.state])

  const onCountryCode = useCallback(() => {
    'background only'
    navigate('/login/country-code', { state: location.state })
  }, [navigate, location.state])

  return (
    <view className="page-forgot-password p-4">
      <text className="title text-2xl font-bold text-center mb-8">找回密码</text>
      <Form onFinish={onNext}>
        <view className="phone-row" bindtap={onCountryCode}>
          <text className="country-code">+86</text>
          <Field placeholder="请输入手机号" clearable></Field>
        </view>
        <view className="code-row mt-4">
          <Field placeholder="请输入验证码" clearable></Field>
          <text
            className={countdown > 0 ? 'send-code disabled' : 'send-code'}
            bindtap={countdown > 0 ? undefined : onSendCode}
          >
            {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
          </text>
        </view>
        <Button onClick={onNext} type="primary" text="下一步"></Button>
      </Form>
    </view>
  )
}
