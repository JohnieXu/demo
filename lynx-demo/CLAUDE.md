# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **ReactLynx** mobile app project bootstrapped with `create-rspeedy`. ReactLynx is a React-like framework for building mobile experiences that run on Lynx (a mobile rendering engine). Apps are scanned via QR code with the LynxExplorer app during development.

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start development server (serves at port 3001)
pnpm run build        # Build for production with rspeedy
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
pnpm run format       # Format code with Prettier
pnpm run test         # Run vitest tests
```

**Single test file:** Use vitest directly, e.g., `npx vitest run src/apps/flight/App.test.tsx`

## Architecture

### Monorepo Structure
```
lynx-demo/                 # Root ReactLynx app
├── packages/
│   ├── lynx-shared/       # Core utilities, hooks, and fetch wrapper (workspace)
│   ├── lynx-ui/           # UI component library (workspace dependency)
│   ├── react-spring-lynx/ # React Spring adapter for Lynx animations (workspace)
│   ├── travel-domain/     # DDD domain layer: entities, value objects, repository interfaces
│   └── travel-data/       # DDD data layer: HTTP clients, DTOs, mappers, repository impls
├── src/
│   ├── apps/              # Multiple entry points (auto-discovered by lynx.config.ts)
│   │   ├── flight/         # Flight booking demo
│   │   ├── furniture/      # Furniture gallery demo
│   │   └── .../           # Other demo apps
│   ├── animations/         # Shared animation hooks (useEnterFade, usePressScale)
│   ├── components/         # Shared UI components
│   └── App.tsx             # Main app entry
├── lynx.config.ts          # Build configuration
└── docs/
    └── travel-api-architecture.md  # DDD architecture reference
```

### Multi-Entry Build System
`lynx.config.ts` auto-scans `src/apps/` directories and generates entries. Each app directory with an `index.tsx` becomes a separate entry point accessible via URL parameter (e.g., `?entry=flight`).

### Threading Model
Lynx has a dual-thread model:
- **Background thread**: Standard React-like rendering via React Spring hooks for animations
- **Main thread (MTS)**: Direct style manipulation for high-frequency interactions (touch, scroll)

Animation presets in `src/animations/presets.ts` define tension/friction configs: `gentle`, `stiff`, `wobbly`, `swift`.

### React Shim
`src/react-shim.ts` maps `react` imports to `@lynx-js/react` for compatibility with libraries like `@react-spring/web` that expect React exports including `version`.

### Workspace Dependencies
Apps consume all `packages/*` via `workspace:*` protocol in package.json.
- `lynx-shared` — Low-level fetch wrapper (`createFetch`), hooks, platform utilities
- `lynx-ui` — Reusable UI components
- `react-spring-lynx` — Animation primitives for Lynx
- `travel-domain` — Pure domain layer (entities, repository interfaces, `Result<T,E>`). **Zero external dependencies.**
- `travel-data` — Data layer (DTOs, mappers, HTTP datasources, repository implementations). Depends on `travel-domain` + `lynx-shared`.

### API / DDD Architecture

Business API access follows a **Domain-Driven Design** layered approach. See `docs/travel-api-architecture.md` for the full design document.

**Dependency direction:** App → `travel-data` → `travel-domain` (inner layer knows nothing about outer layers)

| Layer | Package | Responsibility |
|-------|---------|---------------|
| **App** | `src/apps/*` | UI, state stores (Zustand), orchestration |
| **Data** | `travel-data` | HTTP calls, DTOs, mappers, repository implementations |
| **Domain** | `travel-domain` | Entities, value objects, repository interfaces, `Result<T,E>` |

**Key rules for working with APIs:**
1. App code imports repositories from `travel-data`, never calls `fetch` directly.
2. Repository methods return `Result<T, DomainError>` — use `isSuccess` / `isFailure` checks, not try/catch.
3. DTOs live in `travel-data` and are mapped to domain entities before reaching app code.
4. Adding a new domain (e.g. `hotel`): define `IHotelRepository` in `travel-domain`, implement `HotelRepository` in `travel-data`.

**Example usage in an app:**
```ts
import { FlightRepository } from 'travel-data'
import type { FlightSearchCriteria } from 'travel-domain'

const repo = new FlightRepository()
const result = await repo.search({ departure: '北京', arrival: '上海', date: '2024-09-01' })

if (result.isSuccess) {
  result.data.list        // Flight[] — typed domain entities
  result.data.hasMore     // pagination flag
} else {
  result.error.code       // 'NETWORK_ERROR' | 'UNKNOWN_ERROR'
  result.error.message
}
```

## Key Dependencies
- `@lynx-js/react` - React implementation for Lynx
- `@lynx-js/rspeedy` - Build tool (not standard Vite)
- `@lynx-js/react-rsbuild-plugin` - Rspeedy React plugin
- `@react-spring/web` - Animation library (via react-spring-lynx adapter)
- `@tanstack/react-router` - Routing with URL query parameter support for entry selection
- `@lynx-js/qrcode-rsbuild-plugin` - QR code generation for LynxExplorer scanning

## Development Notes
- The dev server displays a QR code; scan with LynxExplorer app on mobile to preview
- CSS uses Lynx-specific properties; avoid standard CSS properties that Lynx doesn't support
- Animation callbacks use `'main thread'` directive for touch/gesture handlers to avoid thread-switch latency

## Responsive Adaptation

Apps can opt-in to viewport-based responsive scaling via PostCSS configuration.

### How It Works

`postcss.config.js` uses `postcss-px-to-viewport-8-plugin` to convert `px` to `vw` units for apps that need responsive scaling. The `include` pattern scopes the transformation to specific apps only.

### Enabling Responsive Scaling for an App

Edit `postcss.config.js` and add the app name to `RESPONSIVE_APPS`:

```js
const RESPONSIVE_APPS = ['flight', 'furniture'] // Add app names here
```

### Key Configuration Points

| Option | Value | Description |
|--------|-------|-------------|
| `viewportWidth` | `375` | Design baseline (iPhone SE width) |
| `viewportUnit` | `vw` | Output unit |
| `include` | Regex pattern | Scopes transformation to specific apps |
| `selectorBlackList` | `['.ignore', '.hairlines']` | Selectors to exclude from conversion |

### Design Principle

- **Low Coupling**: Apps don't need code changes to opt-in; just add to `RESPONSIVE_APPS`
- **High Reusability**: The PostCSS config is reusable across all apps
- **Non-invasive**: No changes to app module files required
