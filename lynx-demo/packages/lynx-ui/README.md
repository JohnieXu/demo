# lynx-ui 样式与主题方案

`lynx-ui` 是基于 ReactLynx 的 UI 组件库。本方案参考 `@lynx-js/lynx-ui` 的 headless + token + Tailwind 方向，同时兼容 Vant 的 CSS 变量主题体系，为组件库提供统一、可切换、可扩展的主题能力。

## 设计目标

- **统一设计 token**：颜色、字号、间距、圆角等通过 CSS 变量集中管理，不再散落在组件内联样式中。
- **支持多主题**：内置浅色/深色主题，支持通过 `ConfigProvider` 动态切换或跟随系统。
- **低成本的组件自定义**：支持全局/局部覆盖 token，以及通过 `className`、`style` 覆盖组件样式。
- **与 Tailwind 结合**：利用 Tailwind utilities 提升样式开发效率，同时通过 `@lynx-js/tailwind-preset` 保证 Lynx 兼容性。
- **渐进式迁移**：新组件优先使用本方案，旧组件可逐步迁移，不需要一次性重写。

## 核心架构

```
┌──────────────────────────────────────┐
│  Consumer App                        │
│  import 'lynx-ui/theme/tokens.css'   │
│  import 'lynx-ui/styles/index.css'   │
│  <ConfigProvider theme="light">      │
│    <Calendar />                      │
│  </ConfigProvider>                   │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  Theme Layer                         │
│  - tokens.css   (CSS 变量)            │
│  - ConfigProvider (动态主题/覆盖)      │
│  - cn()         (clsx + tailwind-merge)
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  Tailwind Layer                      │
│  - tailwind.config.ts                 │
│  - @lynx-js/tailwind-preset           │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  Component Layer                     │
│  - Button / Calendar / ...            │
│  - BEM class + CSS 变量为主           │
│  - inline style 仅用于动态尺寸/覆盖   │
└──────────────────────────────────────┘
```

## 快速开始

### 1. 引入样式

在应用入口（如 `src/apps/flight/index.tsx`）引入主题 token 与组件样式：

```tsx
import 'lynx-ui/theme/tokens.css'
import 'lynx-ui/styles/index.css'
```

### 2. 使用 ConfigProvider（可选但推荐）

```tsx
import { ConfigProvider, Calendar, Button } from 'lynx-ui'

export function App() {
  return (
    <ConfigProvider theme="light">
      <Button label="查询" />
      <Calendar type="range" />
    </ConfigProvider>
  )
}
```

如果不使用 `ConfigProvider`，也可以直接在根节点写主题类名：

```tsx
<view className="lynx-theme-light">
  <Calendar />
</view>
```

## 设计 Token（CSS 变量）

所有 token 以 `--lu-` 为前缀，定义在 `src/theme/tokens.css` 中。

### 颜色

| Token | 说明 |
|-------|------|
| `--lu-color-primary` | 品牌主色 |
| `--lu-color-primary-pressed` | 按下态主色 |
| `--lu-color-primary-subtle` | 主色弱背景 |
| `--lu-color-background` | 页面背景 |
| `--lu-color-surface` | 卡片/浮层面背景 |
| `--lu-color-text-primary` | 主文本 |
| `--lu-color-text-secondary` | 次级文本 |
| `--lu-color-text-tertiary` | 第三级文本 |
| `--lu-color-text-inverse` | 反色文本 |
| `--lu-color-text-disabled` | 禁用文本 |
| `--lu-color-border` | 边框 |
| `--lu-color-danger` | 错误/危险 |
| `--lu-color-success` | 成功 |
| `--lu-color-warning` | 警告 |
| `--lu-color-info` | 信息 |
| `--lu-color-disabled` | 禁用背景 |
| `--lu-color-mask` | 遮罩层 |

### 间距

```css
--lu-space-xs: 4px;
--lu-space-sm: 8px;
--lu-space-md: 12px;
--lu-space-lg: 16px;
--lu-space-xl: 20px;
--lu-space-2xl: 24px;
--lu-space-3xl: 32px;
```

### 圆角

