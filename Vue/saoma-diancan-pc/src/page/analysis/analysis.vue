<template>
  <div class="analysis-container">
    <!-- 商户信息卡片 -->
    <el-card class="merchant-card">
      <div slot="header">
        <span>商户信息</span>
      </div>
      <div class="merchant-info">
        <p>商户名称：{{ currentMerchant.name }}</p>
        <p>商户ID：{{ currentMerchant.id }}</p>
      </div>
    </el-card>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-item">
            <div class="data-title">今日订单数</div>
            <div class="data-value">{{ statistics.todayOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-item">
            <div class="data-title">今日营业额</div>
            <div class="data-value">¥{{ statistics.todayAmount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-item">
            <div class="data-title">本月订单数</div>
            <div class="data-value">{{ statistics.monthOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="data-card">
          <div class="data-item">
            <div class="data-title">本月营业额</div>
            <div class="data-value">¥{{ statistics.monthAmount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 销售趋势图 -->
    <el-card class="chart-card">
      <div slot="header">
        <span>销售趋势</span>
        <el-radio-group v-model="timeRange" size="small" @change="getStatistics">
          <el-radio-button label="week">最近一周</el-radio-button>
          <el-radio-button label="month">最近一月</el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart-container" ref="salesChart"></div>
    </el-card>

    <!-- 热销商品排行 -->
    <el-card class="chart-card">
      <div slot="header">
        <span>热销商品排行</span>
      </div>
      <el-table :data="hotDishes" border>
        <el-table-column prop="name" label="菜品名称"></el-table-column>
        <el-table-column prop="categoryName" label="所属分类"></el-table-column>
        <el-table-column prop="salesCount" label="销量"></el-table-column>
        <el-table-column prop="salesAmount" label="销售额"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'

export default {
  data() {
    return {
      statistics: {
        todayOrders: 0,
        todayAmount: 0,
        monthOrders: 0,
        monthAmount: 0
      },
      timeRange: 'week',
      hotDishes: [],
      salesChart: null
    }
  },
  
  computed: {
    ...mapGetters(['currentMerchant'])
  },
  
  created() {
    this.getStatistics()
    this.getHotDishes()
  },
  
  mounted() {
    this.$nextTick(() => {
      this.initSalesChart()
    })
  },
  
  beforeDestroy() {
    if (this.salesChart) {
      this.salesChart.dispose()
    }
  },
  
  methods: {
    
    // 获取统计数据
async getStatistics() {
  try {
    const res = await new this.Request(
      this.Urls.admin.statistics,
      { merchantId: this.currentMerchant.id }
    ).modeget();
    
    // 检查两种可能的状态码
    if (res.code === 0 || res.icode === 0) {
      const salesData = res.salesVolumeList || [];
      
      // 计算今日和本月数据
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = today.substring(0, 7);
      
      const todayData = salesData.find(item => item.time === today) || {};
      const monthData = salesData.filter(item => item.time.startsWith(thisMonth));
      
      this.statistics = {
        todayAmount: parseFloat(todayData.salesVolume || 0),
        monthAmount: monthData.reduce((sum, item) => sum + parseFloat(item.salesVolume || 0), 0)
      };
      
      this.updateSalesChart(salesData);
    }
  } catch (error) {
    console.error('获取统计数据失败：', error);
    this.$message.error('获取统计数据失败');
  }
},
    
async getHotDishes() {
  try {
    const res = await new this.Request(
      this.Urls.admin.dishSales
    ).modeget()
    
    if (res.code === 0 || res.icode === 0) {
      this.hotDishes = (res.salesData || []).map(item => ({
        name: item.dishName,
        categoryName: item.categoryName || '',
        salesCount: item.salesCount,
        salesAmount: item.totalAmount
      }));
    }
  } catch (error) {
    console.error('获取热销商品数据失败：', error)
    this.$message.error('获取热销商品数据失败')
  }
},
    
    // 初始化销售趋势图
    initSalesChart() {
      this.salesChart = echarts.init(this.$refs.salesChart)
      this.salesChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销售额',
            type: 'line',
            data: []
          }
        ]
      })
      
      window.addEventListener('resize', this.resizeChart)
    },
    
    // 更新销售趋势图数据
    updateSalesChart(data) {
      if (!this.salesChart) return;
      
      const dates = data.map(item => item.time);
      const amounts = data.map(item => item.salesVolume);
      
      this.salesChart.setOption({
        xAxis: {
          data: dates
        },
        series: [
          {
            data: amounts
          }
        ]
      });
    },
    
    // 图表自适应
    resizeChart() {
      if (this.salesChart) {
        this.salesChart.resize()
      }
    }
  }
}
</script>

<style scoped>
.merchant-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.merchant-info p {
  margin: 12px 0;
  font-size: 14px;
  color: #606266;
}

.data-overview {
  margin: 24px 0;
}

.data-card {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.data-card:hover {
  transform: translateY(-2px);
}

.data-item {
  padding: 20px;
  text-align: center;
}

.data-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.data-value {
  font-size: 24px;
  font-weight: 600;
  color: #409EFF;
}

.chart-card {
  margin-top: 24px;
  border-radius: 8px;
}

.chart-container {
  height: 400px;
  margin-top: 12px;
}
</style>