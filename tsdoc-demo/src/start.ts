/**
 * 这个文件是用来在 Node.js 中执行，不属于源码，不需要使用 TSDoc 注释
 */

// import { Common } from './index'

// function start() {
//   Common.log('start', 'hello', 'world')
//   Common.log('start', {
//     hello: 'hello',
//     world: 'world',
//   })
// }

// start()

import { log } from './index'

function start() {
  log('start', 'hello', 'world')
  log('start', {
    hello: 'hello',
    world: 'world',
  })
}

start()
