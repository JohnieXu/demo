import { AuthRepository, setAuthToken } from 'travel-data'
import { useCallback } from '@lynx-js/react';
import { Button, Field, Form } from 'lynx-ui';
import "./Login.scss";

export function Login() {
  const onLoginClick = useCallback(async () => {
    const authRepo = new AuthRepository();
    const res = await authRepo.loginv1({
      channel: '',
      userSource: 0,
      userName: '',
      password: '',
      userType: ''
    })
    if (res.isSuccess) {
      setAuthToken(res.data.loginToken!)
    }
  }, [])
  const onFormSubmit = useCallback(() => {
    onLoginClick()
  }, [onLoginClick])

  return (
    <view className="page-login">
      <text>Login</text>
      <Form onFinish={onFormSubmit}>
        <Field placeholder="请输入账号"></Field>
        <Field placeholder="请输入密码" type="password"></Field>
        <Button onClick={onLoginClick} type="primary">登录</Button>
      </Form>
    </view>
  )
}
