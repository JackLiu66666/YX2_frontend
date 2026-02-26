import Login from './views/Login.vue'
import Register from './views/Register.vue'
import InsuranceCompanyIndex from './views/InsuranceCompanyIndex.vue'
import InsuranceCompanyAuditApplication from './views/auditApplication/InsuranceCompanyAuditApplication.vue'
import InsuranceCompanyAuditStatus from './views/auditApplication/InsuranceCompanyAuditStatus.vue'
import InsuranceCompanyAuditPassMaterials from './views/auditApplication/InsuranceCompanyAuditPassMaterials.vue'
import InsuranceCompanyAuditFailReason from './views/auditApplication/InsuranceCompanyAuditFailReason.vue'

const insuranceCompanyRoutes = [
  {
    path: '',
    redirect: 'insurance_company/login'
  },
  {
    path: 'login',
    name: 'InsuranceCompanyLogin',
    component: Login
  },
  {
    path: 'register',
    name: 'InsuranceCompanyRegister',
    component: Register
  },
  {
    path: 'index',
    name: 'InsuranceCompanyIndex',
    component: InsuranceCompanyIndex,
    meta: { requiresAuth: true } // 标记需要登录的路由
  },
  {
    path: 'audit-application',
    name: 'InsuranceCompanyAuditApplication',
    component: InsuranceCompanyAuditApplication,
    //meta: { requiresAuth: true, requiredStatus: 0 } // 需要审核状态为0
  },
  {
    path: 'audit-status',
    name: 'InsuranceCompanyAuditStatus',
    component: InsuranceCompanyAuditStatus,
    //meta: { requiresAuth: true, requiredStatus: 1 } // 需要审核状态为1
  },
  {
    path: 'audit-pass-materials',
    name: 'InsuranceCompanyAuditPassMaterials',
    component: InsuranceCompanyAuditPassMaterials,
    //meta: { requiresAuth: true, requiredStatus: 2 } // 需要审核状态为2
  },
  {
    path: 'audit-fail-reason',
    name: 'InsuranceCompanyAuditFailReason',
    component: InsuranceCompanyAuditFailReason,
    //meta: { requiresAuth: true, requiredStatus: 3 } // 需要审核状态为3
  }
]



export default insuranceCompanyRoutes