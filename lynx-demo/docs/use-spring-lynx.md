# use-spring 动画设计与 Lynx 项目适配方案

## 背景与目标
- 在现有 Lynx 项目中建立一致、可复用、可维护的动效体系，覆盖微交互、列表进场/退场、页面首屏编排与主题切换等常见场景
- 以 `@react-spring/web` 为核心，通过 `useSpring / useSprings / useTransition / useTrail / useChain / useSpringValue` 等 Hook 声明式驱动动画
- 保持对现有组件与样式的最小侵入：动效以 `style` 注入为主，尽量不改类名与 SCSS 结构

## 技术选型与兼容性
- 核心库：`@react-spring/web`（React Spring 官方 Web 版）
  - `useSpring`: 单元素/单组件动效，旗舰 Hook，适用于大多数场景
  - `useSprings`: 多元素并行动效，常用于列表、瀑布流等
  - `useTrail`: 多元素串行（自动错位）动效，适合级联进场
  - `useTransition`: 进场/退场（mount/unmount）动效，适配路由切换、Modal、Toast
  - `useChain` + `useSpringRef`: 动画编排与串联（先 A 后 B）
  - `useSpringValue`: 值级动画，适合驱动 CSS 变量或全局状态联动
- 与 Lynx 兼容性假设
  - `@lynx-js/react` 提供 React 风格的 JSX 与 Hooks 能力，React Spring 的 `animated.*` 组件可用于 Lynx 渲染层
  - 打包器 `rspeedy` 支持 ESModule 与按需导入，库体积可控
  - 若个别 CSS 特性在 Lynx 渲染层表现不佳，优先采用 `transform / opacity`，避免 `filter / clip-path` 等重排开销大或兼容性弱的属性

## 设计原则
- 声明式驱动：数据即动画状态，统一从组件 state/props 或路由/全局状态派生
- 组件内收敛：动效逻辑尽量靠近触发源（按钮、卡片、列表项），减少跨层通信
- 生命周期可控：充分利用 `onRest`、`ref`（通过 `useSpringRef`）进行串联与埋点
- 性能优先：
  - 使用 `transform`（`translate / scale / rotate`）与 `opacity` 实现 95% 场景
  - 减少 `left/top/width/height` 的直接动画，避免 Layout Thrashing
  - 将高频动效配置在轻量 preset（较低 `friction`、适中 `tension`）
- 可退化与无障碍：允许在低端设备或用户偏好下禁用或弱化动效

## API 到场景映射
- `useSpring`: 微交互与单组件动效
  - 按钮按压/悬停反馈（`scale / shadow / opacity`）
  - 卡片悬停立体感（`translateZ` 替代为 `scale + shadow`）
  - 折叠面板开合（`height/opacity` 组合，或 `clip + transform`）
- `useSprings`: 列表并行动效
  - `furniture` 画廊中多卡片同时淡入/位移
  - 自定义滚动条各元素的同步反馈
- `useTrail`: 列表级联进场
  - 卡片网格逐项错位进入
  - 导航菜单顺序显现
- `useTransition`: 进场/退场、路由过渡、Modal/Toast
  - `enter / leave` 上下文差异化动画（淡入/滑入/缩放）
  - 配合 `exitBeforeEnter` 确保先退后进的视觉连贯
- `useChain` + `useSpringRef`: 页面首屏编排
  - 先运行 Logo/主图区 `useSpring`，待稳定后再触发列表 `useTransition`
- `useSpringValue`: 值级动画
  - 主题切换（Darkmode）中以 CSS 变量渐变统一驱动
  - 进度条/滚动相关的数值平滑过渡

## 适配 Lynx 的落点与改造边界
- 组件包装（建议新增目录 `src/components/animated/`）
  - 提供基础 Animated 组件封装：`AnimatedView / AnimatedImage / AnimatedButton`
  - 内部仅包裹 `animated.div/img/button` 并透传 `className` 与 `style`
