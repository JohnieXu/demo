# lynx-web-demo ARCHITECTURE

> owner: JohnieXu
> updated: 2026-10-24
> related: ../AGENTS.md, ./domains/
>
> 由 `unsop-web-stack-context` 按 web-ARCHITECTURE 模板生成。
> 所有事实来自仓库实际文件（package.json / rsbuild.config.ts / tsconfig.json / eslint.config.mjs / src），
> 无法从代码确认的项写「待确认」。

## 1. 项目概述

- 一句话描述：`lynx-web-demo` 是 Lynx 应用的 **Web 渲染壳层**，用 React 把兄弟项目 `lynx-demo` 编译出的 Lynx web bundle 通过 `<lynx-view>` 自定义元素渲染到浏览器，并提供入口切换器。
- 产品形态：单页应用（SPA，浏览器侧客户端渲染）。
- 目标浏览器与范围：待确认（仓库未声明 browserslist / target 浏览器矩阵；`tsconfig.json` 仅设 `target: ES2020`，`rsbuild.config.ts` 未覆写 `output.target`）。
- 在整体中的位置：同一 pnpm workspace 内的两个项目之一 —— `lynx-demo` 负责「写业务、编 bundle」，`lynx-web-demo` 负责「在浏览器里挂载并预览 bundle」。后者不含业务代码。

## 2. 技术栈

| 项        | 选型                                                                            | 版本            | 依据文件                                   |
| --------- | ------------------------------------------------------------------------------- | --------------- | ------------------------------------------ |
| 语言      | TypeScript                                                                      | 5.9.3           | tsconfig.json / package.json               |
| 框架      | React + react-dom                                                               | 18.3.1          | package.json dependencies                  |
| 构建工具  | Rsbuild（@rsbuild/core + @rsbuild/plugin-react）                                | 1.7.5 / 1.4.6   | package.json / rsbuild.config.ts           |
| 路由方案  | react-router-dom `BrowserRouter`（仅承载 `?entry=` 查询参数）                   | 7.15.1          | package.json / src/index.tsx / src/App.tsx |
| 状态方案  | React 内置（`useState` / `useRef` / `useMemo` / `useCallback`），无第三方状态库 | —               | src/App.tsx                                |
| 测试      | 未配置（无 test script、无测试依赖）                                            | —               | package.json                               |
| 包管理    | pnpm（workspace）                                                               | 10.14.0         | package.json `packageManager`              |
| Lynx 渲染 | `@lynx-js/web-core` / `@lynx-js/web-elements`                                   | 0.20.4 / 0.12.4 | package.json / src/App.tsx                 |

## 3. 工程结构

```
src/
  App.tsx        # 入口清单 entryOptions、<lynx-view> 渲染、可拖拽入口切换器 EntrySwitcher
  App.css        # 壳层与入口切换器样式
  index.tsx      # React 根挂载：createRoot + BrowserRouter + React.StrictMode
  env.d.ts       # <lynx-view> 的 JSX.IntrinsicElements 类型声明 + *.svg?react 模块声明
public/
  favicon.png    # 静态资源
docs/
  ARCHITECTURE.md
  domains/README.md
  cpp-language-notes.md          # 已存在的笔记（非本套模板生成）
  lynx-render-bridge-notes.md    # 已存在的笔记（非本套模板生成）
rsbuild.config.ts                # dev server：publicDir + /bundle 代理
eslint.config.mjs                # ESLint flat config
.prettierrc                      # singleQuote: true
tsconfig.json                    # strict / noEmit / noUnusedLocals / noUnusedParameters
```

与 web-ARCHITECTURE 模板默认分层（pages / components / stores / api / router / utils）的差异：

- **本仓库没有这些分层，也不应该新增。** 它是壳层，只有一个页面（`App`）和一个组件（`EntrySwitcher`，定义在 `App.tsx` 内，未拆文件）。
- 没有 `public/` 之外的资源目录、没有接口调用层、没有独立路由配置文件（路由只有一层 `BrowserRouter`）。
- 业务分层在兄弟项目 `lynx-demo`（`src/apps/*` 等），不在本仓库。

依赖方向：`src/index.tsx` → `src/App.tsx` → Lynx Web SDK；单向，无跨层引用。

## 4. 入口与路由

