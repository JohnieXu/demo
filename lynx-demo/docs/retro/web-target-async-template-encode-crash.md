# Web target 构建崩溃：template-webpack-plugin 对 async chunk 的空 manifest 解构 + wasm 编码 undefined

> owner: JohnieXu
> updated: 2026-10-25
> related: ../../src/apps/flight/routes.tsx, ../../lynx.config.ts, ../sass-embedded-version-note.md
>
> 一坑一档。本文记录 2026-10-24 排查「`rspeedy build` 跑不出 `.web.bundle`」的全过程，
> 结论先行，排查路径留档供后来人复现。
>
> **状态：已修复，且不需要任何本地补丁。**

## 结论

**崩溃不在业务代码里，是上游 `@lynx-js/template-webpack-plugin@0.11.1` 的缺陷；触发它的是本仓库的一段死代码。**

完整因果链：

1. `src/apps/flight/routes.tsx` 里保留了 7 个「以备将来修复后再用」的 `React.lazy(() => import(...))` 常量，
   且把它们 `export` 了出去；
2. **即使这些组件不在任何 JSX 里，只要 `import()` 表达式存在且被 export，bundler 依然会为它生成 async chunk；**
3. web target 下插件对 async chunk 的处理有缺陷 —— 先是对**空 manifest** 做数组解构抛 TypeError，
   修掉后仍会把 `undefined` 喂给 wasm encoder，抛
   ``Failed to convert JavaScript value `Undefined` into rust type `String` ``；
4. 结果：`rspeedy build` 崩溃，产不出 `.web.bundle`。

**最终修复：删除那 7 个没人用的 `*Lazy` 常量及其 export（死代码）。**
删除后仓库不再产生 async chunk，上游缺陷不再被触发，**`pnpm patch` 补丁已随之废弃并移除**。

> 上游缺陷本身仍然存在（见「遗留风险」），只是本仓库不再踩到它。

## 现象与报错特征

| 轮次    | 报错特征                                                                                                        | 位置                                                                   |
| ------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 第 1 轮 | 对空数组解构取 `[name, content]` 抛 TypeError，栈顶在 `WebEncodePlugin.js`                                      | `node_modules/@lynx-js/template-webpack-plugin/lib/WebEncodePlugin.js` |
| 第 2 轮 | ``Failed to convert JavaScript value `Undefined` into rust type `String` ``（wasm 报错，JS 栈不显示内部调用点） | 同上，但实际根因在 `LynxTemplatePlugin.js`                             |

第 2 轮是**关键**：wasm 报错没有 JS 调用栈，只有一句类型转换失败，很容易误判成「编码器版本问题」而去换
encoder 版本。实际要顺着「谁传了 undefined」反查，才能定位到 `LynxTemplatePlugin`。

## 触发条件

三者同时满足才会触发：

1. `lynx.config.ts` 里 `environments.web` 处于启用状态（web 与 lynx 两个 environment 都要构建）；
2. 编译单元里存在 async/lazy chunk；
3. `@lynx-js/template-webpack-plugin` 为本仓库当前锁定的 `0.11.1`（上游 ≥0.16.x 已知修复，见 TODO）。

只跑 `lynx` environment、不开 `web`、或代码里没有 lazy chunk 时，均不触发。

### 本仓库的具体触发源：`flight` 的 7 个「仅供未来参考」lazy 常量

`src/apps/flight/routes.tsx` 为了绕开另一个已知问题（见下），把路由视图改成了**同步 import**，
但同时保留了一组 lazy 版本「以备将来修复后再用」：

```ts
// Sync imports are used as a workaround for a Lynx lazy-bundle CSS bug:
// global CSS imported in the main entry (App.css -> lynx-ui/styles/index.css)
// is lost inside React.lazy() async chunks. See:
// https://github.com/lynx-family/lynx-stack/issues/2897
import { Query } from './views/Query/index';
// ...

// Lazy versions are kept for future reference once the issue above is fixed.
const QueryLazy = lazy(() =>
  import('./views/Query/index').then((m) => ({ default: m.Query })),
);
// ... 共 7 个
export { QueryLazy, BookingLazy, /* ... */ CabinListLazy };
```

