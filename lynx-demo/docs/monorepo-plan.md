# Monorepo 结构规划（最小改动）

## 目标
- 在保持现有 demo 可运行的前提下，引入 monorepo 工作区
- 新增两个模块：react-spring-lynx、lynx-ui
- 降低对现有构建与目录的影响，逐步演进

## 规划目录结构
```
.
├─ docs/
│  └─ monorepo-plan.md
├─ packages/
│  ├─ react-spring-lynx/
│  │  ├─ src/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ lynx-ui/
│     ├─ src/
│     ├─ package.json
│     └─ tsconfig.json
├─ src/
│  └─ ...现有demo不变
├─ package.json
├─ pnpm-workspace.yaml
└─ lynx.config.ts
```

## 模块职责建议
- react-spring-lynx：对 @react-spring/web 做 Lynx 侧适配与封装，提供一致的动画 API
- lynx-ui：基础 UI 组件库（Button、Card、List 等），可选地依赖 react-spring-lynx 提供动画能力

## 最小改动策略
- 保持现有 src 目录与入口配置不变
- 仅新增工作区配置与 packages 目录
- demo 继续作为根项目运行与发布，不改动构建入口与脚本

## 建议实施步骤
1. 新增 pnpm-workspace.yaml，包含根项目与 packages 工作区
2. 在 packages 下创建两个模块的基础结构与 package.json
3. 根项目通过 workspace 依赖引用新增模块
4. 按需逐步抽取现有公共组件与动画工具到新模块

## 对现有项目的影响评估
- 构建入口与现有 demo 路径无需修改
- lynx.config.ts 无需调整
- 依赖与脚本保留原状，仅新增 workspace 相关配置
