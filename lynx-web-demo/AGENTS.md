# lynx-web-demo（Lynx Web 渲染壳层）Agent 规则

> owner: JohnieXu
> updated: 2026-10-24
> 本文件是本仓库 AI 规则的**唯一真源**。

<!-- global:start 由 standards/global-standards.md 同步，勿手工修改 -->
> 归属：`unsop-core/standards`（L1 全局层）
> 适用范围：**所有仓库、所有 AI Agent 工具**。仅收录"换任何技术栈、任何团队都成立"的通用条款；技术栈相关规范一律下沉到对应 stack overlay 或仓库 `AGENTS.md`。
> 本文件会被同步进各仓库 `AGENTS.md` 的"全局规范"标记段（见 `agent-rule-sync.md`）。
> 团队特定条款（分支策略、需求号格式、评审组织、安全基线细则等）由仓库 `AGENTS.md` 覆盖。

## 1. AI 规则单一真源

- **每个仓库的 AI 规则真源是唯一的 `AGENTS.md`**，位于仓库根目录，手工维护。
- 其他工具文件（`CLAUDE.md`、`.cursor/rules/*`、`.trae/rules/*` 等）一律作为**生成物或软链**，不得手工维护，避免多份漂移。
- **禁止引入以 CLI 命令驱动的工作流框架**（如 HXFlow 等）。团队统一走"AGENTS.md + SKILL + knowledge adapter"的 Agent 原生方式。历史遗留工作流应在改造时清理。

## 2. 提交规范（Conventional Commits）

