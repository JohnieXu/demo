# C++ 关键知识点(前端工程师视角)

> 面向熟悉 JavaScript/TypeScript 的前端工程师,聚焦阅读 Lynx 源码时常见的 C++ 语法点。

## 1. 编译型语言 vs 解释型

| 特性 | C++ | JS/TS |
|---|---|---|
| 执行方式 | 编译成机器码(`.so`/`.exe`) | 运行时解释/JIT |
| 类型检查 | 编译期静态检查 | 运行时 + TS 编译期 |
| 入口 | `main()` 函数 | 脚本即入口 |
| 模块化 | `.h` + `.cc`/`.cpp` | `.ts`/`.js` + ES Module |

Lynx 中的体现:每个 `.cc` 文件就是一个编译单元,被 NDK 编译器翻译成 ARM/x86 指令,最终打包进 `lib/<abi>/lynx.so`。

## 2. 头文件(.h)与源文件(.cc)分离

```cpp
// style_resolver.h - 声明
class StyleResolver {
 public:
  void ResolveStyle(StyleMap& result, CSSFragment* fragment);
 private:
  Element* element_;
};

// style_resolver.cc - 实现
#include "style_resolver.h"
void StyleResolver::ResolveStyle(StyleMap& result, CSSFragment* fragment) {
  // ...
}
```

**Lynx 中的范例**:
- `core/renderer/dom/style_resolver.h` — 接口
- `core/renderer/dom/style_resolver.cc` — 实现

**为什么这样分?** 编译时只需要看 `.h` 就知道接口,大幅减少编译时间。

## 3. `#include` vs `import`

```cpp
#include "core/renderer/dom/element.h"   // 拷贝头文件内容(预处理)
#include <vector>                         // 系统头文件(用 <>)
```

对比 JS:

```ts
import { Element } from './element'      // ES Module 真正的模块化
```

## 4. 命名空间 namespace

```cpp
namespace lynx {        // 类似模块作用域
namespace tasm {        // 嵌套
class StyleResolver { ... };
}  // namespace tasm
}  // namespace lynx

// 使用
using namespace lynx::tasm;
lynx::tasm::StyleResolver resolver;
```

对比 TS:

```ts
namespace lynx {  // TS 也支持
  export namespace tasm {
    class StyleResolver {}
  }
}
```

Lynx 中所有核心代码都在 `lynx::tasm`、`lynx::css`、`lynx::base` 等命名空间下,避免命名冲突。

## 5. 指针(*)与引用(&)

```cpp
Element* element;           // 指针:可以为 null,需要解引用 *element
element->Method();          // 指针访问成员用 ->
(*element).Method();        // 等价写法

Element& element_ref = *ptr; // 引用:是别名,不能为 null
element_ref.Method();        // 引用访问成员用 .
element_ref.attr = 1;        // 直接修改原对象
```

**Lynx 中的对比**(style_resolver.cc:551):

```cpp
void StyleResolver::ResolveStyle(StyleMap& result, CSSFragment* fragment, ...)
```

- `StyleMap& result` —— 输出参数(引用,函数内修改会反映到调用方)
- `CSSFragment* fragment` —— 输入指针(可以为 null)

对比 JS:对象都是引用传递,概念统一。但 C++ 中**有指针 vs 引用的明确区分**,指针更危险(可空、可重指向)。

## 6. 栈 vs 堆

```cpp
int x = 5;                  // 栈:自动分配/释放,速度快
Element el;                 // 栈对象
Element* p = new Element(); // 堆:手动 new/delete,需自己释放
auto p = std::make_unique<Element>();  // 堆:智能指针自动释放(推荐)
```

对比 JS:JS 中所有对象都在堆上,GC 自动管理。C++ 中栈对象离开作用域自动析构。

## 7. const 关键字(非常重要)

```cpp
const int kMaxSize = 100;             // 常量,不可修改
const Element* ptr;                    // 指向常量的指针(不能通过 ptr 修改元素)
Element* const ptr2;                   // 常量指针(指针本身不能改指向)
void Foo(const std::string& s);        // 参数不可修改(常引用,避免拷贝)
bool HasPropertyDiff(const style&, ...) const;  // 常成员函数:不修改成员变量
```

**Lynx 范例**(style_resolver.cc:2779):

```cpp
bool StyleResolver::HasPropertyDiff(const starlight::ComputedCSSStyle& style,
                                    CSSPropertyID id) const {
```

- `const style&` —— 不复制参数,函数内不修改
- `const` 成员函数 —— 承诺不修改 `this` 的成员

