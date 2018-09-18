import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import rechargeWithdraw from './modules/rechargeWithdraw'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    rechargeWithdraw
  },
  getters
})

export default store
