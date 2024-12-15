<template>
<view class="details-view">
	<view class="order-top">
		<view class="order-remind">
			<view>下单成功，坐等开吃</view>
			<view>菜品已在制作中</view>
		</view>
	</view>
	<view class="food-list">
	 <view class="foot-back">
		 <view class="foot-til">
		 	<text>我的订单</text>
		 </view>
		<block v-for="(item,index) in goods_data" :key="index">
				<view class="foot-deta">
					<view>
						<image :src="baseUrl+'/image/dish/'+item.image" mode="aspectFill"></image>
					</view>
					<view class="foot-name">
						<text>{{item.name}}</text>
						<text>{{item.quantity}}{{item.unit}}</text>
					</view>
					<view class="foot-total">¥{{item.total_price}}</view>
				</view>
		 </block>
		<!-- 总计 -->
		 <view class="total-view">
			<view>共 {{overall}} 份</view>
			<view class="total-price">
				<text>总计</text>
				<text>¥{{Price(Number(total_amount || 0))}}</text>
			</view>
		</view>  
	 </view> 
	<!-- 订单号 -->
	<view class="foot-back order-number">
		<text>订单编号：{{order_id}}</text>
		<text>下单时间：{{create_time}}</text>
		<text>桌台名称：{{table_number || ''}}</text>
	</view>
	<view style="height: 300rpx;"></view>
	</view>
	<!-- 加菜和返回按钮 -->
	<view class="add-a-dish" :style="{'padding-bottom': Modelmes ? '68rpx' : ''}">
		<view @click="goBack" class="back-btn">返回点餐</view>
		<view @click="add_Dish">加菜</view>
	</view>
</view> 
</template>

<script>
import {getBaseUrl, requestUtil} from "../../utils/requestUtil.js"
const app = getApp()
const {Modelmes} = app.globalData
// 骨架屏
import Order from '../skeleton-view/order.vue'
const Price = require('e-commerce_price')

export default{
	components:{Order},
	data() {
		return {
			baseUrl: getBaseUrl(),
			exist: true,
			Modelmes,
			Price,
			overall: 0,//总的多少分
			goods_data: [],//商品数据
			table_number: '', //桌号
			order_id: '', // 订单编号
			create_time: '', // 创建时间
			total_amount: 0, // 总金额
			status: '' // 使用正确的状态字段
		}
	},
	methods:{
		async get_menu(){
			try{
				// 取出本地缓存的桌号
				const table_number = wx.getStorageSync('table_num')
				if (!table_number) {
					throw new Error('未获取到���号信息')
				}
				
				// 最多重试3次
				let retryCount = 0;
				const maxRetries = 3;
				let success = false;
				
				while (!success && retryCount < maxRetries) {
					try {
						const res = await requestUtil({
							url: "/order/get",
							data: {
								table_number: table_number,
								transac_status: 'unsettled'
							},
							method: "get"
						});
						
						console.log('获取订单响应完整数据:', JSON.stringify(res, null, 2))
						
						if (res.code === 0 && res.order) {
							const order = res.order;
							console.log('订单create_time:', order.create_time);
							console.log('订单完整数据:', order);
							this.goods_data = order.goods_list || [];
							this.table_number = order.table_number;
							this.order_id = order.id;
							this.create_time = this.formatTime(order.create_time);
							this.total_amount = order.total_amount;
							this.overall = this.goods_data.length
							
							success = true;
							this.exist = false;
						} else {
							retryCount++;
							if (retryCount < maxRetries) {
								console.log(`订单数据不完整，等待1秒后重试(${retryCount}/${maxRetries})`)
								await new Promise(resolve => setTimeout(resolve, 1000));
							} else {
								throw new Error('获取订单信息失败：数据不完整');
							}
						}
					} catch (error) {
						retryCount++;
						if (retryCount < maxRetries) {
							console.log(`获取订单失败，等待1秒后重试(${retryCount}/${maxRetries})`)
							await new Promise(resolve => setTimeout(resolve, 1000));
						} else {
							throw error;
						}
					}
				}
			} catch(error) {
				console.error('获取订单信息失败2:', error)
				uni.showToast({
					title: error.message || '获取订单信息失败',
					icon: 'none',
					duration: 2000
				})
				
				// 延迟返回上一页
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 2000)
			}
		},
		
		// 格式化时间
		formatTime(timestamp) {
			if (!timestamp) return ''
			const date = new Date(timestamp)
			const year = date.getFullYear()
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const day = date.getDate().toString().padStart(2, '0')
			const hour = date.getHours().toString().padStart(2, '0')
			const minute = date.getMinutes().toString().padStart(2, '0')
			return `${year}-${month}-${day} ${hour}:${minute}`
		},
		
		// 返回点餐页面
		goBack(){
			wx.navigateBack({
				delta: 1
			})
		},
		
		// 加菜
		add_Dish(){
			wx.navigateBack({
				delta: 1
			})
		}
	},
	onLoad(options) {
		this.get_menu()
	}
}
</script>

