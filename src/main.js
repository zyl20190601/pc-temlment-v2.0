import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bus from '@/utils/event-bus.js'
import mixin from '@/mixins'

import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import moment from 'moment'; //导入模块
moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment;//赋值使用

// 重置样式
import '@/assets/scss/reset.scss'

Vue.config.productionTip = false

// 挂载eventBus
Vue.prototype.$bus = Bus

// 挂载全局组件
Vue.use(elementUI)

// 挂载全局mixin
Vue.mixin(mixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
