import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import page from './modules/page'
import dateSelection from "./modules/dateSelection"


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    page,
    dateSelection
  },
  getters
})

export default store
