<template>
  <div class="agent-index">
    <!-- 顶部栏 -->
    <div class="header">
      <h1 class="system-title">院小二 - 代理商管理系统</h1>
      <div class="user-info">
        <span class="welcome-text">欢迎：{{ agentInfo?.username || '加载中...' }}</span>
        <el-tag 
          :type="statusTagType" 
          size="small" 
          class="status-tag"
          :class="{ 'is-disabled': loading }"
          @click="!loading && handleStatusClick()"
        >
          {{ loading ? '加载中' : statusText }}
        </el-tag>
        <el-button type="text" class="logout-btn" @click="handleLogout">退出登录</el-button>
      </div>
    </div>
    
    <!-- 主体内容区 -->
    <div class="main-container">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="side-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="business">
            <el-icon><Briefcase /></el-icon>
            <span>业务模块</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><List /></el-icon>
            <span>订单记录</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <!-- 右侧内容区 -->
      <div class="content-area">
        <component :is="currentComponent" />
      </div>
      
      <!-- 锁定遮罩层 -->
      <div v-if="isLocked" class="lock-overlay">
        <div class="lock-content">
          <el-icon class="lock-icon"><Lock /></el-icon>
          <div class="lock-text">该功能暂不可用</div>
          <div class="lock-subtext">请等待审核通过后使用</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Briefcase, List, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import request from '../../utils/request'

const router = useRouter()
const agentInfo = ref({})
const loading = ref(true)
const activeMenu = ref('business')
const auditStatus = ref(null) // 审核状态
const isLocked = ref(false) // 是否锁定

// 空组件占位
const BusinessModule = { template: '<div style="padding: 20px;"><h2>业务模块</h2><p>该模块待开发...</p></div>' }
const OrderRecords = { template: '<div style="padding: 20px;"><h2>订单记录</h2><p>该模块待开发...</p></div>' }

const componentMap = {
  business: markRaw(BusinessModule),
  orders: markRaw(OrderRecords)
}

const currentComponent = computed(() => componentMap[activeMenu.value])

// 获取审核状态
const fetchAuditStatus = async () => {
  try {
    const response = await request.get('/agency/getAgencyauditStatus')
    if (response.code === 200) {
      auditStatus.value = response.data
      // 只有状态为 2（通过）才不锁定
      isLocked.value = response.data !== 2
    } else {
      ElMessage.error('获取审核状态失败')
      isLocked.value = true
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试')
    isLocked.value = true
    if (error.response?.status === 401) {
      router.push('login')
    }
  }
}

onMounted(async () => {
  // 先获取用户信息
  try {
    const response = await request.get('/agency/index')
    if (response.code === 200) {
      agentInfo.value = response.data.agency 
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试')
    if (error.response?.status === 401) {
      router.push('login')
    }
  } finally {
    loading.value = false
  }
  
  // 获取审核状态并控制锁定
  await fetchAuditStatus()
})

const statusTagType = computed(() => {
  const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
  return map[auditStatus.value] ?? 'info'
})

const statusText = computed(() => {
  const map = { 0: '未审核', 1: '待审核', 2: '审核通过', 3: '审核不通过' }
  return map[auditStatus.value] ?? '未知'
})

const handleStatusClick = () => {
  if (loading.value) {
    ElMessage.info('正在加载用户信息，请稍后...')
    return
  }
  const currentStatus = auditStatus.value
  if (currentStatus === undefined || currentStatus === null) {
    ElMessage.error('用户审核状态未获取，请重新登录')
    router.push('login')
    return
  }
  const routeMap = {
    0: 'AgencyAuditApplication',
    1: 'AgencyAuditStatus',
    2: 'AgencyAuditPassMaterials',
    3: 'AgencyAuditFailReason'
  }
  const targetRoute = routeMap[currentStatus]
  if (targetRoute) {
    router.push({ name: targetRoute })
  } else {
    ElMessage.warning('未知状态，无法跳转')
  }
}

const handleMenuSelect = (index) => {
  activeMenu.value = index
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await request.get('/agency/logout')
    localStorage.removeItem('loginAgency')
    ElMessage.success('退出登录成功')
    router.push('login')
  } catch (error) {
    ElMessage.info('已取消退出')
  }
}
</script>

<style scoped>
.agent-index {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.header {
  height: 80px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.system-title {
  font-size: 26px;
  font-weight: bold;
  color: #409EFF;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  color: #606266;
  margin-right: 16px;
  font-size: 16px;
  line-height: 1;
}

.status-tag {
  cursor: pointer;
  margin-top: 0;
  transform: scale(1.1);
}

.status-tag.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.logout-btn {
  margin-left: 8px;
  font-size: 15px;
  padding: 8px 12px;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.sidebar {
  width: 220px;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.side-menu {
  height: 100%;
  border-right: none;
}

.side-menu:not(.el-menu--horizontal) .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.side-menu:not(.el-menu--horizontal) .el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
}

.content-area h2 {
  margin-top: 0;
  color: #303133;
}

.content-area p {
  color: #909399;
}

/* 锁定遮罩层样式 */
.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lock-content {
  text-align: center;
}
.lock-icon {
  font-size: 80px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.lock-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #606266;
}

.lock-subtext {
  font-size: 14px;
  color: #909399;
}
</style>