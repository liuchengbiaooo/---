const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, 
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  shadow : state => state.page.shadow,
  routerList: state => state.user.routerList,
  children:state => state.user.children,
  productList:state => state.user.productList,
  channel:  state => state.page.channel,
  administrator: state => state.page.administrator,
  pickerOptions:  state => state.dateSelection.pickerOptions
}
export default getters