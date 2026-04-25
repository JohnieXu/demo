// Responsive apps config - add app names here to enable viewport scaling
const RESPONSIVE_APPS = ['flight'] // Easy to extend: ['flight', 'furniture', ...]

import pxToViewportPlugin from 'postcss-px-to-viewport-8-plugin'

const includeRegex = RESPONSIVE_APPS.length > 0
  ? new RegExp(`\\/src\\/apps\\/(${RESPONSIVE_APPS.join('|')})\\/`)
  : undefined

export default {
  plugins: [
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
