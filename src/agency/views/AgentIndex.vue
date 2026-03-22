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
    <div v-if="pageLoaded" class="main-container">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="side-menu"
          @select="handleMenuSelect"
        >
          <el-sub-menu index="business">
            <template #title>
              <el-icon><Briefcase /></el-icon>
              <span>业务模块</span>
            </template>
            <el-menu-item 
              v-for="module in businessModules" 
              :key="module.index"
              :index="module.index"
              :disabled="!module.enabled"
            >
              {{ module.name }}
              <span v-if="!module.enabled" class="module-not-enabled">未开通</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="orders">
            <el-icon><List /></el-icon>
            <span>订单记录</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <!-- 右侧内容区 -->
      <div class="content-area">
        <component :is="currentComponent" :module-name="currentModuleName" />
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
    
    <!-- 页面加载中提示 -->
    <div v-else class="loading-container">
      <div class="loading-content">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <div class="loading-text">页面加载中...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, markRaw, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Briefcase, List, Lock, Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import request from '../../utils/request'
import CommonBusinessList from './business/CommonBusinessList.vue'

const router = useRouter()
const agentInfo = ref({})
const loading = ref(true)
const pageLoaded = ref(false) // 页面是否加载完成
const activeMenu = ref('hospital-accompaniment-diagnosis')
const auditStatus = ref(null) // 审核状态
const isLocked = ref(false) // 是否锁定
const currentModuleName = ref('院陪诊')
const businessModules = ref([]) // 业务范围模块列表

// 空组件占位
const OrderRecords = { template: '<div style="padding: 20px;"><h2>订单记录</h2><p>该模块待开发...</p></div>' }

