<template>
  <div class="page-container">
    <div class="page-title">菜品类目管理</div>
    
    <div class="content-container">
      <!-- 操作栏 -->
      <div class="operation-bar">
        <div class="left">
          <el-button type="primary" @click="showAddDialog" icon="el-icon-plus">新增分类</el-button>
        </div>
        <div class="right">
          <!-- 如果需要添加搜索或其他功能可以放在这里 -->
        </div>
      </div>

      <!-- 分类列表 -->
      <el-table 
        :data="categoryList" 
        border 
        v-loading="loading"
        element-loading-text="加载中..."
        class="category-table">
        <el-table-column prop="name" label="分类名称" min-width="150"></el-table-column>
        <el-table-column prop="value" label="分类值" min-width="120"></el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center"></el-table-column>
        <el-table-column prop="count" label="菜品数量" width="100" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button 
              type="text" 
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button 
              type="text" 
              icon="el-icon-delete"
              class="delete-btn"
              @click="deleteCategory(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑分类弹窗 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible" 
      width="500px"
      :close-on-click-modal="false"
      @close="resetForm">
      <el-form 
        :model="categoryForm" 
        :rules="rules" 
        ref="categoryForm" 
        label-width="100px"
        class="category-form">
        <el-form-item label="分类名称" prop="name">
          <el-input 
            v-model="categoryForm.name" 
            placeholder="请输入分类名称"
            maxlength="20"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="分类值" prop="value">
          <el-input 
            v-model="categoryForm.value" 
            placeholder="请输入分类值"
            maxlength="20">
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number 
            v-model="categoryForm.sort" 
            :min="0" 
            :max="99"
            controls-position="right">
          </el-input-number>
          <div class="form-tip">数值越小越靠前</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button 
          type="primary" 
          @click="submitForm" 
          :loading="submitLoading">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      categoryList: [],
      dialogVisible: false,
      dialogType: 'add',
      submitLoading: false,
      categoryForm: {
        name: '',
        value: '',
        sort: 0,
        count: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入分类值', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ]
      }
    }
  },
  
  computed: {
    ...mapGetters(['currentMerchant']),
    dialogTitle() {
      return this.dialogType === 'add' ? '新增分类' : '编辑分类'
    }
  },
  
  created() {
    this.getCategoryList()
  },
  
  methods: {
    async getCategoryList() {
      this.loading = true
      try {
        const params = {
          merchantId: this.currentMerchant.id
        }
        
        const res = await new this.Request('/admin/category/list').modepost(params)
        
        if (res.code === 0) {
          this.categoryList = res.categoryList.map(item => ({
            id: item.id,
            merchantId: item.merchantId,
            name: item.name,
            value: item.value,
            sort: item.sort || 0,
            count: item.count || 0,
            cid: item.cid || ''
          }))
        } else {
          this.$message.error(res.msg || '获取分类列表失败')
        }
      } catch (error) {
        console.error('获取分类列表失败：', error)
        this.$message.error('获取分类列表失败')
      } finally {
        this.loading = false
      }
    },
    
    showAddDialog() {
      this.dialogType = 'add'
      this.categoryForm = {
        name: '',
        value: '',
        sort: 0,
        count: 0,
        merchantId: this.currentMerchant.id
      }
      this.dialogVisible = true
    },
    
    showEditDialog(category) {
      this.dialogType = 'edit'
      this.categoryForm = {
        id: category.id,
        merchantId: category.merchantId,
        name: category.name,
        value: category.value,
        sort: category.sort || 0,
        count: category.count || 0
      }
      this.dialogVisible = true
    },

    resetForm() {
  if (this.$refs.categoryForm) {
    this.$refs.categoryForm.resetFields();
  }
},
    
    submitForm() {
      this.$refs.categoryForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            const url = this.dialogType === 'add' 
              ? this.Urls.admin.categoryAdd
              : this.Urls.admin.categoryUpdate
            
            const data = {
              ...this.categoryForm
            }
            
            const res = await new this.Request(url, data).modepost()
            
            if (res.code === 0) {
              this.$message.success(`${this.dialogType === 'add' ? '新增' : '编辑'}成功`)
              this.dialogVisible = false
              this.getCategoryList()
            } else {
              this.$message.error(res.msg || `${this.dialogType === 'add' ? '新增' : '编辑'}失败`)
            }
          } catch (error) {
            console.error('提交分类失败：', error)
            this.$message.error(`${this.dialogType === 'add' ? '新增' : '编辑'}失败`)
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    
    async deleteCategory(category) {
      try {
        await this.$confirm(`确认删除分类"${category.name}"吗？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        
        const res = await new this.Request(
          this.Urls.admin.categoryDelete(category.id)
        ).modedelete()
        
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.getCategoryList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除分类失败：', error)
          this.$message.error('删除失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.content-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-table {
  margin-bottom: 20px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.delete-btn {
  color: #F56C6C;
  margin-left: 10px;
}

.delete-btn:hover {
  color: #ff4d4f;
}

.el-dialog__body {
  padding: 20px 40px;
}
</style>