import '@lynx-js/preact-devtools'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from './routes'

root.render(<MemoryRouter>
  <AppRoutes />
</MemoryRouter>)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
