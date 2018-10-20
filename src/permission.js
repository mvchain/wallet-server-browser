import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import store from './store'
const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    store.dispatch('getManagePermission', '').then((res) => {
      let permission = window.localStorage.getItem('permission')
      let p = []
      if (permission) {
        permission = JSON.parse(permission)
      }
      permission.permissionList = res.list
      res.list.map((item) => {
        p.push(item.permissionId)
      })
      store.dispatch('getPermissionStr', p.toString())
    }).catch()
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
