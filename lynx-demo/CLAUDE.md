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
│   ├── lynx-ui/           # UI component library (workspace dependency)
│   └── react-spring-lynx/ # React Spring adapter for Lynx animations
├── src/
│   ├── apps/              # Multiple entry points (auto-discovered by lynx.config.ts)
│   │   ├── flight/         # Flight booking demo
│   │   ├── furniture/      # Furniture gallery demo
│   │   └── .../           # Other demo apps
│   ├── animations/         # Shared animation hooks (useEnterFade, usePressScale)
│   ├── components/         # Shared UI components
│   └── App.tsx             # Main app entry
└── lynx.config.ts          # Build configuration
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
Apps consume `lynx-ui` and `react-spring-lynx` via `workspace:*` protocol in package.json.

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
