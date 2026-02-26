//import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import HomePage from './views/HomePage.vue'
import AgencyAuditPage from './views/AgencyAuditPage.vue'
import InsuranceCompanyAuditPage from './views/InsuranceCompanyAuditPage.vue'

const adminRoutes = [
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
    path: 'agencyAudit',
    name: 'Agency Audit Page',
    component: AgencyAuditPage
  },
  {
    path: 'insuranceCompanyAudit',
    name: 'Insurance Company Audit Page',
    component: InsuranceCompanyAuditPage
  }
]


export default adminRoutes