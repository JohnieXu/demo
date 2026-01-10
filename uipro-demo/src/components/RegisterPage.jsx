import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  UserPlus, 
  Mail, 
  Lock, 
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  XCircle
} from 'lucide-react'

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, label: '弱', color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: '中', color: 'bg-yellow-500' }
    return { strength, label: '强', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleBlur = (field) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'name':
        if (!formData.name.trim()) {
          newErrors.name = '请输入姓名'
        } else if (formData.name.trim().length < 2) {
          newErrors.name = '姓名至少需要2个字符'
        }
        break
      case 'email':
        if (!formData.email) {
          newErrors.email = '请输入邮箱地址'
        } else if (!validateEmail(formData.email)) {
          newErrors.email = '请输入有效的邮箱地址'
        }
        break
      case 'password':
        if (!formData.password) {
          newErrors.password = '请输入密码'
        } else if (formData.password.length < 8) {
          newErrors.password = '密码至少需要8个字符'
        }
        break
      case 'confirmPassword':
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = '请确认密码'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = '两次输入的密码不一致'
        }
        break
    }
    
    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // 验证所有字段
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2个字符'
    }

    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 8) {
      newErrors.password = '密码至少需要8个字符'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    if (!agreedToTerms) {
      newErrors.terms = '请同意服务条款和隐私政策'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    // 模拟注册请求
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1500)
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
              <CardTitle className="text-3xl font-bold font-heading">注册成功！</CardTitle>
              <CardDescription className="text-base">
                欢迎加入 UI UX Pro Max
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong className="font-semibold">账户已创建：</strong>
                  <br />
                  <span className="text-blue-700 dark:text-blue-300 mt-1 inline-block">{formData.email}</span>
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-3">
                  我们已向您的邮箱发送了验证邮件，请查收并验证您的账户。
                </p>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link to="/login">
                  前往登录
                </Link>
              </Button>
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

        {/* 注册卡片 - Glassmorphism 效果 */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-2 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold font-heading">创建账户</CardTitle>
            <CardDescription className="text-base">
              注册您的账户以开始使用 UI UX Pro Max
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 姓名输入 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  姓名
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="请输入您的姓名"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`pl-10 h-12 text-base ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    disabled={isLoading}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    autoFocus
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

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
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`pl-10 h-12 text-base ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  密码
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="至少8个字符"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`pl-10 pr-10 h-12 text-base ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* 密码强度指示器 */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength <= 2 ? 'text-red-500' :
                        passwordStrength.strength <= 3 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className={`flex items-center gap-1 ${
                        formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''
                      }`}>
                        {formData.password.length >= 8 ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>至少8个字符</span>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''
                      }`}>
                        {/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>大小写字母</span>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        /[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''
                      }`}>
                        {/[0-9]/.test(formData.password) ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>包含数字</span>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        /[^a-zA-Z0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''
                      }`}>
                        {/[^a-zA-Z0-9]/.test(formData.password) ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>特殊字符</span>
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* 确认密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-medium">
                  确认密码
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="请再次输入密码"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`pl-10 pr-10 h-12 text-base ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    disabled={isLoading}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* 服务条款 */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked)
                      if (errors.terms) {
                        setErrors({ ...errors, terms: '' })
                      }
                    }}
                    className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">
                    我已阅读并同意{' '}
                    <Link to="/terms" className="text-primary hover:underline font-medium">
                      服务条款
                    </Link>
                    {' '}和{' '}
                    <Link to="/privacy" className="text-primary hover:underline font-medium">
                      隐私政策
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.terms}
                  </p>
                )}
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
                    注册中...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    创建账户
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

            {/* 其他注册方式 */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                使用 Google 注册
              </Button>
            </div>

            {/* 登录链接 */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                已有账户？{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          注册即表示您同意我们的{' '}
          <Link to="/terms" className="hover:underline text-primary">
            服务条款
          </Link>
          {' '}和{' '}
          <Link to="/privacy" className="hover:underline text-primary">
            隐私政策
          </Link>
        </p>
      </div>
    </div>
  )
}
