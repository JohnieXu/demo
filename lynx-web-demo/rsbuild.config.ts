import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        target: 'http://192.168.124.5:3001',
        pathRewrite: {
          '^/bundle': '',
        },
      },
    },
  },
});
