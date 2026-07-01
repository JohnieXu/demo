// Responsive apps config - add app names here to enable viewport scaling
const RESPONSIVE_APPS = ['flight', 'ui-example'] // Easy to extend: ['flight', 'furniture', ...]

import pxToViewportPlugin from 'postcss-px-to-viewport-8-plugin'
import tailwindcss from 'tailwindcss'
import { join } from 'path'

const includeRegex = RESPONSIVE_APPS.length > 0
  ? new RegExp(`\\/src\\/apps\\/(${RESPONSIVE_APPS.join('|')})\\/`)
  : undefined

export default {
  plugins: [
    tailwindcss({
      config: join(process.cwd(), 'packages', 'lynx-ui', 'tailwind.config.ts'),
    }),
    pxToViewportPlugin({
      viewportWidth: 375,
      unitPrecision: 5,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      include: includeRegex,
    }),
  ],
}
