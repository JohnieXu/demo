## Rspeedy project

This is a ReactLynx project bootstrapped with `create-rspeedy`.

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Scan the QRCode in the terminal with your LynxExplorer App to see the result.

You can start editing the page by modifying `src/App.tsx`. The page auto-updates as you edit the file.

## Mock / debug proxy

A local Koa proxy (`mock/server.mjs`) can sit between the app and the real travel API
(`https://ts-api.ourtour.com`) to log the exact requests `travel-data` sends and the
raw responses the server returns.

```bash
pnpm run mock      # terminal 1: start the proxy on http://127.0.0.1:4000
pnpm run dev:mock  # terminal 2: dev server with the API base URL pointed at the proxy
```

- `pnpm run dev:mock` runs `rspeedy dev --env-mode mock`, which loads `.env.mock`
  (`PUBLIC_TRAVEL_API_URL=http://127.0.0.1:4000`) on top of `.env`.
- Plain `pnpm run dev` only loads `.env` (empty `PUBLIC_TRAVEL_API_URL`), so requests
  go straight to the real backend.
- For an ad-hoc override without touching committed files, set `PUBLIC_TRAVEL_API_URL`
  in a gitignored `.env.local`.
- `PORT` / `UPSTREAM` env vars can override the proxy's listen port and upstream target.

## Documentation

- [MTS 函数命名规范](./docs/mts-naming-convention.md) — Main Thread Script 函数的 `MT` / `MTS` / `MTRef` / `MTM` 后缀约定与示例
- [use-spring 动画设计与 Lynx 项目适配方案](./docs/use-spring-lynx.md)
- [Android DDD 核心概念](./docs/android-ddd-core-concepts.md)
- [Monorepo 规划方案](./docs/monorepo-plan.md)
- [Travel API 架构](./docs/travel-api-architecture.md)
