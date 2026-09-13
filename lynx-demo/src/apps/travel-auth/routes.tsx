import { Route, Routes } from 'react-router'
import { App } from './App'
import { QuickLogin } from './views/QuickLogin'
import { SmsLogin } from './views/SmsLogin'
import { PasswordLogin } from './views/PasswordLogin'
import { ForgotPassword } from './views/ForgotPassword'
import { ResetPassword } from './views/ResetPassword'
import { CountryCodePicker } from './views/CountryCodePicker'
import { Agreement } from './views/Agreement'
import { Logout } from './views/Logout'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<QuickLogin />} />
        {AuthRoutes()}
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
      <Route path="/login" element={<QuickLogin />} />
      <Route path="/login/code" element={<SmsLogin />} />
      <Route path="/login/password" element={<PasswordLogin />} />
      <Route path="/login/forgot-password" element={<ForgotPassword />} />
      <Route path="/login/reset-password" element={<ResetPassword />} />
      <Route path="/login/country-code" element={<CountryCodePicker />} />
      <Route path="/agreement/:type" element={<Agreement />} />
      <Route path="/logout" element={<Logout />} />
    </>
  )
}
