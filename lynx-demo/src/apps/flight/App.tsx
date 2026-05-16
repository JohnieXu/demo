import { Outlet } from 'react-router'
import "./App.scss"

export function App() {
  return <view className="app">
    <Outlet />
  </view>
}
