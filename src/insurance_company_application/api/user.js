// 引入全局request工具（复用）
import request from '../../utils/request'

// 保险公司账号相关接口（模块独立封装）
export function registerUser(data) {
  return request({
    url: '/insurance/register',
    method: 'post',
    data
  })
}