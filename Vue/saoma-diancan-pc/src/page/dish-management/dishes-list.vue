<template>
	<div class="dishes-container">
		<!-- 顶部统计卡片 -->
		<el-row :gutter="20" class="stat-cards">
			<el-col :span="8">
				<el-card shadow="hover">
					<div slot="header">
						<span>在售菜品</span>
					</div>
					<div class="stat-number">{{getOnSaleCount}}</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<div slot="header">
						<span>总销量</span>
					</div>
					<div class="stat-number">{{getTotalSales}}</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<div slot="header">
						<span>菜品总数</span>
					</div>
					<div class="stat-number">{{total}}</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 操作栏 -->
		<div class="operation-bar">
			<div class="left">
				<el-button type="primary" icon="el-icon-plus" @click="$router.push('/upload')">新增菜品</el-button>
				<el-button type="warning" icon="el-icon-refresh" @click="getDishesList">刷新列表</el-button>
			</div>
			<div class="right">
			</div>
		</div>

		<!-- 菜品列表 -->
		<el-table 
			:data="dishesList" 
			border
			v-loading="loading"
			element-loading-text="加载中..."
			class="dish-table">
			<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
			<el-table-column label="菜品图片" width="120" align="center">
				<template slot-scope="scope">
					<el-image 
						:src="`${baseUrl}/image/dish/${scope.row.image}`"
						:preview-src-list="[`${baseUrl}/image/dish/${scope.row.image}`]"
						class="dish-image"
						fit="cover">
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="菜品名称" min-width="120">
				<template slot-scope="scope">
					<div class="dish-name">
						<span>{{scope.row.name}}</span>
						<el-tag size="mini" type="info" v-if="scope.row.type">{{scope.row.type.name}}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="价格信息" width="150" align="center">
				<template slot-scope="scope">
					<div class="price-info">
						<div class="price">¥{{scope.row.unitprice}}</div>
						<div class="unit">/ {{scope.row.unit}}</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="销售信息" width="150" align="center">
				<template slot-scope="scope">
					<div class="sales-info">
						<div class="monthly-sales">月销 {{scope.row.monthlysale}}</div>
						<div class="stock">库存 {{scope.row.quantity}}</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="状态" width="100" align="center">
				<template slot-scope="scope">
					<el-switch
						v-model="scope.row.onsale"
						active-color="#13ce66"
						inactive-color="#ff4949"
						:active-text="scope.row.onsale ? '在售' : ''"
						:inactive-text="!scope.row.onsale ? '停售' : ''"
						@change="handleStatusChange(scope.row)">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template slot-scope="scope">
					<el-button 
						type="primary" 
						size="mini" 
						icon="el-icon-edit"
						@click="editDish(scope.row)">
						编辑
					</el-button>
					<el-button 
						type="danger" 
						size="mini" 
						icon="el-icon-delete"
						@click="deleteDish(scope.row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BASE_URL } from '@/config'

export default {
	data() {
		return {
			loading: false,
			dishesList: [],
			baseUrl: BASE_URL
		}
	},
	
	computed: {
		...mapGetters(['currentMerchant']),
		getOnSaleCount() {
			return this.dishesList.filter(dish => dish.onsale).length
		},
		getTotalSales() {
			return this.dishesList.reduce((sum, dish) => sum + dish.monthlysale, 0)
		}
	},
	
	created() {
		this.getDishesList()
	},
	
	methods: {
		// 获取菜品列表
		async getDishesList() {
			this.loading = true
			try {
				const params = {
					merchantId: this.currentMerchant.id
				}
				const res = await new this.Request('/admin/dish/list').modepost(params)
				
				if (res.code === 0) {
					this.dishesList = res.dishList || []
				} else {
					this.$message.error(res.msg || '获取菜品列表失败')
				}
			} catch (error) {
				console.error('获取菜品列表失败：', error)
				this.$message.error('获取菜品列表失败')
			} finally {
				this.loading = false
			}
		},
		
		// 修改菜品状态
		async handleStatusChange(dish) {
			try {
				const params = {
					id: dish.id,
					onsale: dish.onsale,
					merchantId: this.currentMerchant.id
				}
				const res = await new this.Request('/admin/dish/updateOnSale', params).modepost()
				
				if (res.code === 0) {
					this.$message.success('状态修改成功')
				} else {
					dish.onsale = !dish.onsale // 恢复状态
					this.$message.error(res.msg || '状态修改失败')
				}
			} catch (error) {
				dish.onsale = !dish.onsale // 恢复状态
				this.$message.error('状态修改失败')
			}
		},
		
		// 编辑菜品
		editDish(dish) {
			this.$router.push({
				name: 'upload',
				params: { item: dish }
			})
		},
		
		// 删除菜品
		async deleteDish(dish) {
			try {
				console.log('Deleting dish:', dish);
				await this.$confirm(`确认删除菜品"${dish.name}"吗？`, '提示', {
					type: 'warning'
				})
				
				const res = await new this.Request(
					this.Urls.admin.dishDelete(dish.id)
				).modedelete()
				
				if (res.code === 0) {
					this.$message.success('删除成功')
					this.getDishesList()
				} else {
					this.$message.error(res.msg || '删除失败')
				}
			} catch (error) {
				if (error !== 'cancel') {
					console.error('Delete error:', error);
					this.$message.error('删除失败')
				}
			}
		}
	}
}
</script>

<style scoped>
.dishes-container {
	padding: 20px;
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

.operation-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	background: #f5f7fa;
	padding: 15px;
	border-radius: 4px;
}

.search-input {
	width: 300px;
}

.dish-table {
	margin-bottom: 20px;
}

.dish-image {
	width: 60px;
	height: 60px;
	border-radius: 4px;
}

.image-slot {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: #f5f7fa;
	color: #909399;
	font-size: 20px;
}

.dish-name {
	display: flex;
	align-items: center;
	gap: 8px;
}

.price-info {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.price {
	font-size: 16px;
	font-weight: bold;
	color: #f56c6c;
}

.unit {
	font-size: 12px;
	color: #909399;
}

.sales-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
}

.monthly-sales {
	color: #67c23a;
}

.stock {
	color: #909399;
	font-size: 12px;
}

.el-button + .el-button {
	margin-left: 10px;
}

.el-switch {
	margin: 0 8px;
}
</style>
