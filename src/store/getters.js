const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  adminList: state => state.center.adminList
}
export default getters
