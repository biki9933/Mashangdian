<template>
<!-- 弹出购物车 -->
<view>
	<view class="details-back" @click="cLose()"></view>
	<view class="goods-details coup-anim">
		<view class="empty">
			<image class="empty-image" src="/static/tab/qingkong.svg" mode="widthFix"></image>
			<text class="empty-text" @click="empTy()">清空已点</text>
		</view>
		<!-- 商品列表 -->
		<block v-for="(item,index) in shopping_card" :key="index">
		<view class="goods-list" v-if="item.quantity > 0">
			<view class="goods-list-image"><image class="list-img" :src="'http://localhost:80'+'/image/dish/'+item.image" mode="aspectFill"></image></view>
			<view class="goods-list-name">
				<view class="name-text">{{item.name}}</view>
				<view class="list-text">
					<text class="price-symbol">¥</text>
					<!-- 总价 -->
					<text class="price-value">{{item.total_price}}</text>
				</view>
			</view>
			<view class="goods-quantity">
				<view class="quantity-wrap"><image class="quantity-img" src="/static/tab/jianhao.png" mode="widthFix" @click="reduce(index,item.quantity,item.dish_id,item.cid,item.good_index,item.price)"></image></view>
				<view class="quantity-text">{{item.quantity}}</view>
				<view class="quantity-wrap"><image class="quantity-img" src="/static/tab/jia.png" mode="widthFix" @click="plus(index,item.quantity,item.dish_id,item.cid,item.good_index,item.price)"></image></view>
			</view>
		</view>
		</block>
		<view class="bottom-space"></view>
	</view>
</view>
</template>

<script>
	import {getBaseUrl, requestUtil} from "../../../utils/requestUtil.js"
export default{
	props:{shopping_card:Array},
	methods:{
		cLose(){
			// 调用父组件的pop_Shopping()
			this.$parent.pop_Shopping(false)
		},
		// -
		reduce(index,quantity,_id,cid,good_index,unitprice){
			const QU = quantity - 1
			this.$parent.shopping_Cart_add_sub(index,QU,_id,cid,good_index,unitprice)
		},
		// +
		plus(index,quantity,_id,cid,good_index,unitprice){
			const QU = quantity + 1
			this.$parent.shopping_Cart_add_sub(index,QU,_id,cid,good_index,unitprice)
		},
		// 清空已点
		empTy(){
			this.$parent.empty_data()
		}
	}
}
</script>

<style scoped>
@import '../../../style/shadow.css';
.empty .empty-image {
	width: 25rpx;
	height: 25rpx;
	display: block;
	padding-right: 10rpx;
}
.empty .empty-text {
	font-size: 25rpx;
	color: #aaaaaa;
}
.empty{
	font-size: 25rpx;
	color: #aaaaaa;
	height: 90rpx;
	border-bottom: 1rpx solid #f2f2f2;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin: 0 20rpx;
}
.goods-list-image .list-img {
	display: block;
	width: 130rpx;
	height: 130rpx;
	border-radius: 10rpx;
}
.goods-quantity .quantity-img {
	display: block;
	width: 50rpx;
	height: 50rpx;
}
.goods-quantity{
	display: flex;
	align-items: center;
	align-self: flex-end;
	width: 200rpx;
	justify-content: space-between;
}
.goods-list{
	display: flex;
	justify-content: space-between;
	padding: 0 20rpx;
	height: 130rpx;
	font-size: 30rpx;
	margin: 25rpx 0 45rpx 0;
}
.goods-list-name{
	flex: 1;
	position: relative;
	padding: 0 20rpx;
}
.goods-list-name .name-text {
	margin-bottom: 10rpx;
}
.list-text .price-symbol,
.list-text .price-value {
	display: block;
}
.list-text{
	display: flex;
	align-items: center;
	position: absolute;
	bottom: 0;
}
.list-text .price-symbol {
	font-size: 25rpx;
	padding-right: 5rpx;
}
.quantity-text {
	text-align: center;
}
.bottom-space {
	height: 100rpx;
}
</style>
