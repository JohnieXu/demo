class UserApi {
  static getName() {
    console.log('[api] getName')
    return Promise.resolve({
      name: `JohnieXu-${Math.floor(Math.random() * 100)}`
    })
  }
  static saveName(name) {
    console.log('[api] saveName ' + name)
    return Promise.resolve({
      code: 0,
      msg: 'ok'
    })
  }
}

module.exports = UserApi
