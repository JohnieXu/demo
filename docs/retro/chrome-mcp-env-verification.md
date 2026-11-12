# Chrome / 浏览器自动化 MCP 环境调研与验证记录

> 记录时间：2026-11-12
> 背景：为验证 OpenHands 中浏览器 MCP 的可用性，选定 `lit-demo` 项目作为验证目标，
> 完成 Chrome 安装、MCP 配置修复、有头/无头两种模式的验证。
>
> 🚨 **适用环境声明**：本文档描述的是 **xu 的 WSL 本机环境**（用户 `xu`，家目录
> `/home/xu`，含 `~/opt/chrome-extract`、`~/.config/cd4a`、`~/.openhands` 等本机绝对
> 路径）。**仅在当前这台 WSL 机器的 OpenHands 环境中适用**。其他机器、容器、
> Cloud sandbox、同事的开发环境中不存在这些路径与配置——其他环境下的 agent 读到
> 本文档时，请**忽略第 2–4、6 节的具体路径与配置**，不要尝试复用或按文安装，
> 仅将第 5 节结论中的 SDK bug 与 issue 链接作为跨环境有效信息参考。
>
> ⚠️ 本文档的用户级副本已沉淀为 OpenHands 用户 skill `wsl-browser-automation-env`
> （`~/.agents/skills/wsl-browser-automation-env/`，含 SKILL.md + REFERENCE.md），
> 在所有项目的会话中自动加载。**改动环境配置时两处同步更新**。

## 1. 验证目标项目

- **项目**：`lit-demo`（本仓库子目录）
- **选定理由**：Git 记录中最近更新的**非跨平台** Web 项目（最近更新 2026-10-27）；
  更新更近的项目均为 Lynx 跨端项目，不符合"非跨平台"要求。
- **技术栈**：Vite 6 + Lit 3 + TypeScript + Spectrum Web Components
- **启动方式**：
  ```bash
  cd lit-demo
  pnpm install --frozen-lockfile
  pnpm dev        # 实际以 pnpm dev --host 127.0.0.1 --port 5173 运行
  ```
- **访问地址**：`http://127.0.0.1:5173/`（WSL 内）；WSL2 localhost 转发使 Windows 宿主机
  可通过 `http://localhost:5173/` 访问。

## 2. 本机 Chrome 环境（无系统级安装）

本机（WSL）**没有**系统 Chrome，且 `/opt` 不可写、无免密 sudo，因此全部使用**用户态**方案：

| 组件 | 路径 | 说明 |
|---|---|---|
| Chrome 157 二进制 | `/home/xu/opt/chrome-extract/opt/google/chrome/chrome` | 从官方 deb 解包，约 453 MB |
| 依赖库 | `/home/xu/opt/chrome-libs/usr/lib/x86_64-linux-gnu` | NSS/ALSA 等，约 5.3 MB |
| 启动包装器 | `/home/xu/opt/chrome-bin/chrome` | 设置 `LD_LIBRARY_PATH` 后 exec 真实二进制 |
| MCP 全局配置 | `/home/xu/.config/cd4a/config.json` | chrome-devtools-mcp 自身的配置发现位置 |

配置内容：

```json
{
  "executablePath": "/home/xu/opt/chrome-bin/chrome",
  "headless": false,
  "isolated": true,
  "viewport": "1280x720"
}
```

> `headless` 字段可在有头/无头之间切换；改后需重启会话内 MCP 进程生效
> （kill 旧进程，SDK 会在下次工具调用时自动按新配置 respawn）。

回滚方式：删除 `~/opt/chrome-*`、`~/.config/cd4a`、`~/.config/google-chrome*`、
`~/.cache/chrome-devtools-mcp` 即可，未触碰任何系统目录。

## 3. 验证结果汇总

### 3.1 chrome-devtools-mcp（控制 WSL 内的 Chrome）

| 模式 | 验证方式 | 结果 |
|---|---|---|
| 无头 | 会话内 MCP 工具（navigate/snapshot/click/console/network/screenshot） | ✅ 全链路通过 |
| 有头 | `/api/mcp/test` 端点直接调用 `new_page` | ✅ 返回页面标题 `Vite + Lit + TS`，有头 Chrome 正常启动 |

有头模式的 GUI 通道：WSLg（`DISPLAY=:0` / `WAYLAND_DISPLAY=wayland-0`），
Chrome 窗口渲染在 Windows 桌面上。

### 3.2 browser_mcp（@browsermcp/mcp，控制 Windows 宿主机的 Chrome）

Windows Chrome 已安装 Browser MCP 扩展。验证通过 `/api/mcp/test` 端点调用：

```
goto http://localhost:5173/   → ✓
get title                     → "Vite + Lit + TS"   ✅
snapshot -i                   → 完整可访问性树        ✅
```