```css
--lu-radius-sm: 4px;
--lu-radius-md: 8px;
--lu-radius-lg: 12px;
--lu-radius-xl: 16px;
--lu-radius-2xl: 22px;
--lu-radius-full: 9999px;
```

### 字号

```css
--lu-font-size-xs: 10px;
--lu-font-size-sm: 12px;
--lu-font-size-base: 14px;
--lu-font-size-lg: 16px;
--lu-font-size-xl: 18px;
--lu-font-size-2xl: 20px;
--lu-font-size-3xl: 24px;
```

### 主题切换

`tokens.css` 通过主题类名定义两套变量：

```css
:root,
.lynx-theme-light {
  --lu-color-primary: #ff5712;
  --lu-color-background: #ffffff;
  /* ... */
}

.lynx-theme-dark {
  --lu-color-primary: #ff8c4d;
  --lu-color-background: #000000;
  /* ... */
}
```

切换 `.lynx-theme-light` / `.lynx-theme-dark` 类名即可切换整套主题。

## ConfigProvider

`ConfigProvider` 提供动态主题切换与局部 token 覆盖能力。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | 主题模式，`auto` 读取 `lynx.__globalProps.theme` |
| `themeVars` | `ComponentThemeVars` | - | 覆盖 token（同时作用于当前主题） |
| `themeVarsDark` | `ComponentThemeVars` | - | 深色主题下覆盖 token |
| `themeVarsLight` | `ComponentThemeVars` | - | 浅色主题下覆盖 token |
| `themeVarsScope` | `'local' \| 'global'` | `'local'` | `local` 仅影响子树，`global` 写入根节点 |
| `className` | `string` | - | 额外类名 |

### 示例：品牌色定制

```tsx
<ConfigProvider
  theme="light"
  themeVars={{
    color: {
      primary: '#ff6600',
    },
  }}
>
  <Button label="品牌色按钮" />
</ConfigProvider>
```

### 示例：局部主题覆盖

```tsx
<ConfigProvider
  theme="light"
  themeVars={{
    calendar: {
      primaryColor: '#00b578',
      dayHeight: '72px',
    },
  }}
>
  <Calendar />
</ConfigProvider>
```

## Tailwind 配置

`tailwind.config.ts` 将设计 token 映射为 Tailwind theme 扩展，使组件可以使用工具类同时保持主题可切换。

```ts
colors: {
  primary: 'var(--lu-color-primary)',
  background: 'var(--lu-color-background)',
  'text-primary': 'var(--lu-color-text-primary)',
  // ...
},
spacing: {
  xs: 'var(--lu-space-xs)',
  sm: 'var(--lu-space-sm)',
  // ...
},
borderRadius: {
  sm: 'var(--lu-radius-sm)',
  md: 'var(--lu-radius-md)',
  // ...
},
fontSize: {
  xs: ['var(--lu-font-size-xs)', 'var(--lu-line-height-tight)'],
  // ...
}
```

同时注册了 Lynx 兼容的 UI 状态变体：

```ts
addVariant('ui-active', '&.ui-active')
addVariant('ui-disabled', '&.ui-disabled')
addVariant('ui-checked', '&.ui-checked')
```

禁用了 Lynx 不支持的 corePlugins（`container`、`float`、`clear`、`objectFit`、`objectPosition`）。

## 组件样式规范

### className 优先

组件以 BEM 类名承载默认样式，`style` 仅作为动态值/覆盖入口。

```tsx
// Button 示例
<view
  className={cn(
    'lu-btn',
    `lu-btn--${variant}`,
    `lu-btn--${size}`,
    disabled && 'lu-btn--disabled ui-disabled',
    className,
  )}
  style={style}
  bindtap={handleTap}
>
  <text className="lu-btn__text" style={textStyle}>{label}</text>
</view>
```

### 状态样式

`CalendarDay` 使用 BEM modifier 类表达选中/范围/禁用状态：

```css
.lu-calendar__day--selected,
.lu-calendar__day--start-end {
  background-color: var(--lu-color-primary);
  color: var(--lu-color-text-inverse);
  border-radius: var(--lu-radius-md);
}

.lu-calendar__day--middle,
.lu-calendar__day--multiple-middle {
  color: var(--lu-color-primary);
  background-color: var(--lu-color-primary-subtle);
}

.lu-calendar__day--disabled {
  color: var(--lu-color-text-disabled);
}
```

