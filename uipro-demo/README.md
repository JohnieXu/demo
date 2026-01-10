# UI UX Pro Max Demo

这是一个验证如何使用 [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 的演示项目。

## 技术栈

- **React 18** - 现代化的 React 开发体验
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 可复制的组件库，基于 Radix UI 和 Tailwind CSS

## 关于 UI UX Pro Max

UI UX Pro Max 是一个 AI 技能，为构建专业的跨平台 UI/UX 提供设计智能。它包含：

- **57 种 UI 样式** - Glassmorphism、Claymorphism、Minimalism、Brutalism、Neumorphism、Bento Grid、Dark Mode 等
- **95 种配色方案** - 针对 SaaS、电商、医疗、金融科技、美妆等行业特定配色
- **56 种字体配对** - 精选的字体组合，包含 Google Fonts 导入
- **24 种图表类型** - 适用于仪表盘和分析的推荐图表
- **10 种技术栈** - React、Next.js、Vue、Nuxt.js、Nuxt UI、Svelte、SwiftUI、React Native、Flutter、HTML+Tailwind
- **98 条 UX 指南** - 最佳实践、反模式和建议的无障碍规则

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 安装 UI UX Pro Max Skill

### 使用 CLI（推荐）

```bash
# 全局安装 CLI
npm install -g uipro-cli

# 进入项目目录
cd /path/to/your/project

# 为 Cursor 安装（推荐）
uipro init --ai cursor
```

### 手动安装

将以下文件夹复制到项目中：

- `.cursor/commands/ui-ux-pro-max.md`
- `.shared/ui-ux-pro-max/`

## 使用 shadcn/ui 组件

### 初始化 shadcn/ui

项目已配置好 shadcn/ui，你可以直接使用 CLI 添加组件：

```bash
# 安装 shadcn/ui CLI（如果还没有）
npx shadcn@latest init

# 添加组件
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# ... 更多组件
```

### 可用组件

查看 [shadcn/ui 文档](https://ui.shadcn.com/docs/components) 了解所有可用组件。

## 使用方法

### 在 Cursor 中使用

使用斜杠命令来调用技能：

```
/ui-ux-pro-max 为我的 SaaS 产品构建一个落地页
```

### 示例提示

```
为我的 SaaS 产品构建一个落地页

创建一个医疗分析仪表盘

设计一个带暗色模式的个人作品集网站

制作一个电商移动应用 UI
```

## 工作原理

1. **你提问** - 请求任何 UI/UX 任务（构建、设计、创建、实现、审查、修复、改进）
2. **技能激活** - AI 自动在设计数据库中搜索相关的样式、颜色、字体和指南
3. **智能推荐** - 根据你的产品类型和需求，找到最佳匹配的设计系统
4. **代码生成** - 使用正确的颜色、字体、间距和最佳实践实现 UI

## 项目结构

```
uipro-demo/
├── src/
│   ├── components/      # React 组件
│   │   └── ui/         # shadcn/ui 组件
│   ├── lib/            # 工具函数
│   │   └── utils.js    # cn() 工具函数
│   ├── App.jsx         # 主应用组件
│   ├── main.jsx        # 入口文件
│   └── index.css       # 全局样式和 Tailwind
├── .cursor/            # Cursor 配置
├── components.json     # shadcn/ui 配置
├── tailwind.config.js # Tailwind 配置
├── vite.config.js     # Vite 配置
└── package.json       # 项目依赖
```

## 推荐组件库：shadcn/ui

本项目使用 **shadcn/ui** 作为 UI 组件库，原因如下：

- ✅ **完全基于 Tailwind CSS** - 与项目技术栈完美匹配
- ✅ **可复制的组件** - 组件代码直接在你的项目中，完全可控
- ✅ **高度可定制** - 可以轻松修改组件样式和行为
- ✅ **无障碍支持** - 基于 Radix UI，提供优秀的无障碍体验
- ✅ **现代化设计** - 美观、现代的 UI 组件
- ✅ **活跃的社区** - 持续更新和丰富的组件库

## 资源

- [UI UX Pro Max GitHub 仓库](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [官方文档网站](https://ui-ux-pro-max-skill.nextlevelbuilder.io)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [React 文档](https://react.dev)
- [Vite 文档](https://vitejs.dev)

## 许可证

本项目遵循 MIT 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**：本项目仅用于演示目的，展示如何使用 UI UX Pro Max Skill 来提升你的 UI/UX 开发工作流程。
