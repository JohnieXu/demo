"use strict";
// import { Common } from './index'
Object.defineProperty(exports, "__esModule", { value: true });
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
