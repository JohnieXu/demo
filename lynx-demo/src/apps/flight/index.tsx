import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { App, Query } from './views/query'
import { Booking } from './views/booking'
import { OrderList } from './views/orderList'
import { OrderDetail } from './views/orderDetail'

root.render(<MemoryRouter>
  <Routes>
    <Route path='/' element={<App />}></Route>
    <Route path='/query' element={<Query />}></Route>
    <Route path='/order' element={<OrderList />}></Route>
    <Route path='/order/:id' element={<OrderDetail />}></Route>
    <Route path='/booking' element={<Booking />}></Route>
  </Routes>
</MemoryRouter>)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
