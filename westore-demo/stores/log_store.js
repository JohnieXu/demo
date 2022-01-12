const { Store } = require('westore')
const Log = require('../models/log_model')

class LogStore extends Store {
  constructor(options = {}) {
    super()
    this.data = {
      logs: [],
      logLength: 0
    }
  }
  init() {
    this.log = new Log()
    this.data.log = this.log.logs
    this.data.logLength = this.log.logLength
  }
  addLog(str) {
    this.log.addLog(str)
  }
}

module.exports = new LogStore()
