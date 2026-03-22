<template>
  <div class="common-business-list">
    <div class="page-header">
      <h2 class="page-title">{{ moduleName }}</h2>
    </div>

    <el-card class="table-card">
      <el-table 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="patientName" label="病人姓名" min-width="120" align="center" />
        <el-table-column prop="patientPhone" label="病人电话" min-width="140" align="center" />
        <el-table-column prop="hospital" label="关联医院" min-width="200" align="center" />
        <el-table-column prop="department" label="科室" min-width="120" align="center" />
        <el-table-column prop="status" label="订单状态" min-width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link 
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空数据提示 -->
      <el-empty v-if="tableData.length === 0" description="暂无数据" :image-size="80" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 接收模块名称
const props = defineProps({
  moduleName: {
    type: String,
    default: '业务模块',
    required: true
  }
})

const emit = defineEmits(['view-detail'])

// 表格数据
const tableData = ref([])

// 订单状态标签类型映射
const getStatusTagType = (status) => {
  const map = {
    0: 'warning',    // 待处理
    1: 'primary',    // 进行中
    2: 'success',    // 已完成
    3: 'info'        // 已取消
  }
  return map[status] ?? 'info'
}

// 订单状态文本映射
const getStatusText = (status) => {
  const map = {
    0: '待处理',
    1: '进行中',
    2: '已完成',
    3: '已取消'
  }
  return map[status] ?? '未知'
}

// 查看详情
const handleViewDetail = (row) => {
  ElMessage.info('查看功能待开发')
  emit('view-detail', row)
}

onMounted(() => {
  // 模拟加载数据（实际使用时可从接口获取）
  // 这里故意留空，显示"暂无数据"状态
  console.log(`加载 ${props.moduleName} 模块数据`)
})
</script>

<style scoped>
.common-business-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.el-table) {
  flex: 1;
}

:deep(.el-empty) {
  padding: 40px 0;
}

/* 适配移动端 */
@media screen and (max-width: 768px) {
  .page-title {
    font-size: 18px;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
  
  :deep(.el-table th) {
    padding: 8px 0;
  }
  
  :deep(.el-table td) {
    padding: 8px 0;
  }
}
</style>