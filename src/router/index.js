import { createRouter, createWebHistory } from 'vue-router'
// 导入两个模块的根组件（每个模块的 App.vue）
import AdminApp from '@/admin/App.vue'
import IcaApp from '@/insurance_company_application/App.vue'
import AgencyApp from '@/agency/App.vue'

// 导入模块的路由配置数组
import adminRoutes from '@/admin/adminRouter.js'
import icaRoutes from '@/insurance_company_application/icaRouter.js'
import agencyRoutes from '@/agency/agencyRouter.js'

import { ElMessage } from 'element-plus'
// 构建主路由
const routes = [
  {
    path: '/admin',
    component: AdminApp,
    children: adminRoutes   // 直接使用，因为路径已经是相对路径
  },
  {
    path: '/ica',
    component: IcaApp,
    children: icaRoutes     // 直接使用
  },
  {
    path: '/agency',
    component: AgencyApp,
    children: agencyRoutes
  },
  {
    path: '/',
    redirect: '/admin/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' | 院小二管理系统'
  }

  const loginAgentStr = localStorage.getItem('loginAgency')
  const isLoggedIn = !!loginAgentStr

  // 登录校验
  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.warning('请先登录')
    next('/agency/login')
    return
  }

  // 审核状态权限校验（仅在已登录时）
  if (isLoggedIn && to.meta.requiredStatus !== undefined) {
    const agentInfo = JSON.parse(loginAgentStr)
    const userStatus = agentInfo.auditStatus

    // 如果 requiredStatus 是数组，检查是否包含；否则直接比较
    const required = to.meta.requiredStatus
    const hasPermission = Array.isArray(required) 
      ? required.includes(userStatus) 
      : userStatus === required

    if (!hasPermission) {
      // 定义状态到路由名称的映射（建议使用命名路由）
      const routeNameMap = {
        0: 'AgencyAuditApplication',
        1: 'AgencyAuditStatus',
        2: 'AgencyAuditPassMaterials',
        3: 'AgencyAuditFailReason'
      }
      const targetRouteName = routeNameMap[userStatus]
      if (targetRouteName) {
        ElMessage.warning('无权限访问该页面，已为您跳转到对应状态页面')
        next({ name: targetRouteName })
      } else {
        // 如果找不到对应路由，跳转到首页（假设首页路由名为 AgencyIndex）
        next({ name: 'AgencyIndex' })
      }
      return
    }
  }

  next()
})


export default router