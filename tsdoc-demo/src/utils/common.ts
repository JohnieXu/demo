/**
 * 打印日志
 * 
 * @example
 * ```ts
 * let name = 'foo'
 * let age = 24
 * log('Core', name, age) // 输出 [Core] foo 24
 * ```
 * 
 * @example
 * ```ts
 * let name = 'foo'
 * let age = 24
 * let person1 = {
 *  name,
 *  age,
 * }
 * log('Core', person1) // 输出 [Core] { name: 'foo', age: 24 }
 * ```
 * 
 * @param module - 模块名称
 * @param args - 待打印参数
 * 
 * @public
 */
export function log(module: string, ...args: any[]): void {
  console.log(`[${module}]`, ...args)
}

/**
 * 是否为 {@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise | Promise} 对象
 * 
 * @param a - 待校验的数据
 * @returns 判断结果
 * 
 * @example 非 Promise 对象
 * ```ts
 * isPromise({}) // false
 * isPromise(() => {}) // true
 * ```
 * 
 * @example 是 Promise 对象
 * ```ts
 * isPromise({ then: () => {} }) // true
 * isPromise(Promise.resolve('aaa')) // true
 * ```
 * 
 * @public
 */
export function isPromise (a: any): boolean {
  return typeof a === 'object' && a !== null && isFunction(a.then)
}

/**
 * 是否为函数
 * 
 * @param a - 待校验的数据
 * @returns 判断结果
 * 
 * @example
 * ```ts
 * isFunction(() => {} as any) // true
 * isFunction({} as any) // false
 * ```
 * 
 * @public
 */
export function isFunction (a: any): boolean {
  return ['[object Function]', '[object AsyncFunction]'].includes(Object.prototype.toString.call(a))
}
