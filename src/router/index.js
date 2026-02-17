import { createRouter, createWebHistory } from 'vue-router'
// 导入两个模块的根组件（每个模块的 App.vue）
import AdminApp from '@/admin/App.vue'
import IcaApp from '@/insurance_company_application/App.vue'

// 导入模块的路由配置数组
import adminRoutes from '@/admin/adminRouter.js'
import icaRoutes from '@/insurance_company_application/icaRouter.js'

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
})


export default router