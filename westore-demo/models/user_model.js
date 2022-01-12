class User {
  constructor(options = {}) {
    this.name = options.name || ''
    this.options = options
  }
  checkName(name) {
    if (!name || name.length < 2) {
      return Promise.reject(new Error("校验未通过"))
    }
    if (name === this.name) {
      return Promise.reject(new Error("用户名相同"))
    }
    return Promise.resolve()
  }
  updateName(name) {
    this.checkName(name).then(() => {
      this.name = name
      this.options.onNameChange && this.options.onNameChange(name)
    })
  }
}

module.exports = User
