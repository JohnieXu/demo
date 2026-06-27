import { lazy, Suspense } from '@lynx-js/react'
import { Route, Routes } from 'react-router'

import { App } from './App'

// Sync imports are used as a workaround for a Lynx lazy-bundle CSS bug:
// global CSS imported in the main entry (App.css -> lynx-ui/styles/index.css)
// is lost inside React.lazy() async chunks. See:
// https://github.com/lynx-family/lynx-stack/issues/2897
import { Query } from './views/Query/index'
import { Booking } from './views/Booking/index'
import { OrderList } from './views/OrderList/index'
import { OrderDetail } from './views/OrderDetail/index'
import { TrainList } from './views/TrainList/index'
import { FlightList } from './views/FlightList/index'
import { CabinList } from './views/CabinList/index'

// Lazy versions are kept for future reference once the issue above is fixed.
const QueryLazy = lazy(() => import('./views/Query/index').then(m => ({ default: m.Query })))
const BookingLazy = lazy(() => import('./views/Booking/index').then(m => ({ default: m.Booking })))
const OrderListLazy = lazy(() => import('./views/OrderList/index').then(m => ({ default: m.OrderList })))
const OrderDetailLazy = lazy(() => import('./views/OrderDetail/index').then(m => ({ default: m.OrderDetail })))
const TrainListLazy = lazy(() => import('./views/TrainList/index').then(m => ({ default: m.TrainList })))
const FlightListLazy = lazy(() => import('./views/FlightList/index').then(m => ({ default: m.FlightList })))
const CabinListLazy = lazy(() => import('./views/CabinList/index').then(m => ({ default: m.CabinList })))

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path='/' element={<Query />}></Route>
        <Route path='/query' element={<Query />}></Route>
        <Route path='/orderList' element={<OrderList />}></Route>
        <Route path='/orderDetail/:id' element={<OrderDetail />}></Route>
        <Route path='/booking' element={<Booking />}></Route>
        <Route path='/trainList' element={<TrainList />}></Route>
        <Route path='/flightList' element={<FlightList />}></Route>
        <Route path='/cabinList' element={<CabinList />}></Route>
      </Route>
    </Routes>
  )
}

export {
  QueryLazy,
  BookingLazy,
  OrderListLazy,
  OrderDetailLazy,
  TrainListLazy,
  FlightListLazy,
  CabinListLazy,
}

// Kept for compatibility in case other files still expect `LazyLoad`.
export function LazyLoad({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<view />}>{children}</Suspense>
}
