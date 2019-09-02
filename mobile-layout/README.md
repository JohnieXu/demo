# mobile-layout

> 测试[postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)+[amfe-flexible](https://github.com/amfe/lib-flexible)处理移动端页面尺寸自适应

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

## Notes

### [postcss-px2torem](https://github.com/cuth/postcss-pxtorem)

postcss的plugins配置如下，这里的rootValue表示页面`37.5px===1rem===html的font-size`，这里37.5的设置参考[vant的rem适配](https://youzan.github.io/vant/#/zh-CN/quickstart#rem-gua-pei)

样式中的`以px为单位的样式`会被转换为以rem为单位的样式，可通过该插件配置可转换的样式名及转换精度等。

```json
"postcss-pxtorem": {
  "rootValue": 37.5
}
```

### [amfe-flexible](https://github.com/amfe/lib-flexible)

这个库主要做了下面这三件事

- 设置html的font-size为`document.documentElement.clientWidth/10`
- 设置body的font-size为`DPR*12`
- 判断是否支持1物理像素边框，支持则在html上加上类名`hairlines`

插件默认转换的CSS样式如下

```js
propList: ['font', 'font-size', 'line-height', 'letter-spacing']
```

可以通过propList参数配置需要转换的px单位的尺寸

```json
"postcss-pxtorem": {
  "rootValue": 37.5,
  "propList": ["width", "height"]
}
```

其全部的源码如下：

```js
(function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
```