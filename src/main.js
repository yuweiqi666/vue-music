import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { getMobileOs } from '@/utils/tools'

// css样式引入
import './assets/style/index.scss'

// iconfont 字体图标
import './assets/iconfonts/index.js'

// 根据宽度自动设置rem基准值
import 'amfe-flexible'

// 获取设备系统
const deviceMsg = window.navigator.userAgent
console.log('device', deviceMsg)
const deviceOs = getMobileOs(deviceMsg)
store.commit('GET_DEVICE_MSG', deviceOs)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
