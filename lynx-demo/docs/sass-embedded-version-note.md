# sass-embedded 版本约束说明

## 结论

**`sass-embedded` 必须固定在 `1.80.x`**，不要升级。

## 原因

- `sass-embedded@1.81+` 的 modern API 后端已切换为 **GraalVM**（Java VM）。
- 该 GraalVM 二进制要求宿主机 **macOS >= 14 (Sonoma)**。
- 当前开发机运行 macOS 13.x（Ventura），启动 sass-embedded 子进程时会持续报错：

  ```
  VM initialization failed: Current Mac OS X version 13.0 is lower than minimum supported version 14.0
  ```

- 反复重试失败 → sass-loader 抛错 → Rspack 构建失败 → 父进程 `process.exit()` → 子进程 stdin 管道关闭 → Node 主进程最后一次 protobuf 写入触发：

  ```
  Error: write EPIPE
    at AsyncCompiler.writeStdin (.../sass-embedded/dist/lib/src/compiler/async.js:71:28)
  ```

- 整体表现是 `pnpm dev` 跑起来几秒后整个进程崩溃，伴随 `ELIFECYCLE Command failed with exit code 1`。

## 升级 sass-embedded 之前请确认

1. 全员开发机已升级到 macOS 14+，或
2. 改用纯 JS 的 [`sass`](https://www.npmjs.com/package/sass) 包作为 implementation（`@rsbuild/plugin-sass` 默认会走 legacy API，无 native 进程）。

## 相关 issue

- sass/embedded-host-node#387 — https://github.com/sass/embedded-host-node/issues/387
- 配置位置：[lynx.config.ts](../../lynx.config.ts) `pluginSass`
