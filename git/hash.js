/**
 * blob对象
 * header="<type>" + content.length + "\0"
 * hash=sha1(header + content)
 * 
 * tree对象
 * header="<type>" + content.length + "\0"
 * tree <content length><NUL><file mode> <filename><NUL><item sha>...
 * 
 * commit对象
 * commit <content length><NUL>tree <tree sha>
 * parent <parent sha>
 * [parent <parent sha> if several parents from merges]
 * author <author name> <author e-mail> <timestamp> <timezone>
 * committer <author name> <author e-mail> <timestamp> <timezone>
 *
 * <commit message>
 */

const fs = require('fs')
const zlib = require('zlib')
const crypto = require('crypto')
const getTimezone = require('./util').getTimezone

const hashBlobObject = (content, { write } = {}) => {

  const type = 'blob'
  content = content || process.argv[2]

  const header = `${type} ${Buffer.from(content).length}\0`
  const store = Buffer.concat([Buffer.from(header), Buffer.from(content)])
  const sha1 = crypto.createHash('sha1')
  sha1.update(store)
  const hash = sha1.digest('hex')
  const zlib_store = zlib.deflateSync(store)

  if (!write) {
    return hash
  }

  const folder = `.git/objects/${hash.substring(0, 2)}`
  const file = `.git/objects/${hash.substring(0, 2)}/${hash.substring(2, 40)}`

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(`.git/objects/${hash.substring(0, 2)}`)
  }
  fs.writeFileSync(file, zlib_store)
  
  return hash
}

const hashTreeObject = () => {
  return ''
}

const hashCommitObject = (content, tree, parent = [], committer, message, { write } = {}) => {
  const header = `commit ${Buffer.from(content).length}\0tree ${tree}`
  const parentContent = Buffer.concat(parent.map(p => Buffer.from(`parent ${p}`)))
  const authorContent = `author ${author.name} ${author.email} ${Date.now()} ${getTimezone()}`
  const committerContent = `committer ${committer.name} ${committer.email} ${Date.now()} ${getTimezone()}`
  const store = Buffer.concat([
    Buffer.from(header),
    parentContent,
    Buffer.from(authorContent),
    Buffer.from(committerContent),
    Buffer.from('\n'),
    Buffer.from(message)
  ])

  const sha1 = crypto.createHash('sha1')
  sha1.update(store)
  const hash = sha1.digest('hex')

  return hash
}

module.exports = {
  hashBlobObject,
  hashTreeObject,
  hashCommitObject
}
