/**
 * 用户验证 dynamic-import 插件对各种组件导入写法的转换情况
 */

import { Button } from 'vant'
console.log(Button) // 1. 部分导入

import Vant from 'vant'
console.log(Vant.Dialog, Vant.Toast, Vant.Cell) // 2. 默认导入

import * as V from 'vant'
console.log(V.Dialog, V.Toast) // 3. 全部导入
