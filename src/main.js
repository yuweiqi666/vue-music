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

// better-scroll 轮播图插件
import './plugins/betterscroll'

// vue-lazyload 图片懒加载
import './plugins/lazyload'

// 全局过滤器
import '@/filters/index'

// 挂载公共弹窗组件
import message from '@/utils/message'
Vue.prototype.$message = message

// 获取设备系统
const deviceMsg = window.navigator.userAgent
const deviceOs = getMobileOs(deviceMsg)
store.commit('device/GET_DEVICE_MSG', deviceOs)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
