import Vue from 'vue'
import App from './App.vue'
import 'amfe-flexible' // 引入amfe-flexible用来根据屏幕宽度以及DPR动态设置html的font-size

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
