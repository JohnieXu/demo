import { AuthRepository } from 'travel-data'
import { useCallback } from '@lynx-js/react';
import { useLocation, useNavigate } from 'react-router'
import { Button, Field, Form, showToast } from 'lynx-ui';
import { useAuthStore } from '../store/authStore'
import './Login.scss';

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const onLoginClick = useCallback(async () => {
    'background only';
    const authRepo = new AuthRepository();
    const res = await authRepo.loginv1({
      userSource: 0,
      userName: '15272031107',
      password: 'Abcde1234567',
      userType: 'Mobile',
      // promotionChannelCode: "24",
      // shopkeeperId: "95",
      channel: "14|75|76"
    });
    if (res.isSuccess) {
      // Single write path: the store syncs the token into travel-data internally.
      useAuthStore.getState().setAuth(res.data);
      showToast('登录成功');
      const res2 = await authRepo.getBasic({
        memberId: res.data.memberId!,
      })
      if (res2.isSuccess) {
        useAuthStore.getState().setProfile(res2.data)
        showToast('get-basic 成功' + res2.data.userName)
      } else {
        showToast('get-basic 失败' + res2.error?.message)
      }
      // Return to the page that required auth, falling back to the host root.
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/', { replace: true })
    } else {
      showToast(res.error?.message || '登录失败');
    }
  }, [navigate, location.state]);
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
