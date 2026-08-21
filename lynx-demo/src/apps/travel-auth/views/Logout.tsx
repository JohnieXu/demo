import { AuthRepository } from 'travel-data'
import { useCallback } from '@lynx-js/react';
import { useNavigate } from 'react-router'
import { Button, showToast } from 'lynx-ui';
import { useAuthStore } from '../store/authStore'
import './Logout.scss';

export function Logout() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const userName = useAuthStore((s) => s.userName)

  const onLogoutClick = useCallback(async () => {
    'background only';
    const authRepo = new AuthRepository();
    const res = await authRepo.logout({});
    if (!res.isSuccess) {
      // Server-side invalidation failed; still clear the local session so
      // the user is not stuck in a half-logged-in state.
      showToast(res.error?.message || '退出失败，已清除本地登录状态');
    }
    // Single write path: the store clears the token from travel-data internally.
    useAuthStore.getState().clearAuth();
    showToast('已退出登录');
    navigate('/login', { replace: true });
  }, [navigate]);

  const onLoginClick = useCallback(() => {
    'background only';
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <view className="page-logout p-4">
      {isAuthenticated ? (
        <>
          <text className="title text-2xl font-bold text-center mb-8">
            {userName ?? '已登录'}
          </text>
          <Button onClick={onLogoutClick} type="primary" text="退出登录"></Button>
        </>
      ) : (
        <>
          <text className="title text-2xl font-bold text-center mb-8">当前未登录</text>
          <Button onClick={onLoginClick} type="primary" text="去登录"></Button>
        </>
      )}
    </view>
  );
}
