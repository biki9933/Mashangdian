<template>
  <div class="table-container">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="showAddDialog">新增桌号</el-button>
    </div>

    <!-- 桌号列表 -->
    <el-table 
      :data="tableList" 
      border
      v-loading="loading"
      element-loading-text="加载中...">
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column prop="number" label="桌号" min-width="120"></el-table-column>
      <el-table-column label="二维码" width="120" align="center">
        <template slot-scope="scope">
          <el-image 
            v-if="scope.row.qrcode"
            :src="`${baseUrl}/image/qrcode/${scope.row.qrcode}`"
            :preview-src-list="[`${baseUrl}/image/qrcode/${scope.row.qrcode}`]"
            class="qr-code-image"
            @load="handleImageLoad"
            @error="handleImageError">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
            <div slot="placeholder" class="image-slot">
              <i class="el-icon-loading"></i>
            </div>
          </el-image>
          <el-button v-else size="mini" type="text" @click="generateQRCode(scope.row)">
            生成二维码
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'info'">
            {{scope.row.status ? '空闲' : '占用'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          {{formatDate(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button 
            type="primary" 
            size="mini" 
            icon="el-icon-edit"
            @click="showEditDialog(scope.row)">
            编辑
          </el-button>
          <el-button 
            type="success" 
            size="mini" 
            icon="el-icon-refresh"
            @click="generateQRCode(scope.row)">
            重新生成二维码
          </el-button>
          <el-button 
            type="danger" 
            size="mini" 
            icon="el-icon-delete"
            @click="deleteTable(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑桌号弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form :model="tableForm" :rules="rules" ref="tableForm" label-width="80px">
        <el-form-item label="桌号" prop="tableNumber">
          <el-input v-model="tableForm.tableNumber" placeholder="请输入桌号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BASE_URL } from '@/config'

export default {
  data() {
    return {
      loading: false,
      tableList: [],
      dialogVisible: false,
      dialogType: 'add',
      submitLoading: false,
      tableForm: {
        id: '',
        tableNumber: '',
        merchantId: ''
      },
      rules: {
        tableNumber: [
          { required: true, message: '请输入桌号', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      baseUrl: BASE_URL
    }
  },
  
  computed: {
    ...mapGetters(['currentMerchant']),
    dialogTitle() {
      return this.dialogType === 'add' ? '新增桌号' : '编辑桌号'
    }
  },
  
  created() {
    this.getTableList()
  },
  
  methods: {
    // 获取桌号列表
    async getTableList() {
      this.loading = true
      try {
        const params = {
          merchantId: this.currentMerchant.id
        }
        const res = await new this.Request('/admin/table/list').modepost(params)
        
        if (res.code === 0) {
          this.tableList = res.tableList || []
        } else {
          this.$message.error(res.msg || '获取桌号列表失败')
        }
      } catch (error) {
        console.error('获取桌号列表失败：', error)
        this.$message.error('获取桌号列表失败')
      } finally {
        this.loading = false
      }
    },
    
    // 显示新增弹窗
    showAddDialog() {
      this.dialogType = 'add'
      this.tableForm = {
        tableNumber: '',
        merchantId: this.currentMerchant.id
      }
      this.dialogVisible = true
    },
    
    // 显示编辑弹窗
    showEditDialog(table) {
      this.dialogType = 'edit'
      this.tableForm = {
        id: table.id,
        tableNumber: table.number,
        merchantId: this.currentMerchant.id
      }
      this.dialogVisible = true
    },
    
    // 提交表单
    submitForm() {
      this.$refs.tableForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            const url = this.dialogType === 'add' 
              ? this.Urls.admin.tableAdd
              : this.Urls.admin.tableUpdate
            
            const params = {
              number: this.tableForm.tableNumber,
              merchantId: this.currentMerchant.id
            }
            
            // 如果是编辑模式，添加id
            if (this.dialogType === 'edit') {
              params.id = this.tableForm.id
            }
            
            console.log('提交的数据：', params)
            
            const res = await new this.Request(url, params).modepost()
            
            if (res.code === 0) {
              this.$message.success(`${this.dialogType === 'add' ? '新增' : '编辑'}成功`)
              this.dialogVisible = false
              this.getTableList()
            } else {
              this.$message.error(res.msg || `${this.dialogType === 'add' ? '新增' : '编辑'}失败`)
            }
          } catch (error) {
            console.error('提交失败：', error)
            this.$message.error(`${this.dialogType === 'add' ? '新增' : '编辑'}失败`)
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    
    // 生成二维码
    async generateQRCode(table) {
      try {
        const params = {
          id: table.id,
          number: table.number,
          merchantId: this.currentMerchant.id
        }
        const res = await new this.Request(this.Urls.admin.tableQrcode, params).modepost()
        
        if (res.code === 0) {
          this.$message.success('二维码生成成功')
          this.getTableList()
        } else {
          this.$message.error(res.msg || '二维码生成失败')
        }
      } catch (error) {
        console.error('生成二维码失败：', error)
        this.$message.error('二维码生成失败')
      }
    },
    
    // 删除桌号
    async deleteTable(table) {
      try {
        await this.$confirm('确认删除该桌号吗？删除后无法恢复', '提示', {
          type: 'warning'
        })
        
        const res = await new this.Request(this.Urls.admin.tableDelete(table.id)).modedelete()
        
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.getTableList()
        } else {
          this.$message.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败：', error)
          this.$message.error('删除失败')
        }
      }
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return '--'
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hour = String(d.getHours()).padStart(2, '0')
      const minute = String(d.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
    
    // 图片加载成功
    handleImageLoad(e) {
      console.log('二维码加载成功:', e);
    },
    
    // 图片加载失败
    handleImageError(e) {
      console.error('二维码加载失败:', e);
    }
  }
}
</script>

<style scoped>
.table-container {
  padding: 20px;
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

.qr-code-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
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

.el-button + .el-button {
  margin-left: 10px;
}

.el-tag {
  min-width: 60px;
}
</style>
