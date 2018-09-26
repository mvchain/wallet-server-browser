import { adminList, createAdmin, deleteAdmin, modifyAdmin } from '@/api/admin'

const center = {
  state: {
    adminList: {}
  },

  mutations: {
    SET_ADMIN_LIST: (state, adminList) => {
      state.adminList = adminList
    }
  },

  actions: {
    getAdminList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        adminList(payload).then(res => {
          commit('SET_ADMIN_LIST', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    postCreateList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        createAdmin(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putCreateList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        modifyAdmin(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    deleteAdminList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        deleteAdmin(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default center
