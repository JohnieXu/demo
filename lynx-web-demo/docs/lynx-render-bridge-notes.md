# Lynx Core 渲染引擎与 Android 桥接学习笔记

> 记录 Lynx C++ 核心渲染引擎如何把解析后的 DOM 节点输出为 Android 原生 View。

## 一句话总结

Lynx Core C++ 解析 DOM 后,通过 **`TasmPlatformInvoker`(平台调用器)+ JNI + `LynxUIRenderer` + `LynxUI<T>` 泛型包装** 这条链路,把每一个 C++ 的 `Element` 节点对应到一个 Java `AndroidView` 子类实例(本质都是 Android `android.view.View`)。具体桥接核心 API 是 **`LynxUI`** 和 **`PaintingContext`**。

## 完整渲染流水线

```
Template(.ttemplate)
   ↓ binary_decoder
TemplateBundle
   ↓ TASM / Fiber pipeline (C++)
Element Tree (C++)
   ↓ FiberCreateView / __CreateView
Element (C++ DOM Node)
   ↓ JNI: TasmPlatformInvokerAndroid
LynxUIRenderer (Java)
   ↓ 根据 tag 查 BuiltInUIRegistry
LynxUI<T extends AndroidView>(Java)  ← ★ 桥接核心
   ↓ 内部持有
AndroidView (extends android.view.View)  ← ★ Android 原生 View
   ↓ addView() 到 LynxUIViewGroup(LynxView 的根 ViewGroup)
屏幕上看到 UI
```

## 关键 API 与文件对应

### 1. C++ 侧 —— 触发"创建 View"的入口

**`core/runtime/lepus/bindings/renderer_functions.cc:2712`** —— `FiberCreateView`

```cpp
RENDERER_FUNCTION_CC(FiberCreateView) {
  // 当 Lepus 脚本里调用 __CreateView("view") 时触发
  auto element = manager->CreateFiberView();  // 创建 C++ DOM 节点
  // 注:这里只是创建 C++ Element,真正的 Android View 是在 Java 侧触发
}
```

- 旧管线有 `__CreateView`,新管线有 `FiberCreateView`
- 它们只是创建 C++ 侧的 `FiberElement`,**不直接创建 Java View**

### 2. C++ ↔ Java JNI 桥

**`core/shell/android/tasm_platform_invoker_android.cc`** —— `TasmPlatformInvokerAndroid`

- C++ `ElementManager` 通过这个类调用 Java 侧的 `PaintingContext.createPlatformView()`
- 这是**唯一**的 C++→Java 创建 View 的入口

### 3. Java 侧 —— 真正的渲染协调

#### 3.1 `LynxUIRenderer`(渲染总控)

`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/LynxUIRenderer.java`

- 是 C++ 渲染结果的**对接容器**
- 创建/管理 `LynxUIOwner`

#### 3.2 `LynxUIOwner`(View 生命周期管理)

`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/LynxUIOwner.java`

- 接收 C++ 传来的"创建节点"指令
- **核心方法** `obtainView(sign, tag, ...)` —— 根据 tag 名查注册表,创建对应的 `LynxUI` 实例

#### 3.3 `PaintingContext`(绘制上下文,★ 桥接核心 API)

`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/PaintingContext.java`

- 负责把 C++ 传来的 `displayList` 和 props 翻译成 Java View 操作
- **关键方法** `createPlatformView(sign, tag, ...)` —— 真正调用 `LynxUIOwner.obtainView()`

### 4. Java 侧 —— View 类型系统(★ 核心 API)

#### 4.1 `LynxUI<T>`(泛型基类)—— 桥接核心

`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/ui/LynxUI.java`

```java
public abstract class LynxUI<T extends View> extends LynxBaseUI implements IProcessViewInfoHook {
  protected T mView;          // ★ 持有的 Android 原生 View
  public abstract T createView(Context context);
}
```

- **每个 LynxUI 子类负责生产一种 Android View**
- 通过泛型参数 `T` 把 Android 原生 View 包装起来

#### 4.2 具体的 UI 类

| LynxUI 子类 | 对应的 Android View | 文件路径 |
|---|---|---|
| `UIView` | `AndroidView` (FrameLayout) | `lynx_android/.../ui/view/UIView.java` |
| `UIText` | `AndroidText` | `lynx_android/.../ui/text/` |
| `UIImage` | 自绘 + 图片框架 | `lynx_android/.../ui/image/` |
| `UIScrollView` | `NestedScrollView` | `lynx_android/.../ui/scroll/` |
| `UIList` | `RecyclerView` 思想 | `lynx_android/.../ui/list/UIList.java` |
| `UISwiper` | `ViewPager` | `lynx_android/.../ui/swiper/` |
| `UIBody` | 容器 | `lynx_android/.../ui/UIBody.java` |

#### 4.3 `AndroidView`(Android 原生 View 适配层)

`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/ui/view/AndroidView.java`

