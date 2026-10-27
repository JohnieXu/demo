# lynx-demo（ReactLynx 多入口 demo monorepo）Agent 规则

> owner: JohnieXu
> updated: 2026-10-27
> 本文件是本仓库 AI 规则的**唯一真源**。

<!-- global:start 由 standards/global-standards.md 同步，勿手工修改 -->
<!-- global:end -->

## 一、本仓库技术形态
- 项目：lynx-demo —— 基于 `create-rspeedy` 引导的 ReactLynx 项目（React-like 框架，运行在 Lynx 移动端渲染引擎上），开发时用 LynxExplorer App 扫二维码预览
- 技术栈：
  - 框架：`@lynx-js/react` ^0.120.0、`@lynx-js/rspeedy` ^0.14.3（构建工具，**不是标准 Vite**）
  - 路由/状态：`@tanstack/react-router` ^1.170.3（entry 选择走 URL query）、`react-router` ^6.30.3、`zustand` ^5.0.13
  - 动画：`@react-spring/web` ^10.0.3 + `react-spring-lynx`（workspace 适配器）
  - 样式：`tailwindcss` ^3.4.19、sass / sass-embedded、postcss-px-to-viewport-8-plugin（响应式缩放）
  - 测试：`vitest` ^3.2.4 + jsdom + @testing-library/jest-dom
  - 类型：typescript ~5.9.3、`@lynx-js/types` 3.8.0（Node >= 18）
- 运行环境：pnpm@10.14.0 workspace（`packages/*`），Node >= 18
- 常用命令（原样来自 package.json scripts）：
  ```bash
  pnpm dev           # rspeedy dev（端口 3001，终端显示二维码）
  pnpm dev:mock      # rspeedy dev --env-mode mock（走本地 Koa mock）
  pnpm mock          # node mock/server.mjs（Koa 调试代理，端口 4000）
  pnpm build         # rspeedy build
  pnpm preview       # rspeedy preview
  pnpm lint          # eslint .
  pnpm format        # prettier --write .
  pnpm test          # vitest run
  pnpm doctor:dev    # RSDOCTOR=true rspeedy dev
  ```
  单测文件：`npx vitest run src/apps/flight/App.test.tsx`
- 目录结构：
  ```
  src/
    apps/            # 多入口（lynx.config.ts 自动扫描，每个含 index.tsx 的目录是一个 entry，?entry=<name> 访问）
      flight/        # 机票预订 demo
      furniture/     # 家具画廊 demo
      furnituredetail/ bouncescroll/ cssunit/ darkmode/ empty/ list-demo/
      monorepodemo/ animationsdemo/ travel-auth/ ui-example/
    animations/      # 共享动画 hooks（useEnterFade、usePressScale）与 presets（gentle/stiff/wobbly/swift）
    components/      # 共享 UI 组件（button 等）
    utils/           # size 等工具
    react-shim.ts    # 把 react 导入映射到 @lynx-js/react，兼容 @react-spring/web 等库
  packages/          # pnpm workspace 子包
    lynx-shared/     # 底层 fetch 封装 createFetch、hooks、平台工具
    lynx-ui/         # 可复用 UI 组件库
    react-spring-lynx/  # Lynx 动画适配器
    travel-domain/   # DDD 领域层：实体、值对象、仓储接口、Result<T,E>（零外部依赖）
    travel-data/     # DDD 数据层：DTO、mapper、HTTP datasource、仓储实现
  mock/              # Koa mock/调试代理 server.mjs
  docs/              # 架构与复盘文档（travel-api-architecture.md 等）
  lynx.config.ts     # 构建配置（多入口扫描、二维码插件、Sass、类型检查、物理网卡 IP 探测）
  postcss.config.js  # px→vw 响应式转换（RESPONSIVE_APPS 白名单控制作用范围）
  ```

## 二、本仓库特有规范 / 对全局的覆盖

### 多入口构建
`lynx.config.ts` 自动扫描 `src/apps/` 下含 `index.tsx` 的目录生成 entry，经 URL 参数 `?entry=<app>` 访问。新增 demo 只需在 `src/apps/` 建目录。

### 双线程模型（Lynx）
- **后台线程**：标准 React 式渲染，React Spring hooks 动画
- **主线程（MTS）**：高频交互（触摸、滚动）直接操作样式，事件回调用 `'main thread'` 指令避免线程切换延迟
- CSS 使用 Lynx 特有属性，**避免使用 Lynx 不支持的标准 CSS 属性**

### API / DDD 分层（详见 `docs/travel-api-architecture.md`）
依赖方向：App → `travel-data` → `travel-domain`（内层不依赖外层）

| 层 | 包 | 职责 |
|----|----|----|
| App | `src/apps/*` | UI、Zustand 状态、编排 |
| Data | `travel-data` | HTTP 调用、DTO、mapper、仓储实现 |
| Domain | `travel-domain` | 实体、值对象、仓储接口、`Result<T,E>` |

**API 工作铁律：**
1. App 代码只从 `travel-data` 导入仓储，**禁止直接调 fetch**
2. 仓储方法返回 `Result<T, DomainError>`，用 `isSuccess`/`isFailure` 判断，不用 try/catch
3. DTO 只在 `travel-data` 内存在，须在到达 App 前映射为领域实体
4. 新增领域（如 hotel）：在 `travel-domain` 定义 `IHotelRepository`，在 `travel-data` 实现 `HotelRepository`

### 环境变量模式
- `.env`：`PUBLIC_TRAVEL_API_URL` 默认空 → 回落到硬编码真实后端；个人临时覆盖放 gitignored 的 `.env.local`
- `.env.mock`：仅 `pnpm dev:mock` 加载，指向本地 Koa mock（`http://127.0.0.1:4000`）

### 响应式适配（px → vw）
`postcss.config.js` 用 `postcss-px-to-viewport-8-plugin` 把 px 转 vw，仅对 `RESPONSIVE_APPS` 白名单（如 `['flight', 'furniture']`）中的 app 生效，设计基线 375。app 零代码改动即可接入。

### Web 端构建注意
`lynx.config.ts` 设置 `EXPERIMENTAL_USE_WEB_BINARY_TEMPLATE='false'` 生成 JSON 格式 web bundle（兼容 @lynx-js/web-core 0.18.x/0.20.x）。web target 构建崩溃复盘见 `docs/retro/web-target-async-template-encode-crash.md`。

## Stack Overlay
- primary: lynx
- secondary: []
- knowledge-adapter: apifox
- runtime-smoke: lynx-devtool
- design-source: figma
- ui-mode: lynx-stack

## 三、业务与文档指路牌
- 业务规则见 `docs/domains/`
- 系统架构见 `docs/ARCHITECTURE.md`
- 历史坑见 `docs/retro/`（含 web target 构建崩溃复盘）
- 需求档案见 `docs/requirements/`（每个需求号一个目录）
- API/DDD 分层设计见 `docs/travel-api-architecture.md`
- monorepo 拆分计划见 `docs/monorepo-plan.md`
- 团队知识库：通过 knowledge adapter 检索（当前为 apifox preset，MCP「新旅行API文档」）
