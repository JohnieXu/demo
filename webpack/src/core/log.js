export class Logger {
  constructor(module, level) {
    this.module = module || "main"
    this.level = level || 1
  }
  log(...args) {
    console.log(`[${this.module}] `, ...args)
  }
}

export const logger = new Logger()
