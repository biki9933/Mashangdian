<template>
  <el-container class="app-wrapper">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <span class="merchant-info">{{ merchantName }}</span>
      </div>
      <div class="header-right">
        <span>{{ userInfo.userName }}</span>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-setting"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
          router>
          <el-menu-item index="/order">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="/category">
            <i class="el-icon-menu"></i>
            <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="/dishes">
            <i class="el-icon-dish"></i>
            <span slot="title">菜品管理</span>
          </el-menu-item>
          <el-menu-item index="/table">
            <i class="el-icon-s-grid"></i>
            <span slot="title">桌号管理</span>
          </el-menu-item>
          <el-menu-item index="/">
            <i class="el-icon-s-data"></i>
            <span slot="title">数据分析</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['currentUser', 'currentMerchant']),
    merchantName() {
      return this.currentMerchant.name || '未选择商户'
    },
    userInfo() {
      return this.currentUser || {}
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$store.commit('CLEAR_ALL')
        this.$router.push('/login')
      } else if (command === 'password') {
        this.$router.push('/set-up')
      }
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.merchant-info {
  margin-left: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-right span {
  margin-right: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-aside {
  background-color: #304156;
  height: calc(100vh - 60px);
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style> 