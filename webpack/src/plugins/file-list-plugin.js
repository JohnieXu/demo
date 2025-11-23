class FileListPlugin {
  static defaultOptions = {
    fileName: 'assets.md'
  }
  constructor(options) {
    this.options = { ...FileListPlugin.defaultOptions, ...options}
  }
  apply(compiler) {
    const pluginName = FileListPlugin.name

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      const content = `# In this build: \n\n`+ Object.keys(compilation.assets).map((name) => `- ${name}`).join('\n')
      compilation.assets[this.options.fileName] = {
        source: function () {
          return content
        },
        size: function () {
          return content.length
        }
      }
      callback()
    })

    // in webpack 5
    // const { webpack } = compiler;
    // const { Compilation } = webpack;
    // const { RawSource } = webpack.sources;
    // compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
    //   compilation.hooks.processAssets.tap(
    //     {
    //       name: pluginName,
    //       stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
    //     },
    //     (assets) => {
    //       const content = `# In this build: \n\n`+ Object.keys(assets).map((name) => `- ${name}`).join('\n')
    //       compilation.emitAsset(
    //         this.options.fileName,
    //         new RawSource(content)
    //       )
    //     }
    //   )
    // })
  }
}

module.exports = { FileListPlugin };
