const git = require('gite')

const testBlobHash = git.hashBlobObject('hello world')

console.log(testBlobHash)
