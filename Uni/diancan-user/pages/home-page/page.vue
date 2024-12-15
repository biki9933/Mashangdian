<template>
 <view class="container">
   <!-- 顶部 -->
   <view class="top-view">
     <view>{{number_people}}人就餐</view>
     <view class="top-view-flex">
       <image class="top-image" src="/static/tab/fenxiang.svg" mode="widthFix"></image>
     </view>
   </view>
   
   <view class="order-view">
     <view class="commodity">
       <!-- 左侧分类列表 -->
       <scroll-view class="order-left" scroll-y="true">
         <view class="itemize-text" v-for="(item,index) in itemize" :key="index" 
               :class="trigger === index ? 'active' : ''" @click="itemIze(index,item.cid)">
           <text class="text-item">{{item.value}}</text>
           <text class="text-item" v-if="item.sele_quantity > 0">{{item.sele_quantity}}</text>
         </view>
       </scroll-view>
       
       <!-- 右侧商品列表 -->
       <scroll-view class="order-right" scroll-y="true" :scroll-into-view="scroll_into" 
                   @scroll="scroLl" :scroll-with-animation="true">
         <view v-for="(item,index) in goods" :key="index" :id="item.cid">
           <view class="classif">{{item.value}}</view>
           <view class="classif-goods" v-for="(good,good_index) in item.dishList" :key="good_index">
             <view class="goods-image" @click="popup_item(true,index,good_index,item.cid,good)">
               <image class="goods-img" :src="baseUrl + '/image/dish/' + good.image" mode="aspectFill"></image>
             </view>
             <view class="goods-Price">
               <view class="goods-name">
                 <text class="name-text Bold">{{good.name}}</text>
                 <text class="name-text Thinning">月售 {{good.monthlysale}}</text>
               </view>
               <view class="unit-price">
                 <text class="Symbol">¥</text>
                 <text class="Bold">{{good.unitprice}}</text>
                 <text class="Thinning">/{{good.unit}}</text>
               </view>
             </view>
             <view class="quantity">
               <view v-if="good.quantity > 0">
                 <image class="quantity-img" src="/static/tab/jianhao.png" mode="widthFix" 
                        @click="reduce(index,good_index,item.cid,good)"></image>
               </view>
               <view v-if="good.quantity > 0">{{good.quantity}}</view>
               <view>
                 <image class="quantity-img" src="/static/tab/jia.png" mode="widthFix" 
                        @click="plus(index,good_index,item.cid,good)"></image>
               </view>
             </view>
           </view>
         </view>
       </scroll-view>
     </view>

     <!-- 底部购物车和结账按钮 -->
     <view class="order-bottom">
       <view class="shopping" @click="pop_Shopping()">
         <image class="shopping-image" src="/static/tab/gouwuche.png" mode="widthFix"></image>
         <view class="shopping-num" v-if="total_quantity > 0">{{total_quantity}}</view>
       </view>
       <view class="order-price">
         <text class="price-symbol">¥</text>
         <text class="price-value">{{total_price}}</text>
       </view>
       <view class="order-button" @click="placean_order">去结账</view>
     </view>
   </view>

   <!-- 购物车 -->
   <Cart v-if="card" :shopping_card="shopping_card"></Cart>
   <!-- 引入单个商品弹出 -->
   <Details v-if="popupitem" :pro_details="pro_details"></Details>
   <!-- 骨架屏 -->
   <Home v-if="exist"></Home>
   <!-- 用户名输入弹窗 -->
   <uni-popup ref="userNamePopup" type="dialog">
     <uni-popup-dialog
       mode="input"
       title="请输入您的姓名"
       placeholder="请输入姓名"
       :value="inputUserName"
       :beforeClose="true"
       @confirm="confirmUserName"
       @close="closeUserNamePopup">
     </uni-popup-dialog>
   </uni-popup>
 </view>
</template>


<script>
import {getBaseUrl, requestUtil} from "../../utils/requestUtil.js"
const app = getApp()
const {Modelmes} = app.globalData
// 骨架屏
import Home from '../skeleton-view/home.vue'
// 购物车子组件
import Cart from './components/shopping-cart.vue'
// 单个商品弹出
import Details from './components/goods-details.vue'

