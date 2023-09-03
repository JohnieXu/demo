"use strict";
/**
 * 这个文件是用来在 Node.js 中执行，不属于源码，不需要使用 TSDoc 注释
 */
Object.defineProperty(exports, "__esModule", { value: true });
// import { Common } from './index'
// function start() {
//   Common.log('start', 'hello', 'world')
//   Common.log('start', {
//     hello: 'hello',
//     world: 'world',
//   })
// }
// start()
const index_1 = require("./index");
function start() {
    (0, index_1.log)('start', 'hello', 'world');
    (0, index_1.log)('start', {
        hello: 'hello',
        world: 'world',
    });
}
start();
