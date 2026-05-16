import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { App } from './App'
import { Query } from './views/Query/index'
import { Booking } from './views/Booking/index'
import { OrderList } from './views/OrderList/index'
import { OrderDetail } from './views/OrderDetail/index'

root.render(<MemoryRouter>
  <Routes>
    <Route element={<App />}>
      <Route path='/' element={<Query />}></Route>
      <Route path='/query' element={<Query />}></Route>
      <Route path='/orderList' element={<OrderList />}></Route>
      <Route path='/orderDetail/:id' element={<OrderDetail />}></Route>
      <Route path='/booking' element={<Booking />}></Route>
    </Route>
  </Routes>
</MemoryRouter>)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
