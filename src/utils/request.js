import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
  withCredentials: false
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    if (error.response?.status === 401) {
      ElMessage.warning('登录已过期，请重新登录')
      // 跳转到登录页面
      const currentPath = window.location.pathname
      if (currentPath.includes('/admin/')) {
        window.location.href = '/admin/login'
      } else if (currentPath.includes('/agency/')) {
        window.location.href = '/agency/login'
      } else if (currentPath.includes('/insurance_company/')) {
        window.location.href = '/insurance_company/login'
      } else if (currentPath.includes('/nurse/')) {
        window.location.href = '/nurse/login'
      } else {
        window.location.href = '/admin/login'
      }
    } else {
      ElMessage.error(error.message || '服务器错误')
    }
    return Promise.reject(error)
  }
)

export default service