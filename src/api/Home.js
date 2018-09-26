import request from '@/utils/request'

export function projectList(data) {
  return request({
    url: '/project?' + data,
    method: 'get'
  })
}
