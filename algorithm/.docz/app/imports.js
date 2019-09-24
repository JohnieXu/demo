export const imports = {
  'src/array.mdx': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "src-array" */ 'src/array.mdx'
    ),
  'src/utils.mdx': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "src-utils" */ 'src/utils.mdx'
    ),
}
