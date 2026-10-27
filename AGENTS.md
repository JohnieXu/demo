# johniexu-demo（多技术栈 demo 试验场）Agent 规则

> owner: johniexu（待确认）
> updated: 2026-10-27
> 本文件是本仓库 AI 规则的**唯一真源**。

<!-- global:start 由 standards/global-standards.md 同步，勿手工修改 -->
<!-- global:end -->

## 一、本仓库技术形态
- 项目：johniexu-demo —— 包含一系列用于测试、原理分析、方案验证的 demo，持续更新（根目录无统一 package.json，每个子目录是独立项目）
- 技术栈（多栈并存，按子目录区分）：
  - Lynx 跨端：lynx-demo / lynx-web-demo / lynx-stack / lynx-android-demo / lynx-macos-demo / lynx-windows-demo / lynx-windows-cmake-demo / lynx-refresh-bug（rspeedy + @lynx-js/react + pnpm workspace）
  - Web 前端：lit-demo / quill-editor / webpack / webpack-project-base / nuxt-babel / babel-plugin-import-demo / tsconfig-paths / trae-demo / uipro-demo / johniexu-demo / mobile-layout 等（Vue / Lit / webpack / nuxt 等）
  - WebAssembly：webassembly / dominantcolor_demo（Go → Wasm）、assemblyscript_demo
  - 其他语言：go-web-demo / grpc-demo（Go）、cpp-demo（C++）
  - 工具/基建：bundler-tools / babel / diy-mcp（含 pnpm workspace 的 MCP 服务）
  - 算法：algorithm（手写基本算法）
- 运行环境：各子项目独立配置；lynx 系使用 pnpm workspace（如 lynx-demo、lynx-refresh-bug、diy-mcp）；Node 版本待确认
- 常用命令（以 lynx-demo 为例，各子项目脚本不同，进入子目录后以其 package.json 为准）：
  ```bash
  pnpm dev        # rspeedy dev
  pnpm build      # rspeedy build
  pnpm test       # vitest run
  pnpm lint       # eslint .
  pnpm mock       # node mock/server.mjs
  ```
- 目录结构（根目录职责划分，均为并列的独立 demo 项目）：
  ```
  lynx-*          Lynx 跨端容器相关 demo（含 Android/macOS/Windows 原生壳与 Web 平台）
  *-demo          各技术方案验证 demo（expo / grpc / lit / tsdoc / westore 等）
  webpack* babel* bundler-tools  构建工具链原理分析与自定义配置验证
  webassembly / assemblyscript_demo / dominantcolor_demo  Wasm 相关验证
  algorithm       手写算法练习
  assets          仓库静态资源（如 README 引用的图片）
  ```

## 二、本仓库特有规范 / 对全局的覆盖
- 本仓库是 demo 集合，**修改任一子项目前先确认其独立的技术栈与脚本**，不要套用其他子项目的命令
- 部分子项目使用 pnpm workspace（存在独立 pnpm-workspace.yaml），依赖以 `workspace:*` 关联，需在其 workspace 根目录安装
- 已配置 MCP：Apifox（新旅行API文档，project=6446390）、Figma（Framelink），`.mcp.json` 在仓库根
- 子项目间无共享构建/发布流程，无统一 lint/test 门禁（待确认）
- 与全局规范的差异：待确认

## Stack Overlay
- primary: none（多栈 demo 集合，无单一主栈）
- secondary: [lynx, web, wasm, go]
- knowledge-adapter: local
- runtime-smoke: none
- design-source: figma
- ui-mode: none

## 三、业务与文档指路牌
- 业务规则见 `docs/domains/`
- 系统架构见 `docs/ARCHITECTURE.md`
- 历史坑见 `docs/retro/`
- 需求档案见 `docs/requirements/`（每个需求号一个目录）
- 团队知识库：通过 knowledge adapter 检索（具体接入方式见 `AGENTS.md` 第二节）
