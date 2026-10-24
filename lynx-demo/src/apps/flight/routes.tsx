import { Suspense } from '@lynx-js/react'
import { Route, Routes } from 'react-router'

import { App } from './App'

// Sync imports are used as a workaround for a Lynx lazy-bundle CSS bug:
// global CSS imported in the main entry (App.css -> lynx-ui/styles/index.css)
// is lost inside React.lazy() async chunks. See:
// https://github.com/lynx-family/lynx-stack/issues/2897
//
// Keep these imports synchronous: a `React.lazy(() => import(...))` call
// produces an async chunk even when the component is never rendered, and
// the web environment cannot encode async chunks. See
// ../../../docs/retro/web-target-async-template-encode-crash.md
import { Query } from './views/Query/index'
import { Booking } from './views/Booking/index'
import { OrderList } from './views/OrderList/index'
import { OrderDetail } from './views/OrderDetail/index'
import { TrainList } from './views/TrainList/index'
import { FlightList } from './views/FlightList/index'
import { CabinList } from './views/CabinList/index'

// travel-auth is mounted in-app (no lazy) so login lives in the same
// ReactLynx instance and shares the auth store. See AuthRoutes doc.
import { AuthRoutes } from '../travel-auth/public'

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
        {AuthRoutes()}
      </Route>
    </Routes>
  )
}

// Kept for compatibility in case other files still expect `LazyLoad`.
export function LazyLoad({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<view />}>{children}</Suspense>
}
