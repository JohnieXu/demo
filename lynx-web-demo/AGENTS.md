# lynx-web-demo（Lynx Web 渲染壳层）Agent 规则

> owner: JohnieXu
> updated: 2026-10-24
> 本文件是本仓库 AI 规则的**唯一真源**。

<!-- global:start 由 standards/global-standards.md 同步，勿手工修改 -->
<!-- global:end -->

## 一、本仓库技术形态

- 项目：`lynx-web-demo`（`package.json` 的 `name`，version `1.0.0`，`private: true`，`type: module`）
- 定位：浏览器侧的 **Lynx 渲染壳层**。本仓库不含业务页面代码，只用 React 把同仓兄弟项目 `lynx-demo` 产出的 Lynx bundle（`*.web.bundle`）通过 `<lynx-view>` 自定义元素挂到页面上，并提供入口切换器。业务代码在 `lynx-demo`（rspeedy + `@lynx-js/react`）。
- 技术栈（版本为 `node_modules` 中实际安装值）：
  - 框架：React 18.3.1 / react-dom 18.3.1
  - 路由：react-router-dom 7.15.1（仅用 `useSearchParams` 读写 `?entry=` 查询参数）
  - Lynx Web SDK：`@lynx-js/web-core` 0.20.4、`@lynx-js/web-elements` 0.12.4
  - 构建：`@rsbuild/core` 1.7.5 + `@rsbuild/plugin-react` 1.4.6（**不是** webpack / vite）
  - 类型：TypeScript 5.9.3（`tsconfig.json`，`strict: true`）
  - 质量门：ESLint 9.39.4（flat config，见 `eslint.config.mjs`）、Prettier 3.8.3（`.prettierrc`：`singleQuote: true`）
- 运行环境：Node.js（`package.json` 未声明 `engines`，待确认；本机实际为 v24.9.0）；包管理器 pnpm 10.14.0（`packageManager` 字段）；pnpm workspace 根目录为仓库根 `D:\Projects\johniexu-demo`，本目录是 workspace 成员。
- 常用命令（原样取自 `package.json` 的 `scripts`）：
  - `pnpm dev` → `rsbuild dev --open`
  - `pnpm build` → `rsbuild build`
  - `pnpm preview` → `rsbuild preview`
  - `pnpm lint` → `eslint .`
  - `pnpm format` → `prettier --write .`
  - 本仓库**未配置**测试脚本与测试框架（`package.json` 无 `test`，devDependencies 无测试库）
- 目录结构：
  - `src/App.tsx` —— 入口清单 `entryOptions`、`<lynx-view>` 渲染、可拖拽入口切换器 `EntrySwitcher`
  - `src/App.css` —— 壳层样式（页面背景 + 入口切换器样式）
  - `src/index.tsx` —— React 根挂载：`createRoot` + `BrowserRouter` + `React.StrictMode`
  - `src/env.d.ts` —— `<lynx-view>` 的 JSX 类型声明（`JSX.IntrinsicElements`）与 `*.svg?react` 模块声明
  - `rsbuild.config.ts` —— dev server 配置：`publicDir` 指向 `../lynx-demo/dist`；`/bundle` 代理到 Lynx dev server
  - `public/favicon.png` —— 静态资源
  - `docs/` —— 壳层笔记（`cpp-language-notes.md`、`lynx-render-bridge-notes.md`）与本套文档骨架（`ARCHITECTURE.md`、`domains/README.md`）
- 资源链路（关键事实，改入口/代理前必读）：
  - 页面请求 `/bundle/{entry}.web.bundle?fullscreen=true`（`src/App.tsx` 的 `baseUrl = '/bundle'`，`entryOptions` 的 entry 均带 `?fullscreen=true`）
  - `rsbuild.config.ts` 把 `/bundle` 代理到 `process.env.LYNX_DEMO_ORIGIN ?? 'http://localhost:3001'`，并用 `pathRewrite` 的 `'^/bundle'` 去掉前缀
  - 兄弟项目 `lynx-demo` 的 dev server 端口在 `lynx-demo/lynx.config.ts` 固定为 `3001`；端口被占用时 rspeedy 会自动顺延，此时需用 `LYNX_DEMO_ORIGIN` 覆盖代理目标
  - `lynx-demo/lynx.config.ts` 设置 `process.env.EXPERIMENTAL_USE_WEB_BINARY_TEMPLATE = 'false'`，因此 web 产物是 **JSON 格式** web bundle（`@lynx-js/web-core` 0.20.x 期望该格式）
  - **web target 不支持 async/lazy chunk**：`lynx-demo` 侧若出现 `React.lazy(() => import(...))`，web 环境构建会在 `@lynx-js/template-webpack-plugin` 里崩溃（空 manifest 解构 + wasm 编码 undefined）。因此 `lynx-demo` 的路由视图必须同步 import。背景与验证见 `../lynx-demo/docs/retro/web-target-async-template-encode-crash.md`
  - `lynx-demo` 的 entry 由 `lynx.config.ts` 扫描 `src/apps/*` 自动生成（外加 `index`）；本仓库的 `entryOptions` 必须与之对齐
