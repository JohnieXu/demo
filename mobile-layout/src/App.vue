<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="container1">
      <h3>测试postcss-pxtorem</h3>
      <h4>test1：20px ==> 0.53333rem</h4>
      <div class="test test1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, veritatis.</div>
      <h4>test2：37.5px ==> 1rem</h4>
      <div class="test test2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, nulla!</div>
      <h4>test3：未设置字体大小 为body的font-size amfe-flexible设置其为12*DPR ==> 24px</h4>
      <div class="test test3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, minima.</div>
      <h4>test4：测试转换内联样式</h4>
      <div class="test4" style="overflow-y: scroll;">
        <div>转换前</div>
        <pre class="test" :style="style1">{{JSON.stringify(style1, null, 2)}}</pre>
        <div>转换后</div>
        <pre class="test">{{JSON.stringify(style1Converted, null, 2)}}</pre>
      </div>
      <h4>test5：测试转换外部样式</h4>
      <i>默认转换的CSS样式如下，可以通过propList参数进配置</i>
      <blockquote>propList: ['font', 'font-size', 'line-height', 'letter-spacing']</blockquote>
      <div class="test5">
        <div>转换前</div>
        <pre class="test style2" style="overflow-y: scroll;">{{JSON.stringify(style2, null, 2)}}
        </pre>
        <div>转换后</div>
        <pre class="test style2" style="overflow-y: scroll;">{{JSON.stringify(style2Transformed, null, 2)}}
        </pre>
        <div>最终CSS</div>
        <pre class="test" style="overflow-y: scroll;">{{JSON.stringify(style2Converted, null, 2)}}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {},
  data: () => ({
    style1: {
      width: '375px',
      marginTop: '20px',
      fontSize: '20px'
    },
    style1Converted: {
      width: '375px',
      marginTop: '20px',
      fontSize: '20px'
    },
    style2: {
      width: '375px',
      marginTop: '20px',
      fontSize: '20px',
      lineHeight: '24px',
      letterSpacing: '1px'
    },
    style2Converted: {},
    style2Transformed: {
      width: '375px',
      marginTop: '20px',
      fontSize: '0.53333rem',
      lineHeight: '0.64rem',
      letterSpacing: '0.02667rem'
    }
  }),
  mounted () {
    const _style2Converted = window.getComputedStyle(document.querySelector('.test5 .style2'))
    // const _style2Converted = document.querySelector('.test5 .style2').style
    const style2Converted = {}
    Object.keys(_style2Converted).forEach(key => {
      this.style2[key] && (style2Converted[key] = _style2Converted[key])
    })
    this.style2Converted = style2Converted
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h4 {
  margin-bottom: 0;
}
.container1 {
  text-align: left;
  .test {
    background: #f6f6f6;
  }
  .test1 {
    // rootValue => 37.5 20px => 20/37.5 => 0.53333rem
    font-size: 20px;
  }
  .test2 {
    // rootValue => 37.5 37.5px => 1rootValue => 1rem
    font-size: 37.5px;
  }
  .test3 {
    // 不引入amfe-flexible时候 html的font-size = 16px => 1rem = 16px(在引入了amfe-flexible之后html的font-size为动态并非默认的16px)
  }
  .test5 {
    .style2 {
      width: 375px;
      margin-top: 20px;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 1px;
    }
  }
}
</style>