### 动态尺寸保留 inline style

对于依赖运行时计算值的场景（如 `Calendar` 的 `rowHeight`、基于 `rowHeight` 的圆角），仍使用 inline style：

```tsx
<view
  className="lu-calendar__selected-day"
  style={{
    width: toCSSSize(rowHeight),
    height: toCSSSize(rowHeight),
    borderRadius: `${parseSize(rowHeight) / 2}px`,
  }}
/>
```

## 迁移指南

### 已有组件迁移步骤

1. **抽离视觉常量**：将 `constants.ts` 中的颜色/字号/间距常量删除，仅保留文案常量。
2. **补充 token**：如组件有个性化视觉值，在 `tokens.css` 中新增 `--lu-component-*` 变量。
3. **编写组件 CSS**：在 `src/styles/{component}.css` 中按 BEM 规范书写样式。
4. **组件改用 className**：将 inline style 对象替换为 BEM 类名，必要时保留动态尺寸的 inline style。
5. **注册到 `src/styles/index.css`**：添加 `@import './{component}.css';`。
6. **补充类型**（可选）：在 `src/theme/types.ts` 的 `ComponentThemeVars` 中增加该组件可覆盖的 token。

### 新组件开发步骤

1. 在 `src/theme/tokens.css` 中声明该组件需要的 token（如有）。
2. 创建 `src/styles/{component}.css` 编写 BEM 样式。
3. 组件中使用 `cn()` 组合类名，优先 className，必要时 style。
4. 在 `src/styles/index.css` 中导入新样式。

## 构建与 px-to-vw

Tailwind 生成的 CSS 需要经过 `postcss-px-to-viewport-8-plugin` 才能在响应式应用中被正确转换为 `vw`。`postcss.config.js` 中已将 `tailwindcss` 插件置于 `postcss-px-to-viewport-8-plugin` 之前：

```js
import tailwindcss from 'tailwindcss'
import { join } from 'path'

export default {
  plugins: [
    tailwindcss({
      config: join(process.cwd(), 'packages', 'lynx-ui', 'tailwind.config.ts'),
    }),
    pxToViewportPlugin({ /* ... */ }),
  ],
}
```

## 消费示例

### 按钮

```tsx
import { Button } from 'lynx-ui'

<Button label="确定" variant="primary" size="lg" />
<Button label="取消" variant="ghost" size="md" />
<Button label="禁用" disabled />
```

### 日历

```tsx
import { Calendar } from 'lynx-ui'

<Calendar type="single" />
<Calendar type="range" />
<Calendar
  type="range"
  color="#00b578"
  minDate={new Date()}
/>
```

### 自定义主题

```tsx
import { ConfigProvider } from 'lynx-ui'

<ConfigProvider
  theme="auto"
  themeVars={{
    color: { primary: '#ff6600' },
  }}
>
  <App />
</ConfigProvider>
```

## 文件结构

```
packages/lynx-ui/
├── tailwind.config.ts          # Tailwind 配置
├── src/theme/
│   ├── tokens.css              # 全局 CSS 变量
│   ├── types.ts                # 主题类型定义
│   ├── cn.ts                   # clsx + tailwind-merge 封装
│   ├── ConfigProvider.tsx      # 主题切换/覆盖 Provider
│   ├── context.ts              # ConfigContext
│   └── index.ts                # 主题工具导出
├── src/styles/
│   ├── index.css               # 组件样式聚合入口
│   ├── button.css              # Button 样式
│   └── calendar.css            # Calendar 样式
├── src/Button/
├── src/Calendar/
└── src/index.tsx               # 组件与主题工具统一导出
```

## 注意事项

- Lynx 3.6+ 支持 CSS 自定义属性，旧版本需谨慎使用。
- Tailwind 工具类经 `@lynx-js/tailwind-preset` 过滤，避免使用不支持的 CSS 属性。
- `data-*` 属性在 Lynx JSX 中不能直接作为 prop 传递，状态表达优先使用 BEM modifier 类名。
- `style` 仍是合法的覆盖入口，但应避免用它表达静态视觉样式。
