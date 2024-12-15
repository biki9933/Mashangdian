import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import qs from "qs"

//全局引入css文件
import '../style/reset.css'
import '../style/headtap.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Input,Button,Menu,MenuItem,Submenu,Loading,Select,Option,Pagination,
DatePicker,Image,Breadcrumb,BreadcrumbItem,Message,MessageBox,Upload,Dialog,Tag,
Badge,  Dropdown,
  DropdownMenu,
  DropdownItem
 } from 'element-ui';

Vue.use(ElementUI)
Vue.use(Button)
Vue.use(Input)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Loading)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(Image)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Badge)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.component(Message.name, Message)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

// 请求地址
import { Urls } from './api/api.js'
Vue.prototype.Urls = Urls

// 请求方法
import request from './api/request'
Vue.prototype.Request = request

// qs转换
Vue.prototype.$qs = qs

// 全局对象提示框
import Titles from '../config/title.js'
Vue.prototype.mytitle = Titles

// 即时通讯：订单提醒
Vue.prototype.goeasy = GoEasy.getInstance({
    host:"hangzhou.goeasy.io",
    appkey:"改为你自己的",
    modules:['pubsub']
})

// 页面刷新时恢复状态
if (localStorage.getItem('token')) {
  store.commit('SET_TOKEN', localStorage.getItem('token'))
  if (localStorage.getItem('currentUser')) {
    store.commit('SET_MERCHANT', JSON.parse(localStorage.getItem('currentUser')))
  }
}

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  if (error.name === 'NavigationDuplicated') {
    const { pathname, search, hash } = window.location
    router.push(pathname + search + hash)
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')