对比 TS:

```ts
function HasPropertyDiff(style: ComputedCSSStyle, id: number): boolean  // 没强制
```

## 8. 智能指针(替代裸指针)

```cpp
std::unique_ptr<Element> ptr = std::make_unique<Element>();
// 独占所有权,离开作用域自动 delete

std::shared_ptr<Element> ptr = std::make_shared<Element>();
// 共享所有权,引用计数为 0 时自动 delete

std::weak_ptr<Element> weak = ptr;  // 不增加引用计数,防止循环引用
```

**Lynx 中大量使用**(style_resolver.cc:1528):

```cpp
std::unique_ptr<starlight::ComputedCSSStyle> StyleResolver::ResolveBaseStyle(...)
```

对比 JS:JS 用 GC 自动管理,前端无需关心释放。C++ 中必须**显式所有权**(用 `unique_ptr` 或 `shared_ptr`)。

## 9. 类与继承

```cpp
class Element {                       // 基类
 public:
  virtual ~Element() = default;        // 虚析构(关键!)
  virtual void Render() { /* ... */ }  // 虚函数:子类可重写
};

class FiberElement : public Element {  // 继承
 public:
  void Render() override { /* ... */ } // override 显式标记重写
};
```

关键点:

- `virtual` —— 允许子类重写,实现多态
- `= default` —— 让编译器生成默认实现
- `override` —— 编译期检查是否真的重写了基类函数
- `virtual ~Element()` —— **基类析构必须为虚**,否则 `delete` 子类时只调用基类析构,内存泄漏

对比 JS/TS:

```ts
class Element { render() {} }       // 默认所有方法都是 virtual
class FiberElement extends Element { render() {} }
```

JS 中**所有方法默认就是虚的**,C++ 中必须显式声明 `virtual`。

## 10. 模板(Template)

```cpp
template <typename T>
T Max(T a, T b) { return a > b ? a : b; }

// 使用
Max(3, 5);       // 编译器生成 Max<int>
Max(3.0, 5.0);   // 编译器生成 Max<double>
```

**类似 TypeScript 的泛型,但在编译期实例化**,会产生多份代码。

**Lynx 中的范例**(style_resolver.cc:231):

```cpp
thread_local StyleResolver::MatchedVector<const StyleMap*>
    g_matched_style_maps{};
```

对比 TS:

```ts
class StyleResolver {
  static g_matched_style_maps: MatchedVector<StyleMap>;
}
```

## 11. STL 容器

```cpp
std::vector<int> v = {1, 2, 3};     // 动态数组,类似 JS Array
v.push_back(4);
v.size();

std::unordered_map<std::string, int> m;  // 哈希表
m["key"] = 1;
m.count("key");                     // 检查存在性

std::array<int, 5> a = {1,2,3,4,5};      // 固定大小数组
std::optional<int> opt = GetValue();      // C++17,可能为空的包装
```

对比 JS:

```ts
const v = [1, 2, 3];
v.push(4);
const m = new Map<string, number>();
m.set('key', 1);
m.has('key');
```

## 12. auto 与类型推导

```cpp
auto x = 5;                     // int
auto s = std::string("hello");  // std::string
auto& ref = vec[0];             // 引用
auto ptr = std::make_unique<Element>();  // std::unique_ptr<Element>
```

对比 TS:`const x = 5` // 自动推导为 number

Lynx 中常用,简化复杂类型书写。

## 13. RAII(资源获取即初始化)

C++ 最核心的设计哲学:

```cpp
{
  std::lock_guard<std::mutex> lock(mtx);  // 构造时加锁
  // 临界区代码
  // 函数结束时 lock 析构,自动解锁
}  // 即使抛异常也能正确解锁
```

对比 JS:JS 用 try/finally 或 Promise 处理资源清理,C++ 用 RAII **通过对象的生命周期**自动管理。

Lynx 中大量使用:锁、文件句柄、智能指针都是 RAII。

## 14. Lambda 表达式

```cpp
auto add = [](int a, int b) { return a + b; };
add(3, 5);

// 捕获外部变量
int x = 10;
auto add_x = [x](int y) { return x + y; };        // 值捕获
auto add_x_ref = [&x](int y) { return x + y; };   // 引用捕获(可修改外部)
```

对比 JS:语法几乎一样,但 C++ 中**默认值捕获**(要 `[x]` 显式写)。

## 15. 移动语义(C++11+)

```cpp
std::string s1 = "hello";
std::string s2 = std::move(s1);  // s1 的资源转移到 s2,s1 变为空
```

