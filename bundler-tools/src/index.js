import path from 'path'
import { warn } from './log'

warn('测试错误警告⚠️')
warn(path.resolve(process.cwd()))
