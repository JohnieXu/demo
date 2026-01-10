import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/components/LandingPage'
import { LoginPage } from '@/components/LoginPage'
import { ForgotPasswordPage } from '@/components/ForgotPasswordPage'
import { RegisterPage } from '@/components/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