可访问性树包含 Spectrum accordion（expanded）、4 个 checkbox、多组 Option 标题，
与页面实际渲染一致。

### 3.3 两种方案对比

| | chrome-devtools-mcp | browser_mcp |
|---|---|---|
| 被控浏览器 | WSL 内 Chrome（包装器启动） | Windows 宿主机 Chrome（扩展桥接） |
| 浏览器来源 | 解包的 Chrome 157 | 用户日常浏览器（含登录态） |
| 适合场景 | 无头自动化、CI、调试 | 可视化验收、需要登录态 |
| 交互方式 | 每个工具独立（33 个工具） | 单一 `browser` 工具 + 命令行 DSL |

## 4. 已知问题与坑

### 4.1 OpenHands SDK 的 MCP 工具包装层 schema 冲突（未解决）

会话内直接调用 MCP 工具时，SDK 包装层会为底层 action 模型注入额外的参数
（如 `pageId`、`timeout`），导致校验失败：

```
Error validating tool 'chrome-devtools_new_page':
pageId — Extra inputs are not permitted
```

- 受影响工具：`chrome-devtools_new_page`、`chrome-devtools_list_pages`、
  `browser_mcp_browser` 等（凡 SDK 注入参数与底层模型不匹配的）。
- **绕过方法**：使用 Agent Server 的 `/api/mcp/test` 端点直接调用，
  它绕过包装层校验，可完整使用真实 MCP 协议：

  ```bash
  curl -X POST http://localhost:18000/api/mcp/test \
    -H "Content-Type: application/json" \
    -H "X-Session-API-Key: $OPENHANDS_AUTOMATION_API_KEY" \
    -d '{
      "name": "任意名称",
      "server": {"type":"stdio","command":"npx","args":["-y","<mcp-package>"],"transport":"stdio"},
      "timeout": 60,
      "tool_call": {"name":"<tool>","arguments":{...}}
    }'
  ```

- 注意：browser_mcp 只对外提供一个聚合工具 `browser`，参数为
  `commands`（多行命令字符串），不是按动作拆分的工具。

### 4.2 MCP 版本差异

- `chrome-devtools-mcp` 缓存两个版本：1.12.0 与 1.13.0，`npx -y` 每次可能拉起不同版本，
  工具 schema 可能有差异。
- `@browsermcp/mcp` 缓存版本 2.5.0。

### 4.3 其他

- `lynx-devtool`、`rea` 两个 MCP 配置指向 Windows 路径（`/mnt/d/...`、`D:\...`），
  在 WSL 中无法启动，如需使用要改成本地路径或禁用。
- `npx playwright --version` 会触发交互式安装确认，非交互环境下会挂起超时；
  本机未安装 Playwright。
- WSL Chrome 截图写入仓库/工作区路径会受 MCP workspace roots 限制，
  不指定 filePath 走内联返回即可。

## 5. 结论

- ✅ **lit-demo 可正常启动**（pnpm dev，端口 5173）。
- ✅ **chrome-devtools-mcp 可用**：无头模式全链路验证通过；有头模式经 `/api/mcp/test`
  验证 Chrome 可正常启动并读取页面。
- ✅ **browser_mcp 可用**：Windows Chrome 经扩展桥接，成功读取 lit-demo 页面标题与
  可访问性树。
- ⚠️ 会话内直接调用部分 MCP 工具受 SDK 包装层 schema 冲突影响，需经 `/api/mcp/test`
  端点绕过；该问题属 OpenHands SDK 侧，与 Chrome/MCP 服务器本身无关。
- 📮 该 SDK bug 已提交 OpenHands 官方 issue：
  <https://github.com/OpenHands/software-agent-sdk/issues/6793>（2026-11-13）

## 6. GitHub Token 迁移记录（2026-11-13）

为让 OpenHands WSL 环境直接具备 GitHub 认证能力（无需每次从 Windows 宿主机
gh CLI 凭据管理器提取），已将 Windows 宿主机 gh CLI 的 GitHub token 迁移进
OpenHands 用户级 secrets 存储：

- **存储位置**：`~/.openhands/secrets.json`（Fernet 加密，文件权限 600）
  - secret 名称：`GITHUB_TOKEN`
- **迁移方式**：读取 Windows `gh.exe auth token`（token 存于 Windows 凭据管理器，
  WSL 无法直接访问文件），通过 agent-server 官方 API
  `PUT /api/settings/secrets` 写入，写入后与源值做了逐字节比对确认一致。
- **使用方式**：OpenHands 会话中在命令里引用 `$GITHUB_TOKEN`，系统自动导出；
  新建会话生效（当前会话因启动时未快照到该 secret 需重启会话）。
- **注意事项**：
  - 该 token 与 Windows gh CLI 共享同一凭据；Windows 侧重新登录会使旧 token
    失效，届时需重新迁移。
  - token 为 classic PAT，不回显、不写入任何文档或仓库文件。