- 格式：`<type>(<scope>): <subject>`，如 `feat(order): 新增退款校验`。
- type 取值：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore`。
- subject 用中文或英文均可，一句话说清"做了什么"，不写"怎么做"。
- 一次提交只做一件事；跨模块的大改拆分多次提交。

## 3. 分支策略与上线流程（占位示例）

> 这是通用示例，团队实际分支策略在仓库 `AGENTS.md` 中覆盖。

分支模型示例：`feature/<需求号-简述>` → `test` → `pre` → `master`。

- **feature**：功能开发分支，从 `master`（或团队默认）拉出；修复用 `fix/<问题号-简述>`。
- **test**：feature 开发完成后，研发**自行合并到 test 并部署测试环境**，做基础功能验证（通过是进入下一阶段前提）。
- **pre**：测试通过后，通过 **Merge Request**（或团队约定流程）合并到 pre，在预发环境做严格测试。
- **master**：预发通过后，通过 **Merge Request** 合并到 master 发布生产；合并后**在 master 打版本标签**便于追踪。
- 受保护分支禁止开发角色直接 push，具体保护规则由团队覆盖。

## 4. 代码审查标准

- **提测前研发先自查**：按团队 review 标准（仓库 `docs/review-standard.md` 或 knowledge adapter 暴露的当前生效审查规范）自行审查并修改，产出**代码审查报告**随提测材料一并提交。
- **产出方式**：优先使用团队自动审查工具（按 knowledge adapter 接入的外部审查服务）；目标态是通过 review 类 MCP 在 IDE 内一键生成（Agent 原生，不依赖 CLI）。本规范不指定具体工具，由团队在 `AGENTS.md` 中约定。
- **兜底**：自动工具不可用时按团队审查规范逐条手工自查并记录结论。
- 在研发自查基础上，提测前须完成**代码评审**，由团队约定负责人组织。
- 所有变更须经 **自动审查 + 人工评审**双重门禁。
- 自动审查报告中的 **critical 必须清零**才可合并；warning 需说明处理或豁免理由。
- 人工评审关注：业务正确性、边界与异常、安全、可维护性；不纠结格式（交给 lint）。

## 5. AI 生成代码的人工确认清单（强制）

AI 生成的代码合并前，**以下几类必须人工逐项确认，不得直接采信**：

- [ ] **复杂业务逻辑**：是否符合 `docs/domains/` 里的业务规则，而非 AI 臆测。
- [ ] **边界与异常**：空值、越界、并发、失败回滚、超时是否覆盖。
- [ ] **安全**：鉴权/越权、输入校验、敏感信息、注入风险。
- [ ] **兜底冗余**：是否存在过度防御、无意义 try-catch、重复逻辑。
- [ ] **副作用**：是否误改了需求范围外的公共逻辑/组件。

## 6. 安全基线

- 严禁把密钥、token、账号密码硬编码进代码或提交进仓库；统一走环境变量/配置中心。
- 对外接口入参必须校验；用户输入默认不可信。
- 日志与错误信息不得输出敏感数据。
- 涉及资金、权限、履约的逻辑，必须人工复核，不允许纯 AI 生成直接上线。

## 7. 文档规则（配合知识库与 AI 调用成本）

- **单文档正文 ≤ 1000 行 / ≤ 10000 token**；超限按业务子域拆分。索引类文件（如项目映射文档）豁免行数上限但需保持精炼。
- **例外：开发方案**（`docs/requirements/<需求号>/开发方案.md`）放宽至 **≤ 3000 行**（需包含技术方案/任务拆分/排期/风险/上线发布及必要代码片段）。
- 采用**两级结构**：索引文档（导航，≤100 行）→ 叶子文档（具体内容，≤1000 行）。
- 每个文档头部写**元信息块**（owner / updated / 关联文档），便于 AI 先读元信息再决定是否加载全文。
- 文档与代码**同一个 PR 提交**，保持同步。
- 业务规则遵循"**用一次沉淀一次**"：每次需求/Bug 复盘，必须回答"本次暴露了哪条未记录的业务规则"并回写 `docs/domains/`。

### 文档头部元信息模板

```markdown
> owner: <负责人>
> updated: <YYYY-MM-DD>
> related: <关联文档相对路径，逗号分隔>
```

## 8. 目录与文档命名约定（占位示例）

各业务仓库统一采用以下文档目录（具体目录结构由 stack overlay 与仓库 `AGENTS.md` 共同决定）：

```
docs/
├── ARCHITECTURE.md        # 系统架构（每仓库一份）
├── domains/<域>/          # 业务域知识：README.md(导航) + FLOW.md(流程) + 规则叶子文档
├── requirements/<需求>/   # PRD.md（需求输入）
└── retro/                 # 复盘/排查，一坑一档
```

- `<需求>` 用需求号（具体格式由 `AGENTS.md` 覆盖）；`<域>` 用小写英文域名（如 `order`）。

## 9. 研发流程（占位示例）

> 团队实际流程在仓库 `AGENTS.md` 中覆盖；core 仅声明通用原则。

- 流程分阶段：需求评审前 → 需求评审后 → 开发 → 测试 → 上线。
- AI 承担方案与编码产出，人工把关方案评审、代码评审与提测门禁。
- **开发方案**：所有需求均需编写开发方案（`docs/requirements/<需求号>/开发方案.md`），**AI 依据该文档实施**。
- 多人、跨领域或跨项目需求在需求分析阶段必须逐项确认每套非取消子方案的具体责任人。
- 上下文加载顺序：L1 定位仓库 → L2 理解工程 → L3 理解业务 → L4 产出方案。
- 检查点 2 = 团队方案评审；检查点 3 = 团队代码评审 + 提测门禁。

## 10. AI 代码生成度量口径（参考）

采用**分层加权**，不搞一刀切：

| 代码类型 | AI 生成目标 |
| --- | --- |
| 样板/脚手架/CRUD/类型 | 90%+ |
| 通用组件/工具函数 | 75%+ |
| 复杂业务逻辑/交互 | 50%+ |

按各类实际代码量加权到整体 **70%+**。宁可复杂逻辑少凑数，也不牺牲质量。团队可调整具体目标值。

## 11. 提示词库

- 团队所有系统提示词集中在知识库的 `prompts/` 目录，通过 Git MR + review 管理，不散落在个人聊天记录。
- 每个场景一个文件（开发方案/代码审查/Bug定位/业务沉淀/通用规范），SKILL 头部声明引用。
- 好提示词沉淀进 `prompts/`，修改走 MR → 基建负责人 review → 合并 → knowledge adapter 自动拉取生效。
- 详细管理规则见 `prompts/README.md`（团队覆盖）。

## 12. AI 强制行为规则

> 本规则注入到所有仓库 `AGENTS.md` 的全局段（由 `unsop-sync-global-section.mjs` 自动同步），AI 打开仓库即生效。

1. **写任何代码前**，先按 `Stack Overlay.knowledge-adapter` 检索相关业务规则和已有方案；不存在业务规则时标注"待确认"。
2. **写开发方案前**，先按 L1→L4 加载上下文（读 `AGENTS.md` → `docs/ARCHITECTURE.md` → 业务域文档 → PRD）。
3. **遇到不确定的业务规则**，禁止臆测，必须先检索 domain 文档或标注"待确认"。
4. **按开发方案执行时**，必须逐个 TASK 走完整流程：①复述（目标/依赖/约束/计划）→ ②编码（按方案复用组件、接口、边界）→ ③自测（逐条 AC 检查，未通过自动修正重测，最多 3 轮）→ ④知识沉淀（全部 TASK 完成后，汇总新知识写入 `docs/domains/` 或 `docs/retro/`，输出沉淀清单，人工确认后与代码同一 PR 提交）。不可跳过任何阶段。
5. **提交代码前**，对照第 5 条"AI 生成代码人工确认清单"逐项检查。

> 以上规则注入到所有仓库 AGENTS.md 全局段，AI 打开仓库即生效，人工无需提示。
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
