# DIY-MCP Project

A MCP project managed with pnpm workspaces, containing client and server packages.

## Prerequisites
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)

## Installation
In the project root directory, run:
```bash
pnpm install
```

## Building the Server
```bash
pnpm --filter server build
```

## Running the Server Package

### Method 1: From root directory
```bash
pnpm --filter server start
# or shorthand
pnpm -F server start
```

### Method 2: From server directory
```bash
cd server
pnpm start
```

### Method 3: With inspector
```bash
pnpm --filter server inspector
```

## Building the Client
```bash
pnpm --filter client build
```

## Running the Client Package

### Method 1: From root directory
```bash
pnpm --filter client start
# or shorthand
pnpm -F client start
```

### Method 2: From client directory
```bash
cd client
pnpm start
```

## Project Structure
```
diy-mcp/
├── client/         # Client package
├── server/         # Server package
├── package.json    # Root package.json
└── pnpm-workspace.yaml  # pnpm workspace config
```
