import { useCallback } from '@lynx-js/react'
import { useLocation, useNavigate } from 'react-router'
import { Button, Field, Form, showToast } from 'lynx-ui'
import './ResetPassword.scss'

const PASSWORD_MIN_LENGTH = 12
const PASSWORD_MAX_LENGTH = 20
const PASSWORD_RULE_TEXT = `密码为 ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} 位，3 种以上大、小写字母、数字、特殊字符组合`

/**
 * 重置密码 (PRD): 新密码 + 确认密码 + 密码规则提示.
 * On success returns to /login/password.
 */
export function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = useCallback(() => {
    'background only'
    // TODO(reset-password): call the reset-password API with the verified
    // code carried over from 找回密码.
    showToast('密码重置成功')
    navigate('/login/password', { replace: true, state: location.state })
  }, [navigate, location.state])

  return (
    <view className="page-reset-password p-4">
      <text className="title text-2xl font-bold text-center mb-8">重置密码</text>
      <Form onFinish={onSubmit}>
        <Field placeholder="请输入新密码" type="password" clearable></Field>
        <Field placeholder="请确认新密码" type="password" className="mt-4" clearable></Field>
        <text className="password-rule mt-4">{PASSWORD_RULE_TEXT}</text>
        <Button onClick={onSubmit} type="primary" text="确认"></Button>
      </Form>
    </view>
  )
}