- 开发服务器命令与实际端口来源：`pnpm dev` → `rsbuild dev --open`（`@rsbuild/core` 默认端口 **3000**，端口占用时自动顺延；本机实际端口以启动日志为准）。`rsbuild.config.ts` 未显式设置 `server.port`。
- 生产构建命令与产物目录：`pnpm build` → `rsbuild build`，产物在 `dist/`（`.gitignore` 已忽略）。
- 路由定义位置与模式：路由只有 `BrowserRouter`（`src/index.tsx`）；页面级参数为查询参数 `?entry=<key>`，在 `src/App.tsx` 用 `useSearchParams` 读取，非法值回落到 `entryOptions[0]`（当前为 `main`）。
- 页面级懒加载约定：本仓库是单入口单页面，无懒加载。**`lynx-demo` 侧也必须保持同步 import** —— web target 不支持 async/lazy chunk，`React.lazy(() => import(...))` 会让 web 构建在 `@lynx-js/template-webpack-plugin` 里崩溃，详见 `../../lynx-demo/docs/retro/web-target-async-template-encode-crash.md`。
- 静态资源：`rsbuild.config.ts` 的 `server.publicDir` 额外挂载 `../lynx-demo/dist`，即 `lynx-demo` 的构建产物在开发期也走本 dev server 托管。

## 5. 状态与数据流

- 单一事实源约定：当前选中的入口 `entry` 由 React state 持有，并同步写入 URL 查询参数；`entryOptions` 常量是入口清单的唯一真源。
- 服务端状态与客户端状态的划分：本仓库不持有服务端状态。Lynx bundle 内部的数据获取由 `lynx-demo` 负责。
- 请求发起、错误处理与重试约定：壳层不发起业务请求，只请求 `/bundle/{entry}.web.bundle?fullscreen=true` 这一条静态资源请求；无重试、无错误兜底 UI —— bundle 加载失败时 `<lynx-view>` 不渲染内容（由 Lynx Web SDK 打印错误）。待确认：是否需要为 bundle 加载失败补充可见提示。
- 交互状态：`EntrySwitcher` 用 `useRef` 保存拖拽偏移与拖拽中标记，用 `useState` 保存位置、拖拽态与吸附边（`left` / `right` / `top` / `bottom`），靠近屏幕边缘 30px 内自动吸附。

## 6. 外部依赖

| 依赖                                                   | 用途                                       | 接入方式                                                                                                                          | 失败降级                                               |
| ------------------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `lynx-demo` rspeedy dev server                         | 提供 `*.web.bundle`                        | `rsbuild.config.ts` 的 `server.proxy`：`/bundle` → `LYNX_DEMO_ORIGIN ?? http://localhost:3001`，`pathRewrite` 去掉 `/bundle` 前缀 | 无降级；代理不可达时页面空白（待确认是否需要提示）     |
| `lynx-demo/dist`                                       | 开发期静态托管 Lynx 构建产物               | `server.publicDir` 指向 `../lynx-demo/dist`                                                                                       | 目录不存在时静默跳过                                   |
| `@lynx-js/web-core` + `@lynx-js/web-elements`          | Lynx web 运行时与 `<lynx-view>` 自定义元素 | `src/App.tsx` 副作用 import                                                                                                       | 无降级；SDK 加载失败则 bundle 无法渲染                 |
| Apifox MCP（仓库根 `.mcp.json` 注册「新旅行API文档」） | 读取接口契约                               | MCP 工具                                                                                                                          | 与本仓库壳层无直接关系；业务接口契约真源在 `lynx-demo` |
| Figma MCP（仓库根 `.mcp.json` 注册）                   | 设计稿                                     | MCP 工具                                                                                                                          | 本仓库无设计稿                                         |

## 7. 质量门命令

| 检查       | 命令                                       | 判定                                                                                                                           |
| ---------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Lint       | `pnpm lint`（`eslint .`）                  | 无 error（配置见 `eslint.config.mjs`）                                                                                         |
| 类型检查   | `npx tsc --noEmit`（手动）                 | 无 error；`tsconfig.json` 已设 `noEmit: true`。**注意**：`pnpm build` 不做类型检查，本仓库未接 `@rsbuild/plugin-type-check`    |
| 格式化     | `pnpm format`（`prettier --write .`）      | 执行后 `git diff` 无格式差异                                                                                                   |
| 构建       | `pnpm build`                               | 产物生成到 `dist/`                                                                                                             |
| 本地预览   | `pnpm preview`                             | 预览 `dist/` 产物                                                                                                              |
| 测试       | 未配置                                     | —                                                                                                                              |
| 浏览器验证 | Chrome DevTools MCP（in-app browser 优先） | 打开 dev server 地址，确认 `<lynx-view>` 渲染出 Lynx 内容、控制台无 `Invalid Magic Header` / `Failed to fetch template` 等错误 |

