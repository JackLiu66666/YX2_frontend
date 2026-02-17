// 保险公司申请模块独立路由
//import { createRouter, createWebHistory } from 'vue-router'

import Register from './views/login/Register.vue'
import ApplyForm from './views/apply/ApplyForm.vue'
import ApplyQuery from './views/apply/ApplyQuery.vue'

//const ApplyList = () => import('./views/admin/ApplyList.vue')

// 模块路由配置（添加ica前缀避免与admin冲突）
const icaRoutes = [
  {
    path: 'register',
    name: 'ICARegister',
    component: Register,
    meta: { title: '保险公司账号注册' }
  },
  {
    path: 'apply/form',
    name: 'ICAApplyForm',
    component: ApplyForm,
    meta: { title: '保险公司合作申请' }
  },
  {
    path: 'apply/query',
    name: 'ICAApplyQuery',
    component: ApplyQuery,
    meta: { title: '申请记录查询' }
  }
  // {
  //   path: '/ica/admin/apply/list',
  //   name: 'ICAApplyList',
  //   component: ApplyList,
  //   meta: { title: '保险公司申请管理' }
  // }
]


// 导出路由配置数组（核心）
export default icaRoutes