# UI UX Pro Max Demo - 项目框架设计文档

## 1. 项目概述

### 1.1 项目目标

本项目是一个演示项目，用于验证和展示如何使用 [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 来构建专业的 UI/UX 界面。项目旨在提供一个现代化的、可扩展的 React 应用框架，集成最佳实践的设计系统和开发工具。

### 1.2 核心特性

- 🎨 **设计系统集成** - 与 UI UX Pro Max Skill 无缝集成，支持 57 种 UI 样式和 95 种配色方案
- ⚡ **现代化技术栈** - React 18 + Vite + Tailwind CSS
- 🧩 **组件化开发** - 基于 shadcn/ui 的可复制组件库
- 🎯 **开发体验优化** - 热模块替换、路径别名、代码规范
- 🌙 **主题支持** - 内置亮色/暗色主题切换
- ♿ **无障碍支持** - 基于 Radix UI 的无障碍组件

## 2. 技术架构

### 2.1 架构图

```
┌─────────────────────────────────────────────────────────┐
│                    用户界面层 (UI Layer)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  Components  │  │   Layouts    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  组件库层 (Component Library)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  shadcn/ui   │  │  Custom UI   │  │   Icons      │  │
│  │  Components  │  │  Components  │  │  (Lucide)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   样式层 (Styling Layer)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Tailwind CSS │  │  CSS Vars    │  │   Themes    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   工具层 (Utilities Layer)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Utils      │  │    Hooks     │  │   Helpers   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   框架层 (Framework Layer)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    React     │  │     Vite     │  │   ESLint     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技术栈分层

#### 核心框架层
- **React 18.3+** - UI 框架
- **Vite 5.4+** - 构建工具和开发服务器

#### 样式层
- **Tailwind CSS 3.4+** - 实用优先的 CSS 框架
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - 自动添加浏览器前缀

#### 组件层
- **shadcn/ui** - 可复制的组件库
- **Radix UI** - 无样式组件基座（shadcn/ui 底层）
- **Lucide React** - 图标库

#### 工具层
- **clsx** - 条件类名工具
- **tailwind-merge** - Tailwind 类名合并工具
- **class-variance-authority** - 组件变体管理

#### 开发工具层
- **ESLint** - 代码质量检查
- **React Hooks ESLint Plugin** - React Hooks 规则

## 3. 技术选型及理由

### 3.1 React 18

**选择理由：**
- ✅ 成熟稳定的 UI 框架，拥有庞大的生态系统
- ✅ React 18 引入了并发特性，提升性能
- ✅ 优秀的开发体验和丰富的社区支持
- ✅ 与 UI UX Pro Max Skill 完美兼容

**版本要求：** `^18.3.1`

### 3.2 Vite

**选择理由：**
- ✅ 极快的开发服务器启动速度（毫秒级）
- ✅ 基于 ESM 的热模块替换（HMR）
- ✅ 优化的生产构建
- ✅ 原生支持 TypeScript、JSX
- ✅ 插件生态丰富

**版本要求：** `^5.4.2`

### 3.3 Tailwind CSS

**选择理由：**
- ✅ 实用优先的设计理念，开发效率高
- ✅ 高度可定制，支持设计系统变量
- ✅ 生产构建时自动移除未使用的样式
- ✅ 与 shadcn/ui 完美集成
- ✅ 支持暗色模式

**版本要求：** `^3.4.13`

### 3.4 shadcn/ui

**选择理由：**
- ✅ **可复制性** - 组件代码直接在你的项目中，完全可控
- ✅ **基于 Tailwind** - 与项目技术栈完美匹配
- ✅ **高度可定制** - 可以轻松修改组件样式和行为
- ✅ **无障碍支持** - 基于 Radix UI，提供优秀的无障碍体验
- ✅ **现代化设计** - 美观、现代的 UI 组件
- ✅ **活跃的社区** - 持续更新和丰富的组件库
- ✅ **与 UI UX Pro Max 兼容** - 可以轻松应用设计系统

**组件管理方式：**
- 使用 CLI 添加组件：`npx shadcn@latest add [component-name]`
- 组件代码直接复制到 `src/components/ui/` 目录
- 可以随时修改组件代码

## 4. 目录结构设计

### 4.1 完整目录结构

```
uipro-demo/
├── .cursor/                    # Cursor AI 配置
│   └── commands/
│       └── ui-ux-pro-max.md    # UI UX Pro Max 技能命令
├── .shared/                    # 共享资源（UI UX Pro Max）
│   └── ui-ux-pro-max/
├── docs/                       # 文档目录
│   └── DESIGN.md              # 本文档
├── public/                     # 静态资源
│   └── vite.svg               # Vite 图标
├── src/                        # 源代码目录
│   ├── components/            # 组件目录
│   │   ├── ui/               # shadcn/ui 组件（自动生成）
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   └── ...
│   │   └── custom/           # 自定义业务组件
│   │       └── ...
│   ├── hooks/                 # 自定义 React Hooks
│   │   └── use-theme.js      # 主题切换 Hook（示例）
│   ├── lib/                   # 工具函数库
│   │   └── utils.js          # 通用工具函数（cn 等）
│   ├── pages/                 # 页面组件（可选）
│   │   └── ...
│   ├── styles/                # 样式文件（可选）
│   │   └── ...
│   ├── App.jsx               # 根组件
│   ├── main.jsx              # 应用入口
│   └── index.css             # 全局样式和 Tailwind
├── .eslintrc.cjs              # ESLint 配置
├── .gitignore                 # Git 忽略文件
├── components.json            # shadcn/ui 配置
├── index.html                 # HTML 模板
├── package.json               # 项目依赖和脚本
├── postcss.config.js          # PostCSS 配置
├── README.md                  # 项目说明
├── tailwind.config.js         # Tailwind CSS 配置
└── vite.config.js             # Vite 配置
```

### 4.2 目录设计原则

#### 4.2.1 组件组织

**shadcn/ui 组件 (`src/components/ui/`)**
- 由 CLI 自动生成和管理
- 不要手动修改，除非需要自定义
- 每个组件都是独立的文件

**自定义组件 (`src/components/custom/`)**
- 业务相关的复合组件
- 可以组合使用 shadcn/ui 组件
- 按功能模块组织子目录

**示例结构：**
```
src/components/
├── ui/                    # shadcn/ui 组件
│   ├── button.jsx
│   └── card.jsx
└── custom/                # 自定义组件
    ├── header/
    │   └── Header.jsx
    ├── footer/
    │   └── Footer.jsx
    └── dashboard/
        ├── DashboardCard.jsx
        └── DashboardStats.jsx
```

#### 4.2.2 工具函数组织

**`src/lib/utils.js`**
- 通用工具函数
- 必须包含 `cn()` 函数（用于合并 Tailwind 类名）
- 可以添加其他通用工具函数

**扩展建议：**
```javascript
// src/lib/utils.js
export function cn(...inputs) { /* ... */ }
export function formatDate(date) { /* ... */ }
export function debounce(func, wait) { /* ... */ }
```

#### 4.2.3 Hooks 组织

**`src/hooks/`**
- 自定义 React Hooks
- 按功能命名：`use-theme.js`, `use-local-storage.js`
- 可复用的业务逻辑

## 5. 设计原则

### 5.1 组件设计原则

#### 5.1.1 单一职责原则
- 每个组件只负责一个功能
- 保持组件小而专注

#### 5.1.2 可组合性
- 使用组合而非继承
- 通过 props 传递配置和行为

#### 5.1.3 可访问性
- 使用语义化 HTML
- 支持键盘导航
- 提供 ARIA 属性

### 5.2 样式设计原则

#### 5.2.1 实用优先
- 优先使用 Tailwind 工具类
- 避免自定义 CSS，除非必要

#### 5.2.2 设计系统一致性
- 使用 CSS 变量定义颜色和间距
- 遵循 shadcn/ui 的设计令牌

#### 5.2.3 响应式设计
- 移动优先的设计方法
- 使用 Tailwind 响应式前缀

### 5.3 代码组织原则

#### 5.3.1 模块化
- 按功能组织代码
- 保持文件结构清晰

#### 5.3.2 可维护性
- 使用有意义的命名
- 添加必要的注释
- 保持代码简洁

#### 5.3.3 可扩展性
- 预留扩展接口
- 避免硬编码
- 使用配置文件

## 6. 开发规范

### 6.1 代码风格

#### 6.1.1 命名规范

**组件命名：**
- 使用 PascalCase：`Button.jsx`, `DashboardCard.jsx`
- 文件名与组件名保持一致

**函数命名：**
- 使用 camelCase：`handleClick`, `formatDate`
- Hook 以 `use` 开头：`useTheme`, `useLocalStorage`

**常量命名：**
- 使用 UPPER_SNAKE_CASE：`API_BASE_URL`, `MAX_RETRY_COUNT`

#### 6.1.2 文件组织

**组件文件结构：**
```jsx
// 1. 导入依赖
import React from 'react'
import { cn } from '@/lib/utils'

// 2. 组件定义
export function ComponentName({ className, ...props }) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* 组件内容 */}
    </div>
  )
}
```

### 6.2 路径别名

项目配置了路径别名 `@`，指向 `src/` 目录：

```javascript
// vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

