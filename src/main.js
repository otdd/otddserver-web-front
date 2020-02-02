// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api/index.js'
import base64 from './api/base64.js'
import util from './api/util.js'
import iView from 'iview'
import locale from 'iview/dist/locale/en-US'
import 'iview/dist/styles/iview.css'


Vue.config.productionTip = false
Vue.use(iView,{ locale })

Vue.prototype.$api = api
Vue.prototype.$base64 = base64
Vue.prototype.$util = util

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
