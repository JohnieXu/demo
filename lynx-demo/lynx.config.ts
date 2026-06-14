import { defineConfig } from '@lynx-js/rspeedy'
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'
import { pluginSass } from '@rsbuild/plugin-sass'
import * as sass from 'sass'
import os from 'os'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

// 物理网卡名称前缀（优先匹配）
const PHYSICAL_PREFIXES = ['en', 'eth', 'wlan']
// 需要排除的虚拟/隧道接口前缀（Clash TUN、VPN、Docker 等）
const VIRTUAL_PREFIXES = [
  'lo', // loopback
  'utun', // macOS TUN/VPN（含 Clash TUN 模式创建的虚拟网卡）
  'tun', // Linux TUN
  'tap', // TAP
  'ipsec', // IPSec VPN
  'ppp', // PPP
  'docker', // Docker
  'br-', // Bridge
  'veth', // veth pair
  'awdl', // Apple Wireless Direct Link
  'bridge',
  'ham',
  'anpi',
  'vbox', // VirtualBox
  'vmnet', // VMware
]

// get the host ipv4 address not the localhost address
// 直接枚举系统网卡，避免受 Clash TUN 等虚拟网卡影响
function getOutboundIPv4Address(): string {
  const interfaces = os.networkInterfaces()
  const candidates: { name: string; address: string }[] = []

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue
    if (VIRTUAL_PREFIXES.some((prefix) => name.startsWith(prefix))) continue

    for (const addr of addrs) {
      // 排除 IPv6、loopback、169.254.x.x 链路本地地址
      if (addr.family !== 'IPv4') continue
      if (addr.internal) continue
      if (addr.address.startsWith('169.254.')) continue
      candidates.push({ name, address: addr.address })
    }
  }

  // 优先选择物理网卡（en0/eth0/wlan0 等）
  const physical = candidates.find((c) =>
    PHYSICAL_PREFIXES.some((prefix) => c.name.startsWith(prefix)),
  )
  if (physical) return physical.address

  // 否则返回剩余候选中的第一个
  return candidates[0]?.address ?? '127.0.0.1'
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

const host = getOutboundIPv4Address()
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
