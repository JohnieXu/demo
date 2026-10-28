# lynx-demo（ReactLynx 多入口 demo monorepo）Agent 规则

> owner: JohnieXu
> updated: 2026-10-27
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
