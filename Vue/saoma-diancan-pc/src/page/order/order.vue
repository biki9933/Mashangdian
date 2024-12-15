<template>
	<div class="ordering" v-loading.fullscreen.lock="loading">
		<div class="heading">订单管理</div>
		<div class="content-view">
			<!-- 操作区域 -->
			<div class="query-view">
				<div class="quotation-query">
					<el-button type="warning" size="medium" @click="refresh_order()">刷新订单</el-button>
				</div>
			</div>

			<!-- 订单列表 -->
			<div v-if="nodatas">
				<el-table
					:data="tabcont"
					style="width: 100%"
					border
					stripe
					v-loading="loading">
					<el-table-column
						prop="order_no"
						label="订单号"
						width="180">
					</el-table-column>
					<el-table-column
						label="下单时间"
						width="160">
						<template slot-scope="scope">
							{{formatDate(scope.row.create_time)}}
						</template>
					</el-table-column>
					<el-table-column
						label="桌号"
						width="100">
						<template slot-scope="scope">
							{{scope.row.table_number || '--'}}
						</template>
					</el-table-column>
					<el-table-column
						label="订单金额"
						width="120">
						<template slot-scope="scope">
							¥{{formatPrice(scope.row.total_amount)}}
						</template>
					</el-table-column>
					<el-table-column
						label="订单状态"
						width="120">
						<template slot-scope="scope">
							<el-tag :type="getStatusType(scope.row.status)">
								{{getStatusText(scope.row.status)}}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column
						label="操作"
						width="250">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="primary"
								@click="detailed_menu(scope.$index, scope.row.id)"
								:loading="scope.$index == deta_load">
								查看详情
							</el-button>
							<el-button
								size="mini"
								:type="scope.row.status == 2 ? 'info' : 'success'"
								v-if="scope.row.status == 1 || scope.row.status == 2"
								@click="receiving(scope.$index)">
								{{scope.row.status == 2 ? '已接单' : '接单'}}
							</el-button>
							<el-button
								size="mini"
								type="warning"
								v-if="scope.row.status == 2"
								@click="checkout(scope.$index, scope.row.id)"
								:loading="scope.$index == check_load">
								完成订单
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 订单详情弹窗 -->
			<el-dialog
				title="订单详情"
				:visible.sync="dialogVisible"
				width="600px"
				:center="true">
				<div v-if="currentOrder" class="order-detail">
					<div class="detail-header">
						<div class="detail-item">
							<span class="label">订单号：</span>
							<span>{{currentOrder.order_no}}</span>
						</div>
						<div class="detail-item">
							<span class="label">下单时间：</span>
							<span>{{formatDate(currentOrder.order_time)}}</span>
						</div>
						<div class="detail-item">
							<span class="label">桌号：</span>
							<span>{{currentOrder.table_number}}</span>
						</div>
						<div class="detail-item">
							<span class="label">用餐人数：</span>
							<span>{{currentOrder.number_of_diners || '--'}}</span>
						</div>
					</div>
					<el-divider></el-divider>
					<div class="menu-list">
						<el-table
							:data="user_menu"
							border
							style="width: 100%">
							<el-table-column
								prop="name"
								label="菜品名称"
								width="180">
								<template slot-scope="scope">
									{{scope.row.name || '未知菜品'}}
								</template>
							</el-table-column>
							<el-table-column
								prop="quantity"
								label="数量"
								width="100">
								<template slot-scope="scope">
									{{scope.row.quantity}}{{scope.row.unit}}
								</template>
							</el-table-column>
							<el-table-column
								prop="price"
								label="单价"
								width="100">
								<template slot-scope="scope">
									¥{{formatPrice(scope.row.price)}}
								</template>
							</el-table-column>
							<el-table-column
								label="小计"
								width="100">
								<template slot-scope="scope">
									¥{{formatPrice(scope.row.price * scope.row.quantity)}}
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="detail-footer">
						<div class="total-amount">
							<span class="label">订单总额：</span>
							<span class="amount">¥{{formatPrice(currentOrder.total_amount)}}</span>
						</div>
					</div>
				</div>
			</el-dialog>
		</div>
		<div style="height: 120px;"></div>
	</div>
</template>

