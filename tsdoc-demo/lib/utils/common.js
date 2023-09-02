"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
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
function log(module, ...args) {
    console.log(`[${module}]`, ...args);
}
exports.log = log;
