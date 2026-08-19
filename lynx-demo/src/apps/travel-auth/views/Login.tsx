import { AuthRepository, setAuthToken } from 'travel-data'
import { useCallback } from '@lynx-js/react';
import { Button, Field, Form, showToast } from 'lynx-ui';
import './Login.scss';

export function Login() {
  const onLoginClick = useCallback(async () => {
    'background only';
    const authRepo = new AuthRepository();
    const res = await authRepo.loginv1({
      channel: '',
      userSource: 0,
      userName: '15827367591',
      password: 'Abcde1234567',
      userType: '',
    });
    if (res.isSuccess) {
      setAuthToken(res.data.loginToken!);
      showToast('登录成功');
    } else {
      showToast(res.error?.message || '登录失败');
    }
  }, []);
  const onFormSubmit = useCallback(() => {
    'background only';
    onLoginClick();
  }, [onLoginClick]);

  return (
    <view className="page-login p-4">
      <text className="title text-2xl font-bold text-center mb-8">Login</text>
      <Form onFinish={onFormSubmit}>
        <Field placeholder="请输入账号"></Field>
        <Field placeholder="请输入密码" type="password"></Field>
        <Button onClick={onLoginClick} type="primary" text="登录"></Button>
      </Form>
    </view>
  );
}
