import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// css样式引入
import './assets/style/index.scss'

// 根据宽度自动设置rem基准值
import 'amfe-flexible'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
