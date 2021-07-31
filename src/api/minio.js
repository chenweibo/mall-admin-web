import request from '@/utils/request'
export function upload(data) {
  return request({
    url: '/minio/upload',
    method: 'POST',
    data: data
  })
}
