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
			const arr = {image,name,unitprice,quantity:QU,unit,total_price:unitprice * QU,id,cid,good_index}
			this.shopping_Cart(arr)
		},
		
		// 单个商品-
		reduce(index,good_index,cid,itemgood){
			const {quantity,image,name,unitprice,unit,id} = itemgood
			const QU = quantity - 1
			this.$set(this.goods[index].dishList[good_index],'quantity',QU)
			const arr = {image,name,unitprice,quantity:QU,unit,total_price:unitprice * QU,id,cid,good_index}
			this.shopping_Cart(arr)
		},
		
		// 添加进物车的商品
		shopping_Cart(arr){
			// 一：购物车没有数据，空数组：
				// 直接添加进数据
			// 二：购物车里有据
				// 1.没有相同的菜品在
				// 2.有相同的菜品存在
			if(this.shopping_card.length == 0){
				// 一：购物车没有数据，空数组：
				this.shopping_card.push(arr)
			}else{
				// 二：购物车里有数据
				let itemindex = this.shopping_card.findIndex(item => item.id == arr.id)
				if(itemindex == -1){
					// 没有相同的菜品存在
					this.shopping_card.unshift(arr)
				}else{
					this.$set(this.shopping_card[itemindex],'quantity',arr.quantity)
					this.$set(this.shopping_card[itemindex],'total_price',arr.total_price)
				}
			}
			console.log(this.shopping_card)
			this.qunint_of_goods()
		},
		
		// 计算左边各分类下添加了多少菜品
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
		shopping_Cart_add_sub(index,QU,id,cid,good_index,unitprice){
			this.$set(this.shopping_card[index],'quantity',QU)
			this.$set(this.shopping_card[index],'total_price',QU * unitprice)
			// 根据id唯一标识查询商品的数量做到商品加减同步
			const itemcid = this.goods.findIndex(item=> item.cid == cid)
			this.$set(this.goods[itemcid].dishList[good_index],'quantity',QU)
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
						
						// 计算右侧商��高度
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
			wx.showLoading({title: '正在下单',mask:true})
			// 1.过滤掉总价为0的购物车里的菜品;filter:过滤
			let res = this.shopping_card.filter(item => item.total_price != 0)
			// 2.计算总价
			let sett_amount = 0
			res.forEach(item => {sett_amount += item.total_price})
			// 取出本地缓存的桌号和用餐人数
			let table_number = wx.getStorageSync('table_num')
			let number_of_diners = wx.getStorageSync('number_of_diners')
			
			let order = {
				table_number,//桌号
				number_of_diners,//用餐人数
				// order_time:this.$Time().utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),
				sett_amount,
				order_no:Code(),
				transac_status:'unsettled',//结账状态
				order_receiving:'mis_orders',//接单状态
				goods_list:res
			}
			const res2=await requestUtil({url:"/order/create",data:order,method:"post"})
			if(res2.code==0){
				wx.redirectTo({
				  url: '/pages/order-details/details'
				})
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
				console.log('开始验证用户名:', val);
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

</style>
