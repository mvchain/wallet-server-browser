import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_production')
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },
  {
    path: '/AdministratorSettings',
    component: Layout,
    redirect: '/AdministratorSettings/Setting',

    name: 'AdministratorSettings',
    meta: { title: '设置', icon: 'teacher', adminType: '0/2' },
    children: [
      {
        path: 'Setting',
        name: 'Setting',
        component: _import('AdministratorSettings/index'),
        meta: { title: '管理员设置', icon: 'teacher' }
      }
    ]
  },
  {
    path: '/company',
    component: Layout,
    redirect: '/company/companyManage',
    name: 'company',
    meta: { title: '商家', icon: 'wallet', adminType: '0/1' },
    children: [
      {
        path: 'companyManage',
        name: 'companyManage',
        component: _import('company/companyManage'),
        meta: { title: '商家管理', icon: 'wallet' }
      },
      {
        path: 'companyWithdraw',
        name: 'companyWithdraw',
        component: _import('company/companyWithdraw'),
        meta: { title: '商家提现', icon: 'wallet' }
      }
    ]
  },

  {
    path: '/rechargeWithdraw',
    component: Layout,
    redirect: '/rechargeWithdraw/recharge',
    name: 'rechargeWithdraw',
    meta: { title: '充提管理', icon: 'dragstore', adminType: '0/1/2/3' },
    children: [
      {
        path: 'recharge',
        name: 'recharge',
        component: _import('rechargeWithdraw/recharge'),
        meta: { title: '充值记录', icon: 'dragstore' }
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        component: _import('rechargeWithdraw/withdraw'),
        meta: { title: '提币记录', icon: 'dragstore' }
      }
    ]
  },
  {
    path: '/dataStatistics',
    component: Layout,
    redirect: '/dataStatistics/rechargeData',
    name: 'dataStatistics',
    meta: { title: '数据统计', icon: 'list', adminType: '0/1/2/3' },
    children: [
      {
        path: 'rechargeData',
        name: 'rechargeData',
        component: _import('dataStatistics/rechargeData'),
        meta: { title: '充值数据', icon: 'list' }
      },
      {
        path: 'withdrawData',
        name: 'withdrawData',
        component: _import('dataStatistics/withdrawData'),
        meta: { title: '提币数据', icon: 'list' }
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    redirect: '/apply/applyWithdraw',
    name: 'apply',
    meta: { title: '申请', icon: 'form', adminType: '2/3' },
    children: [
      {
        path: 'applyWithdraw',
        name: 'applyWithdraw',
        component: _import('apply/index'),
        meta: { title: '申请提现', icon: 'form' }
      }
    ]
  },
  {
    path: '/address',
    component: Layout,
    redirect: '/address/setAddr',
    name: 'address',
    meta: { title: '地址', icon: 'teacher', adminType: '0/1' },
    children: [
      {
        path: 'setAddr',
        name: 'setAddr',
        component: _import('address/index'),
        meta: { title: '地址管理', icon: 'teacher' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

