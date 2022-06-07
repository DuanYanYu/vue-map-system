import request from '@/utils/request'
// 所有坐标点
export function getAllPoints() {
  return request({
    url: '/map/getAllPoints',
    method: 'get'
  })
}