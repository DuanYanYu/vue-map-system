import request from '@/utils/request'

// 获取地质灾害饼图数据
export function getGeologicalHazard() {
  return request({
    url: '/echarts/getGeologicalHazard',
    method: 'get',
  })
}

// 获取严重程度饼图数据
export function getGeologicalSeverity() {
  return request({
    url: '/echarts/getGeologicalSeverity',
    method: 'get',
  })
}


// 获取统计信息
export function getGeologicalHazardStatistics() {
  return request({
    url: '/echarts/getGeologicalHazardStatistics',
    method: 'get',
  })
}

// 每年度类别统计
export function getGeologicalHazardEveryYearType() {
  return request({
    url: '/echarts/getGeologicalHazardEveryYearType',
    method: 'get',
  })
}