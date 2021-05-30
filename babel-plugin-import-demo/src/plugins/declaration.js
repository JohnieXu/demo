module.exports = function (babel) {
  return {
    visitor: {
      ImportDeclaration (path, state) {
        const { types } = babel
        const { node } = path
        node.specifiers.forEach(spec => {
          if (types.isImportSpecifier(spec)) {
            console.log('is import', spec.local.name, spec.imported.name, spec.type)
          } else {
            console.log('is not import', spec.local.name, spec.type)
          }
        })
      }
    }
  }
}
