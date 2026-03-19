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
    component: Login,
    meta: { title: '代理商登录'}
  },
  {
    path: 'register',
    name: 'AgencyRegister',
    component: Register,
    meta: { title: '代理商注册'}
  },
  {
    path: 'index',
    name: 'AgencyIndex',
    component: AgentIndex,
    meta: { requiresAuth: true, title: '代理商首页' } // 标记需要登录的路由
  },
  {
    path: 'audit-application',
    name: 'AgencyAuditApplication',
    component: AgencyAuditApplication,
    meta: { requiresAuth: true, requiredStatus: 0, title: '代理商审核申请' } // 需要审核状态为0
  },
  {
    path: 'audit-status',
    name: 'AgencyAuditStatus',
    component: AgencyAuditStatus,
    meta: { requiresAuth: true, requiredStatus: 1,  title: '代理商审核状态' } // 需要审核状态为1
  },
  {
    path: 'audit-pass-materials',
    name: 'AgencyAuditPassMaterials',
    component: AgencyAuditPassMaterials,
    meta: { requiresAuth: true, requiredStatus: 2, title: '代理商审核通过材料' } // 需要审核状态为2
  },
  {
    path: 'audit-fail-reason',
    name: 'AgencyAuditFailReason',
    component: AgencyAuditFailReason,
    meta: { requiresAuth: true, requiredStatus: 3, title: '代理商审核失败原因' } // 需要审核状态为3
  }
]



export default agencyRoutes