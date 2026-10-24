# 业务域导航

> 本文件是各业务域文档的索引。状态图例：✅ 已沉淀 · ⬜ 待沉淀

| 域  | 状态 | 文档 | 说明           |
| --- | ---- | ---- | -------------- |
| —   | ⬜   | —    | 尚未识别业务域 |

## 说明

`lynx-web-demo` 是 Lynx 应用的 Web 渲染壳层，只负责「挂载 Lynx bundle + 切换入口」，不含业务规则，
因此本仓库暂无自身业务域。

业务规则的真源在同仓兄弟项目 `lynx-demo`（`src/apps/*`），待确认是否在 `lynx-web-demo` 侧建立镜像索引。

## 壳层自身的约定（非业务域）

壳层的硬约定集中记录在 `../ARCHITECTURE.md` 与根目录 `AGENTS.md` 第二节，此处不重复：

- 入口清单真源：`src/App.tsx` 的 `entryOptions`
- 代理目标：`rsbuild.config.ts` 的 `LYNX_DEMO_ORIGIN`
- `<lynx-view>` 的副作用 import 与 `src/env.d.ts` 的 JSX 类型声明配套

> 沉淀业务域请使用 SKILL `unsop-business-domain-documentation`。
