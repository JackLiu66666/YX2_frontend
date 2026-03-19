//import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import HomePage from './views/HomePage.vue'
import AgencyAuditPage from './views/AgencyAuditPage.vue'
import InsuranceCompanyAuditPage from './views/InsuranceCompanyAuditPage.vue'
import AgencyApplicationReview from './views/ApplicationReview/AgencyApplicationReview.vue'

const adminRoutes = [
  {
    path: 'login',
    name: 'Login Page',
    component: LoginPage,
    meta: { title: '管理员登录' }
  },
  {
    path: 'home',
    name: 'Home Page',
    component: HomePage,
    meta: { title: '管理员首页' }
  },
  {
    path: 'agencyAudit',
    name: 'Agency Audit Page',
    component: AgencyAuditPage,
    meta: { title: '代理商审核' }
  },
  {
    path: 'insuranceCompanyAudit',
    name: 'Insurance Company Audit Page',
    component: InsuranceCompanyAuditPage,
    meta: { title: '保险公司审核' }
  },
  {
    path: 'agencyApplicationReview/:id',
    name: 'Agency Application Review',
    component: AgencyApplicationReview,
    meta: { title: '代理商申请审核' },
    props: true
  }
]


export default adminRoutes