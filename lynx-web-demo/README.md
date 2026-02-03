# Rsbuild project

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Start the dev server, and the app will be available at [http://localhost:3000](http://localhost:3000).

```bash
pnpm dev
```

## 访问说明

开发环境入口：

- 访问地址：http://localhost:3000
- 入口列表定义：src/App.tsx 的 entryOptions
- 实际资源请求：`/bundle/{entry}.web.bundle?fullscreen=true`

入口示例：

- `/bundle/main.web.bundle?fullscreen=true`
- `/bundle/index.web.bundle?fullscreen=true`

入口代理配置：

- 开发代理定义：rsbuild.config.ts 的 server.proxy
- 规则：`/bundle` → `http://192.168.124.5:3001`（并去掉前缀 `/bundle`）

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Learn more

To learn more about Rsbuild, check out the following resources:

- [Rsbuild documentation](https://rsbuild.rs) - explore Rsbuild features and APIs.
- [Rsbuild GitHub repository](https://github.com/web-infra-dev/rsbuild) - your feedback and contributions are welcome!
