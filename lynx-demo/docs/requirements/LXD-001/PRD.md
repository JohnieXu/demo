# flightResource 迁移至 lynx-demo（机票核心链路）PRD

## 文档信息
- 需求号：LXD-001（团队暂无正式编号规则，自定义编号，待团队规则确认后回归）
- 状态：待评审
- 负责人：JohnieXu
- 评审人：待指定
- 创建时间：2026-10-28
- 关联资料：
  - 源仓库：`h5-journey-monorepo`（`D:\Projects\ctg\h5-journey-monorepo`）
  - 源模块：`packages/legacy-app/src/flightResource`（Vue 3.5 + Vant 4.9 + axios + Pinia 3 + vue-router，111 个 ts/vue/js 文件）
  - 目标仓库：`johniexu-demo/lynx-demo`（ReactLynx + Rspeedy monorepo）
  - 设计文档：`lynx-demo/docs/travel-api-architecture.md`（DDD 分层）
  - 知识库：Apifox MCP「新旅行API文档」（接口契约权威来源）

## 背景与现状证据
lynx-demo 的 flight 应用此前已做部分迁移：数据层（travel-domain/travel-data 的 flight：entity/repository/dto/mapper/datasource）与视图骨架（Query/FlightList/CabinList/Booking/OrderDetail/OrderList/TrainList）已存在，但迁移未完成，以下部分缺失：

| 类别 | 源端实况（已查证） | lynx-demo 现状 |
| --- | --- | --- |
| 页面域 | 14 个：query、flightList、cabinList、orderFill、orderDetail、orderList、flightPay、citySelect、passenger、beneficiaryManage、refundApply、myPage + index/components | 仅 7 个视图骨架；缺 citySelect、passenger、beneficiaryManage、refundApply、flightPay、myPage |
| service 层 | 7 个 axios 封装模块（flight/citySelect/orderDetail/passenger/beneficiaryManage/validation/index） | 未迁移；已有 travel-data flight 仓储可扩展 |
| 业务 utils | 11 个纯逻辑模块（cabinGradeTabs/cabinProductGroups/flightPriceTag/orderSource/flightApiVersion 等） | 未迁移 |
| 状态 | 2 个 Pinia store（city、routeCity） | zustand flightStore 可承接 |
| 测试 | 源端无；目标 travel-data 的 presale 域有 mapper/repository 单测，**flight 域无测试** | 缺口 |

## 目标用户与使用场景
- 目标用户：研发（本人/团队），在 Lynx 技术栈上验证机票业务链路的完整实现
- 使用场景：用 LynxExplorer 扫码走通"查询 → 列表 → 舱位 → 填单 → 订单"核心链路，作为后续 Lynx 业务开发的参照基线

## 问题陈述与价值
- 问题：flightResource 迁移半途而止，Lynx 端机票链路不完整，已有 DDD 数据层与视图骨架未闭环，无法作为可运行 demo 验证
- 价值：形成一条可在 Lynx 运行的完整机票链路 + 一套可复用的迁移范式（service→仓储、utils→纯函数、Pinia→zustand），为后续页面域迁移（train 等）提供模板
- 不处理的代价：既有数据层代码无页面消费方，逐渐腐化；每次验证需回 Vue 工程

## 目标、成功指标与非目标
**目标**
1. 核心链路（查询→列表→舱位→填单→订单）在 Lynx 端可完整走通
2. 所有数据访问遵守 DDD 铁律：App 只经 travel-data 仓储，零 fetch/axios 直调
3. 11 个业务 utils 以纯函数形态迁移并配单测；flight 域数据层补齐 mapper/repository 单测

**成功指标**
| 指标 | 基线 | 目标 | 测量方式 |
| --- | --- | --- | --- |
| 核心链路可运行页面数 | 7 个骨架（不完整） | 6 个页面域完整可用（Query/FlightList/CabinList/OrderFill/OrderDetail/OrderList） | LynxExplorer 实机走查 |
| App 层 HTTP 直调点 | 待 Phase1 盘点（源端 7 个 service 模块） | 0 | 代码扫描（rg axios/fetch） |
| utils 单测覆盖率 | 0（未迁移） | 11 个模块全部有单测（分支覆盖核心逻辑） | vitest |
| flight 数据层测试 | 0 | mapper + repository 单测存在且通过 | vitest |