- `std::move` 不移动任何东西,只是把左值转为右值引用,允许"窃取"资源
- 避免不必要的拷贝,大幅提升性能

对比 JS:JS 没有这个概念,所有"赋值"都是引用共享。

## 16. 前向声明(Forward Declaration)

```cpp
class Element;        // 只声明,不包含完整定义

class StyleResolver {
  Element* element_;  // 指针可以用前向声明
  // Element el_;     // 值成员需要完整定义
};
```

作用:**减少 include**,加速编译。

## 17. 构造函数与初始化列表

```cpp
class StyleResolver {
 public:
  StyleResolver(Element* element) : element_(element) {}  // 初始化列表
 private:
  Element* element_;
};
```

对比 TS:

```ts
class StyleResolver {
  constructor(private element: Element) {}
}
```

## 18. enum class(强类型枚举)

```cpp
enum class CSSPropertyID {
  FontSize,
  Color,
  Display,
};

CSSPropertyID id = CSSPropertyID::FontSize;
```

对比 TS:`enum CSSPropertyID { FontSize, Color }`(JS 也有 enum 提案)

## 19. explicit 与隐式转换

```cpp
class Foo {
 public:
  explicit Foo(int x) {}   // 禁止 Foo f = 5; 隐式转换
};

Foo f(5);        // OK 直接构造
Foo f = 5;       // 编译错误!explicit 阻止
```

对比 TS:TS 没有这个概念,类型转换需要 `as` 显式写。

## 20. 运算符重载

```cpp
bool operator==(const CSSValue& lhs, const CSSValue& rhs) {
  return lhs.value_ == rhs.value_;
}
```

让自定义类型支持 `==`、`+`、`<<` 等运算符。Lynx 中 CSSValue 等类经常使用。

## 21. 静态成员与单例

```cpp
class StyleResolver {
 public:
  static StyleResolver* GetInstance() {  // 静态方法
    static StyleResolver instance;        // 局部静态 = 线程安全单例(C++11)
    return &instance;
  }
};
```

## 22. 多线程相关

```cpp
std::mutex mtx;
std::lock_guard<std::mutex> lock(mtx);     // RAII 加锁
std::atomic<int> counter{0};                // 原子操作
thread_local int x = 0;                     // 线程局部变量
```

Lynx 是**双线程/多线程**架构(主线程 + 渲染线程),thread_local 在 style_resolver.cc:231 用作线程级缓存。

## 23. 编译期 vs 运行期

C++ 大量逻辑在**编译期**完成:

- 模板实例化 → 编译期生成代码
- `constexpr` → 编译期常量
- `static_assert` → 编译期断言

这与 JS 形成鲜明对比:**JS 的"泛型"是运行时的,C++ 的模板是编译期的**。

## 24. 构建系统(GN)

Lynx 用 **GN(Generate Ninja)** 描述构建:

```python
# core/renderer/dom/BUILD.gn
source_set("dom") {
  sources = [
    "style_resolver.cc",
    "element.cc",
    ...
  ]
  deps = [ "//base", "//core/renderer/css" ]
}
```

- `source_set` —— 一组源文件,可被其他 target 引用
- `deps` —— 依赖关系
- `//` 开头表示仓库根路径

对比前端:`package.json` 的 `dependencies`。

## 速查对照表

| C++ | JS/TS 等价 |
|---|---|
| `.h` + `.cc` | `.ts` 模块 |
| `class Foo : public Bar` | `class Foo extends Bar` |
| `virtual void f()` | 普通方法 |
| `std::vector<T>` | `T[]` |
| `std::unique_ptr<T>` | 不需要(GC) |
| `const T&` 参数 | 普通参数(JS 都是引用) |
| `nullptr` | `null` / `undefined` |
| `auto` | `const x = ...` |
| `template<T>` | `generic T` |
| `namespace` | `namespace` |
| `static_cast<T>(x)` | `x as T` |
| `std::move(x)` | 无 |
| `thread_local` | 无 |
| `#include` | `import` |
| `GN/CMake` | `pnpm/npm` |

## 推荐阅读路径

如果想深入,按这个顺序看 Lynx 源码:

1. `core/base/include/vector.h` — 简单数据结构
2. `core/renderer/dom/element.h` — 基础类
3. `core/renderer/dom/style_resolver.h` — 较复杂的类
4. `core/runtime/js/jsi/jsi.h` — JS↔C++ 桥接

边读边用 [Compiler Explorer](https://godbolt.org/) 在线查看 C++ 编译结果,会大幅加速理解。