export default {
	components: {
		Cart,
		Details,
		Home
	},
	data() {
		return {
			baseUrl: getBaseUrl(), // 直接初始化 baseUrl
			exist: true,
			Modelmes,
			itemize: [], //类目
			trigger: 0, //类目选中的值
			goods: [], //所有菜品
			heightset: [], //存储右边每一个分类菜品的高度
			tophei: 0, //滚动时距离顶部的高度
			scroll_into: '',
			card: false, //购物车隐藏
			shopping_card: [], //购物车里的数据
			popupitem: false, //单个商品弹出框隐藏
			pro_details: {}, //单个商品弹出框里的数据
			tmplIds: 'FANEJh9NPNhJrLpqQx7UhNerntR5GwEsLKK-95tuvNM', //模板id
			number_people: 0, //用餐人数
			merchantId: 0, // 商家ID
			inputUserName: '', // 用户输入的姓名
			userNamePopupVisible: false // 添加控制弹窗显示的状态
		}
	},
	methods:{
		// 点击类目加上背景色
		itemIze(index,cid){
			this.trigger = index
			this.scroll_into = cid
			setTimeout(()=>{
				this.scroll_into = ''
			},200)
		},
		// 右边菜品滚动时触发
		scroLl(event){
			// console.log(event.detail.scrollTop)
			let scrollTop = event.detail.scrollTop
			if(scrollTop >= this.tophei){//上拉
				// 当前分类商品的高度小滚动高度时跳转下一个分类
				if(scrollTop >= this.heightset[this.trigger]){
					this.trigger += 1
				}
			}else{//下拉
				// 当前分类商品的高度大于滚动高度时跳转下一个分类
				if(scrollTop < this.heightset[this.trigger - 1]){
					this.trigger -= 1
				}
			}
			this.tophei = scrollTop
		},
		
		// 单个商品+
		plus(index,good_index,cid,itemgood){
			const {quantity,image,name,unitprice,unit,id} = itemgood
			const QU = quantity + 1
			this.$set(this.goods[index].dishList[good_index],'quantity',QU)
			const arr = {
				dish_id: id,
				quantity: QU,
				price: unitprice,
				// 以下字段仅用于前端显示
				image,
				name,
				unit,
				total_price: unitprice * QU,
				cid,
				good_index
			}
			this.shopping_Cart(arr)
		},
		
		// 单个商品-
		reduce(index,good_index,cid,itemgood){
			const {quantity,image,name,unitprice,unit,id} = itemgood
			const QU = quantity - 1
			this.$set(this.goods[index].dishList[good_index],'quantity',QU)
			const arr = {
				dish_id: id,
				quantity: QU,
				price: unitprice,
				// 以下字段仅用于前端显示
				image,
				name,
				unit,
				total_price: unitprice * QU,
				cid,
				good_index
			}
			this.shopping_Cart(arr)
		},
		
		// 添加进物车的商品
		shopping_Cart(arr){
			if(this.shopping_card.length == 0){
				// 一：购物车没有数据，空数组：
				this.shopping_card.push(arr)
			}else{
				// 二：购物车里有数据
				let itemindex = this.shopping_card.findIndex(item => item.dish_id == arr.dish_id)
				if(itemindex == -1){
					// 没有相同的菜品存在
					this.shopping_card.unshift(arr)
				}else{
					// 更新数量和总价
					this.$set(this.shopping_card[itemindex],'quantity',arr.quantity)
					this.$set(this.shopping_card[itemindex],'total_price',arr.price * arr.quantity)
				}
			}
			console.log('购物车数据:', this.shopping_card)
			this.qunint_of_goods()
		},
		
		// 计算左边各分类下少菜品
		qunint_of_goods(){
			let array = this.shopping_card
			let res = {}
			array.forEach(item=>{
				if(res[item.cid]){
					res[item.cid] += item.quantity
				}else{
					res[item.cid] = item.quantity
				}
			})
			let M = []
			for(let k in res){
				M.push({cid:k,value:res[k]})
			}
			M.forEach(item=>{
				let res_index = this.itemize.findIndex(iteming => iteming.cid == item.cid)
				this.$set(this.itemize[res_index],'sele_quantity', item.value)
			})
		},
		
		
		//购物车商品加减数量
		shopping_Cart_add_sub(index,QU,dish_id,cid,good_index,price){
			if(QU <= 0){
				// 如果数量为0，从购物车中移除
				this.shopping_card.splice(index, 1)
			} else {
				// 更新购物车中的数量和总价
				this.$set(this.shopping_card[index],'quantity',QU)
				this.$set(this.shopping_card[index],'total_price',QU * price)
			}
			
			// 更新商品列表中的数量
			const itemcid = this.goods.findIndex(item=> item.cid == cid)
			if(itemcid !== -1){
				this.$set(this.goods[itemcid].dishList[good_index],'quantity',QU)
			}
			
			this.qunint_of_goods()
		},
		
		// 清空已点：被子组件调用
		empty_data(){
			this.shopping_card = []
			this.itemize.forEach(item=>{item.sele_quantity = 0})
			this.goods.forEach(item=>{
				item.dishList.forEach(T=>{
					T.quantity = 0
				})
			})
			this.pop_Shopping(false)
		},
		
		// 弹出或隐藏单个商品弹出框
		popup_item(value = true,index,good_index,cid,itemgood){
			this.popupitem = value
			this.pro_details = {index,good_index,cid,itemgood}
			console.log(this.pro_details)
		},
		// 显示购物车组件
		pop_Shopping(value = true){
			this.card = value
		},

		// 请求数据
		async dishEs() {
			try {
				console.log('开始加载菜品数据');
				// 从本地存储获取商家ID
				const merchantId = wx.getStorageSync('merchantId');
				console.log('商家ID:', merchantId);
				
				if (!merchantId) {
					throw new Error('未获取到商家信息');
				}
				
				// 获取所有菜品和分类
				const res = await requestUtil({
					url: "/dish/listAll",
					method: "get",
					data: { merchantId }
				});
				
				console.log('菜品数据响应:', res);
				
				if (res.code === 0) {
					const categoryList = res.categoryList;
					if (categoryList && Array.isArray(categoryList)) {
						console.log('分类数据:', categoryList);
						
						// 设置分类数据
						this.itemize = categoryList;
						// 设置商品数据
						this.goods = categoryList;
						
						// 计算侧高度
						this.$nextTick(() => {
							this.goods_height();
						});
						
						this.exist = false;
					} else {
						throw new Error('返回数据格式不正确');
					}
				} else {
					throw new Error(res.msg || '获取数据失败');
				}
			} catch (error) {
				console.error('获取菜品数据失败：', error);
				uni.showToast({
					title: error.message || '获取菜品数据失败',
					icon: 'none',
					duration: 2000
				});
			}
		},
		// 计算右边每个分类菜品的高度
		goods_height(){
			this.heightset = []
			let cate_height = 0
			const query = wx.createSelectorQuery()
			query.selectAll('.rig-height').boundingClientRect()
			query.exec((res)=>{
				res[0].forEach((item)=>{
					cate_height += item.height
					this.heightset.push(cate_height)
				})
				this.exist = false
			})
		},
		
		// 弹出订阅消息弹窗
		placean_order(){
			// 消息弹窗
			wx.requestSubscribeMessage({
			  tmplIds: [this.tmplIds],
			  success:(res)=>{
				  this.sub_database()
			  },
			  fail:(err)=>{
				  this.sub_database()
			  }
			})
		},
		
		
		// 提交订单
		async sub_database(){
			try {
				wx.showLoading({title: '正在下单',mask:true})
				
				// 获取必要的信息
				const userId = wx.getStorageSync('userId')
				const merchantId = wx.getStorageSync('merchantId')
				const table_number = wx.getStorageSync('table_num')
				
				console.log('订单信息:', {
					userId,
					merchantId,
					table_number,
					'localStorage merchantId': wx.getStorageSync('merchantId'),
					'this.merchantId': this.merchantId,
					'localStorage userId': wx.getStorageSync('userId'),
					'this.userId': this.userId
				})
				
				if (!merchantId) {
					// 如果merchantId为空，尝试重新获取
					const res = await requestUtil({
						url: `/merchant/getByTable/${table_number}`,
						method: "get"
					})
					
					if (res.code === 0 && res.merchant) {
						wx.setStorageSync('merchantId', res.merchant.id)
						this.merchantId = res.merchant.id
						console.log('重新获取到的商家ID:', res.merchant.id)
					} else {
						throw new Error('获取商家信息失败')
					}
				}
				
				if (!userId || !merchantId || !table_number) {
					throw new Error('缺少必要的订单信息')
				}
				
				// 1.过滤掉总价为0的购物车里的菜品
				let goods_list = this.shopping_card.filter(item => item.total_price != 0)
				if (goods_list.length === 0) {
					throw new Error('购物车为空')
				}
				
				console.log('购物车商品列表:', JSON.stringify(goods_list, null, 2))
				
				// 2.计算总价
				let total_amount = 0
				goods_list.forEach(item => {
					total_amount += item.total_price
				})
				
				// 3.生成订单号 (时间戳 + 随机数)
				const order_no = new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString()
				
				// 4.构建订单数据
				const orderData = {
					merchantId: merchantId,
					userId: userId,
					table_number: table_number,
					order_no: order_no,
					total_amount: total_amount,
					status: 1, // 1表示待支付状态
					goods_list: goods_list.map(item => {
						console.log('购物车商品数据:', item);
						return {
							dish_id: item.id, // 使用商品的id作为dish_id
							quantity: item.quantity,
							price: item.unitprice
						};
					})
				}
				
				console.log('提交订单数据:', JSON.stringify(orderData, null, 2));
				
				const res = await requestUtil({
					url: "/order/create",
					data: orderData,
					method: "post"
				})
				
				console.log('订单提交响应:', res)
				
				if (res.code === 0) {
					// 清空购物车
					this.empty_data()
					
					// 构建完整的订单数据
					const orderDetails = {
						order_no: order_no,
						table_number: table_number,
						total_amount: total_amount,
						create_time: new Date().toISOString(),
						goods_list: goods_list.map(item => ({
							dish_id: item.id,
							name: item.name,
							quantity: item.quantity,
							price: item.unitprice,
							unit: item.unit,
							image: item.image
						}))
					}
					
					// 将订单数据存入本地缓存
					wx.setStorageSync('current_order', orderDetails)
					
					// 跳转到订单详情页
					wx.navigateTo({
						url: `/pages/order-details/details`
					})
				} else {
					throw new Error(res.msg || '下单失败')
				}
			} catch (error) {
				console.error('下单失败:', error)
					uni.showToast({
						title: error.message || '下单失败',
						icon: 'none',
						duration: 2000
					})
			} finally {
				wx.hideLoading()
			}
		},
		
		
		// 推送订单提醒
		push_message(){
			var pubsub = this.goeasy.pubsub;
			pubsub.publish({
			    channel: "my_channel",//替换为您自己的channel
			    message: "小程序端来的",//替换为您想要发送的消息内容
			    onSuccess:()=>{
			        console.log("消息发布成功。");
			    },
			    onFailed:(error)=> {
			        console.log("消息发送失败，错误编码："+error.code+" 错误信息："+error.content);
			    }
			});
		},
		
		// 我的订单
		my_order(){
			wx.navigateTo({
				url:'/pages/my-order/my-order'
			})
		},
		
		// 显示用户名输入弹窗
		showUserNamePopup() {
		  // 添加错误处理
		  try {
		    if (this.$refs.userNamePopup) {
		      this.$refs.userNamePopup.open();
		    } else {
		      console.error('弹窗组件未找到');
		    }
		  } catch (error) {
		    console.error('显示弹窗失败:', error);
		  }
		},
		
		// 关闭用户名输入弹窗
		closeUserNamePopup() {
			this.$refs.userNamePopup.close()
		},
		
		// 确认用户名
		async confirmUserName(val) {
			try {
				console.log('开始验证用名:', val);
				if (!val || val.trim() === '') {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					});
					return;
				}
				
				const res = await requestUtil({
					url: "/user/verify",
					method: "post",
					data: {
						userName: val.trim()
					}
				});
				
				console.log('用户验证响应:', res);
				
				if (res.code === 0) {
					// 保存用户信息
					wx.setStorageSync('userId', res.user.id);
					wx.setStorageSync('userName', res.user.userName);
					
					// 关闭弹窗
					this.$refs.userNamePopup.close();
					
					// 设置baseUrl
					this.baseUrl = getBaseUrl();
					
					// 加载菜品数据
					await this.dishEs();
				} else {
					throw new Error(res.msg || '证用户失败');
				}
			} catch (error) {
				console.error('验证用户失败：', error);
				uni.showToast({
					title: error.message || '验证用户失败',
					icon: 'none',
					duration: 2000
				});
			}
		},
		
		// 去结账
		async placean_order() {
			if (this.shopping_card.length === 0) {
				uni.showToast({
					title: '请先选择商品',
					icon: 'none'
				});
				return;
			}

			try {
				// 构造订单数据
				const orderData = {
					table_number: wx.getStorageSync('table_num'),  // 使用实际的桌号
					total_amount: this.total_price,  // 总金额
					goods_list: this.shopping_card.map(item => ({
						dish_id: item.dish_id,  // 确保使用 dish_id
						quantity: item.quantity,
						price: item.price
					}))
				};

				console.log('发送的订单数据:', JSON.stringify(orderData, null, 2));

				const res = await requestUtil({
					url: '/order/create',
					method: 'POST',
					data: orderData
				});

				if (res.code === 0) {
					uni.showToast({
						title: '下单成功',
						icon: 'success',
						duration: 1500
					});
					this.empty_data();  // 清空购物车
					
					// 延迟跳转，等待提示显示完成
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/order-details/details',
							success: () => {
								console.log('跳转到订单详情页面成功');
							},
							fail: (err) => {
								console.error('跳转失败:', err);
							}
						});
					}, 1500);
				} else {
					uni.showToast({
						title: res.msg || '下单失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('下单失败:', error);
				uni.showToast({
					title: '下单失败，请重试',
					icon: 'none'
				});
			}
		},
	},
