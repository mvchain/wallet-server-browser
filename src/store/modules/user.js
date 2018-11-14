import { login, refreshToken } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    // 登录
    Login({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        login(payload).then(res => {
          const permission = {
            adminType: res.adminType,
            permissionList: res.permissionList
          }
          state.avatar = payload.username
          window.localStorage.setItem('user', JSON.stringify({ refreshToken: res.refreshToken, username: payload.username }))
          window.localStorage.setItem('permission', JSON.stringify(permission))
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        window.localStorage.clear()
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        window.sessionStorage.clear()
        removeToken()
        resolve()
      })
    },
    getReferToken: () => {
      const rToken = JSON.parse(window.localStorage.getItem('user')).refreshToken
      setToken(rToken)
      return new Promise((resolve, reject) => {
        refreshToken().then(res => {
          setToken(res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
