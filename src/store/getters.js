const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  txList: state => state.rechargeWithdraw.txList,
  userList: state => state.rechargeWithdraw.userList,
  userInfo: state => state.rechargeWithdraw.userInfo,
  tokenConfig: state => state.rechargeWithdraw.tokenConfig,
  addressCount: state => state.rechargeWithdraw.addressCount
}
export default getters