**关键点：即使这些组件没有出现在任何 JSX 里，只要 `import()` 表达式存在且模块被 export，bundler 依然会为它
生成 async chunk。** 正是这 7 个 async chunk 让 web target 命中了上游 bug。

> 也就是说：`flight` 入口同时踩了两个坑 —— 已知问题 lynx-stack#2897（async chunk 丢全局 CSS）与本文的
> web target 编码崩溃。而 `flight` 又是 `lynx-web-demo` 入口清单里暴露出来的入口。

## 根因分析

### 第一层：空 manifest 解构

`WebEncodePlugin.js` 中原本的写法：

```js
const [name, content] = last(Object.entries(encodeData.manifest));
```

`last()` 在空数组上返回 `undefined`，解构 `undefined` 抛 TypeError。async chunk 的
background thread manifest 在当前 compilation 中为空，于是命中。

### 第二层：web 环境无 async 资产，却仍生成 async 模板（真正的根因）

`LynxTemplatePlugin.js` 中，async 模板的生成不区分 environment：

```js
const asyncAssetsInfoByGroups = this.#getAssetsInformationByFilenames(...);
return this.#encodeByAssetsInformation(compilation, asyncAssetsInfoByGroups, entryNames, filenameTemplate, ...);
```

web target 产出的 bundle 不含 async 资产（`asyncAssetsInfoByGroups.mainThread.length === 0`），
此时 encoder 拿到的 template 内容是 `undefined`，于是 wasm 抛类型转换错误。

**所以第一层只是表象。** 只修 manifest 解构，错误会变成第 2 轮的 wasm 报错 —— 必须同时短路。

## 排查决策路径（留档）

| 步骤 | 假设                                     | 验证动作                                                         | 结论                                                                                                     |
| ---- | ---------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1    | 依赖版本太老，web-core 不支持 web bundle | `pnpm list @lynx-js/web-core`                                    | 实际 `0.18.4`，package.json 要求 `^0.20.4` → 确实要重装（另见「连带坑」）                                |
| 2    | `pnpm install` 没生效 / 卡死             | 观察输出                                                         | pnpm 要交互确认 purge node_modules，非交互模式下确认被静默吞掉 → 加 `--config.confirmModulesPurge=false` |
| 3    | web target 压根没启用                    | 读 `lynx.config.ts`                                              | `environments.web` 整段被注释（未提交的本地改动）→ 还原                                                  |
| 4    | 版本/配置都对了还崩 → 是本仓库代码问题？ | 读栈顶                                                           | 栈在 `node_modules` 内，是上游包 → 转为「打不打补丁」决策                                                |
| 5    | 升级上游版本能否解决                     | 查 `@lynx-js/template-webpack-plugin` 版本线                     | 上游 ≥0.16.x 已修，但要求 `rspeedy ^0.17` + `@rsbuild/core ^2` → **主版本迁移，代价与收益不匹配，否决**  |
| 6    | 直接改 `node_modules` 行不行             | —                                                                | `pnpm install` 后即丢，不可复现、不可提交 → 否决                                                         |
| 7    | `pnpm patch`                             | 打补丁 → 重建                                                    | ✅ 当时的采用方案：可提交、可复现、`pnpm install` 自动重放                                               |
| 8    | 补丁 1 只解决表象                        | 重建                                                             | 错误变成第 2 轮 wasm 报错 → 继续查                                                                       |
| 9    | 补丁 2 定位到 async 资产为空             | 重建                                                             | 退出码 0，产出 14 个 `.web.bundle` → 当时判定「已修复」                                                  |
| 10   | **复盘时追问「是谁产生了 async chunk」** | `rg "import\\(\|lazy\\(" src packages`                           | 命中 `src/apps/flight/routes.tsx` 的 7 个死代码 `*Lazy` → 真正的可控触发源                               |
| 11   | **删除死代码后是否还需要补丁？**         | 删 `*Lazy` + 删补丁 → `pnpm install` → `pnpm exec rspeedy build` | **退出码 0，14 个 `.web.bundle` 全部产出 → 补丁不必要，已移除**                                          |

**教训 1**：第 3 步的 `git diff` 就能一眼看出 `lynx.config.ts` 被改过，但在排查顺序里却排在依赖检查之后 ——
先看 `git status` / `git diff` 再看依赖树，能省掉一整轮猜测。

