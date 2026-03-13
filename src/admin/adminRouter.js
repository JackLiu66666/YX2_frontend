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
  },
  {
    path: 'agencyApplicationReview/:id',
    name: 'Agency Application Review',
    component: AgencyApplicationReview,
    props: true
  }
]


export default adminRoutes