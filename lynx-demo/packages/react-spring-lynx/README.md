# react-spring-lynx

在 [Lynx](https://lynxjs.org/) 上使用 [React Spring](https://react-spring.dev/) 动画 API 的适配层：基于 `@react-spring/animated` 的 `createHost`，把动画值通过 Lynx 节点的 `setNativeProps` 同步到原生侧。

## 重要说明

**本包属于技术验证与实验性尝试**，API 覆盖、边界行为与长期维护均未按生产级标准打磨，请勿默认用于关键业务路径。

**生产环境更推荐使用** [Motion 仓库中的 `motion-dom` 包](https://github.com/motiondivision/motion/tree/main/packages/motion-dom)：该库由 Motion 团队维护，面向 DOM/渲染层抽象更成熟，社区与文档资源也更适合严肃项目选型。

在 Lynx / ReactLynx 中接入 `motion-dom`（含主线程脚本、`import … with { runtime: 'shared' }` 等）可参考官方文档：[主线程脚本 · 引用第三方库](https://lynxjs.org/zh/react/main-thread-script.html#%E5%BC%95%E7%94%A8%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93)。

## 功能概览

- 从 `@react-spring/core` 再导出 `useSpring`、`useSpringRef` 等核心 API。
- 提供 `animated` 宿主组件，支持 Lynx 内置标签：`view`、`text`、`image`、`scroll-view`。
- 使用与 Web 版类似的 `AnimatedStyle`，支持 `x` / `y` / `z` 与常见 `transform` 相关样式的插值。

## 安装

本仓库为 pnpm workspace 子包，在根 `package.json` 中已声明：

```json
{
  "dependencies": {
    "react-spring-lynx": "workspace:*"
  }
}
```

应用内直接安装 workspace 依赖即可，无需单独发布到 npm。

## 用法

```tsx
import { animated, useSpring } from 'react-spring-lynx'

const AnimatedView = animated.view

export function Demo() {
  const styles = useSpring({
    opacity: 1,
    borderRadius: '16px',
  })

  return (
    <AnimatedView style={styles} />
  )
}
```

`animated.text`、`animated.image`、`animated['scroll-view']` 同理；`scroll-view` 在 JSX 中通常写作 `animated['scroll-view']`。

## 实现说明

- **属性下发**：`applyAnimatedValues` 在节点存在 `setNativeProps` 时调用 `node.setNativeProps(props)`，与 Lynx React 渲染模型对齐。
- **样式**：`createAnimatedStyle` 使用本包内的 `AnimatedStyle`，将 `translate` / `rotate` 等 transform 合并为可在 Lynx 侧消费的样式对象。

## 依赖

- `@react-spring/core`、`@react-spring/animated`、`@react-spring/shared`、`@react-spring/web`（与 core 版本对齐，当前为 v10 系列）
- 宿主应用需使用 `@lynx-js/react`，且节点类型满足 `NodesRef`（含 `setNativeProps`）。

## 示例

仓库内 `src/apps/monorepodemo` 演示了 `useSpring` 与 `animated.view` 的用法，可与本包对照阅读。

## 许可

与父仓库一致。