```java
public class AndroidView extends FrameLayout {  // 直接继承 Android 原生 View
  // 负责绘制(transform、opacity、background 等)
}
```

#### 4.4 `BuiltInUIRegistry`(标签 → UI 类映射)

`platform/android/lynx_android/src/main/java/com/lynx/tasm/behavior/BuiltInUIRegistry.java`

```java
// 类似注册表:tag 名 "view" -> UIView.class
registerUIVector("view", UIView.class);
registerUIVector("text", UIText.class);
registerUIVector("image", UIImage.class);
// ...
```

## 一次"创建 View"的完整调用栈

### 第 1 步:C++ 模板触发

```cpp
// 模板里执行 __CreateView("view", props)
FiberCreateView(...)  → 创建 C++ Element
```

### 第 2 步:C++ 通过 TasmPlatformInvokerAndroid 调 JNI

### 第 3 步:Java: PaintingContext.createPlatformView

```java
PaintingContext.createPlatformView(sign, tag, props, ...) {
  LynxUI ui = LynxUIOwner.obtainView(sign, tag);  // ★ 从 tag 创建 LynxUI
}
```

### 第 4 步:LynxUIOwner.obtainView 根据 tag 查注册表

```java
LynxUI ui = BuiltInUIRegistry.createInstance(tag, context);
// 例如 tag="view" → 创建 UIView
```

### 第 5 步:UIView.createView() 创建 Android View

```java
public class UIView extends UISimpleView<AndroidView> {
  protected AndroidView createView(Context context) {
    return new AndroidView(context);  // ★ 实例化 Android 原生 View
  }
}
```

### 第 6 步:把 AndroidView 添加到根容器

```java
LynxView extends ViewGroup {  // 根容器
  void appendChild(LynxUI ui) {
    addView(ui.getView());  // AndroidView 加入到 ViewGroup
  }
}
```

## 关键设计点

### 1. 双层包装(Composition over Inheritance)

```java
LynxUI<T extends AndroidView>  // C++ 概念的"UI 节点"
  └─ mView: T                  // 实际 Android 原生 View
```

- `LynxUI` 处理 C++ 协议、属性、事件
- `AndroidView` 处理 Android 原生绘制、手势
- 通过组合而非继承,**保持 Lynx 跨平台能力**(iOS 只要换 UIView<UIView> 即可)

### 2. 平台无关的 C++ 渲染 + 平台特定的 Java/iOS 适配

```
C++ core/ (Element, Style, Layout) ← 跨平台共享
   ↓ 抽象接口
platform/android/ (LynxUI, AndroidView)  ← Android 实现
platform/ios/     (LynxUI, UIView)      ← iOS 实现
platform/harmony/ (ArkUI 适配)
```

### 3. 异步创建(性能优化)

`PaintingContext.java:345` 检查 `LynxEnv.inst().getCreateViewAsync()`:

- **同步模式**:解析到 `<view>` 立即创建 Android View
- **异步模式**:把 View 创建任务丢到线程池,避免阻塞渲染线程(类似 React 的 `concurrent mode`)

### 4. 事件反向回传

- Android View 上发生 `onTouch`、`onClick` → 通过 `GestureDetector` 翻译成 Lynx 的 `TouchEvent` → JNI 回到 C++ 的 `Element` → 触发 JS 事件回调
- 这条**反向链路**在 `UIView.java` 中处理

## 总结 —— 桥接核心 API 一览

| 层级 | 类/文件 | 职责 |
|---|---|---|
| **C++ 触发** | `FiberCreateView` (renderer_functions.cc) | Lepus 调用入口 |
| **C++→Java 桥** | `TasmPlatformInvokerAndroid` | JNI 调用 |
| **Java 协调** | `LynxUIRenderer` → `LynxUIOwner` → `PaintingContext` | 接收 C++ 指令 |
| **★ Java 桥接核心** | `LynxUI<T extends AndroidView>` | 一个 C++ Element 对应一个 LynxUI,内含一个 Android View |
| **★ Android 原生核心** | `AndroidView extends FrameLayout` | 真正的 Android View |
| **注册表** | `BuiltInUIRegistry` | tag 名 → UI 类 映射 |

### 最核心的两行代码

1. `LynxUI ui = BuiltInUIRegistry.createInstance(tag, context);` —— 把 C++ 的 tag 翻译成 Java 类
2. `addView(ui.getView());` —— 把 Android 原生 View 加入到屏幕

这就是 Lynx "**一份模板,多端渲染**" 的 Android 实现路径。

## 调试与追踪技巧

1. **追踪元素创建**:打开 `trace/lynx` 输出,过滤 `FIBER_CREATE_VIEW` 事件
2. **查看 View 层级**:Android Studio Layout Inspector 可以看到 `LynxView` 的真实子 View 树
3. **异步问题**:如果遇到"页面打开后 View 突然出现",检查 `enableCreateViewAsync` 配置
4. **性能优化**:`LynxTemplateRender.recreateLynxUIRenderer()` 会清空所有缓存 View,谨慎调用
