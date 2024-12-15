<template>
	<div class="app-container">
		<!-- 顶部 -->
		<div class="sidebar-top">
			<div>{{ company }}</div>
			<div @click="signOut()">退出</div>
		</div>

		<!-- 侧边栏 -->
		<div class="sidebar-cont">
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" @select="handleSelect">
				<div v-for="(item,index) in sidebar" :key="index">
					<router-link :to="{name: item.router}">
						<el-menu-item :index="item.id" v-if="item.Subclass.length === 0">
							<i :class="item.icon"></i>
							<span slot="title">{{item.title}}</span>
							<span slot="title" class="span-tips" style="margin-left: 2.6875rem;"
							v-if="item.tip == 'dingdan' && dingdan > 0 ">{{dingdan}}</span>
						</el-menu-item>
					</router-link>
					<!-- 如果有二级三级菜单展开，此项目没有 -->
					<el-submenu v-if="item.Subclass.length > 0" :index="item.id">
						<template slot="title">
							<i :class="item.icon"></i>
							<span>{{item.title}}</span>
						</template>

						<div v-for="(iteming,indexs) in item.Subclass" :key="indexs">
							<router-link :to="{name: iteming.router}">
								<el-menu-item :index="iteming.id">{{iteming.title}}</el-menu-item>
							</router-link>
						</div>
					</el-submenu>
				</div>
				<div style="height: 50px;"></div>
			</el-menu>
		</div>

		<!-- 主内容区域 -->
		<div class="main-content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			activeIndex: '1',
			dingdan: 0,
			sidebar: [{
					id: '1',
					icon: 'el-icon-s-data',
					title: '数据分析',
					router: 'analysis',
					tip: 'shuju',
					Subclass: []
				},
				{
					id: '2',
					icon: 'el-icon-bank-card',
					title: '订单管理',
					router: 'order',
					tip: 'dingdan',
					Subclass: []
				},
				{
					id: '3',
					icon: 'el-icon-tableware',
					title: '菜品管理',
					router: 'dishes',
					tip: 'caiping',
					Subclass: []
				},
				{
					id: '4',
					icon: 'el-icon-menu',
					title: '菜品类目',
					router: 'category',
					tip: 'leimu',
					Subclass: []
				},
				{
					id: '5',
					icon: 'el-icon-takeaway-box',
					title: '桌号管理',
					router: 'table',
					tip: 'zhuohao',
					Subclass: []
				},
				{
					id: '6',
					icon: 'el-icon-setting',
					title: '修改密码',
					router: 'set-up',
					tip: 'shezhi',
					Subclass: []
				}
			]
		}
	},

	computed: {
		...mapGetters(['currentMerchant']),
		company() {
			return this.currentMerchant.name || 'Java1234在线订餐'
		}
	},

	methods: {
		handleSelect(key, keyPath) {
			this.$store.commit('SET_MENU_ID', key)
		},
		plays() {
			this.$nextTick(()=>{
				let Audio = this.$refs.audio
				Audio.play()
			})
		},
		signOut() {
			this.$store.commit('CLEAR_ALL')
			this.$router.push({
				name: 'login'
			});
		},
	},

	created() {
		this.activeIndex = this.$store.state.menuId || '1'
		// 订单提醒
		const order_num = localStorage.getItem("order_num")
		this.dingdan = order_num > 99 ? '99+' : order_num
	},

	watch: {
		"$store.state.remind"(newValue, oldValue) {
			if (newValue.num > 0) {
				this.plays()
			}
			this.dingdan = newValue.num > 99 ? '99+' : newValue.num
		}
	},
}
</script>

<style scoped>
.app-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	position: relative;
}

.sidebar-top {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 50px;
	background: #FFFFFF;
	color: #333333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 1000;
	box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.sidebar-top div:nth-child(1) {
	padding-left: 22px;
	font-size: 18px;
}

.sidebar-top div:nth-child(2) {
	padding-right: 22px;
	cursor: pointer;
}

.sidebar-cont {
	position: fixed;
	top: 50px;
	left: 0;
	bottom: 0;
	width: 200px;
	background: #FFFFFF;
	overflow-y: auto;
	z-index: 900;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main-content {
	padding-top: 50px;
	margin-left: 200px;
	min-height: calc(100vh - 50px);
}

.el-menu-item {
	font-size: 15px !important;
}

.el-submenu__title {
	font-size: 15px !important;
}

.span-tips {
	background-color: coral;
	width: 22px !important;
	height: 22px !important;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	color: #fff;
}

/* 修复路由链接样式 */
.sidebar-cont a {
	text-decoration: none;
	color: inherit;
	display: block;
}

/* 激活菜单项样式 */
.el-menu-item.is-active {
	color: #409EFF !important;
}

/* 设置内容区域最小宽度，避免内容过于拥挤 */
@media screen and (min-width: 1200px) {
	.main-content {
		min-width: 1000px;
	}
}
</style>