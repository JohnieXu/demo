module.exports = function(babel) {
  return {
    visitor: {
      Program: {
        enter(path) {
          console.log('> enter program')
        },
        exit() {
          console.log('< exit program')
        }
      },
      Identifier: {
        enter(path) {
          console.log('============Identifier============')
          console.log(path.node.name)
          console.log('============Identifier End============')
        }
      },
      FunctionDeclaration(path) {
        console.log('============FunctionDeclaration============')
        console.log(path.scope)
        console.log('============FunctionDeclaration End============')
      }
    }
  }
}