<template>
  <div class="audit-container">
    <!-- 顶部返回按钮 -->
    <div class="header">
      <h2 class="page-title">代理商申请列表</h2>
    </div>

    <!-- 列表卡片 -->
    <el-card class="audit-card">
      <!-- 列表表格 -->
      <el-table 
        v-loading="loading" 
        :data="applyList" 
        border 
        stripe 
        style="width: 100%"
        :header-cell-style="{background: '#e8f4fc', color: '#1989fa'}"
        @row-click="handleRowClick"
      >
        <el-table-column 
          prop="id" 
          label="申请 ID" 
          align="center" 
          width="120"
        />
        <el-table-column 
          prop="agencyFullName" 
          label="代理商全称" 
          align="center" 
          min-width="300"
        />
        <el-table-column 
          label="审核状态" 
          align="center" 
          width="180"
        >
          <template #default="scope">
            <el-tag 
              :type="getStatusTagType(scope.row.auditStatus)" 
              size="medium"
            >
              {{ getStatusText(scope.row.auditStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          align="center" 
          width="150"
          fixed="right"
        >
          <template #default="scope">
            <el-button 
              type="primary" 
              link
              @click.stop="viewDetail(scope.row.id)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

// 响应式数据
const loading = ref(false) // 加载状态
const currentPage = ref(1) // 当前页
const pageSize = ref(20)    // 每页条数
const total = ref(0)       // 总条数
const applyList = ref([])  // 申请列表数据


// 查看详细信息
const viewDetail = (id) => {
  router.push(`/admin/agencyApplicationReview/${id}`)
}

// 行点击事件
const handleRowClick = (row) => {
  viewDetail(row.id)
}

// 审核状态标签类型映射
const getStatusTagType = (status) => {
  const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
  return map[status] ?? 'info'
}

// 审核状态文本映射
const getStatusText = (status) => {
  const map = { 0: '未审核', 1: '待审核', 2: '审核通过', 3: '审核不通过' }
  return map[status] ?? '未知'
}

// 获取申请列表数据
const getApplyList = async () => {
  loading.value = true
  try {
    const res = await request.get('/admin/agencyApplicationReview/list', {
      params: {
        current: currentPage.value,
        size: pageSize.value
      },
      // 携带 cookie（兼容 session 登录态）
      withCredentials: true
    })
    if (res.code === 200) {
      applyList.value = res.data.records
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取列表失败')
    }
  } catch (error) {
    ElMessage.error('网络异常，获取列表失败')
    console.error('获取申请列表失败：', error)
  } finally {
    loading.value = false;
  }
}

// 每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getApplyList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getApplyList()
}

// 页面挂载时加载数据
onMounted(() => {
  getApplyList()
})
</script>

<style scoped>
/* 整体容器 */
.audit-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
  box-sizing: border-box;
}

/* 顶部栏 */
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* 返回按钮 */
.back-btn {
  margin-right: 20px;
  background-color: #1989fa;
  border: none;
}

/* 页面标题 */
.page-title {
  color: #1989fa;
  font-weight: 600;
  margin: 0;
}

/* 列表卡片 */
.audit-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  border: 1px solid #e8f4fc;
}

/* 列表表格行样式 */
:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 分页组件 */
.pagination {
  margin-top: 20px;
  text-align: right;
}

/* 适配 Element Plus 分页组件的蓝白风栺 */
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #1989fa;
}
:deep(.el-pagination.is-background .el-pager li:hover) {
  color: #1989fa;
}
</style>