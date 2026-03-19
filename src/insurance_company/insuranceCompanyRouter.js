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
    component: Login,
    meta: { title: '保险公司登录' }
  },
  {
    path: 'register',
    name: 'InsuranceCompanyRegister',
    component: Register,
    meta: { title: '保险公司注册' }
  },
  {
    path: 'index',
    name: 'InsuranceCompanyIndex',
    component: InsuranceCompanyIndex,
    meta: { requiresAuth: true, title: '保险公司首页' } // 标记需要登录的路由
  },
  {
    path: 'audit-application',
    name: 'InsuranceCompanyAuditApplication',
    component: InsuranceCompanyAuditApplication,
    meta: {title: '保险公司审核申请' }
    //meta: { requiresAuth: true, requiredStatus: 0 } // 需要审核状态为0
  },
  {
    path: 'audit-status',
    name: 'InsuranceCompanyAuditStatus',
    component: InsuranceCompanyAuditStatus,
    meta: { title: '保险公司审核状态' }
    //meta: { requiresAuth: true, requiredStatus: 1 } // 需要审核状态为1
  },
  {
    path: 'audit-pass-materials',
    name: 'InsuranceCompanyAuditPassMaterials',
    component: InsuranceCompanyAuditPassMaterials,
    meta: { title: '保险公司审核通过材料' }
    //meta: { requiresAuth: true, requiredStatus: 2 } // 需要审核状态为2
  },
  {
    path: 'audit-fail-reason',
    name: 'InsuranceCompanyAuditFailReason',
    component: InsuranceCompanyAuditFailReason,
    meta: { title: '保险公司审核失败原因' }
    //meta: { requiresAuth: true, requiredStatus: 3 } // 需要审核状态为3
  }
]



export default insuranceCompanyRoutes