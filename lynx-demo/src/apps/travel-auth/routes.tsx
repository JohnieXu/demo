import { Route, Routes } from 'react-router'
import { App } from './App'
import { Login } from './views/Login'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  )
}
