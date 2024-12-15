<template>
	<div class="ordering">
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/dishes' }">菜品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>添加 / 编辑菜品</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="content-view-ten" v-loading="loading">
			<!-- 分类选择 -->
			<div class="image-view-title">
				<div class="image-list">菜品类目</div>
				<div>
					<el-select v-model="catevalue" placeholder="请选择菜品类目">
					    <el-option
					      v-for="item in category"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</div>
			</div>
			<!-- 菜品名称 -->
			<div class="image-view-title">
				<div class="image-list">菜品名称</div>
				<el-input v-model="name" type="text" placeholder="请输入菜品名称" :clearable="true"></el-input>
			</div>
			<div class="image-view-title">
				<div class="image-list">菜品价格(元)</div>
				<div class="upload-option">
					<el-input v-model="price" min="0" type="number" placeholder="请输入菜品价格" :clearable="true"></el-input>
					<el-select v-model="compvalue" placeholder="请选择菜品单位">
					    <el-option
					      v-for="item in company"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
					<!-- 自定义单位 -->
					<el-input v-if="compvalue == '自定义单位'" type="text" v-model="unit" placeholder="请输入自定义单位" :clearable="true"></el-input>
					<div v-if="compvalue == '自定义单位'" style="margin-right: 0 !important;"><el-button type="success" size="medium" @click="dishunit()" :loading="unitload" :disabled="unitload" style="width: 100%;padding: 12px 20px;">添加自定义单位</el-button></div>
				</div>
			</div>
			<!-- 菜品图片 -->
			<div class="image-view-title">
				<div class="image-list">菜品图片</div>
				<div>
					<el-upload
                        :headers="headers"
					    :action="action"
					    list-type="picture-card"
					    name="file"
					    accept=".jpg,.png,.webp,.jfif,.jpeg"
					    :limit="1"
					    :on-remove="bannerRemove"
					    :on-success="bannerSuccess"
					    :on-preview="handlepreview"
					    :multiple="false"
					    :on-error="onErr"
					    :before-upload="project"
					    :file-list="goodsimage"
					    >
					    <i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
					    <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</div>
			</div>
			<!-- 提交 -->
			<div class="image-button">
				<el-button type="success" size="medium" @click="bTn(but)" :loading="load" :disabled="load">{{but}}</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getServerUrl } from '@/config'

