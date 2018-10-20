const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  adminList: state => state.center.adminList,
  companyList: state => state.center.companyList,
  copyList: state => state.center.copyList,
  rwList: state => state.center.rwList,
  addressList: state => state.center.addressList,
  addressData: state => state.center.addressData,
  statisticsTable: state => state.center.statisticsTable,
  allBalance: state => state.center.allBalance,
  allStatistics: state => state.center.allStatistics,
  permissionStr: state => state.center.permissionStr
}
export default getters
