const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const types = require('@babel/types')
const t = require('@babel/template').default

const sourceCode = `console.log(1)
function log(msg) {
  console.log(msg)
}
`

const ast = parser.parse(sourceCode, { sourceType: 'unambiguous' })
traverse(ast, {
  CallExpression (path) {
    // console.log(path.node.callee)
    if (path.node.callee.object.name === 'console' && ['log', 'info', 'error', 'warn'].includes(path.node.callee.property.name)) {
      // console.log(generator(path.node).code)
      // path.node.arguments.unshift(t.ast(`"location: a, b"`))
      const { line, column } = path.node.loc.start
      path.node.arguments.unshift(types.stringLiteral(`location: ${line}, ${column}`))
    }
  }
})

const { code } = generator(ast, {})
console.log(code)
