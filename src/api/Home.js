import request from '@/utils/request'

export function companyList(data) {
  return request({
    url: '/dashbord/shop?' + data,
    method: 'get'
  })
}
export function createCompany(data) {
  return request({
    url: '/dashbord/shop',
    method: 'post',
    data
  })
}
export function modifyCompany(data) {
  return request({
    url: '/dashbord/shop',
    method: 'put',
    data
  })
}
export function rwAjax(data) {
  return request({
    url: '/dashbord/transaction?' + data,
    method: 'get'
  })
}
export function addressAjax(data) {
  return request({
    url: '/dashbord/account?' + data,
    method: 'get'
  })
}
export function addressInfo(data) {
  return request({
    url: '/dashbord/account/count?tokenType=' + data,
    method: 'get'
  })
}
export function withdrawAjax(data) {
  return request({
    url: '/dashbord/withdraw',
    method: 'post',
    data
  })
}
// 导出签名
export function importSign(data) {
  return request({
    url: '/dashbord/export/sign',
    method: 'get'
  })
}
export function statisticsData(data) {
  return request({
    url: '/dashbord/transaction/count?' + data,
    method: 'get'
  })
}
