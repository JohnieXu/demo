import { Outlet } from 'react-router'
import { DialogProvider } from './components/dialog/index';
import './App.scss';

export function App() {
  return (
    <DialogProvider>
      <view className="app">
        <Outlet />
      </view>
    </DialogProvider>
  );
}