async onLoad() {
  try {
    // 设置基础 URL
    this.baseUrl = getBaseUrl();
    
    // 获取用餐人数
    const number_people = wx.getStorageSync('number_of_diners');
    if (number_people) {
      this.number_people = number_people;
    }
    
    // 获取桌号
    const tableNumber = wx.getStorageSync('table_num');
    if (!tableNumber) {
      throw new Error('未获取到桌号信息');
    }
    
    // 获取商家信息
    const res = await requestUtil({
      url: `/merchant/getByTable/${tableNumber}`,
      method: "get"
    });
    
    if (res.code === 0 && res.merchant) {
      wx.setStorageSync('merchantId', res.merchant.id);
      this.merchantId = res.merchant.id;
      
      // 等待页面渲染完成后再显示弹窗
      setTimeout(() => {
        this.showUserNamePopup();
      }, 500);
    } else {
      throw new Error('获取商家信息失败');
    }
  } catch (error) {
    console.error('初始化失败：', error);
    uni.showToast({
      title: error.message || '初始化失败',
      icon: 'none',
      duration: 2000
    });
  }
},
 computed: {
   total_quantity(){
     let quantity = 0
     this.shopping_card.forEach(item=>{
       quantity += item.quantity
     })
     return quantity
   },
   total_price(){  
     let total = 0
     this.shopping_card.forEach(item=>{
       total += item.total_price
     })
     return total.toFixed(2)
   }
 }
}
</script>

