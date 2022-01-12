const { Store } = require('westore')
const UserApi = require('../apis/user')
const User = require('../models/user_model')
const Log = require('../models/log_model')

class UserStore extends Store {
  constructor(options = {}) {
    super()
    this.options = options
    this.data = {
      name: '',
      logLength: 0
    }
  }
  async init() {
    const { name } = await UserApi.getName()
    this.user = new User({
      name,
      async onNameChange(name) {
        await UserApi.saveName(name)
      }
    })
    this.log = new Log()
    this.log.subscribe(({ current }) => {
      console.log(current)
      this.data.logLength = this.log.logLength
      this.update()
    })
    this.changeName(this.user.name)
  }
  // async loadName() {
  //   const { name } = await UserApi.getName()
  //   this.changeName(name)
  // }
  // async saveName(name) {
  //   await UserApi.saveName(name)
  //   // this.user.changeName(name)
  //   this.user.updateName(name)
  // }
  handleSaveTap() {
    this.log.addLog('[bindtap] handleSaveTap')
    this.user.updateName(this.data.name)
  }
  handleInputChange(name) {
    this.log.addLog('[bindtap] handleInputChange ' + name)
    this.changeName(name)
  }
  changeName(name) {
    this.data.name = name
    this.update()
  }
}

module.exports = new UserStore()
