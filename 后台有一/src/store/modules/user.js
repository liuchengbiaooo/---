import { login, logout, getInfo } from '@/api/login'
import router from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutesTwo, asyncRoutes } from '@/router'
import { routerMatch } from '@/utils/jurisdiction'
import { allWatermark } from "@/utils/allWatermark";

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        routerList: [],
        children: [],
        productList: [],
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSION: (state, routerList) => {
            state.routerList = routerList
        },
        SET_MENU: (state, children) => {
            state.children = children
        },
        PRODUCT_LIST: (state, productList) => {
            state.productList = productList
        },
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()

            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    const data = response.info


                    setToken(data.token)
                    commit('SET_TOKEN', data.token)
                    resolve()
                }).catch((error) => {
                    console.log(error);
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo().then(response => {
                    const data = response.data

                    // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    //   commit('SET_ROLES', data.roles)
                    // } else {
                    //   reject('getInfo: roles must be a non-null array !')
                    // }
                    // commit('SET_NAME', data.name)
                    // commit('SET_AVATAR', data.avatar)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                    localStorage.removeItem('key');
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            }).catch(error => {
                reject(error)
            })
        },

        //列表
        async Permission({ commit }) {
            const result = await getInfo()
            let roles = result.info.auth
            let productList = result.info.appid_auth
            let name = result.info.account
            commit('SET_NAME', name)
            commit('PRODUCT_LIST', productList)

            commit('SET_ROLES', roles)

            // let watermarkOne = todayTime();
            // let watermarkTwo = name + " youyiwan";
            // Watermark.set(watermarkOne, watermarkTwo); //水印
            allWatermark();
            let routes = routerMatch(roles, asyncRoutes);

            let children = asyncRoutesTwo;

            children.unshift(...routes);
            commit('SET_MENU', children)

            let initialRoutes = router.options.routes;

            router.addRoutes(children)

            commit('SET_PERMISSION', [...initialRoutes, ...asyncRoutesTwo])

        }
    }


}

export default user