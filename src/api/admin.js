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