**使用示例：**
```javascript
// ✅ 推荐：使用别名
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ❌ 不推荐：相对路径
import { cn } from '../../lib/utils'
```

### 6.3 Tailwind 类名管理

使用 `cn()` 函数合并类名：

```jsx
import { cn } from '@/lib/utils'

function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        "base-button-classes",
        variant === "primary" && "primary-classes",
        className
      )}
      {...props}
    />
  )
}
```

### 6.4 组件 Props 设计

#### 6.4.1 使用展开运算符
```jsx
function Card({ className, children, ...props }) {
  return (
    <div className={cn("card-base", className)} {...props}>
      {children}
    </div>
  )
}
```

#### 6.4.2 提供默认值
```jsx
function Button({ 
  variant = "default",
  size = "md",
  ...props 
}) {
  // ...
}
```

### 6.5 状态管理

**简单状态：** 使用 `useState`
```jsx
const [count, setCount] = useState(0)
```

**复杂状态：** 使用 `useReducer`
```jsx
const [state, dispatch] = useReducer(reducer, initialState)
```

**全局状态：** 考虑使用 Context API 或状态管理库（如 Zustand）

## 7. 主题系统

### 7.1 主题变量

主题通过 CSS 变量定义在 `src/index.css` 中：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... 更多变量 */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... 更多变量 */
}
```

### 7.2 主题切换

**实现方式：**
1. 在 `html` 元素上切换 `dark` 类
2. CSS 变量自动应用对应的主题值

**示例 Hook：**
```javascript
// src/hooks/use-theme.js
export function useTheme() {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  
  return [theme, setTheme]
}
```

### 7.3 自定义主题

可以通过修改 CSS 变量来创建自定义主题：

```css
:root[data-theme="custom"] {
  --primary: 142 76% 36%;
  --primary-foreground: 355 100% 97%;
  /* ... */
}
```

## 8. 构建和部署

### 8.1 开发环境

```bash
npm run dev
```

- 启动开发服务器（默认 `http://localhost:5173`）
- 支持热模块替换（HMR）
- 快速刷新

