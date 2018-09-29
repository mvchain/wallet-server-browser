const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  adminList: state => state.center.adminList,
  companyList: state => state.center.companyList,
  rwList: state => state.center.rwList,
  addressList: state => state.center.addressList,
  addressData: state => state.center.addressData
}
export default getters
