import request from '../../utils/request'

// 提交申请
export function submitApply(data) {
  return request({
    url: '/application/submit',
    method: 'post',
    data
  })
}

// 上传文件
export function uploadFile(applyId, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: `/application/upload/${applyId}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 根据ID查询申请
export function getApplyById(applyId) {
  return request({
    url: `/application/${applyId}`,
    method: 'get'
  })
}

// 管理员查询申请列表
export function getApplyList(params) {
  return request({
    url: '/application/admin/list',
    method: 'get',
    params
  })
}

// 审核申请
export function auditApply(applyId, data) {
  return request({
    url: `/application/admin/audit/${applyId}`,
    method: 'put',
    params: data
  })
}

// 删除申请
export function deleteApply(applyId) {
  return request({
    url: `/application/admin/delete/${applyId}`,
    method: 'delete'
  })
}