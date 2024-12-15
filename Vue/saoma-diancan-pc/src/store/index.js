import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('currentUser') || '{}'),
    // 商户信息
    currentMerchant: JSON.parse(localStorage.getItem('currentMerchant') || '{}'),
    // 菜单ID
    menuId: JSON.parse(localStorage.getItem('nuvmenuid') || '""')
  },
  
  mutations: {
    // 设置用户信息
    SET_USER_INFO(state, data) {
      state.token = data.token
      state.userInfo = data.userInfo
      localStorage.setItem('token', data.token)
      localStorage.setItem('currentUser', JSON.stringify(data.userInfo))
    },
    
    // 设置商户信息
    SET_MERCHANT(state, merchantInfo) {
      state.currentMerchant = merchantInfo
      localStorage.setItem('currentMerchant', JSON.stringify(merchantInfo))
    },
    
    // 设置菜单ID
    SET_MENU_ID(state, menuId) {
      state.menuId = menuId
      localStorage.setItem('nuvmenuid', JSON.stringify(menuId))
    },
    
    // 清除所有信息（登出时使用）
    CLEAR_ALL(state) {
      // 清除用户信息
      state.token = ''
      state.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
      
      // 清除商户信息
      state.currentMerchant = {}
      localStorage.removeItem('currentMerchant')
      
      // 清除菜单信息
      state.menuId = ''
      localStorage.removeItem('nuvmenuid')
    },
    
    // 仅清除商户信息
    CLEAR_MERCHANT(state) {
      state.currentMerchant = {}
      localStorage.removeItem('currentMerchant')
    }
  },
  
  getters: {
    isLoggedIn: state => {
      return !!state.token && !!state.currentMerchant.id
    },
    // 获取当前商户信息
    currentMerchant: state => {
      return state.currentMerchant
    },
    // 获取当前用户信息
    currentUser: state => {
      return state.userInfo
    }
  }
})