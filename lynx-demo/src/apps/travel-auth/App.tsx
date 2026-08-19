import { Outlet } from "react-router";
import { ToastProvider } from 'lynx-ui';
import './App.css';

export function App() {
  return (
    <ToastProvider>
      <view className="app-auth">
        <Outlet></Outlet>
      </view>
    </ToastProvider>
  );
}