- 路由与页面过渡
  - 结合 `@tanstack/react-router`，在页面切换处以 `useTransition` 进行 `enter/leave`
  - 对家具详情页（`src/apps/furnituredetail`）的主卡片或面板应用过渡动画
- 样式与 SCSS
  - 保持现有 SCSS 文件结构不变，动画以内联 `style`（React Spring 输出）叠加
  - 若需要硬约束（如 `will-change`），可在 SCSS 中以类名增强
- 事件与触发
  - 悬停（桌面）与按压（移动）差异通过统一的交互 Hook 屏蔽
  - 视口内出现（InView）触发列表或首屏动效（可后续引入轻量 in-view 方案）

## 目录与命名建议
- `src/animations/`
  - `presets.ts`: 统一动效配置（`gentle / stiff / wobbly / swift`）
  - `helpers.ts`: 公共插值/组合工具（如颜色/角度/数值映射）
  - `useEnterFade.ts`: 常用进入动效 Hook（淡入/位移）
  - `usePressScale.ts`: 按压反馈 Hook（按压时 scale & shadow）
- `src/components/animated/`
  - `AnimatedView.tsx`、`AnimatedImage.tsx`、`AnimatedButton.tsx`
- 增量引入路线
  - 先在 `src/apps/furniture` 与 `src/apps/furnituredetail` 试点
  - 成功后推广至 `darkmode` 与 `cssunit`

## 动效预设（示意）
- `gentle`: `tension: 120, friction: 14`（轻柔，适合淡入）
- `stiff`: `tension: 200, friction: 18`（偏硬朗，适合卡片并行）
- `wobbly`: `tension: 180, friction: 12`（略回弹，适合点赞/按钮）
- `swift`: `tension: 250, friction: 20`（快速响应，适合短反馈）
（具体数值根据 Lynx 设备表现做二次校准）

## 典型场景设计（行为描述，不写代码）
- 家具画廊（`src/apps/furniture`）
  - 页面首屏：Logo/主图区基于 `useSpring` 先淡入，`useChain` 串联后触发卡片 `useTrail` 顺序进入
  - 点赞图标：点击时使用 `useSpring` 做 `scale 1 → 1.2 → 1` 的轻回弹
- 家具详情（`src/apps/furnituredetail`）
  - 图片切换：`useTransition` 对当前图片 `enter`（淡入/位移）与上一个图片 `leave`（淡出）
  - 信息面板：`useSpring` 控制 `height/opacity` 联动展开
- 主题切换（`src/apps/darkmode`）
  - 通过 `useSpringValue` 驱动关键 CSS 变量（如背景/文本/阴影），完成全局渐变
- 按钮组件（`src/components/button`）
  - 按压时 `scale + shadow`，松手 `onRest` 触发业务回调或埋点

## 集成步骤（记录，不实施）
- 依赖安装：`pnpm add @react-spring/web`
- 新增目录与预设：`src/animations/presets.ts` 等
- 建立基础 Animated 组件封装：`src/components/animated/*`
- 在两处页面落地 PoC：`furniture` 与 `furnituredetail`
- 收集设备表现与参数回调，调整 `config` 与触发策略

## 性能与测试
- 性能
  - 优先 `transform/opacity`，减少强制同步布局
  - 列表大量元素时采用 `useTrail` 替代 `useSprings`（错位进入更平滑）
  - 通过 `immediate` 或降低 `tension` 在弱性能设备上减负
- 测试
  - 组件层：快照验证 `style` 变化与 `onRest` 触发
  - 行为层：交互触发（点击/切换/进入视口）的事件流是否正确
  - 路由层：确保 `exitBeforeEnter` 时序正确

## 风险与规避
- 包体积与加载时间：按需导入，避免无用示例/工具
- 兼容性：少用复杂滤镜/裁切；优先基本视觉属性
- 交互冲突：动效不应阻塞用户输入；必要时中断或跳过动画
- 可回退路径：提供关闭动画的配置或环境变量

