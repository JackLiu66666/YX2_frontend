//import { ElMessage} from 'element-plus'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import AgentIndex from './views/AgentIndex.vue'

const agencyRoutes = [
  {
    path: '',
    redirect: 'agency/login'
  },
  {
    path: 'login',
    name: 'Login',
    component: Login
  },
  {
    path: 'register',
    name: 'Register',
    component: Register
  },
  {
    path: 'index',
    name: 'AgencyIndex',
    component: AgentIndex,
    meta: { requiresAuth: true } // 标记需要登录的路由
  }
]



export default agencyRoutes