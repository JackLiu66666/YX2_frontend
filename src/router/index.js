import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../admin/views/LoginPage.vue'
import HomePage from '../admin/views/HomePage.vue'
import AuditPage from '../admin/views/AuditPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'   // 默认跳转到登录页
  },
  {
    path: '/login',
    name: 'Login Page',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home Page',
    component: HomePage
  },
  {
    path: '/audit',
    name: 'Audit Page',
    component: AuditPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router