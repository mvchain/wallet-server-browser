import { adminList, createAdmin, deleteAdmin, modifyAdmin, managePermission, fee, totalBalance, putStatus, multipleAgree, collect, allCollect, Ajaxreserve, setReserve, putFee, withdrawManage, rechargeAddress } from '@/api/admin'
import { companyList, createCompany, rwAjax, addressAjax, addressInfo, modifyCompany, withdrawAjax, importSign, statisticsData } from '@/api/Home'
const center = {
  state: {
    adminList: {},
    companyList: {},
    rwList: {},
    addressList: {},
    addressData: {},
    statisticsTable: {},
    copyList: {},
    allBalance: [{ 'ETH': 0 }],
    allStatistics: {},
    permissionStr: ''
  },

  mutations: {
    SET_ADMIN_LIST: (state, payload) => {
      state.adminList = payload
    },
    SET_COMPANY_LIST: (state, payload) => {
      state.companyList = payload
    },
    SET_COPY_LIST: (state, payload) => {
      state.copyList = payload
    },
    SET_RECHARGE_LIST: (state, payload) => {
      state.rwList = payload
    },
    SET_ADDRESS_LIST: (state, payload) => {
      state.addressList = payload
    },
    SET_ADDRESS_DATA: (state, payload) => {
      state.addressData = payload
    },
    SET_STATISTICS_DATA: (state, payload) => {
      state.statisticsTable = payload
    },
    SET_ALL_BALANCE: (state, payload) => {
      state.allBalance = payload
    },
    SET_ALL_STATISTICS: (state, payload) => {
      state.allStatistics = payload
    },
    SET_PERMISSION_STR: (state, payload) => {
      state.permissionStr = payload
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
    getAddressList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        addressAjax(payload).then(res => {
          commit('SET_ADDRESS_LIST', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAddressData({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        addressInfo(payload).then(res => {
          commit('SET_ADDRESS_DATA', res.data)
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
    getManagePermission({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        managePermission(payload).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCompanyList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        companyList(payload).then(res => {
          commit('SET_COMPANY_LIST', res.data)
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCopyList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        companyList(payload).then(res => {
          resolve(res.data)
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
    postCreateCompany({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        createCompany(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putCreateCompany({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        modifyCompany(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getRWList({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        rwAjax(payload).then(res => {
          commit('SET_RECHARGE_LIST', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    postWithdraw({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        withdrawAjax(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getSign({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        importSign().then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getStatisticsData({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        statisticsData(payload).then(res => {
          commit('SET_STATISTICS_DATA', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getFeeData({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        fee().then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    putFeeData({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        putFee(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getTotalData({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        totalBalance(payload).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    putTransactionStatus({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        putStatus(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putMultipleAgree({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        multipleAgree(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCollect({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        collect(payload).then(res => {
          commit('SET_ALL_BALANCE', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getSatisticsCollect({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        allCollect(payload).then(res => {
          commit('SET_ALL_STATISTICS', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getReserved({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        Ajaxreserve(payload).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    putReserved({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        setReserve(payload).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getWithdrawManage({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        withdrawManage(payload).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getPermissionStr({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_PERMISSION_STR', payload)
      })
    },
    getRechargeAddress({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        rechargeAddress(payload).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default center