**非目标**
- 非本期页面域：beneficiaryManage、refundApply、flightPay、myPage（列为 Could，后续需求）
- 不修改源仓库 h5-journey-monorepo 任何代码（只读参考）
- 不做 i18n 多语言（本期简体中文，架构留扩展点）
- 不设计后端接口（以 Apifox 契约与 legacy service 层为权威输入）

## 需求范围
### 本期范围（Must）
- REQ-001 Query 查询页完整迁移（含城市选择能力 citySelect 的内嵌逻辑）
- REQ-002 FlightList 航班列表页完整迁移（含筛选/排序/价格标签逻辑）
- REQ-003 CabinList 舱位列表页完整迁移（含舱位等级 Tab、产品组逻辑）
- REQ-004 OrderFill 订单填单页完整迁移（含乘机人 passenger 管理能力）
- REQ-005 OrderDetail / OrderList 订单详情与列表完整迁移
- REQ-006 7 个 service 模块的接口全部映射至 travel-data 仓储（扩展 flight 仓储或新增必要子域仓储）
- REQ-007 11 个业务 utils 以纯函数迁移至 travel-domain 或 app 层 utils（按归属判定），配单测
- REQ-008 city / routeCity 两个 Pinia store 的状态逻辑迁移至 zustand flightStore（或按现有 store 结构归位）

### 本期范围（Should）
- REQ-009 citySelect 城市选择页（可作为独立页面域或 Query 内嵌组件，Phase2 定）
- REQ-010 passenger 乘机人管理页

### 非本期范围（Could，明确排除）
- beneficiaryManage、refundApply、flightPay、myPage 四个页面域
- 多语言（vue-i18n 文案仅取简体中文映射）
- Lynx Web 端（lynx-web-demo）适配

## 用户流程与关键规则
**主流程**：Query（出发/到达城市、日期）→ FlightList（航班筛选）→ CabinList（舱位/产品组选择）→ OrderFill（乘机人、联系人）→ OrderResult/OrderDetail → OrderList

**关键规则（源端业务逻辑，迁移时保持行为一致）**：
- 舱位等级 Tab 切换与产品组展示规则（cabinGradeTabs / cabinProductGroups）
- 价格标签与机场高亮规则（flightPriceTag / flightHighlightAirport）
- API 版本选择逻辑（flightApiVersion）、订单来源标记（orderSource）
- 异常路径：列表查询超时（useListQueryTimeout）、无航班/超时占位图状态

## 需求清单
| ID | 描述 | 优先级 | 前置条件 |
| --- | --- | --- | --- |
| REQ-001 | Query 页 Lynx 重写，城市/日期选择可用 | Must | REQ-009（或内嵌实现） |
| REQ-002 | FlightList 页 Lynx 重写，筛选排序价格标签可用 | Must | REQ-001、REQ-006、REQ-007 |
| REQ-003 | CabinList 页 Lynx 重写，舱位 Tab/产品组可用 | Must | REQ-002、REQ-007 |
| REQ-004 | OrderFill 页 Lynx 重写，乘机人/联系人填单可用 | Must | REQ-003、REQ-006、REQ-010 |
| REQ-005 | OrderDetail/OrderList 页 Lynx 重写 | Must | REQ-006 |
| REQ-006 | 7 个 service 接口映射 travel-data 仓储 | Must | Apifox 契约核对 |
| REQ-007 | 11 个 utils 纯函数迁移 + 单测 | Must | 无 |
| REQ-008 | Pinia store 状态逻辑迁移 zustand | Must | 无 |
| REQ-009 | citySelect 城市选择能力 | Should | REQ-006（城市接口） |
| REQ-010 | passenger 乘机人管理能力 | Should | REQ-006 |

