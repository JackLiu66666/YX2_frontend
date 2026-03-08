import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NurseIndex from './views/NurseIndex.vue'
import AuditApplication from './views/AuditApplication.vue'
import AuditStatus from './views/AuditStatus.vue'
import AuditPassMaterials from './views/AuditPassMaterials.vue'
import AuditFailReason from './views/AuditFailReason.vue'

const nurseRoutes = [
  {
    path: '',
    redirect: 'nurse/login'
  },
  {
    path: 'login',
    name: 'NurseLogin',
    component: Login
  },
  {
    path: 'register',
    name: 'NurseRegister',
    component: Register
  },
  {
    path: 'index',
    name: 'NurseIndex',
    component: NurseIndex,
    meta: { requiresAuth: true }
  },
  {
    path: 'audit-application',
    name: 'NurseAuditApplication',
    component: AuditApplication
  },
  {
    path: 'audit-status',
    name: 'NurseAuditStatus',
    component: AuditStatus
  },
  {
    path: 'audit-pass-materials',
    name: 'NurseAuditPassMaterials',
    component: AuditPassMaterials
  },
  {
    path: 'audit-fail-reason',
    name: 'NurseAuditFailReason',
    component: AuditFailReason
  }
]

export default nurseRoutes