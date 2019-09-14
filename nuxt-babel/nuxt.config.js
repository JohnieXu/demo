export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~plugins/vconsole', '~plugins/vant'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    // fix: decorator unexpected token export  https://github.com/nuxt-community/nuxt-property-decorator/issues/36
    transpile: [new RegExp('.*@babel/runtime/helpers/esm/.*', 'ig')],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    babel: {
      presets({ isServer }) {
        /* eslint-disable no-unused-vars */
        const envName = isServer ? 'server' : 'client'
        const envTargets = {
          client: {
            browsers: [
              'last 2 versions, safari >= 7, ios_saf >= 7, chrome >= 52'
            ],
            safari: '7',
            chrome: '52',
            ie: '9'
          },
          server: { node: 'current' }
        }
        return [
          [
            '@nuxt/babel-preset-app',
            {
              targets: envTargets[envName]
            }
          ]
        ]
      }
    }
  },
  router: {
    // 在每页渲染前运行 middleware/user-agent.js 中间件的逻辑
    middleware: 'user-agent'
  }
}
