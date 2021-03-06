import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: window.urlData.url, // api的base_url
  timeout: 15000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */

    const res = response.data
    if ((response.request.responseURL.endsWith('/dashbord'))) {
      return response.data.data
    }
    if (res.code !== 200) {
      Message({
        message: res.data,
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject('网络错误')
    } else {
      return response.data
    }
  },
  error => {
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    //  50014:Token 过期了;50015,长的
    if (error.response.data.code === 50014) {
      store.dispatch('getReferToken').then(() => {
        window.location.reload()
      }).catch()
    } else if (error.response.data.code === 50015) {
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
        Message({
          message: '账号过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
      })
    }
    return Promise.reject(error.response.data.message)
  }
)

export default service
