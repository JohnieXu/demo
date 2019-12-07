import ('./app.css')
import (/* webpackChunkName: "module1" */'./module1')

// 测试模块动态加载 测试结果图: https://tva1.sinaimg.cn/large/006tNbRwgy1g9ooopbyuwj31ee0cktb6.jpg
setTimeout(() => {
  import(/* webpackChunkName: "module2" */'./module2')
}, 5000)

// 测试definedPlugin 测试结果图: https://tva1.sinaimg.cn/large/006tNbRwgy1g9opwefoxmj30gs02qjri.jpg
console.log('APP_VERSION: ', APP_VERSION)

const log = (string) => {
  console.log(`[log] ${string}`)
}
