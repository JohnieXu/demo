import { Route, Routes } from 'react-router'
import { App } from './App'
import { Home } from './views/Home'
import { DemoPage } from './components/DemoPage'
import { DEMOS } from './registry'

// Views are imported synchronously (not via React.lazy) on purpose: Lynx
// lazy-bundle async chunks drop global CSS imported in the main entry.
// See src/apps/flight/routes.tsx and lynx-family/lynx-stack#2897.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Home />} />
        {DEMOS.map((demo) => (
          <Route
            key={demo.key}
            path={`/component/${demo.key}`}
            element={
              <DemoPage title={demo.title}>
                <demo.Component />
              </DemoPage>
            }
          />
        ))}
      </Route>
    </Routes>
  )
}