<script>
// 交状态
import {staff} from '../../../config/state-type.js'
import { mapGetters } from 'vuex'
// 价格补领
const Price = require('e-commerce_price')
export default{
	data() {
		return {
			Price:Price,
			loading: true,
			nodatas:true,
			dialogVisible:false,//出详细菜单
			deta_load:-1,//查看详细菜单
			rece_load:-1,//接单
			check_load:-1,//结账
			nodvalue:'没有订单数据',
			tablist:['交易时间','桌号','菜单详情','交易金额(元)','交易状态'],
			tabcont:[],
			user_menu:[],//用户详细菜单
			dingdan:0,//订单提醒
			currentOrder: null,
			changedOrders: new Set(), // 用于记录状态发生变化的订单ID
		}
	},
	computed: {
		...mapGetters(['currentMerchant'])
	},
	methods:{
		// 获取订单
		async obtainorder(vle){
			const oldPage = this.pagenum
			try{
				const params = {
					start: (this.pagenum - 1) * this.pageSize, // 计算start
					pageSize: this.pageSize,
					merchantId: this.currentMerchant.id
				}
				let res = await new this.Request('/admin/order/list').modepost(params)
				console.log('获取订单列表响应：', res)
				if (res.code === 0) {
					this.nodatas = res.orderList && res.orderList.length > 0
					this.tabcont = res.orderList || []
					this.total = res.total || 0
					this.loading = false
					if(vle == 1){
						localStorage.setItem('order_num',0)
						this.$store.commit('order_remind',0)
					}
				} else {
					this.$message.error(res.msg || '获取订单列表失败')
					this.pagenum = oldPage
				}
			}catch(e){
				console.error('获取订单列表失败：', e)
				this.$message.error('服务器发生错误,请重试')
				this.pagenum = oldPage
			}
			this.loading = false
		},
		// 查看详细菜单
		async detailed_menu(index, id){
			this.deta_load = index
			try{
				// 打印调试信息
				console.log('订单ID:', id)
				console.log('订单信息:', this.tabcont[index])
				
				let res = await new this.Request('/admin/orderDetail/list', { id: id }).modeget()
				console.log('订单详情响应：', res)
				if (res.code === 0) {
					const order = this.tabcont[index]
					this.currentOrder = {
						...order,
						order_time: order.create_time
					}
					// 处理订单详情数据
					this.user_menu = res.list.map(item => ({
						id: item.id,
						name: item.name || '未知菜品',
						quantity: item.quantity || 0,
						price: item.price || 0,
						unit: item.unit || '份',
						total_price: (item.quantity * item.price) || 0
					}))
					this.dialogVisible = true
				} else {
					this.$message.error(res.msg || '获取订单详情失败')
				}
			} catch(e) {
				console.error('获取订单详情失败：', e)
				this.$message.error('服务器发生错误，请重试')
			} finally {
				this.deta_load = -1
			}
		},
		// 接单状态切换
		async receiving(index){
			try {
				const order = this.tabcont[index]
				const newStatus = order.status == 2 ? 1 : 2
				
				// 调用后端接口
				const res = await new this.Request('/admin/order/receiving', {
					id: order.id,
					status: newStatus
				}).modepost()
				
				if (res.code === 0) {
					// 后端更新成功后，再更新前端状态
					order.status = newStatus
					this.$forceUpdate()
					this.$message.success(newStatus === 2 ? '接单成功' : '取消接单成功')
				} else {
					this.$message.error(res.msg || '操作失败')
				}
			} catch(e) {
				console.error('订单状态修改失败：', e)
				this.$message.error('服务器发生错误，请重试')
			}
		},
		// 结账
		async checkout(index,id){
			this.check_load = index
			try{
				let res = await new this.Request('/admin/order/checkout', {
					id: id,
					status: 3  // 3表示已完成状态
				}).modepost()
				
				if (res.code === 0) {
					this.$set(this.tabcont[index],'status', 3)
					this.$message.success('完成订单成功')
				} else {
					this.$message.error(res.msg || '完成订单失败')
				}
			}catch(e){
				console.error('完成订单失败：', e)
				this.$message.error('服务器发生错误,请重试')
			}
			this.check_load = -1
		},
		// 刷新订单
		refresh_order(){
			this.loading = true
			this.deta_load = -1//查看详细菜单
			this.rece_load = -1//接单
			this.check_load = -1//结账
			this.obtainorder(1)
		},
		formatDate(date) {
			if (!date) return '--';
			const d = new Date(date);
			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, '0');
			const day = String(d.getDate()).padStart(2, '0');
			const hour = String(d.getHours()).padStart(2, '0');
			const minute = String(d.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hour}:${minute}`;
		},
		formatPrice(price) {
			if (!price) return '0.00';
			return this.Price(price);
		},
		// 获取状态类型
		getStatusType(status) {
			const types = {
				'1': 'warning',
				'2': 'success',
				'3': 'info',
				'4': 'danger'
			}
			return types[status] || 'info'
		},
		// 获取状态文本
		getStatusText(status) {
			if (!status) return '未知';
			const texts = {
				'1': '待支付',
				'2': '已支付',
				'3': '已完成',
				'4': '已取消'
			}
			return texts[status] || '未知'
		},
		// 分页切换
		currentchange(e){
			this.pagenum = e
			this.obtainorder(0)
		},
		// 每页条数改变
		handleSizeChange(val) {
			this.pageSize = val
			this.pagenum = 1 // 重置到第一页
			this.obtainorder(0)
		},
		// 保存状态到数据库
		async saveStatusToDatabase() {
			if (this.changedOrders.size === 0) {
				return
			}

			try {
				// 只保存发生变化的订单状态，但排除接单状态的变化
				for (let order of this.tabcont) {
					if (this.changedOrders.has(order.id) && order.status !== 1 && order.status !== 2) {
						try {
							let res = await new this.Request('/admin/order/checkout').modepost({
								id: order.id,
								status: order.status
							})
							if (res.code !== 0) {
								console.error(`订单 ${order.id} 状态保存失败：${res.msg}`)
							}
						} catch (err) {
							console.error(`订单 ${order.id} 状态保存失败：`, err)
						}
					}
				}
			} catch (e) {
				console.error('保存订单状态失败：', e)
			} finally {
				this.changedOrders.clear()
				this.obtainorder(0)
			}
		},
	},
	created() {
		// 获取订单
		this.obtainorder(0)
		// 订单提醒
		this.dingdan = localStorage.getItem("order_num")
	},
	beforeDestroy() {
		// 在组件销毁前保存状态到数据库
		this.saveStatusToDatabase()
	},
	watch: {
		// 听订单提醒
		"$store.state.remind"(newValue, oldValue) {
			this.dingdan = newValue.num
		}
	},
}
</script>

<style scoped="scoped">
@import url("../../../style/pubiss.css");
@import url("../../../style/popup.css");
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
	background-color: #00be06;
	color: #fff;
}
::v-deep .el-badge{
	margin-right: 5px;
}
.menu-padd{
	border-bottom: 1px solid #f8f8f8;
}
.Menu-details{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 50px;
}
.menu-margin{margin: 20px 0;}
.menu-span{
	font-weight: bold;
	font-size: 15px;
	padding-top: 20px;
}
::v-deep .el-dialog{
	height: 600px;
	overflow-y: auto;
	border-radius: 5px !important;
}
.content-view {
	padding: 20px;
}

.query-view {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	background: #f5f7fa;
	padding: 15px;
	border-radius: 4px;
}

.quotation-query {
	margin-right: 20px;
}

.stat-cards {
	margin-bottom: 20px;
}

.stat-number {
	font-size: 24px;
	font-weight: bold;
	color: #409EFF;
	text-align: center;
}

.pagination-container {
	margin-top: 20px;
	text-align: right;
}

.order-detail {
	padding: 20px;
}

.detail-header {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px;
}

.detail-item {
	display: flex;
	align-items: center;
}

.detail-item .label {
	font-weight: bold;
	margin-right: 10px;
	color: #606266;
}

.menu-list {
	margin: 20px 0;
}

.detail-footer {
	text-align: right;
	margin-top: 20px;
}

.total-amount {
	font-size: 16px;
}

.total-amount .label {
	font-weight: bold;
	color: #606266;
}

.total-amount .amount {
	color: #f56c6c;
	font-size: 20px;
	font-weight: bold;
}

.el-tag {
	width: 80px;
	text-align: center;
}
</style>
