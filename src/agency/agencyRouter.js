//import { ElMessage} from 'element-plus'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import AgentIndex from './views/AgentIndex.vue'
import AgencyAuditApplication from './views/auditApplication/AgencyAuditApplication.vue'
import AgencyAuditStatus from './views/auditApplication/AgencyAuditStatus.vue'
import AgencyAuditPassMaterials from './views/auditApplication/AgencyAuditPassMaterials.vue'
import AgencyAuditFailReason from './views/auditApplication/AgencyAuditFailReason.vue'

const agencyRoutes = [
  {
    path: '',
    redirect: 'agency/login'
  },
  {
    path: 'login',
    name: 'AgencyLogin',
    component: Login
  },
  {
    path: 'register',
    name: 'AgencyRegister',
    component: Register
  },
  {
    path: 'index',
    name: 'AgencyIndex',
    component: AgentIndex,
    meta: { requiresAuth: true } // 标记需要登录的路由
  },
  {
    path: 'audit-application',
    name: 'AgencyAuditApplication',
    component: AgencyAuditApplication,
    meta: { requiresAuth: true, requiredStatus: 0 } // 需要审核状态为0
  },
  {
    path: 'audit-status',
    name: 'AgencyAuditStatus',
    component: AgencyAuditStatus,
    meta: { requiresAuth: true, requiredStatus: 1 } // 需要审核状态为1
  },
  {
    path: 'audit-pass-materials',
    name: 'AgencyAuditPassMaterials',
    component: AgencyAuditPassMaterials,
    meta: { requiresAuth: true, requiredStatus: 2 } // 需要审核状态为2
  },
  {
    path: 'audit-fail-reason',
    name: 'AgencyAuditFailReason',
    component: AgencyAuditFailReason,
    meta: { requiresAuth: true, requiredStatus: 3 } // 需要审核状态为3
  }
]



export default agencyRoutes