- 官方文档（沿用旧 `AGENTS.md`）：Rsbuild `https://rsbuild.rs/llms.txt`、Rspack `https://rspack.rs/llms.txt`

## 二、本仓库特有规范 / 对全局的覆盖

> 本节列出的是**本仓库的全部差异/补充**，其余以全局段为准。

- **壳层职责边界**：本仓库只负责"挂载 Lynx bundle + 切换入口"。任何业务页面、业务组件、业务接口逻辑都属于 `lynx-demo`，不要在本仓库实现业务。
- **`<lynx-view>` 的副作用 import 不可删**：`src/App.tsx` 顶部的 `@lynx-js/web-core/client`、`@lynx-js/web-elements/all`、`@lynx-js/web-elements/index.css` 是 Lynx 内容能渲染的前提；`src/env.d.ts` 中对应的 JSX 类型声明与之配套。
- **入口清单单一真源**：新增/删除入口只改 `src/App.tsx` 的 `entryOptions`；同名 bundle 必须由 `lynx-demo` 提供，否则代理 404。
- **代理目标必须可注入**：改动 `rsbuild.config.ts` 的代理时不要写死本机或局域网 IP，走 `LYNX_DEMO_ORIGIN` 环境变量。
- **文档不一致待确认**：仓库 `README.md` 仍写"规则：`/bundle` → `http://192.168.124.5:3001`"，与 `rsbuild.config.ts` 的默认值 `http://localhost:3001` 不一致（README 已过期，待确认后更新）。
- **TypeScript 严格模式**：`tsconfig.json` 开启 `strict`、`noUnusedLocals`、`noUnusedParameters`、`verbatimModuleSyntax`、`moduleResolution: bundler`。本仓库**未接入** `@rsbuild/plugin-type-check`，因此 `pnpm build` 不做类型检查，需手动 `npx tsc --noEmit`（`tsconfig.json` 已设 `noEmit: true`）。
- **Lint / 格式化**：ESLint flat config 忽略 `dist`，对 `**/*.{ts,tsx}` 应用 `js.configs.recommended` + `typescript-eslint` recommended + react-hooks `recommended-latest` + react-refresh `recommended`；Prettier 仅设 `singleQuote: true`，其余用默认值。
- **测试体系**：未配置（无 test script、无测试依赖）。浏览器侧验证依赖 Chrome DevTools MCP 人工冒烟（Stack Overlay `runtime-smoke: browser`）。
- **文档同步义务**：改了入口清单或代理链路时，同 PR 同步更新 `docs/ARCHITECTURE.md`；业务规则沉淀到 `lynx-demo` 的 `docs/domains/`，本仓库 `docs/domains/` 只放壳层自身的域。
- **与全局规范的差异**：无。本仓库不对全局规范做任何覆盖，提交规范 / 分支策略 / 文档规则等一律以全局段为准。

## Stack Overlay

- primary: web
- secondary: [lynx]
- knowledge-adapter: local
- runtime-smoke: browser
- design-source: none
- ui-mode: web-spec

## 三、业务与文档指路牌

- 业务规则见 `docs/domains/`（本仓库是渲染壳层，暂无自身业务域；业务规则真源在同仓 `lynx-demo` 的 `docs/domains/` —— 待确认）
- 系统架构见 `docs/ARCHITECTURE.md`
- 历史坑见 `docs/retro/`（本仓库暂无；web 侧的 Lynx 构建坑见同仓 `../lynx-demo/docs/retro/`）
- 需求档案见 `docs/requirements/`（待创建，每个需求号一个目录）
- 团队知识库：通过 knowledge adapter 检索（`local` preset → `rg docs/`；本机全局另配了 `knowledge-search` MCP，其工具契约未在本仓库验证过 —— 待确认）
