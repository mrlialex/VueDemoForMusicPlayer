import 'babel-polyfill'
import 'common/stylus/index.styl'
import store from './store'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
/* eslint-disable no-new */

fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
