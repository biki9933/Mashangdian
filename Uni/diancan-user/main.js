import App from './App'
import Vue from 'vue'
import GoEasy from 'goeasy'
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
import uniPopupDialog from '@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.vue'

// css3动画样式
import './style/animat.css'

// 时间模块
// let moment = require('moment')
// moment.locale('zh-cn')
// Vue.prototype.$Time = moment

// 即时通讯：订单提醒
Vue.prototype.goeasy = GoEasy.getInstance({
    host:"hangzhou.goeasy.io",  //若是新加坡区域：singapore.goeasy.io
    appkey:"改为你自己的",
    modules:['pubsub']//根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});

Vue.component('uni-popup', uniPopup)
Vue.component('uni-popup-dialog', uniPopupDialog)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
