import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mail, 
  ArrowLeft,
  CheckCircle2,
  Send,
  ArrowRight
} from 'lucide-react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // 验证邮箱
    if (!email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!validateEmail(email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    // 模拟发送重置链接
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1500)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    // 清除错误状态（inline validation）
    if (errors.email) {
      setErrors({ ...errors, email: '' })
    }
  }

  const handleEmailBlur = () => {
    // 失焦时验证
    if (email && !validateEmail(email)) {
      setErrors({ ...errors, email: '请输入有效的邮箱地址' })
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* 成功状态卡片 */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-2 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold font-heading">邮件已发送</CardTitle>
              <CardDescription className="text-base">
                我们已向您的邮箱发送了密码重置链接
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong className="font-semibold">请检查您的邮箱：</strong>
                  <br />
                  <span className="text-blue-700 dark:text-blue-300 mt-1 inline-block">{email}</span>
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-3">
                  如果未收到邮件，请检查垃圾邮件文件夹，或稍后重试。
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link to="/login">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    返回登录
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail('')
                  }}
                >
                  重新发送
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                没有收到邮件？{' '}
                <button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail('')
                  }}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  使用其他邮箱
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* 返回按钮 */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          返回登录
        </Link>

        {/* 忘记密码卡片 - Glassmorphism 效果 */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-2 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold font-heading">忘记密码？</CardTitle>
            <CardDescription className="text-base">
              请输入您的邮箱地址，我们将发送密码重置链接给您
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 邮箱输入 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  邮箱地址
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    className={`pl-10 h-12 text-base ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  我们将向此邮箱发送密码重置说明
                </p>
              </div>

              {/* 提交按钮 */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    发送中...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    发送重置链接
                  </>
                )}
              </Button>
            </form>

            {/* 分隔线 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">或者</span>
              </div>
            </div>

            {/* 返回登录 */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                记起密码了？{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  返回登录
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          如果您需要帮助，请联系{' '}
          <Link to="/support" className="hover:underline text-primary">
            客服支持
          </Link>
        </p>
      </div>
    </div>
  )
}
