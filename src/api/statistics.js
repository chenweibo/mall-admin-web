import request from '@/utils/request'
export function getStatistics() {
  return request({
    url: '/statistics/index',
    method: 'get'
  })
}
