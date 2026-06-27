# Lynx macOS Demo 集成方案

本 Demo 使用 Lynx 官方推荐的 **Platform View** 方案将 Lynx 渲染到原生 macOS 应用窗口中，对应官方文档：

- [Integrate with Existing Apps - Lynx](https://lynxjs.org/next/zh/guide/start/integrate-with-existing-apps.md)

## 环境要求

- macOS 12.0+
- Xcode Command Line Tools
- CMake 3.20+
- LynxSDK for macOS（手动下载并放到 `thirdparty/lynx`）

```bash
mkdir -p thirdparty
tar -xzf lynx-macos-sdk-*.tar.gz -C thirdparty/
mv thirdparty/lynx-* thirdparty/lynx
```

## 构建与运行

```bash
mkdir build && cd build
cmake ..
cmake --build .
open lynx-macos-demo.app
```

## 项目结构

```
lynx-macos-demo/
├── CMakeLists.txt                         # CMake 构建配置
├── README.md                              # 本文档
├── resources/
│   ├── Info.plist                         # Bundle 信息
│   └── flight.lynx.bundle                 # 本地待加载的 Lynx bundle
├── src/
│   ├── main.mm                            # 入口，设置 activation policy
│   ├── AppDelegate.h/.mm                  # 窗口、LynxEnv 初始化
│   ├── ViewController.h/.mm               # LynxView 创建与加载
│   └── ExampleGenericResourceFetcher.h/.mm # 资源加载实现
└── thirdparty/lynx/                       # LynxSDK（自行下载）
```

## 关键集成点

### 1. CMake 配置

文件：`CMakeLists.txt`

- 必须同时开启 C++17 与 Objective-C++17。
- **必须开启 ARC**：通过 `XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC YES` 和非 Xcode generator 下的 `-fobjc-arc`，否则 `__bridge_retained`  bridging 会编译失败。
- 链接 `libLynx.dylib`、`Cocoa`、`Foundation`。
- 使用 `MACOSX_BUNDLE` 生成 `.app`，并把 `Info.plist` 正确指定为 `MACOSX_BUNDLE_INFO_PLIST`。
- 通过 `add_custom_command(POST_BUILD)` 把 `thirdparty/lynx/bundles/`、`data/` 复制到 `Contents/Resources`，并把 `LynxResources.bundle` 和 `LynxDebugResources.bundle` 扁平化到 `Resources` 根目录，否则 SDK 初始化会报 `-[NSBundle initWithURL:]: nil URL argument`。
- 设置 rpath：`"-Wl,-rpath,@executable_path/../Frameworks"`。
- 将本地 `resources/flight.lynx.bundle` 通过 `MACOSX_PACKAGE_LOCATION Resources` 打包进 app。

### 2. Info.plist

文件：`resources/Info.plist`

`CFBundleExecutable` 和 `CFBundleName` 不能为空，且要与产物名一致，否则 `open lynx-macos-demo.app` 会提示无法打开。

```xml
<key>CFBundleExecutable</key>
<string>lynx-macos-demo</string>
<key>CFBundleName</key>
<string>lynx-macos-demo</string>
```

### 3. 入口与窗口激活

文件：`src/main.mm`

- 设置 `NSApplicationActivationPolicyRegular`，否则 dock 图标不会显示，窗口也无法正常激活。

文件：`src/AppDelegate.mm`

- 必须强引用 `NSWindow`，否则窗口会立即释放。
- 调用 `[NSApp activateIgnoringOtherApps:YES]` 确保窗口前置。
- 注册 `LynxHttpService`：即使当前只加载本地 bundle，也建议先注册一个占位实现，避免 Lynx 内部调用 `lynx.fetch` 时找不到服务而崩溃。
- 初始化 `LynxEnv` 并开启 devtool：

```cpp
auto& lynx_env = lynx::pub::LynxEnv::GetInstance();
lynx_env.SetDevtoolEnabled(true);
lynx_env.SetDevtoolAppInfo("App", "LynxExplorer");
lynx_env.SetDevtoolAppInfo("AppVersion", "1.0.0");
```

### 4. Platform View 接入 LynxView

文件：`src/ViewController.mm`

这是与官方文档一致的接入方式：把 Lynx 渲染到原生 `NSView` 中，而不是自己维护离屏纹理或 Software 渲染。

```objc
- (void)loadView {
    self.view = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 800, 600)];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    lynx::pub::LynxView::Builder builder;
    builder.SetScreenSize(self.view.frame.size.width, self.view.frame.size.height, 1.0)
        .SetFrame(0, 0, self.view.frame.size.width, self.view.frame.size.height)
        .SetParent((__bridge NativeWindow)self.view)
        .SetGenericResourceFetcher(std::make_shared<ExampleGenericResourceFetcher>());
    self.lynxView = builder.Build();

    [self loadTemplate];
}

- (void)viewDidLayout {
    [super viewDidLayout];
    self.lynxView->UpdateScreenMetrics(self.view.frame.size.width, self.view.frame.size.height, 1.0);
    self.lynxView->SetFrame(0, 0, self.view.frame.size.width, self.view.frame.size.height);
}

- (void)loadTemplate {
    auto meta_data = std::make_shared<lynx::pub::LynxLoadMeta>();
    NSURL *bundleURL = [[NSBundle mainBundle] URLForResource:@"flight" withExtension:@"lynx.bundle"];
    meta_data->SetUrl([[bundleURL absoluteString] UTF8String]);
    self.lynxView->LoadTemplate(meta_data);
}
```

要点：

- `loadView` 必须手动创建根 `NSView`。
- `SetParent` 接收 `NativeWindow`，即 `NSView` 指针；使用 `(__bridge NativeWindow)` 转换。
- 在 `viewDidLayout` 中同步更新 `ScreenMetrics` 和 `Frame`，否则窗口缩放后内容会消失或错位。
- 加载本地 bundle 时使用 `file://` 协议的绝对 URL。

### 5. 资源加载器

文件：`src/ExampleGenericResourceFetcher.mm`

实现了 `lynx::pub::LynxGenericResourceFetcher`。

- **本地 `file://` 请求必须同步读取**：Lynx 在主线程调用 `future::get()` 等待结果，如果在回调里再 `dispatch_async(dispatch_get_main_queue())`，会造成死锁。
- **网络请求使用 `NSURLSession` 异步完成**，在 completion handler 中调用 `response->Complete()`。
- 通过 `SetData` 把 `NSData` 的字节交给 Lynx，并用 `__bridge_retained` 将 NSData 的引用计数转移给 C++ 释放回调中的 `CFRelease`。

```cpp
response->SetData(
    (uint8_t *)data.bytes, data.length,
    [](uint8_t *body, size_t length, void *opaque) { CFRelease(opaque); },
    (__bridge_retained void *)data);
```

## 本地 bundle 切换

当前默认加载 `resources/flight.lynx.bundle`。如果要用 `lynx-demo/dist/flight.lynx.bundle`，把该文件复制/替换到 `lynx-macos-demo/resources/flight.lynx.bundle`，然后重新构建即可。

> 保留原 bundle URL 设置方式：`meta_data->SetUrl([[bundleURL absoluteString] UTF8String]);`，需要切换远程 bundle 时只需替换 URL 字符串。

## 常见问题

| 现象 | 原因/解决 |
|------|----------|
| 窗口不显示 / Dock 图标闪烁 | 检查 `Info.plist` 的 `CFBundleExecutable`/`CFBundleName`；确认 `main.mm` 设置了 `NSApplicationActivationPolicyRegular`；确认窗口被强引用并调用 `activateIgnoringOtherApps:YES`；杀掉残留的 `lldb` 进程。 |
| 编译错误 `__bridge_retained casts have no effect` | 没开启 ARC。在 CMake 中启用 `-fobjc-arc` / `XCODE_ATTRIBUTE_CLANG_ENABLE_OBJC_ARC`。 |
| 编译错误 `no member named 'SetCode'` | Lynx SDK 的 HTTP Response API 已更新为 `SetStatusCode` / `SetStatusText`。 |
| 编译错误 `no member named 'LynxResourceRequest' in namespace 'lynx::pub'` | 使用 `lynx::pub::resource::LynxResourceRequest`。 |
| 启动崩溃 `-[NSBundle initWithURL:]: nil URL argument` | `LynxResources.bundle` / `LynxDebugResources.bundle` 没有正确放到 `Contents/Resources` 根目录，检查 CMake post-build copy 命令。 |
| 窗口无响应 / 卡死 | 加载本地 `file://` 资源时不要用异步主线程回调，必须同步返回结果。 |
| 窗口空白，没有页面 | 确认 bundle URL 正确、资源 fetcher 返回了数据、Lynx SDK 资源包已复制。 |
| 点击/滚动无效 | 使用 Platform View 后 Lynx 内部会接管事件，无需手动转发 `lynx_pointer_event_t`。 |
| 缩放窗口内容消失 | 确保 `viewDidLayout` 中调用了 `UpdateScreenMetrics` 和 `SetFrame`。 |

## 参考

- [Lynx 官方文档 - 接入现有应用](https://lynxjs.org/next/zh/guide/start/integrate-with-existing-apps.md)
- [Lynx GitHub](https://github.com/lynx-family/lynx)
