const parser = require('@babel/parser')
const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

const sourceCode = `
console.log(1);

function func() {
    console.info(2);
}
`

const ast = parser.parse(sourceCode)

traverse(ast, {
  CallExpression(path, state) {
    // console.log(path.get('callee').toString())
    const callee = path.node.callee
    const arguments = path.node.arguments
    const loc = path.node.loc
    const properties = ['log', 'info', 'error', 'warn']
    if (t.isMemberExpression(callee) && callee.object.name === 'console' && properties.includes(callee.property.name)) {
      arguments.unshift(t.stringLiteral(`loc: (${loc.start.line}, ${loc.start.column})`))
    }
  }
})

const { code, map } = generator(ast)
console.log(code)
console.log(map)