### 8.2 生产构建

```bash
npm run build
```

**构建输出：**
- 输出目录：`dist/`
- 代码分割和优化
- 自动压缩和 Tree-shaking

### 8.3 预览构建

```bash
npm run preview
```

- 本地预览生产构建
- 用于测试构建结果

### 8.4 代码检查

```bash
npm run lint
```

- 运行 ESLint
- 检查代码质量和规范

## 9. 扩展性设计

### 9.1 添加新组件

#### 使用 shadcn/ui CLI
```bash
npx shadcn@latest add [component-name]
```

#### 创建自定义组件
1. 在 `src/components/custom/` 创建组件文件
2. 使用 shadcn/ui 组件作为基础
3. 添加业务逻辑和样式

### 9.2 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在路由配置中注册（如果使用路由）
3. 使用布局组件包装

### 9.3 集成路由

**推荐使用 React Router：**
```bash
npm install react-router-dom
```

**示例配置：**
```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### 9.4 集成状态管理

**简单场景：** Context API
**复杂场景：** Zustand, Redux Toolkit, Jotai

### 9.5 集成 API 客户端

**推荐：**
- Axios
- Fetch API
- React Query (用于数据获取和缓存)

## 10. 性能优化

### 10.1 代码分割

Vite 自动进行代码分割，可以通过动态导入进一步优化：

```jsx
const LazyComponent = lazy(() => import('./LazyComponent'))
```

### 10.2 图片优化

- 使用现代图片格式（WebP, AVIF）
- 实现懒加载
- 使用 Vite 的静态资源处理

### 10.3 CSS 优化

- Tailwind 自动移除未使用的样式
- 生产构建时自动压缩 CSS

### 10.4 React 优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 和 `useCallback` 优化计算和函数

## 11. 无障碍性（A11y）

### 11.1 基本原则

- 使用语义化 HTML
- 提供适当的 ARIA 属性
- 支持键盘导航
- 确保颜色对比度

### 11.2 shadcn/ui 支持

shadcn/ui 基于 Radix UI，提供开箱即用的无障碍支持：
- 键盘导航
- 屏幕阅读器支持
- 焦点管理
- ARIA 属性

### 11.3 测试工具

- WAVE 浏览器扩展
- axe DevTools
- Lighthouse

## 12. 测试策略

### 12.1 单元测试

**推荐工具：**
- Vitest（与 Vite 集成）
- React Testing Library

### 12.2 组件测试

测试组件的行为和渲染：

```javascript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### 12.3 E2E 测试