<style>
page{background-color: #f4f4f4;}
.details-view{position: relative;}
.order-top{
	background:linear-gradient(to bottom, #f7d45f,#f7d562,#f8d561,#f9db76, #f9de80);
	height: 300rpx;
}
.order-remind view:nth-child(1){
	font-size: 35rpx;
	font-weight: bold;
	padding-bottom: 20rpx;
}
.order-remind{
	height: 200rpx;
	padding: 50rpx 0 0 50rpx;
}
.food-list{
	position: absolute;
	top: 200rpx;
	left: 20rpx;
	right: 20rpx;
}
.foot-back{
	background-color: #fefefe;
	border-radius: 10rpx;
	padding: 0 20rpx;
	margin-bottom: 30rpx;
}
.foot-til{
	height: 100rpx;
	color: #999999;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.foot-deta image{
	display: block;
	width: 130rpx;
	height: 130rpx;
	border-radius: 10rpx;
}
.foot-deta{
	display: flex;
	justify-content: space-between;
	height: 130rpx;
	margin: 40rpx 0;
}
.foot-name{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 20rpx;
	font-size: 30rpx;
}
.foot-name text:nth-child(1){font-size: 31rpx !important;font-weight: bold;}
.foot-name text:nth-child(2){color: #666666;}
.foot-total{font-weight: bold;}
/* 展开更多 */
.expand-more image{
	width: 25rpx;
	height: 25rpx;
	display: block;
	padding-left: 10rpx;
}
.expand-more{
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999999;
	font-size: 25rpx;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f1f1f2;
}
/* 总计 */
.total-price{
	display: flex;
	align-items: center;
	color: #333333;
	padding-left: 40rpx;
}
.total-price text:nth-child(2){
	font-size: 35rpx;
	font-weight: bold;
	padding-left: 30rpx;
	}
.total-view{
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 30rpx 0;
}
.total-view view:nth-child(1){
	color: #999999;
}
/* 订单号 */
.order-number text{
	display: block;
	padding: 15rpx 0;
	font-size: 28rpx;
	color: #999999;
}
/* 加菜和返回按钮 */
.add-a-dish{
	background-color: #fefefe;
	height: 120rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	box-shadow: 0rpx -1.9rpx 1rpx 1rpx #f9f9f9;
	padding: 0 20rpx;
	z-index: 9;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.add-a-dish view{
	background:linear-gradient(to right,#f8da81,#f8d771,#f7d362,#f6cb4a);
	width: 200rpx;
	height: 75rpx;
	line-height: 75rpx;
	text-align: center;
	border-radius: 50rpx;
	font-weight: bold;
}
.back-btn {
	background: linear-gradient(to right, #f6cb4a, #f7d362, #f8d771, #f8da81) !important;
}
</style>