## 8. 主题与样式

- 主题 token 来源位置：无 token 体系。样式集中在 `src/App.css`，使用字面量颜色（`#fff`、`#020917`、`#101725`、`rgba(9, 14, 28, 0.7)` 等）。
- 深浅色处理方式：固定深色背景（`linear-gradient(to bottom, #020917, #101725)`），无 `prefers-color-scheme` 适配、无切换开关。
- 响应式断点约定：无断点。壳层用 `100vw` × `100vh` 铺满，`EntrySwitcher` 用 `position: fixed` 绝对定位并按视口尺寸计算初始位置。
- 字体：`font-family: Inter, Avenir, Helvetica, Arial, sans-serif`（未随仓库提供字体文件，走系统字体栈）。

## 9. 关键约定

- **壳层不含业务**：业务页面、接口调用、状态管理都在 `lynx-demo`；本仓库改动应限于「挂载方式、入口清单、代理、壳层 UI」。
- **`<lynx-view>` 的副作用 import 与 JSX 类型声明配套**：`src/App.tsx` 顶部的 `@lynx-js/web-core/client`、`@lynx-js/web-elements/all`、`@lynx-js/web-elements/index.css` 与 `src/env.d.ts` 的 `JSX.IntrinsicElements['lynx-view']` 声明必须成对存在。
- **入口清单与 `lynx-demo` 对齐**：`src/App.tsx` 的 `entryOptions` 与 `lynx-demo/lynx.config.ts` 扫描 `src/apps/*` 生成的 entry 需保持一致；`lynx-demo` 侧 `EXPERIMENTAL_USE_WEB_BINARY_TEMPLATE = 'false'` 决定 web bundle 为 **JSON 格式**，与 `@lynx-js/web-core` 0.20.x 匹配。
- **代理目标走环境变量**：不要写死本机 / 局域网 IP，使用 `LYNX_DEMO_ORIGIN`。
- **错误处理与日志约定**：壳层目前无错误处理与日志设施（无 console 输出、无错误边界）。待确认：是否需要补 `ErrorBoundary` 与加载失败提示。
- **性能预算（LCP / INP / CLS / 包体积）**：仓库无既有基线、无预算声明 —— 待确认。已知事实：壳层首屏只渲染一个 `<lynx-view>`，主包体积主要由 `@lynx-js/web-core` / `web-elements` 决定。
- 组件契约规范见 overlay `references/web-component-contract.md`；二进制资产获取与落盘见 core `references/asset-intake.md`。

## 10. 测试体系三层

| 层       | 工具                                            | 范围                                                                       |
| -------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| 逻辑模块 | 未配置                                          | —                                                                          |
| 视图组件 | 未配置                                          | —                                                                          |
| 端到端   | 未配置；浏览器侧靠 Chrome DevTools MCP 人工冒烟 | 入口切换器拖拽/吸附、`<lynx-view>` 渲染 Lynx bundle、bundle 加载失败的表现 |

## 11. 与 core / overlay 的关系

- 生效 Stack Overlay：

  ```markdown
  - primary: web
  - secondary: [lynx]
  - knowledge-adapter: local
  - runtime-smoke: browser
  - design-source: none
  - ui-mode: web-spec
  ```

- 知识来源：knowledge-adapter = `local`（`rg docs/` / 直接读取仓库内文档）。本机全局另配 `knowledge-search` MCP，其工具契约未在本仓库验证 —— 待确认。
- 运行时冒烟执行器：`browser`（in-app browser 优先，Chrome DevTools MCP 兜底）。
- 栈特化规范来源：`unsop-web` overlay（`references/web-stack.md`、`references/web-component-contract.md`、`references/web-runtime-smoke.md`）。
- 次栈说明：`secondary: [lynx]` —— 被渲染的 bundle 由 `@lynx-js/react`（Lynx 栈）编译；本仓库不实现 Lynx 侧代码，相关改动应进入 `lynx-demo` 仓库。