export default {
	data() {
		return {
            headers:{},
			loadmen: false,
			loading: false,
			category:[],//菜品类目
			company:[],//菜品单位
			action: this.Urls.admin.dishUpload,
			load:false,
			unitload:false,//自定义单位按钮
			catevalue:'',//选中的菜品类目
			name:'',
			price:'',
			compvalue:'',//选中的菜品单位
			goodsimage:[],//商品图片
            imageName:'',
			unit:'',//自定义的单位
			but:'上架菜品',
			dialogImageUrl: '',
			dialogVisible: false,
			pagenum:0,
			custom:false,
            onsale:true,
			id:''//该条数据的id，用于编辑
		}
	},
	computed: {
		...mapGetters(['currentMerchant'])
	},
	methods:{
        getServerUrl(){
            return getServerUrl()
        },
		// 上传图片展开大图
		handlepreview(file) {
		    this.dialogImageUrl = file.url;
		    this.dialogVisible = true;
		},
		// 上传失败
		onErr(e){
			this.loading = false
			this.$message.error('上传失败,尝试重新上传');
		},
		// 上传时
		project(file){
			this.loading = true
		},
		// 封面图移除文件时的钩子
		bannerRemove(file, fileList) {
		    this.goodsimage = []
		},
		// 上传成功：封面图
		bannerSuccess(res, file, fileList){
			this.goodsimage.push({url:this.getServerUrl()+'/image/dish/'+res.data.imageName})
            this.imageName=res.data.imageName
			this.loading = false
		},
		// 获取菜品类目和单位
		async obtaincate(){
            try {
                const params = {
                    merchantId: this.currentMerchant.id
                }
                // 只请求分类列表
                const categoryRes = await new this.Request(this.Urls.admin.categoryListAll).modeget(params)
                
                if (categoryRes.code === 0) {
                    this.category = categoryRes.categoryList.map(item => ({
                        value: item.name,
                        label: item.name,
                        id: item.id
                    }))
                } else {
                    this.$message.error('获取分类列表失败')
                }
                
                // 设置固定的单位列表
                this.company = [
                    { label: '份', value: '份' },
                    { label: '个', value: '个' },
                    { label: '盘', value: '盘' },
                    { label: '碗', value: '碗' },
                    { label: '杯', value: '杯' },
                    { label: '瓶', value: '瓶' },
                    { label: '条', value: '条' },
                    { label: '块', value: '块' },
                    { label: '只', value: '只' },
                    { label: '斤', value: '斤' },
                    { label: '自定义单位', value: '自定义单位', _id: '980', unid: '980' }
                ]
            } catch (err) {
                console.error('获取数据失败：', err)
                this.$message.error('获取数据失败')
            }
        },
		// 添加自定义单位
		async dishunit(){
			this.unitload = true
			try{
				if(!this.unit){
					this.$message.warning("请输入自定义单位")
					return
				}
				// 检查单位是否已存在
				const exists = this.company.some(item => item.value === this.unit)
				if(exists){
					this.$message.warning("该单位已存在")
					return
				}
				// 直接添加到单位列表
				this.company.unshift({ 
					label: this.unit, 
					value: this.unit 
				})
				this.$message.success("添加成功")
				this.compvalue = this.unit
				this.unit = ''
			}catch(e){
				this.$message.error('操作失败，请重试')
			}finally{
				this.unitload = false
			}
		},
		bTn(is){
			this.load = true
			let cate = this.category.filter((item,index)=>{return item.value == this.catevalue})
			let category = cate.length == 0 ? '' : cate[0].id
			const obj = {
				id:this.id,
				name:this.name,
				unitprice:this.price,
				unit:this.compvalue == '自定义单位' ? '' : this.compvalue,
                image:this.imageName,
                onsale:this.onsale,
				typeId:category,//该分类下的id
                merchantId: this.currentMerchant.id
			}
			if(is == '上架菜品'){
				this.purequest(obj,is,this.Urls.admin.dishSave)
			}else{
				// 提交修改
				this.purequest(obj,is,this.Urls.admin.dishSave)
			}
		},
		// 提交或修改公用请求
		async purequest(obj,is,url){
			try{
				const res = await new this.Request(url,obj).modepost()
				if(res.code !== 0){
					this.$message.warning(res.msg || "操作失败")
				}else{
					this.$message.success(res.msg || "操作成功")
					this.$router.push({name:'dishes'})
				}
				this.load = false
			}catch(e){
				this.load = false
				this.$message.error('服务器发生错误,请重试')
			}
		}
	},
	created() {
        this.headers = {
            Authorization: localStorage.getItem("token")
        }
        
        // 获取路由参数
        const routeParams = this.$route.params
        console.log('Route params:', routeParams)
        
        // 调用获取类目和单位的方法
        this.obtaincate()
        
        // 如果是编辑模式
        if(routeParams.item){
            const item = routeParams.item
            this.but = '修改提交'
            this.id = item.id
            this.catevalue = item.type ? item.type.name : ''  // 添加空值检查
            this.name = item.name
            this.price = item.unitprice
            this.compvalue = item.unit
            if(item.image) {
                this.goodsimage = [{
                    url: this.getServerUrl() + '/image/dish/' + item.image
                }]
                this.imageName = item.image
            }
            this.onsale = item.onsale
        }
    }
}
</script>

<style scoped="scoped">
@import url("../../../style/overall.css");
.upload-option{
	display: flex;
	align-items: center;
	justify-content: left;
}
.upload-option div{width: 25% !important; margin-right: 5px;}
.el-button--success{width: 150px;}
</style>
