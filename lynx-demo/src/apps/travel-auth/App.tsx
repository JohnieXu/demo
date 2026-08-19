import { Outlet } from "react-router";
import "./App.css";

export function App() {
  return (
    <view className="app-auth">
      <Outlet></Outlet>
    </view>
  )
}
