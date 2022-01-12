class Log {
  constructor(options = {}) {
    this.logs = []
    this.logLength = 0
    this.subscribes = []
  }
  addLog(str) {
    if (str) {
      this.logs.push(str)
      this.computeLogLength()
      for (let i = 0; i < this.subscribes.length; i++) {
        const fn = this.subscribes[i]
        if (fn) {
          fn({ current: str, logs: this.logs })
        }
      }
    }
  }
  computeLogLength() {
    this.logLength = this.logs.length
  }
  subscribe(fn) {
    if (typeof fn === 'function') {
      this.subscribes.push(fn)
    }
  }
}

module.exports = Log
