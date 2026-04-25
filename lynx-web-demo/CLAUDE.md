# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Lynx Web development shell** - a thin React wrapper that loads and renders Lynx mobile app bundles (`.web.bundle`) via the `<lynx-view>` custom element. The actual Lynx applications are built separately in the sibling `lynx-demo` project.

## Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server at http://localhost:3000
pnpm build      # Production build to dist/
pnpm preview    # Preview production build locally
pnpm lint       # Run ESLint
pnpm format     # Run Prettier
```

## Getting Started

Start up steps (lynx-demo backend must be running first):

1. Go to `lynx-demo` directory and start the Lynx backend service
2. Go to `lynx-web-demo` directory and run `pnpm dev`
3. Browser will automatically open http://localhost:3000

## Architecture

### Entry System

The app loads Lynx bundles from a backend server. Entries are defined in `src/App.tsx` (`entryOptions`) and accessed via:

- URL: `http://localhost:3000/?entry=<key>` (e.g., `?entry=flight`)
- Bundles served from: `http://localhost:3001/{entry}.web.bundle?fullscreen=true`

### Proxy Configuration

In `rsbuild.config.ts`, `/bundle` requests are proxied to `http://localhost:3001` (lynx-demo backend), stripping the `/bundle` prefix.

### Lynx View Rendering

`<lynx-view>` is a custom web component that renders Lynx bundles. It accepts:
- `url` prop: full URL to the bundle (e.g., `/bundle/main.web.bundle?fullscreen=true`)
- `style`: CSS properties for the view container

### Dependencies

- **@lynx-js/web-core** + **@lynx-js/web-elements**: Lynx web SDKs
- **react-router-dom**: URL query parameter handling for entry selection
- **@rsbuild/core**: Build tool (not webpack or vite)

## TypeScript

Strict mode is enabled. Global types for the `<lynx-view>` custom element are declared in `src/env.d.ts`.

## Key Files

- `rsbuild.config.ts` - Dev server proxy and public directory config
- `src/App.tsx` - Entry switcher UI and Lynx view renderer
- `src/index.tsx` - React root with BrowserRouter
- `src/env.d.ts` - Lynx web component type declarations
