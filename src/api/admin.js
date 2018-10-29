import request from '@/utils/request'

export function adminList(data) {
  return request({
    url: '/dashbord/admin?' + data,
    method: 'get'
  })
}
export function createAdmin(data) {
  return request({
    url: '/dashbord/admin',
    method: 'post',
    data
  })
}
export function modifyAdmin(data) {
  return request({
    url: '/dashbord/admin',
    method: 'put',
    data
  })
}
export function deleteAdmin(data) {
  return request({
    url: `/dashbord/admin/${data.id}?adminPassword=${data.pwd}`,
    method: 'delete'
  })
}
export function managePermission(data) {
  return request({
    url: '/dashbord/account/permission?userId=' + data,
    method: 'get'
  })
}

export function fee(data) {
  return request({
    url: '/dashbord/fee',
    method: 'get'
  })
}

export function putFee(data) {
  return request({
    url: '/dashbord/fee',
    method: 'put',
    data
  })
}

export function Ajaxreserve() {
  return request({
    url: '/dashbord/fee/limit',
    method: 'get'
  })
}

export function setReserve(data) {
  return request({
    url: '/dashbord/fee/limit?limitFee=' + data,
    method: 'put'
  })
}

export function totalBalance(data) {
  return request({
    url: '/dashbord/total?' + data,
    method: 'get'
  })
}
export function putStatus(data) {
  return request({
    url: `/dashbord/transaction/${data.id}/${data.status}`,
    method: 'put'
  })
}
export function multipleAgree(data) {
  return request({
    url: `/dashbord/agree?ids=${data}`,
    method: 'put'
  })
}
export function collect() {
  return request({
    url: '/dashbord/collect/total',
    method: 'get'
  })
}
export function allCollect(data) {
  return request({
    url: `/dashbord/collect?${data}`,
    method: 'get'
  })
}
export function withdrawManage(data) {
  return request({
    url: `/dashbord/balance?type=${data}`,
    method: 'get'
  })
}
export function rechargeAddress(data) {
  return request({
    url: `/dashbord/shop/wallet?shopId=${data}`,
    method: 'get'
  })
}
