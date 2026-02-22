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
  next()
    // 判断是否需要登录
  if (to.meta.requiresAuth) {
    // 从localStorage获取用户信息（仅前端校验，后端仍有拦截）
    const loginAgent = localStorage.getItem('loginAgency')
    if (loginAgent) {
      next() // 已登录，放行
    } else {
      ElMessage.warning('请先登录')
      next('login') // 未登录，跳登录页
    }
  } else {
    next() // 无需登录，放行
  }
})


export default router