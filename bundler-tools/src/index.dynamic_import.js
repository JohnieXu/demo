function testDynamicImport() {
  setTimeout(() => {
    import('./log').then(({ warn }) => {
      warn('测试错误警告⚠️')
    })
  }, 5000)
}

testDynamicImport()