const componentMap = {
  'hospital-accompaniment-diagnosis': markRaw(CommonBusinessList),
  'hospital-accompaniment-care': markRaw(CommonBusinessList),
  'hospital-office': markRaw(CommonBusinessList),
  'hospital-insurance': markRaw(CommonBusinessList),
  'hospital-advance': markRaw(CommonBusinessList),
  'hospital-visit': markRaw(CommonBusinessList),
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

// 获取业务范围
const fetchBusinessScope = async () => {
  try {
    const response = await request.get('/agency/getAgencyBusinessScope')
    if (response.code === 200) {
      // 解析返回的业务范围代码数组
      const scopeCodes = JSON.parse(response.data)
      
      // 定义所有可用的业务模块
      const allModules = [
        { index: 'hospital-accompaniment-diagnosis', name: '院陪诊', code: '1' },
        { index: 'hospital-accompaniment-care', name: '院陪护', code: '2' },
        { index: 'hospital-office', name: '院办办', code: '3' },
        { index: 'hospital-insurance', name: '院保保', code: '4' },
        { index: 'hospital-advance', name: '院垫垫', code: '5' },
        { index: 'hospital-visit', name: '院探探', code: '6' }
      ]
      
      // 根据返回的代码标记模块是否可用
      businessModules.value = allModules.map(module => ({
        ...module,
        enabled: scopeCodes.includes(module.code)
      }))
      
      // 如果当前激活的模块不可用，切换到第一个可用的模块
      const currentModule = businessModules.value.find(m => m.index === activeMenu.value)
      if (!currentModule?.enabled) {
        const firstEnabledModule = businessModules.value.find(m => m.enabled)
        if (firstEnabledModule) {
          activeMenu.value = firstEnabledModule.index
          currentModuleName.value = firstEnabledModule.name
        }
      }
    } else {
      ElMessage.error('获取业务范围失败')
      // 如果接口失败，默认全部禁用
      setAllModulesDisabled()
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试')
    setAllModulesDisabled()
    if (error.response?.status === 401) {
      router.push('login')
    }
  }
}

// 设置所有模块为禁用状态
const setAllModulesDisabled = () => {
  const allModules = [
    { index: 'hospital-accompaniment-diagnosis', name: '院陪诊', enabled: false },
    { index: 'hospital-accompaniment-care', name: '院陪护', enabled: false },
    { index: 'hospital-office', name: '院办办', enabled: false },
    { index: 'hospital-insurance', name: '院保保', enabled: false },
    { index: 'hospital-advance', name: '院垫垫', enabled: false },
    { index: 'hospital-visit', name: '院探探', enabled: false }
  ]
  businessModules.value = allModules
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
  
  // 只有审核通过（状态为 2）才获取业务范围
  if (auditStatus.value === 2) {
    await fetchBusinessScope()
  } else {
    // 审核未通过时，禁用所有业务模块
    setAllModulesDisabled()
  }
  
  // 两个函数都执行完成后，显示页面
  pageLoaded.value = true
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
  
  // 状态 0 和 2 跳转到对应页面
  if (currentStatus === 0 || currentStatus === 2) {
    const routeMap = {
      0: 'AgencyAuditApplication',
      2: 'AgencyAuditPassMaterials'
    }
    const targetRoute = routeMap[currentStatus]
    if (targetRoute) {
      router.push({ name: targetRoute })
    } else {
      ElMessage.warning('未知状态，无法跳转')
    }
  } 
  // 状态 1：审核中，弹窗提示
  else if (currentStatus === 1) {
    ElMessageBox.alert(
      '您的申请正在审核中，请耐心等待审核结果。审核通过后您将收到通知，感谢您的配合！',
      '审核提示',
      {
        confirmButtonText: '我知道了',
        type: 'info'
      }
    )
  }
  // 状态 3：审核不通过，弹窗提示
  else if (currentStatus === 3) {
    ElMessageBox.alert(
      '很抱歉，您的申请审核未通过。请查看失败原因并重新提交申请，如有疑问请联系客服。',
      '审核结果通知',
      {
        confirmButtonText: '我知道了',
        type: 'warning'
      }
    )
  }
  // 其他未知状态
  else {
    ElMessage.warning('未知状态，无法处理')
  }
}

const handleMenuSelect = (index) => {
  // 只有启用的菜单才能切换
  const selectedModule = businessModules.value.find(m => m.index === index)
  if (selectedModule && selectedModule.enabled) {
    nextTick(() => {
      activeMenu.value = index
      currentModuleName.value = getModuleName(index)
    })
  } else {
    ElMessage.warning('该模块暂未开通')
  }
}

// 获取模块名称映射
const getModuleName = (index) => {
  const map = {
    'hospital-accompaniment-diagnosis': '院陪诊',
    'hospital-accompaniment-care': '院陪护',
    'hospital-office': '院办办',
    'hospital-insurance': '院保保',
    'hospital-advance': '院垫垫',
    'hospital-visit': '院探探',
    'orders': '订单记录'
  }
  return map[index] || '业务模块'
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

// 初始化模块名称
currentModuleName.value = getModuleName(activeMenu.value)
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
  overflow-y: auto;
  overflow-x: hidden;
}

.side-menu:not(.el-menu--horizontal) .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.side-menu:not(.el-menu--horizontal) .el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409EFF;
}

/* 业务范围模块未开通标签样式 */
.side-menu .el-menu-item {
  position: relative;
}

.module-not-enabled {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 3px 8px;
  border-radius: 4px;
  line-height: 1.2;
  font-weight: 500;
  border: 1px solid #ffa39e;
  box-shadow: 0 2px 4px rgba(255, 77, 79, 0.2);
  animation: pulse-light 2s infinite;
}

@keyframes pulse-light {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.side-menu .el-menu-item.is-disabled {
  color: #777777;
  cursor: not-allowed;
  background-color: #fafafa;
}

.side-menu .el-menu-item.is-disabled:hover {
  background-color: #f5f5f5;
}

.side-menu .el-menu-item.is-disabled .module-not-enabled {
  color: #ff4d4f;
  background-color: #fff1f0;
  border-color: #ff7875;
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

/* 页面加载中容器 */
.loading-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.loading-content {
  text-align: center;
}

.loading-icon {
  font-size: 64px;
  color: #409EFF;
  animation: rotating 2s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: #909399;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
