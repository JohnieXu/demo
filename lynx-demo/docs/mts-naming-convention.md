# MTS 函数命名规范（lynx-demo）

> 本规范在 lynx-ui 团队既有 `MT` / `MTS` 命名习惯的基础上，结合 lynx-demo 项目的实际用法进行收敛，形成可在本仓库统一执行的约定。

## 1. 背景与目标

ReactLynx 的双线程架构下，"主线程脚本（Main Thread Script, MTS）" 是带 `'main thread'` 注解、需通过 `runOnMainThread(fn)(...)` 跨线程调用的函数。由于这类函数必须能被序列化、且执行环境与 background 完全不同，**仅靠注释或调用点难以一眼区分函数归属的线程**，因此需要一套统一的命名约定，让阅读 `runOnMainThread(...)` 调用方时能零成本识别"传入的是主线程函数"。

目标：

- 在 `runOnMainThread(xxx)` 调用点一眼看出 `xxx` 跑在主线程
- 避免误把 background 闭包传进 `runOnMainThread`（因闭包捕获的变量无法跨线程访问）
- 在 `useMainThreadRef` / `main-thread:ref` 配套出现的 update / handler 函数上有清晰标识

## 2. 后缀约定

| 后缀    | 语义                                              | 典型场景                                |
| ------- | ------------------------------------------------- | --------------------------------------- |
| `MT`    | Main Thread，普通工具/操作函数（多为纯函数或轻逻辑） | 数学/工具函数、简单 ref 更新、状态变更 |
| `MTS`   | Main Thread Script，复合/带状态/有副作用的脚本函数 | 配套 `useMainThreadRef` 的 update 钩子、`main-thread:bindtap` 事件 handler |
| `MTRef` | 主线程 ref 的 setter/同步函数                     | `setXxxMTSRef`、`setChildrenMTSRef`     |
| `MTM` / `MainThreadMethod` | 显式标注"主线程方法"，用于跨包导出的主线程入口  | `startRefreshMainThreadMethod` |

> 经验法则：**短平快 → `MT`；长链路/带 ref 操作/事件 handler → `MTS`。**

## 3. 函数定义规范

### 3.1 标注 `'main thread'` 指令

任何带上述后缀的函数，**函数体首行必须是 `'main thread';`** 指令字符串。这是 Lynx 编译器识别 MTS 的硬性条件。

```ts
// ✅ 推荐
const updateIndicator = useCallback(({ left, width }: IndicatorStyle) => {
  'main thread';
  const indicator = indicatorRef.current;
  if (!indicator) return;
  indicator.setStyleProperty('transform', `translate3d(${left}px, 0, 0)`);
  // ...
}, [indicatorRef]);

// ❌ 缺指令 → 编译器不会把函数体分发到主线程
const updateIndicator = useCallback(({ left, width }: IndicatorStyle) => {
  const indicator = indicatorRef.current; // 报错：主线程 ref 不能在 background 访问
  // ...
}, [indicatorRef]);
```

### 3.2 后缀与指令缺一不可

- 仅后缀无指令：函数仍按 background 编译，运行时会因无法访问 `useMainThreadRef` 而崩溃
- 仅指令无后缀：可工作但违反本规范，Code Review 应拒绝合并

## 4. 调用规范

### 4.1 通过 `runOnMainThread` 调用

```ts
// ✅ 推荐：传入的是带 MT/MTS 后缀的主线程函数引用
runOnMainThread(updateIndicator)({ left, width });
runOnMainThread(handleSegmentChangeMTS)(event);

// ❌ 禁止：直接传箭头函数（每次都是新引用，闭包变量无法跨线程）
runOnMainThread(({ left, width }: IndicatorStyle) => {
  'main thread';
  // ...
})({ left, width });
```

### 4.2 事件绑定使用 `main-thread:` 前缀

```tsx
// ✅ 推荐：与 handleXxxMTS 配对
<view
  main-thread:ref={indicatorRef}
  main-thread:bindtap={handleSegmentChangeMTS}
  bindtap={handleSegmentChange}        // fallback: 编译器/平台不支持时降级
/>

// ❌ 禁止：把主线程 handler 绑到 background 事件
<view bindtap={handleSegmentChangeMTS} />
```

### 4.3 依赖数组需包含主线程 ref

```ts
const updateIndicator = useCallback((style) => {
  'main thread';
  indicatorRef.current?.setStyleProperty(/* ... */);
}, [indicatorRef]); // ✅ 必须把 useMainThreadRef 放进依赖
```

## 5. 本仓库实例对照

参考 [src/apps/flight/components/Segments.tsx](../src/apps/flight/components/Segments.tsx)：

| 函数名                | 类型     | 对应 ref / 事件             | 用途                            |
| --------------------- | -------- | --------------------------- | ------------------------------- |
| `updateIndicator`     | `MT`     | `indicatorRef` (main-thread) | 更新 indicator 位置与宽度       |
| `handleSegmentChangeMTS` | `MTS` | `main-thread:bindtap`        | 切 tab 时同步 indicator 样式    |

可参考 lynx-ui 包内的同款约定（来自 `@lynx-js/lynx-ui`）：

- `MT`：`doResetMT`、`startMT`、`pauseMT`、`expandMT`、`collapseMT`、`fixPrecisionMT`
- `MTS`：`swipePrevMTS`、`swipeNextMTS`、`swipeToMTS`、`showActionAreaMTS`、`closeActionAreaMTS`
- `MTRef`：`setChildrenMTSRef`
- `MTM`：`startRefreshMainThreadMethod`

## 6. 反例（Code Review 必须驳回）

```ts
// ❌ 无后缀的主线程函数
function handleTap(e) { 'main thread'; /* ... */ }

// ❌ 后缀与实际不匹配
const startMTS = () => { /* 没 'main thread' 指令 */ };

// ❌ 闭包捕获 background 变量
const updateX = useCallback(() => {
  'main thread';
  console.log(someReactState); // 报错：background 状态在主线程不可见
}, [someReactState]);
```

正确写法：把 `someReactState` 通过参数传入 MTS 函数。

## 7. 参考

- [ReactLynx MTS 官方文档（Lynx 引擎）](https://lynxjs.org/zh/api/engine/element-side/main-thread-script.html)
- 仓库内范例：[src/apps/flight/components/Segments.tsx](../src/apps/flight/components/Segments.tsx)
- 仓库内动画工具：[src/animations/mts/](../src/animations/mts/)（`enterFade.ts`、`pressScale.ts`）

## 8. 变更记录

| 日期       | 变更人 | 摘要                                 |
| ---------- | ------ | ------------------------------------ |
| 2026-06-14 | AI 起草 | 首次发布：从 lynx-ui 既有约定收敛而来 |
