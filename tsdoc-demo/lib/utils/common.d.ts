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
 * log('Core', person1)
 * ```
 *
 * @param module - 模块名称
 * @param args - 待打印参数
 *
 * @public
 */
export declare function log(module: string, ...args: any[]): void;
