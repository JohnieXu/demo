import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lynx bundle 服务端（lynx-demo 的 rspeedy dev）地址。
// rspeedy 端口被占用时会自动顺延，可用 LYNX_DEMO_ORIGIN 覆盖实际地址。
const lynxDemoOrigin = process.env.LYNX_DEMO_ORIGIN ?? 'http://localhost:3001';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  server: {
    publicDir: [
      {
        name: path.join(__dirname, '../', 'lynx-demo', 'dist'),
      },
    ],
    proxy: {
      '/bundle': {
        target: lynxDemoOrigin,
        pathRewrite: {
          '^/bundle': '',
        },
      },
    },
  },
});
