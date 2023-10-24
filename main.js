import App from './App'
import store from '@/store';
import uView from '@/uni_modules/uview-ui'
import iosTransDate from '@/utils/common.js'

Vue.use(uView)
Vue.use(iosTransDate)

uni.$u.setConfig({
	config: {
		unit: 'rpx'
	},
	props:{
		search:{
			searchIconSize:44
		},
		input:{
			border:'none'
		},
		formItem:{
			borderBottom:true
		},
		datetimePicker:{
			itemHeight:88
		},
		grid:{
			col:4
		},
		modal:{
			title:'提示'
		}
	}
})
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);


// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
		store,
    app
  }
}
// #endif