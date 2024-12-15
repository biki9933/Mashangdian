import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '@/page/login/login'),
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            name: 'index',
            component: () => import(/* webpackChunkName: "layout" */ '@/page/index'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'analysis',
                    component: () => import(/* webpackChunkName: "analysis" */ '@/page/analysis/analysis'),
                    meta: { title: '数据分析' }
                },
                {
                    path: 'order',
                    name: 'order',
                    component: () => import(/* webpackChunkName: "order" */ '@/page/order/order'),
                    meta: { title: '订单管理' }
                },
                {
                    path: 'dishes',
                    name: 'dishes',
                    component: () => import(/* webpackChunkName: "dishes" */ '@/page/dish-management/dishes-list'),
                    meta: { title: '菜品管理' }
                },
                {
                    path: 'category',
                    name: 'category',
                    component: () => import(/* webpackChunkName: "category" */ '@/page/category/category'),
                    meta: { title: '分类管理' }
                },
                {
                    path: 'table',
                    name: 'table',
                    component: () => import(/* webpackChunkName: "table" */ '@/page/table-number/table'),
                    meta: { title: '餐桌管理' }
                },
                {
                    path: 'set-up',
                    name: 'set-up',
                    component: () => import(/* webpackChunkName: "setup" */ '@/page/set-up/set-up'),
                    meta: { title: '系统设置' }
                },
                {
                    path: 'upload',
                    name: 'upload',
                    component: () => import(/* webpackChunkName: "upload" */ '@/page/dish-management/upload-dishes'),
                    meta: { title: '添加/编辑菜品' }
                }
            ]
        }
    ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 扫码点餐系统` : '扫码点餐系统'
    
    const token = localStorage.getItem('token')
    const currentMerchant = JSON.parse(localStorage.getItem('currentMerchant') || '{}')
    
    // 同步本地存储状态到 Vuex
    if (token && currentMerchant.id && !store.state.token) {
        store.commit('SET_TOKEN', token)
        store.commit('SET_MERCHANT', currentMerchant)
    }

    // 判断是否需要登录权限
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 需要登录权限
        if (!token || !currentMerchant.id) {
            // 未登录，重定向到登录页
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        // 不需要登录权限的页面
        if (to.path === '/login' && token && currentMerchant.id) {
            // 已登录状态下访问登录页，重定向到首页
            if (to.query.redirect) {
                next({ path: to.query.redirect })
            } else {
                next({ path: '/' })
            }
        } else {
            next()
        }
    }
})

export default router