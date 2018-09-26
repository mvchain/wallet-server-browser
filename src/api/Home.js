import request from '@/utils/request'

export function companyList(data) {
  return request({
    url: '/dashbord/shop?' + data,
    method: 'get'
  })
}
export function createCompany(data) {
  return request({
    url: '/dashbord/shop?',
    method: 'post',
    data
  })
}
