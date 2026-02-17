//import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import HomePage from './views/HomePage.vue'
import AuditPage from './views/AuditPage.vue'

const adminRoutes = [
  // {
  //   path: '/',
  //   redirect: '/login'   // 默认跳转到登录页
  // },
  {
    path: 'login',
    name: 'Login Page',
    component: LoginPage
  },
  {
    path: 'home',
    name: 'Home Page',
    component: HomePage
  },
  {
    path: 'audit',
    name: 'Audit Page',
    component: AuditPage
  }
]


export default adminRoutes