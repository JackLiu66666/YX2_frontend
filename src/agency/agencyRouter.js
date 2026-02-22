
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
    component: AgentIndex
  }
]


export default agencyRoutes