<style scoped>
.top-view{
	background:linear-gradient(to bottom, #f7d45f,#f7d562,#f8d561,#f9db76, #f9de80);
	height: 120rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20rpx;
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
}
.top-view .top-image{
	display: block;
	width: 35rpx;
	height: 35rpx;
}
.top-view-flex{
	display: flex;
	align-items: center;
}
.top-search{padding-right: 50rpx;}
/* 点餐界面 */
.order-view{margin-top: 120rpx;}
.commodity {
  display: flex;
  position: fixed;
  top: 120rpx;
  left: 0;
  right: 0;
  bottom: 120rpx; /* 添加底部距离 */
}
.order-left{
	background-color: #fafafa;
	width: 150rpx;
	overflow-y: auto;
}
.itemize-text{
	font-size: 27rpx;
	padding: 30rpx 10rpx;
	display: flex;
	align-items: center;
	color: #797979;
}
.itemize-text .text-item:nth-child(1){flex: 1;}
.itemize-text .text-item:nth-child(2){
	background-color: #eb5941;
	border-radius: 50%;
	font-size: 20rpx;
	color: #FFFFFF;
	width: 30rpx;
	height: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 2rpx;
}
.scroll-Hei {
  height: calc(100vh - 240rpx); /* 减去顶部栏(120rpx)和底部栏(120rpx)的高度 */
}
/* 移除多余的下方空白 */
.order-right scroll-view {
  padding-bottom: 0;
}
.classif{
	font-size: 27rpx;
	padding: 30rpx 20rpx;
	color: #797979;
}
/* 分类商品 */
.classif-goods{
	display: flex;
	justify-content: space-between;
	padding: 0 20rpx;
	height: 150rpx;
	font-size: 30rpx;
	margin-bottom: 45rpx;
}

.goods-image .goods-img{
	display: block;
	width: 150rpx;
	height: 150rpx;
	border-radius: 10rpx;
}
.goods-Price{
	flex: 1;
	position: relative;
	padding: 0 20rpx;
}
.goods-Price .price-text{
	display: block;
}
.goods-name{
	display: flex;
	flex-direction: column;
	position: relative;
	top: 0;
}
.goods-name .name-text:nth-child(1){
	padding-bottom: 9rpx;
}
.unit-price{
	position: absolute;
	bottom: 0;
	display: flex;
	align-items: baseline;
}
.Bold{font-weight: bold;}
.Symbol{font-size: 20rpx;}
.Thinning{
	font-size: 25rpx;
	color: #cccccc;
}
.quantity .quantity-img{
	width: 50rpx;
	height: 50rpx;
}
.quantity{
	display: flex;
	align-items: center;
	align-self: flex-end;
	width: 200rpx;
	justify-content: space-between;
}
/* 确保底部栏固定在底部 */
.order-bottom {
  background-color: #fefefe;
  height: 120rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99; /* 提高层级确保显示在最上层 */
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}
.Shopping image{width: 75rpx; height: 75rpx; display: block;}
.Shopping-left{width: 75rpx; height: 75rpx;}
.Shopping{
	display: flex;
	align-items: center;
	/* height: 120rpx; */
}
.Shopping-number{
	align-self: flex-start;
	background: #eb5941;
	color: #ffff;
	width: 40rpx;
	border-radius: 50rpx;
	text-align: center;
	font-size: 20rpx;
	/* margin-top: 15rpx; */
}
.Shopping-title{
	flex: 1;
	padding: 0 25rpx;
	color: #999999;
	/* height: 120rpx;
	line-height: 120rpx; */
}
.place-order button{
	border: none;
	background:linear-gradient(to right,#f8da81,#f8d771,#f7d362,#f6cb4a);
	width: 200rpx;
	height: 75rpx;
	line-height: 75rpx;
	border-radius: 50rpx;
	font-weight: bold;
	z-index: 9;
}
/* 点击分类列表加上背景色 */
.active{
	background-color: #FFFFFF;
	color: #000000 !important;
}

/* 底部购物车样式 */
.order-bottom {
  background-color: #fefefe;
  height: 120rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}

.shopping {
  position: relative;
  width: 80rpx;
  height: 80rpx;
}

.shopping-image {
  width: 60rpx;
  height: 60rpx;
  display: block;
}

.shopping-num {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #eb5941;
  color: #ffffff;
  font-size: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

.order-price {
  flex: 1;
  padding: 0 20rpx;
  font-size: 32rpx;
}

.price-symbol {
  font-size: 24rpx;
  color: #333;
}

.price-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.order-button {
  background: linear-gradient(to right, #f8da81, #f8d771, #f7d362, #f6cb4a);
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 40rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

/* 调整商品列表区域，避免被底部购物车遮挡 */
.commodity {
  display: flex;
  position: fixed;
  top: 120rpx;
  left: 0;
  right: 0;
  bottom: 120rpx;
}

.order-right {
  flex: 1;
  overflow-y: auto;
  background-color: #FFFFFF;
  padding-bottom: 120rpx;
}

</style>
