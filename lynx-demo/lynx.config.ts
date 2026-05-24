import { defineConfig } from '@lynx-js/rspeedy'
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import { pluginSass } from '@rsbuild/plugin-sass'
import * as sass from 'sass'
import dgram from 'dgram'
import { promisify } from 'util'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

// get the host ipv4 address not the localhost address
async function getOutboundIPv4Address() {
  const socket = dgram.createSocket('udp4')
  const connect = promisify(socket.connect.bind(socket))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (connect as any)(53, '8.8.8.8')
  const address = socket.address().address
  socket.close()
  return address
}

// 自动扫描src/apps目录下所有一级目录并生成entry配置
function generateEntries() {
  const appsDir = join(process.cwd(), 'src', 'apps')
  const entries: Record<string, string> = {
    index: './src/index.tsx' // 保留主入口
  }

  try {
    // 读取src/apps目录下的所有文件和目录
    const files = readdirSync(appsDir)
    
    // 过滤出目录，并为每个目录添加entry
    files.forEach(file => {
      const filePath = join(appsDir, file)
      if (statSync(filePath).isDirectory()) {
        // 假设每个目录下都有index.tsx作为入口
        entries[file] = `./src/apps/${file}/index.tsx`
      }
    })
  } catch (error) {
    console.error('Failed to scan apps directory:', error)
  }

  return entries
}

const host = await getOutboundIPv4Address()
console.log(host)
if (!host) {
  console.error('Failed to get host ipv4 address')
}

// 生成统一的entry配置
const entries = generateEntries()

export default defineConfig({
  server: {
    port: 3001,
  },
  dev: {
    assetPrefix: host ? `http://${host}:<port>/` : true,
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`
      },
    }),
    pluginReactLynx({
      engineVersion: '3.7'
    }),
    pluginTypeCheck(),
    pluginSass({
      sassLoaderOptions: {
        implementation: sass,
        api: 'modern',
      },
    }),
  ],
  resolve: {
    alias: {
      '@/*': './src/*',
      '@assets': './src/assets',
      react: './src/react-shim.ts',
    }
  },
  environments: {
    web: {
      output: {
        assetPrefix: '/',
      },
      source: {
        entry: entries
      },
    },
    lynx: {
      source: {
        entry: entries
      }
    },
  },
})
