import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'

import { ListDemo } from './ListDemo'
import './ListDemo.scss'

root.render(<ListDemo />)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}