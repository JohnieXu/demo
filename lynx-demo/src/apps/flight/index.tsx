import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'
import { lazy, Suspense } from '@lynx-js/react'
import { MemoryRouter, Route, Routes } from 'react-router'

import { App } from './App'

const Query = lazy(() => import('./views/Query/index').then(m => ({ default: m.Query })))
const Booking = lazy(() => import('./views/Booking/index').then(m => ({ default: m.Booking })))
const OrderList = lazy(() => import('./views/OrderList/index').then(m => ({ default: m.OrderList })))
const OrderDetail = lazy(() => import('./views/OrderDetail/index').then(m => ({ default: m.OrderDetail })))
const TrainList = lazy(() => import('./views/TrainList/index').then(m => ({ default: m.TrainList })))
const FlightList = lazy(() => import('./views/FlightList/index').then(m => ({ default: m.FlightList })))

// eslint-disable-next-line react-refresh/only-export-components
function LazyLoad({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<view />}>{children}</Suspense>
}

root.render(<MemoryRouter>
  <Routes>
    <Route element={<App />}>
      <Route path='/' element={<LazyLoad><Query /></LazyLoad>}></Route>
      <Route path='/query' element={<LazyLoad><Query /></LazyLoad>}></Route>
      <Route path='/orderList' element={<LazyLoad><OrderList /></LazyLoad>}></Route>
      <Route path='/orderDetail/:id' element={<LazyLoad><OrderDetail /></LazyLoad>}></Route>
      <Route path='/booking' element={<LazyLoad><Booking /></LazyLoad>}></Route>
      <Route path='/trainList' element={<LazyLoad><TrainList /></LazyLoad>}></Route>
      <Route path='/flightList' element={<LazyLoad><FlightList /></LazyLoad>}></Route>
    </Route>
  </Routes>
</MemoryRouter>)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