## 非功能与兼容/迁移要求
- 遵循 Lynx 双线程模型：高频交互（列表滚动、Tab 切换）事件回调标注 `'main thread'`
- CSS 只用 Lynx 支持属性；需要响应式的页面加入 postcss.config.js 的 `RESPONSIVE_APPS`
- 遵循全局规范：Conventional Commits、一次提交一件事、AI 代码人工确认清单
- 迁移行为与原 Vue 端一致（业务规则不臆测、不改写；发现源端疑似缺陷时记录待裁决而非自行"修复"）

## 验收标准
| 关联 ID | 验收条件 |
| --- | --- |
| REQ-001~005 | LynxExplorer 扫码可完整走通主流程六页面，每页正常/空态/超时三态可观察 |
| REQ-006 | `rg "axios|fetch\("` 在 src/apps/flight 与 packages（travel-data 内部除外）零命中；接口出入参与 Apifox 契约一致 |
| REQ-007 | 11 个 utils 单测通过，核心分支有断言 |
| REQ-008 | flight 相关状态读写全部经 zustand store，无残留 Pinia 概念代码 |
| 数据层 | travel-data flight 域 mapper/repository 单测存在且通过（对齐 presale 域标准） |
| 全量 | pnpm lint / pnpm test / pnpm build 通过 |

## 发布条件、可观测性与回退要求
- 发布条件：本仓库 demo 性质，合并 next 分支 + Phase 6 冒烟报告归档即视为交付
- 可观测性：vitest 报告 + lynx-devtool 冒烟截图留证
- 回退：纯增量迁移（不改既有可用骨架的对外行为），回退即 revert 对应切片提交

## 依赖、风险与待决事项
| 项 | 说明 | 处理 |
| --- | --- | --- |
| Apifox 契约核对 | REQ-006 需对照「新旅行API文档」确认接口出入参 | Phase 2 契约确认 TASK；若契约与 legacy service 实现冲突，记录后按契约为准并标注差异 |
| 源端疑似缺陷 | 迁移中发现的源端逻辑问题 | 记录于决策记录，不改写行为，交人工裁决 |
| 无基线数据 | App 层 HTTP 直调点基线未数 | Phase 1 盘点后回填本 PRD 成功指标基线 |
| 需求号规则 | LXD-001 为自定义编号 | 待团队规则确认后回归 |

## 决策记录
| # | 日期 | 决策 | 依据 |
| --- | --- | --- | --- |
| D1 | 2026-10-28 | 源定位 `legacy-app/src/flightResource`（非 `domains/flightResource`） | 用户纠正 |
| D2 | 2026-10-28 | 本期 Must 为核心链路六页面域；citySelect/passenger 为 Should；其余四域排除 | 用户确认（推荐项） |
| D3 | 2026-10-28 | service 层映射进 travel-data 仓储，不留 axios 过渡层 | DDD 铁律 + 用户确认 |
| D4 | 2026-10-28 | 本期简体中文，i18n 留扩展点 | 用户确认 |
| D5 | 2026-10-28 | 单需求 LXD-001，Phase 2 按页面域拆 TASK 切片 | 用户确认 |
| D6 | 2026-10-28 | 源仓库只读，不回改 | 范围边界 |

## 证据与来源
- `h5-journey-monorepo/packages/legacy-app/src/flightResource`：目录清单、package.json（legacy-app 依赖）、service/pinia/utils 枚举（2026-10-28 查证）
- `lynx-demo/packages/travel-domain/src/flight`、`travel-data/src/flight`：现有迁移基线（2026-10-28 查证）
- `lynx-demo/src/apps/flight`：现有视图骨架（2026-10-28 查证）

## 评审确认
- unsop-grill-me 盘问门禁：通过（2026-10-28，5 项 frontier 全部用户确认）
- 用户确认结论：Q1~Q5 全部按推荐答案采纳（原话"按推荐来"）
- 人工评审结论：待评审（通过后方可进入 Phase 1）
