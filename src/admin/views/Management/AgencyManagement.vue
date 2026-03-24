<template>
  <div class="agency-management-page">
    <div class="content-container">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchForm.phone"
          placeholder="请输入手机号"
          clearable
          style="width: 250px;"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>

      <!-- 表格列表 -->
      <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="代理商名称" min-width="150" />
        <el-table-column prop="phone" label="手机号" min-width="150" />
        <el-table-column prop="auditStatusText" label="审核状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getAuditStatusType(row.auditStatus)">
              {{ row.auditStatusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  phone: ''
})

// 分页配置
const pagination = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 0
})

// 表格数据
const tableData = ref([])

// 加载状态
const loading = ref(false)

// 获取审核状态标签类型
const getAuditStatusType = (status) => {
  switch (status) {
    case 0:
      return 'info' // 未审核
    case 1:
      return 'warning' // 待审核
    case 2:
      return 'success' // 审核通过
    case 3:
      return 'danger' // 审核不通过
    default:
      return 'info'
  }
}

// 查询代理商列表
const fetchAgencyList = async () => {
  loading.value = true
  try {
    // 判断是否有搜索条件
    const hasSearchPhone = searchForm.phone && searchForm.phone.trim() !== ''
    
    let res
    if (hasSearchPhone) {
      // 使用手机号搜索接口
      res = await request({
        url: '/admin/agencyManagement/phone',
        method: 'get',
        params: {
          phone: searchForm.phone.trim(),
          pageNum: pagination.pageNum,
          pageSize: pagination.pageSize
        }
      })
    } else {
      // 使用查询所有接口
      res = await request({
        url: '/admin/agencyManagement/list',
        method: 'get',
        params: {
          pageNum: pagination.pageNum,
          pageSize: pagination.pageSize
        }
      })
    }
    
    if (res.code === 200) {
      tableData.value = res.data.records
      pagination.total = res.data.total
      pagination.pageSize = res.data.size
      pagination.pageNum = res.data.current
    }
  } catch (error) {
    console.error('查询失败:', error)
    ElMessage.error('查询代理商列表失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  fetchAgencyList()
}

// 重置
const handleReset = () => {
  // 只清空手机号字段
  searchForm.phone = ''
  pagination.pageNum = 1
  fetchAgencyList()
}

// 每页条数变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  fetchAgencyList()
}

// 页码变化
const handleCurrentChange = (page) => {
  pagination.pageNum = page
  fetchAgencyList()
}

// 查看详情
const handleViewDetail = (row) => {
  ElMessage.info(`查看代理商详情：${row.username}`)
  // TODO: 跳转到详情页或打开对话框
}

// 初始化加载
onMounted(() => {
  fetchAgencyList()
})
</script>

<style scoped>
.agency-management-page {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.content-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
