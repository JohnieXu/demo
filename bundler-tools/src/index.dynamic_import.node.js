function testDynamicImport() {
  setTimeout(() => {
    import('./log').then(({ warn }) => {
      warn('测试错误警告⚠️')
    })
    import('path').then(path => {
      warn(path.resolve(process.cwd()))
    })
  }, 5000)
}

testDynamicImport()