**教训 2**：wasm 报错没有 JS 栈，看到「类型转换失败」不要先怀疑依赖版本，先问「谁传了 undefined」。

**教训 3（最重要）**：第 7–9 步的 `pnpm patch` 是**用补丁掩盖症状**，没有回答「谁产生了 async chunk」。
真正的可控根因在仓库自己代码里，一行 `rg` 就能定位。**遇到 node_modules 里的崩溃，先 `rg` 一遍
自己的代码里有没有触发该路径的写法，再考虑打补丁。**

## 最终修复（已落地）

删除 `src/apps/flight/routes.tsx` 中没人使用的 7 个 `*Lazy` 常量及其 export，并补上约束注释：

```diff
-import { lazy, Suspense } from '@lynx-js/react'
+import { Suspense } from '@lynx-js/react'
+
 // Sync imports are used as a workaround for a Lynx lazy-bundle CSS bug:
 // global CSS imported in the main entry (App.css -> lynx-ui/styles/index.css)
 // is lost inside React.lazy() async chunks. See:
 // https://github.com/lynx-family/lynx-stack/issues/2897
+//
+// Keep these imports synchronous: a `React.lazy(() => import(...))` call
+// produces an async chunk even when the component is never rendered, and
+// the web environment cannot encode async chunks. See
+// ../../../docs/retro/web-target-async-template-encode-crash.md
 import { Query } from './views/Query/index'
```

同时移除：`patches/@lynx-js__template-webpack-plugin@0.11.1.patch` 与
`pnpm-workspace.yaml` 里的 `patchedDependencies`。

> 保留 `LazyLoad` 组件（`Suspense` 包装器）：它本身不产生 async chunk，全仓库无人引用但属于兼容出口，
> 留着无害。

### 验证记录（2026-10-25）

