import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import echarts from 'echarts';
import XLSX from "xlsx";
import FileSaver from "file-saver";

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control




Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;//加载
Vue.prototype.XLSX = XLSX;
Vue.prototype.FileSaver = FileSaver;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
