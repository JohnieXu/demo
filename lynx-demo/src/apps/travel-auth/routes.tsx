import { Route, Routes } from 'react-router'
import { App } from './App'
import { Login } from './views/Login'
import { Logout } from './views/Logout'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  )
}

/**
 * Plain route fragment for embedding into a host app (e.g. flight).
 *
 * Unlike AppRoutes this is NOT wrapped in <Routes> and brings no providers
 * (ToastProvider is expected from the host), so it can be dropped directly
 * inside the host's <Route element={<App/>}> tree.
 */
export function AuthRoutes() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
    </>
  )
}
