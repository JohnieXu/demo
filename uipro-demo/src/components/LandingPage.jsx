import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Type, 
  Layout, 
  BarChart3, 
  Code, 
  Sparkles,
  Zap,
  Layers,
  CheckCircle2,
  ArrowRight,
  Github,
  BookOpen
} from 'lucide-react'

export function LandingPage() {
  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "57 种 UI 样式",
      description: "Glassmorphism、Claymorphism、Minimalism、Brutalism、Neumorphism、Bento Grid、Dark Mode 等",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "95 种配色方案",
      description: "针对 SaaS、电商、医疗、金融科技、美妆等行业特定配色",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "56 种字体配对",
      description: "精选的字体组合，包含 Google Fonts 导入",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "24 种图表类型",
      description: "适用于仪表盘和分析的推荐图表",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "10 种技术栈",
      description: "React、Next.js、Vue、Nuxt.js、Svelte、SwiftUI、React Native、Flutter 等",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "98 条 UX 指南",
      description: "最佳实践、反模式和建议的无障碍规则",
      color: "from-pink-500 to-rose-500"
    }
  ]

  const techStack = [
    { name: "React 18", description: "现代化的 React 开发体验" },
    { name: "Vite", description: "快速的构建工具" },
    { name: "Tailwind CSS", description: "实用优先的 CSS 框架" },
    { name: "shadcn/ui", description: "可复制的组件库" }
  ]

  const benefits = [
    "AI 自动搜索匹配的设计系统",
    "智能推荐最佳配色和字体",
    "一键生成符合最佳实践的代码",
    "支持多种技术栈和框架",
    "完整的无障碍支持",
    "持续更新的设计资源库"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1.5" />
              AI 驱动的 UI/UX 设计系统
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-heading">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                UI UX Pro Max
              </span>
              <br />
              <span className="text-foreground">构建专业的跨平台界面</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              为构建专业的跨平台 UI/UX 提供设计智能。集成 57 种 UI 样式、95 种配色方案、56 种字体配对和 98 条 UX 指南。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                <Link to="/login">
                  开始使用
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                <Github className="mr-2 w-5 h-5" />
                查看 GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              强大的功能特性
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              从设计到实现，一站式解决你的 UI/UX 需求
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              工作原理
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              简单四步，快速构建专业界面
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "你提问", description: "请求任何 UI/UX 任务（构建、设计、创建、实现）" },
              { step: "2", title: "技能激活", description: "AI 自动在设计数据库中搜索相关的样式、颜色、字体和指南" },
              { step: "3", title: "智能推荐", description: "根据你的产品类型和需求，找到最佳匹配的设计系统" },
              { step: "4", title: "代码生成", description: "使用正确的颜色、字体、间距和最佳实践实现 UI" }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              现代化技术栈
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              基于业界最佳实践构建
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{tech.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {tech.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              为什么选择 UI UX Pro Max？
            </h2>
          </div>
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                准备开始了吗？
              </CardTitle>
              <CardDescription className="text-lg">
                立即体验 UI UX Pro Max，让 AI 帮你构建专业的 UI/UX 界面
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <BookOpen className="mr-2 w-5 h-5" />
                查看文档
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Github className="mr-2 w-5 h-5" />
                访问 GitHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p className="mb-2">
            UI UX Pro Max Demo - 演示如何使用 UI UX Pro Max Skill
          </p>
          <p className="text-sm">
            © 2024 UI UX Pro Max. 遵循 MIT 许可证。
          </p>
        </div>
      </footer>
    </div>
  )
}
