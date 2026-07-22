import { Outlet } from 'react-router'
import { DialogProvider } from './components/dialog/index';
import { useBackHandler } from './hooks/useBackHandler';
import './App.css';
import './theme.css';

export function App() {
  // Use the back handler hook to intercept system back gestures
  useBackHandler();

  return (
    <DialogProvider>
      <view className="app lynx-theme-light">
        <Outlet />
      </view>
    </DialogProvider>
  );
}