**推荐工具：**
- Playwright
- Cypress

## 13. 与 UI UX Pro Max Skill 集成

### 13.1 技能激活

在 Cursor 中使用斜杠命令：
```
/ui-ux-pro-max 构建一个 SaaS 落地页
```

### 13.2 设计系统应用

技能会自动：
1. 搜索匹配的 UI 样式
2. 推荐配色方案
3. 选择字体配对
4. 应用 UX 指南

### 13.3 组件生成

技能生成的组件会：
- 使用 shadcn/ui 作为基础
- 应用 Tailwind CSS 样式
- 遵循项目代码规范
- 包含无障碍支持

## 14. 最佳实践总结

### 14.1 开发流程

1. **设计阶段** - 使用 UI UX Pro Max Skill 获取设计建议
2. **组件开发** - 使用 shadcn/ui 组件快速构建
3. **样式定制** - 使用 Tailwind CSS 调整样式
4. **测试验证** - 确保功能和可访问性
5. **优化迭代** - 性能优化和用户体验改进

### 14.2 代码质量

- ✅ 遵循 ESLint 规则
- ✅ 保持组件小而专注
- ✅ 使用 TypeScript（可选，但推荐）
- ✅ 编写清晰的注释
- ✅ 保持代码一致性

### 14.3 文档维护

- 更新 README.md
- 维护组件文档
- 记录设计决策
- 更新变更日志

## 15. 参考资料

### 15.1 官方文档

- [React 文档](https://react.dev)
- [Vite 文档](https://vitejs.dev)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Radix UI 文档](https://www.radix-ui.com)

### 15.2 UI UX Pro Max

- [GitHub 仓库](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [官方文档](https://ui-ux-pro-max-skill.nextlevelbuilder.io)

### 15.3 设计资源

- [Tailwind UI](https://tailwindui.com)
- [Heroicons](https://heroicons.com)
- [Lucide Icons](https://lucide.dev)

---

**文档版本：** 1.0.0  
**最后更新：** 2026-01-10  
**维护者：** 项目团队
