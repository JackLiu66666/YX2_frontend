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
        style="margin-left: 8px; margin-right: 8px; cursor: pointer;"
        @click="handleStatusClick"
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

// 审核状态与路由的映射关系
const statusRouteMap = {
  0: 'audit-application',      // 0：代理商审核申请页面
  1: 'audit-status',           // 1：代理商审核申请状态页面
  2: 'audit-pass-materials',   // 2：代理商审核通过的原始资料页
  3: 'audit-fail-reason'       // 3：查看失败原因页
}

// 计算属性：标签类型
// 计算属性：显示文字
const statusTagType = computed(() => {
  const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
  return map[agentInfo.value?.auditStatus] ?? 'info'
})

const statusText = computed(() => {
  const map = { 0: '未审核', 1: '待审核', 2: '审核通过', 3: '审核不通过' }
  return map[agentInfo.value?.auditStatus] ?? '未知'
})

// 点击状态标签的处理函数（核心逻辑）
const handleStatusClick = () => {
  // 获取当前用户的审核状态
  const currentStatus = agentInfo.value?.auditStatus;
  if (currentStatus === undefined || currentStatus === null) {
    ElMessage.error('用户审核状态未获取，请重新登录');
    router.push('login');
    return;
  }

  // 权限校验：用户只能访问与自己当前审核状态匹配的页面
  const targetRoute = statusRouteMap[currentStatus];
  
  // 如果用户尝试访问的不是自己权限内的页面（这里是点击标签时自动匹配，所以主要防手动输入路由）
  // 补充：如果需要防手动访问，可在路由守卫中再校验，这里先做点击时的校验
  if (targetRoute) {
    router.push(targetRoute).catch(err => {
      if (err.name !== 'NavigationDuplicated') {
        ElMessage.error('页面跳转失败');
        console.error('路由跳转错误：', err);
      }
    });
  } else {
    ElMessage.warning('暂无对应页面权限，请联系管理员');
    // 重定向到首页（或默认页面）
    router.push('index');
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