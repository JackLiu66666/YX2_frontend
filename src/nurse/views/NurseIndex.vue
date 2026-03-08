<template>
  <div class="nurse-index">
    <div class="header">
      <h1>院小二 - 护士工作台</h1>
      <div class="user-info">
        欢迎：{{ nurseInfo?.username || '加载中...' }}
        <el-tag 
          :type="statusTagType" 
          size="small" 
          style="margin-left: 8px; margin-right: 8px; cursor: pointer;"
          :class="{ 'is-disabled': loading }"
          @click="!loading && handleStatusClick()"
        >
          {{ loading ? '加载中' : statusText }}
        </el-tag>
        <el-button type="text" @click="handleLogout" size="small">退出登录</el-button>
      </div>
    </div>
    <div class="content">
      <el-card shadow="hover">
        <h2>护士工作台</h2>
        <p>这里是护士的主要工作界面，可以查看任务、患者信息、排班等。</p>
        <div class="feature-grid">
          <div class="feature-item">
            <i class="el-icon-s-order"></i>
            <span>我的任务</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-user"></i>
            <span>患者管理</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-date"></i>
            <span>排班查看</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-document"></i>
            <span>工作记录</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../../utils/request'

const router = useRouter()
const nurseInfo = ref({})
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await request.get('/nurse/index')
    if (response.code === 200) {
      nurseInfo.value = response.data.nurse 
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
})

// 计算属性：标签类型
const statusTagType = computed(() => {
  const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
  return map[nurseInfo.value?.auditStatus] ?? 'info'
})

const statusText = computed(() => {
  const map = { 0: '未审核', 1: '待审核', 2: '审核通过', 3: '审核不通过' }
  return map[nurseInfo.value?.auditStatus] ?? '未知'
})

// 点击状态标签的处理函数
const handleStatusClick = () => {
  if (loading.value) {
    ElMessage.info('正在加载用户信息，请稍后...')
    return
  }
  const currentStatus = nurseInfo.value?.auditStatus
  if (currentStatus === undefined || currentStatus === null) {
    ElMessage.error('用户审核状态未获取，请重新登录')
    router.push('login')
    return
  }
  // 根据状态跳转对应页面
  const routeMap = {
    0: 'NurseAuditApplication',
    1: 'NurseAuditStatus',
    2: 'NurseIndex',
    3: 'NurseAuditFailReason'
  }
  const targetRoute = routeMap[currentStatus]
  if (targetRoute) {
    router.push({ name: targetRoute })
  } else {
    ElMessage.warning('未知状态，无法跳转')
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    // 调用后端退出接口
    await request.get('/nurse/logout')
    // 清除本地存储
    localStorage.removeItem('loginNurse')
    ElMessage.success('退出登录成功')
    // 跳登录页
    router.push('login')
  } catch (error) {
    ElMessage.info('已取消退出')
  }
}
</script>

<style scoped>
.nurse-index {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px;
  box-sizing: border-box;
}

.header {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header h1 {
  font-size: 22px;
  color: #667eea;
  font-weight: 600;
  text-align: center;
  margin: 0;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.content {
  max-width: 100%;
}

.el-card {
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.el-card h2 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 18px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: #f8f9ff;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #eef0ff;
  transform: translateY(-2px);
}

.feature-item i {
  font-size: 24px;
  color: #667eea;
  margin-bottom: 8px;
}

.feature-item span {
  font-size: 14px;
  color: #333;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .nurse-index {
    padding: 10px;
  }
  
  .header h1 {
    font-size: 20px;
  }
  
  .user-info {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .el-card {
    padding: 15px;
  }
  
  .el-card h2 {
    font-size: 16px;
  }
  
  .feature-grid {
    gap: 12px;
  }
  
  .feature-item {
    padding: 12px;
  }
  
  .feature-item i {
    font-size: 20px;
  }
  
  .feature-item span {
    font-size: 13px;
  }
}
</style>