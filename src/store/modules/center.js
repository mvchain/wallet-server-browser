import { adminList, createAdmin, deleteAdmin, modifyAdmin } from '@/api/admin'
import { companyList, createCompany } from '@/api/Home'
const center = {
  state: {
    adminList: {},
    companyList: {}
  },

  mutations: {
    SET_ADMIN_LIST: (state, payload) => {
      state.adminList = payload
    },
    SET_COMPANY_LIST: (state, payload) => {
      state.companyList = payload
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
    },
    getCompanyList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        companyList(payload).then(res => {
          commit('SET_COMPANY_LIST', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    postCreateCompany({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        createCompany(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default center
