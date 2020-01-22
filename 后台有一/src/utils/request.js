import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0)'
    })
}

function endLoading() {
    loading.close()
}
let needLoadingRequestCount = 0

function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

// 创建axios实例
//var token = store.getters.token ;
const service = axios.create({
    baseURL: 'http://192.168.3.22/data-center-server/adminDataCenterServer/public/rpgmoba/',
    //baseURL: 'http://data.rpgmoba.com/rpgmoba',
    // baseURL: 'http://data.rpgmoba.com/rpgmoba', // api 的 base_url
    // baseURL: 'http://192.168.3.111/rpgmoba',
    //withCredentials: true,
    method: 'post',
    timeout: 60000, // 请求超时时间 60秒
    headers: {
        "Content-type": "application/json; charset=utf-8",
    }
})

// request拦截器
service.interceptors.request.use(

    config => {

        if (store.getters.token) {
            config.headers['Login-Token'] = store.getters.token // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        console.log(config)
        showFullScreenLoading();
        return config
    },
    error => {
        // Do something with request error

        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        tryHideFullScreenLoading();
        if (res.status !== 1) {
            const ref = response.data.info
            Message({
                message: ref,
                type: 'error',
                duration: 3 * 1000
            })

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.status === -1) { //|| res.status === -1
                MessageBox.confirm(
                    '你已被登出，可以取消继续留在该页面，或者重新登录',
                    '确定登出', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为 了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service