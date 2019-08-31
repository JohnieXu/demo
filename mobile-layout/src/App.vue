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
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {}
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
}
</style>
