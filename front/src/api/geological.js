import request from '@/utils/request'
// 获取地质灾害信息分页
export function getGeological(data) {
  return request({
    url: '/geological/get',
    method: 'post',
    params:data
  })
}

// 保存地质灾害信息
export function saveGeological(data) {
  return request({
    url: '/geological/save',
    method: 'post',
    params:data
  })
}

// 根据id查询地质灾害信息
export function getGeologicalById(data) {
  return request({
    url: '/geological/getById',
    method: 'post',
    params:data
  })
}

// 根据id更新地质灾害信息
export function updateGeologicalById(data) {
  return request({
    url: '/geological/update',
    method: 'post',
    params:data
  })
}

// 删除地质灾害信息
export function deleteGeologicalById(data) {
  return request({
    url: '/geological/delete',
    method: 'post',
    params:data
  })
}