## 参考文档
- useSpring：https://react-spring.dev/docs/components/use-spring
- useSprings：https://react-spring.dev/docs/components/use-springs
- useTransition：https://react-spring.dev/docs/components/use-transition
- useChain：https://react-spring.dev/docs/components/use-chain
- useSpringValue：https://react-spring.dev/docs/components/use-spring-value
- useTrail：https://react-spring.dev/docs/components/use-trail

## 下一步
- 完成 PoC（家具画廊与详情页）并记录参数与设备表现
- 输出统一动效规范与可复用 Hook 列表
- 在根 README 增加指引链接，推动团队采用

## 线程适配方案（Main Thread vs Background Thread）
- Lynx 线程模型摘要
  - 事件触发在主线程，常规 JS 事件处理在后台线程；高频交互（滚动/拖拽/按压）若走后台线程，会有线程切换带来的响应延迟
  - Main Thread Script（MTS）允许在事件处理函数中以 `'main thread'` 指令切换到主线程，直接操作样式（如 `setStyleProperty`），从而消除延迟

- 选择策略
  - 背景线程（React Spring Hooks）：首屏进入、列表进/退场、非高频交互的动效，声明式、易维护、易编排
  - 主线程（MTS）：与手势强耦合的高频反馈（按压、拖拽、滚动跟随），直接写 `transform/opacity` 提升时序与跟手性
  - 组合：用 MTS 负责“触发/跟手”，由 React Spring 负责“过渡/归位/编排”（例如释放手指后的回弹）

- 背景线程版（已实现）
  - `useEnterFade`：用于显隐切换与进场（默认 `opacity + translateY + scale`）
  - `usePressScale`：用于按压反馈（缩放），暴露 `pressIn/pressOut` 供事件调用
  - 使用建议：优先 `transform/opacity`，避免布局属性动画；需要串联时使用 `useChain`

- 主线程版（设计规范，事件层适配）
  - 事件绑定：在 Lynx 组件事件回调（如 `bindtouchstart/bindtouchend/bindscroll`）首行写入 `'main thread'`
  - 更新方式：通过 `event.currentTarget.setStyleProperty('transform', 'scale(...) translate(...)')` 与 `setStyleProperty('opacity', ...)` 直接更新
  - 过渡控制：可在同一事件中设置 `transition`（例如 `transform 160ms cubic-bezier(...)` 与 `opacity 160ms ...`），随后再设置目标 `transform/opacity`，实现主线程渐变
  - 与 Hooks 的衔接：主线程事件只负责即时响应；释放或状态稳定后，调用 Hooks 的 API（例如 `usePressScale` 的 `pressOut`）做更平滑的回弹或编排

- 针对现有两个 Hooks 的适配建议
  - `usePressScale`
    - 主线程：`bindtouchstart` 直接 `setStyleProperty('transform', 'scale(0.96)')`；`bindtouchend` 设置 `transition` 后恢复 `scale(1)`
    - 背景线程：保留当前实现；在移动端高频场景，可采用“主线程压下 + 背景线程回弹”的组合
  - `useEnterFade`
    - 主线程：不建议逐帧插值；推荐一次性设置 `transition + opacity/transform` 达到渐入效果，适用于进入视口/切块首屏的轻量场景
    - 背景线程：保留当前实现，用于列表编排与复杂页面首屏的串联

- 代码组织（不强制）
  - 在 `src/animations` 下新增 `mts/` 目录，存放主线程事件适配的工具方法（例如 `applyPressScaleMTS(target, scale)` 与 `applyEnterFadeMTS(target, options)`）
  - 组件层通过环境或设备能力选择主线程/后台线程路径（例如弱性能设备默认主线程即时响应）

- 注意事项
  - 主线程事件中避免运行复杂 JS 计算；仅做必要的样式设置
  - 避免频繁改写非合成属性（如 `width/height/left/top`），保持合成层动画
  - 对 `transition` 的设置建议采用短时、ease-out 曲线；回弹由背景线程 Hooks 负责，以减少阻塞
