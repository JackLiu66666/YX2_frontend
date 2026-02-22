<template>
  <div class="agent-index">
    <div class="header">
      <h1 style="color: #1989fa;">院小二 - 代理商管理系统</h1>
      <div class="user-info">
        欢迎：{{ agentInfo.username }} 
              <!-- 审核状态标签 -->
      <el-tag 
        :type="statusTagType" 
        size="small" 
        style="margin-left: 8px; margin-right: 8px;"
      >
        {{ statusText }}
      </el-tag>
        <el-button type="text" @click="handleLogout">退出登录</el-button>
      </div>
    </div>
    <div class="content">
      <el-card shadow="hover">
        <h2>欢迎进入代理商界面</h2>
        <p>该界面待开发，后续可扩展代理商的核心功能（如订单管理、数据统计等）</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import request from '../../utils/request'

const router = useRouter()
const agentInfo = ref({})

// 初始化：获取本地存储的用户信息
onMounted(() => {
  const info = localStorage.getItem('loginAgency')
  if (info) {
    agentInfo.value = JSON.parse(info)
  } else {
    // 没有登录信息，跳转到登录页，并携带当前路径以便登录后返回
    router.push({
      path: 'login',
      query: { redirect: router.currentRoute.value.fullPath }
    })
  }
})

// 计算属性：标签类型
// 计算属性：显示文字
const statusTagType = computed(() => {
  const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
  return map[agentInfo.value?.auditStatus] ?? 'info'
})

const statusText = computed(() => {
  const map = { 0: '未审核', 1: '待审核', 2: '通过', 3: '不通过' }
  return map[agentInfo.value?.auditStatus] ?? '未知'
})

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    // 调用后端退出接口
    await request.get('/agency/logout')
    // 清除本地存储
    localStorage.removeItem('loginAgency')
    ElMessage.success('退出登录成功')
    // 跳登录页
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
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  color: #666;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.el-card {
  background-color: #fff;
  padding: 20px;
}
</style>