| 项                                      | 结果                                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm exec rspeedy build`（**无补丁**） | **退出码 0**，日志无 error / warn                                                             |
| `dist/*.web.bundle` 数量                | **14**（与打补丁时一致）                                                                      |
| `dist` 内 async 分片残留                | **无**                                                                                        |
| `flight.web.bundle` 体积                | 888.2 kB → **786.0 kB**（异步分片确实消失了）                                                 |
| `flight.lynx.bundle` 体积               | 925.9 kB → **834.2 kB**                                                                       |
| 浏览器冒烟                              | `lynx-web-demo` 打开 `?entry=flight`，页面正常渲染（机票/火车票、查询、最近查询、预订、订单） |

## 曾经的临时方案：`pnpm patch`（已废弃并移除）

留档以便理解当时的判断过程，**当前仓库不再包含该补丁**：

- 补丁文件：`patches/@lynx-js__template-webpack-plugin@0.11.1.patch`
- 注册位置：`pnpm-workspace.yaml` 的 `patchedDependencies`

```yaml
patchedDependencies:
  '@lynx-js/template-webpack-plugin@0.11.1': patches/@lynx-js__template-webpack-plugin@0.11.1.patch
```

补丁内容（两处）：

```js
// lib/WebEncodePlugin.js —— 空 manifest 兜底
const manifestEntries = Object.entries(encodeData.manifest);
const [name, content] = manifestEntries.length > 0
    ? manifestEntries[manifestEntries.length - 1]
    : [undefined, undefined];
// ...
manifest: content === undefined ? {} : { '/app-service.js': content },
```

```js
// lib/LynxTemplatePlugin.js —— web 环境跳过 async 模板生成
if (asyncAssetsInfoByGroups.mainThread.length === 0) {
  return Promise.resolve();
}
```

**为什么废弃**：补丁 2 的本质是「跳过 async 模板生成」，等于**把 web target 的 async 能力整个砍掉**，
而不是修好它。只要仓库里没有 async chunk，这个补丁就是纯负担（多一个要跟着版本号走的本地改动）。
删除死代码后，补丁既没必要也不再有副作用。

## 连带坑（同期踩到，与本 bug 无关但同属一次排障）

1. **依赖漂移**：`lynx-web-demo/node_modules` 里是 `@lynx-js/web-core@0.18.4`，package.json 要求 `^0.20.4`。
   web bundle 格式与 web-core 版本强绑定，版本不对会渲染失败。修复：
   `pnpm install --config.confirmModulesPurge=false`。
2. **pnpm purge 提示吞掉确认**：非交互环境下 `pnpm install` 会因为要确认清空 node_modules 而静默中止，
   表现为「命令跑完但依赖没更新」。必须显式带 `--config.confirmModulesPurge=false`。
3. **代理写死本机 IP**：`lynx-web-demo/rsbuild.config.ts` 原先硬编码 `http://192.168.124.5:3001`，
   该 IP 已失效，且 3001 端口常被其它项目占用、rspeedy 会自动顺延。已改为
   `process.env.LYNX_DEMO_ORIGIN ?? 'http://localhost:3001'`。

## 遗留风险与限制

> ⚠️ **上游缺陷仍在（web target 不支持 async/lazy chunk），只是本仓库当前不再产生 async chunk。**

约束：**`lynx-demo` 的路由视图必须保持同步 import。**

- 任何人在 `src/apps/*` 里新增 `React.lazy(() => import(...))`，web 构建会立刻再次崩溃；
- `lynx-stack#2897`（async chunk 丢主入口全局 CSS）尚未修复，这也正是当初改同步 import 的原因；
- 若将来官方支持 web async bundle，才可以把路由改回 `React.lazy()`（需同时解决 #2897）。

## TODO：官方新版本核查（负责人后续跟进）

> 负责人计划去 Lynx 官方仓库 / changelog 查证新版本是否已修复本问题。
> **当前仓库已不依赖任何补丁，此项不再阻塞构建**，但影响「未来能否重新用上 `React.lazy()`」。

### A. 核查上游（owner 跟进）

- [ ] 在 Lynx 官方仓库 / changelog 确认 `template-webpack-plugin` 新版本是否已修复该问题
      （检索关键词：web environment、async bundle、empty manifest、async template encode）。
- [ ] 确认官方对 **web target 是否应该支持 async/lazy chunk** 的定位：
  - 若官方结论是「web 不支持 async bundle」→ 维持现状（同步 import），把本文结论升级为「符合官方定位」；
  - 若官方已支持 async → 可评估把 `flight` 的路由改回 `React.lazy()`，需**同时**解决 `lynx-stack#2897`。
- [ ] 若升级上游工具链（`@rsbuild/core ^2` / `rspeedy ^0.17`）：评估连带影响，回写本文。

### B. 备选路径（已完成，2026-10-25）

- [x] **验证移除 `*Lazy` 常量后是否还需要补丁** → 实测不需要：删除后 `pnpm exec rspeedy build` 退出码 0，
      14 个 `.web.bundle` 全部产出，`flight` bundle 体积下降约 100 kB（异步分片消失）。
- [x] **移除补丁** → 删除 `patches/` 与 `pnpm-workspace.yaml` 的 `patchedDependencies`，`pnpm install` 后重建通过。
- [x] **在代码里留下约束注释** → `src/apps/flight/routes.tsx` 说明「必须同步 import」及其原因。

### C. 关联的已知问题（另一条线，勿混淆）

- [ ] `lynx-family/lynx-stack#2897` —— Lynx lazy bundle 丢失主入口全局 CSS。这是当初把 `flight`
      路由改成同步 import 的原因，与本文的编码崩溃是**两个独立问题**，修好其一不会自动修好另一个。

## 复现步骤（重现崩溃）

```bash
# 1. 在 src/apps/flight/routes.tsx 加回一个 lazy 常量并 export
const QueryLazy = lazy(() => import('./views/Query/index').then(m => ({ default: m.Query })))
export { QueryLazy }

# 2. 触发构建
pnpm exec rspeedy build
#    期望：崩溃于 WebEncodePlugin.js / LynxTemplatePlugin.js
```

## 相关链接

- 上游包：`@lynx-js/template-webpack-plugin`（npm）
- 上游仓库：https://github.com/lynxjs/lynx
- 关联 issue：https://github.com/lynx-family/lynx-stack/issues/2897（async chunk 丢全局 CSS）
- Lynx 文档入口：https://lynxjs.org/llms.txt
- 同类「版本钉死」记录：[`../sass-embedded-version-note.md`](../sass-embedded-version-note.md)
